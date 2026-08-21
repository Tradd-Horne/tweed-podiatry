"""Shared multi-tenant lead-relay for the rank-and-rent factory.

ONE service behind Traefik serves every site. Extends the original qualifier-only
relay with the two things the rank-and-rent model actually needs: FORWARDING to the
renter with a WHISPER, and call RECORDING.

Call flow (Twilio Voice webhook -> POST /api/voice):
    caller rings a site's tracking number
      -> RENTED?  recording notice -> Dial the renter -> whisper played to THEM only
                  -> call connects and records
                  -> no answer -> voicemail -> SMS alert
      -> UNRENTED? qualifier IVR (suburb + what they need) -> SMS to lead_to.
                   This IS the results-in-advance phase: you answer the leads
                   yourself until a renter is signed.

Site lookup is by the DIALLED number (Twilio's `To`), so every number can share one
webhook URL. Falls back to `?site=<id>` for backwards compatibility.

sites.json is bind-mounted and live-editable — adding or re-renting a site is a file
edit, no rebuild and no restart. Renting = set `forward_to`. Churn = set it to null.
That is the whole leverage of the model: you own the number, so switching buyers is
one line.

Env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN
     PUBLIC_BASE (optional) — https origin used for absolute Twilio callback URLs
"""
import html
import json
import os
import time
import urllib.parse
import urllib.request
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse, Response
from twilio.rest import Client

import leads

SITES_PATH = Path(os.getenv("SITES_PATH", "/app/sites.json"))
PUBLIC_BASE = os.getenv("PUBLIC_BASE", "").rstrip("/")
VOICE = "Polly.Olivia-Neural"          # en-AU neural
RING_SECONDS = 25                       # ring the renter this long before the qualifier
# ⚠️ Was 10, which is about two rings. Measured 13 Aug 2026: Tradd was missing forwarded
# calls on Rising Damp because his phone barely rang. It is worse from the caller's side —
# two rings and then a robot starts asking questions reads as being fobbed off, and the one
# caller we can trace hung up rather than answer it. 25s is ~6 rings: long enough to reach a
# phone, and long enough that the caller feels the call was genuinely attempted first.
# ⚠️ MUST stay below the answerer's own carrier voicemail delay. Tradd's is 22s, so at 22
# the carrier could answer first — Twilio would score that as 'completed' and hand the
# caller to his PERSONAL greeting, which names him rather than the site. 10s is safe.
DEFAULT_WHISPER = "This lead was sent to you by Tradd."

app = FastAPI(title="rank-rent lead-relay", docs_url=None, redoc_url=None, openapi_url=None)

# CallSids that already produced a lead notification, so the end-of-call status
# callback doesn't double-report them. Bounded; losing it on restart at worst causes
# a duplicate alert, never a missed one.
_handled: set = set()


_recording: set = set()


def mark_handled(call_sid: str) -> None:
    if not call_sid:
        return
    if len(_handled) > 5000:
        _handled.clear()
    _handled.add(call_sid)


# --------------------------------------------------------------------- config
def load_sites() -> dict:
    try:
        return json.loads(SITES_PATH.read_text())
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def site_or_404(site_id: str) -> dict:
    cfg = load_sites().get(site_id)
    if not cfg:
        raise HTTPException(status_code=404, detail=f"unknown site '{site_id}'")
    return cfg


def find_by_number(number: str):
    """Match the dialled number to a site. Returns (site_id, cfg) or (None, None)."""
    if not number:
        return None, None
    want = number.strip()
    for sid, cfg in load_sites().items():
        if want in {(cfg.get("tracking_number") or "").strip(),
                    (cfg.get("twilio_from") or "").strip()}:
            return sid, cfg
    return None, None


# ------------------------------------------------------------------- plumbing
def twilio_client() -> Client:
    return Client(os.environ["TWILIO_ACCOUNT_SID"], os.environ["TWILIO_AUTH_TOKEN"])


def send_sms(to: str, frm: str, body: str) -> str:
    return twilio_client().messages.create(to=to, from_=frm, body=body[:1500]).sid


def notify(cfg: dict, body: str) -> None:
    """Send an operational SMS.

    ⚠️ KEEP BODIES GSM-7 ONLY — no emoji, no em-dashes, no smart quotes. A single
    non-GSM character forces the whole message into UCS-2, which cuts capacity from 160
    characters per segment to 70 and triples the cost. Measured 7 Aug 2026: the same
    136-character lead alert was 3 segments ($0.1545) with an emoji and 1 segment
    ($0.0515) without. Use a plain hyphen, not an em-dash.
    """
    """Tell the owner something happened. Never let an SMS failure break a call."""
    try:
        if cfg.get("lead_to") and cfg.get("twilio_from"):
            send_sms(cfg["lead_to"], cfg["twilio_from"], body)
    except Exception as exc:                                    # noqa: BLE001
        print("SMS FAILED", repr(exc), flush=True)


def start_recording(call_sid: str, site_id: str) -> None:
    """Record the qualifier call. TwiML has no whole-call record verb — <Record> only
    captures a voicemail-style message — so recording is started against the live call
    via REST.

    TIMING MATTERS: this cannot be called from the FIRST webhook. At that point Twilio
    has not yet answered the call, so the REST API rejects it with 21220 "not eligible
    for recording". It has to run from a later webhook, once the call is in-progress.
    Never let a recording failure break the call."""
    if not call_sid or call_sid in _recording:
        return
    try:
        twilio_client().calls(call_sid).recordings.create(
            recording_channels="dual",
            recording_status_callback=cb(f"/api/recording?site={urllib.parse.quote(site_id)}"),
            recording_status_callback_method="POST",
            recording_status_callback_event=["completed"],
        )
        if len(_recording) > 5000:
            _recording.clear()
        _recording.add(call_sid)          # only on success, so later webhooks can retry
        print("RECORDING STARTED", call_sid, site_id, flush=True)
    except Exception as exc:                                    # noqa: BLE001
        print("RECORDING START FAILED", repr(exc), flush=True)


def xml(twiml: str) -> Response:
    return Response(content='<?xml version="1.0" encoding="UTF-8"?>' + twiml,
                    media_type="application/xml")


def sx(s) -> str:
    return html.escape(str(s or ""), quote=True)


def cb(path: str) -> str:
    """Absolute callback URL when PUBLIC_BASE is set, relative otherwise."""
    return f"{PUBLIC_BASE}{path}" if PUBLIC_BASE else path


async def form_of(req: Request) -> dict:
    raw = (await req.body()).decode("utf-8", "ignore")
    return {k: (v[0] if v else "")
            for k, v in urllib.parse.parse_qs(raw, keep_blank_values=True).items()}


# ----------------------------------------------------------------- web leads
# ---------------------------------------------------------------- spam guard
# Added 7 Aug 2026. Before this there was NOTHING on /api/lead — no captcha, no honeypot,
# no rate limiting — and 13 of the 23 submissions ever received were spam.
#
# Cloudflare Turnstile does the real work: it stops bots BEFORE they submit, so there is no
# downstream filtering and therefore no risk of rejecting a genuine lead. Tradd's call, and the
# right one — an earlier proposal of mine filtered on phone-number shape, which would have let
# through both of the scam SMS we later found and could have dropped a real customer's typo.
#
# The honeypot and timing check are kept only as free extras. They can only ever catch a
# submission that already looks automated.
TURNSTILE_VERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify"


def _turnstile_ok(secret, token, ip):
    """True if Cloudflare says the token is good. Fails OPEN on network trouble.

    Deliberate: if Cloudflare is unreachable we would rather admit a spam submission than
    silently drop a real lead. A lost lead is unrecoverable; spam is merely annoying.
    """
    if not secret:
        return True                      # site has no key configured yet
    if not token:
        return False
    body = urllib.parse.urlencode({"secret": secret, "response": token,
                                   "remoteip": ip or ""}).encode()
    try:
        req = urllib.request.Request(TURNSTILE_VERIFY, data=body)
        with urllib.request.urlopen(req, timeout=6) as r:
            return bool(json.load(r).get("success"))
    except Exception as exc:                                    # noqa: BLE001
        print("TURNSTILE UNREACHABLE, allowing through:", exc, flush=True)
        return True


def _looks_automated(data):
    """(True, reason) only for things a human cannot do."""
    if (data.get("website") or "").strip():
        return True, "honeypot field completed"
    try:
        started = float(data.get("t") or 0)
    except (TypeError, ValueError):
        started = 0
    if started and (time.time() - started) < 3:
        return True, "submitted in under 3 seconds"
    return False, ""


@app.post("/api/lead")
async def lead(request: Request):
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="bad payload")

    site_id = (data.get("site") or "").strip()
    if site_id:
        cfg = site_or_404(site_id)
    else:
        # Sites post their own domain as `source`; match on that.
        source = (data.get("source") or "").strip().lower()
        cfg = next((c for c in load_sites().values()
                    if (c.get("domain") or "").lower() == source), None)
        if not cfg:
            raise HTTPException(status_code=404, detail="unknown site")

    if not (data.get("phone") or "").strip():
        raise HTTPException(status_code=422, detail="phone is required")

    automated, why = _looks_automated(data)
    if automated:
        print("SPAM BLOCKED", cfg.get("domain"), why, data.get("phone"), flush=True)
        leads.record("web", leads.SPAM, cfg, data, note=why)
        # 200 on purpose: a bot that sees an error retries, one that sees success moves on.
        return JSONResponse({"ok": True})

    client_ip = (request.headers.get("cf-connecting-ip")
                 or (request.client.host if request.client else ""))
    if not _turnstile_ok(cfg.get("turnstile_secret"), data.get("cf-turnstile-response"), client_ip):
        print("TURNSTILE FAILED", cfg.get("domain"), data.get("phone"), flush=True)
        leads.record("web", leads.TURNSTILE, cfg, data)
        return JSONResponse({"ok": True})

    body = (
        f"New lead - {cfg['display_name']} (web form)\n"
        f"Name: {data.get('name') or '-'}\n"
        f"Phone: {data.get('phone')}\n"
        f"Suburb: {data.get('suburb') or '-'}\n"
        f"Service: {data.get('service') or '-'}\n"
        f"Detail: {data.get('detail') or '-'}"
    )
    to = cfg.get("forward_to") or cfg.get("lead_to")
    try:
        sid = send_sms(to, cfg["twilio_from"], body)
    except Exception as exc:                                    # noqa: BLE001
        # Store it even though the text failed — the enquiry is real and would otherwise
        # vanish entirely. This is the one case where the record is all that survives.
        leads.record("web", leads.FAILED, cfg, data, note=str(exc)[:200])
        raise HTTPException(status_code=502, detail=f"sms failed: {exc}")
    # On the fleet, forward_to is the renter and lead_to is the owner, so the copy keeps
    # the owner in the loop. This practice is its own renter: both fields are the same
    # phone, and sending the copy would text the same person the same lead twice.
    if cfg.get("forward_to") and cfg.get("lead_to") and cfg["forward_to"] != cfg["lead_to"]:
        notify(cfg, f"(copy) {body}")
    print("WEB LEAD", cfg.get("domain"), data.get("phone"), flush=True)
    leads.record("web", leads.LEAD, cfg, data)
    return JSONResponse({"ok": True, "sid": sid})


# -------------------------------------------------------------- inbound call
@app.post("/api/voice")
async def voice(request: Request):
    form = await form_of(request)
    dialled = (form.get("To") or "").strip()
    caller = (form.get("From") or "").strip()

    site_id, cfg = find_by_number(dialled)
    if not cfg:
        site_id = (request.query_params.get("site") or "").strip()
        cfg = load_sites().get(site_id) if site_id else None

    if not cfg:
        # Never drop a call silently, even for an unconfigured number.
        print("UNROUTED CALL", dialled, caller, flush=True)
        return xml(
            "<Response>"
            f'<Say voice="{VOICE}">Thanks for calling. Please leave your name, number and a '
            "short message after the tone.</Say>"
            '<Record maxLength="120" playBeep="true"/>'
            "<Hangup/>"
            "</Response>"
        )

    q = urllib.parse.urlencode({"site": site_id})
    forward_to = (cfg.get("forward_to") or "").strip()

    if forward_to:
        recording = bool(cfg.get("record", True))
        # ⚠️ Australian law (e.g. NSW Surveillance Devices Act 2007) generally requires
        # parties to a private conversation to know it is being recorded. Announce it.
        notice = (f'<Say voice="{VOICE}">Just so you know, this call may be recorded. '
                  "Connecting you now.</Say>") if recording else ""
        rec_attr = 'record="record-from-answer-dual" ' if recording else ""
        return xml(
            "<Response>"
            + notice +
            f'<Dial timeout="{RING_SECONDS}" callerId="{sx(caller)}" {rec_attr}'
            f'action="{sx(cb("/api/voice/after?" + q))}" method="POST" '
            f'recordingStatusCallback="{sx(cb("/api/recording?" + q))}" '
            'recordingStatusCallbackMethod="POST">'
            f'<Number url="{sx(cb("/api/whisper?" + q))}" method="POST">{sx(forward_to)}</Number>'
            "</Dial>"
            "</Response>"
        )

    # Unrented — qualify the lead ourselves. Three questions is the practical limit
    # before people hang up: name, suburb, job.
    # Recording starts on the NEXT webhook — see start_recording() for why it cannot
    # happen here. The notice still plays first, so the caller is told before any
    # audio is captured, which is the right order for consent anyway.
    notice = ("Just so you know, this call is recorded. "
              if cfg.get("record", True) else "")
    return xml(
        "<Response>"
        f'<Gather input="speech" language="en-AU" speechTimeout="auto" '
        f'action="{sx(cb("/api/voice/name?" + q))}" method="POST">'
        f'<Say voice="{VOICE}">Thanks for calling {sx(cfg["display_name"])}. '
        f"{notice}"
        "So we can get the right person out to you, just three quick questions. "
        "First: can I grab your name?</Say>"
        "</Gather>"
        f'<Say voice="{VOICE}">Sorry, we did not catch that.</Say>'
        f'<Redirect method="POST">{sx(cb("/api/voice?" + q))}</Redirect>'
        "</Response>"
    )


@app.api_route("/api/whisper", methods=["GET", "POST"])
async def whisper(request: Request):
    """TwiML here is heard by the ANSWERING party only — the renter. The caller
    hears ringing throughout, then the two are connected."""
    cfg = load_sites().get((request.query_params.get("site") or "").strip()) or {}
    msg = cfg.get("whisper") or DEFAULT_WHISPER
    return xml(f'<Response><Say voice="{VOICE}">{sx(msg)}</Say></Response>')


@app.post("/api/voice/after")
async def voice_after(request: Request):
    """After the dial attempt: confirm the connection, or take a message."""
    form = await form_of(request)
    site_id = (request.query_params.get("site") or "").strip()
    cfg = load_sites().get(site_id) or {}
    status = (form.get("DialCallStatus") or "").strip()
    caller = (form.get("From") or "").strip()
    secs = (form.get("DialCallDuration") or "0").strip()
    name = cfg.get("display_name") or site_id or "site"

    mark_handled((form.get("CallSid") or "").strip())
    if status == "completed":
        notify(cfg, f"CALL CONNECTED - {name}\nFrom: {caller}\nTalk time: {secs}s")
        print("CALL CONNECTED", site_id, caller, secs, flush=True)
        return xml("<Response><Hangup/></Response>")

    notify(cfg, f"MISSED CALL - {name}\nFrom: {caller}\nStatus: {status or 'unknown'}\n"
                "Caller sent to the qualifier, details to follow.")
    print("CALL MISSED", site_id, caller, status, flush=True)
    q = urllib.parse.urlencode({"site": site_id})
    # Hand them to the SAME qualifier an unrented site uses (name -> suburb -> what they need),
    # which texts the answers through. A structured lead beats a voicemail nobody plays back.
    # No recording notice here: they already heard it before the dial attempt.
    return xml(
        "<Response>"
        f'<Gather input="speech" language="en-AU" speechTimeout="auto" '
        f'action="{sx(cb("/api/voice/name?" + q))}" method="POST">'
        f'<Say voice="{VOICE}">Sorry, nobody is free to take the call right now. '
        "So we can get the right person back to you, just three quick questions. "
        "First: can I grab your name?</Say>"
        "</Gather>"
        f'<Say voice="{VOICE}">Sorry, we did not catch that.</Say>'
        f'<Redirect method="POST">{sx(cb("/api/voice/name?" + q))}</Redirect>'
        "</Response>"
    )


@app.post("/api/recording")
async def recording(request: Request):
    """Every call leaves a receipt — these recordings are what you show a prospect
    when you tell them the site produced N calls last month."""
    form = await form_of(request)
    site_id = (request.query_params.get("site") or "").strip()
    cfg = load_sites().get(site_id) or {}
    url = (form.get("RecordingUrl") or "").strip()
    secs = (form.get("RecordingDuration") or "?").strip()
    if url:
        notify(cfg, f"Recording - {cfg.get('display_name') or site_id}\n{secs}s\n{url}.mp3")
        print("RECORDING", site_id, secs, url, flush=True)
    return Response(status_code=204)


# ------------------------------------------------- unrented qualifier fallback
@app.post("/api/voice/name")
async def voice_name(request: Request):
    form = await form_of(request)
    site_id = (request.query_params.get("site") or "").strip()
    cfg = load_sites().get(site_id) or {}
    if cfg.get("record", True):
        start_recording((form.get("CallSid") or "").strip(), site_id)
    caller_name = (form.get("SpeechResult") or "").strip()[:60]
    # Deliberately not read back to the caller — speech-to-text mangles names often
    # enough that repeating it sounds worse than staying quiet.
    q = urllib.parse.urlencode({"site": site_id, "name": caller_name})
    return xml(
        "<Response>"
        f'<Gather input="speech" language="en-AU" speechTimeout="auto" '
        f'action="{sx(cb("/api/voice/suburb?" + q))}" method="POST">'
        f'<Say voice="{VOICE}">Thanks. And what suburb is the property in?</Say>'
        "</Gather>"
        f'<Say voice="{VOICE}">Sorry, we did not catch that.</Say>'
        f'<Redirect method="POST">{sx(cb("/api/voice/suburb?" + q))}</Redirect>'
        "</Response>"
    )


@app.post("/api/voice/suburb")
async def voice_suburb(request: Request):
    form = await form_of(request)
    site_id = (request.query_params.get("site") or "").strip()
    cfg = load_sites().get(site_id) or {}
    if cfg.get("record", True):
        start_recording((form.get("CallSid") or "").strip(), site_id)
    caller_name = (request.query_params.get("name") or "").strip()[:60]
    suburb = (form.get("SpeechResult") or "").strip()[:60]
    q = urllib.parse.urlencode({"site": site_id, "name": caller_name, "suburb": suburb})
    return xml(
        "<Response>"
        f'<Gather input="speech" language="en-AU" speechTimeout="auto" '
        f'action="{sx(cb("/api/voice/detail?" + q))}" method="POST">'
        f'<Say voice="{VOICE}">Got it. And briefly, what do you need done?</Say>'
        "</Gather>"
        f'<Say voice="{VOICE}">Sorry, we did not catch that.</Say>'
        f'<Redirect method="POST">{sx(cb("/api/voice/detail?" + q))}</Redirect>'
        "</Response>"
    )


@app.post("/api/voice/detail")
async def voice_detail(request: Request):
    form = await form_of(request)
    site_id = (request.query_params.get("site") or "").strip()
    cfg = load_sites().get(site_id) or {}
    call_sid = (form.get("CallSid") or "").strip()
    if cfg.get("record", True):
        start_recording(call_sid, site_id)
    caller = (form.get("From") or "").strip()[:30]
    caller_name = (request.query_params.get("name") or "").strip()[:60]
    suburb = (request.query_params.get("suburb") or "").strip()[:60]
    detail = (form.get("SpeechResult") or "").strip()[:300]

    mark_handled(call_sid)
    if caller and call_sid:
        notify(cfg, f"PHONE LEAD - {cfg.get('display_name') or site_id}\n"
                    f"Name: {caller_name or '(not given)'}\n"
                    f"Phone: {caller}\n"
                    f"Suburb: {suburb or '(not given)'}\n"
                    f"Needs: {detail or '(not given)'}")
        print("PHONE LEAD", site_id, caller, flush=True)
        # The IVR has already collected these, so a phone lead stores as richly as a form one.
        leads.record("phone", leads.LEAD, cfg, None, site_id=site_id, phone=caller,
                     name=caller_name, suburb=suburb, detail=detail)
    return xml(
        "<Response>"
        f'<Say voice="{VOICE}">Thank you. Someone will call you back shortly. Goodbye.</Say>'
        "<Hangup/>"
        "</Response>"
    )


@app.post("/api/call-status")
async def call_status(request: Request):
    """Fires when a call ends, whatever happened during it. Someone who rings and
    hangs up part-way through the questions is still a real person with a real
    number — without this they would vanish, since every other notification only
    fires once the caller reaches the end of a flow."""
    form = await form_of(request)
    if (form.get("CallStatus") or "").strip() not in {"completed", "no-answer", "busy", "failed"}:
        return Response(status_code=204)

    call_sid = (form.get("CallSid") or "").strip()
    if call_sid in _handled:
        return Response(status_code=204)          # already reported as a lead

    dialled = (form.get("To") or "").strip()
    _, cfg = find_by_number(dialled)
    if not cfg:
        return Response(status_code=204)

    caller = (form.get("From") or "").strip()
    secs = (form.get("CallDuration") or "0").strip()
    mark_handled(call_sid)
    notify(cfg, f"ABANDONED CALL - {cfg.get('display_name')}\n"
                f"From: {caller}\n"
                f"Lasted: {secs}s\n"
                f"They hung up before finishing. Worth calling back.")
    print("ABANDONED CALL", dialled, caller, secs, flush=True)
    return Response(status_code=204)


# -------------------------------------------------------------- inbound SMS
@app.post("/api/sms")
async def sms(request: Request):
    """Someone texted a tracking number. Without this the message just sits in the
    Twilio log and nobody ever sees it — a silently lost lead."""
    form = await form_of(request)
    dialled = (form.get("To") or "").strip()
    sender = (form.get("From") or "").strip()
    body = (form.get("Body") or "").strip()

    site_id, cfg = find_by_number(dialled)
    if not cfg:
        print("UNROUTED SMS", dialled, sender, flush=True)
        return xml("<Response/>")

    name = cfg.get("display_name") or site_id
    text = (f"TEXT LEAD - {name}\n"
            f"From: {sender}\n"
            f"Message: {body[:600] or '(empty)'}")

    # Rented sites: the renter gets it, owner keeps a copy. Unrented: owner only.
    to = cfg.get("forward_to") or cfg.get("lead_to")
    try:
        if to:
            send_sms(to, cfg["twilio_from"], text)
        if (cfg.get("forward_to") and cfg.get("lead_to")
                and cfg["forward_to"] != cfg["lead_to"]):
            send_sms(cfg["lead_to"], cfg["twilio_from"], f"(copy) {text}")
    except Exception as exc:                                    # noqa: BLE001
        print("SMS FORWARD FAILED", repr(exc), flush=True)

    print("TEXT LEAD", site_id, sender, flush=True)
    leads.record("text", leads.LEAD, cfg, None, site_id=site_id, phone=sender, detail=text)
    # Acknowledge the sender so they know a human will follow up.
    return xml(
        "<Response><Message>Thanks, we've got your message and someone will be in "
        "touch shortly. If it's urgent, please call us.</Message></Response>"
    )


@app.get("/api/leads")
def leads_read(request: Request, since: str = "", domain: str = "", limit: int = 500):
    """Stored enquiries, newest first. Token-gated — this is customer PII.

    Read by the tradd.net analysis dashboard. The token lives in LEADS_TOKEN; with it unset the
    endpoint refuses everything rather than defaulting open, because failing closed on an
    unconfigured secret is the only safe default for a route that returns names and numbers.
    """
    if not _leads_token_ok(request):
        raise HTTPException(status_code=403, detail="forbidden")
    return JSONResponse({"leads": leads.fetch(since or None, domain or None, limit),
                         "counts": leads.counts(since or None)})


async def _json_or_form(req: Request) -> dict:
    """Parse a JSON body, falling back to form-encoded.

    `form_of` is form-only and Twilio depends on that, so it is left alone. This endpoint is
    called by hand and by tooling, where JSON is the natural thing to send — and a JSON body
    run through a form parser does not error, it silently yields one nonsense key. That is
    exactly the kind of quiet wrong answer this codebase keeps getting bitten by.
    """
    raw = (await req.body()).decode("utf-8", "ignore").strip()
    if raw.startswith("{"):
        try:
            parsed = json.loads(raw)
            if isinstance(parsed, dict):
                return {k: ("" if v is None else v) for k, v in parsed.items()}
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=f"bad JSON: {exc}") from exc
    return {k: (v[0] if v else "")
            for k, v in urllib.parse.parse_qs(raw, keep_blank_values=True).items()}


def _leads_token_ok(request: Request) -> bool:
    """Same gate as /api/leads: fail closed when LEADS_TOKEN is unset."""
    want = os.getenv("LEADS_TOKEN", "")
    got = request.headers.get("x-leads-token") or request.query_params.get("token") or ""
    return bool(want) and got == want


@app.post("/api/leads/{lead_id}/handover")
async def leads_handover(lead_id: int, request: Request):
    """Record who a lead was passed to and what came of it.

    Why this exists: the fleet's first real lead — Shay at Haigslea, passed to Lauchy at
    Hydrill Services on 10 Aug 2026 — left no trace in anything we built. It was recovered
    from Tradd's Gmail. Until a handover is recorded, the fleet cannot answer whether a lead
    ever becomes money, which is the only number a renter actually cares about.

    Body (all optional, but at least one required):
        renter       "Lauchy, Hydrill Services"   — also implies disposition=passed
        disposition  new|passed|quoted|won|lost|junk
        job_value    dollars, once it is won
        note         anything worth remembering

    Token-gated like /api/leads — it reads back customer PII in the response.
    """
    if not _leads_token_ok(request):
        raise HTTPException(status_code=403, detail="forbidden")
    body = await _json_or_form(request)
    try:
        row = leads.handover(
            lead_id,
            renter=body.get("renter") or None,
            disposition=body.get("disposition") or None,
            job_value=body.get("job_value") or None,
            note=body.get("note") or None,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if row is None:
        raise HTTPException(status_code=404, detail=f"no lead with id {lead_id}")
    print("LEAD HANDOVER", lead_id, row.get("domain"), row.get("disposition"),
          row.get("renter") or "-", flush=True)
    return JSONResponse({"lead": row})


@app.get("/api/leads/pipeline")
def leads_pipeline(request: Request, since: str = ""):
    """{disposition: count} across delivered leads — the work queue and the conversion rate."""
    if not _leads_token_ok(request):
        raise HTTPException(status_code=403, detail="forbidden")
    return JSONResponse({"pipeline": leads.pipeline(since or None)})


@app.get("/api/health")
def health():
    sites = load_sites()
    return {
        "status": "ok",
        "sites_configured": len(sites),
        "rented": sum(1 for c in sites.values() if c.get("forward_to")),
    }
