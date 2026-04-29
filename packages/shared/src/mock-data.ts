import type {
  Brief,
  Build,
  Campaign,
  Client,
  ClientAction,
  Commercial,
  DataRoomItem,
  Decision,
  Deliverable,
  Hypothesis,
  Impact,
  Initiative,
  KpiEntry,
  Lesson,
  MeetingNote,
  Opportunity,
  Playbook,
  Prospect,
  Risk,
  Stakeholder,
  Synthesis,
  Task,
} from "./types";

export const clients: Client[] = [
  {
    id: "stroke-scan-plus",
    name: "Stroke Scan Plus",
    industry: "Preventive Health Screening",
    main_offer:
      "$149 four-vessel preventive stroke & cardiovascular ultrasound screening",
    current_status: "Scaling paid acquisition in two DMAs",
    goal_90_day: "400 paid screenings / month at CPA under $75",
    long_term_goal:
      "Category leader for direct-to-consumer preventive stroke screening across the Sun Belt",
    next_actions: [
      "Launch senior-community referral program",
      "A/B test new landing page with risk calculator",
      "Open third screening location in Sarasota",
    ],
    vertical: "healthcare",
    primary_lens: "revenue",
    engagement_stage: "design",
    health: "on_track",
  },
  {
    id: "greenleaf-dental",
    name: "Greenleaf Dental Group",
    industry: "Multi-location Dental",
    main_offer: "$79 new-patient cleaning + x-ray",
    current_status: "Onboarding — audit in progress",
    goal_90_day: "Lift new-patient bookings 25% across 4 locations",
    long_term_goal: "Expand to 10 locations in Texas by 2028",
    next_actions: ["Finish ad account audit", "Kick off landing page rebuild"],
    vertical: "healthcare",
    primary_lens: "ops",
    engagement_stage: "diagnose",
    health: "at_risk",
  },
];

export const briefs: Record<string, Brief> = {
  "stroke-scan-plus": {
    client_id: "stroke-scan-plus",
    business_overview:
      "Stroke Scan Plus operates mobile and fixed preventive screening clinics that detect early markers for stroke and cardiovascular disease using non-invasive ultrasound. Founded 2022; three clinics across Florida.",
    target_audience:
      "Adults 50–75 with at least one cardiovascular risk factor (hypertension, family history, diabetes, smoker). Decision makers skew female 55+ who also book for spouses.",
    core_offer:
      "$149 four-vessel screening package: carotid artery, abdominal aorta, peripheral arterial, and EKG. 30-minute in-clinic visit. Results in 48 hours with cardiologist review.",
    pricing:
      "Base $149. Couples package $249. Premium $299 adds thyroid and full lipid panel. No insurance billing.",
    upsells:
      "Quarterly Heart Health membership $29/mo. Annual re-scan $99. Telehealth follow-up $79.",
    competitors:
      "Life Line Screening (national, brand recognition, higher price point). Local hospital-based screening programs (inconvenient, insurance-required).",
    marketing_channels:
      "Meta Ads (primary), Google Search, local radio, senior-community partnerships, referral program.",
    operational_constraints:
      "Scanner capacity: 22 slots/day/clinic. Lead cardiologist signs all reports — bottleneck above 80 scans/day total.",
    notes:
      "Founder prioritizes brand trust over volume. Strong aversion to aggressive upsell scripting. Willing to invest in content/education funnel.",
  },
  "greenleaf-dental": {
    client_id: "greenleaf-dental",
    business_overview: "4-location dental group in DFW.",
    target_audience: "Families 30–55 within 5 miles of each location.",
    core_offer: "$79 new-patient cleaning + x-ray",
    pricing: "$79 intro; $2k avg lifetime value",
    upsells: "Invisalign, whitening, implants",
    competitors: "Local DSOs, Aspen Dental, Heartland",
    marketing_channels: "Google Local, Meta, direct mail",
    operational_constraints: "Front desk capacity at 2 locations",
    notes: "Owner wants to recover phone answer rate before scaling ads",
  },
};

export const kpis: KpiEntry[] = [
  {
    id: "k1",
    client_id: "stroke-scan-plus",
    period_type: "monthly",
    period_label: "Jan 2026",
    revenue_goal: 45000,
    revenue: 41200,
    patient_volume_goal: 300,
    leads_goal: 900,
    leads: 842,
    bookings_goal: 330,
    bookings: 298,
    show_ups: 251,
    show_up_rate: 84.2,
    cost_per_lead: 11.4,
    cost_per_booking: 32.2,
    cost_per_show_up: 38.3,
    ad_spend: 9600,
    profit_estimate: 17800,
  },
  {
    id: "k2",
    client_id: "stroke-scan-plus",
    period_type: "monthly",
    period_label: "Feb 2026",
    revenue_goal: 50000,
    revenue: 48900,
    patient_volume_goal: 330,
    leads_goal: 1000,
    leads: 1104,
    bookings_goal: 360,
    bookings: 342,
    show_ups: 296,
    show_up_rate: 86.5,
    cost_per_lead: 9.9,
    cost_per_booking: 31.9,
    cost_per_show_up: 36.9,
    ad_spend: 10920,
    profit_estimate: 22100,
  },
  {
    id: "k3",
    client_id: "stroke-scan-plus",
    period_type: "monthly",
    period_label: "Mar 2026",
    revenue_goal: 55000,
    revenue: 57300,
    patient_volume_goal: 360,
    leads_goal: 1100,
    leads: 1268,
    bookings_goal: 390,
    bookings: 401,
    show_ups: 350,
    show_up_rate: 87.3,
    cost_per_lead: 9.1,
    cost_per_booking: 28.8,
    cost_per_show_up: 33.0,
    ad_spend: 11540,
    profit_estimate: 27900,
  },
  {
    id: "k4",
    client_id: "stroke-scan-plus",
    period_type: "weekly",
    period_label: "Apr wk 1",
    revenue_goal: 14000,
    revenue: 15200,
    patient_volume_goal: 94,
    leads_goal: 280,
    leads: 312,
    bookings_goal: 100,
    bookings: 107,
    show_ups: 94,
    show_up_rate: 87.9,
    cost_per_lead: 8.9,
    cost_per_booking: 26.0,
    cost_per_show_up: 29.6,
    ad_spend: 2780,
    profit_estimate: 7420,
  },
];

export const initiatives: Initiative[] = [
  {
    id: "i1",
    client_id: "stroke-scan-plus",
    horizon: "short",
    title: "Launch senior-community referral program",
    description:
      "Partner with 8 active-adult communities for on-site screening days with co-branded flyers and a $20 resident discount.",
    priority: "high",
    owner: "Alan Bonner",
    due_date: "2026-05-15",
    status: "in_progress",
    expected_impact: "+60 screenings/month at near-zero CAC",
  },
  {
    id: "i2",
    client_id: "stroke-scan-plus",
    horizon: "short",
    title: "Ship landing page with risk calculator",
    description:
      "Interactive 8-question stroke risk quiz that ends with calendar booking. Replaces current static LP.",
    priority: "high",
    owner: "Design team",
    due_date: "2026-05-02",
    status: "in_progress",
    expected_impact: "Booking CVR 12% → 18%",
  },
  {
    id: "i3",
    client_id: "stroke-scan-plus",
    horizon: "mid",
    title: "Open Sarasota clinic",
    description:
      "Lease + buildout + cardiologist contract for third fixed location.",
    priority: "high",
    owner: "Founder",
    due_date: "2026-08-30",
    status: "not_started",
    expected_impact: "+$45k MRR at steady state",
  },
  {
    id: "i4",
    client_id: "stroke-scan-plus",
    horizon: "mid",
    title: "Build content engine",
    description:
      "Weekly educational content: YouTube shorts, blog posts, email newsletter.",
    priority: "medium",
    owner: "Content lead",
    due_date: "2026-07-01",
    status: "not_started",
    expected_impact: "Organic leads 5% → 20% of total",
  },
  {
    id: "i5",
    client_id: "stroke-scan-plus",
    horizon: "long",
    title: "Expand to Sun Belt — AZ + TX",
    description: "3 additional markets by end of 2027.",
    priority: "medium",
    owner: "Founder",
    due_date: "2027-12-31",
    status: "not_started",
    expected_impact: "$3M ARR target",
  },
];

export const campaigns: Campaign[] = [
  {
    id: "c1",
    client_id: "stroke-scan-plus",
    name: "Meta — Tampa 55+ Awareness",
    platform: "Meta",
    target_location: "Tampa–St. Petersburg DMA",
    budget: 4500,
    start_date: "2026-03-01",
    end_date: "2026-04-30",
    creative_angle:
      "Real patient story: 'I had no symptoms. The scan caught a 70% blockage.'",
    results: "CPL $8.40, 312 bookings, ROAS 2.8x. Best performer of quarter.",
    notes: "Scale +30% budget in May",
    status: "live",
  },
  {
    id: "c2",
    client_id: "stroke-scan-plus",
    name: "Google Search — Stroke Screening Keywords",
    platform: "Google",
    target_location: "FL statewide",
    budget: 3200,
    start_date: "2026-02-15",
    end_date: "2026-05-15",
    creative_angle: "Direct response — '$149 four-vessel screening near you'",
    results: "CPL $14.20, lower volume, higher show-up rate (91%)",
    notes: "High-intent — keep on always-on",
    status: "live",
  },
  {
    id: "c3",
    client_id: "stroke-scan-plus",
    name: "Sarasota Launch Burst",
    platform: "Meta + Google",
    target_location: "Sarasota / Bradenton",
    budget: 6000,
    start_date: "2026-09-01",
    end_date: "2026-10-15",
    creative_angle: "New clinic grand opening — first 100 scans $99",
    results: "",
    notes: "Blocked by clinic buildout timeline",
    status: "draft",
  },
];

export const meetingNotes: MeetingNote[] = [
  {
    id: "m1",
    client_id: "stroke-scan-plus",
    date: "2026-04-17",
    attendees: ["Alan Bonner", "Dr. Patel (Founder)", "Maria (Ops)"],
    summary:
      "Q2 planning. Reviewed March KPIs (beat plan). Aligned on Sarasota buildout timing and senior-community program.",
    key_facts: [
      "March revenue $57.3k vs $55k goal",
      "Cardiologist bottleneck hit twice in March — capacity planning needed before Sarasota",
      "Dr. Patel open to adding second reader if we can forecast >500 scans/mo",
    ],
    decisions: [
      "Move forward with Sarasota lease signing in May",
      "Delay content hire until June to concentrate spend on paid",
    ],
    action_items: [
      {
        item: "Send Sarasota lease options for review",
        owner: "Dr. Patel",
        deadline: "2026-04-25",
      },
      {
        item: "Draft senior-community partnership one-pager",
        owner: "Alan",
        deadline: "2026-04-24",
      },
      {
        item: "Scope second-reader economics",
        owner: "Maria",
        deadline: "2026-05-05",
      },
    ],
  },
  {
    id: "m2",
    client_id: "stroke-scan-plus",
    date: "2026-04-03",
    attendees: ["Alan Bonner", "Dr. Patel"],
    summary:
      "Weekly standup. Paid is pacing ahead. LP rebuild draft reviewed — needs copy pass.",
    key_facts: [
      "Meta CPL dropped to $8.40",
      "New LP copy reads too clinical — Dr. Patel wants warmer voice",
    ],
    decisions: ["Rewrite LP headline + hero copy before launch"],
    action_items: [
      {
        item: "LP copy rewrite v2",
        owner: "Alan",
        deadline: "2026-04-10",
      },
    ],
  },
  {
    id: "m3",
    client_id: "stroke-scan-plus",
    date: "2026-04-10",
    attendees: ["Alan Bonner", "Internal team"],
    summary:
      "Internal sync — discussed concern about founder reluctance to invest in CRM / automation tooling. Need to raise at next leadership touchpoint.",
    key_facts: [
      "Founder cited 'no time to learn new tools' objection last call",
      "Current reminder workflow is entirely manual by front desk staff",
    ],
    decisions: ["Pitch CRM pilot as part of Sarasota launch, not standalone"],
    action_items: [
      {
        item: "Draft CRM pilot proposal tied to Sarasota",
        owner: "Alan",
        deadline: "2026-05-15",
      },
    ],
  },
];

export const decisions: Decision[] = [
  {
    id: "d1",
    client_id: "stroke-scan-plus",
    date: "2026-04-17",
    decision: "Proceed with Sarasota clinic — target Sept 1 open",
    reason:
      "Unit economics from Tampa + St. Pete support a third location; demand-test ads in Sarasota showed $11 CPL.",
    owner: "Dr. Patel",
    related: "Initiative: Open Sarasota clinic",
  },
  {
    id: "d2",
    client_id: "stroke-scan-plus",
    date: "2026-04-10",
    decision: "Rebuild landing page with risk calculator",
    reason:
      "Current static LP converts at 12%. Benchmark competitor interactive LP at 18–22%.",
    owner: "Alan Bonner",
    related: "Initiative: Ship landing page with risk calculator",
  },
  {
    id: "d3",
    client_id: "stroke-scan-plus",
    date: "2026-03-20",
    decision: "Reject TV sponsorship offer",
    reason:
      "Pricing was $18k/mo with vague attribution. Same budget reallocated to Meta scaled to $4k ROAS.",
    owner: "Dr. Patel",
    related: "Marketing channels",
  },
];

export const opportunities: Opportunity[] = [
  {
    id: "o1",
    client_id: "stroke-scan-plus",
    name: "No-show rate — recover 15% of lost bookings",
    description:
      "~14% of booked patients no-show. Single SMS reminder. Add 3-touch reminder (48h email, 24h SMS, morning-of call) and deposit on booking.",
    estimated_impact: "+$6–9k/mo recovered revenue",
    difficulty: "easy",
    priority: "high",
    status: "not_started",
    next_step: "Scope 3-touch reminder build in booking tool",
  },
  {
    id: "o2",
    client_id: "stroke-scan-plus",
    name: "Membership program monetization",
    description:
      "Heart Health membership mentioned only in discharge paperwork. Attach rate <2%. Add post-scan email sequence.",
    estimated_impact: "+$4k/mo recurring",
    difficulty: "easy",
    priority: "medium",
    status: "not_started",
    next_step: "Write 5-email post-scan nurture sequence",
  },
  {
    id: "o3",
    client_id: "stroke-scan-plus",
    name: "Couples package under-marketed",
    description:
      "Couples $249 drives 23% lift in AOV when mentioned but buried on page 3 of funnel.",
    estimated_impact: "+8% AOV across new patients",
    difficulty: "easy",
    priority: "medium",
    status: "in_progress",
    next_step: "Ship as part of LP rebuild",
  },
  {
    id: "o4",
    client_id: "stroke-scan-plus",
    name: "Second reader to unblock capacity",
    description:
      "Cardiologist review is the hard cap. At 500 scans/mo unit economics support a second contracted reader.",
    estimated_impact: "Unlocks 2x clinic capacity",
    difficulty: "medium",
    priority: "high",
    status: "not_started",
    next_step: "Maria to build capacity/cost model",
  },
];

export const dataRoom: DataRoomItem[] = [
  {
    id: "f1",
    client_id: "stroke-scan-plus",
    file_name: "SSP — Brand Guidelines v2.pdf",
    category: "Brand",
    description: "Logo, colors, type, tone of voice",
    url: "#",
    date_added: "2026-02-04",
  },
  {
    id: "f2",
    client_id: "stroke-scan-plus",
    file_name: "Meta Ads — Q1 Performance.xlsx",
    category: "Performance",
    description: "Weekly CPL, ROAS, creative breakdown",
    url: "#",
    date_added: "2026-04-02",
  },
  {
    id: "f3",
    client_id: "stroke-scan-plus",
    file_name: "Clinic unit economics model.xlsx",
    category: "Finance",
    description: "Per-clinic P&L, capacity, breakeven",
    url: "#",
    date_added: "2026-03-14",
  },
  {
    id: "f4",
    client_id: "stroke-scan-plus",
    file_name: "Patient testimonial — M. Jenkins (video)",
    category: "Creative",
    description: "Used in top-performing Tampa campaign",
    url: "#",
    date_added: "2026-03-08",
  },
  {
    id: "f5",
    client_id: "stroke-scan-plus",
    file_name: "Cardiologist agreement — template",
    category: "Legal",
    description: "Used for Sarasota reader negotiation",
    url: "#",
    date_added: "2026-04-11",
  },
];

export const tasks: Task[] = [
  {
    id: "t1",
    client_id: "stroke-scan-plus",
    name: "Rewrite LP headline + hero copy",
    owner: "Alan Bonner",
    due_date: "2026-04-25",
    status: "in_progress",
    priority: "high",
    notes: "Warmer tone — Dr. Patel feedback",
  },
  {
    id: "t2",
    client_id: "stroke-scan-plus",
    name: "Build 3-touch no-show reminder",
    owner: "Ops",
    due_date: "2026-05-08",
    status: "not_started",
    priority: "high",
    notes: "Email + SMS + morning-of call",
  },
  {
    id: "t3",
    client_id: "stroke-scan-plus",
    name: "Draft senior-community partnership one-pager",
    owner: "Alan Bonner",
    due_date: "2026-04-24",
    status: "in_progress",
    priority: "high",
    notes: "",
  },
  {
    id: "t4",
    client_id: "stroke-scan-plus",
    name: "Scope second-reader economics",
    owner: "Maria",
    due_date: "2026-05-05",
    status: "not_started",
    priority: "medium",
    notes: "Needed before Sarasota signing",
  },
  {
    id: "t5",
    client_id: "stroke-scan-plus",
    name: "Write post-scan nurture email sequence (5)",
    owner: "Alan Bonner",
    due_date: "2026-05-15",
    status: "not_started",
    priority: "medium",
    notes: "Push membership attach rate",
  },
  {
    id: "t6",
    client_id: "stroke-scan-plus",
    name: "Review Sarasota lease options",
    owner: "Dr. Patel",
    due_date: "2026-04-25",
    status: "not_started",
    priority: "critical",
    notes: "",
  },
];

export const synthesis: Record<string, Synthesis> = {
  "stroke-scan-plus": {
    client_id: "stroke-scan-plus",
    headline:
      "Double scan capacity and open Sarasota to unlock the next $1.5M of ARR without diluting brand.",
    situation:
      "Stroke Scan Plus has proven direct-to-consumer preventive screening at $149 works. Two Florida clinics run at 80% utilization. Meta + Google paid are profitable at $32 CPB.",
    complication:
      "Current cardiologist review is a hard capacity ceiling at ~80 scans/day across the network. Paid acquisition scales; operations do not. Growth past 500 scans/mo requires structural changes, not more ad spend.",
    resolution:
      "Two-track plan: (1) unlock capacity by adding a second contracted cardiologist reader, (2) open a third fixed location in Sarasota where demand-test ads already confirm $11 CPL. Fund both from reallocated brand awareness spend.",
    key_findings: [
      "Unit economics per clinic hit payback at month 9 at current CAC",
      "No-show rate of 14% represents $6–9k/mo leaked revenue, recoverable with deposit + 3-touch reminder",
      "Membership program exists but has <2% attach rate — pure underpenetration, not product problem",
      "Founder-led brand is asset, not bottleneck — clients trust the clinical voice more than the ad creative",
    ],
    recommendations: [
      "Sign second reader contract before Sarasota lease (capacity first, capacity second)",
      "Ship deposit-on-booking + 3-touch reminder stack in Q2 — fastest ROI on the board",
      "Build the content engine by end of Q3 to shift lead mix toward organic by year-end",
      "Defer national expansion until Sarasota hits break-even (expected Q2 2027)",
    ],
    updated_at: "2026-04-18",
  },
};

export const hypotheses: Hypothesis[] = [
  {
    id: "h1",
    client_id: "stroke-scan-plus",
    statement:
      "Capacity, not demand, is the binding constraint on growth past 500 scans/mo",
    status: "confirmed",
    owner: "Alan Bonner",
    evidence:
      "Cardiologist review queue hit 3-day SLA breach twice in March despite clinics running below physical slot capacity. Demand-test ads in Sarasota returned $11 CPL, below FL average.",
    so_what: "Unblock capacity before investing further in acquisition.",
    parent_id: null,
  },
  {
    id: "h2",
    client_id: "stroke-scan-plus",
    statement:
      "A second cardiologist reader is economically justified at current volume",
    status: "in_progress",
    owner: "Maria",
    evidence:
      "At 500 scans/mo, reader cost per scan is $11 if contracted hourly, $14 if retainer. Both below the 10% margin threshold.",
    so_what:
      "Propose hourly-contract reader to founder; model dips below 10% only if scan volume drops 20%+.",
    parent_id: "h1",
  },
  {
    id: "h3",
    client_id: "stroke-scan-plus",
    statement:
      "No-show stack (deposit + 3-touch reminder) recovers 15% of lost bookings",
    status: "in_progress",
    owner: "Alan Bonner",
    evidence:
      "Industry benchmarks show 30–50% reduction in no-show after deposit adoption. 3-touch reminder alone typically recovers 8–12%.",
    so_what:
      "Pilot in one clinic in May; scale network-wide if no-show rate drops below 10%.",
    parent_id: null,
  },
  {
    id: "h4",
    client_id: "stroke-scan-plus",
    statement:
      "Membership program attach can be lifted from 2% to 15% with post-scan sequence",
    status: "untested",
    owner: "Alan Bonner",
    evidence: "",
    so_what: "If confirmed, adds $8–12k/mo recurring revenue at steady state.",
    parent_id: null,
  },
  {
    id: "h5",
    client_id: "stroke-scan-plus",
    statement:
      "Organic content can shift lead mix from 5% to 20% organic by end of year",
    status: "untested",
    owner: "Content lead (TBD)",
    evidence: "Competitor Life Line gets ~30% organic per SEMrush data.",
    so_what:
      "If confirmed, reduces blended CAC by 18% and creates defensibility against paid volatility.",
    parent_id: null,
  },
];

export const deliverables: Deliverable[] = [
  {
    id: "dv1",
    client_id: "stroke-scan-plus",
    name: "Q2 Strategic Recommendation — Capacity & Sarasota",
    type: "deck",
    owner: "Alan Bonner",
    status: "review",
    due_date: "2026-04-25",
    delivered_date: null,
    url: "#",
    notes: "Synthesis + second reader case + Sarasota timeline",
  },
  {
    id: "dv2",
    client_id: "stroke-scan-plus",
    name: "Clinic Unit Economics Model v3",
    type: "model",
    owner: "Maria",
    status: "drafting",
    due_date: "2026-05-05",
    delivered_date: null,
    url: "#",
    notes: "Add second-reader scenario, Sarasota ramp curve",
  },
  {
    id: "dv3",
    client_id: "stroke-scan-plus",
    name: "Landing Page Copy v2",
    type: "memo",
    owner: "Alan Bonner",
    status: "ready",
    due_date: "2026-04-20",
    delivered_date: null,
    url: "#",
    notes: "Warmer tone per Dr. Patel feedback",
  },
  {
    id: "dv4",
    client_id: "stroke-scan-plus",
    name: "Senior Community Partnership One-Pager",
    type: "memo",
    owner: "Alan Bonner",
    status: "drafting",
    due_date: "2026-04-24",
    delivered_date: null,
    url: "#",
    notes: "Target: 8 active-adult communities",
  },
  {
    id: "dv5",
    client_id: "stroke-scan-plus",
    name: "Q1 Performance Report",
    type: "report",
    owner: "Alan Bonner",
    status: "delivered",
    due_date: "2026-04-05",
    delivered_date: "2026-04-03",
    url: "#",
    notes: "KPI summary + campaign breakdown + Q2 recommendations",
  },
];

export const stakeholders: Stakeholder[] = [
  {
    id: "sk1",
    client_id: "stroke-scan-plus",
    name: "Dr. Raj Patel",
    role: "Founder & Lead Cardiologist",
    email: "raj@strokescanplus.com",
    influence: "high",
    posture: "champion",
    last_contact: "2026-04-17",
    notes:
      "Decision maker. Prioritizes brand trust over volume. Sensitive to anything that feels 'aggressive'. Best reached in morning.",
  },
  {
    id: "sk2",
    client_id: "stroke-scan-plus",
    name: "Maria Sanchez",
    role: "Operations Director",
    email: "maria@strokescanplus.com",
    influence: "medium",
    posture: "supportive",
    last_contact: "2026-04-17",
    notes:
      "Owns clinic operations and scheduling. Pragmatic. Our main day-to-day counterpart. Can unlock Dr. Patel's time.",
  },
  {
    id: "sk3",
    client_id: "stroke-scan-plus",
    name: "Jordan Lee",
    role: "Marketing Coordinator",
    email: "jordan@strokescanplus.com",
    influence: "low",
    posture: "supportive",
    last_contact: "2026-04-15",
    notes: "Executes paid + email. Newer to role, receptive to coaching.",
  },
  {
    id: "sk4",
    client_id: "stroke-scan-plus",
    name: "Mark Reeves",
    role: "Outside CFO (fractional)",
    email: "mark@reeves-cfo.com",
    influence: "high",
    posture: "skeptical",
    last_contact: "2026-03-28",
    notes:
      "Hired to advise on capital decisions (Sarasota, second reader). Risk-averse; wants proof points before incremental spend. Will be in the room for Q2 rec.",
  },
];

export const risks: Risk[] = [
  {
    id: "r1",
    client_id: "stroke-scan-plus",
    title: "Cardiologist bottleneck blocks growth mid-quarter",
    description:
      "Current reader workflow caps network at ~80 scans/day. March already hit the ceiling twice. If Sarasota opens before second reader is in place, SLA breaches compound and will damage brand.",
    likelihood: "high",
    impact: "high",
    mitigation:
      "Gate Sarasota opening on signed second-reader contract. Maria building economics model by May 5.",
    owner: "Alan Bonner",
    status: "mitigating",
    visibility: "internal",
  },
  {
    id: "r2",
    client_id: "stroke-scan-plus",
    title: "Outside CFO blocks Q2 recommendation",
    description:
      "Mark Reeves has signaled skepticism about capital spend before Q1 performance is 'proven'. Risk that Q2 strategic deck gets tabled.",
    likelihood: "medium",
    impact: "high",
    mitigation:
      "Pre-brief Mark 1:1 before the group meeting. Lead with Q1 performance against plan; pair Sarasota case with second-reader as risk mitigation.",
    owner: "Alan Bonner",
    status: "open",
    visibility: "internal",
  },
  {
    id: "r3",
    client_id: "stroke-scan-plus",
    title: "Founder burnout risk as clinic lead + ad talent",
    description:
      "Dr. Patel is both operator and creative — appears in highest-performing ad creative. If he stops producing, paid engine degrades within 4–6 weeks.",
    likelihood: "medium",
    impact: "high",
    mitigation:
      "Build creative bench: 3 patient testimonial videos + 2 staff-led explainers queued by end of Q2.",
    owner: "Jordan Lee",
    status: "open",
    visibility: "internal",
  },
  {
    id: "r4",
    client_id: "stroke-scan-plus",
    title: "CRM adoption friction from founder",
    description:
      "Founder has cited 'no time to learn new tools' as objection. Manual reminder workflow is a known leak but tool rollout may stall.",
    likelihood: "medium",
    impact: "medium",
    mitigation:
      "Frame CRM pilot as part of Sarasota launch (new clinic = new workflow, not retrofit).",
    owner: "Alan Bonner",
    status: "open",
    visibility: "internal",
  },
];

export const clientActions: ClientAction[] = [
  {
    id: "ca1",
    client_id: "stroke-scan-plus",
    item: "Review + respond to Sarasota lease options",
    owner: "Dr. Patel",
    due_date: "2026-04-25",
    status: "not_started",
    notes: "2 options sent; decision required to hold the Sept 1 opening",
  },
  {
    id: "ca2",
    client_id: "stroke-scan-plus",
    item: "Approve second-reader economics model",
    owner: "Dr. Patel + Mark Reeves",
    due_date: "2026-05-10",
    status: "not_started",
    notes: "Maria will present; need sign-off to recruit",
  },
  {
    id: "ca3",
    client_id: "stroke-scan-plus",
    item: "Share Q1 patient satisfaction survey results",
    owner: "Maria",
    due_date: "2026-04-30",
    status: "in_progress",
    notes: "Needed for testimonial creative + brand positioning work",
  },
  {
    id: "ca4",
    client_id: "stroke-scan-plus",
    item: "Intro Alan to mayor's office (senior-community program)",
    owner: "Dr. Patel",
    due_date: "2026-05-01",
    status: "not_started",
    notes: "",
  },
];

export const impacts: Impact[] = [
  {
    id: "im1",
    client_id: "stroke-scan-plus",
    name: "Cost per lead reduction (Meta)",
    category: "efficiency",
    value_label: "CPL $11.40 → $8.40",
    value_numeric: 3600,
    realized_date: "2026-03-31",
    initiative_link: "Paid campaign optimization",
    notes:
      "Creative refresh + audience narrowing. Saves ~$3.6k/mo at current spend.",
  },
  {
    id: "im2",
    client_id: "stroke-scan-plus",
    name: "Show-up rate improvement",
    category: "revenue",
    value_label: "84.2% → 87.3%",
    value_numeric: 2200,
    realized_date: "2026-03-31",
    initiative_link: "SMS reminder cadence tweak",
    notes: "Simple cadence change; ~$2.2k/mo incremental revenue.",
  },
  {
    id: "im3",
    client_id: "stroke-scan-plus",
    name: "Q1 revenue vs. plan",
    category: "revenue",
    value_label: "+$2.3k above plan",
    value_numeric: 2300,
    realized_date: "2026-03-31",
    initiative_link: "Overall engagement",
    notes: "March beat goal by $2.3k after two months under plan.",
  },
  {
    id: "im4",
    client_id: "stroke-scan-plus",
    name: "Projected: Sarasota opening (Q4 2026)",
    category: "revenue",
    value_label: "+$45k MRR at steady state",
    value_numeric: 45000,
    realized_date: null,
    initiative_link: "Open Sarasota clinic",
    notes: "Projection — realized only when clinic hits break-even.",
  },
  {
    id: "im5",
    client_id: "stroke-scan-plus",
    name: "Projected: No-show stack",
    category: "revenue",
    value_label: "+$6–9k/mo recovered",
    value_numeric: 7500,
    realized_date: null,
    initiative_link: "3-touch no-show reminder build",
    notes: "Projection — pilots in May.",
  },
];

export const commercial: Record<string, Commercial> = {
  "stroke-scan-plus": {
    client_id: "stroke-scan-plus",
    engagement_name: "Stroke Scan Plus — Growth Engagement, 2026",
    budget_hours: 640,
    budget_fee: 96000,
    hours_burned: 218,
    fee_invoiced: 36000,
    start_date: "2026-02-01",
    end_date: "2026-12-31",
    margin_pct: 42,
    notes:
      "Monthly retainer $8k + project scope for Sarasota launch playbook. Tracking on plan.",
    visibility: "internal",
  },
  "greenleaf-dental": {
    client_id: "greenleaf-dental",
    engagement_name: "Greenleaf Dental — Audit & Phase 1, 2026",
    budget_hours: 120,
    budget_fee: 24000,
    hours_burned: 34,
    fee_invoiced: 8000,
    start_date: "2026-04-01",
    end_date: "2026-07-31",
    margin_pct: 38,
    notes: "Audit phase; retainer starts post-audit approval",
    visibility: "internal",
  },
};

// ───── Phase 1 new ─────

export const builds: Build[] = [
  {
    id: "b1",
    client_id: "stroke-scan-plus",
    name: "Risk-calculator landing page (interactive)",
    status: "in_flight",
    owner: "Alan Bonner",
    url: "https://lab.strokescanplus.com/risk",
    problem_solved:
      "Static LP converts at 12%; interactive risk quiz benchmark is 18–22%.",
    notes: "Replaces current LP. Ships before Sarasota launch.",
    created_at: "2026-04-02",
    shipped_at: null,
  },
  {
    id: "b2",
    client_id: "stroke-scan-plus",
    name: "3-touch no-show reminder stack",
    status: "planned",
    owner: "Ops",
    url: "",
    problem_solved:
      "14% no-show rate leaks $6–9k/mo. Email + SMS + morning-of call.",
    notes: "Pilot in one clinic in May, scale on results.",
    created_at: "2026-04-15",
    shipped_at: null,
  },
  {
    id: "b3",
    client_id: "stroke-scan-plus",
    name: "Patient KPI dashboard (internal)",
    status: "shipped",
    owner: "Alan Bonner",
    url: "https://strokescanplus.client-os.app",
    problem_solved:
      "Dr. Patel and Maria need a same-day view of bookings, show-ups, and reader queue without opening the booking tool.",
    notes: "Live since March 12. Refreshes hourly.",
    created_at: "2026-03-01",
    shipped_at: "2026-03-12",
  },
];

export const prospects: Prospect[] = [
  {
    id: "p1",
    name: "Coastal HVAC Co.",
    vertical: "home_services",
    stage: "scoping",
    expected_value: 60000,
    expected_close: "2026-06-15",
    notes:
      "Founder reached out via referral. Looking for revenue lift on residential service contracts. Q2 close realistic.",
    owner: "Alan Bonner",
    created_at: "2026-04-12",
  },
  {
    id: "p2",
    name: "Lone Star Plumbing",
    vertical: "home_services",
    stage: "lead",
    expected_value: 45000,
    expected_close: "2026-08-01",
    notes:
      "First call this week. Interested in dispatch optimization more than acquisition.",
    owner: "Business partner",
    created_at: "2026-04-22",
  },
  {
    id: "p3",
    name: "Apex Roofing",
    vertical: "home_services",
    stage: "proposal",
    expected_value: 80000,
    expected_close: "2026-05-30",
    notes:
      "Sent proposal April 24. Waiting on owner sign-off. Likely close.",
    owner: "Alan Bonner",
    created_at: "2026-03-29",
  },
];

export const playbooks: Playbook[] = [
  {
    id: "pb1",
    title: "Home services growth — first 90 days",
    vertical: "home_services",
    problem: "revenue",
    content_md:
      "## Week 1–2\n- Audit: ad accounts, GMB, review velocity, dispatch software\n- Stakeholder map: owner + ops + senior tech\n\n## Week 3–6\n- Set KPI baseline (jobs booked, avg ticket, close rate, revenue/tech-day)\n- Launch quick-win: GMB optimization + review request automation\n\n## Week 7–12\n- Paid launch (Google Local Services + Meta retargeting)\n- Dispatch / capacity model — reveal hidden capacity before scaling demand",
    tags: ["home_services", "growth", "first_90"],
    created_at: "2026-04-01",
    updated_at: "2026-04-20",
  },
  {
    id: "pb2",
    title: "Healthcare DTC — paid scaling diagnostic",
    vertical: "healthcare",
    problem: "revenue",
    content_md:
      "When revenue plateau hits at 80% capacity, the constraint is ops not demand. Test capacity unlock before more ad spend.",
    tags: ["healthcare", "capacity", "diagnostic"],
    created_at: "2026-03-15",
    updated_at: "2026-04-10",
  },
  {
    id: "pb3",
    title: "Procurement diagnostic — universal",
    vertical: "all",
    problem: "procurement",
    content_md:
      "Step 1: vendor concentration. Step 2: top-10 spend by category. Step 3: switching cost vs. price delta. Step 4: shortlist for renegotiation.",
    tags: ["procurement", "diagnostic"],
    created_at: "2026-02-20",
    updated_at: "2026-02-20",
  },
];

export const lessons: Lesson[] = [
  {
    id: "ls1",
    client_id: "stroke-scan-plus",
    title: "Founders prefer being IN the creative, not directing it",
    content:
      "Dr. Patel's screen time in ads outperforms staff-led creative by 2.4x ROAS. Plan creative production to make the founder the talent, not the brief writer.",
    tags: ["healthcare", "creative", "founder_brand"],
    created_at: "2026-04-12",
  },
  {
    id: "ls2",
    client_id: null,
    title: "Frame new tools as part of new launches, not retrofits",
    content:
      "Got founder buy-in on CRM by tying it to the Sarasota launch instead of selling it as a standalone fix to existing clinics. New-clinic-new-workflow framing reduced friction.",
    tags: ["change_management", "tooling"],
    created_at: "2026-04-18",
  },
];
