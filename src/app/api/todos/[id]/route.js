// -------------------------------------------------------
// src/app/api/todos/[id]/route.js
// -------------------------------------------------------
// Handles requests to /api/todos/:id
//
//   PUT    /api/todos/:id  → update a todo (title or completed)
//   DELETE /api/todos/:id  → delete a todo
//
// The [id] in the folder name becomes a dynamic URL segment.
// Next.js passes it to the function via the "params" argument.
// -------------------------------------------------------

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Todo from "@/models/Todo";

// PUT /api/todos/:id
// Updates a todo by its MongoDB ID
// The request body can include: { title } or { completed } or both
export async function PUT(request, { params }) {
  await connectDB();

  // Get the id from the URL (e.g. /api/todos/abc123 → id = "abc123")
  const { id } = await params;

  // Parse the new values from the request body
  const body = await request.json();

  // Find the todo by ID and update it
  // { new: true } means return the updated document, not the old one
  const updatedTodo = await Todo.findByIdAndUpdate(id, body, { new: true });

  return NextResponse.json(updatedTodo);
}

// DELETE /api/todos/:id
// Deletes a todo by its MongoDB ID
export async function DELETE(request, { params }) {
  await connectDB();

  const { id } = await params;

  // Find and delete the todo by ID
  await Todo.findByIdAndDelete(id);

  return NextResponse.json({ message: "Todo deleted successfully" });
}
