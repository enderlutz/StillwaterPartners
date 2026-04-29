import {
  briefs as mockBriefs,
  builds as mockBuilds,
  campaigns as mockCampaigns,
  clientActions as mockClientActions,
  clients as mockClients,
  commercial as mockCommercial,
  dataRoom as mockDataRoom,
  decisions as mockDecisions,
  deliverables as mockDeliverables,
  hypotheses as mockHypotheses,
  impacts as mockImpacts,
  initiatives as mockInitiatives,
  kpis as mockKpis,
  lessons as mockLessons,
  meetingNotes as mockMeetingNotes,
  opportunities as mockOpportunities,
  playbooks as mockPlaybooks,
  prospects as mockProspects,
  risks as mockRisks,
  stakeholders as mockStakeholders,
  synthesis as mockSynthesis,
  tasks as mockTasks,
} from "@client-os/shared/mock";
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
} from "@client-os/shared";
import { db } from "./db.js";
import { env } from "./env.js";

// ─── helpers ───────────────────────────────────────────────────────────────
async function selectAll<T>(
  table: string,
  filter?: { column: string; value: string },
): Promise<T[]> {
  const supabase = db();
  if (!supabase) throw new Error("Supabase not configured");
  let q = supabase.from(table).select("*");
  if (filter) q = q.eq(filter.column, filter.value);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []) as T[];
}

async function selectOne<T>(
  table: string,
  filter: { column: string; value: string },
): Promise<T | null> {
  const supabase = db();
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq(filter.column, filter.value)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as T | null) ?? null;
}

async function insertRow<T>(table: string, row: Partial<T>): Promise<T> {
  const supabase = db();
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from(table)
    .insert(row as never)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as T;
}

async function upsertRow<T>(
  table: string,
  row: Partial<T>,
  onConflict: string,
): Promise<T> {
  const supabase = db();
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from(table)
    .upsert(row as never, { onConflict })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as T;
}

async function updateRow<T>(
  table: string,
  id: string,
  patch: Partial<T>,
): Promise<T> {
  const supabase = db();
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from(table)
    .update(patch as never)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as T;
}

function refuseWrite(): never {
  throw new Error(
    "Backend is in MOCK mode — set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY to enable writes.",
  );
}

// ─── Clients ───────────────────────────────────────────────────────────────
export async function listClients(): Promise<Client[]> {
  if (env.isMock) return mockClients;
  return selectAll<Client>("clients");
}

export async function getClient(id: string): Promise<Client | null> {
  if (env.isMock) return mockClients.find((c) => c.id === id) ?? null;
  return selectOne<Client>("clients", { column: "id", value: id });
}

export async function addClient(c: Omit<Client, "next_actions"> & {
  next_actions?: string[];
}): Promise<Client> {
  if (env.isMock) refuseWrite();
  return insertRow<Client>("clients", { ...c, next_actions: c.next_actions ?? [] });
}

// ─── Brief ─────────────────────────────────────────────────────────────────
export async function getBrief(clientId: string): Promise<Brief | null> {
  if (env.isMock) return mockBriefs[clientId] ?? null;
  return selectOne<Brief>("briefs", { column: "client_id", value: clientId });
}

export async function upsertBrief(b: Brief): Promise<Brief> {
  if (env.isMock) refuseWrite();
  return upsertRow<Brief>("briefs", b, "client_id");
}

// ─── Synthesis ─────────────────────────────────────────────────────────────
export async function getSynthesis(clientId: string): Promise<Synthesis | null> {
  if (env.isMock) return mockSynthesis[clientId] ?? null;
  return selectOne<Synthesis>("synthesis", {
    column: "client_id",
    value: clientId,
  });
}

export async function upsertSynthesis(s: Synthesis): Promise<Synthesis> {
  if (env.isMock) refuseWrite();
  return upsertRow<Synthesis>(
    "synthesis",
    { ...s, updated_at: new Date().toISOString() },
    "client_id",
  );
}

// ─── KPIs ──────────────────────────────────────────────────────────────────
export async function listKpis(
  clientId: string,
  periodType?: KpiEntry["period_type"],
): Promise<KpiEntry[]> {
  let rows = env.isMock
    ? mockKpis.filter((k) => k.client_id === clientId)
    : await selectAll<KpiEntry>("kpi_entries", {
        column: "client_id",
        value: clientId,
      });
  if (periodType) rows = rows.filter((k) => k.period_type === periodType);
  return rows;
}

export async function addKpiEntry(k: KpiEntry): Promise<KpiEntry> {
  if (env.isMock) refuseWrite();
  return insertRow<KpiEntry>("kpi_entries", k);
}

// ─── Initiatives ───────────────────────────────────────────────────────────
export async function listInitiatives(clientId: string): Promise<Initiative[]> {
  if (env.isMock) return mockInitiatives.filter((i) => i.client_id === clientId);
  return selectAll<Initiative>("initiatives", {
    column: "client_id",
    value: clientId,
  });
}

export async function addInitiative(i: Initiative): Promise<Initiative> {
  if (env.isMock) refuseWrite();
  return insertRow<Initiative>("initiatives", i);
}

export async function updateInitiativeStatus(
  id: string,
  status: Initiative["status"],
): Promise<Initiative> {
  if (env.isMock) refuseWrite();
  return updateRow<Initiative>("initiatives", id, { status });
}

// ─── Campaigns ─────────────────────────────────────────────────────────────
export async function listCampaigns(clientId: string): Promise<Campaign[]> {
  if (env.isMock) return mockCampaigns.filter((c) => c.client_id === clientId);
  return selectAll<Campaign>("campaigns", {
    column: "client_id",
    value: clientId,
  });
}

export async function addCampaign(c: Campaign): Promise<Campaign> {
  if (env.isMock) refuseWrite();
  return insertRow<Campaign>("campaigns", c);
}

// ─── Meetings ──────────────────────────────────────────────────────────────
export async function listMeetings(clientId: string): Promise<MeetingNote[]> {
  if (env.isMock) return mockMeetingNotes.filter((m) => m.client_id === clientId);
  return selectAll<MeetingNote>("meeting_notes", {
    column: "client_id",
    value: clientId,
  });
}

export async function addMeetingNote(m: MeetingNote): Promise<MeetingNote> {
  if (env.isMock) refuseWrite();
  return insertRow<MeetingNote>("meeting_notes", m);
}

// ─── Decisions ─────────────────────────────────────────────────────────────
export async function listDecisions(clientId: string): Promise<Decision[]> {
  if (env.isMock) return mockDecisions.filter((d) => d.client_id === clientId);
  return selectAll<Decision>("decisions", {
    column: "client_id",
    value: clientId,
  });
}

export async function addDecision(d: Decision): Promise<Decision> {
  if (env.isMock) refuseWrite();
  return insertRow<Decision>("decisions", d);
}

// ─── Opportunities ─────────────────────────────────────────────────────────
export async function listOpportunities(
  clientId: string,
): Promise<Opportunity[]> {
  if (env.isMock)
    return mockOpportunities.filter((o) => o.client_id === clientId);
  return selectAll<Opportunity>("opportunities", {
    column: "client_id",
    value: clientId,
  });
}

export async function addOpportunity(o: Opportunity): Promise<Opportunity> {
  if (env.isMock) refuseWrite();
  return insertRow<Opportunity>("opportunities", o);
}

export async function updateOpportunityStatus(
  id: string,
  status: Opportunity["status"],
): Promise<Opportunity> {
  if (env.isMock) refuseWrite();
  return updateRow<Opportunity>("opportunities", id, { status });
}

// ─── Data Room ─────────────────────────────────────────────────────────────
export async function listDataRoom(clientId: string): Promise<DataRoomItem[]> {
  if (env.isMock) return mockDataRoom.filter((d) => d.client_id === clientId);
  return selectAll<DataRoomItem>("data_room", {
    column: "client_id",
    value: clientId,
  });
}

export async function addDataRoomItem(d: DataRoomItem): Promise<DataRoomItem> {
  if (env.isMock) refuseWrite();
  return insertRow<DataRoomItem>("data_room", d);
}

// ─── Tasks ─────────────────────────────────────────────────────────────────
export async function listTasks(
  clientId: string,
  status?: Task["status"],
): Promise<Task[]> {
  let rows = env.isMock
    ? mockTasks.filter((t) => t.client_id === clientId)
    : await selectAll<Task>("tasks", { column: "client_id", value: clientId });
  if (status) rows = rows.filter((t) => t.status === status);
  return rows;
}

export async function addTask(t: Task): Promise<Task> {
  if (env.isMock) refuseWrite();
  return insertRow<Task>("tasks", t);
}

export async function updateTaskStatus(
  id: string,
  status: Task["status"],
): Promise<Task> {
  if (env.isMock) refuseWrite();
  return updateRow<Task>("tasks", id, { status });
}

// ─── Hypotheses ────────────────────────────────────────────────────────────
export async function listHypotheses(clientId: string): Promise<Hypothesis[]> {
  if (env.isMock) return mockHypotheses.filter((h) => h.client_id === clientId);
  return selectAll<Hypothesis>("hypotheses", {
    column: "client_id",
    value: clientId,
  });
}

export async function addHypothesis(h: Hypothesis): Promise<Hypothesis> {
  if (env.isMock) refuseWrite();
  return insertRow<Hypothesis>("hypotheses", h);
}

export async function updateHypothesisStatus(
  id: string,
  status: Hypothesis["status"],
  evidence?: string,
  soWhat?: string,
): Promise<Hypothesis> {
  if (env.isMock) refuseWrite();
  return updateRow<Hypothesis>("hypotheses", id, {
    status,
    ...(evidence !== undefined ? { evidence } : {}),
    ...(soWhat !== undefined ? { so_what: soWhat } : {}),
  });
}

// ─── Deliverables ──────────────────────────────────────────────────────────
export async function listDeliverables(clientId: string): Promise<Deliverable[]> {
  if (env.isMock) return mockDeliverables.filter((d) => d.client_id === clientId);
  return selectAll<Deliverable>("deliverables", {
    column: "client_id",
    value: clientId,
  });
}

export async function addDeliverable(d: Deliverable): Promise<Deliverable> {
  if (env.isMock) refuseWrite();
  return insertRow<Deliverable>("deliverables", d);
}

export async function updateDeliverableStatus(
  id: string,
  status: Deliverable["status"],
  deliveredDate?: string,
): Promise<Deliverable> {
  if (env.isMock) refuseWrite();
  return updateRow<Deliverable>("deliverables", id, {
    status,
    ...(deliveredDate ? { delivered_date: deliveredDate } : {}),
  });
}

// ─── Stakeholders ──────────────────────────────────────────────────────────
export async function listStakeholders(clientId: string): Promise<Stakeholder[]> {
  if (env.isMock) return mockStakeholders.filter((s) => s.client_id === clientId);
  return selectAll<Stakeholder>("stakeholders", {
    column: "client_id",
    value: clientId,
  });
}

export async function upsertStakeholder(s: Stakeholder): Promise<Stakeholder> {
  if (env.isMock) refuseWrite();
  return upsertRow<Stakeholder>("stakeholders", s, "id");
}

// ─── Risks ─────────────────────────────────────────────────────────────────
export async function listRisks(clientId: string): Promise<Risk[]> {
  if (env.isMock) return mockRisks.filter((r) => r.client_id === clientId);
  return selectAll<Risk>("risks", { column: "client_id", value: clientId });
}

export async function addRisk(r: Risk): Promise<Risk> {
  if (env.isMock) refuseWrite();
  return insertRow<Risk>("risks", r);
}

export async function updateRiskStatus(
  id: string,
  status: Risk["status"],
): Promise<Risk> {
  if (env.isMock) refuseWrite();
  return updateRow<Risk>("risks", id, { status });
}

// ─── Client actions ────────────────────────────────────────────────────────
export async function listClientActions(
  clientId: string,
  status?: ClientAction["status"],
): Promise<ClientAction[]> {
  let rows = env.isMock
    ? mockClientActions.filter((c) => c.client_id === clientId)
    : await selectAll<ClientAction>("client_actions", {
        column: "client_id",
        value: clientId,
      });
  if (status) rows = rows.filter((c) => c.status === status);
  return rows;
}

export async function addClientAction(c: ClientAction): Promise<ClientAction> {
  if (env.isMock) refuseWrite();
  return insertRow<ClientAction>("client_actions", c);
}

export async function updateClientActionStatus(
  id: string,
  status: ClientAction["status"],
): Promise<ClientAction> {
  if (env.isMock) refuseWrite();
  return updateRow<ClientAction>("client_actions", id, { status });
}

// ─── Impact ────────────────────────────────────────────────────────────────
export async function listImpacts(clientId: string): Promise<Impact[]> {
  if (env.isMock) return mockImpacts.filter((i) => i.client_id === clientId);
  return selectAll<Impact>("impacts", {
    column: "client_id",
    value: clientId,
  });
}

export async function addImpact(i: Impact): Promise<Impact> {
  if (env.isMock) refuseWrite();
  return insertRow<Impact>("impacts", i);
}

// ─── Commercial ────────────────────────────────────────────────────────────
export async function getCommercial(clientId: string): Promise<Commercial | null> {
  if (env.isMock) return mockCommercial[clientId] ?? null;
  return selectOne<Commercial>("commercial", {
    column: "client_id",
    value: clientId,
  });
}

export async function upsertCommercial(c: Commercial): Promise<Commercial> {
  if (env.isMock) refuseWrite();
  return upsertRow<Commercial>("commercial", c, "client_id");
}

// ─── Custom Builds ─────────────────────────────────────────────────────────
export async function listBuilds(clientId: string): Promise<Build[]> {
  if (env.isMock) return mockBuilds.filter((b) => b.client_id === clientId);
  return selectAll<Build>("builds", {
    column: "client_id",
    value: clientId,
  });
}

export async function addBuild(b: Build): Promise<Build> {
  if (env.isMock) refuseWrite();
  return insertRow<Build>("builds", b);
}

export async function updateBuildStatus(
  id: string,
  status: Build["status"],
  shippedAt?: string,
  url?: string,
): Promise<Build> {
  if (env.isMock) refuseWrite();
  return updateRow<Build>("builds", id, {
    status,
    ...(shippedAt ? { shipped_at: shippedAt } : {}),
    ...(url ? { url } : {}),
  });
}

// ─── Prospects (Brain) ─────────────────────────────────────────────────────
export async function listProspects(): Promise<Prospect[]> {
  if (env.isMock) return mockProspects;
  return selectAll<Prospect>("prospects");
}

export async function addProspect(p: Prospect): Promise<Prospect> {
  if (env.isMock) refuseWrite();
  return insertRow<Prospect>("prospects", p);
}

export async function updateProspectStage(
  id: string,
  stage: Prospect["stage"],
): Promise<Prospect> {
  if (env.isMock) refuseWrite();
  return updateRow<Prospect>("prospects", id, { stage });
}

// ─── Playbooks (Brain) ─────────────────────────────────────────────────────
export async function listPlaybooks(): Promise<Playbook[]> {
  if (env.isMock) return mockPlaybooks;
  return selectAll<Playbook>("playbooks");
}

export async function addPlaybook(p: Playbook): Promise<Playbook> {
  if (env.isMock) refuseWrite();
  return insertRow<Playbook>("playbooks", p);
}

// ─── Lessons (Brain) ───────────────────────────────────────────────────────
export async function listLessons(): Promise<Lesson[]> {
  if (env.isMock) return mockLessons;
  return selectAll<Lesson>("lessons");
}

export async function addLesson(l: Lesson): Promise<Lesson> {
  if (env.isMock) refuseWrite();
  return insertRow<Lesson>("lessons", l);
}

// ─── Cross-cutting: search + brief ─────────────────────────────────────────
export type SearchHit = {
  kind: string;
  client_id: string | null;
  id: string;
  title: string;
  snippet: string;
  date?: string;
};

// Simple text search across artifacts. Not full-text-index — just
// case-insensitive substring across titles + bodies. Good enough for v1;
// upgrade to Postgres FTS once data volume warrants it.
export async function search(
  query: string,
  clientId?: string,
): Promise<SearchHit[]> {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const hits: SearchHit[] = [];

  const matches = (s: string) => s.toLowerCase().includes(q);
  const snippet = (s: string, max = 160) =>
    s.length > max ? s.slice(0, max) + "…" : s;

  const restrict = <T extends { client_id: string }>(rows: T[]) =>
    clientId ? rows.filter((r) => r.client_id === clientId) : rows;

  const [
    clients,
    meetings,
    decisions,
    initiatives,
    opportunities,
    hypotheses,
    deliverables,
    builds,
    risks,
    stakeholders,
    lessons,
    playbooks,
    prospects,
  ] = await Promise.all([
    listClients(),
    clientId ? listMeetings(clientId) : allMeetings(),
    clientId ? listDecisions(clientId) : allDecisions(),
    clientId ? listInitiatives(clientId) : allInitiatives(),
    clientId ? listOpportunities(clientId) : allOpportunities(),
    clientId ? listHypotheses(clientId) : allHypotheses(),
    clientId ? listDeliverables(clientId) : allDeliverables(),
    clientId ? listBuilds(clientId) : allBuilds(),
    clientId ? listRisks(clientId) : allRisks(),
    clientId ? listStakeholders(clientId) : allStakeholders(),
    listLessons(),
    listPlaybooks(),
    listProspects(),
  ]);

  for (const c of clients) {
    if (clientId && c.id !== clientId) continue;
    if (matches(c.name) || matches(c.industry) || matches(c.main_offer)) {
      hits.push({
        kind: "client",
        id: c.id,
        client_id: c.id,
        title: c.name,
        snippet: snippet(c.main_offer),
      });
    }
  }
  for (const m of restrict(meetings)) {
    const blob = `${m.summary} ${m.key_facts.join(" ")} ${m.decisions.join(" ")}`;
    if (matches(blob)) {
      hits.push({
        kind: "meeting",
        id: m.id,
        client_id: m.client_id,
        title: `Meeting · ${m.attendees.join(", ")}`,
        snippet: snippet(m.summary),
        date: m.date,
      });
    }
  }
  for (const d of restrict(decisions)) {
    if (matches(`${d.decision} ${d.reason}`)) {
      hits.push({
        kind: "decision",
        id: d.id,
        client_id: d.client_id,
        title: d.decision,
        snippet: snippet(d.reason),
        date: d.date,
      });
    }
  }
  for (const i of restrict(initiatives)) {
    if (matches(`${i.title} ${i.description} ${i.expected_impact}`)) {
      hits.push({
        kind: "initiative",
        id: i.id,
        client_id: i.client_id,
        title: i.title,
        snippet: snippet(i.description),
      });
    }
  }
  for (const o of restrict(opportunities)) {
    if (matches(`${o.name} ${o.description} ${o.next_step}`)) {
      hits.push({
        kind: "opportunity",
        id: o.id,
        client_id: o.client_id,
        title: o.name,
        snippet: snippet(o.description),
      });
    }
  }
  for (const h of restrict(hypotheses)) {
    if (matches(`${h.statement} ${h.evidence} ${h.so_what}`)) {
      hits.push({
        kind: "hypothesis",
        id: h.id,
        client_id: h.client_id,
        title: h.statement,
        snippet: snippet(h.evidence || h.so_what),
      });
    }
  }
  for (const d of restrict(deliverables)) {
    if (matches(`${d.name} ${d.notes}`)) {
      hits.push({
        kind: "deliverable",
        id: d.id,
        client_id: d.client_id,
        title: d.name,
        snippet: snippet(d.notes),
      });
    }
  }
  for (const b of restrict(builds)) {
    if (matches(`${b.name} ${b.problem_solved} ${b.notes}`)) {
      hits.push({
        kind: "build",
        id: b.id,
        client_id: b.client_id,
        title: b.name,
        snippet: snippet(b.problem_solved),
      });
    }
  }
  for (const r of restrict(risks)) {
    if (matches(`${r.title} ${r.description} ${r.mitigation}`)) {
      hits.push({
        kind: "risk",
        id: r.id,
        client_id: r.client_id,
        title: r.title,
        snippet: snippet(r.description),
      });
    }
  }
  for (const s of restrict(stakeholders)) {
    if (matches(`${s.name} ${s.role} ${s.notes}`)) {
      hits.push({
        kind: "stakeholder",
        id: s.id,
        client_id: s.client_id,
        title: s.name,
        snippet: snippet(s.notes),
      });
    }
  }
  for (const l of lessons) {
    if (
      (clientId && l.client_id && l.client_id !== clientId) ||
      !matches(`${l.title} ${l.content} ${l.tags.join(" ")}`)
    )
      continue;
    if (matches(`${l.title} ${l.content} ${l.tags.join(" ")}`)) {
      hits.push({
        kind: "lesson",
        id: l.id,
        client_id: l.client_id,
        title: l.title,
        snippet: snippet(l.content),
      });
    }
  }
  for (const p of playbooks) {
    if (matches(`${p.title} ${p.content_md} ${p.tags.join(" ")}`)) {
      hits.push({
        kind: "playbook",
        id: p.id,
        client_id: null,
        title: p.title,
        snippet: snippet(p.content_md),
      });
    }
  }
  for (const p of prospects) {
    if (matches(`${p.name} ${p.notes}`)) {
      hits.push({
        kind: "prospect",
        id: p.id,
        client_id: null,
        title: p.name,
        snippet: snippet(p.notes),
      });
    }
  }

  return hits;
}

// Cross-client overview for the Brain. Deterministic — no Claude required.
export type BridgeBrief = {
  client_count: number;
  total_realized_revenue: number;
  total_pipeline_value: number;
  open_tasks: number;
  open_client_actions: number;
  quiet_clients: Array<{ id: string; name: string; days_quiet: number }>;
  due_this_week: Array<{
    kind: string;
    id: string;
    client_id: string | null;
    title: string;
    due_date: string;
  }>;
};

export async function bridgeBrief(): Promise<BridgeBrief> {
  const clients = await listClients();

  let revenue = 0;
  const openTasks: Array<{ id: string; client_id: string; name: string; due_date: string }> =
    [];
  const openActions: Array<{ id: string; client_id: string; item: string; due_date: string }> =
    [];
  const dueDeliverables: Array<{
    id: string;
    client_id: string;
    name: string;
    due_date: string;
  }> = [];
  const lastSeen = new Map<string, string>();

  for (const c of clients) {
    const [kpis, tasks, actions, deliverables, meetings] = await Promise.all([
      listKpis(c.id, "monthly"),
      listTasks(c.id),
      listClientActions(c.id),
      listDeliverables(c.id),
      listMeetings(c.id),
    ]);
    const latest = kpis[kpis.length - 1];
    if (latest) revenue += latest.revenue;
    for (const t of tasks)
      if (t.status !== "done")
        openTasks.push({
          id: t.id,
          client_id: t.client_id,
          name: t.name,
          due_date: t.due_date,
        });
    for (const a of actions)
      if (a.status !== "done")
        openActions.push({
          id: a.id,
          client_id: a.client_id,
          item: a.item,
          due_date: a.due_date,
        });
    for (const d of deliverables)
      if (d.status !== "delivered")
        dueDeliverables.push({
          id: d.id,
          client_id: d.client_id,
          name: d.name,
          due_date: d.due_date,
        });
    const dates = meetings.map((m) => m.date).sort();
    if (dates.length > 0) lastSeen.set(c.id, dates[dates.length - 1]!);
  }

  const prospects = await listProspects();
  const pipelineValue = prospects
    .filter((p) => p.stage !== "closed_lost" && p.stage !== "closed_won")
    .reduce((s, p) => s + p.expected_value, 0);

  // Quiet = no meetings in the last 14 days (or never).
  const today = Date.now();
  const fortnightAgo = today - 14 * 24 * 60 * 60 * 1000;
  const quietClients = clients
    .map((c) => {
      const last = lastSeen.get(c.id);
      const lastTs = last ? new Date(last).getTime() : 0;
      return {
        id: c.id,
        name: c.name,
        days_quiet: Math.floor((today - lastTs) / (24 * 60 * 60 * 1000)),
        lastTs,
      };
    })
    .filter((x) => x.lastTs < fortnightAgo)
    .sort((a, b) => b.days_quiet - a.days_quiet)
    .map(({ id, name, days_quiet }) => ({ id, name, days_quiet }));

  // Due this week.
  const inAWeek = today + 7 * 24 * 60 * 60 * 1000;
  const dueThisWeek = [
    ...openTasks.map((t) => ({
      kind: "task" as const,
      id: t.id,
      client_id: t.client_id,
      title: t.name,
      due_date: t.due_date,
    })),
    ...openActions.map((a) => ({
      kind: "client_action" as const,
      id: a.id,
      client_id: a.client_id,
      title: a.item,
      due_date: a.due_date,
    })),
    ...dueDeliverables.map((d) => ({
      kind: "deliverable" as const,
      id: d.id,
      client_id: d.client_id,
      title: d.name,
      due_date: d.due_date,
    })),
  ]
    .filter((x) => {
      const t = new Date(x.due_date).getTime();
      return t > 0 && t <= inAWeek;
    })
    .sort((a, b) => a.due_date.localeCompare(b.due_date));

  return {
    client_count: clients.length,
    total_realized_revenue: revenue,
    total_pipeline_value: pipelineValue,
    open_tasks: openTasks.length,
    open_client_actions: openActions.length,
    quiet_clients: quietClients,
    due_this_week: dueThisWeek,
  };
}

// ─── search helpers — flatten all-clients reads when no clientId given ────
async function allMeetings() {
  const cs = await listClients();
  return (await Promise.all(cs.map((c) => listMeetings(c.id)))).flat();
}
async function allDecisions() {
  const cs = await listClients();
  return (await Promise.all(cs.map((c) => listDecisions(c.id)))).flat();
}
async function allInitiatives() {
  const cs = await listClients();
  return (await Promise.all(cs.map((c) => listInitiatives(c.id)))).flat();
}
async function allOpportunities() {
  const cs = await listClients();
  return (await Promise.all(cs.map((c) => listOpportunities(c.id)))).flat();
}
async function allHypotheses() {
  const cs = await listClients();
  return (await Promise.all(cs.map((c) => listHypotheses(c.id)))).flat();
}
async function allDeliverables() {
  const cs = await listClients();
  return (await Promise.all(cs.map((c) => listDeliverables(c.id)))).flat();
}
async function allBuilds() {
  const cs = await listClients();
  return (await Promise.all(cs.map((c) => listBuilds(c.id)))).flat();
}
async function allRisks() {
  const cs = await listClients();
  return (await Promise.all(cs.map((c) => listRisks(c.id)))).flat();
}
async function allStakeholders() {
  const cs = await listClients();
  return (await Promise.all(cs.map((c) => listStakeholders(c.id)))).flat();
}
