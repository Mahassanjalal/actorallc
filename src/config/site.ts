/* ------------------------------------------------------------------------- *
 * ACTORA — CENTRAL SITE SETTINGS
 *
 * Everything a non-developer is likely to change lives in this file.
 * Values marked PLACEHOLDER are intentionally editable stand-ins. Replace
 * them with verified company information before launch, then set
 * `contentNotice.enabled` to false.
 *
 * Do not add claims (clients, awards, testimonials, metrics, history) that
 * the company cannot verify. Sample case studies are flagged with
 * `sample: true` and are labelled as samples in the interface.
 * ------------------------------------------------------------------------- */

const env = import.meta.env;

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export type SocialPlatform =
  | "linkedin"
  | "instagram"
  | "x"
  | "vimeo"
  | "youtube"
  | "behance"
  | "github";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

export interface ServiceConfig {
  slug: string;
  index: string;
  title: string;
  summary: string;
  description: string[];
  outcomes: string[];
  deliverables: string[];
  idealFor: string;
  /** True until the studio confirms this is a real service offering. */
  placeholder: boolean;
}

export interface ProcessStep {
  index: string;
  title: string;
  duration: string;
  description: string;
  points: string[];
}

export interface WorkSample {
  slug: string;
  title: string;
  discipline: string;
  year: string;
  summary: string;
  context: string;
  approach: string;
  outcome: string;
  capabilities: string[];
  /** Sample layouts are clearly labelled and must be replaced before launch. */
  sample: boolean;
  art: { from: string; to: string; accent: string; seed: number };
}

export const site = {
  /* ---------------------------------------------------------------- brand */
  name: "Actora",
  legalName: "Actora LLC",
  wordmark: "ACTORA",
  tagline:
    "An independent design and technology studio in Austin, Texas.", // PLACEHOLDER positioning
  description:
    "Actora LLC is a design and technology studio in Austin, Texas, creating brand systems, digital products and web platforms.",
  headline: {
    lead: "We design what",
    serif: "comes next",
    tail: ".",
  },
  heroSupport:
    "Actora is a design and technology studio in Austin, Texas. We build identities, products, and platforms for people who intend to matter.",
  statement:
    "Most work disappears. We make the kind that stays in the room — considered, engineered, and impossible to mistake for anyone else's.",
  austin: {
    locality: "Austin",
    region: "TX",
    regionName: "Texas",
    country: "US",
    coordinates: { lat: "30.2672° N", lng: "97.7431° W" },
  },

  /* ------------------------------------------------------------- contact */
  // PLACEHOLDER addresses. Replace with live mailboxes before launch.
  email: {
    general: "hello@actorallc.example",
    projects: "projects@actorallc.example",
    contracts: "contracts@actorallc.example",
    privacy: "privacy@actorallc.example",
  },
  phone: null as string | null,
  social: [] as SocialLink[],
  newsletter: {
    enabled: false,
    note: "Newsletter signup is hidden until an email platform is configured.",
  },

  /* ------------------------------------------------------------ endpoints */
  // Public URLs only. Provider keys never belong in the browser bundle.
  endpoints: {
    inquiry: trimTrailingSlash(env.VITE_INQUIRY_ENDPOINT ?? ""),
    contractApi: trimTrailingSlash(
      env.VITE_CONTRACT_API_ENDPOINT ?? env.VITE_INQUIRY_ENDPOINT ?? "",
    ),
  },

  /* ------------------------------------------------------------------ seo */
  url: trimTrailingSlash(env.VITE_SITE_URL ?? "https://actorallc.example"),
  ogImage: "/og.png",
  locale: "en_US",

  /* ----------------------------------------------------------- navigation */
  nav: [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Insights", href: "/insights" },
    { label: "Contact", href: "/contact" },
  ],
  footerNav: {
    Studio: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Work", href: "/work" },
      { label: "Insights", href: "/insights" },
    ],
    Start: [
      { label: "Start a project", href: "/start-a-project" },
      { label: "Contact", href: "/contact" },
      { label: "Contracts", href: "/contracts" },
      { label: "Client signing", href: "/contracts#signing" },
    ],
    Legal: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of use", href: "/terms" },
    ],
  },

  /* ------------------------------------------------------------ legal/ops */
  legal: {
    privacyUpdated: "2026-10-23",
    termsUpdated: "2026-10-23",
    jurisdiction: "Texas, United States",
    retentionMonths: 24,
    // Optional registered address. Leave null to publish Austin, TX only.
    registeredAddress: null as string | null,
  },

  /* -------------------------------------------------------------- content */
  contentNotice: {
    enabled: true,
    message:
      "Preview build — sample copy, sample case studies and placeholder contact details. Company-approved content is required before launch.",
  },

  // Add members only when the studio supplies names, roles and photos.
  team: [] as Array<{ name: string; role: string; bio: string }>,

  /* ------------------------------------------------ external integrations */
  integrations: {
    emailProvider: "Resend",
    signatureProvider: "Dropbox Sign",
    // Disclosure shown on /contracts. Keep accurate if the provider changes.
    signatureProviderDisclosure:
      "Contracts are issued and signed through a third-party e-signature provider (Dropbox Sign by default). Actora LLC reviews executed documents in the provider's dashboard.",
  },
} as const;

export const services: ServiceConfig[] = [
  {
    slug: "brand-identity",
    index: "01",
    title: "Brand & Identity",
    summary:
      "Positioning, naming support and identity systems that give ambitious companies a language of their own.",
    description: [
      "A brand is a decision-making system. We build it with you: positioning that can survive a board meeting, a visual language that holds up at any size, and guidelines your team will actually use.",
      "Engagements are led by a small senior team. Research, strategy, identity, and the first applications are developed together so the system is proven before it is handed over.",
    ],
    outcomes: [
      "A clear, defensible market position",
      "Identity system with type, colour and motion rules",
      "Applications for the moments that matter most",
    ],
    deliverables: [
      "Positioning and messaging framework",
      "Logo suite and visual identity system",
      "Brand guidelines and asset library",
    ],
    idealFor: "Companies at a launch, repositioning or funding milestone.",
    placeholder: true,
  },
  {
    slug: "digital-product",
    index: "02",
    title: "Digital Product",
    summary:
      "Product strategy, interaction design and interface systems for software people choose to keep using.",
    description: [
      "We work on the product itself: the flows, the interface language, and the details that decide whether someone trusts what they are using.",
      "Discovery is hands-on. We prototype early, test with real people, and ship a system rather than a one-off screen set.",
    ],
    outcomes: [
      "A tested product direction, not a deck",
      "Interface system ready for engineering",
      "Clear patterns for future features",
    ],
    deliverables: [
      "Product strategy and flow mapping",
      "Interactive prototypes and usability testing",
      "Design system and component specifications",
    ],
    idealFor: "Teams building or reworking a core product experience.",
    placeholder: true,
  },
  {
    slug: "web-platforms",
    index: "03",
    title: "Web & Platforms",
    summary:
      "Fast, accessible, maintainable websites and platforms — engineered to hold up under real traffic and real teams.",
    description: [
      "We build the production layer: static-first front ends, typed component systems, and integrations that keep content teams independent of engineering.",
      "Performance, accessibility, and security are budgeted from the first sprint, then verified in CI before anything ships.",
    ],
    outcomes: [
      "Measurable speed and accessibility gains",
      "A codebase your team can extend",
      "Deployment pipelines with review built in",
    ],
    deliverables: [
      "Design-system-driven front-end build",
      "Content model and publishing workflow",
      "CI/CD, monitoring and handover documentation",
    ],
    idealFor: "Marketing sites, platforms and internal tools that must endure.",
    placeholder: true,
  },
  {
    slug: "film-motion",
    index: "04",
    title: "Film & Motion",
    summary:
      "Art direction, motion identity and product film for brands that need to be felt, not just read.",
    description: [
      "Motion is part of the identity, not a decoration applied afterwards. We define how the brand moves, then produce the films and interface motion that carry it.",
      "Every sequence is designed for its context — a launch film, a product walkthrough, or the micro-motion inside an interface.",
    ],
    outcomes: [
      "A motion language that matches the brand",
      "Launch and product films ready for distribution",
      "Reusable animation specifications for product teams",
    ],
    deliverables: [
      "Motion direction and storyboards",
      "Production and post for launch films",
      "Interface motion tokens and specs",
    ],
    idealFor: "Launches, campaigns and product storytelling.",
    placeholder: true,
  },
];

export const process: ProcessStep[] = [
  {
    index: "01",
    title: "Signal",
    duration: "Week 1–2",
    description:
      "We start by listening — to your team, your customers, and the market. Then we agree on the single idea the work has to prove.",
    points: [
      "Stakeholder and customer interviews",
      "Competitive and category audit",
      "A written brief with success measures",
    ],
  },
  {
    index: "02",
    title: "Shape",
    duration: "Week 2–4",
    description:
      "Strategy becomes something you can see. We explore directions in parallel, test the strongest one, and commit together.",
    points: ["Territory development", "Prototypes over presentations", "A decision log you keep"],
  },
  {
    index: "03",
    title: "Build",
    duration: "Week 4–8",
    description:
      "Design and engineering work in the same room. We build the production system as we design it, so nothing is lost in handover.",
    points: ["Weekly working sessions", "Accessible, typed components", "Performance budgets in CI"],
  },
  {
    index: "04",
    title: "Launch",
    duration: "Week 8+",
    description:
      "We ship, measure, and stay close. After launch we review real behaviour and tune what matters.",
    points: ["Deployment runbook and training", "Post-launch measurement", "Ongoing partnership if useful"],
  },
];

export const values = [
  {
    title: "Clarity over volume",
    body: "Fewer, better decisions. Every element has a job, and the work is stronger for what it leaves out.",
  },
  {
    title: "Craft is a discipline",
    body: "Typography, motion, performance and accessibility are not finishing touches. They are the work.",
  },
  {
    title: "Build in the open",
    body: "No black boxes. You see the process, the prototypes and the trade-offs while they are still changeable.",
  },
  {
    title: "Leave it stronger",
    body: "The best outcome is a team that can carry the system forward without us in the room.",
  },
];

export const work: WorkSample[] = [
  {
    slug: "northlight",
    title: "Northlight",
    discipline: "Brand + Digital Product",
    year: "Sample",
    summary:
      "A sample case-study layout showing how a brand system and product interface could be presented together.",
    context:
      "This is placeholder content used to demonstrate the case-study structure. Replace it with a verified project: who the client is, the situation they were in, and the constraint that made the problem interesting.",
    approach:
      "Describe the engagement honestly — the research, the directions explored, the decisions made and the trade-offs accepted. Avoid invented metrics.",
    outcome:
      "State the confirmed result, ideally with a number the client has approved for publication. Until then, this sample remains clearly labelled.",
    capabilities: ["Strategy", "Identity", "Product design"],
    sample: true,
    art: { from: "#1a1a22", to: "#07070a", accent: "#ff6a3d", seed: 7 },
  },
  {
    slug: "meridian-atlas",
    title: "Meridian Atlas",
    discipline: "Web Platform",
    year: "Sample",
    summary:
      "A sample platform case study focused on speed, accessibility and a content workflow a small team can run.",
    context:
      "Placeholder case study. Use this space for the real operating context: the existing stack, the team size, the business pressure and the accessibility or performance targets.",
    approach:
      "Replace with how the platform was designed and engineered — architecture choices, component system, editorial tooling, and how the work was validated.",
    outcome:
      "Add only results that were measured and approved for publication. Sample copy intentionally makes no performance or revenue claims.",
    capabilities: ["Design system", "Front-end engineering", "CMS"],
    sample: true,
    art: { from: "#101a1f", to: "#07090b", accent: "#a8c3ff", seed: 19 },
  },
  {
    slug: "afterimage",
    title: "Afterimage",
    discipline: "Film + Motion",
    year: "Sample",
    summary:
      "A sample motion-led launch case study showing film, interface motion and art direction in one narrative.",
    context:
      "Placeholder case study for a launch film and motion identity. Swap in the real brief, audience, and the distribution plan for the finished work.",
    approach:
      "Note the art direction, the production approach, and how the motion language was specified so product teams could reuse it.",
    outcome:
      "Publish confirmed distribution and audience results when available. This sample deliberately claims none.",
    capabilities: ["Art direction", "Motion identity", "Film"],
    sample: true,
    art: { from: "#1c1520", to: "#08070a", accent: "#e0b9ff", seed: 31 },
  },
];

export const serviceBySlug = (slug: string): ServiceConfig | undefined =>
  services.find((service) => service.slug === slug);

export const workBySlug = (slug: string): WorkSample | undefined =>
  work.find((project) => project.slug === slug);

export const hasInquiryEndpoint = Boolean(site.endpoints.inquiry);
export const hasContractApi = Boolean(site.endpoints.contractApi);

/** True while any placeholder content is still present. */
export const isPreview = site.contentNotice.enabled;
