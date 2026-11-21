"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteEntry, updateContentGratitudeEntry } from "@/lib/jar-entry/crud";

type Props = { id: string; content: string };

export default function EntryActions({ id, content }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [draft, setDraft] = useState(content);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim() || saving) return;
    setEditError("");
    setSaving(true);
    const formData = new FormData();
    formData.set("id", id);
    formData.set("content", draft.trim());
    try {
      await updateContentGratitudeEntry(formData);
      setEditing(false);
      router.refresh();
    } catch {
      setEditError("We couldn't save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (removing) return;
    setDeleteError("");
    setRemoving(true);
    try {
      await deleteEntry(id);
      setDeleting(false);
      router.refresh();
    } catch {
      setDeleteError("We couldn't delete this memory. Please try again.");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Dialog
        open={editing}
        onOpenChange={(open) => {
          if (!saving) {
            setEditing(open);
            if (open) { setDraft(content); setEditError(""); }
          }
        }}
      >
        <DialogTrigger asChild>
          <Button variant="secondary" type="button"><PencilIcon aria-hidden="true" /> Edit</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit your gratitude</DialogTitle>
            <DialogDescription>Update this memory and save your changes.</DialogDescription>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <label htmlFor={`entry-content-${id}`} className="block text-sm font-medium">Gratitude entry</label>
            <textarea
              id={`entry-content-${id}`}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={5}
              required
              disabled={saving}
              className="w-full resize-y rounded-lg border border-[#D5DDD5] bg-white p-3 text-jar-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-jar-sage"
            />
            {editError && <p role="alert" className="text-sm text-red-700">{editError}</p>}
            <DialogFooter>
              <DialogClose asChild><Button variant="outline" type="button" disabled={saving}>Cancel</Button></DialogClose>
              <Button type="submit" disabled={saving || !draft.trim() || draft.trim() === content.trim()} className="bg-jar-sage text-white hover:bg-jar-sage-hover">
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleting} onOpenChange={(open) => { if (!removing) { setDeleting(open); setDeleteError(""); } }}>
        <DialogTrigger asChild>
          <Button type="button" variant="destructive"><TrashIcon aria-hidden="true" /> Delete</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this memory?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {deleteError && <p role="alert" className="text-sm text-red-700">{deleteError}</p>}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" type="button" disabled={removing}>Cancel</Button></DialogClose>
            <Button variant="destructive" type="button" onClick={remove} disabled={removing}>
              {removing ? "Deleting..." : "Delete memory"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


export function MemoryDate({ value }: { value: string }) {
  const date = new Date(value);
  const [label, setLabel] = useState(() =>
    date.toLocaleDateString("en-US", { dateStyle: "long", timeZone: "UTC" })
  );
  useEffect(() => {
    setLabel(new Date(value).toLocaleDateString("en-US", { dateStyle: "long" }));
  }, [value]);
  return <time dateTime={value}>{label}</time>;
}
