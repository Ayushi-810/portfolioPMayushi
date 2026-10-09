/**
 * "How Toorak Works" — ALL copy, numbers and stage data. Components only render this.
 *
 * Rules:
 *  - Deal numbers are fictional and illustrative. Thresholds are illustrative, not real guidelines.
 *  - Company stats must carry a source (see `sources`). No source → TODO, never a guess.
 *  - No ticket IDs, real loan data, or names of servicers, diligence firms, warehouse lenders,
 *    investors or partners.
 */

import type { Accent } from "@/content/portfolio";

export type Tone = "pass" | "warn" | "fail" | "neutral" | "info";
export type Pose =
  | "idle"
  | "look"
  | "stake"
  | "tape"
  | "blueprint"
  | "clipboard"
  | "broom"
  | "crowbar"
  | "trowel"
  | "level"
  | "hammer"
  | "roller"
  | "shovel"
  | "keys";
export type PropId = "listing" | "channels" | "draws" | "pending";

export type StageId =
  | "property"
  | "origination"
  | "sizing"
  | "underwriting"
  | "diligence"
  | "closing"
  | "draws"
  | "asset"
  | "exit";

export type DeepDive = {
  notes?: { title: string; text: string }[];
  roles?: { name: string; text: string }[];
  systems?: { name: string; text: string }[];
  documents?: string[];
  formulas?: { label: string; expr: string; result: string }[];
  risks?: string[];
  oneLiner: string;
};

/** How a metric's value is shown and animated. */
export type MetricValue =
  | { kind: "number"; to: number; decimals?: number; prefix?: string; suffix?: string }
  | { kind: "text"; text: string }
  | { kind: "change"; from: number; to: number; suffix?: string }
  | { kind: "mix"; parts: { label: string; value: number }[] };

export type Metric = {
  label: string;
  /** One-line plain-English meaning (tooltip on desktop, always visible on mobile). */
  meaning: string;
  value: MetricValue;
  /** Only for risk-control metrics. */
  dot?: "control" | "watch";
};

const num = (to: number, o: { decimals?: number; prefix?: string; suffix?: string } = {}): MetricValue => ({ kind: "number", to, ...o });
const text = (t: string): MetricValue => ({ kind: "text", text: t });

export type Stage = {
  id: StageId;
  /** Short label for the progress rail. */
  short: string;
  eyebrow: string;
  headline: Accent;
  body: string[];
  /** Optional list shown under the body (e.g. the three channels). */
  points?: { label: string; text: string; highlight?: boolean }[];
  dealTracker: { label: string; value: string; tone?: Tone }[];
  /** Deep dive for STUDY mode. `ready: false` shows a placeholder until written. */
  deepDive: DeepDive & { ready: boolean };
  /** "Where I worked" chips. Placeholder anchors until the experience section exists. */
  chips?: { label: string; href: string }[];
  /** "A typical month": sample values for explanation, not Toorak data. */
  metrics?: Metric[];
  sceneState: { pose: Pose; builderX: number; props: PropId; ready: boolean };
};

/* ───────────────────────── Sources (public) ───────────────────────── */

export const sources = [
  {
    id: "hw",
    label: "HousingWire, “Velocity to acquire Toorak’s operating platform”",
    date: "Aug 27, 2026",
    url: "https://www.housingwire.com/articles/velocity-toorak-acquisition-rtl-bpl/",
  },
  {
    id: "p2",
    label: "Pulse 2.0, “Velocity Financial to acquire Toorak platform” (press release coverage)",
    date: "Aug 2026",
    url: "https://pulse2.com/velocity-financial-to-acquire-toorak-platform-and-manage-3-billion-loan-portfolio-in-3-2-billion-transactions/",
  },
] as const;

export type SourceId = (typeof sources)[number]["id"];

/* ───────────────────────── Page-level copy ───────────────────────── */

export const page = {
  title: "How Toorak Works — Ayushi Singh",
  description:
    "An interactive walkthrough of a Toorak Capital Partners bridge loan, from a run-down Newark rowhouse to recycled capital. Built by Ayushi Singh.",
  backLabel: "Portfolio",
  name: "How Toorak works",
  replay: "Replay",
  glossaryLabel: "Glossary",
  dealTrackerLabel: "Deal tracker",
  chipsLabel: "Where I worked",
  scenePending: "Scene coming in the next build",
  metricsLabel: "A typical month",
  /** The page's only data disclosure, shown once in the footer. */
  footerNote: "Figures shown are sample values for explanation. Company totals are from public reporting.",
  controlLabel: { control: "Control", watch: "Watch" },
};

/** Intro slide: "Toorak in 30 seconds". */
export const primer = {
  eyebrow: "Toorak in 30 seconds",
  headline: { pre: "The capital behind ", accent: "local lenders", post: "." } satisfies Accent,
  oneBreath:
    "Toorak connects small-balance real estate lenders to institutional capital. It buys or funds their loans, verifies and manages them, and finances them in the capital markets while keeping the credit risk. That generates more capital to fund more loans.",
  stats: [
    { value: "$20B+", label: "Funded since inception", source: "p2" as SourceId },
    { value: "~43,000", label: "Loans", source: "p2" as SourceId },
    { value: "US + UK", label: "Lending markets", source: "p2" as SourceId },
    { value: "2016", label: "Founded, KKR-backed", source: "p2" as SourceId },
  ],
  facts: [
    { text: "Majority owned by funds advised by affiliates of KKR.", source: "p2" as SourceId },
    { text: "Headquartered in Tampa, Florida.", source: "p2" as SourceId },
  ],
  today: {
    label: "Toorak today",
    text: "In August 2026, Velocity Financial agreed to acquire Toorak’s operating platform, including Merchants Mortgage & Trust, Toorak’s direct lending business. Closing is expected in Q4 2026.",
    source: "hw" as SourceId,
  },
  cta: "Press → or space to start",
};

/* ───────────────────────── The illustrative deal ───────────────────────── */

export const deal = {
  property: "1920s two-story brick rowhouse · Newark, NJ",
  borrower: "Maria, an experienced investor, borrowing through her LLC",
  purchase: "$200,000",
  asIs: "$210,000",
  rehab: "$80,000",
  totalCost: "$280,000",
  arv: "$400,000",
  product: "Bridge loan (fix-and-flip) · 12 months · interest-only · 10.5%",
  initialAdvance: "$170,000",
  holdback: "$80,000",
  totalLoan: "$250,000",
  dscr: { rent: "$2,800", pitia: "$2,200", ratio: "1.27x" },
};

export const products = {
  label: "Product",
  options: [
    {
      id: "bridge",
      name: "Bridge",
      tag: "This deal",
      text: "6–24 month loans for fix-and-flip, heavy rehab or ground-up construction. Renovation money is held back and released in draws as the work is done.",
      rows: [
        { label: "Term", value: "12 months" },
        { label: "Payments", value: "Interest-only" },
        { label: "Rate", value: "10.5%" },
      ],
    },
    {
      id: "dscr",
      name: "DSCR",
      tag: "If Maria kept it as a rental",
      text: "30-year rental loans approved on whether the property’s rent covers its debt payments (the debt service coverage ratio), not on the borrower’s personal income.",
      rows: [
        { label: "Monthly rent", value: "$2,800" },
        { label: "Monthly PITIA", value: "$2,200" },
        { label: "DSCR", value: "2,800 ÷ 2,200 = 1.27x" },
      ],
    },
  ],
  footnote: "Toorak also lends on multifamily properties and offers bridge loans in the UK.",
};

/* ───────────────────────── Stages ───────────────────────── */

const pending = (oneLiner: string) => ({ ready: false, oneLiner });
const chip = (label: string, slug: string) => ({ label, href: `/#work-${slug}` }); // TODO: real anchors once the experience section exists

export const stages: Stage[] = [
  {
    id: "property",
    short: "Property",
    eyebrow: "Stage 00 · The property",
    headline: { pre: "Every loan starts with a house that ", accent: "needs work", post: "." },
    body: [
      "Maria, an experienced real estate investor, finds a run-down rowhouse at a discount. Renovated, it could be worth $400,000, but only if she moves fast.",
      "Banks are too slow, and most won’t lend on a house in this condition. She needs a bridge loan: short-term money to buy, renovate, then sell or refinance.",
    ],
    dealTracker: [
      { label: "Purchase", value: "$200,000" },
      { label: "Renovation", value: "$80,000" },
      { label: "After-repair value", value: "$400,000", tone: "info" },
    ],
    deepDive: {
      ready: true,
      notes: [
        {
          title: "Why this market exists",
          text: "Small investors who renovate houses are underserved by banks. Bank approvals take too long to win a competitive purchase, and a house that needs major work often doesn’t meet a bank’s lending standards. Specialist lenders fill that gap with fast, short-term loans sized to the renovation plan.",
        },
        {
          title: "Who the “borrower” is",
          text: "Usually an LLC or other entity set up for the project, not Maria personally. Maria signs a personal guarantee as the guarantor, so the lender reviews both the entity and her credit and track record. These are business-purpose loans (for investment, not a home she lives in), so they follow different rules than a consumer mortgage.",
        },
        {
          title: "Bridge vs DSCR",
          text: "A bridge loan funds the purchase and renovation, then gets repaid when the house sells or is refinanced. A DSCR loan is the long-term loan on a finished rental, approved on whether rent covers the payment. The same investor often uses both: bridge to renovate, DSCR to hold.",
        },
      ],
      roles: [
        { name: "Borrower", text: "Maria’s LLC, the legal entity that owns the property and owes the loan." },
        { name: "Guarantor", text: "Maria personally, promising to repay if the LLC can’t." },
        { name: "Contractor", text: "Does the renovation and gets paid from the draws." },
      ],
      formulas: [
        { label: "Total project cost", expr: "Purchase + renovation = 200,000 + 80,000", result: "$280,000" },
        { label: "After-repair value (ARV)", expr: "Estimated value once renovated", result: "$400,000" },
      ],
      risks: [
        "Paying too much for the property.",
        "Underestimating the renovation cost or timeline.",
        "A softer resale market that lowers the final sale price.",
      ],
      oneLiner:
        "Toorak’s borrowers are investors who buy houses that need work. A bridge loan gives them the speed and flexibility a bank can’t.",
    },
    sceneState: { pose: "look", builderX: 96, props: "listing", ready: true },
  },
  {
    id: "origination",
    short: "Origination",
    eyebrow: "Stage 01 · Origination",
    headline: { pre: "Three doors into ", accent: "Toorak", post: "." },
    body: [
      "Toorak usually doesn’t meet the borrower first. Its loans come in through local lenders, called originators, in one of three ways.",
    ],
    points: [
      {
        label: "Correspondent",
        text: "A local lender makes the loan with its own money, then sells it to Toorak through the Toorak Connect platform. That frees the lender’s cash to make its next loan.",
      },
      {
        label: "Table funding",
        text: "The originator’s name is on the loan, but Toorak provides the money at the closing table. This is how Maria’s loan comes in.",
        highlight: true,
      },
      {
        label: "Direct",
        text: "Toorak’s own lender, Merchants Mortgage, works with borrowers through a Customer Portal and a Loan Origination System (LOS). Brokers can bring loans this way too.",
      },
    ],
    dealTracker: [
      { label: "Channel", value: "Table funding", tone: "info" },
      { label: "Requested", value: "$250,000" },
      { label: "Product", value: "Bridge · 12\u00a0mo" },
    ],
    deepDive: {
      ready: true,
      roles: [
        { name: "Borrower", text: "Applies for the loan and supplies documents about the entity, the property and the plan." },
        { name: "Broker", text: "Introduces the borrower to a lender. Doesn’t lend its own money." },
        { name: "Loan officer", text: "Works for the lender. Guides the application and packages the loan file." },
        { name: "Originator", text: "The lender whose name is on the loan at closing." },
        { name: "Toorak loan acquisition team", text: "Reviews loans that originators bring to Toorak and decides whether to buy or fund them." },
      ],
      systems: [
        { name: "Customer Portal", text: "Where borrowers apply, upload documents, track underwriting and later request draws." },
        { name: "Loan Origination System (LOS)", text: "The system of record for the loan file as it moves from application to closing." },
        { name: "Toorak Connect", text: "The platform originators use to submit loans to Toorak and track them through review and purchase." },
      ],
      documents: [
        "Loan application",
        "Entity documents (LLC formation, operating agreement)",
        "Purchase contract",
        "Renovation budget and scope of work",
        "Track record of past projects",
      ],
      risks: [
        "Incomplete applications that stall review.",
        "The same loan data being re-keyed into several systems, with errors creeping in.",
      ],
      oneLiner:
        "Toorak is the capital behind local real estate lenders. It buys or funds their loans so they can keep lending, and through Merchants it also lends directly.",
    },
    chips: [chip("Customer Portal", "customer-portal")],
    metrics: [
      { label: "Loans submitted", value: num(700, { suffix: "/mo" }), meaning: "New deals coming in" },
      { label: "Pull-through rate", value: num(57, { suffix: "%" }), meaning: "Submitted loans that get bought" },
      { label: "Active originators", value: num(120), meaning: "Lenders sending loans in the last 90 days" },
      {
        label: "Channel mix",
        value: {
          kind: "mix",
          parts: [
            { label: "Correspondent", value: 55 },
            { label: "Table funding", value: 15 },
            { label: "Merchants", value: 30 },
          ],
        },
        meaning: "Correspondent / table funding / Merchants",
      },
      { label: "Time to term sheet", value: num(2, { suffix: " days" }), meaning: "Speed of the first offer" },
    ],
    sceneState: { pose: "stake", builderX: 120, props: "channels", ready: true },
  },
  {
    id: "sizing",
    short: "Sizing & Pricing",
    eyebrow: "Stage 02 · Sizing & pricing",
    headline: { pre: "How much can we ", accent: "safely", post: " lend?" },
    body: [
      "The sizer tests the deal against lending guidelines: the loan compared with today’s value (LTV), the after-repair value (ARV LTV) and the total cost (LTC), plus credit score, experience, loan size and property type.",
      "Each test returns pass or fail. A failed test can be waived if strong compensating factors justify it. Capital Markets then prices the loan, and the rate is locked.",
    ],
    dealTracker: [
      { label: "LTC", value: "89.3%", tone: "pass" },
      { label: "ARV LTV", value: "62.5%", tone: "pass" },
      { label: "As-is LTV", value: "81% (waived)", tone: "warn" },
      { label: "Rate", value: "10.5% locked", tone: "info" },
    ],
    deepDive: pending("Sizing is guardrails: how much we lend is capped by today’s value, the finished value, and the total cost."),
    metrics: [
      { label: "Priced first time", value: num(78, { suffix: "%" }), meaning: "No escalation or re-pricing needed" },
      { label: "Failed tests per loan", value: num(0.6, { decimals: 1 }), meaning: "Rules broken, on average" },
      { label: "Waiver requests", value: num(18, { suffix: "%" }), meaning: "Loans needing an exception" },
      { label: "Waiver approval", value: num(72, { suffix: "%" }), meaning: "Exceptions approved" },
      { label: "Rate locks expiring", value: num(4, { suffix: "%" }), meaning: "Deals that went stale" },
    ],
    sceneState: { pose: "tape", builderX: 120, props: "pending", ready: false },
  },
  {
    id: "underwriting",
    short: "Underwriting & Valuation",
    eyebrow: "Stage 03 · Underwriting & valuation",
    headline: { pre: "Is the ", accent: "story", post: " true?" },
    body: [
      "Underwriters verify the borrower (credit, experience, entity, guarantor) and the property. Appraisals and broker price opinions value it today and after repair using nearby comparable sales, and automated valuation models give fast estimates.",
      "The renovation budget is reviewed line by line so the money matches the work. Credit Committee gives final approval and a term sheet is issued.",
    ],
    dealTracker: [
      { label: "ARV", value: "$400,000 confirmed", tone: "pass" },
      { label: "Budget", value: "$80,000 approved", tone: "pass" },
      { label: "Term sheet", value: "Issued", tone: "pass" },
    ],
    deepDive: pending("Underwriting confirms the borrower can execute and the house is worth what the plan says."),
    chips: [chip("Budget Review", "budget-review"), chip("AVM", "avm")],
    metrics: [
      { label: "Underwriting time", value: num(4, { suffix: " days" }), meaning: "Borrower and property checked" },
      { label: "Appraisal turnaround", value: num(6, { suffix: " days" }), meaning: "Time to get the valuation" },
      { label: "Valuation match", value: num(85, { suffix: "%" }), meaning: "AVM within ±7% of appraisal" },
      { label: "Average leverage", value: text("LTC 86% · ARV LTV 63%"), meaning: "Lent vs cost and finished value" },
      { label: "Budget review time", value: num(1.8, { decimals: 1, suffix: " days" }), meaning: "Renovation plan checked" },
    ],
    sceneState: { pose: "blueprint", builderX: 120, props: "pending", ready: false },
  },
  {
    id: "diligence",
    short: "Diligence",
    eyebrow: "Stage 04 · Diligence",
    headline: { pre: "Every ", accent: "document", post: ", checked twice." },
    body: [
      "A loan is only as good as its paperwork. Documents are classified and key data is extracted with AI, then reviewed; anything missing or inconsistent becomes a condition to clear.",
      "An independent third-party diligence firm then reviews the loan and grades it A to D. Toorak buys A and B loans, and that external grade is also required to put a loan into a securitization.",
    ],
    dealTracker: [
      { label: "Documents", value: "6/6 cleared", tone: "pass" },
      { label: "Conditions", value: "0 open", tone: "pass" },
      { label: "Grade", value: "A · securitization-eligible", tone: "pass" },
    ],
    deepDive: pending("Diligence turns a pile of PDFs into a verified, gradeable asset that capital markets will trust."),
    chips: [chip("Document AI", "document-ai")],
    metrics: [
      { label: "A/B grade rate", value: num(94, { suffix: "%" }), meaning: "Loans good enough to buy" },
      { label: "Conditions per loan", value: num(3.2, { decimals: 1 }), meaning: "Issues to fix" },
      { label: "Time to clear conditions", value: num(3, { suffix: " days" }), meaning: "Speed of fixing" },
      { label: "Document AI accuracy", value: num(92, { suffix: "%" }), meaning: "Documents tagged and extracted correctly" },
      { label: "Submission to grade", value: num(5, { suffix: " days" }), meaning: "Total diligence time" },
    ],
    sceneState: { pose: "clipboard", builderX: 120, props: "pending", ready: false },
  },
  {
    id: "closing",
    short: "Closing & Purchase",
    eyebrow: "Stage 05 · Closing & purchase",
    headline: { pre: "The money ", accent: "moves", post: "." },
    body: [
      "The loan closes: documents are signed, title is insured, and the original collateral documents go to a custodian bank. Treasury bundles the loan, generates the purchase advice and settlement statement, and funds.",
      "Toorak now owns the loan. The renovation money isn’t paid out yet; it’s held back for draws. Data is then reconciled across systems so every team sees the same loan.",
    ],
    dealTracker: [
      { label: "Funded", value: "$170,000", tone: "pass" },
      { label: "Holdback", value: "$80,000", tone: "info" },
      { label: "Owner", value: "Toorak" },
    ],
    deepDive: pending("Closing turns an approved loan into an owned asset. Treasury bundles, settles, and wires."),
    chips: [chip("LOS ↔ Toorak Connect workflow", "los-connect"), chip("Reconciliation", "reconciliation")],
    metrics: [
      { label: "Loans bought", value: num(400, { suffix: "/mo" }), meaning: "$186M purchased" },
      { label: "Submission to purchase", value: num(14, { suffix: " days" }), meaning: "End-to-end buying time" },
      { label: "On-time purchases", value: num(88, { suffix: "%" }), meaning: "Bought by the target date" },
      { label: "Settlement errors", value: num(1, { prefix: "<", suffix: "%" }), meaning: "Of bundles" },
      { label: "Data mismatches", value: { kind: "change", from: 25, to: 10, suffix: "/wk" }, meaning: "Errors caught after buying" },
    ],
    sceneState: { pose: "crowbar", builderX: 120, props: "pending", ready: false },
  },
  {
    id: "draws",
    short: "Draws",
    eyebrow: "Stage 06 · Construction draws",
    headline: { pre: "Money released ", accent: "as the work is done", post: "." },
    body: [
      "A servicer collects payments and manages escrow. As the renovation progresses, the borrower requests a draw; an inspector confirms the percent complete, lien waivers confirm contractors were paid, and the draw is approved and wired.",
      "Money follows verified progress, never ahead of it.",
    ],
    dealTracker: [
      { label: "Draws", value: "4/4", tone: "pass" },
      { label: "Released", value: "$80,000 of $80,000" },
      { label: "Balance", value: "$250,000" },
    ],
    deepDive: pending("Draws make sure renovation money buys real progress, verified on site."),
    chips: [chip("Borrower Draw Portal", "draw-portal")],
    metrics: [
      { label: "Draws processed", value: num(1100, { suffix: "/mo" }), meaning: "$42M released" },
      { label: "Request to wire", value: num(4, { suffix: " days" }), meaning: "Speed of payout" },
      { label: "Inspections in 2 days", value: num(93, { suffix: "%" }), meaning: "Meeting the timing rule" },
      { label: "First-time approval", value: num(81, { suffix: "%" }), meaning: "No rework needed" },
      { label: "Money to late borrowers", value: num(0, { prefix: "$" }), meaning: "Risk control working", dot: "control" },
    ],
    sceneState: { pose: "hammer", builderX: 120, props: "draws", ready: true },
  },
  {
    id: "asset",
    short: "Asset Management",
    eyebrow: "Stage 07 · Asset management",
    headline: { pre: "Watching every ", accent: "loan", post: ", every day." },
    body: [
      "Asset managers monitor payments, maturity, the last draw, taxes, insurance and delinquency, and handle extensions and modifications.",
      "Investors see a read-only view of loan performance; asset managers get an operational view to act on.",
    ],
    dealTracker: [
      { label: "Status", value: "Performing", tone: "pass" },
      { label: "Payments", value: "Months 1–9 on time", tone: "pass" },
    ],
    deepDive: pending("Asset management protects the capital after it’s out the door: catch problems early, then recover if needed."),
    chips: [
      chip("Purchase Loans Dashboard", "purchase-loans-dashboard"),
      chip("Delinquency controls", "delinquency-controls"),
      chip("REO", "reo"),
    ],
    metrics: [
      { label: "Current loans", value: num(91, { suffix: "%" }), meaning: "Of balance, paying on time" },
      { label: "60+ days late", value: num(4.5, { decimals: 1, suffix: "%" }), meaning: "Serious lateness", dot: "watch" },
      { label: "Maturing in 90 days", value: num(520), meaning: "Repayments to watch" },
      { label: "Extensions granted", value: num(12, { suffix: "%" }), meaning: "Borrowers given more time" },
      { label: "REO properties", value: num(45), meaning: "Sold in 140 days on average" },
    ],
    sceneState: { pose: "clipboard", builderX: 120, props: "pending", ready: false },
  },
  {
    id: "exit",
    short: "Exit",
    eyebrow: "Stage 08 · Exit",
    headline: { pre: "Capital comes home, then goes ", accent: "back out", post: "." },
    body: [
      "Maria sells the finished house for $400,000 and pays off the $250,000 loan. (A rental investor would refinance into a 30-year DSCR loan instead.)",
      "Toorak holds loans on warehouse lines, sells them to takeout partners, or pools them into securitizations. Because bridge loans repay fast, payoff cash buys new loans, and the next broken house gets fixed.",
    ],
    dealTracker: [
      { label: "Sold", value: "$400,000", tone: "pass" },
      { label: "Loan repaid", value: "$250,000 ✓", tone: "pass" },
      { label: "Capital", value: "Recycled", tone: "info" },
    ],
    deepDive: pending(
      "Toorak connects small-balance real estate lenders to institutional capital: it buys or funds their loans, verifies and manages them, and finances them in the capital markets.",
    ),
    metrics: [
      { label: "Loans repaid", value: num(380, { suffix: "/mo" }), meaning: "$170M coming back" },
      { label: "Average loan life", value: num(11, { suffix: " months" }), meaning: "Purchase to payoff" },
      { label: "Assets under management", value: num(1.9, { decimals: 1, prefix: "$", suffix: "B" }), meaning: "Total loan book" },
      { label: "Bond-eligible", value: num(92, { suffix: "%" }), meaning: "Of the book" },
      { label: "Recovery on defaults", value: num(88, { suffix: "%" }), meaning: "Money recovered when loans fail" },
    ],
    sceneState: { pose: "keys", builderX: 120, props: "pending", ready: false },
  },
];

/* ───────────────────────── Glossary ───────────────────────── */

export const glossary: { term: string; text: string }[] = [
  { term: "Bridge loan", text: "A short-term loan (often 6–24 months) used to buy and renovate a property, repaid when it’s sold or refinanced." },
  { term: "DSCR", text: "Debt service coverage ratio: monthly rent divided by the monthly debt payment. Also the name for long-term rental loans approved on that ratio." },
  { term: "Originator", text: "The lender that makes the loan and whose name is on it at closing." },
  { term: "Correspondent lending", text: "An originator funds a loan with its own money, then sells it to a larger buyer like Toorak." },
  { term: "Table funding", text: "The originator’s name is on the loan, but the buyer supplies the money at the closing table." },
  { term: "LOS", text: "Loan Origination System: the system of record for a loan from application to closing." },
  { term: "Sizer", text: "The tool that tests a loan against lending guidelines and calculates how much can be lent." },
  { term: "LTV", text: "Loan-to-value: loan amount divided by the property’s current (as-is) value." },
  { term: "ARV", text: "After-repair value: what the property is expected to be worth once renovated." },
  { term: "ARV LTV", text: "Loan amount divided by the after-repair value." },
  { term: "LTC", text: "Loan-to-cost: loan amount divided by total project cost (purchase plus renovation)." },
  { term: "Waiver", text: "An approved exception that lets a loan proceed even though it fails a guideline test." },
  { term: "Compensating factor", text: "A strength, such as high credit or a strong track record, that offsets a weakness and supports a waiver." },
  { term: "Rate lock", text: "A commitment to a specific interest rate for a set period while the loan is completed." },
  { term: "Appraisal", text: "A licensed appraiser’s formal opinion of a property’s value, based on inspection and comparable sales." },
  { term: "BPO", text: "Broker price opinion: a real estate broker’s estimate of value. Faster and lighter than an appraisal." },
  { term: "AVM", text: "Automated valuation model: software that estimates value from property and sales data." },
  { term: "Credit Committee", text: "The group that gives final approval on loans, especially larger or exception cases." },
  { term: "Conditions", text: "Items that must be provided or fixed before a loan can close or be purchased." },
  { term: "Due diligence", text: "The review of a loan’s documents and data to confirm it’s accurate and meets guidelines." },
  { term: "Loan grade", text: "An A–D rating from a third-party diligence review. A and B loans are eligible for securitization." },
  { term: "Bundle", text: "A group of loans purchased and settled together." },
  { term: "Purchase advice", text: "A statement of the loans being bought and the price for each." },
  { term: "Settlement statement", text: "The breakdown of the money in a purchase: price, accrued interest, holdbacks, fees and wire amounts." },
  { term: "Custodian", text: "A bank that safekeeps the original loan documents (like the signed note) for the owner of the loan." },
  { term: "Holdback", text: "Loan money set aside at closing and released later in draws as renovation work is completed." },
  { term: "Servicer", text: "The company that collects payments, manages escrow and handles day-to-day loan administration." },
  { term: "Draw", text: "A release of holdback money to pay for completed renovation work." },
  { term: "Inspection", text: "A site visit that confirms how much of the renovation is actually complete before a draw is paid." },
  { term: "Lien waiver", text: "A contractor’s signed statement that they’ve been paid and won’t place a claim (lien) on the property." },
  { term: "Delinquency", text: "When a borrower is behind on payments, usually tracked as 30, 60 or 90+ days late." },
  { term: "Extension", text: "Pushing out a loan’s maturity date, usually for a fee, to give the borrower more time." },
  { term: "Notice of default", text: "A formal notice that the borrower has broken the loan terms, the first step toward foreclosure." },
  { term: "Foreclosure", text: "The legal process by which a lender takes the property that secures an unpaid loan." },
  { term: "REO", text: "Real estate owned: property the lender owns after foreclosure, to be managed and sold." },
  { term: "Payoff", text: "Repaying the loan, in full or, in a short payoff, for less than the full balance by agreement." },
  { term: "Warehouse line", text: "A short-term credit line from a bank that a lender uses to hold loans until they’re sold or securitized." },
  { term: "Takeout partner", text: "An institution, such as an insurance company, that buys loans from the lender." },
  { term: "Securitization", text: "Pooling loans and selling bonds backed by their payments to institutional investors." },
  { term: "Revolving period", text: "A window in a securitization when cash from loans that pay off is used to buy new loans instead of repaying bondholders." },
];

/** Exit stage: "How the book grows". Illustrative. */
export const bookGrowth = {
  label: "How the book grows",
  terms: [
    { sign: "", value: "$186M", label: "bought" },
    { sign: "+", value: "$42M", label: "draws" },
    { sign: "−", value: "$170M", label: "repaid" },
  ],
  result: { to: 58, prefix: "+$", suffix: "M", label: "monthly growth" },
  caption: "AUM = purchases + draws − payoffs",
};

/* ───────────────────────── House construction ───────────────────────── */

/**
 * The house is built phase by phase. Each stage adds its phase(s) on top of everything before;
 * stage 6 has one phase per draw, triggered by that draw's "wired" moment.
 * `progress` is the construction meter after the phase finishes.
 */
export const construction = {
  label: "Construction",
  notStarted: "Not started",
  startOver: "Start over",
  phases: [
    { id: "cleanup", label: "Site cleanup", stage: 1, progress: 10, pose: "broom", builderX: 270 },
    { id: "demolition", label: "Demolition", stage: 2, progress: 20, pose: "crowbar", builderX: 150 },
    { id: "foundation", label: "Foundation", stage: 3, progress: 32, pose: "trowel", builderX: 205 },
    { id: "structure", label: "Structure", stage: 4, progress: 45, pose: "level", builderX: 255 },
    { id: "roof", label: "Roof", stage: 5, progress: 58, pose: "hammer", builderX: 300 },
    { id: "openings", label: "Windows & door", stage: 6, progress: 66, pose: "hammer", builderX: 250, draw: 1 },
    { id: "siding", label: "Siding & color", stage: 6, progress: 74, pose: "roller", builderX: 300, draw: 2 },
    { id: "lights", label: "Interior lights", stage: 6, progress: 81, pose: "clipboard", builderX: 245, draw: 3 },
    { id: "paint", label: "Paint, trim & porch", stage: 6, progress: 88, pose: "roller", builderX: 255, draw: 4 },
    { id: "landscape", label: "Landscaping", stage: 7, progress: 95, pose: "shovel", builderX: 160 },
    { id: "complete", label: "Complete", stage: 8, progress: 100, pose: "keys", builderX: 252 },
  ] satisfies { id: string; label: string; stage: number; progress: number; pose: Pose; builderX: number; draw?: number }[],
};

/** Stage 6 scene: the draw timeline that drives the build. */
export const drawTimeline = {
  label: "Construction draws",
  steps: ["Request", "Inspect", "Waiver", "Wired"],
  amount: "$20,000",
  wired: "wired",
  released: "Released",
  of: "of $80,000",
  perDraw: 20000,
};
