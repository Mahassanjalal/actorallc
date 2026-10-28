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
    slug: "hostel-management",
    title: "Hostel Management System",
    discipline: "Web Applications",
    year: "2024",
    summary:
      "A comprehensive hostel management platform streamlining student accommodations, room allocations, fee management, and administrative workflows for educational institutions.",
    context:
      "Built for hostel administrators and students needing centralized management of rooms, bookings, payments, and communication. Handles multiple hostel properties with role-based access control.",
    approach:
      "Developed a full-stack web application with modern JavaScript frameworks, implementing real-time room availability tracking, automated payment reminders, and an intuitive dashboard for administrators.",
    outcome:
      "Reduced administrative workload by automating manual processes, improved booking efficiency, and provided transparent communication channels between administrators and residents.",
    capabilities: ["Full-Stack Development", "Database Design", "Payment Integration", "Role-Based Access"],
    sample: false,
    art: { from: "#0f172a", to: "#1e293b", accent: "#3b82f6", seed: 42 },
  },
  {
    slug: "dairy-pos",
    title: "DairyPOS",
    discipline: "Custom Software Development",
    year: "2024",
    summary:
      "A specialized point-of-sale system designed for dairy and agricultural businesses, handling inventory tracking, sales transactions, and supply chain management.",
    context:
      "Created for dairy farm operations and retail outlets requiring precise inventory control of perishable goods, batch tracking, and integration with suppliers.",
    approach:
      "Built a robust POS system with offline-first capabilities, barcode scanning integration, expiration tracking, and detailed sales analytics for business optimization.",
    outcome:
      "Enabled accurate inventory tracking for perishable products, reduced waste through better expiration management, and streamlined daily sales operations.",
    capabilities: ["POS Development", "Inventory Management", "Offline-First Architecture", "Analytics"],
    sample: false,
    art: { from: "#14532d", to: "#166534", accent: "#22c55e", seed: 15 },
  },
  {
    slug: "z-shop-store-saas",
    title: "Z-Shop SaaS",
    discipline: "Web Applications",
    year: "2024",
    summary:
      "A multi-tenant SaaS e-commerce platform enabling businesses to create and manage their online stores with customizable themes, payment processing, and order management.",
    context:
      "Developed for entrepreneurs and small businesses needing an affordable, scalable solution to launch online stores without technical expertise.",
    approach:
      "Architected a multi-tenant architecture with isolated customer data, built-in payment processing, customizable storefront themes, and comprehensive admin dashboards for store management.",
    outcome:
      "Empowered multiple businesses to establish their online presence with minimal setup time, providing enterprise-level features at accessible pricing.",
    capabilities: ["SaaS Architecture", "Multi-Tenant Systems", "E-Commerce", "Payment Processing"],
    sample: false,
    art: { from: "#1e1b4b", to: "#312e81", accent: "#8b5cf6", seed: 28 },
  },
  {
    slug: "qanawat-ai",
    title: "Qanawat AI",
    discipline: "AI/ML Solutions",
    year: "2024",
    summary:
      "AI-powered decision support system for sewer CCTV inspection and infrastructure rehabilitation, combining computer vision with engineering expertise.",
    context:
      "A modular monolith built with Next.js/React and FastAPI/Python, using Celery workers for video and document processing. Includes demonstration data for AI predictions, rules, rates, and accounts.",
    approach:
      "Integrated AI prediction models with traditional business rules, implemented asynchronous job processing for video analysis, and created an intuitive interface for inspection engineers.",
    outcome:
      "Accelerated infrastructure assessment workflows, provided data-driven rehabilitation recommendations, and demonstrated practical AI application in civil engineering.",
    capabilities: ["AI/ML Integration", "Computer Vision", "Video Processing", "FastAPI", "Next.js"],
    sample: false,
    art: { from: "#0c0a09", to: "#292524", accent: "#f97316", seed: 56 },
  },
  {
    slug: "chatterly",
    title: "Chatterly",
    discipline: "Web Applications",
    year: "2024",
    summary:
      "A modern random video chat platform connecting people worldwide for spontaneous, secure conversations with emphasis on privacy and user experience.",
    context:
      "Built for users seeking authentic connections through video chat, with robust safety features, moderation tools, and seamless cross-device experience.",
    approach:
      "Developed a real-time video communication platform with WebRTC technology, implemented safety filters and reporting mechanisms, and prioritized performance across web and mobile devices.",
    outcome:
      "Created a secure environment for global connections, implemented comprehensive safety measures, and delivered smooth real-time video experiences.",
    capabilities: ["Real-Time Video", "WebRTC", "Privacy & Security", "Cross-Platform"],
    sample: false,
    art: { from: "#0f172a", to: "#1e1b4b", accent: "#ec4899", seed: 73 },
  },
  {
    slug: "child-sponsorship-platform",
    title: "Child Sponsorship Platform",
    discipline: "Web Applications",
    year: "2024",
    summary:
      "A full-stack platform connecting sponsors with children needing educational support, featuring recurring payments, progress tracking, and transparent reporting.",
    context:
      "Built for charitable organizations facilitating child sponsorship programs with Stripe payment integration, progress updates, and impact reporting for donors.",
    approach:
      "Developed a compassionate platform with secure payment processing, photo and story updates from sponsored children, milestone tracking, and transparent financial reporting for donors.",
    outcome:
      "Streamlined the sponsorship process, increased donor engagement through regular updates, and provided transparency that builds trust in charitable programs.",
    capabilities: ["Full-Stack Development", "Stripe Integration", "Progress Tracking", "Impact Reporting"],
    sample: false,
    art: { from: "#064e3b", to: "#047857", accent: "#10b981", seed: 88 },
  },
  {
    slug: "northstar-talent",
    title: "Northstar Talent",
    discipline: "Enterprise Solutions",
    year: "2024",
    summary:
      "A comprehensive recruitment management system for staffing agencies, unifying client accounts, job requisitions, candidate pipelines, interviews, offers, and billing.",
    context:
      "Designed for staffing agencies managing multiple clients and candidates simultaneously, with AI-assisted agents for routine tasks and human oversight for important decisions.",
    approach:
      "Built an integrated RMS with complete hiring workflow automation, AI-assisted candidate matching, approval queues for consequential decisions, and comprehensive analytics for business intelligence.",
    outcome:
      "Centralized recruitment operations, reduced time-to-hire through AI assistance, maintained quality control through human review processes, and provided actionable hiring analytics.",
    capabilities: ["Enterprise RMS", "AI-Assisted Recruitment", "Pipeline Management", "Billing Integration"],
    sample: false,
    art: { from: "#1e1b4b", to: "#0f172a", accent: "#f59e0b", seed: 34 },
  },
  {
    slug: "fitcore",
    title: "FitCore",
    discipline: "SaaS Platforms",
    year: "2024",
    summary:
      "A multi-tenant SaaS gym management system providing fitness centers with membership management, class scheduling, trainer coordination, and member engagement tools.",
    context:
      "Created for gym owners and fitness centers needing a complete business management solution with member portals, automated billing, and operational dashboards.",
    approach:
      "Architected a scalable multi-tenant system with role-based access for gym staff and members, integrated payment processing for memberships, and built scheduling tools for classes and personal training.",
    outcome:
      "Simplified gym operations, automated membership billing, improved member engagement through digital tools, and provided gym owners with comprehensive business insights.",
    capabilities: ["SaaS Architecture", "Membership Management", "Scheduling Systems", "Multi-Tenant"],
    sample: false,
    art: { from: "#1c1917", to: "#78716c", accent: "#ef4444", seed: 61 },
  },
  {
    slug: "pulse-social",
    title: "Pulse",
    discipline: "Web Applications",
    year: "2024",
    summary:
      "A modern social media platform enabling users to share content, connect with communities, and engage through intuitive social features and real-time interactions.",
    context:
      "Built for users seeking an alternative social media experience with focus on meaningful connections, content discovery, and community building.",
    approach:
      "Developed a feature-rich social platform with user profiles, content feeds, engagement mechanics, privacy controls, and scalable infrastructure for growing user bases.",
    outcome:
      "Created an engaging social environment, implemented modern content sharing capabilities, and built infrastructure supporting community growth and interaction.",
    capabilities: ["Social Platform", "Real-Time Features", "Content Management", "Community Features"],
    sample: false,
    art: { from: "#0f172a", to: "#27272a", accent: "#a855f7", seed: 47 },
  },
  {
    slug: "fms-poultry",
    title: "FMS - Poultry Farm Management",
    discipline: "Enterprise Solutions",
    year: "2024",
    summary:
      "A comprehensive poultry farm management system built as a monorepo with NestJS backend, Next.js frontend, and Expo mobile app for farm operations and monitoring.",
    context:
      "Developed for poultry farm businesses requiring integrated management of inventory, livestock tracking, feed management, production metrics, and mobile access for field operations.",
    approach:
      "Created a unified monorepo solution with shared types and utilities, built a robust NestJS API, responsive Next.js web dashboard, and Expo mobile application for on-site farm management.",
    outcome:
      "Centralized farm operations management, enabled mobile access for field workers, improved inventory and production tracking, and provided real-time insights for farm decision-making.",
    capabilities: ["Monorepo Architecture", "NestJS", "Next.js", "Expo Mobile", "Farm Management"],
    sample: false,
    art: { from: "#14532d", to: "#14532d", accent: "#16a34a", seed: 92 },
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
