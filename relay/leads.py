"""Durable lead storage for the shared relay.

Until 13 Aug 2026 the relay was stateless: it took a submission, sent Tradd a text, and forgot
everything. That cost us twice over.

1. **We could not tell a lead from a bot.** The dashboard's Forms column counted the browser
   `form-submit` event, which fires before the relay decides anything — so blocked spam counted
   as a lead. 14 events turned out to be 3 of Tradd's own tests, 2 from one US bot number,
   4 blocked by Turnstile, and exactly ONE real enquiry.
2. **The content was gone.** The name, suburb and description of the job existed only in an SMS
   on one phone. Nothing could show a renter what they were being sent.

Every outcome is recorded here, not just the successes — a blocked bot is data about the
market, and the spam rate is worth watching.

⚠️ RULE: THIS MUST NEVER BREAK LEAD DELIVERY. Storage is strictly secondary to getting the
enquiry to a human. Every function swallows its own exceptions and returns rather than raising.
A lost row is an annoyance; a lost lead is the business.
"""
import json
import os
import sqlite3
import time
from pathlib import Path

DB_PATH = Path(os.getenv("LEADS_DB", "/app/data/leads.db"))

# outcome values
LEAD = "lead"            # reached a human
SPAM = "spam"            # _looks_automated() caught it
TURNSTILE = "turnstile"  # failed Cloudflare's check
FAILED = "failed"        # we tried to notify and could not

_SCHEMA = """
CREATE TABLE IF NOT EXISTS leads (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at  TEXT    NOT NULL,
    site_id     TEXT,
    domain      TEXT,
    channel     TEXT    NOT NULL,   -- web | phone | text
    outcome     TEXT    NOT NULL,   -- lead | spam | turnstile | failed
    name        TEXT,
    phone       TEXT,
    suburb      TEXT,
    service     TEXT,
    detail      TEXT,
    seconds     INTEGER,
    note        TEXT
);
CREATE INDEX IF NOT EXISTS leads_domain_created ON leads (domain, created_at);
CREATE INDEX IF NOT EXISTS leads_created ON leads (created_at);
"""

# ── Handover tracking ────────────────────────────────────────────────────────────────────
# Added 17 Aug 2026. The fleet's first genuine lead — Shay, Haigslea, passed to Lauchy at
# Hydrill Services on 10 Aug — was recoverable only from Tradd's Gmail. Nothing we built
# recorded who took it or what came of it, so the one number that matters (does a lead turn
# into money?) could not be answered at all.
#
# ⚠️ `disposition` is deliberately NOT the existing `outcome` column. `outcome` says whether
# the enquiry reached a human — lead/spam/turnstile/failed, decided by the relay in the same
# second. `disposition` says what the BUSINESS did with it afterwards, and it changes days
# later. Collapsing the two would make "delivered" and "won" the same field and destroy both.
NEW = "new"          # nobody has actioned it yet — the default for every stored lead
PASSED = "passed"    # handed to a renter, result unknown
QUOTED = "quoted"    # the renter quoted the job
WON = "won"          # the renter got the work — the only value that proves the model
LOST = "lost"        # the renter did not get it, or the caller went elsewhere
JUNK = "junk"        # not a real job (wrong trade, out of area, sales call)
DISPOSITIONS = (NEW, PASSED, QUOTED, WON, LOST, JUNK)

# Added by migration rather than in _SCHEMA, because CREATE TABLE IF NOT EXISTS does nothing
# to a table that already has rows — the live database predates these columns.
_ADDED_COLUMNS = (
    ("renter", "TEXT"),          # who it went to, free text: "Lauchy, Hydrill Services"
    ("renter_at", "TEXT"),       # when it was handed over, ISO-8601 UTC
    ("disposition", "TEXT"),     # one of DISPOSITIONS
    ("job_value", "INTEGER"),    # dollars, only meaningful once disposition == WON
    ("outcome_note", "TEXT"),    # anything worth remembering about how it went
)


def _migrate(con):
    """Add the handover columns to an existing database. Safe to run on every connect.

    SQLite has no ADD COLUMN IF NOT EXISTS, so the existing columns are read first. This is
    idempotent and cheap; doing it on connect means there is no separate migration step to
    forget on a relay that is deployed by rebuilding the container.
    """
    have = {r[1] for r in con.execute("PRAGMA table_info(leads)")}
    missing = [(n, t) for n, t in _ADDED_COLUMNS if n not in have]
    if not missing:
        return                    # the common path: read the schema, touch nothing, no lock

    for name, coltype in missing:
        con.execute(f"ALTER TABLE leads ADD COLUMN {name} {coltype}")
    if "disposition" not in have:
        # Every pre-existing row is untouched work, not an unknown state.
        con.execute("UPDATE leads SET disposition = ? WHERE disposition IS NULL", (NEW,))
    # ⚠️ COMMIT IS NOT OPTIONAL HERE. SQLite commits the ALTER TABLE statements implicitly but
    # NOT the UPDATE, so without this the backfill is rolled back when the connection closes —
    # the columns appear, every disposition stays NULL, and the write lock is held until then.
    # Both were real: caught on the first run against a production-shaped database.
    con.commit()


def _connect():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(DB_PATH, timeout=5)
    con.executescript(_SCHEMA)
    _migrate(con)
    return con


def record(channel, outcome, cfg=None, data=None, **extra):
    """Store one enquiry attempt. Never raises, never blocks delivery."""
    try:
        cfg, data = cfg or {}, data or {}
        row = {
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime()),
            "site_id": cfg.get("site_id") or extra.get("site_id"),
            "domain": cfg.get("domain"),
            "channel": channel,
            "outcome": outcome,
            "name": (data.get("name") or extra.get("name") or "")[:200] or None,
            "phone": (data.get("phone") or extra.get("phone") or "")[:40] or None,
            "suburb": (data.get("suburb") or extra.get("suburb") or "")[:200] or None,
            "service": (data.get("service") or extra.get("service") or "")[:200] or None,
            "detail": (data.get("detail") or extra.get("detail") or "")[:2000] or None,
            "seconds": extra.get("seconds"),
            "note": extra.get("note"),
            # Every new enquiry starts unactioned. Stored explicitly rather than left NULL so
            # "nobody has looked at this yet" is a state you can filter on, not an absence.
            "disposition": NEW,
        }
        with _connect() as con:
            con.execute(
                "INSERT INTO leads (created_at,site_id,domain,channel,outcome,name,phone,"
                "suburb,service,detail,seconds,note,disposition) VALUES (:created_at,:site_id,"
                ":domain,:channel,:outcome,:name,:phone,:suburb,:service,:detail,:seconds,"
                ":note,:disposition)", row)
    except Exception as exc:                                    # noqa: BLE001
        # Deliberately swallowed. See the module docstring: delivery outranks bookkeeping.
        print("LEAD STORE FAILED", repr(exc), flush=True)


def fetch(since=None, domain=None, limit=500):
    """Rows newest first. Returns [] on any failure rather than raising into a request."""
    try:
        sql = "SELECT * FROM leads"
        where, args = [], []
        if since:
            where.append("created_at >= ?")
            args.append(since)
        if domain:
            where.append("domain = ?")
            args.append(domain)
        if where:
            sql += " WHERE " + " AND ".join(where)
        sql += " ORDER BY created_at DESC LIMIT ?"
        args.append(int(limit))
        with _connect() as con:
            con.row_factory = sqlite3.Row
            return [dict(r) for r in con.execute(sql, args).fetchall()]
    except Exception as exc:                                    # noqa: BLE001
        print("LEAD FETCH FAILED", repr(exc), flush=True)
        return []


def counts(since=None):
    """{domain: {outcome: n}} — what the dashboard needs to count leads, not attempts."""
    try:
        sql = "SELECT domain, outcome, COUNT(*) n FROM leads"
        args = []
        if since:
            sql += " WHERE created_at >= ?"
            args.append(since)
        sql += " GROUP BY domain, outcome"
        out = {}
        with _connect() as con:
            for domain, outcome, n in con.execute(sql, args):
                out.setdefault(domain, {})[outcome] = n
        return out
    except Exception as exc:                                    # noqa: BLE001
        print("LEAD COUNTS FAILED", repr(exc), flush=True)
        return {}


def handover(lead_id, renter=None, disposition=None, job_value=None, note=None):
    """Record who a lead went to and what came of it. Returns the updated row, or None.

    Every field is optional and only what is supplied is written, so this serves both halves
    of the job: "passed to Lauchy today" now, "won, $3,400" three weeks later, without the
    second call erasing the first.

    ⚠️ Unlike everything else in this module, this one reports failure. The rest is
    bookkeeping that must never obstruct a lead; this is a deliberate write by a human who
    needs to know whether it landed. Silently swallowing it would recreate the exact problem
    it was built to solve — see the module docstring.
    """
    if disposition is not None and disposition not in DISPOSITIONS:
        raise ValueError(f"disposition must be one of {', '.join(DISPOSITIONS)}")

    sets, args = [], []
    if renter is not None:
        sets += ["renter = ?", "renter_at = ?"]
        args += [renter[:200], time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime())]
        # Naming a renter without saying more means the lead was handed over. Stating it
        # implicitly beats forcing two arguments for the common case.
        if disposition is None:
            disposition = PASSED
    if disposition is not None:
        sets.append("disposition = ?")
        args.append(disposition)
    if job_value is not None:
        sets.append("job_value = ?")
        args.append(int(job_value))
    if note is not None:
        sets.append("outcome_note = ?")
        args.append(note[:2000])
    if not sets:
        raise ValueError("nothing to update")

    args.append(int(lead_id))
    with _connect() as con:
        con.row_factory = sqlite3.Row
        cur = con.execute(f"UPDATE leads SET {', '.join(sets)} WHERE id = ?", args)
        if not cur.rowcount:
            return None                       # no such lead — the caller must be told
        row = con.execute("SELECT * FROM leads WHERE id = ?", (int(lead_id),)).fetchone()
        return dict(row) if row else None


def pipeline(since=None):
    """{disposition: n} — how many leads are sitting at each stage.

    The point of the whole feature: `new` is a work queue, and `won` divided by `passed` is
    the first honest conversion rate the fleet has ever been able to quote to a renter.
    """
    try:
        sql = "SELECT COALESCE(disposition, ?) d, COUNT(*) n FROM leads WHERE outcome = ?"
        args = [NEW, LEAD]
        if since:
            sql += " AND created_at >= ?"
            args.append(since)
        sql += " GROUP BY d"
        with _connect() as con:
            return {d: n for d, n in con.execute(sql, args)}
    except Exception as exc:                                    # noqa: BLE001
        print("LEAD PIPELINE FAILED", repr(exc), flush=True)
        return {}


def backfill_from_log(lines):
    """Recover past leads from the container log, which is all we kept before today.

    Only WEB/PHONE/TEXT LEAD and SPAM/TURNSTILE lines carry anything, and they hold just the
    domain and the phone — no name, no message. Marked with note='from log' so nobody mistakes
    a recovered stub for a full record.
    """
    seen = 0
    for line in lines:
        parts = line.split()
        if len(parts) < 3:
            continue
        if parts[0] == "WEB" and parts[1] == "LEAD":
            record("web", LEAD, {"domain": parts[2]}, {"phone": parts[-1]}, note="from log")
        elif parts[0] == "SPAM" and parts[1] == "BLOCKED":
            record("web", SPAM, {"domain": parts[2]}, {"phone": parts[-1]}, note="from log")
        elif parts[0] == "TURNSTILE" and parts[1] == "FAILED":
            record("web", TURNSTILE, {"domain": parts[2]}, {"phone": parts[-1]}, note="from log")
        else:
            continue
        seen += 1
    return seen
