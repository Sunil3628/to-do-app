// -------------------------------------------------------
// src/components/TodoItem.js
// -------------------------------------------------------
// Displays a single todo with:
//   - A checkbox to toggle completed/not completed
//   - The todo title (or an edit input when editing)
//   - An Edit/Save button
//   - A Delete button
// -------------------------------------------------------

"use client"; // This component runs in the browser

import { useState } from "react";
import { getFirebaseAuthHeaders } from "@/lib/firebase";

export default function TodoItem({ todo, user, onUpdate, onDelete }) {
  // Track whether we're in edit mode for this todo
  const [isEditing, setIsEditing] = useState(false);

  // Hold the edited title value while the user is typing
  const [editTitle, setEditTitle] = useState(todo.title);

  // ---- Toggle completed status ----
  async function handleToggle() {
    // Send a PUT request to flip the completed flag
    const headers = {
      "Content-Type": "application/json",
      ...(await getFirebaseAuthHeaders(user)),
    };

    const res = await fetch(`/api/todos/${todo._id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ completed: !todo.completed }),
    });

    const updated = await res.json();

    // Notify the parent to replace this todo with the updated version
    onUpdate(updated);
  }

  // ---- Save edited title ----
  async function handleSave() {
    // Don't save if the input is empty
    if (!editTitle.trim()) return;

    const headers = {
      "Content-Type": "application/json",
      ...(await getFirebaseAuthHeaders(user)),
    };

    const res = await fetch(`/api/todos/${todo._id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ title: editTitle }),
    });

    const updated = await res.json();

    // Notify parent and exit edit mode
    onUpdate(updated);
    setIsEditing(false);
  }

  // ---- Delete this todo ----
  async function handleDelete() {
    const headers = await getFirebaseAuthHeaders(user);

    await fetch(`/api/todos/${todo._id}`, { method: "DELETE", headers });

    // Notify the parent to remove this todo from the list
    onDelete(todo._id);
  }

  return (
    <div className="mb-3 flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition hover:border-cyan-400/30 hover:bg-slate-950/80 sm:flex-row sm:items-center">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className="h-4 w-4 cursor-pointer accent-cyan-400"
      />

      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-400"
          autoFocus
        />
      ) : (
        <span
          className={`min-w-0 flex-1 text-sm sm:text-base ${
            todo.completed ? "text-slate-500 line-through" : "text-slate-100"
          }`}
        >
          {todo.title}
        </span>
      )}

      <div className="flex items-center gap-2 self-end sm:self-auto">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/20"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Edit
          </button>
        )}

        <button
          onClick={handleDelete}
          className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1.5 text-sm font-semibold text-rose-200 transition hover:bg-rose-400/20"
        >
          Delete
        </button>
      </div>

    </div>
  );
}
