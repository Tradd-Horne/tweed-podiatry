"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

/**
 * Hero enquiry form.
 *
 * The site is a static export, so there is no server of its own. The form posts JSON to
 * SITE.leadEndpoint, which the fleet lead-relay answers — the same path and the same field
 * names the trade sites use, so one relay serves this site too. `source` is what the relay
 * matches on, so it must stay equal to the site's domain.
 *
 * A failed post must never look like a success. People who fill in a form and see "thank
 * you" do not ring, so a silent failure costs the enquiry twice.
 */

type State = "idle" | "sending" | "sent" | "error";

export function EnquiryForm() {
  const [state, setState] = useState<State>("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setState("sending");
    try {
      const res = await fetch(SITE.leadEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: SITE.domain }),
      });
      if (!res.ok) throw new Error(String(res.status));
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
          I have your details and will call you back the same working day. If it is
          urgent, ring me on{" "}
          <a href={SITE.phoneHref} className="text-[#1e3a5f] font-medium underline">
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
        Leave your details and I will call you back the same working day.
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

      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-5 w-full bg-[#1e3a5f] text-white px-6 py-3.5 text-base font-medium hover:bg-[#152a45] disabled:opacity-70 transition-colors rounded"
      >
        {state === "sending" ? "Sending…" : "Request a call back"}
      </button>

      {state === "error" && (
        <p className="mt-3 text-sm text-red-700">
          That did not send. Please ring me on{" "}
          <a href={SITE.phoneHref} className="font-medium underline">
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
