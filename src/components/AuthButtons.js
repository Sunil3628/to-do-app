"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export default function AuthButtons() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
  }, []);

  async function handleSignIn() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleSignOut() {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  }

  if (user)
    return (
      <div className="flex items-center gap-3 mb-4">
        <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full" />
        <span className="text-sm">{user.displayName}</span>
        <button onClick={handleSignOut} className="ml-2 btn">
          Sign out
        </button>
      </div>
    );

  return (
    <div className="mb-4">
      <button onClick={handleSignIn} className="btn">
        Sign in with Google
      </button>
    </div>
  );
}
