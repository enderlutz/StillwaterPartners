import * as mock from "@client-os/shared/mock";
import { createClient } from "./supabase/server";
import { getUseMockServer } from "./settings";
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
  Profile,
  Prospect,
  Risk,
  Stakeholder,
  Synthesis,
  Task,
} from "./types";

export function useMock(): boolean {
  return getUseMockServer();
}

async function readTable<T>(
  table: string,
  fallback: T[],
  filter?: { column: string; value: string },
): Promise<T[]> {
  if (useMock()) return fallback;
  const supabase = createClient();
  if (!supabase) return fallback;
  let q = supabase.from(table).select("*");
  if (filter) q = q.eq(filter.column, filter.value);
  const { data, error } = await q;
  if (error || !data) return fallback;
  return data as T[];
}

// ─── Profile / auth helpers ────────────────────────────────────────────────
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return (data as Profile | null) ?? null;
}

// ─── Per-client surfaces ───────────────────────────────────────────────────
export async function getClients(): Promise<Client[]> {
  return readTable<Client>("clients", mock.clients);
}

export async function getClient(id: string): Promise<Client | null> {
  const all = await getClients();
  return all.find((c) => c.id === id) ?? null;
}

export async function getBrief(clientId: string): Promise<Brief | null> {
  const rows = await readTable<Brief>(
    "briefs",
    mock.briefs[clientId] ? [mock.briefs[clientId]!] : [],
    { column: "client_id", value: clientId },
  );
  return rows[0] ?? mock.briefs[clientId] ?? null;
}

export async function getKpis(clientId: string): Promise<KpiEntry[]> {
  return readTable<KpiEntry>(
    "kpi_entries",
    mock.kpis.filter((k) => k.client_id === clientId),
    { column: "client_id", value: clientId },
  );
}

export async function getInitiatives(clientId: string): Promise<Initiative[]> {
  return readTable<Initiative>(
    "initiatives",
    mock.initiatives.filter((i) => i.client_id === clientId),
    { column: "client_id", value: clientId },
  );
}

export async function getCampaigns(clientId: string): Promise<Campaign[]> {
  return readTable<Campaign>(
    "campaigns",
    mock.campaigns.filter((c) => c.client_id === clientId),
    { column: "client_id", value: clientId },
  );
}

export async function getMeetings(clientId: string): Promise<MeetingNote[]> {
  return readTable<MeetingNote>(
    "meeting_notes",
    mock.meetingNotes.filter((m) => m.client_id === clientId),
    { column: "client_id", value: clientId },
  );
}

export async function getDecisions(clientId: string): Promise<Decision[]> {
  return readTable<Decision>(
    "decisions",
    mock.decisions.filter((d) => d.client_id === clientId),
    { column: "client_id", value: clientId },
  );
}

export async function getOpportunities(
  clientId: string,
): Promise<Opportunity[]> {
  return readTable<Opportunity>(
    "opportunities",
    mock.opportunities.filter((o) => o.client_id === clientId),
    { column: "client_id", value: clientId },
  );
}

export async function getDataRoom(clientId: string): Promise<DataRoomItem[]> {
  return readTable<DataRoomItem>(
    "data_room",
    mock.dataRoom.filter((d) => d.client_id === clientId),
    { column: "client_id", value: clientId },
  );
}

export async function getTasks(clientId: string): Promise<Task[]> {
  return readTable<Task>(
    "tasks",
    mock.tasks.filter((t) => t.client_id === clientId),
    { column: "client_id", value: clientId },
  );
}

export async function getSynthesis(
  clientId: string,
): Promise<Synthesis | null> {
  const rows = await readTable<Synthesis>(
    "synthesis",
    mock.synthesis[clientId] ? [mock.synthesis[clientId]!] : [],
    { column: "client_id", value: clientId },
  );
  return rows[0] ?? mock.synthesis[clientId] ?? null;
}

export async function getHypotheses(clientId: string): Promise<Hypothesis[]> {
  return readTable<Hypothesis>(
    "hypotheses",
    mock.hypotheses.filter((h) => h.client_id === clientId),
    { column: "client_id", value: clientId },
  );
}

export async function getDeliverables(
  clientId: string,
): Promise<Deliverable[]> {
  return readTable<Deliverable>(
    "deliverables",
    mock.deliverables.filter((d) => d.client_id === clientId),
    { column: "client_id", value: clientId },
  );
}

export async function getStakeholders(
  clientId: string,
): Promise<Stakeholder[]> {
  return readTable<Stakeholder>(
    "stakeholders",
    mock.stakeholders.filter((s) => s.client_id === clientId),
    { column: "client_id", value: clientId },
  );
}

export async function getRisks(clientId: string): Promise<Risk[]> {
  return readTable<Risk>(
    "risks",
    mock.risks.filter((r) => r.client_id === clientId),
    { column: "client_id", value: clientId },
  );
}

export async function getClientActions(
  clientId: string,
): Promise<ClientAction[]> {
  return readTable<ClientAction>(
    "client_actions",
    mock.clientActions.filter((c) => c.client_id === clientId),
    { column: "client_id", value: clientId },
  );
}

export async function getImpacts(clientId: string): Promise<Impact[]> {
  return readTable<Impact>(
    "impacts",
    mock.impacts.filter((i) => i.client_id === clientId),
    { column: "client_id", value: clientId },
  );
}

export async function getCommercial(
  clientId: string,
): Promise<Commercial | null> {
  const rows = await readTable<Commercial>(
    "commercial",
    mock.commercial[clientId] ? [mock.commercial[clientId]!] : [],
    { column: "client_id", value: clientId },
  );
  return rows[0] ?? mock.commercial[clientId] ?? null;
}

// ─── Phase 1 new — per-client ──────────────────────────────────────────────
export async function getBuilds(clientId: string): Promise<Build[]> {
  return readTable<Build>(
    "builds",
    mock.builds.filter((b) => b.client_id === clientId),
    { column: "client_id", value: clientId },
  );
}

// ─── Phase 1 new — Brain (firm-level) ──────────────────────────────────────
export async function getProspects(): Promise<Prospect[]> {
  return readTable<Prospect>("prospects", mock.prospects);
}

export async function getPlaybooks(): Promise<Playbook[]> {
  return readTable<Playbook>("playbooks", mock.playbooks);
}

export async function getLessons(): Promise<Lesson[]> {
  return readTable<Lesson>("lessons", mock.lessons);
}
