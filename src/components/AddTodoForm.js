// -------------------------------------------------------
// src/components/AddTodoForm.js
// -------------------------------------------------------
// A simple form that lets the user type a todo title and
// submit it. After submitting, it calls the parent's onAdd()
// function to add the new todo to the list.
// -------------------------------------------------------

"use client"; // This component runs in the browser (not on the server)

import { useState } from "react";
import { getFirebaseAuthHeaders } from "@/lib/firebase";

export default function AddTodoForm({ onAdd, user }) {
  // "title" holds the current value of the input field
  const [title, setTitle] = useState("");

  async function handleSubmit(e) {
    // Prevent the page from refreshing on form submit
    e.preventDefault();

    // Don't submit if the input is empty
    if (!title.trim()) return;

    // Send a POST request to the API to create a new todo
    const headers = {
      "Content-Type": "application/json",
      ...(await getFirebaseAuthHeaders(user)),
    };

    const res = await fetch("/api/todos", {
      method: "POST",
      headers,
      body: JSON.stringify({ title }),
    });

    // Get the newly created todo from the response
    const newTodo = await res.json();

    // Tell the parent component (page.js) to add this todo to the list
    onAdd(newTodo);

    // Clear the input field after submission
    setTitle("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-3 sm:flex-row"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new todo..."
        className="flex-1 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
      />

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:from-cyan-300 hover:to-sky-400 sm:min-w-32"
      >
        Add
      </button>
    </form>
  );
}
