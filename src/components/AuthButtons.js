"use client";

import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function AuthButtons({ user }) {
  async function handleSignOut() {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400 font-semibold text-slate-950">
        {(user?.displayName || user?.email || "U").slice(0, 1).toUpperCase()}
      </div>
      <div className="leading-tight">
        <p className="font-medium text-white">
          {user?.displayName || user?.email || "Signed in user"}
        </p>
        <p className="text-xs text-slate-400">Firebase authenticated</p>
      </div>
      <button
        onClick={handleSignOut}
        className="ml-2 rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
      >
        Sign out
      </button>
    </div>
  );
}
