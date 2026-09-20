import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

const EMPTY_FORM = { name: "", email: "", age: "", password: "" };

/**
 * Self-contained login/signup modal.
 *
 * Owns its own form state and error state, so the parent only needs to
 * know *whether* to show it and what to do on success — it doesn't need
 * to manage form fields for a modal it isn't rendering most of the time.
 *
 * @param {boolean} open
 * @param {() => void} onClose
 * @param {(view: "login" | "signup") => Promise<void>} onSubmit -
 *   receives the current view; throwing surfaces the error in the modal
 * @param {"login" | "signup"} initialView
 */
export default function AuthModal({ open, onClose, onSubmit, initialView = "login" }) {
  const [view, setView] = useState(initialView);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Bug fix: this component doesn't unmount when `open` goes false (it just
  // renders null), so without this the view/form/error from the *last*
  // time it was open would still be sitting there next time it opens —
  // e.g. clicking "Log in" would show whatever view "Sign up" left behind.
  useEffect(() => {
    if (open) {
      setView(initialView);
      setForm(EMPTY_FORM);
      setError("");
    }
  }, [open, initialView]);

  if (!open) return null;

  function updateField(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function switchView() {
    setView((v) => (v === "login" ? "signup" : "login"));
    // Bug fix: the original cleared nothing on switch, including the
    // error message, so a stale "invalid password" could sit under a
    // freshly-opened signup form. Keep typed values, clear the error.
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit(view, form);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-7 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-neutral-500 hover:bg-neutral-800 hover:text-white"
        >
          <X size={18} />
        </button>

        <h2 className="text-2xl font-semibold text-white">
          {view === "login" ? "Welcome back" : "Create your account"}
        </h2>

        <p className="mb-6 mt-2 text-sm text-neutral-500">
          {view === "login"
            ? "Log in to continue chatting."
            : "Create an account to start chatting."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === "signup" && (
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={updateField("name")}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-white outline-none placeholder:text-neutral-500 focus:border-neutral-500"
              required
            />
          )}

          {view === "signup" && (
            <input
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={updateField("age")}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-white outline-none placeholder:text-neutral-500 focus:border-neutral-500"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={updateField("email")}
            className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-white outline-none placeholder:text-neutral-500 focus:border-neutral-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={updateField("password")}
            className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-white outline-none placeholder:text-neutral-500 focus:border-neutral-500"
            required
          />

          {error && (
            <p className="rounded-lg bg-red-950/50 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
          >
            {loading && <Loader2 size={17} className="animate-spin" />}
            {view === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          {view === "login" ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={switchView}
            className="ml-1 text-white hover:underline"
          >
            {view === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
