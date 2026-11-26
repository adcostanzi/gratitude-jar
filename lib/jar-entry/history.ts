import { createClient } from "@/lib/supabase/server";

export const HISTORY_PAGE_SIZE = 5;

export type HistoryEntry = {
  id: string;
  content: string;
  created: string;
};

export type HistoryTag = {
  id: string;
  name: string | null;
};

type HistoryOptions = {
  page: number;
  startUtc?: string;
  endUtc?: string;
  tagId?: string;
};

// Keep the Memories read separate from Daniel's working CRUD actions.
// Filtering through tags_entry directly avoids requiring a PostgREST foreign-key
// relationship between gratitude_entry and tags_entry.
export async function readHistoryPage({ page, startUtc, endUtc, tagId }: HistoryOptions) {
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub;
  if (authError || !userId) throw new Error("Not authorized");

  const { data: tags, error: tagError } = await supabase
    .from("tags")
    .select("id, name")
    .order("name", { ascending: true });
  if (tagError) throw new Error(`Unable to load tags: ${tagError.message}`);

  const safePage = Math.max(1, Math.floor(page));
  const firstRow = (safePage - 1) * HISTORY_PAGE_SIZE;

  // No tag selected: keep efficient database-side filtering and pagination.
  if (!tagId) {
    let query = supabase
      .from("gratitude_entry")
      .select("id, content, created", { count: "exact" })
      .eq("owner_id", userId);

    if (startUtc) query = query.gte("created", startUtc);
    if (endUtc) query = query.lt("created", endUtc);

    const { data, count, error } = await query
      .order("created", { ascending: false })
      .order("id", { ascending: false })
      .range(firstRow, firstRow + HISTORY_PAGE_SIZE - 1);
    if (error) throw new Error(`Unable to load history: ${error.message}`);

    return {
      entries: (data ?? []) as HistoryEntry[],
      tags: (tags ?? []) as HistoryTag[],
      total: count ?? 0,
      pageSize: HISTORY_PAGE_SIZE,
    };
  }

  // Read the junction table directly instead of using tags_entry!inner.
  // Fetch links in batches to avoid Supabase's default 1,000-row response cap.
  const taggedEntryIds = new Set<string>();
  const linkBatchSize = 500;
  for (let offset = 0; ; offset += linkBatchSize) {
    const { data: links, error: linkError } = await supabase
      .from("tags_entry")
      .select("entry_id")
      .eq("tag_id", tagId)
      .order("entry_id", { ascending: true })
      .range(offset, offset + linkBatchSize - 1);

    if (linkError) throw new Error(`Unable to load entry tags: ${linkError.message}`);
    for (const link of links ?? []) taggedEntryIds.add(link.entry_id);
    if (!links || links.length < linkBatchSize) break;
  }

  if (taggedEntryIds.size === 0) {
    return { entries: [] as HistoryEntry[], tags: (tags ?? []) as HistoryTag[], total: 0, pageSize: HISTORY_PAGE_SIZE };
  }

  // Search entry IDs in small batches to avoid very long URLs and preserve the
  // authenticated user's ownership and optional date restrictions. Each batch
  // returns its count and its best candidates for the requested page; merging
  // them produces the correct global newest-first page and total count.
  const ids = Array.from(taggedEntryIds);
  const entryBatchSize = 100;
  const candidates: HistoryEntry[] = [];
  let total = 0;
  for (let offset = 0; offset < ids.length; offset += entryBatchSize) {
    const batch = ids.slice(offset, offset + entryBatchSize);
    let query = supabase
      .from("gratitude_entry")
      .select("id, content, created", { count: "exact" })
      .eq("owner_id", userId)
      .in("id", batch);

    if (startUtc) query = query.gte("created", startUtc);
    if (endUtc) query = query.lt("created", endUtc);

    const { data, count, error } = await query
      .order("created", { ascending: false })
      .order("id", { ascending: false })
      .range(0, Math.min(batch.length, firstRow + HISTORY_PAGE_SIZE) - 1);

    if (error) throw new Error(`Unable to load tagged history: ${error.message}`);
    total += count ?? 0;
    candidates.push(...((data ?? []) as HistoryEntry[]));
  }

  candidates.sort((a, b) =>
    Date.parse(b.created) - Date.parse(a.created) || b.id.localeCompare(a.id),
  );

  return {
    entries: candidates.slice(firstRow, firstRow + HISTORY_PAGE_SIZE),
    tags: (tags ?? []) as HistoryTag[],
    total,
    pageSize: HISTORY_PAGE_SIZE,
  };
}
