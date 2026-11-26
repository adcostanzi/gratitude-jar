import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { HISTORY_PAGE_SIZE, readHistoryPage } from "@/lib/jar-entry/history";
import AddEntryDialog from "@/components/ui/add-entry-dialog";
import HistoryFilters from "@/components/memories/history-filters";
import MemoryDayGroups from "@/components/memories/memory-day-groups";
import HistoryPagination from "@/components/memories/history-pagination";

type Parameters = {
  from?: string | string[];
  to?: string | string[];
  fromUtc?: string | string[];
  toUtc?: string | string[];
  tag?: string | string[];
  page?: string | string[];
};

type Props = { searchParams: Promise<Parameters> };

function single(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)) &&
    new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value;
}

function validIso(value: string) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) &&
    !Number.isNaN(Date.parse(value));
}

export default async function MemoriesPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getClaims();
  if (authError || !auth?.claims?.sub) redirect("/auth/login");

  const query = await searchParams;
  const from = single(query.from);
  const to = single(query.to);
  const start = validDate(from) ? from : "";
  const end = validDate(to) ? to : "";
  const invalidRange = Boolean(start && end && start > end);
  const requestedTag = single(query.tag);
  // IDs are UUIDs. Reject malformed URLs rather than sending them to PostgreSQL.
  const tag = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requestedTag)
    ? requestedTag : "";
  const requestedPage = single(query.page);
  const page = /^[1-9]\d*$/.test(requestedPage)
    ? Math.min(1000000, Number(requestedPage)) : 1;
  const filtersApplied = Boolean(start || end || tag);

  // Prefer the browser-generated local date bounds, falling back to UTC for
  // manually entered URLs. The Supabase timestamp column is TIMESTAMPTZ.
  const rawStartUtc = single(query.fromUtc);
  const rawEndUtc = single(query.toUtc);
  const startUtc = start
    ? validIso(rawStartUtc) ? rawStartUtc : `${start}T00:00:00.000Z`
    : undefined;
  const endUtc = end
    ? validIso(rawEndUtc)
      ? rawEndUtc
      : new Date(Date.parse(`${end}T00:00:00.000Z`) + 86_400_000).toISOString()
    : undefined;

  let memories: Awaited<ReturnType<typeof readHistoryPage>>["entries"] = [];
  let tags: Awaited<ReturnType<typeof readHistoryPage>>["tags"] = [];
  let total = 0;
  const pageSize = HISTORY_PAGE_SIZE;
  let loadingError = false;
  if (!invalidRange) {
    try {
      const result = await readHistoryPage({ page, startUtc, endUtc, tagId: tag || undefined });
      memories = result.entries;
      tags = result.tags;
      total = result.total;
    } catch (error) {
      console.error("Unable to load Memories history:", error);
      loadingError = true;
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  // Preserve the current filters and the browser-computed date boundaries
  // when moving between pages, so the next page shows the same date range.
  const pageQuery: Record<string, string> = {};
  if (start) pageQuery.from = start;
  if (end) pageQuery.to = end;
  if (startUtc) pageQuery.fromUtc = startUtc;
  if (endUtc) pageQuery.toUtc = endUtc;
  if (tag) pageQuery.tag = tag;
  const visibleFrom = memories.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const visibleTo = memories.length === 0 ? 0 : Math.min(page * pageSize, total);

  return (
    <main className="min-h-screen bg-white px-6 pb-32 pt-8 text-jar-charcoal md:py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">Your Memories</h1>
            <p className="mt-2 text-jar-gray">A collection of the little things you&apos;re grateful for.</p>
          </div>
          <div><AddEntryDialog content="+ Add Gratitude" /></div>
        </header>

        <HistoryFilters key={`${start}:${end}:${tag}`} from={start} to={end} tag={tag} tags={tags} />

        {invalidRange ? (
          <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">The start date cannot be after the end date.</p>
        ) : loadingError ? (
          <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">
            We couldn&apos;t load your memories right now. Please try again.
          </p>
        ) : (
          <section aria-label="Gratitude entries" className="space-y-5">
            <p className="text-sm text-jar-gray" role="status">
              {total === 0
                ? `0 memories ${filtersApplied ? "match your filters" : "saved"}`
                : memories.length === 0
                  ? `${total} ${total === 1 ? "memory" : "memories"} found — page ${page} is out of range`
                  : `Showing ${visibleFrom}–${visibleTo} of ${total} ${total === 1 ? "memory" : "memories"}`}
            </p>
            {memories.length === 0 ? (
              <div className="rounded-2xl border border-[#E6EBE6] bg-jar-sage-light p-8 text-center">
                <h2 className="text-lg font-semibold">
                  {total > 0
                    ? "No memories on this page"
                    : filtersApplied ? "No memories match these filters" : "Your jar is waiting for its first memory"}
                </h2>
                <p className="mt-2 text-jar-gray">
                  {total > 0
                    ? "Go back to an earlier page to see your memories."
                    : filtersApplied
                      ? "Try changing the dates or tag, or clearing the filters."
                      : "Add a gratitude entry to see it here."}
                </p>
                {total > 0 && (
                  <Link className="mt-3 inline-block font-semibold text-jar-sage underline" href={`/memories?${new URLSearchParams({ ...pageQuery, page: String(totalPages) }).toString()}`}>
                    Go to last page
                  </Link>
                )}
              </div>
            ) : (
              <MemoryDayGroups memories={memories} />
            )}
            {total > 0 && (
              <HistoryPagination page={page} totalPages={totalPages} query={pageQuery} />
            )}
          </section>
        )}
      </div>
    </main>
  );
}
