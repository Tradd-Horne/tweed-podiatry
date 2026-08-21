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
  /** The relay matches an enquiry to this site on `source`, so it must equal the domain. */
  domain: "tweedheadspodiatry.com.au",
  /** Same-origin path; Traefik routes it to the shared fleet lead-relay. */
  leadEndpoint: "/api/lead",
} as const;

/**
 * Tradd's own fees. Every price on the site reads from here — a fee quoted in two places
 * and changed in one is the classic way a health site ends up advertising a price it does
 * not charge, which is both a consumer-law problem and an AHPRA one.
 *
 * Set 21 August 2026 against published local fees: Hip to Toe Arundel $110 initial,
 * Gentle Podiatry $90 initial / $80 follow-up, ModPod $135 initial. Australian home-visit
 * podiatry runs $150–$250. A home visit carries the travel and the set-up, so it sits
 * above clinic rates and below the top of the home-visit range.
 */
export const FEES = {
  initial: { label: "First home visit (up to 45 minutes)", price: 170 },
  followUp: { label: "Follow-up home visit (up to 30 minutes)", price: 150 },
  nailSurgery: {
    label: "Nail surgery at home (includes two follow-up visits)",
    price: 500,
  },
  orthotics: { label: "Custom orthotics (pair)", price: 560 },
} as const;

/** Medicare, from 1 July 2026. MBS item 10962: schedule fee $74.55, benefit 85%. */
export const MEDICARE = {
  item: "10962",
  scheduleFee: 74.55,
  rebate: 63.4,
  servicesPerYear: 5,
  minimumMinutes: 20,
} as const;

/** NDIS Pricing Arrangements 2026–27. Provider travel is half the support rate. */
export const NDIS = {
  item: "15_619_0128_1_3",
  hourly: 188.99,
  /** 45 minutes and 30 minutes at the hourly limit, rounded to the cent I invoice. */
  threeQuarterHour: 141.74,
  halfHour: 94.5,
  /** Provider travel for therapy supports is half the support rate. */
  travelHourly: 94.5,
} as const;

/**
 * One table, every funding route side by side — what YOU pay, not what the funder pays.
 *
 * Built here rather than in the component so it reads from the same FEES and MEDICARE
 * constants as the six individual tables. A comparison table that disagrees with the
 * table one scroll below it is worse than no comparison table.
 *
 * "$0" means the funder pays in full and nothing reaches you.
 */
export const FEE_COMPARISON = {
  columns: [
    { key: "privately", label: "Privately", href: "/paying-privately" },
    { key: "medicare", label: "Medicare", href: "/medicare-podiatry" },
    { key: "dva", label: "DVA", href: "/dva-podiatry" },
    { key: "ndis", label: "NDIS", href: "/ndis-podiatry" },
    { key: "health", label: "Health fund", href: "/private-health-podiatry" },
    { key: "hcp", label: "Home Care", href: "/home-care-package-podiatry" },
  ],
  rows: [
    {
      service: "First home visit (up to 45 minutes)",
      privately: `$${FEES.initial.price}`,
      medicare: `$${(FEES.initial.price - MEDICARE.rebate).toFixed(2)}`,
      dva: "$0",
      ndis: "$0",
      health: "Less your rebate",
      hcp: "$0",
    },
    {
      service: "Follow-up home visit (up to 30 minutes)",
      privately: `$${FEES.followUp.price}`,
      medicare: `$${(FEES.followUp.price - MEDICARE.rebate).toFixed(2)}`,
      dva: "$0",
      ndis: "$0",
      health: "Less your rebate",
      hcp: "$0",
    },
    {
      service: "Nail surgery at home (includes two follow-ups)",
      privately: `$${FEES.nailSurgery.price}`,
      medicare: "Not covered",
      dva: "$0",
      ndis: "$0",
      health: "Less your rebate",
      hcp: "Provider approval",
    },
    {
      service: "Custom orthotics (pair)",
      privately: `$${FEES.orthotics.price}`,
      medicare: "Not covered",
      dva: "$0",
      ndis: "Ask your plan",
      health: "Less your rebate",
      hcp: "Provider approval",
    },
    {
      service: "Travel outside the standard visiting area",
      privately: "Per kilometre",
      medicare: "Per kilometre",
      dva: "$0",
      ndis: "$0",
      health: "Item 550",
      hcp: "$0",
    },
  ],
  notes: [
    "Every figure is what YOU pay. $0 means the funder pays in full and nothing reaches you.",
    "Medicare covers five visits a calendar year, shared across all your allied health providers. After the fifth you pay the private fee.",
    "Health fund rebates vary by fund and level of cover, so the amount left to pay does too. Ring your fund with the item number on the private health page.",
    "NDIS visits are billed by time against the $188.99 hourly limit, not at the flat private fee. Orthotics usually come from an assistive technology budget, not from therapy supports.",
    "Nail surgery and orthotics under a Home Care Package need your provider's approval first. Once approved, you pay nothing.",
  ],
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
  /** Funding pages carry a price table; service and problem pages do not. */
  pricing?: PricingBlock;
}

export interface PricingRow {
  service: string;
  /** The funder's item number, where the funder has one. */
  item?: string;
  /** What the service costs before any rebate. */
  fee: string;
  /** What the funder pays. Omitted on the private-fee page, which has no funder. */
  funder?: string;
  /** What actually lands on the patient. */
  youPay: string;
}

export interface PricingBlock {
  heading: string;
  intro: string;
  /** Column head for the funder column — "Medicare pays", "DVA pays". */
  funderLabel?: string;
  rows: PricingRow[];
  /** The conditions. Prices without their conditions are misleading, not helpful. */
  notes: string[];
  /** Where each figure came from, so anyone can check it. */
  sources: { label: string; href: string }[];
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
      {
        q: "Do I pay a contribution towards podiatry?",
        a: "No. Podiatry is a clinical support under Support at Home, and the government funds clinical supports in full. Contributions apply to independence and everyday living services — cleaning, gardening, personal care — not to allied health.",
      },
      {
        q: "Is your fee the same as the private price list?",
        a: "No. Your provider is invoiced under Support at Home, not you, and the rate is agreed with them. It comes out of your quarterly budget rather than your pocket.",
      },
    ],
    pricing: {
      heading: "What it costs you",
      intro:
        "Podiatry is a clinical support. Under Support at Home the government funds clinical supports in full, so there is no contribution from you for the visit itself.",
      funderLabel: "Your budget pays",
      rows: [
        { service: "First home visit (up to 45 minutes)", fee: "Invoiced to your provider", funder: "In full", youPay: "$0" },
        { service: "Follow-up home visit (up to 30 minutes)", fee: "Invoiced to your provider", funder: "In full", youPay: "$0" },
        { service: "Travel inside the standard visiting area", fee: "Included", funder: "Included", youPay: "$0" },
      ],
      notes: [
        "Support at Home replaced Home Care Packages on 1 November 2025. Podiatry sits in the clinical supports category.",
        "The government funds clinical supports in full. Participant contributions apply to independence and everyday living services, not to allied health or nursing.",
        "The visit is drawn from your quarterly Support at Home budget, so it is not unlimited. A visit every six to eight weeks is a small part of most budgets.",
        "If you self-manage, you can book me directly and put the invoice through your provider. If your provider manages your package, give them my details and they will arrange it.",
        "Custom orthotics and nail surgery are quoted separately and may need your provider's approval first.",
      ],
      sources: [
        { label: "Department of Health — Support at Home participant contributions", href: "https://www.health.gov.au/our-work/support-at-home/charging-for-support-at-home-services/support-at-home-participant-contributions" },
        { label: "My Aged Care — Support at Home costs and contributions", href: "https://www.myagedcare.gov.au/support-at-home-costs-and-contributions" },
      ],
    },
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
    pricing: {
      heading: "What DVA pays, and what you pay",
      intro:
        "These are DVA's own fees for podiatry, effective 1 January 2026. DVA pays them in full. My private fees do not apply to you.",
      funderLabel: "DVA pays",
      rows: [
        { service: "First home visit (starts a treatment cycle)", item: "F024", fee: "$106.65", funder: "$106.65", youPay: "$0" },
        { service: "Follow-up home visit", item: "F033", fee: "$94.60", funder: "$94.60", youPay: "$0" },
        { service: "Short home visit, up to 15 minutes", item: "F031", fee: "$94.60", funder: "$94.60", youPay: "$0" },
        { service: "Nail surgery with matrix sterilisation, one edge or the whole nail — includes two follow-ups", item: "F546 / F547", fee: "$477.05", funder: "$477.05", youPay: "$0" },
        { service: "Each additional nail edge", item: "F548", fee: "$129.15", funder: "$129.15", youPay: "$0" },
        { service: "Nail plate avulsion — includes two follow-ups", item: "F470", fee: "$180.35", funder: "$180.35", youPay: "$0" },
        { service: "Custom moulded orthoses, pair", item: "F222", fee: "$422.65", funder: "$422.65", youPay: "$0" },
        { service: "Travel to your home", item: "—", fee: "Included", funder: "Included in the fee", youPay: "$0" },
      ],
      notes: [
        "You pay nothing. There is no gap, no call-out fee and no travel charge. DVA builds the kilometre allowance into the fee, so I am not permitted to charge you for it.",
        "A treatment cycle is twelve sessions and starts with an initial consultation. When the cycle ends I send a report to your usual GP and, if you still need care, your GP refers you again.",
        "A Gold Card covers any condition. A White Card covers only the condition DVA has accepted — if that condition affects your feet, podiatry is covered.",
        "Orthoses and some other items need DVA's approval before I supply them. I arrange that; you do not have to.",
      ],
      sources: [
        { label: "DVA — Podiatrists schedule of fees, effective 1 January 2026", href: "https://www.dva.gov.au/providers/fees-claims/dental-and-allied-health-fee-schedules" },
        { label: "DVA — information for podiatrists", href: "https://www.dva.gov.au/providers/information-for-dental-psychology-allied-health-providers/podiatrists" },
      ],
    },
  },
  {
    slug: "ndis-podiatry",
    kind: "funding",
    target: "ndis podiatry tweed heads",
    title: "NDIS Podiatry Tweed Heads | Mobile Home Visits",
    description:
      "NDIS podiatry at home in Tweed Heads. Registered NDIS provider — agency-managed, plan-managed and self-managed participants welcome. $188.99 per hour price limit.",
    h1: "NDIS podiatry at home",
    intro:
      "Podiatry sits under Improved Daily Living or Improved Health and Wellbeing in most plans. If getting to appointments is part of what makes things hard, a home visit removes that problem entirely.",
    sections: [
      {
        heading: "Who I can see",
        body: "All three, because I am a registered NDIS provider. Agency-managed, plan-managed and self-managed participants can all book. Agency-managed plans need a registered provider, which rules most mobile podiatrists out.",
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
        a: "Yes. I am a registered NDIS provider, so the NDIA can pay my invoices directly for agency-managed plans.",
      },
      {
        q: "Do you write reports for plan reviews?",
        a: "Yes, on request. Tell me before the visit so I can gather what the report needs.",
      },
      {
        q: "Why is my invoice a different shape to the private price list?",
        a: "The NDIS sets a maximum hourly price and I am not allowed to charge a participant more than it. So your visit is billed by the time it takes, not at my flat private fee. For a half-hour visit that works out cheaper than the private price.",
      },
    ],
    pricing: {
      heading: "What your plan pays",
      intro:
        "The NDIS price limit for podiatry is $188.99 an hour in 2026–27. I bill your plan by the time the visit takes, at or under that limit. You pay nothing out of pocket.",
      funderLabel: "Your plan pays",
      rows: [
        { service: "First home visit, 45 minutes", item: NDIS.item, fee: `$${NDIS.threeQuarterHour.toFixed(2)}`, funder: `$${NDIS.threeQuarterHour.toFixed(2)}`, youPay: "$0" },
        { service: "Follow-up home visit, 30 minutes", item: NDIS.item, fee: `$${NDIS.halfHour.toFixed(2)}`, funder: `$${NDIS.halfHour.toFixed(2)}`, youPay: "$0" },
        { service: "Travel to and from you, per hour", item: NDIS.item, fee: `$${NDIS.travelHourly.toFixed(2)}`, funder: `$${NDIS.travelHourly.toFixed(2)}`, youPay: "$0" },
      ],
      notes: [
        "$188.99 an hour is the national price limit for podiatry under Therapeutic Supports. I do not charge above it.",
        "Provider travel for therapy supports is billed at half the support rate, so $94.50 an hour. I only claim travel where your plan allows it, and I tell you before the first visit what it will be.",
        "Podiatry usually sits under Capacity Building — Improved Daily Living, or Improved Health and Wellbeing. Your plan manager can confirm which line yours comes from.",
        "Registered NDIS provider, so agency-managed, plan-managed and self-managed participants can all book.",
      ],
      sources: [
        { label: "NDIS — pricing arrangements and price limits", href: "https://www.ndis.gov.au/providers/pricing-arrangements" },
      ],
    },
  },
  {
    slug: "medicare-podiatry",
    kind: "funding",
    target: "medicare podiatry rebate home visit",
    title: "Medicare Rebate for Podiatry | Tweed Heads Home Visits",
    description:
      "Up to five Medicare-rebated podiatry visits a year with a GP chronic condition management plan. MBS item 10962 pays $63.40 a visit. Home visits across Tweed Heads and Northern NSW.",
    h1: "Using Medicare for podiatry at home",
    intro:
      "If your GP has you on a chronic condition management plan, Medicare pays part of up to five allied health visits a year. Podiatry is one of them. Here is exactly what that leaves you paying.",
    sections: [
      {
        heading: "How you become eligible",
        body: "Your GP decides. If you have a chronic condition — diabetes, arthritis, peripheral vascular disease, anything that has lasted or will last six months or more — your GP can prepare a GP chronic condition management plan and refer you for allied health. Ask at your next appointment. I cannot arrange it for you, and neither can any podiatrist.",
      },
      {
        heading: "Five visits, not five podiatry visits",
        body: "The five services are shared across every allied health provider on your plan. Four podiatry visits and one dietitian visit uses all five. The count resets on 1 January, not on the anniversary of your plan.",
      },
      {
        heading: "Why home visits are not bulk billed",
        body: "The Medicare rebate of $63.40 does not cover a visit that includes driving to you, carrying the equipment in and setting up at your table. So I charge the full fee and Medicare pays you back part of it. You are never surprised: the gap is on this page before you book.",
      },
      {
        heading: "How you get the money back",
        body: "I can lodge the claim on the spot from my phone through Tyro Health, and the rebate goes to your bank account, usually the next business day. If you would rather, I give you an itemised receipt and you claim it yourself through the Medicare app.",
      },
    ],
    faqs: [
      {
        q: "How much do I get back?",
        a: "$63.40 a visit. That is the Medicare benefit for item 10962 from 1 July 2026. It is the same amount whether the visit is your first or your fifth.",
      },
      {
        q: "Do I need a new plan every year?",
        a: "Your plan needs to have been prepared or reviewed in the last 18 months. Your GP will usually review it yearly as part of your normal care.",
      },
      {
        q: "I have an older GP Management Plan and Team Care Arrangements. Do they still work?",
        a: "Yes, until 30 June 2027, if they were prepared before 1 July 2025. After that your GP moves you to the newer chronic condition management plan.",
      },
      {
        q: "Can I use Medicare and my private health fund for the same visit?",
        a: "No. One visit, one rebate. Work out which gives you more back and use that one. I can tell you which is likely to be better once I know your fund.",
      },
      {
        q: "What happens after the fifth visit?",
        a: "You pay the full fee, or your private health extras cover part of it. Most people on routine nail and skin care come every six to eight weeks, so five rebated visits covers most of the year.",
      },
    ],
    pricing: {
      heading: "What Medicare pays, and what you pay",
      intro:
        `Medicare item ${MEDICARE.item} has a schedule fee of $${MEDICARE.scheduleFee} and pays a benefit of $${MEDICARE.rebate.toFixed(2)}. That benefit comes off my fee.`,
      funderLabel: "Medicare pays",
      rows: [
        { service: FEES.initial.label, item: MEDICARE.item, fee: `$${FEES.initial.price}`, funder: `$${MEDICARE.rebate.toFixed(2)}`, youPay: `$${(FEES.initial.price - MEDICARE.rebate).toFixed(2)}` },
        { service: FEES.followUp.label, item: MEDICARE.item, fee: `$${FEES.followUp.price}`, funder: `$${MEDICARE.rebate.toFixed(2)}`, youPay: `$${(FEES.followUp.price - MEDICARE.rebate).toFixed(2)}` },
        { service: "Sixth and later visits in the same calendar year", item: "—", fee: `$${FEES.followUp.price}`, funder: "$0", youPay: `$${FEES.followUp.price}` },
      ],
      notes: [
        "Five rebated services per calendar year, shared across every allied health provider on your plan — not five each.",
        "The visit must run at least 20 minutes and must be recommended in your plan.",
        "Home visits are not bulk billed. You pay the full fee and the rebate comes back to you.",
        "Nail surgery and orthotics are not covered by this item. They are private fees, and your health fund extras may cover part of them.",
      ],
      sources: [
        { label: "MBS — item 10962", href: "https://www9.health.gov.au/mbs/fullDisplay.cfm?type=item&q=10962" },
        { label: "Services Australia — chronic condition allied health billing rules", href: "https://www.servicesaustralia.gov.au/mbs-billing-rules-for-chronic-condition-allied-health-and-other-primary-health-care-items" },
      ],
    },
  },
  {
    slug: "private-health-podiatry",
    kind: "funding",
    target: "private health rebate podiatry home visit",
    title: "Private Health Rebates for Podiatry | Tweed Heads Home Visits",
    description:
      "Claim your extras cover for a podiatry home visit on the spot — no terminal needed. Item numbers, what your fund pays, and what is left to pay. Tweed Heads and Northern NSW.",
    h1: "Claiming your health fund for a home visit",
    intro:
      "If you hold extras cover with podiatry on it, your fund pays part of every visit. I claim it on the spot and you pay only the balance.",
    sections: [
      {
        heading: "You do not need me to have a HICAPS terminal",
        body: "HICAPS is a countertop terminal, which is no use in your lounge room. I claim through Tyro Health instead, from my phone. It reaches the same funds — Medibank, ahm, nib, Bupa, GMHBA and more — and it settles while I am still with you. You pay the gap by card, not the whole fee.",
      },
      {
        heading: "Home visits have their own item numbers",
        body: "Funds pay a different amount for a visit in your home than for one in a clinic. The domiciliary item numbers are 023 and 024 for a new patient and 033 and 034 for someone I already see. Item 550 covers travel time in fifteen-minute blocks. Not every fund pays on 550 — I check yours before the first visit.",
      },
      {
        heading: "How much you get back",
        body: "That depends on your fund and your level of extras, and I cannot quote it for you. What I can do is give you the item number before you book so you can ring your fund and ask exactly what they pay on it. Most extras policies also have an annual limit for podiatry.",
      },
      {
        heading: "One rebate per visit",
        body: "You cannot claim Medicare and your health fund for the same visit. If you are on a GP chronic condition management plan, compare the $63.40 Medicare rebate against what your fund pays and use whichever is higher.",
      },
    ],
    faqs: [
      {
        q: "Can you claim on the spot without a terminal?",
        a: "Yes. Tyro Health runs on my phone and claims to your fund while I am there. You pay the gap by card.",
      },
      {
        q: "What item number will you use?",
        a: "For a first home visit, 023 or 024 depending on how long it takes. For later visits, 033 or 034. Ring your fund with that number and they will tell you the exact rebate.",
      },
      {
        q: "Does my fund cover nail surgery?",
        a: "Many do, under items 546 and 547. Ask your fund, because the rebate on a surgical item is often on a separate limit to ordinary consultations.",
      },
      {
        q: "Do you charge for travel?",
        a: "Not inside the standard visiting area. Beyond it there is a per-kilometre charge, quoted before you book. Some funds pay part of it under item 550.",
      },
    ],
    pricing: {
      heading: "Fees and the item numbers to quote your fund",
      intro:
        "These are my fees. What your fund pays depends on your policy, so ring them with the item number and ask.",
      funderLabel: "Your fund pays",
      rows: [
        { service: "First home visit (up to 45 minutes)", item: "023 or 024", fee: `$${FEES.initial.price}`, funder: "Ask your fund", youPay: `$${FEES.initial.price} less your rebate` },
        { service: "Follow-up home visit (up to 30 minutes)", item: "033 or 034", fee: `$${FEES.followUp.price}`, funder: "Ask your fund", youPay: `$${FEES.followUp.price} less your rebate` },
        { service: "Nail surgery at home — includes two follow-ups", item: "546 / 547", fee: `$${FEES.nailSurgery.price}`, funder: "Ask your fund", youPay: `$${FEES.nailSurgery.price} less your rebate` },
        { service: "Custom orthotics, pair", item: "221", fee: `$${FEES.orthotics.price}`, funder: "Ask your fund", youPay: `$${FEES.orthotics.price} less your rebate` },
        { service: "Travel outside the standard area, per 15 minutes", item: "550", fee: "Quoted before you book", funder: "Not all funds pay this", youPay: "The balance" },
      ],
      notes: [
        "Item numbers come from the podiatry schedule agreed between Private Healthcare Australia and the Australian Podiatry Association, in force since 1 September 2024.",
        "Rebates and annual limits vary by fund and by level of cover. I will not guess yours — ring your fund with the item number.",
        "One rebate per visit. Medicare or your fund, not both.",
      ],
      sources: [
        { label: "HICAPS — podiatry item number guide", href: "https://www.hicaps.com.au/support/item-codes" },
        { label: "Private Healthcare Australia — podiatry schedule", href: "https://privatehealthcareaustralia.org.au/podiatry-schedule-faq/" },
      ],
    },
  },
  {
    slug: "paying-privately",
    kind: "funding",
    target: "podiatry home visit price tweed heads",
    title: "Podiatry Home Visit Prices | Tweed Heads & Northern NSW",
    description:
      "Home visit podiatry prices in Tweed Heads: $170 first visit, $150 follow-up, $500 nail surgery, $560 custom orthotics. No referral needed, no waiting list.",
    h1: "Paying privately — the whole price list",
    intro:
      "No referral, no plan, no waiting list. Ring or fill in the form and I come to you. Here is what it costs, in full, before you book.",
    sections: [
      {
        heading: "What a first visit includes",
        body: "About 45 minutes. I bring sterile instruments, a nail drill for thickened nails, dressings and a portable chair if there is nowhere suitable to sit. We go through your history, I check circulation and sensation, treat the nails, corns and callus, and leave you with a plan for next time.",
      },
      {
        heading: "What a follow-up includes",
        body: "About 30 minutes of the same treatment, without the full assessment. Most people on routine nail and skin care come back every six to eight weeks. I will tell you what suits your feet rather than sell you a schedule.",
      },
      {
        heading: "Travel outside the standard area",
        body: "Tweed Heads, Banora Point, Terranora, Kingscliff, Cabarita Beach, Pottsville, Murwillumbah and Coolangatta carry no travel charge. Past those, there is a per-kilometre charge based on the distance beyond the area. Send your address through the form and I will quote it before you commit to anything.",
      },
      {
        heading: "Paying",
        body: "Card on the day, from my phone. If you have extras cover I claim it on the spot and you pay only the gap. If you are on a GP chronic condition management plan I can lodge the Medicare claim at the same time.",
      },
    ],
    faqs: [
      {
        q: "Do I need a referral?",
        a: "No. Anyone can book a podiatrist directly. A referral only matters if you want a Medicare rebate or you are a DVA client.",
      },
      {
        q: "Is the price different for a pensioner?",
        a: "The fee is the same for everyone. What changes is what comes back to you — a chronic condition management plan is usually the biggest single saving, so it is worth asking your GP.",
      },
      {
        q: "What does nail surgery cost at home?",
        a: "$500, and that includes the two follow-up visits to check the toe and change the dressing. It covers a single edge or the whole nail, with the matrix treated so it does not grow back.",
      },
      {
        q: "How much are orthotics?",
        a: "$560 for a pair, custom made from a cast of your feet. That includes the assessment, the casting, the fitting and a review once you have worn them in.",
      },
    ],
    pricing: {
      heading: "Price list",
      intro:
        "Every price here is the whole price. There is no booking fee, no call-out fee inside the standard area, and no charge for the equipment I bring.",
      rows: [
        { service: "First home visit (up to 45 minutes)", fee: `$${FEES.initial.price}`, youPay: `$${FEES.initial.price}` },
        { service: "Follow-up home visit (up to 30 minutes)", fee: `$${FEES.followUp.price}`, youPay: `$${FEES.followUp.price}` },
        { service: "Nail surgery at home — includes two follow-up visits", fee: `$${FEES.nailSurgery.price}`, youPay: `$${FEES.nailSurgery.price}` },
        { service: "Custom orthotics, pair", fee: `$${FEES.orthotics.price}`, youPay: `$${FEES.orthotics.price}` },
        { service: "Travel outside the standard visiting area", fee: "Per kilometre", youPay: "Quoted before you book" },
      ],
      notes: [
        "Prices apply from 21 August 2026 and include GST where GST applies.",
        "A Medicare rebate of $63.40 a visit, a DVA card or private health extras all reduce what you actually pay. The pages linked below set out each one.",
        "For an out-of-area quote, send your address through the enquiry form and I will come back with the figure before you book.",
      ],
      sources: [],
    },
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

/**
 * Suburbs with a page of their own — the places people actually type into a search.
 *
 * Deliberately about twenty and not the 175 named localities inside the radius. Dozens of
 * near-identical suburb pages is the doorway-page pattern, and Google demotes the whole
 * site for it. The rest are named in EXTRA_LOCALITIES on the areas page instead, which
 * answers "do you come to my street?" without manufacturing thin pages.
 *
 * Coordinates and postcodes were geocoded against OpenStreetMap on 21 August 2026, not
 * typed from memory.
 */
export const SUBURBS: SuburbDef[] = [
  { slug: "tweed-heads", name: "Tweed Heads", postcode: "2485",
    note: "The base for this practice, so appointments here are the easiest to fit in — often within the same week." },
  { slug: "tweed-heads-south", name: "Tweed Heads South", postcode: "2486",
    note: "Between the Tweed River and the Terranora Broadwater, and part of the same daily run as Tweed Heads itself." },
  { slug: "tweed-heads-west", name: "Tweed Heads West", postcode: "2485",
    note: "On the western side of the Terranora Inlet, and covered on the Tweed Heads run." },
  { slug: "banora-point", name: "Banora Point", postcode: "2486",
    note: "A short drive from Tweed Heads, with a large retired population and several villages I visit regularly." },
  { slug: "terranora", name: "Terranora", postcode: "2486",
    note: "Hilly and spread out, which is exactly where getting to a clinic is hardest and a home visit earns its keep." },
  { slug: "bilambil-heights", name: "Bilambil Heights", postcode: "2486",
    note: "Up in the hills behind Tweed Heads, where steep driveways and internal stairs make a clinic trip the hardest part of the day." },
  { slug: "chinderah", name: "Chinderah", postcode: "2487",
    note: "On the river between the highway and the coast, and covered on the way south to Kingscliff." },
  { slug: "fingal-head", name: "Fingal Head", postcode: "2487",
    note: "Out on the headland past Chinderah, grouped with the Kingscliff run." },
  { slug: "cudgen", name: "Cudgen", postcode: "2487",
    note: "On the red soil ridge behind Kingscliff, and covered on the same coastal run." },
  { slug: "kingscliff", name: "Kingscliff", postcode: "2487",
    note: "Visited on a set run down the coast road, so Kingscliff appointments usually sit together on the same day." },
  { slug: "casuarina", name: "Casuarina", postcode: "2487",
    note: "Between Kingscliff and Cabarita on the coast road, so it sits in the middle of the same run." },
  { slug: "cabarita-beach", name: "Cabarita Beach", postcode: "2488",
    note: "Grouped with the Kingscliff and Pottsville coastal run. Bogangar is the same locality and is covered with it." },
  { slug: "hastings-point", name: "Hastings Point", postcode: "2489",
    note: "Between Cabarita Beach and Pottsville on the coast road, and grouped with both." },
  { slug: "pottsville", name: "Pottsville", postcode: "2489",
    note: "At the southern end of the coastal run, so Pottsville visits are grouped onto particular days." },
  { slug: "murwillumbah", name: "Murwillumbah", postcode: "2484",
    note: "Inland from the coast, and covered on the same day as the surrounding valley." },
  { slug: "uki", name: "Uki", postcode: "2484",
    note: "In the valley under Wollumbin, and covered on the same day as Murwillumbah." },
  { slug: "burringbar", name: "Burringbar", postcode: "2483",
    note: "On the Tweed Valley Way between Mooball and Stokers Siding, and close to the centre of the area I cover." },
  { slug: "ocean-shores", name: "Ocean Shores", postcode: "2483",
    note: "At the southern end of the area, above Brunswick Heads, and grouped with it." },
  { slug: "brunswick-heads", name: "Brunswick Heads", postcode: "2483",
    note: "The southern edge of the run, visited on the same day as Ocean Shores and Mullumbimby." },
  { slug: "mullumbimby", name: "Mullumbimby", postcode: "2482",
    note: "Inland from Brunswick Heads, and covered on the same southern run." },
  { slug: "coolangatta", name: "Coolangatta", postcode: "4225",
    note: "Just over the border, and close enough to Tweed Heads that it is part of the standard run." },
  { slug: "tugun", name: "Tugun", postcode: "4224",
    note: "The northern edge of the area, a short run up the coast from Coolangatta." },
];

/**
 * Every other named locality within 26 km of Burringbar, from OpenStreetMap. Listed as
 * plain text on the areas page: no page, no link, no thin content — just an answer.
 */
export const EXTRA_LOCALITIES: string[] = [
  "Bilambil", "Billinudgel", "Bray Park", "Bungalora", "Byangum",
  "Byrrill Creek", "Carool", "Cedar Creek", "Chillingham", "Chowan Creek",
  "Clothiers Creek", "Cobaki", "Commissioners Creek", "Condong", "Coorabell",
  "Crabbes Creek", "Crystal Creek", "Cudgera Creek", "Doon Doon", "Dulguigan",
  "Dum Dum", "Dunbible", "Dungay", "Duranbah", "Duroby",
  "Durrumbul", "Eungella", "Eviron", "Farrants Hill", "Fernvale",
  "Glen Warning", "Glengarrie", "Goonengerry", "Huonbrook", "Kielvale",
  "Kings Forest", "Kunghur", "Kunghur Creek", "Kynnumboon", "Main Arm",
  "Middle Pocket", "Midginbil", "Montecollum", "Mooball", "Mullumbimby Creek",
  "Myocum", "New Brighton", "Nobbys Creek", "North Arm", "North Tumbulgum",
  "Nunderi", "Palmvale", "Palmwoods", "Piggabeen", "Repentance Creek",
  "Reserve Creek", "Round Mountain", "Rowlands Creek", "Salt", "Sleepy Hollow",
  "Smiths Creek", "South Golden Beach", "South Murwillumbah", "Stokers Siding", "Stotts Creek",
  "Tanglewood", "Terragon", "The Pocket", "Tomewin", "Tumbulgum",
  "Tyagarah", "Tygalgah", "Upper Bilambil", "Upper Coopers Creek", "Upper Crystal Creek",
  "Upper Dungay", "Upper Duroby", "Upper Main Arm", "Upper Wilsons Creek", "Urliup",
  "Wanganui", "Wilsons Creek", "Wooyung", "Yelgun", "Zara",
];


export const ALL_PAGES: PageDef[] = [
  ...SERVICE_PAGES,
  ...FUNDING_PAGES,
  ...PROBLEM_PAGES,
];

export function pageBySlug(slug: string): PageDef | undefined {
  return ALL_PAGES.find((p) => p.slug === slug);
}
