"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { from: string; to: string };

// The browser supplies local midnight boundaries. This ensures an entry
// written late at night appears on the user's *local* calendar date.
export default function HistoryFilters({ from: initialFrom, to: initialTo }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [message, setMessage] = useState("");

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (from && to && from > to) {
      setMessage("The start date cannot be after the end date.");
      return;
    }
    setMessage("");
    const query = new URLSearchParams();
    if (from) {
      query.set("from", from);
      query.set("fromUtc", new Date(`${from}T00:00:00`).toISOString());
    }
    if (to) {
      query.set("to", to);
      const exclusiveEnd = new Date(`${to}T00:00:00`);
      exclusiveEnd.setDate(exclusiveEnd.getDate() + 1);
      query.set("toUtc", exclusiveEnd.toISOString());
    }
    const search = query.toString();
    startTransition(() => {
      router.push(`/memories${search ? `?${search}` : ""}`);
    });
  }

  function clearFilters() {
    setFrom("");
    setTo("");
    setMessage("");
    startTransition(() => router.push("/memories"));
  }

  return (
    <form
      onSubmit={applyFilters}
      className="rounded-2xl border border-[#E6EBE6] bg-white p-5 shadow-sm"
    >
      <div className="mb-4 flex items-center gap-2 font-semibold text-jar-charcoal">
        <CalendarDays className="h-5 w-5 text-jar-sage" aria-hidden="true" />
        Filter by date
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm text-jar-gray">
          From
          <input
            type="date"
            value={from}
            max={to || undefined}
            onChange={(event) => setFrom(event.target.value)}
            className="h-10 w-full rounded-lg border border-[#D5DDD5] bg-white px-3 text-jar-charcoal"
          />
        </label>
        <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm text-jar-gray">
          To
          <input
            type="date"
            value={to}
            min={from || undefined}
            onChange={(event) => setTo(event.target.value)}
            className="h-10 w-full rounded-lg border border-[#D5DDD5] bg-white px-3 text-jar-charcoal"
          />
        </label>
        <Button type="submit" disabled={pending} className="bg-jar-sage text-white hover:bg-jar-sage-hover">
          {pending ? "Filtering..." : "Apply filters"}
        </Button>
        <Button type="button" variant="outline" onClick={clearFilters} disabled={pending || (!from && !to)}>
          Clear
        </Button>
      </div>
      {message && <p role="alert" className="mt-3 text-sm text-red-700">{message}</p>}
    </form>
  );
}
