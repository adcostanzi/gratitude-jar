"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

type Tag = { id: string; name: string | null };
type Props = { from: string; to: string; tag: string; tags: Tag[] };

type DateFieldProps = {
  id: string;
  label: string;
  value: string;
  min?: string;
  max?: string;
  onChange: (value: string) => void;
};

function openNativeCalendar(input: HTMLInputElement | null) {
  if (!input) return;

  // showPicker opens the browser's calendar when the user clicks anywhere
  // in the field, not just the small built-in calendar indicator.
  try {
    if (typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.focus();
    }
  } catch {
    // Browsers that restrict showPicker still allow normal date input.
    input.focus();
  }
}

function DateField({ id, label, value, min, max, onChange }: DateFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm text-jar-gray">
      <label htmlFor={id}>{label}</label>
      <div className="flex h-10 items-center rounded-lg border border-[#D5DDD5] bg-white focus-within:border-jar-sage focus-within:ring-2 focus-within:ring-jar-sage/20">
        <input
          id={id}
          ref={inputRef}
          type="date"
          value={value}
          min={min}
          max={max}
          onChange={(event) => onChange(event.target.value)}
          onClick={(event) => openNativeCalendar(event.currentTarget)}
          className="h-full min-w-0 flex-1 cursor-pointer bg-transparent px-3 text-jar-charcoal outline-none [&::-webkit-calendar-picker-indicator]:hidden"
        />
        <button
          type="button"
          aria-label={`Choose ${label.toLowerCase()} date`}
          title={`Choose ${label.toLowerCase()} date`}
          onClick={() => openNativeCalendar(inputRef.current)}
          className="flex h-full w-10 shrink-0 items-center justify-center rounded-r-lg text-jar-sage hover:bg-jar-sage-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jar-sage"
        >
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}


// The browser supplies local midnight boundaries. This ensures an entry
// written late at night appears on the user's *local* calendar date.
export default function HistoryFilters({ from: initialFrom, to: initialTo, tag: initialTag, tags }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [tag, setTag] = useState(initialTag);
  const [message, setMessage] = useState("");

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (from && to && from > to) {
      setMessage("The start date cannot be after the end date.");
      return;
    }
    setMessage("");
    const query = new URLSearchParams();
    if (tag) query.set("tag", tag);
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
    setTag("");
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DateField
          id="history-from-date"
          label="From"
          value={from}
          max={to || undefined}
          onChange={setFrom}
        />
        <DateField
          id="history-to-date"
          label="To"
          value={to}
          min={from || undefined}
          onChange={setTo}
        />
        <div className="flex min-w-0 flex-col gap-1 text-sm text-jar-gray">
          <label htmlFor="history-tag">Tag</label>
          <select
            id="history-tag"
            value={tag}
            onChange={(event) => setTag(event.target.value)}
            className="h-10 w-full rounded-lg border border-[#D5DDD5] bg-white px-3 text-jar-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-jar-sage"
          >
            <option value="">All tags</option>
            {tags.map((item) => (
              <option key={item.id} value={item.id}>{item.name ?? "Unnamed tag"}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="submit" disabled={pending} className="bg-jar-sage text-white hover:bg-jar-sage-hover">
          {pending ? "Filtering..." : "Apply filters"}
        </Button>
        <Button type="button" variant="outline" onClick={clearFilters} disabled={pending || (!from && !to && !tag)}>
          Clear
        </Button>
      </div>
      {message && <p role="alert" className="mt-3 text-sm text-red-700">{message}</p>}
    </form>
  );
}
