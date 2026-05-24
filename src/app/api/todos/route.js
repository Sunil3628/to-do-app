// -------------------------------------------------------
// src/app/api/todos/route.js
// -------------------------------------------------------
// Handles requests to /api/todos
//
//   GET  /api/todos  → fetch all todos from MongoDB
//   POST /api/todos  → create a new todo in MongoDB
// -------------------------------------------------------

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Todo from "@/models/Todo";
import User from "@/models/User";
import { requireFirebaseUser } from "@/lib/firebaseServerAuth";

export const runtime = "nodejs";

// GET /api/todos
// Returns all todos sorted by newest first
export async function GET(request) {
  const authResult = await requireFirebaseUser(request);

  if (!authResult.authorized) {
    return authResult.response;
  }

  // Connect to the database before doing anything
  await connectDB();

  const currentUser = await User.findOne({ firebaseUid: authResult.user.uid });

  if (!currentUser) {
    return NextResponse.json(
      { error: "Authenticated user is not linked in the database." },
      { status: 404 }
    );
  }

  // Find only the current user's todos and sort by creation date (newest at top)
  const todos = await Todo.find({ userId: currentUser._id }).sort({
    createdAt: -1,
  });

  // Return the todos as a JSON response
  return NextResponse.json(todos);
}

// POST /api/todos
// Creates a new todo using the title from the request body
export async function POST(request) {
  const authResult = await requireFirebaseUser(request);

  if (!authResult.authorized) {
    return authResult.response;
  }

  await connectDB();

  // Parse the JSON body sent from the frontend
  const body = await request.json();

  const currentUser = await User.findOne({ firebaseUid: authResult.user.uid });

  if (!currentUser) {
    return NextResponse.json(
      { error: "Authenticated user is not linked in the database." },
      { status: 404 }
    );
  }

  // Create and save the new todo in MongoDB
  const todo = await Todo.create({
    title: body.title,
    userId: currentUser._id,
    ownerUid: authResult.user.uid,
  });

  // Return the created todo with status 201 (Created)
  return NextResponse.json(todo, { status: 201 });
}
