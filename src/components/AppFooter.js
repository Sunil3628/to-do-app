"use client";

export default function AppFooter({
  todoCount,
  canUseFirebaseAuth,
  authReady,
  firebaseMissingConfig,
  user,
}) {
  return (
    <footer className="border-t border-white/10 bg-slate-950/60 px-6 py-5 sm:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-300">
          Keep the list short, the next step obvious, and the board easy to scan.
        </p>

        <div className="flex flex-wrap gap-2 text-xs text-slate-400">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            {todoCount} {todoCount === 1 ? "task" : "tasks"}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            {firebaseMissingConfig
              ? "Firebase config missing"
              : !canUseFirebaseAuth
                ? "Auth loading"
                : user
                  ? "Signed in"
                  : authReady
                    ? "Waiting for sign in"
                    : "Preparing session"}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            One screen, quick edits, instant updates
          </span>
        </div>
      </div>
    </footer>
  );
}