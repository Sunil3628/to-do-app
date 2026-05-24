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
import User from "@/models/User";
import { requireFirebaseUser } from "@/lib/firebaseServerAuth";

export const runtime = "nodejs";

// PUT /api/todos/:id
// Updates a todo by its MongoDB ID
// The request body can include: { title } or { completed } or both
export async function PUT(request, { params }) {
  const authResult = await requireFirebaseUser(request);

  if (!authResult.authorized) {
    return authResult.response;
  }

  await connectDB();

  const currentUser = await User.findOne({ firebaseUid: authResult.user.uid });

  if (!currentUser) {
    return NextResponse.json(
      { error: "Authenticated user is not linked in the database." },
      { status: 404 }
    );
  }

  // Get the id from the URL (e.g. /api/todos/abc123 → id = "abc123")
  const { id } = await params;

  const existingTodo = await Todo.findOne({
    _id: id,
    userId: currentUser._id,
  });

  if (!existingTodo) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }

  // Parse the new values from the request body
  const body = await request.json();

  // Find the todo by ID and update it
  // { new: true } means return the updated document, not the old one
  const updatedTodo = await Todo.findOneAndUpdate(
    { _id: id, userId: currentUser._id },
    body,
    { new: true }
  );

  return NextResponse.json(updatedTodo);
}

// DELETE /api/todos/:id
// Deletes a todo by its MongoDB ID
export async function DELETE(request, { params }) {
  const authResult = await requireFirebaseUser(request);

  if (!authResult.authorized) {
    return authResult.response;
  }

  await connectDB();

  const currentUser = await User.findOne({ firebaseUid: authResult.user.uid });

  if (!currentUser) {
    return NextResponse.json(
      { error: "Authenticated user is not linked in the database." },
      { status: 404 }
    );
  }

  const { id } = await params;

  // Find and delete the todo by ID
  const deletedTodo = await Todo.findOneAndDelete({
    _id: id,
    userId: currentUser._id,
  });

  if (!deletedTodo) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Todo deleted successfully" });
}
