"use client";

import { useActionState } from "react";

import {
  loginAction,
  type AuthActionState,
} from "@/app/admin/actions/auth";

const initialState: AuthActionState = {};

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={nextPath} />
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold">Email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          className="w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#626e2b]"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold">Password</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#626e2b]"
        />
      </label>
      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[#1a1a18] px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
