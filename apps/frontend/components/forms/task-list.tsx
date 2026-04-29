"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { TaskForm } from "@/components/forms/task-form";
import { deleteTask } from "@/app/clients/[clientId]/tasks/actions";
import { formatDate } from "@/lib/utils";
import type { Task } from "@/lib/types";

export function TaskList({
  tasks,
  clientId,
  canMutate,
}: {
  tasks: Task[];
  clientId: string;
  canMutate: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Task | null>(null);
  const [creating, setCreating] = useState(false);
  const [, startTransition] = useTransition();

  async function onDelete(id: string) {
    if (!confirm("Delete this task?")) return;
    startTransition(async () => {
      await deleteTask(id, clientId);
      router.refresh();
    });
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        {canMutate ? (
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> New task
          </button>
        ) : (
          <div className="text-xs text-muted-foreground">
            Read-only (mock mode). Switch off mock data in Settings to edit.
          </div>
        )}
      </div>

      <Table>
        <THead>
          <TR>
            <TH>Task</TH>
            <TH className="w-36">Owner</TH>
            <TH className="w-28">Due</TH>
            <TH className="w-28">Priority</TH>
            <TH className="w-32">Status</TH>
            <TH>Notes</TH>
            {canMutate && <TH className="w-24">Actions</TH>}
          </TR>
        </THead>
        <TBody>
          {tasks.map((t) => (
            <TR key={t.id}>
              <TD className="font-medium">{t.name}</TD>
              <TD>{t.owner}</TD>
              <TD className="whitespace-nowrap text-muted-foreground">
                {formatDate(t.due_date)}
              </TD>
              <TD>
                <PriorityBadge priority={t.priority} />
              </TD>
              <TD>
                <StatusBadge status={t.status} />
              </TD>
              <TD className="text-xs text-muted-foreground">{t.notes}</TD>
              {canMutate && (
                <TD>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditing(t)}
                      aria-label="Edit task"
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(t.id)}
                      aria-label="Delete task"
                      className="rounded p-1 text-muted-foreground hover:bg-rose-100 hover:text-rose-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </TD>
              )}
            </TR>
          ))}
        </TBody>
      </Table>

      {creating && (
        <TaskForm clientId={clientId} onClose={() => setCreating(false)} />
      )}
      {editing && (
        <TaskForm
          clientId={clientId}
          existing={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
