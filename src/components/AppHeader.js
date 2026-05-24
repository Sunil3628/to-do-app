"use client";

import AuthButtons from "@/components/AuthButtons";

export default function AppHeader({
  user,
  onOpenAuth,
  canUseFirebaseAuth,
  authReady,
  firebaseMissingConfig,
  todoCount,
}) {
  const authStateLabel = firebaseMissingConfig
    ? "Firebase config missing"
    : !canUseFirebaseAuth
      ? "Auth loading"
      : user
        ? "Signed in"
        : authReady
          ? "Waiting for sign in"
          : "Preparing session";

  return (
    <header className="border-b border-white/10 bg-white/5 px-6 py-6 sm:px-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.45em] text-cyan-300/80">
            Firebase Todo Space
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            A cleaner place to plan, sync, and finish your tasks.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Keep your day focused with a compact workspace, fast todo actions,
            and Firebase-backed sign in when you need to move across devices.
          </p>

          <div className="mt-5 flex flex-wrap gap-3 text-xs font-medium uppercase tracking-[0.25em] text-slate-300">
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-cyan-200">
              {todoCount} {todoCount === 1 ? "task" : "tasks"}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
              {authStateLabel}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
              Focus first, friction later
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 lg:items-end">
          {canUseFirebaseAuth && user ? (
            <AuthButtons user={user} />
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Open login
            </button>
          )}

          <p className="max-w-sm text-xs leading-5 text-slate-400">
            {firebaseMissingConfig
              ? "Firebase auth is not configured yet, so the board stays local until the required env vars are added."
              : user
                ? "Your session is active and the todo list syncs through Firebase when you edit it."
                : "Sign in to unlock syncing, create new tasks, and keep the board connected."}
          </p>
        </div>
      </div>
    </header>
  );
}