"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch(`${API}/newsletter`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) setEmail("");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="text-sm text-primary">
        Thank you — you&apos;re on the list. Something beautiful is on its way ♥
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-md gap-2">
      <Input
        type="email"
        required
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={compact ? "h-10" : ""}
      />
      <Button type="submit" size={compact ? "sm" : "md"} disabled={state === "loading"}>
        {state === "loading" ? "…" : "Notify me"}
      </Button>
      {state === "error" && (
        <span className="sr-only">Something went wrong, please try again.</span>
      )}
    </form>
  );
}
