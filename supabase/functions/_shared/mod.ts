// Shared utilities for Supabase Edge Functions (Deno)
// - CORS
// - JSON response
// - Supabase admin client
// - Auth helpers (internal secret + optional user JWT validation)

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface JsonBody<T> {
  data?: T;
  error?: { code: string; message: string };
}

export function getEnvOrThrow(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required env: ${name}`);
  return value;
}

export function getAllowedOrigins(): string[] {
  const originList = Deno.env.get("APP_BASE_URL")?.trim();
  if (!originList) return ["*"]; // local/dev fallback
  return originList.split(",").map((v) => v.trim());
}

export function corsHeaders(origin: string | null): Headers {
  const headers = new Headers();
  const allowedOrigins = getAllowedOrigins();
  const allowOrigin = origin && (allowedOrigins.includes("*") || allowedOrigins.includes(origin))
    ? origin
    : allowedOrigins[0] ?? "*";

  headers.set("Access-Control-Allow-Origin", allowOrigin);
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Internal-Secret");
  headers.set("Access-Control-Max-Age", "86400");
  return headers;
}

export function ok<T>(body: T, origin: string | null, init?: ResponseInit): Response {
  const headers = corsHeaders(origin);
  headers.set("Content-Type", "application/json");
  if (init?.headers) new Headers(init.headers).forEach((v, k) => headers.set(k, v));
  return new Response(JSON.stringify(body), { status: init?.status ?? 200, headers });
}

export function error(origin: string | null, status: number, code: string, message: string): Response {
  return ok<JsonBody<never>>({ error: { code, message } }, origin, { status });
}

export function preflight(request: Request): Response | null {
  if (request.method !== "OPTIONS") return null;
  return new Response(null, { status: 200, headers: corsHeaders(request.headers.get("Origin")) });
}

export function createSupabaseAdminClient(): SupabaseClient {
  const supabaseUrl = getEnvOrThrow("SUPABASE_URL");
  const serviceRoleKey = getEnvOrThrow("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getInternalSecretFromRequest(request: Request): string | null {
  const secret = request.headers.get("X-Internal-Secret");
  return secret ? secret : null;
}

export function requireInternalSecret(request: Request): string | null {
  const provided = getInternalSecretFromRequest(request);
  const expected = Deno.env.get("EDGE_FUNCTIONS_SHARED_SECRET");
  // If not configured, allow calls (useful in local/dev when secret isn't set yet)
  if (!expected) return "__skip__";
  if (!provided || provided !== expected) return null;
  return provided;
}

export async function getSupabaseUserFromRequest(admin: SupabaseClient, request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const accessToken = authHeader.slice("Bearer ".length);
  const { data, error: authError } = await admin.auth.getUser(accessToken);
  if (authError || !data?.user) return null;
  return data.user;
}

export async function hmacSHA256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Re-export serve to keep a single import site in functions
export { serve };




