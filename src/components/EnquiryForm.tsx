"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";

/**
 * Hero enquiry form. The same shape as the fleet's trade sites, on purpose.
 *
 * The site ships as a static export, so it has no server of its own. The form posts JSON to
 * SITE.leadEndpoint on its OWN origin, which Traefik routes to the lead relay. Same-origin
 * is not a preference: a browser will not let a page post JSON to another domain unless
 * that domain answers with CORS headers, and the relay deliberately returns none.
 *
 * Three spam defences, in increasing order of cost to the visitor:
 *
 *   1. `website` — a honeypot. Invisible, and real people never fill it in.
 *   2. `t` — the second the form was drawn. The relay rejects anything submitted in under
 *      three seconds, which no human manages and every bot does.
 *   3. Cloudflare Turnstile — rendered only when a site key is configured. Until then the
 *      form runs without it and the relay treats "no secret" as a pass, so nothing is
 *      broken while the widget is being created.
 *
 * A failed post must never look like a success. People who fill in a form and see "thank
 * you" do not ring, so a silent failure costs the enquiry twice.
 */

type State = "idle" | "sending" | "sent" | "error";

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

export function EnquiryForm() {
  const [state, setState] = useState<State>("idle");
  // Stamped on mount, not at build time. A static page can sit in a cache for days, and a
  // build-time value would make every visitor look like they took a week to type.
  const drawnAt = useRef<string>("");

  useEffect(() => {
    drawnAt.current = String(Math.floor(Date.now() / 1000));
    if (!SITE.turnstileSiteKey) return;
    if (document.querySelector(`script[src^="${TURNSTILE_SRC}"]`)) return;
    const s = document.createElement("script");
    s.src = TURNSTILE_SRC;
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    const form = event.currentTarget;
    // Turnstile injects its own hidden `cf-turnstile-response` input into the form, so
    // FormData picks the token up without it being declared here.
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setState("sending");
    try {
      const res = await fetch(SITE.leadEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: SITE.domain, t: drawnAt.current }),
      });
      if (!res.ok) throw new Error(String(res.status));
      // ⚠️ form-submit fires on SUCCESS only. A failed post is not an enquiry and must not
      // be counted as one — tradd.net's Rank & Rent graph draws its enquiry figure from
      // this event and from phone-tap. Rising Damp Brisbane's first real lead never
      // appeared on that graph because both were missing.
      if (typeof window !== "undefined" && (window as unknown as {
        umami?: { track: (e: string) => void };
      }).umami) {
        (window as unknown as { umami: { track: (e: string) => void } })
          .umami.track("form-submit");
      }
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="bg-white p-6 sm:p-8 shadow-xl rounded-lg">
        <h2 className="text-xl font-semibold text-[#1e3a5f] mb-2">Thank you</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          we have your details and will call you back the same working day. If it is
          urgent, ring us on{" "}
          <a href={SITE.phoneHref} data-umami-event="phone-tap" className="text-[#1e3a5f] font-medium underline">
            {SITE.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-6 sm:p-7 shadow-xl rounded-lg"
      noValidate={false}
    >
      <h2 className="text-xl font-semibold text-[#1e3a5f]">Request a home visit</h2>
      <p className="text-sm text-gray-600 mt-1 mb-5">
        Leave your details and we will call you back the same working day.
      </p>

      <div className="space-y-3">
        <div>
          <label htmlFor="ef-name" className="block text-sm text-gray-700 mb-1">
            Your name
          </label>
          <input
            id="ef-name"
            name="name"
            autoComplete="name"
            required
            className="w-full border border-gray-300 px-3 py-2.5 text-base rounded focus:outline-none focus:border-[#1e3a5f]"
          />
        </div>

        <div>
          <label htmlFor="ef-phone" className="block text-sm text-gray-700 mb-1">
            Phone
          </label>
          <input
            id="ef-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            className="w-full border border-gray-300 px-3 py-2.5 text-base rounded focus:outline-none focus:border-[#1e3a5f]"
          />
        </div>

        <div>
          <label htmlFor="ef-suburb" className="block text-sm text-gray-700 mb-1">
            Suburb
          </label>
          <input
            id="ef-suburb"
            name="suburb"
            autoComplete="address-level2"
            className="w-full border border-gray-300 px-3 py-2.5 text-base rounded focus:outline-none focus:border-[#1e3a5f]"
          />
        </div>

        <div>
          <label htmlFor="ef-detail" className="block text-sm text-gray-700 mb-1">
            What do you need help with?
          </label>
          <textarea
            id="ef-detail"
            name="detail"
            rows={3}
            placeholder="Nail care, corns, a diabetic foot check, sore heels…"
            className="w-full border border-gray-300 px-3 py-2.5 text-base rounded focus:outline-none focus:border-[#1e3a5f]"
          />
        </div>
      </div>

      {/* Honeypot. Real people never fill this in; bots fill in everything. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {SITE.turnstileSiteKey && (
        <div
          className="cf-turnstile mt-4"
          data-sitekey={SITE.turnstileSiteKey}
          data-theme="light"
          data-size="flexible"
        />
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-5 w-full bg-[#1e3a5f] text-white px-6 py-3.5 text-base font-medium hover:bg-[#152a45] disabled:opacity-70 transition-colors rounded"
      >
        {state === "sending" ? "Sending…" : "Request a call back"}
      </button>

      {state === "error" && (
        <p className="mt-3 text-sm text-red-700">
          That did not send. Please ring us on{" "}
          <a href={SITE.phoneHref} data-umami-event="phone-tap" className="font-medium underline">
            {SITE.phone}
          </a>
          .
        </p>
      )}

      <p className="mt-3 text-xs text-gray-500">
        {SITE.practitioner} {SITE.qualification} · AHPRA {SITE.ahpra}
      </p>
    </form>
  );
}
