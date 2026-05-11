// -------------------------------------------------------
// src/app/page.js
// -------------------------------------------------------
// This is the main page of our Todo App.
//
// What it does:
//   1. Loads all todos from the database when the page opens
//   2. Renders the AddTodoForm so users can add new todos
//   3. Renders a TodoItem for each todo in the list
//   4. Handles adding, updating, and deleting todos in state
//      so the UI updates immediately without a full page refresh
// -------------------------------------------------------

"use client"; // This page uses React state and effects, so it runs in the browser

import { useEffect, useState } from "react";
import AddTodoForm from "@/components/AddTodoForm";
import TodoItem from "@/components/TodoItem";
import AuthButtons from "@/components/AuthButtons";

export default function Home() {
  // "todos" holds the list of todos fetched from the database
  const [todos, setTodos] = useState([]);

  // useEffect runs once when the page first loads
  // It fetches all existing todos from the API
  useEffect(() => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []); // empty array [] means "run only once on mount"

  // Called by AddTodoForm when a new todo is created
  // Adds the new todo to the top of the list
  function handleAdd(newTodo) {
    setTodos((prev) => [newTodo, ...prev]);
  }

  // Called by TodoItem when a todo is edited or toggled
  // Replaces the old version of the todo with the updated one
  function handleUpdate(updatedTodo) {
    setTodos((prev) =>
      prev.map((t) => (t._id === updatedTodo._id ? updatedTodo : t))
    );
  }

  // Called by TodoItem when a todo is deleted
  // Removes the todo from the list by filtering it out
  function handleDelete(id) {
    setTodos((prev) => prev.filter((t) => t._id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-md p-6">

        {/* Page title */}
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          📝 My Todo App
        </h1>

        {/* Form to add new todos */}
        <AuthButtons />
        <AddTodoForm onAdd={handleAdd} />

        {/* Show a message if there are no todos */}
        {todos.length === 0 ? (
          <p className="text-center text-gray-400 mt-4">
            No todos yet. Add one above!
          </p>
        ) : (
          /* Render each todo as a TodoItem */
          todos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))
        )}

      </div>
    </div>
  );
}

