# Lead relay

The enquiry form and the tracking number both land here.

- `POST /api/lead` — the website form. Texts the enquiry to the practice.
- `POST /api/voice` — an inbound call on the tracking number. Rings the mobile, with a
  whisper naming the business so it is obvious which line it came in on.
- `POST /api/sms` — an inbound text to the tracking number. Forwards it and replies.

This is the fleet relay's code, running as its own container on this droplet. The
podiatry form does not post across to the rank-and-rent machine: same-origin means no
CORS to get wrong, and a health business does not share a service with a rental fleet.

## Configuration

`sites.json` is bind-mounted, so changing a destination number is a file edit and a
`docker compose restart tweedpodiatry-relay` — no rebuild.

| Key | Meaning |
|---|---|
| `tracking_number` / `twilio_from` | The Twilio number. Calls arrive on it and texts are sent from it. |
| `forward_to` | Where inbound calls ring. |
| `lead_to` | Where lead alerts are texted. |
| `record` | **`false` here.** See below. |
| `whisper` | Played to the answerer only, before the caller is connected. |

### Recording is off, deliberately

The fleet records calls. This site does not. A recorded call in which somebody describes
a foot problem is a health record, and it carries the obligations that follow — storage,
access, disclosure. There is no lead-quality reason to keep one for a practice that
answers its own phone.

With `record: false` the relay also drops the "this call may be recorded" notice, which
is correct: the notice exists to satisfy the consent requirement in the state
surveillance-devices Acts, and there is nothing to consent to.

### `forward_to` and `lead_to` are the same number

On the fleet these differ — `forward_to` is the renter, `lead_to` is the owner — and the
relay texts the owner a copy. Here they are one person, so `app.py` skips the copy when
the two match. Without that, every enquiry would arrive twice.

## Secrets

`relay/.env` holds the Twilio credentials and is **not** in git:

```
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
```

Create it on the droplet before the first `docker compose up -d`. Without it the
container starts and answers, but every SMS fails — the lead is still written to
`data/`, which is the one case where the stored record is all that survives.

## Deploy

```
cd /app-tweed-podiatry && git pull && docker compose up -d --build tweedpodiatry-relay
```

Then check it answers:

```
curl -s -o /dev/null -w '%{http_code}\n' -X POST \
  -H 'Content-Type: application/json' \
  -d '{"phone":"","source":"tweedheadspodiatry.com.au"}' \
  https://tweedheadspodiatry.com.au/api/lead
```

**422 is the pass.** It means the relay matched the site and rejected the empty phone. A
404 means the site did not match — check `source` against `domain` in `sites.json`. Any
5xx, or a 404 that looks like nginx rather than JSON, means Traefik is still sending
`/api` to the website container instead of here.
