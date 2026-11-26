"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import EntryActions from "@/components/memories/entry-actions";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type Memory = { id: string; content: string; created: string };

function dayInfo(value: string, timeZone: string) {
  const date = new Date(value);
  const options: Intl.DateTimeFormatOptions = {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(date);
  const piece = (kind: string) => parts.find((part) => part.type === kind)?.value ?? "";
  return {
    key: `${piece("year")}-${piece("month")}-${piece("day")}`,
    heading: new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeZone }).format(date),
  };
}

export default function MemoryDayGroups({ memories }: { memories: Memory[] }) {
  // UTC is consistent between server rendering and initial hydration. After
  // mounting, headings use the visitor's local calendar days.
  const [timeZone, setTimeZone] = useState("UTC");
  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  }, []);

  const groups = useMemo(() => {
    const result: { key: string; heading: string; entries: Memory[] }[] = [];
    for (const memory of memories) {
      const day = dayInfo(memory.created, timeZone);
      const last = result[result.length - 1];
      if (last?.key === day.key) {
        last.entries.push(memory);
      } else {
        result.push({ ...day, entries: [memory] });
      }
    }
    return result;
  }, [memories, timeZone]);

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.key} aria-label={group.heading} className="space-y-3">
          <div className="flex items-center gap-3">
            <CalendarDays aria-hidden="true" className="h-5 w-5 shrink-0 text-jar-sage" />
            <h2 className="text-lg font-semibold text-jar-charcoal">{group.heading}</h2>
            <span className="h-px flex-1 bg-[#E6EBE6]" aria-hidden="true" />
          </div>
          {group.entries.map((memory) => (
            <Card key={memory.id} className="rounded-2xl border-[#E6EBE6] shadow-sm">
              <CardContent className="pt-6">
                <p className="whitespace-pre-wrap break-words text-jar-charcoal">{memory.content}</p>
              </CardContent>
              <CardFooter>
                <EntryActions id={memory.id} content={memory.content} />
              </CardFooter>
            </Card>
          ))}
        </section>
      ))}
    </div>
  );
}
