// -------------------------------------------------------
// src/models/Todo.js
// -------------------------------------------------------
// This file defines the "shape" of a Todo document in MongoDB.
// Mongoose uses a Schema to validate and structure data
// before saving it to the database.
// -------------------------------------------------------

import mongoose from "mongoose";

// Schema = the blueprint for a Todo document
const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"], // won't save without a title
      trim: true, // strips leading/trailing spaces automatically
    },

    completed: {
      type: Boolean,
      default: false, // every new todo starts as not completed
    },
  },
  {
    // Automatically adds "createdAt" and "updatedAt" timestamps
    timestamps: true,
  }
);

// mongoose.models.Todo → reuse the model if it was already compiled
// (important in Next.js hot reload, avoids "Cannot overwrite model" error)
const Todo = mongoose.models.Todo || mongoose.model("Todo", TodoSchema);

export default Todo;
