import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as data from "./data.js";
import type { AuthContext } from "./auth.js";
import { audit } from "./auth.js";

// Build a fresh McpServer per request, with all tools wired to the request's
// auth context (so audit logs attribute to the right user). Cheap to construct.
export function buildMcpServer(ctx: AuthContext): McpServer {
  const server = new McpServer(
    { name: "client-os", version: "0.1.0" },
    {
      capabilities: { tools: {}, logging: {} },
      instructions:
        "Tools to read and write the Client OS consulting platform. Reads pull synthesis/KPIs/meetings/tasks/etc.; writes log new artifacts. Use search() and bridge_brief() for cross-client memory.",
    },
  );

  // ─── helpers ──────────────────────────────────────────────────────────
  const wrap = <Args, T>(
    name: string,
    handler: (args: Args) => Promise<T>,
  ) => {
    return async (args: Args) => {
      try {
        const result = await handler(args);
        await audit(ctx, { toolName: name, args, status: "ok" });
        return {
          content: [
            {
              type: "text" as const,
              text:
                result === undefined
                  ? "(ok)"
                  : typeof result === "string"
                    ? result
                    : JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        await audit(ctx, {
          toolName: name,
          args,
          status: "error",
          errorMessage: message,
        });
        return {
          isError: true,
          content: [{ type: "text" as const, text: `Error: ${message}` }],
        };
      }
    };
  };

  // ───────────────────────────────────────────────────────────────────────
  //                              READ TOOLS
  // ───────────────────────────────────────────────────────────────────────

  server.registerTool(
    "list_clients",
    {
      title: "List clients",
      description: "Return every client in the firm — id, name, vertical, stage, health.",
      inputSchema: {},
    },
    wrap("list_clients", async () => data.listClients()),
  );

  server.registerTool(
    "get_client",
    {
      title: "Get client",
      description: "Return a single client's spine: name, industry, vertical, primary_lens, goals, health, stage.",
      inputSchema: { client_id: z.string() },
    },
    wrap<{ client_id: string }, unknown>("get_client", async ({ client_id }) =>
      data.getClient(client_id),
    ),
  );

  server.registerTool(
    "get_brief",
    {
      title: "Get client brief",
      description: "Return the long-form brief for a client (audience, offer, channels, constraints, notes).",
      inputSchema: { client_id: z.string() },
    },
    wrap<{ client_id: string }, unknown>("get_brief", async ({ client_id }) =>
      data.getBrief(client_id),
    ),
  );

  server.registerTool(
    "get_synthesis",
    {
      title: "Get synthesis",
      description: "Return the headline, situation/complication/resolution, key findings, and recommendations for a client.",
      inputSchema: { client_id: z.string() },
    },
    wrap<{ client_id: string }, unknown>("get_synthesis", async ({ client_id }) =>
      data.getSynthesis(client_id),
    ),
  );

  server.registerTool(
    "list_kpis",
    {
      title: "List KPIs",
      description: "Return KPI entries for a client. Optionally filter to monthly or weekly.",
      inputSchema: {
        client_id: z.string(),
        period_type: z.enum(["weekly", "monthly"]).optional(),
      },
    },
    wrap<{ client_id: string; period_type?: "weekly" | "monthly" }, unknown>(
      "list_kpis",
      async ({ client_id, period_type }) => data.listKpis(client_id, period_type),
    ),
  );

  server.registerTool(
    "list_initiatives",
    {
      title: "List initiatives",
      description: "Roadmap items for a client by horizon.",
      inputSchema: { client_id: z.string() },
    },
    wrap<{ client_id: string }, unknown>("list_initiatives", async ({ client_id }) =>
      data.listInitiatives(client_id),
    ),
  );

  server.registerTool(
    "list_campaigns",
    {
      title: "List campaigns",
      description: "Marketing campaigns for a client (live, draft, ended).",
      inputSchema: { client_id: z.string() },
    },
    wrap<{ client_id: string }, unknown>("list_campaigns", async ({ client_id }) =>
      data.listCampaigns(client_id),
    ),
  );

  server.registerTool(
    "list_meetings",
    {
      title: "List meeting notes",
      description: "Recent meeting notes for a client — date, attendees, summary, decisions, action items.",
      inputSchema: { client_id: z.string() },
    },
    wrap<{ client_id: string }, unknown>("list_meetings", async ({ client_id }) =>
      data.listMeetings(client_id),
    ),
  );

  server.registerTool(
    "list_decisions",
    {
      title: "List decisions",
      description: "Decision log for a client — what was decided and why.",
      inputSchema: { client_id: z.string() },
    },
    wrap<{ client_id: string }, unknown>("list_decisions", async ({ client_id }) =>
      data.listDecisions(client_id),
    ),
  );

  server.registerTool(
    "list_opportunities",
    {
      title: "List opportunities",
      description: "Opportunities surfaced for a client (impact, difficulty, priority, status).",
      inputSchema: { client_id: z.string() },
    },
    wrap<{ client_id: string }, unknown>("list_opportunities", async ({ client_id }) =>
      data.listOpportunities(client_id),
    ),
  );

  server.registerTool(
    "list_hypotheses",
    {
      title: "List hypotheses",
      description: "MECE issue tree — hypotheses being tested, with status, evidence, so-what.",
      inputSchema: { client_id: z.string() },
    },
    wrap<{ client_id: string }, unknown>("list_hypotheses", async ({ client_id }) =>
      data.listHypotheses(client_id),
    ),
  );

  server.registerTool(
    "list_deliverables",
    {
      title: "List deliverables",
      description: "Deck / model / memo / report deliverables for a client.",
      inputSchema: { client_id: z.string() },
    },
    wrap<{ client_id: string }, unknown>("list_deliverables", async ({ client_id }) =>
      data.listDeliverables(client_id),
    ),
  );

  server.registerTool(
    "list_stakeholders",
    {
      title: "List stakeholders",
      description: "People in the engagement — name, role, influence, posture, notes.",
      inputSchema: { client_id: z.string() },
    },
    wrap<{ client_id: string }, unknown>("list_stakeholders", async ({ client_id }) =>
      data.listStakeholders(client_id),
    ),
  );

  server.registerTool(
    "list_risks",
    {
      title: "List risks (internal)",
      description: "Risks tracked for a client — likelihood, impact, mitigation. Internal-only.",
      inputSchema: { client_id: z.string() },
    },
    wrap<{ client_id: string }, unknown>("list_risks", async ({ client_id }) =>
      data.listRisks(client_id),
    ),
  );

  server.registerTool(
    "list_client_actions",
    {
      title: "List client actions",
      description: "Items the client owes us — what we're waiting on. Optionally filter by status.",
      inputSchema: {
        client_id: z.string(),
        status: z
          .enum(["not_started", "in_progress", "blocked", "done", "paused"])
          .optional(),
      },
    },
    wrap<
      {
        client_id: string;
        status?: "not_started" | "in_progress" | "blocked" | "done" | "paused";
      },
      unknown
    >("list_client_actions", async ({ client_id, status }) =>
      data.listClientActions(client_id, status),
    ),
  );

  server.registerTool(
    "list_tasks",
    {
      title: "List tasks",
      description: "Our team's tasks for a client. Optionally filter by status.",
      inputSchema: {
        client_id: z.string(),
        status: z
          .enum(["not_started", "in_progress", "blocked", "done", "paused"])
          .optional(),
      },
    },
    wrap<
      {
        client_id: string;
        status?: "not_started" | "in_progress" | "blocked" | "done" | "paused";
      },
      unknown
    >("list_tasks", async ({ client_id, status }) =>
      data.listTasks(client_id, status),
    ),
  );

  server.registerTool(
    "list_impacts",
    {
      title: "List impact",
      description: "Value delivered so far for a client — realized and projected.",
      inputSchema: { client_id: z.string() },
    },
    wrap<{ client_id: string }, unknown>("list_impacts", async ({ client_id }) =>
      data.listImpacts(client_id),
    ),
  );

  server.registerTool(
    "get_commercial",
    {
      title: "Get commercial (internal)",
      description: "Internal commercial detail — engagement budget, hours burned, fee invoiced, margin.",
      inputSchema: { client_id: z.string() },
    },
    wrap<{ client_id: string }, unknown>("get_commercial", async ({ client_id }) =>
      data.getCommercial(client_id),
    ),
  );

  server.registerTool(
    "list_data_room",
    {
      title: "List data room files",
      description: "Reference files attached to a client.",
      inputSchema: { client_id: z.string() },
    },
    wrap<{ client_id: string }, unknown>("list_data_room", async ({ client_id }) =>
      data.listDataRoom(client_id),
    ),
  );

  server.registerTool(
    "list_builds",
    {
      title: "List custom builds",
      description: "Custom software being built or shipped for a client.",
      inputSchema: { client_id: z.string() },
    },
    wrap<{ client_id: string }, unknown>("list_builds", async ({ client_id }) =>
      data.listBuilds(client_id),
    ),
  );

  server.registerTool(
    "list_prospects",
    {
      title: "List prospects (Brain)",
      description: "Pipeline of prospects with stage and expected value.",
      inputSchema: {},
    },
    wrap("list_prospects", async () => data.listProspects()),
  );

  server.registerTool(
    "list_playbooks",
    {
      title: "List playbooks (Brain)",
      description: "Firm-level reusable approaches by vertical or problem.",
      inputSchema: {},
    },
    wrap("list_playbooks", async () => data.listPlaybooks()),
  );

  server.registerTool(
    "list_lessons",
    {
      title: "List lessons (Brain)",
      description: "What worked / what didn't from prior engagements.",
      inputSchema: {},
    },
    wrap("list_lessons", async () => data.listLessons()),
  );

  server.registerTool(
    "search",
    {
      title: "Search anything",
      description:
        "Search across all artifacts — meetings, decisions, initiatives, opportunities, hypotheses, deliverables, builds, risks, stakeholders, lessons, playbooks, prospects, clients. Use this to recall anything you remember loosely. Optional client_id narrows to a single engagement.",
      inputSchema: {
        query: z.string(),
        client_id: z.string().optional(),
      },
    },
    wrap<{ query: string; client_id?: string }, unknown>(
      "search",
      async ({ query, client_id }) => data.search(query, client_id),
    ),
  );

  server.registerTool(
    "bridge_brief",
    {
      title: "Brain firm brief",
      description:
        "Cross-client overview — total revenue, pipeline forecast, open work counts, quiet clients (no meetings >14d), and items due this week.",
      inputSchema: {},
    },
    wrap("bridge_brief", async () => data.bridgeBrief()),
  );

  // ───────────────────────────────────────────────────────────────────────
  //                              WRITE TOOLS
  // ───────────────────────────────────────────────────────────────────────

  server.registerTool(
    "add_client",
    {
      title: "Add client",
      description: "Create a new client (a new engagement).",
      inputSchema: {
        id: z.string().describe("Slug-style id, e.g. 'acme-hvac'"),
        name: z.string(),
        industry: z.string(),
        main_offer: z.string(),
        current_status: z.string().default(""),
        goal_90_day: z.string().default(""),
        long_term_goal: z.string().default(""),
        next_actions: z.array(z.string()).default([]),
        vertical: z.enum(["home_services", "healthcare", "other"]).default("other"),
        primary_lens: z
          .enum(["revenue", "procurement", "hiring", "ops", "mixed"])
          .default("mixed"),
        engagement_stage: z
          .enum(["diagnose", "design", "deliver", "sustain"])
          .default("diagnose"),
        health: z.enum(["on_track", "at_risk", "critical"]).default("on_track"),
      },
    },
    wrap("add_client", async (args) => data.addClient(args as never)),
  );

  server.registerTool(
    "upsert_brief",
    {
      title: "Upsert brief",
      description: "Replace the entire brief for a client.",
      inputSchema: {
        client_id: z.string(),
        business_overview: z.string().default(""),
        target_audience: z.string().default(""),
        core_offer: z.string().default(""),
        pricing: z.string().default(""),
        upsells: z.string().default(""),
        competitors: z.string().default(""),
        marketing_channels: z.string().default(""),
        operational_constraints: z.string().default(""),
        notes: z.string().default(""),
      },
    },
    wrap("upsert_brief", async (args) => data.upsertBrief(args as never)),
  );

  server.registerTool(
    "upsert_synthesis",
    {
      title: "Upsert synthesis",
      description: "Replace the synthesis (headline + situation/complication/resolution + findings + recommendations).",
      inputSchema: {
        client_id: z.string(),
        headline: z.string(),
        situation: z.string().default(""),
        complication: z.string().default(""),
        resolution: z.string().default(""),
        key_findings: z.array(z.string()).default([]),
        recommendations: z.array(z.string()).default([]),
      },
    },
    wrap("upsert_synthesis", async (args) =>
      data.upsertSynthesis({
        ...(args as never),
        updated_at: new Date().toISOString(),
      } as never),
    ),
  );

  server.registerTool(
    "add_kpi_entry",
    {
      title: "Add KPI entry",
      description: "Log a new KPI period (weekly or monthly).",
      inputSchema: {
        id: z.string(),
        client_id: z.string(),
        period_type: z.enum(["weekly", "monthly"]),
        period_label: z.string(),
        revenue_goal: z.number(),
        revenue: z.number(),
        patient_volume_goal: z.number().default(0),
        leads_goal: z.number(),
        leads: z.number(),
        bookings_goal: z.number(),
        bookings: z.number(),
        show_ups: z.number(),
        show_up_rate: z.number(),
        cost_per_lead: z.number(),
        cost_per_booking: z.number(),
        cost_per_show_up: z.number(),
        ad_spend: z.number(),
        profit_estimate: z.number(),
      },
    },
    wrap("add_kpi_entry", async (args) => data.addKpiEntry(args as never)),
  );

  server.registerTool(
    "add_hypothesis",
    {
      title: "Add hypothesis",
      description: "Add a new hypothesis to a client's MECE tree.",
      inputSchema: {
        id: z.string(),
        client_id: z.string(),
        statement: z.string(),
        status: z
          .enum(["untested", "in_progress", "confirmed", "rejected"])
          .default("untested"),
        owner: z.string().default(""),
        evidence: z.string().default(""),
        so_what: z.string().default(""),
        parent_id: z.string().nullable().default(null),
      },
    },
    wrap("add_hypothesis", async (args) => data.addHypothesis(args as never)),
  );

  server.registerTool(
    "update_hypothesis_status",
    {
      title: "Update hypothesis status",
      description: "Mark a hypothesis confirmed / rejected / in_progress, optionally updating evidence + so-what.",
      inputSchema: {
        id: z.string(),
        status: z.enum(["untested", "in_progress", "confirmed", "rejected"]),
        evidence: z.string().optional(),
        so_what: z.string().optional(),
      },
    },
    wrap("update_hypothesis_status", async ({ id, status, evidence, so_what }) =>
      data.updateHypothesisStatus(id, status, evidence, so_what),
    ),
  );

  server.registerTool(
    "add_initiative",
    {
      title: "Add initiative",
      description: "Add a roadmap initiative for a client (short / mid / long horizon).",
      inputSchema: {
        id: z.string(),
        client_id: z.string(),
        horizon: z.enum(["short", "mid", "long"]),
        title: z.string(),
        description: z.string().default(""),
        priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
        owner: z.string().default(""),
        due_date: z.string(),
        status: z
          .enum(["not_started", "in_progress", "blocked", "done", "paused"])
          .default("not_started"),
        expected_impact: z.string().default(""),
      },
    },
    wrap("add_initiative", async (args) => data.addInitiative(args as never)),
  );

  server.registerTool(
    "update_initiative_status",
    {
      title: "Update initiative status",
      description: "Move an initiative through not_started / in_progress / blocked / done / paused.",
      inputSchema: {
        id: z.string(),
        status: z.enum([
          "not_started",
          "in_progress",
          "blocked",
          "done",
          "paused",
        ]),
      },
    },
    wrap("update_initiative_status", async ({ id, status }) =>
      data.updateInitiativeStatus(id, status),
    ),
  );

  server.registerTool(
    "add_opportunity",
    {
      title: "Add opportunity",
      description: "Surface a new opportunity for a client.",
      inputSchema: {
        id: z.string(),
        client_id: z.string(),
        name: z.string(),
        description: z.string().default(""),
        estimated_impact: z.string().default(""),
        difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
        priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
        status: z
          .enum(["not_started", "in_progress", "blocked", "done", "paused"])
          .default("not_started"),
        next_step: z.string().default(""),
      },
    },
    wrap("add_opportunity", async (args) => data.addOpportunity(args as never)),
  );

  server.registerTool(
    "update_opportunity_status",
    {
      title: "Update opportunity status",
      description: "Move an opportunity through statuses.",
      inputSchema: {
        id: z.string(),
        status: z.enum([
          "not_started",
          "in_progress",
          "blocked",
          "done",
          "paused",
        ]),
      },
    },
    wrap("update_opportunity_status", async ({ id, status }) =>
      data.updateOpportunityStatus(id, status),
    ),
  );

  server.registerTool(
    "add_decision",
    {
      title: "Add decision",
      description: "Log a decision for a client.",
      inputSchema: {
        id: z.string(),
        client_id: z.string(),
        date: z.string(),
        decision: z.string(),
        reason: z.string().default(""),
        owner: z.string().default(""),
        related: z.string().default(""),
      },
    },
    wrap("add_decision", async (args) => data.addDecision(args as never)),
  );

  server.registerTool(
    "add_meeting_note",
    {
      title: "Add meeting note",
      description: "Log a meeting — date, attendees, summary, key facts, decisions, action items.",
      inputSchema: {
        id: z.string(),
        client_id: z.string(),
        date: z.string(),
        attendees: z.array(z.string()).default([]),
        summary: z.string(),
        key_facts: z.array(z.string()).default([]),
        decisions: z.array(z.string()).default([]),
        action_items: z
          .array(
            z.object({
              item: z.string(),
              owner: z.string(),
              deadline: z.string(),
            }),
          )
          .default([]),
      },
    },
    wrap("add_meeting_note", async (args) => data.addMeetingNote(args as never)),
  );

  server.registerTool(
    "add_task",
    {
      title: "Add task",
      description: "Add a task for our team on this client.",
      inputSchema: {
        id: z.string(),
        client_id: z.string(),
        name: z.string(),
        owner: z.string().default(""),
        due_date: z.string(),
        status: z
          .enum(["not_started", "in_progress", "blocked", "done", "paused"])
          .default("not_started"),
        priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
        notes: z.string().default(""),
      },
    },
    wrap("add_task", async (args) => data.addTask(args as never)),
  );

  server.registerTool(
    "update_task_status",
    {
      title: "Update task status",
      description: "Mark a task done / in_progress / blocked / paused.",
      inputSchema: {
        id: z.string(),
        status: z.enum([
          "not_started",
          "in_progress",
          "blocked",
          "done",
          "paused",
        ]),
      },
    },
    wrap("update_task_status", async ({ id, status }) =>
      data.updateTaskStatus(id, status),
    ),
  );

  server.registerTool(
    "add_client_action",
    {
      title: "Add client action",
      description: "Add an item the client owes us.",
      inputSchema: {
        id: z.string(),
        client_id: z.string(),
        item: z.string(),
        owner: z.string().default(""),
        due_date: z.string(),
        status: z
          .enum(["not_started", "in_progress", "blocked", "done", "paused"])
          .default("not_started"),
        notes: z.string().default(""),
      },
    },
    wrap("add_client_action", async (args) => data.addClientAction(args as never)),
  );

  server.registerTool(
    "update_client_action_status",
    {
      title: "Update client action status",
      description: "Move a client action's status.",
      inputSchema: {
        id: z.string(),
        status: z.enum([
          "not_started",
          "in_progress",
          "blocked",
          "done",
          "paused",
        ]),
      },
    },
    wrap("update_client_action_status", async ({ id, status }) =>
      data.updateClientActionStatus(id, status),
    ),
  );

  server.registerTool(
    "add_deliverable",
    {
      title: "Add deliverable",
      description: "Track a new deliverable for a client.",
      inputSchema: {
        id: z.string(),
        client_id: z.string(),
        name: z.string(),
        type: z.enum(["deck", "model", "memo", "report", "other"]),
        owner: z.string().default(""),
        status: z
          .enum(["drafting", "review", "ready", "delivered"])
          .default("drafting"),
        due_date: z.string(),
        delivered_date: z.string().nullable().default(null),
        url: z.string().default(""),
        notes: z.string().default(""),
      },
    },
    wrap("add_deliverable", async (args) => data.addDeliverable(args as never)),
  );

  server.registerTool(
    "update_deliverable_status",
    {
      title: "Update deliverable status",
      description: "Move a deliverable through drafting / review / ready / delivered. Set delivered_date when shipped.",
      inputSchema: {
        id: z.string(),
        status: z.enum(["drafting", "review", "ready", "delivered"]),
        delivered_date: z.string().optional(),
      },
    },
    wrap("update_deliverable_status", async ({ id, status, delivered_date }) =>
      data.updateDeliverableStatus(id, status, delivered_date),
    ),
  );

  server.registerTool(
    "add_campaign",
    {
      title: "Add campaign",
      description: "Add a marketing campaign for a client.",
      inputSchema: {
        id: z.string(),
        client_id: z.string(),
        name: z.string(),
        platform: z.string(),
        target_location: z.string().default(""),
        budget: z.number().default(0),
        start_date: z.string(),
        end_date: z.string(),
        creative_angle: z.string().default(""),
        results: z.string().default(""),
        notes: z.string().default(""),
        status: z.enum(["draft", "live", "paused", "ended"]).default("draft"),
      },
    },
    wrap("add_campaign", async (args) => data.addCampaign(args as never)),
  );

  server.registerTool(
    "add_build",
    {
      title: "Add custom build",
      description: "Track a piece of custom software for a client.",
      inputSchema: {
        id: z.string(),
        client_id: z.string(),
        name: z.string(),
        status: z
          .enum(["planned", "in_flight", "shipped", "deprecated"])
          .default("planned"),
        owner: z.string().default(""),
        url: z.string().default(""),
        problem_solved: z.string().default(""),
        notes: z.string().default(""),
        created_at: z
          .string()
          .default(() => new Date().toISOString()),
        shipped_at: z.string().nullable().default(null),
      },
    },
    wrap("add_build", async (args) => data.addBuild(args as never)),
  );

  server.registerTool(
    "update_build_status",
    {
      title: "Update build status",
      description: "Move a build through planned / in_flight / shipped / deprecated. Set shipped_at + url when shipped.",
      inputSchema: {
        id: z.string(),
        status: z.enum(["planned", "in_flight", "shipped", "deprecated"]),
        shipped_at: z.string().optional(),
        url: z.string().optional(),
      },
    },
    wrap("update_build_status", async ({ id, status, shipped_at, url }) =>
      data.updateBuildStatus(id, status, shipped_at, url),
    ),
  );

  server.registerTool(
    "upsert_stakeholder",
    {
      title: "Upsert stakeholder",
      description: "Add or update a stakeholder on a client.",
      inputSchema: {
        id: z.string(),
        client_id: z.string(),
        name: z.string(),
        role: z.string().default(""),
        email: z.string().default(""),
        influence: z.enum(["low", "medium", "high"]).default("medium"),
        posture: z
          .enum(["champion", "supportive", "neutral", "skeptical", "blocker"])
          .default("neutral"),
        last_contact: z.string().default(""),
        notes: z.string().default(""),
      },
    },
    wrap("upsert_stakeholder", async (args) => data.upsertStakeholder(args as never)),
  );

  server.registerTool(
    "add_risk",
    {
      title: "Add risk (internal)",
      description: "Log an internal risk on a client.",
      inputSchema: {
        id: z.string(),
        client_id: z.string(),
        title: z.string(),
        description: z.string().default(""),
        likelihood: z.enum(["low", "medium", "high"]).default("medium"),
        impact: z.enum(["low", "medium", "high"]).default("medium"),
        mitigation: z.string().default(""),
        owner: z.string().default(""),
        status: z.enum(["open", "mitigating", "closed"]).default("open"),
      },
    },
    wrap("add_risk", async (args) =>
      data.addRisk({ ...(args as never), visibility: "internal" } as never),
    ),
  );

  server.registerTool(
    "update_risk_status",
    {
      title: "Update risk status",
      description: "Move a risk through open / mitigating / closed.",
      inputSchema: {
        id: z.string(),
        status: z.enum(["open", "mitigating", "closed"]),
      },
    },
    wrap("update_risk_status", async ({ id, status }) =>
      data.updateRiskStatus(id, status),
    ),
  );

  server.registerTool(
    "add_data_room_item",
    {
      title: "Add data room item",
      description: "Attach a reference file to a client.",
      inputSchema: {
        id: z.string(),
        client_id: z.string(),
        file_name: z.string(),
        category: z.string().default(""),
        description: z.string().default(""),
        url: z.string(),
        date_added: z
          .string()
          .default(() => new Date().toISOString().slice(0, 10)),
      },
    },
    wrap("add_data_room_item", async (args) => data.addDataRoomItem(args as never)),
  );

  server.registerTool(
    "add_impact",
    {
      title: "Add impact entry",
      description: "Log impact (value delivered) for a client.",
      inputSchema: {
        id: z.string(),
        client_id: z.string(),
        name: z.string(),
        category: z.enum([
          "revenue",
          "cost_savings",
          "efficiency",
          "risk_reduction",
          "other",
        ]),
        value_label: z.string(),
        value_numeric: z.number().default(0),
        realized_date: z.string().nullable().default(null),
        initiative_link: z.string().default(""),
        notes: z.string().default(""),
      },
    },
    wrap("add_impact", async (args) => data.addImpact(args as never)),
  );

  server.registerTool(
    "upsert_commercial",
    {
      title: "Upsert commercial (internal)",
      description: "Update internal commercial detail for an engagement.",
      inputSchema: {
        client_id: z.string(),
        engagement_name: z.string(),
        budget_hours: z.number().default(0),
        budget_fee: z.number().default(0),
        hours_burned: z.number().default(0),
        fee_invoiced: z.number().default(0),
        start_date: z.string(),
        end_date: z.string(),
        margin_pct: z.number().default(0),
        notes: z.string().default(""),
      },
    },
    wrap("upsert_commercial", async (args) =>
      data.upsertCommercial({
        ...(args as never),
        visibility: "internal",
      } as never),
    ),
  );

  // ─── Brain writes ─────────────────────────────────────────────────────
  server.registerTool(
    "add_prospect",
    {
      title: "Add prospect (Brain)",
      description: "Add a prospect to the firm's pipeline.",
      inputSchema: {
        id: z.string(),
        name: z.string(),
        vertical: z.enum(["home_services", "healthcare", "other"]).default("other"),
        stage: z
          .enum([
            "lead",
            "scoping",
            "proposal",
            "negotiation",
            "closed_won",
            "closed_lost",
          ])
          .default("lead"),
        expected_value: z.number().default(0),
        expected_close: z.string().default(""),
        notes: z.string().default(""),
        owner: z.string().default(""),
        created_at: z
          .string()
          .default(() => new Date().toISOString()),
      },
    },
    wrap("add_prospect", async (args) => data.addProspect(args as never)),
  );

  server.registerTool(
    "update_prospect_stage",
    {
      title: "Update prospect stage",
      description: "Move a prospect through pipeline stages.",
      inputSchema: {
        id: z.string(),
        stage: z.enum([
          "lead",
          "scoping",
          "proposal",
          "negotiation",
          "closed_won",
          "closed_lost",
        ]),
      },
    },
    wrap("update_prospect_stage", async ({ id, stage }) =>
      data.updateProspectStage(id, stage),
    ),
  );

  server.registerTool(
    "add_playbook",
    {
      title: "Add playbook (Brain)",
      description: "Add a firm-level playbook (reusable approach).",
      inputSchema: {
        id: z.string(),
        title: z.string(),
        vertical: z.string().default("all"),
        problem: z.string().default("all"),
        content_md: z.string().default(""),
        tags: z.array(z.string()).default([]),
        created_at: z
          .string()
          .default(() => new Date().toISOString()),
        updated_at: z
          .string()
          .default(() => new Date().toISOString()),
      },
    },
    wrap("add_playbook", async (args) => data.addPlaybook(args as never)),
  );

  server.registerTool(
    "add_lesson",
    {
      title: "Add lesson (Brain)",
      description: "Log a lesson learned. Optional client_id ties it to a specific engagement.",
      inputSchema: {
        id: z.string(),
        client_id: z.string().nullable().default(null),
        title: z.string(),
        content: z.string().default(""),
        tags: z.array(z.string()).default([]),
        created_at: z
          .string()
          .default(() => new Date().toISOString()),
      },
    },
    wrap("add_lesson", async (args) => data.addLesson(args as never)),
  );

  return server;
}
