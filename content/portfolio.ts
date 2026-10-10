/**
 * Main portfolio page — ALL copy lives here. Components only render it.
 * Every data point comes from the resume (ayushi_1yoe.pdf). Search "TODO" for missing links.
 *
 * Headlines use { pre, accent, post }; `accent` renders in italic Instrument Serif.
 * Rules: no internal ticket IDs, partner/servicer/investor names, internal screenshots or
 * real loan data. No phone number.
 */

export type Accent = { pre?: string; accent: string; post?: string };
export type Stat = { value: string; label: string };

/* ───────── Site ───────── */

export const meta = {
  title: "Ayushi Singh — Product Manager, Lending & Fintech",
  description:
    "Ayushi Singh is an Associate Product Manager at FinacPlus (Toorak Capital), building AI document intelligence, budget review and loan workflow products for real estate lending.",
  siteUrl: "https://its-ayushisingh.vercel.app",
};

export const person = {
  name: "Ayushi Singh",
  email: "aayu16patwal@gmail.com",
  linkedin: "linkedin.com/in/ayushi-singh810",
  linkedinUrl: "https://www.linkedin.com/in/ayushi-singh810",
  // TODO: add your resume PDF at /public/Ayushi_Singh_Resume.pdf
  resumeUrl: "/Ayushi_Singh_Resume.pdf",
};

export const nav = {
  name: "Ayushi Singh",
  links: [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Case Studies", href: "#case-studies" },
    { label: "Skills", href: "#skills" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
  ],
  menu: "Menu",
  loanCta: { label: "The story of a loan", href: "/how-toorak-works" },
};

/* ───────── 0 · Opening ───────── */

export const opening = {
  log: [
    { time: "07:00", text: "alarm" },
    { time: "09:30", text: "standup" },
    { time: "10:00", text: "jira" },
    { time: "12:00", text: "“per my last email”" },
    { time: "15:00", text: "spreadsheet" },
    { time: "19:00", text: "repeat" },
  ],
  loops: 3,
  dayLabel: "Day",
  line1: "Every PM’s day looks like this.",
  line2: { pre: "But every product is a ", accent: "story", post: "." } satisfies Accent,
  skip: "Skip",
};

/* ───────── 1 · Hero ───────── */

export const hero = {
  eyebrow: "Product manager · Lending & AI",
  headline: { pre: "I build lending products for ", rotating: ["borrowers", "investors", "asset managers", "originators"] },
  caption: "Rehearsed. Every time.",
  sub: "Associate Product Manager at FinacPlus (Toorak Capital), building the platforms that move a real estate loan from application to payoff.",
  primaryCta: { label: "See my work", href: "#experience" },
  secondaryCta: { label: "The story of a loan", href: "/how-toorak-works" },
  logTitle: "ship.log",
  log: [
    { verb: "automated", text: "5,000+ loan docs/month with AI", tone: "info" },
    { verb: "shipped", text: "Budget Review Module · 10+ features", tone: "pass" },
    { verb: "cut", text: "budget review time −40%", tone: "info" },
    { verb: "cut", text: "ticket-to-PR time −25% with MCP", tone: "info" },
    { verb: "building", text: "purchase-loan dashboard · 12 metrics", tone: "warn" },
  ] as const,
};

/* ───────── 2 · About ───────── */

export const about = {
  eyebrow: "01 · About",
  headline: { pre: "Engineer by training, ", accent: "product person", post: " by choice." } satisfies Accent,
  bio: [
    "I started as a front-end engineer at Groww, then moved into product at FinacPlus, working on Toorak Capital’s real estate lending platform.",
    "I work across origination, underwriting, diligence and draws, turning manual loan workflows into products people actually use.",
  ],
  stats: [
    { to: 1.5, decimals: 1, suffix: " yrs", label: "In lending product" },
    { to: 5000, suffix: "+", label: "Docs / month automated" },
    { to: 40, prefix: "−", suffix: "%", label: "Budget review time" },
  ],
  location: "Based in Bengaluru · Open to PM roles in fintech, B2B SaaS and beyond",
};

/* ───────── 3 · Experience ───────── */

export const experience = {
  eyebrow: "02 · Experience",
  headline: { pre: "One loan, ", accent: "many teams", post: ", one product mindset." } satisfies Accent,
  role: {
    company: "FinacPlus (Toorak Capital)",
    location: "Bengaluru",
    title: "Associate Product Manager",
    dates: "Oct 2025 – Present",
    earlier: "APM Intern, converted to full-time · Apr – Sep 2025",
  },
  labels: { did: "What I did", impact: "Impact", stage: "See this stage" },
  tabs: [
    {
      team: "Diligence",
      product: "Document Intelligence (AI/ML)",
      period: "APM",
      stage: 4,
      did: "Own the AI/ML document-intelligence product that extracts, tags and splits loan documents using OCR, RAG and regex pattern matching.",
      impact: ["5,000+ documents / month", "−30% manual review effort"],
    },
    {
      team: "Engineering",
      product: "AI-assisted delivery · Borrower Portal",
      period: "APM",
      stage: 1,
      did: "Drove AI-assisted development of the customer-facing Borrower Portal by integrating Atlassian (Jira, Confluence) MCP servers and embedding repository context as .md files in tickets.",
      impact: ["−25% ticket-to-PR time"],
    },
    {
      team: "Origination ↔ Draws",
      product: "LOS and Draw alignment",
      period: "APM",
      stage: 6,
      did: "Aligned the Loan Origination System (LOS) and Draw (post-funding disbursement) teams on 10+ cross-team requirements.",
      impact: ["10+ cross-team requirements", "−20% handoff delays"],
    },
    {
      team: "Investors",
      product: "Purchase-loan dashboard",
      period: "APM",
      stage: 7,
      did: "Defining and building an investor-facing purchase-loan dashboard that consolidates key loan metrics into a single view.",
      impact: ["12 metrics, 1 view", "3 manual reports replaced"],
    },
    {
      team: "Underwriting",
      product: "Budget Review Module",
      period: "APM Intern",
      stage: 3,
      did: "Led design and launch with UI/UX, backend and QA teams, shipping 10+ features including automated inquiries and single-step approvals. Set up metrics for decision time and manual reconciliation effort.",
      impact: ["−40% review time", "−25% review errors", "10+ features"],
    },
    {
      team: "Operations",
      product: "LOS ↔ Toorak Connect workflows",
      period: "APM Intern",
      stage: 5,
      did: "Streamlined business–tech workflows across the LOS and Toorak Connect systems.",
      impact: ["4 manual steps removed per loan"],
    },
  ],
  earlierLabel: "Earlier",
  earlier: [
    {
      company: "Groww",
      role: "Frontend Developer Intern",
      dates: "Aug 2024 – Mar 2025",
      location: "Bengaluru",
      points: [
        "Built the Margin Trading Facility (MTF) stocks page end-to-end in React for 100K+ monthly users.",
        "Lighthouse SEO 78 → 95 and page load time −20%.",
        "Partnered with 4 PMs, shipping 6 releases in Jira-tracked sprints.",
      ],
    },
    {
      company: "Edwisely",
      role: "Product Developer Intern",
      dates: "Apr – Aug 2024",
      location: "Hyderabad (Remote)",
      points: ["Validated 300+ DSA problems before platform launch, resolving 50+ defects in an Agile team."],
    },
  ],
};

/* ───────── 4 · Projects ───────── */

export type Project = {
  name: string;
  date?: string;
  /** Shown in the card's window bar. */
  url: string;
  pitch: string;
  stack?: string[];
  metric?: string;
  live: string;
  github: string | null;
  /** Which original illustration to show. */
  shot: "scanfact" | "loan" | "router";
};

export const projects = {
  eyebrow: "03 · Projects",
  headline: { pre: "Things I built ", accent: "on my own", post: "." } satisfies Accent,
  items: [
    {
      shot: "scanfact",
      name: "ScanFact",
      date: "Apr 2026",
      url: "scanfact.vercel.app",
      pitch: "AI-powered loan document analyzer that flags RBI-guideline violations and hidden charges in Key Fact Statements (KFS).",
      stack: ["Next.js", "Claude", "Vercel"],
      metric: "90% detection · 30 real documents",
      live: "https://scanfact.vercel.app/",
      github: "#", // TODO: GitHub URL
    },
    {
      shot: "loan",
      name: "The Story of a Loan",
      date: "2026",
      url: "/how-toorak-works",
      pitch: "Interactive explainer of a real estate bridge loan’s full lifecycle, told through one house being renovated.",
      stack: ["Next.js", "Framer Motion", "SVG"],
      metric: "9 stages · 1 house",
      live: "/how-toorak-works",
      github: null,
    },
    {
      shot: "router",
      name: "Verification Method Router",
      url: "bankaccountverification.vercel.app",
      pitch: "Picks the right bank account verification method for a use case, and explains why.",
      // TODO: add date, stack and a metric
      live: "https://bankaccountverification.vercel.app/",
      github: null, // TODO: GitHub URL
    },
  ] satisfies Project[] as Project[],
  next: "Next chapter · coming soon",
  liveLabel: "Live",
  githubLabel: "GitHub",
};

/* ───────── 5 · Case studies ───────── */

export const caseStudies = {
  eyebrow: "04 · Case Studies",
  headline: { pre: "Teardowns and ", accent: "strategy", post: " calls." } satisfies Accent,
  read: "Read",
  items: [
    {
      title: "CRED Pay adoption",
      type: "Teardown",
      date: "Mar 2026",
      finding:
        "Diagnosed why CRED Pay isn’t retaining users, and proposed a fix that leverages CRED’s existing strengths.",
      stats: ["15 user interviews", "5 UPI apps compared", "+15% projected repeat usage"],
      href: "#", // TODO: case study URL
    },
    {
      title: "Zomato multi-tier city strategy",
      type: "Strategy",
      date: "Oct 2025",
      finding: "Analyzed Zomato’s strategy across city tiers against business metrics and customer satisfaction.",
      stats: ["3 city tiers", "4 business metrics", "3 growth levers"],
      href: "#", // TODO: case study URL
    },
  ],
};

/* ───────── 6 · Skills ───────── */

export const skills = {
  eyebrow: "05 · Skills",
  headline: { pre: "Checked against the ", accent: "guidelines", post: "." } satisfies Accent,
  passLabel: "Pass",
  summary: "tests passed",
  groups: [
    {
      name: "Product",
      items: ["Product strategy", "Roadmapping", "PRDs", "User stories", "Requirement prioritization", "Stakeholder management", "Agile", "Sprint planning"],
    },
    { name: "Data", items: ["SQL", "Mixpanel"] },
    { name: "AI", items: ["RAG", "OCR", "MCP", "Prompt engineering", "Claude", "Cursor"] },
    { name: "Tools", items: ["Jira", "Confluence", "Notion", "Figma", "Miro", "Postman"] },
    { name: "Technical", items: ["React", "Next.js", "JavaScript", "CSS", "Git", "GitHub", "Vercel"] },
  ],
};

/* ───────── 7 · Education ───────── */

export const education = {
  eyebrow: "06 · Education",
  headline: { pre: "Where the ", accent: "foundation", post: " was poured." } satisfies Accent,
  degree: "B.Tech, Computer Science & Engineering",
  school: "Madan Mohan Malaviya University of Technology",
  place: "Gorakhpur, Uttar Pradesh",
  dates: "Dec 2021 – May 2025",
  gpa: "CGPA 8.16 / 10",
  leadershipLabel: "Leadership",
  leadership: {
    role: "Technical Editorial Assistant",
    org: "Computer Engineering Society, MMMUT",
    text: "Led a global CodeChef contest with 1,000+ participants, owning planning, execution and post-event analysis. Also the society’s content strategist and web developer.",
    stat: "1,000+ participants",
  },
};

/* ───────── 8 · Contact ───────── */

export const contact = {
  eyebrow: "07 · Contact",
  headline: { pre: "Ready to ", accent: "close", post: "?" } satisfies Accent,
  sub: "Open to product roles in fintech, lending, B2B SaaS and beyond.",
  doc: {
    title: "Offer to connect",
    terms: ["Party: Ayushi Singh, Product Manager", "Purpose: your next product role", "Term: starting now"],
    signHere: "Sign here",
    sign: "Sign to close",
    closed: "Closed",
  },
  email: "Email",
  copy: "Copy",
  copied: "Copied",
  linkedin: "LinkedIn",
  resume: "Download resume",
  plain: "Or reach me directly",
};

/* ───────── Footer ───────── */

export const footer = { year: "2026" };
