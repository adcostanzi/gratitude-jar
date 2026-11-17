"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"


// Validate user authentication/session
async function getAuthenticatedClient() {

    // Get user session
    const supabase = await createClient()

    // Get user data
    const { data, error } = await supabase.auth.getClaims()

    // Throw error if no data or invalid
    if (error || !data?.claims?.sub) {
        throw new Error("Not authorized")
    }

    // Return user data
    return {
        supabase,
        userId: data.claims.sub,
    }
}

//CREATE
export async function createGratitudeEntry (formData: FormData) {

    // Get user authenticated data
    const { supabase, userId } = await getAuthenticatedClient()

    // Get title
    // const title = String(formData.get("title") ?? "").trim()

    // Get content
    const content = String(formData.get("content"))

    // Validate content
    if (!content) {
        throw new Error("Content required")
    }

    // INSERT SQL 
    const { error } = await supabase.from("gratitude_entry").insert({
        owner_id: userId,
        content,
    })

    // Show errors
    if (error) throw new Error(error.message)

    // Reload page
    revalidatePath("/")
}

// READ
export async function readGratitudeEntry() {
    // Get user authenticated data
    const { supabase, userId } = await getAuthenticatedClient()

    // SELECT SQL
    const { data: entries, error } = await supabase
    .from("gratitude_entry")
    .select("id, content, created")
    .eq("owner_id", userId)

    // Show errors
    if (error) {
        throw new Error(error.message)
    }
    
    return entries
}

// UPDATE
export async function updateContentGratitudeEntry(formData:FormData) {
    // Get user authenticated data
    const { supabase, userId } = await getAuthenticatedClient()

    // Get new data
    const id = String(formData.get("id") ?? "")
    const content = String(formData.get("content") ?? "")

    // UPDATE SQL
    const { error } = await supabase
    .from("gratitude_entry")
    .update({content})
    .eq("id", id)
    .eq("owner_id", userId)

    // Show errors
    if(error) throw new Error(error.message)

    // Reload page
    revalidatePath("/")
}

// DELETE
export async function deleteGratitudeEntry(formData:FormData) {
    // Get user authenticated data
    const { supabase, userId } = await getAuthenticatedClient()

    // Get id
    const id = String(formData.get("id") ?? "")

    // DELETE SQL
    const { error } = await supabase
    .from("gratitude_entry")
    .delete()
    .eq("id", id)
    .eq("owner_id", userId)

    // Show errors
    if (error) throw new Error (error.message)

    // Reload page
    revalidatePath("/")
    
}


// LOGOUT
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  redirect("/")
}