"use client";

import { useState } from "react";
import Image from "next/image";

import { readRandomGratitudeEntry } from "@/lib/jar-entry/crud";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Memory = {
  id: string;
  content: string;
  created: string;
};

type RandomMemoryJarProps = {
  hasEntries: boolean | null;
};

export default function RandomMemoryJar({ hasEntries }: RandomMemoryJarProps) {
  const [memory, setMemory] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function drawMemory() {
    setLoading(true);
    setError("");
    setMemory(null);

    try {
      const entry = await readRandomGratitudeEntry();
      setMemory(entry);
    } catch {
      setError("We couldn't open a memory. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          void drawMemory();
        }
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Open a random gratitude memory"
          className="w-full max-w-[400px] rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jar-sage"
        >
          <span className="relative block">
            <Image
              className="h-auto w-full"
              src="/images/gratitude-jar.svg"
              alt=""
              width={400}
              height={400}
            />

            {hasEntries === true && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
              >
                <span className="absolute left-[39%] top-[65%] h-[7%] w-[13%] -rotate-12 rounded-sm bg-[#F2B69D]" />

                <span className="absolute left-[52%] top-[64%] h-[7%] w-[13%] rotate-12 rounded-sm bg-[#B9A7D0]" />

                <span className="absolute left-[45%] top-[75%] h-[7%] w-[13%] rotate-6 rounded-sm bg-[#E8C66A]" />
              </span>
            )}
          </span>
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your gratitude memory</DialogTitle>
          <DialogDescription>
            Take a moment to revisit something you were grateful for.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <p role="status">Opening your jar...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : memory ? (
          <p className="whitespace-pre-wrap">{memory.content}</p>
        ) : (
          <p>
            Your jar is empty. Close this window to add your first gratitude.
          </p>
        )}

        {!loading && (memory || error) && (
          <button
            type="button"
            onClick={drawMemory}
            className="rounded-full bg-jar-sage px-6 py-3 font-semibold text-white hover:bg-jar-sage-hover"
          >
            {error ? "Try again" : "Draw again"}
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
