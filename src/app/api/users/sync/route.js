import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import { requireFirebaseUser } from "@/lib/firebaseServerAuth";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(request) {
  const authResult = await requireFirebaseUser(request);

  if (!authResult.authorized) {
    return authResult.response;
  }

  await connectDB();

  const { user } = authResult;
  const email = (user.email || "").toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Firebase user email is missing." }, { status: 400 });
  }

  const syncedUser = await User.findOneAndUpdate(
    { firebaseUid: user.uid },
    {
      firebaseUid: user.uid,
      email,
      displayName: user.name || user.displayName || "",
      photoURL: user.picture || user.photoURL || "",
      provider: user.firebase?.sign_in_provider || user.provider_id || "firebase",
      lastLoginAt: new Date(),
    },
    { new: true, upsert: true }
  );

  return NextResponse.json(syncedUser, { status: 200 });
}