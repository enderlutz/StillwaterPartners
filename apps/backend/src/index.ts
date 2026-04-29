import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { Hono } from "hono";
import { getRequestListener } from "@hono/node-server";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { env } from "./env.js";
import { verifyPat, type AuthContext } from "./auth.js";
import { buildMcpServer } from "./mcp.js";

// ─── Hono — non-MCP routes (health, info) ─────────────────────────────────
const hono = new Hono();
hono.use("*", logger());
hono.use("*", cors({ origin: "*" }));

hono.get("/", (c) =>
  c.json({
    service: "client-os-backend",
    status: "ok",
    mode: env.isMock ? "mock" : "supabase",
    surfaces: ["/health", "/mcp"],
  }),
);

hono.get("/health", (c) => c.json({ status: "ok" }));

const honoListener = getRequestListener(hono.fetch);

// ─── MCP — Streamable HTTP transport ──────────────────────────────────────
async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  if (req.method !== "POST") return undefined;
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  if (chunks.length === 0) return undefined;
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf-8"));
  } catch {
    return undefined;
  }
}

function extractBearer(req: IncomingMessage): string | null {
  const header = req.headers.authorization ?? req.headers.Authorization;
  const value = Array.isArray(header) ? header[0] : header;
  if (!value) return null;
  const match = /^Bearer\s+(.+)$/i.exec(value);
  return match ? match[1]!.trim() : null;
}

function send(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

async function handleMcp(req: IncomingMessage, res: ServerResponse) {
  // Authenticate
  const token = extractBearer(req);
  if (!token) {
    return send(res, 401, {
      error: "missing_authorization",
      message:
        "Provide Authorization: Bearer <PAT> — generate one in /settings/tokens.",
    });
  }
  const ctx = (await verifyPat(token)) as AuthContext | null;
  if (!ctx) {
    return send(res, 401, { error: "invalid_token" });
  }

  // Parse body for POST (MCP JSON-RPC requests).
  const body = await readJsonBody(req);

  // Build a fresh server bound to this auth context, in stateless mode.
  const server = buildMcpServer(ctx);
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  res.on("close", () => transport.close());

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, body);
  } catch (err) {
    console.error("[mcp] handler error:", err);
    if (!res.headersSent) {
      send(res, 500, {
        error: "internal_error",
        message: err instanceof Error ? err.message : "unknown",
      });
    }
  }
}

// ─── Combined listener ────────────────────────────────────────────────────
const server = createServer(async (req, res) => {
  const url = req.url ?? "/";
  if (url === "/mcp" || url.startsWith("/mcp/") || url.startsWith("/mcp?")) {
    await handleMcp(req, res);
    return;
  }
  await honoListener(req, res);
});

server.listen(env.port, "0.0.0.0", () => {
  console.log(
    `[backend] listening on 0.0.0.0:${env.port} (${env.isMock ? "mock" : "supabase"} mode)`,
  );
});
