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
    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg mb-2 bg-white hover:shadow-sm transition">

      {/* Checkbox: clicking it toggles the completed status */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className="w-4 h-4 cursor-pointer accent-blue-500"
      />

      {/* Show an input field when editing, otherwise show the title text */}
      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="flex-1 border-b border-gray-400 focus:outline-none px-1"
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 ${
            todo.completed ? "line-through text-gray-400" : "text-gray-800"
          }`}
        >
          {todo.title}
        </span>
      )}

      {/* Edit button → switches to edit mode | Save button → saves the edit */}
      {isEditing ? (
        <button
          onClick={handleSave}
          className="text-sm text-green-600 hover:text-green-800 font-medium"
        >
          Save
        </button>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="text-sm text-blue-500 hover:text-blue-700 font-medium"
        >
          Edit
        </button>
      )}

      {/* Delete button → removes the todo */}
      <button
        onClick={handleDelete}
        className="text-sm text-red-500 hover:text-red-700 font-medium"
      >
        Delete
      </button>

    </div>
  );
}
