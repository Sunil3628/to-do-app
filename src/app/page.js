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
import AuthModal from "@/components/AuthModal";
import TodoItem from "@/components/TodoItem";
import AuthButtons from "@/components/AuthButtons";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  // "todos" holds the list of todos fetched from the database
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authOpen, setAuthOpen] = useState(true);

  // Track the current Firebase user and open the auth modal until someone signs in.
  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
      setAuthOpen(!currentUser);

      if (!currentUser) {
        setTodos([]);
      }
    });
  }, []); // empty array [] means "run only once on mount"

  // Only load todos after Firebase auth is ready and the user is signed in.
  useEffect(() => {
    if (!authReady || !user) return;

    fetch("/api/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, [authReady, user]);

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1f2937_0%,_#0f172a_42%,_#020617_100%)] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
        <div className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-2xl backdrop-blur">
          <div className="border-b border-white/10 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">
                  Firebase Todo Space
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
                  Your tasks, synced after sign in.
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                  Use the modal to sign in or create an account. Once you are in,
                  your todo list opens up here.
                </p>
              </div>

              {user ? <AuthButtons user={user} /> : null}
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              {user ? (
                <>
                  <AddTodoForm onAdd={handleAdd} />

                  {todos.length === 0 ? (
                    <p className="mt-4 rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-slate-300">
                      No todos yet. Add one above.
                    </p>
                  ) : (
                    <div className="mt-4">
                      {todos.map((todo) => (
                        <TodoItem
                          key={todo._id}
                          todo={todo}
                          onUpdate={handleUpdate}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex min-h-[24rem] flex-col justify-center rounded-2xl border border-white/10 border-dashed bg-slate-900/60 p-6 text-center">
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">
                    Authentication required
                  </p>
                  <h2 className="mt-4 text-2xl font-semibold text-white">
                    Sign in or create your account to continue.
                  </h2>
                  <p className="mt-3 text-sm text-slate-300">
                    Your todo board is hidden until Firebase authentication is complete.
                  </p>
                  <button
                    type="button"
                    onClick={() => setAuthOpen(true)}
                    className="mx-auto mt-6 rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                  >
                    Open login
                  </button>
                </div>
              )}
            </section>

            <aside className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-300">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">
                Setup
              </p>
              <ul className="mt-4 space-y-3 leading-6">
                <li>Firebase auth is initialized in the shared client module.</li>
                <li>The page waits for a signed-in user before loading todos.</li>
                <li>Login and sign up are handled in one modal with separate modes.</li>
              </ul>
            </aside>
          </div>

          <AuthModal
            open={authOpen}
            onClose={() => setAuthOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}

