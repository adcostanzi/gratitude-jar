"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Validate user authentication/session
async function getAuthenticatedClient() {
  // Get user session
  const supabase = await createClient();

  // Get user data
  const { data, error } = await supabase.auth.getClaims();

  // Throw error if no data or invalid
  if (error || !data?.claims?.sub) {
    throw new Error("Not authorized");
  }

  // Return user data
  return {
    supabase,
    userId: data.claims.sub,
  };
}

//CREATE
export async function createGratitudeEntry(formData: FormData) {
  // Get user authenticated data
  const { supabase, userId } = await getAuthenticatedClient();

  // Get title
  // const title = String(formData.get("title") ?? "").trim()

  // Get content
  const content = String(formData.get("content"));

  // Validate content
  if (!content) {
    throw new Error("Content required");
  }

  // INSERT SQL
  const { error } = await supabase.from("gratitude_entry").insert({
    owner_id: userId,
    content,
  });

  // Show errors
  if (error) throw new Error(error.message);

  // Reload page
  revalidatePath("/");
  revalidatePath("/memories");
}

// READ
export async function readGratitudeEntry(filters?: {
  startUtc?: string;
  endUtc?: string;
}) {
  // Get user authenticated data
  const { supabase, userId } = await getAuthenticatedClient();

  // SELECT SQL
  let query = supabase
    .from("gratitude_entry")
    .select("id, content, created")
    .eq("owner_id", userId);

  // Optional date filters for History. End bound is exclusive.
  if (filters?.startUtc) query = query.gte("created", filters.startUtc);
  if (filters?.endUtc) query = query.lt("created", filters.endUtc);

  // Newest memories first
  const { data: entries, error } = await query
    .order("created", { ascending: false })
    .order("id", { ascending: false });

  // Show errors
  if (error) {
    throw new Error(error.message);
  }

  return entries;
}

// READ RANDOM ENTRY
export async function readRandomGratitudeEntry() {
  const entries = await readGratitudeEntry();

  if (!entries || entries.length === 0) {
    return null; // No entries available
  }

  const randomIndex = Math.floor(Math.random() * entries.length);
  return entries[randomIndex];
}

// UPDATE
export async function updateContentGratitudeEntry(formData: FormData) {
  // Get user authenticated data
  const { supabase, userId } = await getAuthenticatedClient();

  // Get new data
  const id = String(formData.get("id") ?? "");
  const content = String(formData.get("content") ?? "");

  // UPDATE SQL
  const { error } = await supabase
    .from("gratitude_entry")
    .update({ content })
    .eq("id", id)
    .eq("owner_id", userId);

  // Show errors
  if (error) throw new Error(error.message);

  // Reload page
  revalidatePath("/");
  revalidatePath("/memories");
}

// DELETE
export async function deleteGratitudeEntry(formData: FormData) {
  // Get user authenticated data
  const { supabase, userId } = await getAuthenticatedClient();

  // Get id
  const id = String(formData.get("id") ?? "");

  // DELETE SQL
  const { error } = await supabase
    .from("gratitude_entry")
    .delete()
    .eq("id", id)
    .eq("owner_id", userId);

  // Show errors
  if (error) throw new Error(error.message);

  // Reload page
  revalidatePath("/");
  revalidatePath("/memories");
}

// DELETE
export async function deleteEntry(id: string) {
  // Get user authenticated data
  const { supabase, userId } = await getAuthenticatedClient();

  // DELETE SQL
  const { error } = await supabase
    .from("gratitude_entry")
    .delete()
    .eq("id", id)
    .eq("owner_id", userId);

  // Show errors
  if (error) throw new Error(error.message);

  // Reload page
  revalidatePath("/");
  revalidatePath("/memories");
}

// LOGOUT
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/");
}
