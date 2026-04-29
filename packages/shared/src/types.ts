// ───── Status / priority enums ─────
export type Status =
  | "not_started"
  | "in_progress"
  | "blocked"
  | "done"
  | "paused";

export type Priority = "low" | "medium" | "high" | "critical";
export type Difficulty = "easy" | "medium" | "hard";
export type CampaignStatus = "draft" | "live" | "paused" | "ended";

// Internal-only flag retained on `risks` and `commercial`. All other artifacts
// are visible to clients now (the Brain zone is the only private space).
export type Visibility = "internal" | "shared";

// ───── Verticals + lens ─────
export type Vertical = "home_services" | "healthcare" | "other";

// What this client's spine actually is — drives which metrics feature on The File.
export type PrimaryLens =
  | "revenue"
  | "procurement"
  | "hiring"
  | "ops"
  | "mixed";

export type EngagementStage = "diagnose" | "design" | "deliver" | "sustain";
export type HealthStatus = "on_track" | "at_risk" | "critical";

// ───── Core ─────
export type Client = {
  id: string;
  name: string;
  industry: string;
  main_offer: string;
  current_status: string;
  goal_90_day: string;
  long_term_goal: string;
  next_actions: string[];
  vertical?: Vertical;
  primary_lens?: PrimaryLens;
  engagement_stage?: EngagementStage;
  health?: HealthStatus;
};

export type Brief = {
  client_id: string;
  business_overview: string;
  target_audience: string;
  core_offer: string;
  pricing: string;
  upsells: string;
  competitors: string;
  marketing_channels: string;
  operational_constraints: string;
  notes: string;
};

// ───── KPIs ─────
export type KpiEntry = {
  id: string;
  client_id: string;
  period_type: "weekly" | "monthly";
  period_label: string;
  revenue_goal: number;
  revenue: number;
  patient_volume_goal: number;
  leads_goal: number;
  leads: number;
  bookings_goal: number;
  bookings: number;
  show_ups: number;
  show_up_rate: number;
  cost_per_lead: number;
  cost_per_booking: number;
  cost_per_show_up: number;
  ad_spend: number;
  profit_estimate: number;
};

// ───── Roadmap / Initiatives ─────
export type Initiative = {
  id: string;
  client_id: string;
  horizon: "short" | "mid" | "long";
  title: string;
  description: string;
  priority: Priority;
  owner: string;
  due_date: string;
  status: Status;
  expected_impact: string;
};

// ───── Campaigns ─────
export type Campaign = {
  id: string;
  client_id: string;
  name: string;
  platform: string;
  target_location: string;
  budget: number;
  start_date: string;
  end_date: string;
  creative_angle: string;
  results: string;
  notes: string;
  status: CampaignStatus;
};

// ───── Meeting Notes ─────
export type MeetingNote = {
  id: string;
  client_id: string;
  date: string;
  attendees: string[];
  summary: string;
  key_facts: string[];
  decisions: string[];
  action_items: Array<{ item: string; owner: string; deadline: string }>;
};

// ───── Decisions ─────
export type Decision = {
  id: string;
  client_id: string;
  date: string;
  decision: string;
  reason: string;
  owner: string;
  related: string;
};

// ───── Opportunities ─────
export type Opportunity = {
  id: string;
  client_id: string;
  name: string;
  description: string;
  estimated_impact: string;
  difficulty: Difficulty;
  priority: Priority;
  status: Status;
  next_step: string;
};

// ───── Data Room ─────
export type DataRoomItem = {
  id: string;
  client_id: string;
  file_name: string;
  category: string;
  description: string;
  url: string;
  date_added: string;
};

// ───── Tasks ─────
export type Task = {
  id: string;
  client_id: string;
  name: string;
  owner: string;
  due_date: string;
  status: Status;
  priority: Priority;
  notes: string;
};

// ───── Synthesis ─────
export type Synthesis = {
  client_id: string;
  headline: string;
  situation: string;
  complication: string;
  resolution: string;
  key_findings: string[];
  recommendations: string[];
  updated_at: string;
};

// ───── Hypotheses ─────
export type HypothesisStatus =
  | "untested"
  | "in_progress"
  | "confirmed"
  | "rejected";

export type Hypothesis = {
  id: string;
  client_id: string;
  statement: string;
  status: HypothesisStatus;
  owner: string;
  evidence: string;
  so_what: string;
  parent_id: string | null;
};

// ───── Deliverables ─────
export type DeliverableType =
  | "deck"
  | "model"
  | "memo"
  | "report"
  | "other";

export type DeliverableStatus =
  | "drafting"
  | "review"
  | "ready"
  | "delivered";

export type Deliverable = {
  id: string;
  client_id: string;
  name: string;
  type: DeliverableType;
  owner: string;
  status: DeliverableStatus;
  due_date: string;
  delivered_date: string | null;
  url: string;
  notes: string;
};

// ───── Stakeholders ─────
export type InfluenceLevel = "low" | "medium" | "high";
export type StakeholderPosture =
  | "champion"
  | "supportive"
  | "neutral"
  | "skeptical"
  | "blocker";

export type Stakeholder = {
  id: string;
  client_id: string;
  name: string;
  role: string;
  email: string;
  influence: InfluenceLevel;
  posture: StakeholderPosture;
  last_contact: string;
  notes: string;
};

// ───── Risks (internal-only) ─────
export type Risk = {
  id: string;
  client_id: string;
  title: string;
  description: string;
  likelihood: InfluenceLevel;
  impact: InfluenceLevel;
  mitigation: string;
  owner: string;
  status: "open" | "mitigating" | "closed";
  visibility: Visibility; // retained — risks stay internal by default
};

// ───── Client Actions ─────
export type ClientAction = {
  id: string;
  client_id: string;
  item: string;
  owner: string;
  due_date: string;
  status: Status;
  notes: string;
};

// ───── Impact ─────
export type ImpactCategory =
  | "revenue"
  | "cost_savings"
  | "efficiency"
  | "risk_reduction"
  | "other";

export type Impact = {
  id: string;
  client_id: string;
  name: string;
  category: ImpactCategory;
  value_label: string;
  value_numeric: number;
  realized_date: string | null;
  initiative_link: string;
  notes: string;
};

// ───── Commercial (internal-only) ─────
export type Commercial = {
  client_id: string;
  engagement_name: string;
  budget_hours: number;
  budget_fee: number;
  hours_burned: number;
  fee_invoiced: number;
  start_date: string;
  end_date: string;
  margin_pct: number;
  notes: string;
  visibility: Visibility; // retained — commercial stays internal
};

// ───── Custom Builds (Phase 1 new) ─────
export type BuildStatus =
  | "planned"
  | "in_flight"
  | "shipped"
  | "deprecated";

export type Build = {
  id: string;
  client_id: string;
  name: string;
  status: BuildStatus;
  owner: string;
  url: string;
  problem_solved: string;
  notes: string;
  created_at: string;
  shipped_at: string | null;
};

// ───── Pipeline / Prospects (Brain zone) ─────
export type ProspectStage =
  | "lead"
  | "scoping"
  | "proposal"
  | "negotiation"
  | "closed_won"
  | "closed_lost";

export type Prospect = {
  id: string;
  name: string;
  vertical: Vertical;
  stage: ProspectStage;
  expected_value: number;
  expected_close: string;
  notes: string;
  owner: string;
  created_at: string;
};

// ───── Practice (firm playbooks + lessons) ─────
export type Playbook = {
  id: string;
  title: string;
  vertical: Vertical | "all";
  problem: PrimaryLens | "all";
  content_md: string;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type Lesson = {
  id: string;
  client_id: string | null; // null = firm-wide
  title: string;
  content: string;
  tags: string[];
  created_at: string;
};

// ───── MCP / auth (Phase 2) ─────
export type PersonalAccessToken = {
  id: string;
  user_id: string;
  name: string;
  hashed_token: string;
  last_used_at: string | null;
  created_at: string;
  revoked_at: string | null;
};

export type McpAuditEntry = {
  id: string;
  user_id: string;
  tool_name: string;
  args_json: Record<string, unknown>;
  result_status: "ok" | "error";
  error_message: string | null;
  created_at: string;
};

// ───── Auth / profile ─────
export type Role = "team_member" | "client";
export type Profile = {
  id: string;
  role: Role;
  client_id: string | null;
  full_name: string;
  must_change_password: boolean;
};

export type OperationsBlock = {
  id: string;
  client_id: string;
  section_key: string;
  position: number;
  content_md: string;
  updated_at: string;
  updated_by: string | null;
};

export const OPERATIONS_SECTIONS = [
  {
    key: "snapshot",
    label: "Snapshot",
    hint: "One paragraph the partner reading this needs to know first.",
  },
  {
    key: "revenue",
    label: "How they make money",
    hint: "Revenue model, mix, seasonality, concentration.",
  },
  {
    key: "cost",
    label: "How they spend money",
    hint: "Cost structure, margin shape.",
  },
  {
    key: "flow",
    label: "How the work gets done",
    hint: "Intake → fulfillment → support flow.",
  },
  {
    key: "people",
    label: "People & decisions",
    hint: "Org, who owns what, who approves what.",
  },
  {
    key: "stack",
    label: "Stack",
    hint: "Tools, systems, where data lives.",
  },
  {
    key: "constraints",
    label: "Constraints",
    hint: "What's holding the business back today.",
  },
  {
    key: "leverage",
    label: "Leverage",
    hint: "What's working, what scales, where to push.",
  },
  {
    key: "notes",
    label: "Free notes",
    hint: "Bottom catch-all.",
  },
] as const;

export type OperationsSectionKey = (typeof OPERATIONS_SECTIONS)[number]["key"];

export type ClientInvite = {
  id: string;
  client_id: string;
  label: string;
  token_prefix: string;
  created_by: string | null;
  created_at: string;
  expires_at: string | null;
  revoked_at: string | null;
  max_uses: number | null;
  use_count: number;
  last_used_at: string | null;
};

// ───── IA module registry — new 2-zone model ─────
// `zone: "brain"` lives in the admin zone; `zone: "client"` is per-client.
// `clientFacing` controls whether clients see the surface when they log in.
export const SURFACES = [
  // Brain (admin zone)
  { zone: "brain", slug: "", label: "Brain", clientFacing: false },
  { zone: "brain", slug: "pipeline", label: "Pipeline", clientFacing: false },
  { zone: "brain", slug: "practice", label: "Practice", clientFacing: false },
  { zone: "brain", slug: "invites", label: "Invites", clientFacing: false },
  { zone: "brain", slug: "audit", label: "Audit", clientFacing: false },

  // Client surfaces
  { zone: "client", slug: "numbers", label: "Numbers", clientFacing: true },
  { zone: "client", slug: "file", label: "File", clientFacing: true },
  { zone: "client", slug: "plan", label: "Plan", clientFacing: true },
  { zone: "client", slug: "work", label: "Work", clientFacing: true },
  { zone: "client", slug: "anatomy", label: "Anatomy", clientFacing: true },
  { zone: "client", slug: "room", label: "Room", clientFacing: true },
  { zone: "client", slug: "timeline", label: "Timeline", clientFacing: true },
] as const;

export type Surface = (typeof SURFACES)[number];

// Legacy export — some components still import MODULES. Kept as alias to the
// client-zone surfaces so old code resolves while we migrate.
export const MODULES = SURFACES.filter((s) => s.zone === "client");
