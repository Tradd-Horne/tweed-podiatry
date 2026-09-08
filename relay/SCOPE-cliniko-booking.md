# Scope — connecting the phone agent to Cliniko

Written 8 September 2026 by `rankrent2`, at Tradd's request. **This is a scope, not a build.**
Nothing here is implemented and nothing here is approved.

Tradd, 8 Sep 2026: *"we'll look to connect our customer booking system as well... I'm pretty
sure we'll be able to use Clinico's API to book appointments, move appointments, and that sort
of thing. We're even looking at integrating calls for appointment reminders, but we're just
scoping that so far. First of all, just use it as an interactive voicemail recording."*

The interactive voicemail is DONE and live — see `CHANGE-2026-09-08-ai-agent-on-missed-calls.md`.
This document covers what comes after it.

---

## 1. The thing worth knowing first: most of this is already built

`~/projects/au-cliniko-mcp` is Tradd's own Cliniko MCP. 39 tools, 14 modules, pre-alpha but
working. It already solves the parts that are tedious and easy to get wrong:

| Already built | Where | Why it matters here |
|:--|:--|:--|
| API key parsing + **shard detection** | `auth.py` | A Cliniko key carries its shard after the last hyphen (`…~au1`). Reference implementations in the wild silently default to `au1` and break other tenants. This module fails loud instead. |
| Authenticated async client | `client.py` | HTTP Basic, key as username, blank password. Retries, error shaping. |
| `list_available_times` | `tools/available_time.py` | Reads open slots. **Read-only today.** |
| `list_appointments`, `get_appointment` | `tools/appointments.py` | Read side of the diary. |
| Patient CRUD | `tools/patients.py` | Match a caller to a patient record. |
| Audit log, PHI decorator, encrypted vault | `audit.py`, `phi.py`, `vault.py` | The compliance layer a health integration needs and usually lacks. |

**So the build is not "integrate Cliniko". It is "let the phone agent reach code that already
talks to Cliniko", plus one endpoint nobody has written yet.**

### The one real gap
There is **no appointment-create tool**. `tools/appointments.py` is list and get only. Its own
header already carries the finding that matters: Cliniko's `individual_appointments` POST uses
`starts_at`, and **Cliniko's published docs are wrong** — they say `appointment_start` /
`appointment_end`. That gotcha is worth more than it looks; it is the kind of thing that costs
an afternoon.

---

## 2. The architecture problem

These three things do not live together:

| Thing | Where it runs |
|:--|:--|
| The phone agent | `tweedpodiatry-relay` container, `170.64.202.90` |
| `au-cliniko-mcp` | A local Python project. It is an **MCP server**, spoken to over stdio by an MCP client. |
| Cliniko | Cliniko's own API, `api.<shard>.cliniko.com` |

An MCP server is the wrong shape for this. MCP exists so a *model in a chat session* can call
tools. The relay is not a chat session — it is a websocket handler that must answer a caller in
under a second. Wrapping the relay in an MCP client to reach a stdio server, so that server can
make one HTTPS call, adds a process boundary and a protocol for nothing.

### Three options

**A. Relay calls Cliniko directly.** Copy the auth + client pattern into the relay.
*Fast, no new service. But it forks the code — and the shard-detection bug this project exists
to avoid is exactly the kind that gets reintroduced by a copy.* ❌

**B. Extract a shared package.** Pull `auth.py` + `client.py` + a thin `booking.py` out of
`au-cliniko-mcp` into a small library both the MCP server and the relay import.
*One implementation of the risky parts. The MCP keeps its tools, the relay gets a function
call. Needs the package installable into the relay image — it is already a `pyproject.toml`
project, so this is packaging work, not design work.* ✅ **Recommended.**

**C. Stand up a booking microservice.** An HTTP service in front of Cliniko that both consume.
*Cleanest separation and the right answer at ten clinics. Today it is one clinic and one phone
line, so it is a third box to run, monitor and secure for no benefit yet.* ⏳ Later.

**Recommendation: B.** It is the only one that does not duplicate the shard logic, and it does
not commit us to running anything new.

---

## 3. The hard constraint nobody expects: latency

A caller will tolerate about **one second** of silence. Longer and they say "hello?".

Cliniko's `/available_times` needs `practitioner_id`, `business_id`, `appointment_type_id` and a
date range. A live call to it mid-conversation costs a network round trip to Cliniko plus our
own handling, on top of the model's own generation time. That is too slow to do while the
caller waits.

**This is solvable, and Mondays make it easy.** Home visits run Mondays only. The set of
bookable slots is small and changes slowly.

- **Poll `/available_times` on a timer** — every few minutes, for the next four Mondays — and
  hold the result in memory in the relay.
- The agent reads the cache. It never waits on Cliniko to say what is free.
- Only the WRITE goes to Cliniko live, and only after the caller has agreed to a time.

A stale cache means offering a slot that has just gone. That is a real failure and it is why
section 5 exists.

---

## 4. What the call would actually look like

Today's flow, unchanged, up to the point marked NEW:

1. Caller rings. It rings Tradd's phone first. He presses 1 to take it.
2. He does not answer. The AI takes the call.
3. It asks street address, what suits, referral or funding, urgency, name.
4. **NEW:** it offers two or three real Monday slots from the cache.
5. Caller picks one.
6. **NEW:** the relay writes the appointment to Cliniko and reads the time back to confirm.
7. **NEW:** an SMS confirmation goes to the caller, and to Tradd.

### What must NOT happen at step 6
- **Never say "you're booked" before the write returns.** Say it after, and say the actual time
  Cliniko gave back — not the time the caller asked for. If the write fails, the honest line is
  that Tradd will ring to confirm, and the lead is stored as it is today.
- **Never let the model compose the appointment payload.** It picks a slot id from the cache;
  code builds the request. A model that invents a `starts_at` will eventually invent a wrong one.
- **Never create a patient record from a name heard over the phone alone.** See section 6.

---

## 5. Where this goes wrong, and what to do about it

| Failure | Consequence | Mitigation |
|:--|:--|:--|
| Cache is stale, slot already taken | Double booking in a real diary | Write is the source of truth. On rejection, apologise, re-read the cache, offer again. Never retry silently. |
| Caller is not the patient | Appointment under the wrong name — a daughter ringing for her mother is the COMMON case, not the edge case | Ask explicitly who the appointment is for. The 8 Sep test call was exactly this. |
| Caller mentions a wound | An ulcer or a black toe gets a home visit instead of a hospital clinic | **The existing wound rule outranks booking.** It must run BEFORE any slot is offered, and it must be able to end the booking path. This is the single highest-consequence rule in the file. |
| Model hallucinates a time | Patient turns up on a day nobody is coming | Slots come from the cache by id. The model never says a time that did not come from Cliniko. |
| Twilio hangs up mid-write | Appointment created, caller never told | Write is idempotent on a call-scoped key, and the SMS confirmation is what closes the loop, not the spoken word. |
| Cliniko is down | Every caller hits a dead end | Fall back to exactly today's behaviour: take the details, say Tradd will ring back. **The booking layer must be optional at runtime**, the same way the agent already degrades when the model key is missing. |

---

## 6. PHI, and why this is not a tree-lopping site

A tree job leaks nothing. A podiatry call is health information the moment someone says why
they are ringing, and the Privacy Act 1988 treats it accordingly.

- **The relay already gets this right and must keep getting it right:** `record` is `false` for
  this site. There is no call audio. The written summary is the only record, deliberately.
- **Patient creation is the line to be careful at.** Creating a Cliniko patient from a phone
  call means writing a health record from a name heard once over a phone. Recommended:
  **match only, never create.** If the caller matches an existing patient by phone number, book
  them. If they do not, take the details and let Tradd create the record — he is doing the
  first visit anyway.
- **`au-cliniko-mcp` already has an audit log and a `@phi_flagged` decorator.** Whatever the
  relay calls must go through them, not around them. That is another argument for option B.
- **Consent to be booked by a machine.** The agent already says it is an automated assistant.
  Before it writes anything it should say so plainly — something like "I can hold Monday the
  14th at 9 for you" — so the caller knows a machine is making the booking.

---

## 7. Appointment reminders — a different animal

Tradd raised this as "we're just scoping". It should be scoped separately, because it is
**outbound**, and outbound changes the legal picture:

- Inbound is easy: they rang us.
- Outbound calling and SMS is covered by the Spam Act 2003 and the Do Not Call Register Act
  2006. A genuine appointment reminder to an existing patient is generally fine, but consent
  and an opt-out are not optional, and "generally fine" is not the standard to build on.
- **SMS reminders before voice reminders.** Cheaper, silent, no answering-machine problem, and
  people prefer them. Cliniko already sends appointment reminders itself — the first question
  is whether this needs building at all.

**Recommendation: do not build voice reminders. Check what Cliniko's own reminders already do
first.** If they are enough, this whole item disappears.

---

## 8. Suggested phases

| Phase | What | Gate |
|:--|:--|:--|
| 0 | Read-only. The agent says "Tradd has Monday the 14th free" but still takes details and rings back. Proves the cache and the IDs are right, with **zero write risk**. | Nothing is written to the diary. |
| 1 | Extract the shared package (option B). No behaviour change. | Tests pass, MCP unchanged. |
| 2 | Write an appointment-create tool in `au-cliniko-mcp`, against a Cliniko **test** account. Note the `starts_at` gotcha. | Never pointed at the live diary. |
| 3 | Booking live, capped. One appointment type, Mondays, existing patients only, and a daily cap so a bug cannot fill a week. | Tradd's explicit yes. |
| 4 | Reconsider reminders, and only after checking Cliniko's built-in ones. | Separate scope. |

Phase 0 is worth doing on its own even if nothing else follows. It makes the call better and it
cannot damage anything.

---

## 9. What I need from Tradd before any of this starts

1. **A Cliniko API key**, and confirmation of which account it is for. A **test/sandbox account
   first** — phase 2 must not run against the live diary.
2. **Confirm the spelling is Cliniko**, not Clinico. Assumed, on the strength of
   `~/projects/au-cliniko-mcp`.
3. **The three IDs**: practitioner, business, and the appointment type for a home visit. Or a
   yes to fetch them with the existing read tools.
4. **A decision on patient creation** — the recommendation is match-only, never create.
5. **Whether Cliniko's own reminders are already on**, which may delete section 7 entirely.

## 10. Open questions I could not answer from the code

- Does the home visit have its own appointment type in Cliniko, or is it a normal consult with
  a note? `available_times` needs an `appointment_type_id`, so this has to be settled first.
- Is there one business record, or one per area? A mobile service may be modelled either way.
- Does travel time between visits need to block the diary? If Tradd is driving Kingscliff to
  Murwillumbah, back-to-back slots are not really available, and Cliniko will happily offer
  both.

**That last one is the question most likely to make phase 3 harder than it looks.**
