"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function Page() {
  const router = useRouter();
  const [form, setForm] = useState({ loginIdentifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login({
        loginIdentifier: form.loginIdentifier,
        password: form.password,
      });

      localStorage.setItem("user", JSON.stringify(result.userdata));
      router.push("/admin");

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f5f3] px-4">
      <div className="w-full max-w-md rounded-[28px] border border-black bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-black/60">Welcome back</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-black">Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="loginIdentifier" className="mb-2 block text-sm font-medium text-black">
              Username or Email
            </label>
            <input
              id="loginIdentifier"
              name="loginIdentifier"
              type="text"
              value={form.loginIdentifier}
              onChange={handleChange}
              placeholder="Enter username or email"
              className="w-full rounded-xl border border-black bg-white px-4 py-3 text-base text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-black">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full rounded-xl border border-black bg-white px-4 py-3 text-base text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              required
            />
          </div>

          {error ? (
            <p className="rounded-lg bg-black px-3 py-2 text-sm text-white">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black px-4 py-3 text-base font-medium text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}