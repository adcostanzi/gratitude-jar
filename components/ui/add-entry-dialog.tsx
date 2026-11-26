"use client";

import { useEffect, useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RecordText from "./record-input-text";
import { createGratitudeEntry } from "@/lib/jar-entry/crud";
import { createClient } from "@/lib/supabase/client";

interface AddEntryDialogProps {
  content: string;
}

type Tag = {
  id: string;
  name: string | null;
};

export default function AddEntryDialog({ content }: AddEntryDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [tagsError, setTagsError] = useState("");

  useEffect(() => {
    if (!open) return;

    let active = true;

    async function loadTags() {
      setLoadingTags(true);
      setTagsError("");

      const supabase = createClient();
      const { data, error } = await supabase
        .from("tags")
        .select("id, name")
        .order("name");

      if (!active) return;

      if (error) {
        setTags([]);
        setTagsError("We couldn't load tags. Close the form and try again.");
      } else {
        setTags(data ?? []);
      }

      setLoadingTags(false);
    }

    loadTags();

    return () => {
      active = false;
    };
  }, [open]);

  useEffect(() => {
    if (!showSuccess) return;

    const timer = window.setTimeout(() => {
      setShowSuccess(false);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [showSuccess]);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    const formData = new FormData(event.currentTarget);
    const gratitude = String(formData.get("content") ?? "").trim();

    if (!gratitude) {
      setError("Please write something you're grateful for.");
      return;
    }

    formData.set("content", gratitude);

    setError("");
    setSaving(true);

    try {
      await createGratitudeEntry(formData);

      setOpen(false);
      setShowSuccess(true);
      router.refresh();
    } catch {
      setError("We couldn't save your gratitude. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {showSuccess && (
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="max-w-sm text-center">
            <DialogHeader>
              <DialogTitle>Gratitude saved!</DialogTitle>
              <DialogDescription>
                Your gratitude has been added to your jar.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (saving) return;

          setOpen(nextOpen);

          if (nextOpen) {
            setError("");
            setShowSuccess(false);
          }
        }}
      >
        <DialogTrigger className="mt-6 w-full max-w-sm rounded-full bg-jar-sage px-6 py-3 font-semibold text-white hover:bg-jar-sage-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jar-sage md:w-auto">
          {content}
        </DialogTrigger>

        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Gratitude</DialogTitle>
            <DialogDescription>
              Capture a moment, feeling, or experience you're grateful for.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col justify-normal">
              <RecordText />
            </div>

            <fieldset disabled={saving || loadingTags} className="space-y-3">
              <legend className="text-sm font-semibold">
                Choose tags <span className="font-normal">(optional)</span>
              </legend>

              {loadingTags && (
                <p className="text-sm text-jar-gray">Loading tags...</p>
              )}

              {tagsError && (
                <p role="alert" className="text-sm text-red-700">
                  {tagsError}
                </p>
              )}

              {!loadingTags && !tagsError && tags.length === 0 && (
                <p className="text-sm text-jar-gray">
                  No tags are available yet.
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <label key={tag.id} className="cursor-pointer">
                    <input
                      type="checkbox"
                      name="tags"
                      value={tag.id}
                      className="peer sr-only"
                    />

                    <span className="inline-flex min-h-9 items-center rounded-full border border-[#E1E4E1] bg-[#F8F9F8] px-4 py-2 text-sm text-jar-charcoal transition-colors peer-checked:border-[#FFD0C3] peer-checked:bg-[#FFDCD2] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-jar-sage">
                      {tag.name ?? "Unnamed tag"}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            {error && (
              <p role="alert" className="text-sm text-red-700">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => setOpen(false)}
                className="rounded-lg px-5"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={saving || loadingTags || !!tagsError}
                className="rounded-lg bg-jar-sage px-6 text-white hover:bg-jar-sage-hover"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
