"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      login: form.get("login"),
      password: form.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid username/email or password.");
      return;
    }
    router.push("/profile");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-4">
      <div>
        <label className="block text-sm text-[var(--color-muted)]">Username or email</label>
        <input
          name="login"
          required
          autoComplete="username"
          className="glass-input mt-1 w-full px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm text-[var(--color-muted)]">Password</label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="glass-input mt-1 w-full px-3 py-2"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-2.5 disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-sm text-[var(--color-subtle)]">
        No account?{" "}
        <Link href="/register" className="text-[#40bcf4] hover:text-white">
          Create one
        </Link>
      </p>
    </form>
  );
}
