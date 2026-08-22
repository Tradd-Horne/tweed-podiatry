# Deploy on merge

So this is the last time a deploy has to be typed by hand.

Merging into `prebuilt` will deploy the site and the relay to the droplet, with no agent
ever holding a droplet credential.

## Why it is built this way

GitHub Actions SSHes to the droplet with a deploy key that the droplet has **locked to a
single forced command**. The key cannot open a shell, forward a port, or read any other
app's `.env`. It can do exactly one thing: run `/opt/deploy/tweed-podiatry.sh`.

The deploy logic lives **on the droplet, not in this repo**, so a bad pull request can
change the site but cannot change what a deploy does.

Worst case if the private key leaks: somebody can redeploy the current `prebuilt`. That
is all.

This is Tradd's own design, recorded 24 July 2026, and the reasoning behind it is why an
agent is not simply given root: the droplet runs every production site behind one
Traefik, so the blast radius is everything, and a shell is every secret on the box.

## Part 1 — on the droplet, once

**Step 1.** Put the two Twilio values into shell variables. They are on the front page of
console.twilio.com. Editing two short lines beats editing inside a heredoc.

```bash
SID='AC_paste_your_account_sid'
TOK='paste_your_auth_token'
TS='0x4AAAAAAEYBL2q-Idom2jfKLULutEAbWHg'   # Turnstile secret, already created
```

**Step 2.** Paste the rest as one block.

```bash
# --- Twilio credentials for the relay -------------------------------------
install -d -m 700 /app-tweed-podiatry/relay
printf 'TWILIO_ACCOUNT_SID=%s\nTWILIO_AUTH_TOKEN=%s\nTURNSTILE_SECRET=%s\n' \
  "$SID" "$TOK" "$TS" > /app-tweed-podiatry/relay/.env
chmod 600 /app-tweed-podiatry/relay/.env

# --- the one thing the deploy key is allowed to run ------------------------
mkdir -p /opt/deploy
cat > /opt/deploy/tweed-podiatry.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
export PATH=/usr/local/bin:/usr/bin:/bin
cd /app-tweed-podiatry
git fetch --quiet origin prebuilt
# Make sure we are ON prebuilt, not just resetting whatever branch is checked out.
# A `reset --hard origin/prebuilt` while sitting on main quietly rewrites main to
# prebuilt's commit, which works today and is confusing forever after.
git checkout --quiet prebuilt 2>/dev/null || git checkout --quiet -b prebuilt origin/prebuilt
git reset --hard --quiet origin/prebuilt
docker compose up -d --build
echo "tweed-podiatry deployed @ $(git rev-parse --short HEAD)"
EOF
chmod 700 /opt/deploy/tweed-podiatry.sh

# --- the locked key --------------------------------------------------------
ssh-keygen -t ed25519 -f /root/twp_deploy_key -N "" -C tweed-podiatry-deploy
printf 'command="/opt/deploy/tweed-podiatry.sh",no-agent-forwarding,no-port-forwarding,no-user-rc,no-x11-forwarding,no-pty %s\n' \
  "$(cat /root/twp_deploy_key.pub)" >> /root/.ssh/authorized_keys

# --- deploy right now ------------------------------------------------------
/opt/deploy/tweed-podiatry.sh

echo; echo "===== PRIVATE KEY - copy the whole block into the GitHub secret ====="
cat /root/twp_deploy_key
echo "===== END ====="
```

That last line prints the private key. It goes into the repo secret below.

## Part 2 — the three repo secrets

GitHub → the repo → Settings → Secrets and variables → Actions → New repository secret.

| Name | Value |
|---|---|
| `DROPLET_DEPLOY_KEY` | the private key block Part 1 printed |
| `DROPLET_HOST` | `170.64.202.90` |
| `DEPLOY_USER` | `root` |

## Part 3 — add the workflow

Copy `deploy/on-merge/deploy.yml` in this repo to `.github/workflows/deploy.yml`.

⚠️ **Claude cannot do this step.** The boss-bot `gh` token carries `repo` but not
`workflow`, so it is refused when pushing anything under `.github/workflows/`. Either:

- add the file through the GitHub web UI (Add file → Create new file → paste), or
- run `gh auth refresh -s workflow -h github.com` in Tradd's terminal, after which
  Claude can open it as a PR like any other change.

## Checking it

```
gh run list --repo Tradd-Horne/tweed-podiatry
gh run view <id> --repo Tradd-Horne/tweed-podiatry --log
```

A manual redeploy is the Actions tab → "Deploy Tweed Heads Podiatry" → Run workflow.

## What still is not automatic

`relay/.env` holds the Twilio credentials and is created once, by hand, in Part 1. It is
deliberately not in git and not in a GitHub secret: the forced command takes no arguments,
so there is nowhere for the workflow to inject it, and putting a live auth token in the
repo's secrets to write it to disk would be a worse trade than typing it once.
