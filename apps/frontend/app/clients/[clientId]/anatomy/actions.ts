"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { OperationsBlock } from "@/lib/types";

async function authedClient() {
  const supabase = createClient();
  if (!supabase) throw new Error("Auth is not configured.");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");
  return { supabase, userId: user.id };
}

export async function listAnatomyBlocks(
  clientId: string,
): Promise<OperationsBlock[]> {
  const { supabase } = await authedClient();
  const { data, error } = await supabase
    .from("company_operations_blocks")
    .select("*")
    .eq("client_id", clientId)
    .order("section_key", { ascending: true })
    .order("position", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as OperationsBlock[];
}

export async function addAnatomyBlock(formData: FormData): Promise<void> {
  const { supabase, userId } = await authedClient();
  const clientId = String(formData.get("client_id") ?? "");
  const sectionKey = String(formData.get("section_key") ?? "");
  if (!clientId || !sectionKey) return;

  const { data: existing } = await supabase
    .from("company_operations_blocks")
    .select("position")
    .eq("client_id", clientId)
    .eq("section_key", sectionKey)
    .order("position", { ascending: false })
    .limit(1);
  const nextPosition = (existing?.[0]?.position ?? -1) + 1;

  await supabase.from("company_operations_blocks").insert({
    client_id: clientId,
    section_key: sectionKey,
    position: nextPosition,
    content_md: "",
    updated_by: userId,
  });
  revalidatePath(`/clients/${clientId}/anatomy`);
}

export async function saveAnatomyBlock(formData: FormData): Promise<void> {
  const { supabase, userId } = await authedClient();
  const id = String(formData.get("id") ?? "");
  const clientId = String(formData.get("client_id") ?? "");
  const contentMd = String(formData.get("content_md") ?? "");
  if (!id) return;
  await supabase
    .from("company_operations_blocks")
    .update({
      content_md: contentMd,
      updated_at: new Date().toISOString(),
      updated_by: userId,
    })
    .eq("id", id);
  revalidatePath(`/clients/${clientId}/anatomy`);
}

export async function deleteAnatomyBlock(formData: FormData): Promise<void> {
  const { supabase } = await authedClient();
  const id = String(formData.get("id") ?? "");
  const clientId = String(formData.get("client_id") ?? "");
  if (!id) return;
  await supabase.from("company_operations_blocks").delete().eq("id", id);
  revalidatePath(`/clients/${clientId}/anatomy`);
}

export async function moveAnatomyBlock(formData: FormData): Promise<void> {
  const { supabase } = await authedClient();
  const id = String(formData.get("id") ?? "");
  const clientId = String(formData.get("client_id") ?? "");
  const direction = String(formData.get("direction") ?? "");
  if (!id || !clientId || (direction !== "up" && direction !== "down")) return;

  const { data: current } = await supabase
    .from("company_operations_blocks")
    .select("section_key, position")
    .eq("id", id)
    .maybeSingle();
  if (!current) return;

  const { data: all } = await supabase
    .from("company_operations_blocks")
    .select("id, position")
    .eq("client_id", clientId)
    .eq("section_key", current.section_key)
    .order("position", { ascending: true });
  if (!all) return;

  const idx = all.findIndex((b) => b.id === id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= all.length) return;
  const swap = all[swapIdx];
  if (!swap) return;

  await supabase
    .from("company_operations_blocks")
    .update({ position: swap.position })
    .eq("id", id);
  await supabase
    .from("company_operations_blocks")
    .update({ position: current.position })
    .eq("id", swap.id);

  revalidatePath(`/clients/${clientId}/anatomy`);
}
