/**
 * Single source of truth for the whole site.
 *
 * Every page, every menu, the sitemap and the schema all read from here. One list means a
 * new suburb or service cannot appear in the nav and be missing from the sitemap, which is
 * exactly the drift that leaves pages orphaned and unindexed.
 */

export const SITE = {
  name: "Tweed Heads Podiatry",
  legalName: "Tweed Heads Podiatry",
  url: "https://tweedheadspodiatry.com.au",
  phone: "0403 643 158",
  phoneHref: "tel:+61403643158",
  email: "hello@tweedheadspodiatry.com.au",
  // Real credentials only. Nothing on this site claims anything Tradd does not hold.
  practitioner: "Tradd Horne",
  qualification: "B.HSc (Pod)",
  ahpra: "POD0001880268",
  abn: "19 615 606 347",
  baseSuburb: "Tweed Heads",
  state: "NSW",
  postcode: "2485",
  latitude: -28.1794,
  longitude: 153.5426,
} as const;

export type PageKind = "service" | "funding" | "problem" | "suburb";

export interface PageDef {
  slug: string;
  kind: PageKind;
  /** The phrase this page is written to answer. One page, one search. */
  target: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  /** Sub-headings become the page body and the FAQ; each answers a real question. */
  sections: { heading: string; body: string }[];
  faqs: { q: string; a: string }[];
}

/* ── Services: what people call the thing they want ─────────────────────────────── */
export const SERVICE_PAGES: PageDef[] = [
  {
    slug: "home-visit-podiatrist-tweed-heads",
    kind: "service",
    target: "home visit podiatrist tweed heads",
    title: "Home Visit Podiatrist Tweed Heads | Podiatry at Home",
    description:
      "A registered podiatrist who comes to your home in Tweed Heads. Nail care, corns, callus, diabetic foot checks. Home Care Package, DVA and NDIS welcome.",
    h1: "Home visit podiatrist in Tweed Heads",
    intro:
      "If getting to a clinic has become hard work, the podiatry can come to you. I treat people in their own homes across Tweed Heads and the surrounding suburbs — the same care you would get in a clinic, at your kitchen table, without the parking, the stairs or the wait.",
    sections: [
      {
        heading: "What a home visit involves",
        body: "A visit takes about 45 minutes. I bring everything: sterile instruments, a portable chair if you need one, and a drill for thickened nails. We talk about what is bothering you, I check circulation and sensation, treat the nails, corns and callus, and leave you with the feet comfortable and a plan for next time.",
      },
      {
        heading: "Who this suits",
        body: "People who cannot bend to reach their feet. People with diabetes who need their feet checked properly. Anyone who has had a fall, or whose eyesight or grip makes nail care unsafe. Family members who have been trimming a parent's nails and would rather it was done by someone registered to do it.",
      },
      {
        heading: "How often people book",
        body: "Most people settle into a visit every six to eight weeks. Some need it monthly, some twice a year. There is no contract and no minimum — we work out what your feet actually need.",
      },
    ],
    faqs: [
      {
        q: "Do you bring everything with you?",
        a: "Yes. Sterile instruments for every visit, a nail drill for thickened nails, dressings, and a portable chair if there is nowhere suitable to sit.",
      },
      {
        q: "Do I need a referral?",
        a: "No. You can book directly. A referral is only needed if you are claiming through Medicare's chronic disease plan or DVA, and your GP arranges that.",
      },
      {
        q: "How far do you travel?",
        a: "Tweed Heads, Banora Point, Terranora, Kingscliff, Coolangatta, Pottsville, Cabarita and Murwillumbah. If you are just outside that, ring and ask.",
      },
    ],
  },
  {
    slug: "mobile-podiatrist",
    kind: "service",
    target: "mobile podiatrist tweed heads",
    title: "Mobile Podiatrist | Tweed Heads & Northern NSW",
    description:
      "Mobile podiatry across Tweed Heads and Northern NSW. Registered podiatrist, fully equipped, visiting homes, retirement villages and aged care.",
    h1: "Mobile podiatry across Tweed Heads and Northern NSW",
    intro:
      "Mobile podiatry means the clinic travels. Everything needed for a proper treatment fits in the car, so the care does not change — only the address does.",
    sections: [
      {
        heading: "Where I visit",
        body: "Private homes, retirement villages, independent living units and residential aged care across the Tweed and the far Northern Rivers. Villages are welcome to book a block of residents on the same day, which usually suits everyone better than individual visits.",
      },
      {
        heading: "Infection control on the road",
        body: "Instruments are single-use or hospital-sterilised between clients, never wiped down and reused. That standard does not relax because the treatment happens in a lounge room.",
      },
      {
        heading: "What it costs",
        body: "A standard home visit is a single fee with no separate call-out charge. If you hold a Home Care Package, DVA card or NDIS plan, the visit is often funded — see the funding pages for how each one works.",
      },
    ],
    faqs: [
      {
        q: "Is a mobile visit more expensive than a clinic?",
        a: "It is usually a little more, because the travel is real. There is no separate call-out fee on top — one price covers the visit.",
      },
      {
        q: "Can you see several residents at one village?",
        a: "Yes, and it is the best way to do it. Block bookings mean less travel and a better rate for everyone.",
      },
    ],
  },
];

/* ── Funding: how the visit gets paid for ────────────────────────────────────────── */
export const FUNDING_PAGES: PageDef[] = [
  {
    slug: "aged-care-podiatry",
    kind: "funding",
    target: "aged care podiatry tweed heads",
    title: "Aged Care Podiatry Tweed Heads | In-Home Foot Care",
    description:
      "Podiatry for older people at home in Tweed Heads. Nail care, callus, diabetic foot checks and falls-risk assessment. Home Care Package and Support at Home welcome.",
    h1: "Podiatry for older people, at home",
    intro:
      "Feet get harder to look after long before anything else does. Bending becomes difficult, nails thicken, eyesight makes it unsafe to cut them yourself. None of that is a reason to go without proper care.",
    sections: [
      {
        heading: "Why foot care matters more with age",
        body: "Painful feet change how you walk, and how you walk changes your balance. A large share of falls in older people start with something on the foot that could have been treated. Keeping nails, corns and callus under control is a falls measure, not a cosmetic one.",
      },
      {
        heading: "Working with families",
        body: "Often it is a son or daughter who rings, not the person themselves. That is fine. I am happy to talk it through with you first, and to report back after a visit if your parent is happy for me to.",
      },
      {
        heading: "Villages and residential care",
        body: "I visit retirement villages and residential aged care across the Tweed. Facilities can book a regular day and I work through a list of residents.",
      },
    ],
    faqs: [
      {
        q: "Does a Home Care Package cover podiatry?",
        a: "Yes. Podiatry is an allied health service and is fundable under a Home Care Package or Support at Home. Your provider or case manager arranges it, and I invoice them directly.",
      },
      {
        q: "My mother is nervous about someone new. Can I be there?",
        a: "Please be. It usually makes the first visit much easier, and you can hear the advice first-hand.",
      },
    ],
  },
  {
    slug: "home-care-package-podiatry",
    kind: "funding",
    target: "home care package podiatry",
    title: "Home Care Package Podiatry | Tweed Heads Home Visits",
    description:
      "Use your Home Care Package or Support at Home funding for podiatry at home in Tweed Heads. Invoiced direct to your provider. No out-of-pocket in most cases.",
    h1: "Podiatry through your Home Care Package",
    intro:
      "If you have a Home Care Package or are moving across to Support at Home, podiatry is one of the services it is meant to pay for. Most people are not told that.",
    sections: [
      {
        heading: "How it works",
        body: "Tell your case manager you would like podiatry at home and give them my details. They approve it against your package, I visit, and the invoice goes to the provider rather than to you. In most cases there is nothing to pay on the day.",
      },
      {
        heading: "If you self-manage your package",
        body: "Self-managed package holders can book me directly and claim the invoice back through their provider. It is usually faster, and often cheaper per visit, because there is no coordination fee on top.",
      },
      {
        heading: "Support at Home",
        body: "Support at Home replaced the old Home Care Package arrangements from 1 November 2025. Allied health, including podiatry, is still funded. If you are mid-transition and unsure what you can use, ring and I will tell you what I know — and tell you plainly when it is a question for your provider rather than for me.",
      },
    ],
    faqs: [
      {
        q: "Will it use up much of my package?",
        a: "A visit every six to eight weeks is a small part of most packages, and it is one of the few services that directly reduces falls risk.",
      },
      {
        q: "Can I use my package if I am not in Tweed Heads?",
        a: "Funding is not tied to a suburb, but my travel is. See the areas I visit and ring if you are close to the edge of them.",
      },
    ],
  },
  {
    slug: "dva-podiatry",
    kind: "funding",
    target: "dva podiatry home visits",
    title: "DVA Podiatry Home Visits | Tweed Heads | Gold & White Card",
    description:
      "DVA-funded podiatry at home in Tweed Heads and Northern NSW. Gold and White Card holders. Bulk billed to DVA with a valid referral — no out-of-pocket cost.",
    h1: "DVA podiatry, in your own home",
    intro:
      "Veterans with a Gold Card, and White Card holders with an accepted foot condition, can have podiatry at home at no cost to them. The visit is billed to DVA.",
    sections: [
      {
        heading: "What you need",
        body: "A referral from your GP, valid for twelve months. Your GP writes it to a podiatrist — it does not need to name me. Bring it out on the first visit and I will take it from there.",
      },
      {
        heading: "What is covered",
        body: "Routine foot care, nail and callus treatment, diabetic foot assessment, and advice on footwear. DVA sets the number of visits per referral period; if you need more, your GP can request it.",
      },
      {
        heading: "What it costs you",
        body: "Nothing. DVA is billed directly. There is no gap and no call-out fee for a Gold Card holder.",
      },
    ],
    faqs: [
      {
        q: "Does a White Card cover podiatry?",
        a: "Only for the condition DVA has accepted. If your accepted condition affects your feet, it is covered. Your GP will know what has been accepted.",
      },
      {
        q: "How long does a referral last?",
        a: "Twelve months from the date it is written. I will tell you when it is getting close so you can get another.",
      },
    ],
  },
  {
    slug: "ndis-podiatry",
    kind: "funding",
    target: "ndis podiatry tweed heads",
    title: "NDIS Podiatry Tweed Heads | Mobile Home Visits",
    description:
      "NDIS podiatry at home in Tweed Heads. Self-managed and plan-managed participants welcome. Improved Daily Living and Improved Health & Wellbeing.",
    h1: "NDIS podiatry at home",
    intro:
      "Podiatry sits under Improved Daily Living or Improved Health and Wellbeing in most plans. If getting to appointments is part of what makes things hard, a home visit removes that problem entirely.",
    sections: [
      {
        heading: "Who I can see",
        body: "Self-managed and plan-managed participants. I am not currently NDIS-registered, which means agency-managed plans cannot use me — I would rather say that plainly than waste your time.",
      },
      {
        heading: "What a visit covers",
        body: "Nail and skin care, footwear advice, pressure and pain management, and assessment of anything affecting how you walk. Reports for your plan review are available on request.",
      },
      {
        heading: "Booking",
        body: "Ring or email with your plan management details. Plan managers are invoiced directly; self-managed participants are invoiced and claim it back.",
      },
    ],
    faqs: [
      {
        q: "Can agency-managed participants book?",
        a: "Not at the moment. I am not NDIS-registered, so agency-managed plans cannot claim my invoices.",
      },
      {
        q: "Do you write reports for plan reviews?",
        a: "Yes, on request. Tell me before the visit so I can gather what the report needs.",
      },
    ],
  },
];

/* ── Problems: what people actually type at 11pm ─────────────────────────────────── */
export const PROBLEM_PAGES: PageDef[] = [
  {
    slug: "cant-cut-my-toenails",
    kind: "problem",
    target: "cannot cut my own toenails",
    title: "Can't Cut Your Own Toenails? | Home Visit Nail Care Tweed Heads",
    description:
      "If you cannot reach or safely cut your toenails, a podiatrist can do it at home in Tweed Heads. Thick nails, poor eyesight, arthritis, diabetes.",
    h1: "When you can't cut your own toenails any more",
    intro:
      "It creeps up. Bending gets harder, the nails get thicker, and one day the clippers will not do it. Plenty of people put up with sore, overgrown nails for months because they are embarrassed to ask.",
    sections: [
      {
        heading: "Why it stops being safe to do yourself",
        body: "Arthritic hands cannot grip clippers well. Thickened nails need a drill, not scissors. If you cannot see your foot clearly, it is very easy to cut the skin — and if you have diabetes or poor circulation, a small cut is not a small problem.",
      },
      {
        heading: "What I do about it",
        body: "Nails cut and filed back to a comfortable length and shape, thick nails reduced with a drill so they stop pressing, and any corn or callus taken down at the same visit. It does not hurt.",
      },
      {
        heading: "Should a family member do it instead?",
        body: "Plenty do, and there is nothing wrong with it if the feet are healthy. If there is diabetes, thin skin, poor circulation or thickened nails, it is safer to have someone trained do it — the cost of getting it wrong is high.",
      },
    ],
    faqs: [
      {
        q: "Will it hurt?",
        a: "No. Cutting and reducing nails is not painful. If a nail is already sore, treating it is usually what stops the pain.",
      },
      {
        q: "How often will I need it done?",
        a: "Most people every six to eight weeks. Thickened nails sometimes need it a little more often at first.",
      },
    ],
  },
  {
    slug: "thick-fungal-toenails",
    kind: "problem",
    target: "thick or fungal toenails",
    title: "Thick or Fungal Toenails | Home Treatment Tweed Heads",
    description:
      "Thickened and fungal toenails treated at home in Tweed Heads. Nails reduced with a drill, cause assessed, honest advice on what treatment can and cannot do.",
    h1: "Thick, yellow or crumbling toenails",
    intro:
      "A thickened nail presses into the toe from above and hurts inside a shoe. Whether or not it is fungal changes the treatment, and it is worth knowing which you have.",
    sections: [
      {
        heading: "Fungal, or just thickened?",
        body: "Not every thick yellow nail is fungal. Old trauma — a dropped weight, years in tight boots, a football injury — thickens nails permanently and no antifungal will change that. The two look similar and are managed differently, so it is worth having it looked at rather than treating blindly.",
      },
      {
        heading: "What treatment actually achieves",
        body: "Reducing the nail with a drill takes the pressure off and makes the toe comfortable straight away. That part works every time. Clearing a fungal infection is slower, takes months, and does not always succeed — I will tell you honestly what the odds look like for your nail rather than sell you a course of something.",
      },
      {
        heading: "Keeping it under control",
        body: "For many people the practical answer is regular reduction every couple of months, so the nail never gets thick enough to hurt. That is a perfectly reasonable outcome.",
      },
    ],
    faqs: [
      {
        q: "Do the chemist paints work?",
        a: "Sometimes, on early and mild infections, with months of daily use. On a thick nail they rarely penetrate far enough to matter.",
      },
      {
        q: "Can you tell if it is fungal just by looking?",
        a: "Often, but not always. If it matters — before starting a long treatment — a nail sample can be sent for testing.",
      },
    ],
  },
  {
    slug: "ingrown-toenail",
    kind: "problem",
    target: "ingrown toenail tweed heads",
    title: "Ingrown Toenail Treatment | Home Visits Tweed Heads",
    description:
      "Painful ingrown toenail treated at home in Tweed Heads. Immediate relief, cause identified, and permanent options if it keeps coming back.",
    h1: "Ingrown toenails",
    intro:
      "An ingrown nail is one of the few foot problems that will not wait. It hurts constantly, it gets worse, and digging at it yourself almost always makes it angrier.",
    sections: [
      {
        heading: "Getting the pain down",
        body: "In most cases the offending spike of nail can be removed at the visit and the relief is immediate. If it is infected, that needs treating too, and sometimes a GP and antibiotics alongside.",
      },
      {
        heading: "Why it keeps coming back",
        body: "Usually the nail shape, sometimes how it has been cut, sometimes footwear. If the same toe has done this three times, the shape is the cause and trimming it again will not be the last time.",
      },
      {
        heading: "The permanent fix",
        body: "A minor procedure under local anaesthetic removes the offending edge for good. It takes about an hour, you walk out afterwards, and it does not recur in the great majority of cases. It is a clinic procedure rather than a home one, and I will tell you if that is what you actually need.",
      },
    ],
    faqs: [
      {
        q: "Can you treat an ingrown nail at a home visit?",
        a: "The immediate pain, yes, almost always. The permanent procedure needs a clinical setting.",
      },
      {
        q: "It looks infected. Should I see a doctor first?",
        a: "If there is spreading redness, heat or you feel unwell, see your GP promptly. Otherwise a podiatrist is the right first call.",
      },
    ],
  },
  {
    slug: "diabetic-foot-checks",
    kind: "problem",
    target: "diabetic foot check tweed heads",
    title: "Diabetic Foot Checks at Home | Tweed Heads Podiatry",
    description:
      "Annual and six-monthly diabetic foot assessments at home in Tweed Heads. Circulation and nerve testing, risk grading, and safe nail care.",
    h1: "Diabetic foot checks, done properly, at home",
    intro:
      "If you have diabetes, your feet need checking whether or not anything hurts. Nerve damage removes the warning system, so problems are often found by looking rather than by feeling them.",
    sections: [
      {
        heading: "What the check involves",
        body: "Pulses and circulation, sensation tested with a monofilament, skin and nail condition, footwear, and any pressure areas that could become ulcers. It takes about twenty minutes and you get a clear answer on your risk level.",
      },
      {
        heading: "Why the nails matter",
        body: "In a foot with reduced sensation, a nick from home nail cutting can become an ulcer without ever hurting. Safe nail care is a large part of why regular podiatry is recommended for people with diabetes.",
      },
      {
        heading: "How often",
        body: "Annually if your risk is low, every three to six months if there is nerve damage, poor circulation or a history of ulceration. I will tell you which applies and why.",
      },
    ],
    faqs: [
      {
        q: "Can I claim this on Medicare?",
        a: "If your GP has set up a chronic disease management plan, you can claim up to five allied health visits a year, and podiatry counts. Your GP arranges the referral.",
      },
      {
        q: "My feet feel fine. Do I still need it?",
        a: "Yes, and that is the point. Reduced sensation means the foot stops reporting problems. Feeling fine is not the same as being fine.",
      },
    ],
  },
  {
    slug: "corns-and-callus",
    kind: "problem",
    target: "corns and callus removal tweed heads",
    title: "Corn & Callus Removal at Home | Tweed Heads Podiatry",
    description:
      "Painful corns and hard callus removed at home in Tweed Heads. Immediate relief, plus the pressure cause addressed so it stops coming back.",
    h1: "Corns and hard skin",
    intro:
      "A corn is pressure that has nowhere to go. Taking it out gives immediate relief — but if nothing changes the pressure, it comes back, and that is the part most people are never told.",
    sections: [
      {
        heading: "The relief part",
        body: "Corns and callus are pared away with a sterile blade. It does not hurt — the tissue has no nerve supply — and walking usually feels better before I have left.",
      },
      {
        heading: "The part that stops it returning",
        body: "Something is pressing. A toe shape, a shoe, the way you load the foot. Sorting the pressure is what buys you months instead of weeks — sometimes it is as simple as a different shoe, sometimes padding or an insole.",
      },
      {
        heading: "Please do not use corn pads",
        body: "Medicated corn pads are acid. On thin or poorly circulated skin they can burn a hole rather than remove a corn. If you have diabetes, do not use them at all.",
      },
    ],
    faqs: [
      {
        q: "Why does my corn keep coming back?",
        a: "Because the pressure causing it is still there. Removing the corn treats the symptom; changing the pressure treats the cause.",
      },
      {
        q: "Is it painful to have them removed?",
        a: "No. The hard tissue has no feeling in it. The pressure underneath is what has been hurting.",
      },
    ],
  },
];

/* ── Suburbs ─────────────────────────────────────────────────────────────────────── */
export interface SuburbDef {
  slug: string;
  name: string;
  postcode: string;
  /** One true, checkable local detail. Never invented — a wrong local claim reads as fake. */
  note: string;
}

export const SUBURBS: SuburbDef[] = [
  { slug: "tweed-heads", name: "Tweed Heads", postcode: "2485",
    note: "The base for this practice, so appointments here are the easiest to fit in — often within the same week." },
  { slug: "banora-point", name: "Banora Point", postcode: "2486",
    note: "A short drive from Tweed Heads, with a large retired population and several villages I visit regularly." },
  { slug: "kingscliff", name: "Kingscliff", postcode: "2487",
    note: "Visited on a set run down the coast road, so Kingscliff appointments usually sit together on the same day." },
  { slug: "coolangatta", name: "Coolangatta", postcode: "4225",
    note: "Just over the border, and close enough to Tweed Heads that it is part of the standard run." },
  { slug: "terranora", name: "Terranora", postcode: "2486",
    note: "Hilly and spread out, which is exactly where getting to a clinic is hardest and a home visit earns its keep." },
  { slug: "pottsville", name: "Pottsville", postcode: "2489",
    note: "At the southern end of the run, so Pottsville visits are grouped onto particular days." },
  { slug: "cabarita-beach", name: "Cabarita Beach", postcode: "2488",
    note: "Grouped with the Kingscliff and Pottsville coastal run." },
  { slug: "murwillumbah", name: "Murwillumbah", postcode: "2484",
    note: "Inland from the coast, and covered on the same day as the surrounding valley." },
];

export const ALL_PAGES: PageDef[] = [
  ...SERVICE_PAGES,
  ...FUNDING_PAGES,
  ...PROBLEM_PAGES,
];

export function pageBySlug(slug: string): PageDef | undefined {
  return ALL_PAGES.find((p) => p.slug === slug);
}
