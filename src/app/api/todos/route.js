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

// GET /api/todos
// Returns all todos sorted by newest first
export async function GET() {
  // Connect to the database before doing anything
  await connectDB();

  // Find all todos and sort by creation date (newest at top)
  const todos = await Todo.find().sort({ createdAt: -1 });

  // Return the todos as a JSON response
  return NextResponse.json(todos);
}

// POST /api/todos
// Creates a new todo using the title from the request body
export async function POST(request) {
  await connectDB();

  // Parse the JSON body sent from the frontend
  const body = await request.json();

  // Create and save the new todo in MongoDB
  const todo = await Todo.create({ title: body.title });

  // Return the created todo with status 201 (Created)
  return NextResponse.json(todo, { status: 201 });
}
