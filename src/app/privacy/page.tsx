import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/site";

/**
 * Privacy policy.
 *
 * The call-back form asks for a name, a phone number and a free-text note that often holds
 * health details. Collecting health information without a published policy breaks APP 1
 * and the NSW Health Privacy Principles, so this page is a requirement, not decoration.
 *
 * ⚠️ Keep it TRUE. Every processor named here is one the site actually uses. If calls start
 * being recorded (relay/sites.json "record": true) or an AI agent answers missed calls on
 * this line, this page must change in the same PR. Tradd confirmed 24 Nov 2026 (msg 3796)
 * that calls ARE recorded, so the page says so.
 */
export const metadata: Metadata = {
  title: "Privacy policy | Tweed Heads Podiatry",
  description:
    "How Tweed Heads Podiatry collects, uses, stores and protects your personal and health information.",
  alternates: { canonical: `${SITE.url}/privacy` },
  robots: { index: true, follow: true },
};

const UPDATED = "24 November 2026";

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 text-xl font-semibold text-[#1e3a5f]">{children}</h2>;
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 text-gray-700 leading-relaxed">
        <h1 className="text-3xl font-semibold text-[#1e3a5f]">Privacy policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated {UPDATED}</p>

        <p className="mt-6">
          {SITE.name} is a home-visit podiatry service run by {SITE.practitioner},{" "}
          {SITE.qualification} (AHPRA {SITE.ahpra}, ABN {SITE.abn}). We handle your personal
          and health information under the <em>Privacy Act 1988</em> (Cth), the Australian
          Privacy Principles, and the <em>Health Records and Information Privacy Act 2002</em>{" "}
          (NSW).
        </p>

        <H2>What we collect</H2>
        <ul className="mt-3 list-disc pl-6 space-y-2">
          <li>
            <strong>When you ask for a call back:</strong> your name, phone number, suburb, and
            anything you write in the message box. That can include health details.
          </li>
          <li>
            <strong>When you call or text us:</strong> your phone number, the time of the call,
            the content of any text message, and a recording of the call. We record calls so we
            have an accurate note of your request and for quality and training. Recordings are
            kept securely and only {SITE.practitioner} listens to them. If you would rather not
            be recorded, tell us at the start of the call or use the call-back form instead.
          </li>
          <li>
            <strong>When you become a patient:</strong> the details needed to treat you safely —
            contact details, medical history, medications, assessment and treatment notes, and
            funding details (Medicare, DVA, NDIS, aged care or private health).
          </li>
          <li>
            <strong>When you visit this website:</strong> anonymous page-view statistics. Our
            analytics tool does not use cookies and does not identify you.
          </li>
        </ul>

        <H2>How we use it</H2>
        <ul className="mt-3 list-disc pl-6 space-y-2">
          <li>To reply to your enquiry and book a visit.</li>
          <li>To assess and treat you, and to keep clinical records as the law requires.</li>
          <li>
            To claim from a funding body you have asked us to bill, and to send reports to your
            GP or care provider when you agree or the referral requires it.
          </li>
        </ul>
        <p className="mt-3">
          We do not sell your information. We do not send you marketing unless you ask for it.
        </p>

        <H2>Who we share it with</H2>
        <p className="mt-3">
          Only the people involved in your care or payment (for example your GP, care
          provider, Medicare, DVA, NDIS or your health fund), and the services that run this
          practice for us:
        </p>
        <ul className="mt-3 list-disc pl-6 space-y-2">
          <li>Our practice management and clinical records system.</li>
          <li>Twilio, which carries calls and text messages to our phone number.</li>
          <li>Cloudflare, which protects this website and the call-back form from spam.</li>
          <li>Our website and email hosting providers.</li>
        </ul>
        <p className="mt-3">
          Some of these providers may process data outside Australia (for example in the United
          States). We choose providers that protect information to a standard comparable to
          the Australian Privacy Principles. We may also disclose information when the law
          requires it.
        </p>

        <H2>How we keep it safe</H2>
        <p className="mt-3">
          Records are stored electronically on secure, password-protected systems. Only{" "}
          {SITE.practitioner} and anyone working under his direction can see them. We keep
          health records for at least 7 years after your last visit (or until age 25 for a
          child), as NSW law requires, and then destroy them securely.
        </p>

        <H2>Seeing or correcting your information</H2>
        <p className="mt-3">
          You can ask for a copy of your records or ask us to correct them. Email{" "}
          <a href={`mailto:${SITE.email}`} className="underline">
            {SITE.email}
          </a>{" "}
          or call{" "}
          <a href={SITE.phoneHref} className="underline">
            {SITE.phone}
          </a>
          . We will reply within 30 days.
        </p>

        <H2>Complaints</H2>
        <p className="mt-3">
          If you are unhappy with how we handled your information, contact us first at the
          email above. If we do not resolve it, you can complain to the Office of the
          Australian Information Commissioner (
          <a href="https://www.oaic.gov.au" className="underline">
            oaic.gov.au
          </a>
          , 1300 363 992) or the NSW Information and Privacy Commission (
          <a href="https://www.ipc.nsw.gov.au" className="underline">
            ipc.nsw.gov.au
          </a>
          , 1800 472 679).
        </p>
      </main>
      <Footer />
    </>
  );
}
