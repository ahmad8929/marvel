"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Container, Button, Input, Label } from "@/components/ui";

function ResetInner() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    if (res.ok) {
      setState("done");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setState("error");
    }
  }

  return (
    <Container className="flex justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-primary">Choose a new password</h1>
        {!token && (
          <p className="mt-4 text-sm text-sale">This reset link is missing its token.</p>
        )}
        {state === "done" ? (
          <p className="mt-4 text-sm text-primary">Password updated. Redirecting to sign in…</p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {state === "error" && (
              <p className="text-sm text-sale">This link is invalid or has expired.</p>
            )}
            <Button type="submit" className="w-full" disabled={!token}>
              Update password
            </Button>
          </form>
        )}
        <p className="mt-4 text-sm">
          <Link href="/login" className="text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </Container>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Container className="py-16 text-center text-muted">…</Container>}>
      <ResetInner />
    </Suspense>
  );
}
