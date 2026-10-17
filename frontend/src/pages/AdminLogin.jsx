import { useState } from "react";
import useAuth from "../hooks/useAuth";

export default function AdminLogin() {
  const { login, authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const data = await login({
        email: email.trim(),
        password,
      });

      if (!data?.user || !data?.token) {
        throw new Error("Invalid login response.");
      }

      if (data.user.role !== "ADMIN") {
        localStorage.removeItem("rewearToken");
        localStorage.removeItem("rewearUser");

        window.location.href = "/admin/login";
        throw new Error("Access denied. Admin accounts only.");
      }

      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafaf7] px-5">
      <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-stone-900">
            ReWear Admin
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Sign in with your administrator account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="username"
              placeholder="admin@example.com"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={authLoading}
            className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {authLoading ? "Signing in..." : "Admin Sign In"}
          </button>
        </form>

        <a
          href="/"
          className="mt-6 block text-center text-sm text-stone-500 hover:text-emerald-700"
        >
          ← Back to Marketplace
        </a>
      </div>
    </div>
  );
}
