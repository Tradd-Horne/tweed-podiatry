# Change log — the AI agent answers a missed call on the podiatry line

Written **before** the change, per `~/agents/RULE-change-log.md`.
Agent: `rankrent2`. Date: 8 September 2026. Asked for by Tradd the same day.

## 1. What I changed (one line)
Rewrote the brief in `relay/agent.py` for home-visit intake, and patched `relay/app.py`
so a call Tradd does not answer reaches the AI agent instead of his voicemail.

Four edits, one outcome. They are not separable: the brief alone would never be heard,
and the routing alone would run the old brief, which offers to book appointments it
cannot make.

1. `agent.py` — the agent now asks for the full STREET ADDRESS, what days and times suit,
   what referral or funding they have, and how urgent it is. It states up front that home
   visits are Mondays only. It closes by saying Tradd will ring back to arrange a time.
2. `agent.py` — it can no longer offer to book. Tradd, 8 Sep 2026: "First of all, just use
   it as an interactive voicemail recording." The old brief offered "to book a visit", and
   `action` could be `book_visit`. Both are gone.
3. `app.py` `/api/whisper` — now a press-1 SCREEN, not an announcement. A voicemail cannot
   press a key.
4. `app.py` `/api/voice/after` — a missed call goes to ConversationRelay. It went to the
   three fixed questions before, and only if the voicemail did not eat it first.

## 2. What I expect (written in advance)
- A missed call reaches the agent and stores a summary with an `address`, an `availability`
  and a `funding` value. Those three fields do not exist today.
- The caller is told about Mondays without asking.
- The agent never says a caller is booked in, and never names a day or a time.
- A caller who mentions a wound, an ulcer or a black toe is still redirected to their GP or
  the high risk foot clinic, and is NOT offered a visit. That behaviour is untouched.
- Risk I accept: an older patient who wanted a human may hang up on a machine. The line
  rings Tradd first, so this only affects calls he was going to miss anyway.

## 3. What I am holding constant
- No audio recording. `record` stays `false` for this site. A recording of someone
  describing a foot problem is a health record, and this relay deliberately does not keep
  one. The written summary stays the only record.
- The clinical safety content is NOT edited: no diagnosis, no treatment advice, the wound
  redirect, and the honest answer about being a machine.
- Prices, Medicare and DVA rebates, NDIS and Home Care Package facts, and the coverage area
  are unchanged and still match the website.
- No Twilio webhook, DNS or Traefik change. No other container on this droplet is touched.
- Cliniko is NOT connected. That is scoped separately and is not part of this change.

## 4. The baseline, measured today from real data
Twilio inbound calls to +61495090752, 9 Aug – 8 Sep 2026: **3**, all 15 seconds or longer.
Two of those, 24s each on 22 Aug, came from a fleet number and were tests.
`leads.db` on this relay, all time: 1 `text` row, 1 `web` row, **0 call rows**.
The line is quiet, so read this as behaviour, not as volume.

## 5. Read it back
- 28 days: **6 October 2026**
- 90 days: **7 December 2026**

Read: how many missed calls reached the agent, how many summaries carry a real street
address, and whether any caller was wrongly told they were booked in. Do not conclude
before 6 October — three calls a month will not settle anything sooner.

---

## Applied — 8 September 2026, 16:45 AEST

⚠️ **This line does NOT run on the rank-and-rent factory droplet.** `tweedheadspodiatry.com.au`
resolves to `170.64.202.90`, `main-production-droplet-syd1`, alongside tradd.net,
truebluereview, therapyonlineaustralia and principalpodiatry. The container is
`tweedpodiatry-relay` and the code lives in `/app-tweed-podiatry/relay`. It runs an OLDER
fork of the relay: no `agent_enabled` flag, no press-1 screen, no `is_test_sid`, no
`MAX_CALL_SECONDS`. Setting `"agent": true` in the factory's `sites.json` would have done
nothing at all here. Backups: `agent.py.bak-2026-09-08-rankrent2`, `app.py.bak-…`.

Three more faults were found by testing and fixed in the same cycle, because each one made
the change unusable rather than merely imperfect:

1. **It asked for the phone number three times in five turns.** The brief never said the
   caller's number is already recorded. Added.
2. **It closed the call as soon as it had an address**, and said "Tradd will ring you back"
   three turns running without ever asking about the care plan the caller had mentioned.
   The closing rule now names what it must have first.
3. **A test could text Tradd.** `is_test_sid` did not exist on this relay, so probing
   `/api/voice/after` sent him a real MISSED CALL text at 06:39 — reported to him. Porting
   the guard was not enough on its own: `_summarise` called `send_sms` DIRECTLY and walked
   past it. That path now goes through `notify()`. A guard with a way around it is not a guard.

Also: the summary's new fields were being computed and then dropped. There is no `address`
column, so `address`, `availability`, `funding` and `urgency` now go into `note` and into
the SMS. Without that the street address existed only inside the transcript.

### Verified live, not assumed
Test call through the production websocket with a non-Twilio CallSid. Stored row:

    name    = Rebecca
    suburb  = Kingscliff
    service = toenail care for mum at home
    note    = action=call_back | Address: 14 Marine Parade, Kingscliff
              | Suits: Mondays, mornings | Funding: care_plan | Urgency: routine

The agent asked for the street address first, stated Mondays without being asked, reflected
the care plan back to confirm it, and closed by saying Tradd would ring back. It never
offered to book. Log line `TEST CALL - SMS suppressed: AI call - +61400000000` confirms the
guard holds. All four test rows deleted afterwards.

### Known and NOT fixed, deliberately
This relay has no `MAX_CALL_SECONDS`. The fleet relay caps a call at five minutes; here a
time-waster or a television near a phone could hold the line open indefinitely, and every
minute costs Twilio money. It is a separate change and it is logged here so it is not lost.
