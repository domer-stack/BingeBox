"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { registerUser } from "@/lib/actions/auth";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const result = await registerUser(form);
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }
    const signInResult = await signIn("credentials", {
      login: form.get("username"),
      password: form.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (signInResult?.error) {
      router.push("/login");
      return;
    }
    router.push("/profile");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-4">
      <div>
        <label className="block text-sm text-[#9ab]">Username</label>
        <input
          name="username"
          required
          minLength={3}
          autoComplete="username"
          className="glass-input mt-1 w-full px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm text-[#9ab]">Display name (optional)</label>
        <input
          name="displayName"
          autoComplete="name"
          className="glass-input mt-1 w-full px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm text-[#9ab]">Email</label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="glass-input mt-1 w-full px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm text-[#9ab]">Password</label>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="glass-input mt-1 w-full px-3 py-2"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-2.5 disabled:opacity-50"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>
      <p className="text-center text-sm text-[#678]">
        Already have an account?{" "}
        <Link href="/login" className="text-[#40bcf4] hover:text-white">
          Sign in
        </Link>
      </p>
    </form>
  );
}
