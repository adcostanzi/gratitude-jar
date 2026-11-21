import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { readGratitudeEntry } from "@/lib/jar-entry/crud";
import AddEntryDialog from "@/components/ui/add-entry-dialog";
import HistoryFilters from "@/components/memories/history-filters";
import EntryActions, { MemoryDate } from "@/components/memories/entry-actions";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type Parameters = {
  from?: string | string[];
  to?: string | string[];
  fromUtc?: string | string[];
  toUtc?: string | string[];
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
  const filtersApplied = Boolean(start || end);

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

  let memories: Awaited<ReturnType<typeof readGratitudeEntry>> = [];
  let loadingError = false;
  if (!invalidRange) {
    try {
      memories = await readGratitudeEntry({ startUtc, endUtc });
    } catch {
      loadingError = true;
    }
  }

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

        <HistoryFilters key={`${start}:${end}`} from={start} to={end} />

        {invalidRange ? (
          <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">The start date cannot be after the end date.</p>
        ) : loadingError ? (
          <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">
            We couldn&apos;t load your memories right now. Please try again.
          </p>
        ) : (
          <section aria-label="Gratitude entries" className="space-y-4">
            <p className="text-sm text-jar-gray" role="status">
              {memories.length} {memories.length === 1 ? "memory" : "memories"} {filtersApplied ? "in the selected date range" : "saved"}
            </p>
            {memories.length === 0 ? (
              <div className="rounded-2xl border border-[#E6EBE6] bg-jar-sage-light p-8 text-center">
                <h2 className="text-lg font-semibold">
                  {filtersApplied ? "No memories match these dates" : "Your jar is waiting for its first memory"}
                </h2>
                <p className="mt-2 text-jar-gray">
                  {filtersApplied
                    ? "Try changing the date range or clearing the filters."
                    : "Add a gratitude entry to see it here."}
                </p>
              </div>
            ) : (
              memories.map((memory) => (
                <Card key={memory.id} className="rounded-2xl border-[#E6EBE6] shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base text-jar-gray">
                      <MemoryDate value={memory.created} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap break-words text-jar-charcoal">{memory.content}</p>
                  </CardContent>
                  <CardFooter>
                    <EntryActions id={memory.id} content={memory.content} />
                  </CardFooter>
                </Card>
              ))
            )}
          </section>
        )}
      </div>
    </main>
  );
}
