"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import {
  createTask,
  updateTask,
  type TaskFormData,
} from "@/app/clients/[clientId]/tasks/actions";
import type { Task } from "@/lib/types";

type Props = {
  clientId: string;
  existing?: Task;
  onClose: () => void;
};

const STATUSES: TaskFormData["status"][] = [
  "not_started",
  "in_progress",
  "blocked",
  "done",
  "paused",
];
const PRIORITIES: TaskFormData["priority"][] = [
  "low",
  "medium",
  "high",
  "critical",
];

export function TaskForm({ clientId, existing, onClose }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<TaskFormData>({
    client_id: clientId,
    name: existing?.name ?? "",
    owner: existing?.owner ?? "",
    due_date: existing?.due_date ?? "",
    status: (existing?.status as TaskFormData["status"]) ?? "not_started",
    priority: (existing?.priority as TaskFormData["priority"]) ?? "medium",
    notes: existing?.notes ?? "",
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) {
      setError("Task name is required.");
      return;
    }
    startTransition(async () => {
      const res = existing
        ? await updateTask(existing.id, form)
        : await createTask(form);
      if ("error" in res && res.error) {
        setError(res.error);
        return;
      }
      router.refresh();
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold">
            {existing ? "Edit task" : "New task"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 px-5 py-4">
          <Field label="Task">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={input}
              placeholder="What needs to get done?"
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Owner">
              <input
                value={form.owner}
                onChange={(e) => setForm({ ...form, owner: e.target.value })}
                className={input}
                placeholder="Who owns it?"
              />
            </Field>
            <Field label="Due date">
              <input
                type="date"
                value={form.due_date}
                onChange={(e) =>
                  setForm({ ...form, due_date: e.target.value })
                }
                className={input}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as any })
                }
                className={input}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Priority">
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({ ...form, priority: e.target.value as any })
                }
                className={input}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Notes">
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className={`${input} resize-none`}
            />
          </Field>

          {error && (
            <div className="rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {pending ? "Saving…" : existing ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const input =
  "block w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
