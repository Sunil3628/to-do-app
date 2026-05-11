// -------------------------------------------------------
// src/components/AddTodoForm.js
// -------------------------------------------------------
// A simple form that lets the user type a todo title and
// submit it. After submitting, it calls the parent's onAdd()
// function to add the new todo to the list.
// -------------------------------------------------------

"use client"; // This component runs in the browser (not on the server)

import { useState } from "react";

export default function AddTodoForm({ onAdd }) {
  // "title" holds the current value of the input field
  const [title, setTitle] = useState("");

  async function handleSubmit(e) {
    // Prevent the page from refreshing on form submit
    e.preventDefault();

    // Don't submit if the input is empty
    if (!title.trim()) return;

    // Send a POST request to the API to create a new todo
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      {/* Text input for the todo title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new todo..."
        className="flex-1 border border-gray-300 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Submit button */}
      <button
        type="submit"
        className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Add
      </button>
    </form>
  );
}
