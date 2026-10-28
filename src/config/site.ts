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
  technologies?: string[];
  /** True until the company confirms this is a real service offering. */
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
    "A software and technology company in Austin, Texas.", // PLACEHOLDER positioning
  description:
    "Actora LLC is a software and technology company in Austin, Texas, building custom software solutions, digital products and enterprise platforms.",
  headline: {
    lead: "We build what",
    serif: "comes next",
    tail: ".",
  },
  heroSupport:
    "Actora is a software and technology company in Austin, Texas. We build custom software, digital products, and enterprise platforms for businesses that intend to lead.",
  statement:
    "Most software fades into the background. We build the kind that transforms how businesses operate — engineered, scalable, and impossible to mistake for anyone else's.",
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
    Company: [
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

  // Add members only when the company supplies names, roles and photos.
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
    slug: "custom-software",
    index: "01",
    title: "Custom Software Development",
    summary:
      "Tailored software solutions built to solve your specific business challenges — from internal tools to customer-facing applications.",
    description: [
      "We develop custom software that fits your exact requirements: web applications, desktop tools, and integrated systems that streamline your operations and drive growth.",
      "Every project starts with understanding your business logic, user needs, and technical constraints. We architect for scale, security, and maintainability from day one.",
    ],
    outcomes: [
      "A custom solution that fits your exact workflow",
      "Clean, documented, and testable codebase",
      "System your team can extend and maintain",
    ],
    deliverables: [
      "Requirements analysis and technical specification",
      "Fully functional software application",
      "API documentation and integration guides",
      "Deployment and operations documentation",
    ],
    idealFor: "Businesses with unique workflows that off-the-shelf software cannot address.",
    technologies: ["React", "TypeScript", "Node.js", ".NET", "Python"],
    placeholder: true,
  },
  {
    slug: "web-applications",
    index: "02",
    title: "Web Applications",
    summary:
      "High-performance web applications that deliver exceptional user experiences and handle real-world traffic at scale.",
    description: [
      "We build modern web applications using cutting-edge technologies. From SaaS platforms to complex dashboards, we create applications that are fast, accessible, and reliable.",
      "Our web applications are built with performance and security as core requirements — not afterthoughts. We implement proper authentication, data validation, and error handling.",
    ],
    outcomes: [
      "A fast, responsive web application",
      "Secure authentication and authorization",
      "Scalable architecture for growth",
    ],
    deliverables: [
      "Responsive front-end application",
      "Back-end API and database design",
      "User authentication and role-based access",
      "Performance optimization and monitoring",
    ],
    idealFor: "Companies needing customer-facing web apps or internal business tools.",
    technologies: ["React", "Next.js", "Vue.js", "Node.js", "PostgreSQL", "MongoDB"],
    placeholder: true,
  },
  {
    slug: "enterprise-solutions",
    index: "03",
    title: "Enterprise Solutions",
    summary:
      "Robust enterprise software that integrates with your existing systems and scales with your organization's growth.",
    description: [
      "We design and build enterprise-grade software that connects with your ERP, CRM, and other business systems. Our solutions handle complex workflows, large datasets, and demanding performance requirements.",
      "Enterprise projects include thorough testing, security audits, compliance considerations, and comprehensive documentation to support your IT team.",
    ],
    outcomes: [
      "Integrated enterprise system",
      "Automated business workflows",
      "Enterprise-grade security and compliance",
    ],
    deliverables: [
      "System architecture and integration design",
      "Custom enterprise application",
      "API integrations with existing systems",
      "Security audit and compliance documentation",
      "Training materials and user guides",
    ],
    idealFor: "Mid-size to large organizations needing custom enterprise software or system integration.",
    technologies: ["Enterprise Integration", "Microservices", "Cloud Infrastructure", "Docker", "Kubernetes"],
    placeholder: true,
  },
  {
    slug: "digital-transformation",
    index: "04",
    title: "Digital Transformation",
    summary:
      "Strategic technology consulting and implementation to modernize your business processes and accelerate digital adoption.",
    description: [
      "We help organizations navigate digital transformation — from assessing current systems and identifying opportunities to implementing modern solutions that deliver measurable results.",
      "Our approach combines technical expertise with business understanding. We work with stakeholders at all levels to ensure technology investments deliver real business value.",
    ],
    outcomes: [
      "Modernized business processes",
      "Reduced operational costs",
      "Improved customer and employee experience",
    ],
    deliverables: [
      "Current state assessment and gap analysis",
      "Digital transformation roadmap",
      "Technology stack recommendations",
      "Implementation and change management support",
    ],
    idealFor: "Organizations looking to modernize legacy systems or adopt new technologies.",
    technologies: ["Cloud Migration", "Process Automation", "Data Analytics", "AI/ML Integration"],
    placeholder: true,
  },
];

export const process: ProcessStep[] = [
  {
    index: "01",
    title: "Discovery",
    duration: "Week 1–2",
    description:
      "We start by understanding your business — your workflows, your users, your technical environment, and the problem we need to solve.",
    points: [
      "Stakeholder interviews and requirements gathering",
      "Technical assessment and feasibility analysis",
      "Project scope and success criteria definition",
    ],
  },
  {
    index: "02",
    title: "Design",
    duration: "Week 2–4",
    description:
      "We architect the solution — system design, database schema, API contracts, and user experience. We validate the approach before writing production code.",
    points: ["System architecture design", "Database and API design", "Technical specification document"],
  },
  {
    index: "03",
    title: "Development",
    duration: "Week 4–12",
    description:
      "We build the software iteratively, with regular demos and feedback loops. Every feature is tested, documented, and ready for deployment.",
    points: ["Agile development with sprint reviews", "Automated testing and CI/CD", "Code reviews and documentation"],
  },
  {
    index: "04",
    title: "Deployment",
    duration: "Week 12+",
    description:
      "We deploy to production, train your team, and provide ongoing support. We ensure a smooth transition and monitor performance after launch.",
    points: ["Production deployment and monitoring", "Team training and handover", "Post-launch support and maintenance"],
  },
];

export const values = [
  {
    title: "Engineering excellence",
    body: "We write clean, tested, maintainable code. Every technical decision is made with long-term maintainability in mind.",
  },
  {
    title: "Business-first approach",
    body: "Technology serves business goals. We understand your operations, your users, and your bottom line — and build accordingly.",
  },
  {
    title: "Transparency throughout",
    body: "No black boxes. You see progress, understand trade-offs, and have a clear view of where your project stands at all times.",
  },
  {
    title: "Partnership, not vendor relationship",
    body: "We invest in your success. Our goal is to deliver software that transforms your business and a team that understands how to keep it running.",
  },
];

export const work: WorkSample[] = [
  {
    slug: "inventory-management-system",
    title: "Inventory Management System",
    discipline: "Custom Software Development",
    year: "Sample",
    summary:
      "A custom inventory management system built for a manufacturing company to track materials, automate reordering, and provide real-time visibility across multiple warehouse locations.",
    context:
      "This is placeholder content used to demonstrate the case-study structure. Replace it with a verified project: the client's industry, the specific inventory challenges they faced, and the scale of operations.",
    approach:
      "Describe the technical approach — the architecture chosen, the technology stack, how you handled real-time updates, and how the system integrates with existing ERP or accounting software.",
    outcome:
      "State the confirmed results: time saved, errors reduced, inventory accuracy improved, or any other measurable impact the client approved for publication.",
    capabilities: ["Custom Development", "Database Design", "Real-time Systems", "ERP Integration"],
    sample: true,
    art: { from: "#1a1a22", to: "#07070a", accent: "#ff6a3d", seed: 7 },
  },
  {
    slug: "customer-portal-platform",
    title: "Customer Portal Platform",
    discipline: "Web Applications",
    year: "Sample",
    summary:
      "A customer portal built for a service company to provide clients with self-service access to their accounts, project status, documentation, and support ticketing.",
    context:
      "Placeholder case study. Use this space for the real context: the number of users, the features requested, security requirements, and how the portal integrates with existing business systems.",
    approach:
      "Describe the technical implementation — the front-end framework, back-end architecture, authentication system, and how you ensured a great user experience while meeting security requirements.",
    outcome:
      "Add only results that were measured and approved for publication: user adoption rates, support ticket reduction, customer satisfaction improvements, or operational efficiency gains.",
    capabilities: ["Web Development", "User Authentication", "API Development", "UX Design"],
    sample: true,
    art: { from: "#101a1f", to: "#07090b", accent: "#a8c3ff", seed: 19 },
  },
  {
    slug: "business-process-automation",
    title: "Business Process Automation",
    discipline: "Enterprise Solutions",
    year: "Sample",
    summary:
      "An automation solution built for a mid-size company to streamline their document approval workflows, reducing manual processing time and improving compliance tracking.",
    context:
      "Placeholder case study for an enterprise automation project. Swap in the real client scenario, the legacy processes being replaced, the number of employees affected, and the compliance requirements.",
    approach:
      "Note the automation strategy, the systems integrated, how you handled data migration, and the change management approach that ensured smooth adoption across the organization.",
    outcome:
      "Publish confirmed results when available: time saved per workflow, error reduction, cost savings, or employee productivity improvements approved for publication.",
    capabilities: ["Process Automation", "System Integration", "Enterprise Software", "Change Management"],
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
