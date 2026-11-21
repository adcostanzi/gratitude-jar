"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function getAuthenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    throw new Error("Not authorized");
  }

  return { supabase, userId: data.claims.sub };
}

function revalidateEntryPages() {
  revalidatePath("/");
  revalidatePath("/memories");
  revalidatePath("/gratitude-entry");
}

export async function createGratitudeEntry(formData: FormData) {
  const { supabase, userId } = await getAuthenticatedClient();
  const content = String(formData.get("content") ?? "").trim();
  if (!content) throw new Error("Content required");

  const { error } = await supabase.from("gratitude_entry").insert({
    owner_id: userId,
    content,
  });

  if (error) throw new Error(error.message);
  revalidateEntryPages();
}

// No filters => all of the user's entries, newest first.
// Date bounds are ISO timestamps; the end bound is exclusive.
export async function readGratitudeEntry(filters?: {
  startUtc?: string;
  endUtc?: string;
}) {
  const { supabase, userId } = await getAuthenticatedClient();

  let query = supabase
    .from("gratitude_entry")
    .select("id, content, created")
    .eq("owner_id", userId);

  if (filters?.startUtc) query = query.gte("created", filters.startUtc);
  if (filters?.endUtc) query = query.lt("created", filters.endUtc);

  const { data, error } = await query
    .order("created", { ascending: false })
    .order("id", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function readRandomGratitudeEntry() {
  const entries = await readGratitudeEntry();
  if (!entries?.length) return null;
  return entries[Math.floor(Math.random() * entries.length)];
}

export async function updateContentGratitudeEntry(formData: FormData) {
  const { supabase, userId } = await getAuthenticatedClient();
  const id = String(formData.get("id") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!id || !content) throw new Error("Entry and content are required.");

  // Owners can update content only. RLS must ALSO enforce owner_id = auth.uid().
  const { data, error } = await supabase
    .from("gratitude_entry")
    .update({ content })
    .eq("id", id)
    .eq("owner_id", userId)
    .select("id")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Entry not found or edit not permitted.");
  revalidateEntryPages();
}

export async function deleteGratitudeEntry(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  await deleteEntry(id);
}

export async function deleteEntry(id: string) {
  const { supabase, userId } = await getAuthenticatedClient();
  if (!id) throw new Error("Entry ID required.");

  const { data, error } = await supabase
    .from("gratitude_entry")
    .delete()
    .eq("id", id)
    .eq("owner_id", userId)
    .select("id")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Entry not found or delete not permitted.");
  revalidateEntryPages();
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
