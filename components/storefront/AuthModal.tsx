"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/lib/auth-client";
import { Button, Input, Label, PasswordInput } from "@/components/ui";
import { LogoMark } from "@/components/brand/Logo";

/** Inline sign-in / create-account used at checkout so the cart isn't lost. */
export function AuthModal({
  open,
  onClose,
  onSuccess,
  reason = "Sign in to place your order",
}: {
  open: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  reason?: string;
}) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (tab === "login") await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/50"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-sm border border-line bg-bg p-8">
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 text-muted hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        <div className="flex flex-col items-center text-center">
          <LogoMark className="h-10 w-10" />
          <p className="mt-3 text-sm text-muted">{reason}</p>
        </div>

        <div className="mt-6 flex border-b border-line text-xs font-medium uppercase tracking-[0.14em]">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 pb-2 ${tab === "login" ? "border-b-2 border-primary text-primary" : "text-muted"}`}
          >
            Sign in
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 pb-2 ${tab === "register" ? "border-b-2 border-primary text-primary" : "text-muted"}`}
          >
            Create account
          </button>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4">
          {tab === "register" && (
            <div>
              <Label htmlFor="am-name">Full name</Label>
              <Input
                id="am-name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
          )}
          <div>
            <Label htmlFor="am-email">Email</Label>
            <Input
              id="am-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="am-password">Password</Label>
            <PasswordInput
              id="am-password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
            {tab === "register" && (
              <p className="mt-1 text-xs text-muted">At least 8 characters.</p>
            )}
          </div>
          {error && <p className="text-sm text-sale">{error}</p>}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy
              ? "Please wait…"
              : tab === "login"
                ? "Sign in & continue"
                : "Create account & continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
