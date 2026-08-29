"use client";

import { useState } from "react";
import Link from "next/link";
import { Container, Button, Input, Label } from "@/components/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => undefined);
    setDone(true);
  }

  return (
    <Container className="flex justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-primary">Reset password</h1>
        {done ? (
          <p className="mt-4 text-sm text-muted">
            If an account exists for {email}, a reset link is on its way. Check your
            inbox.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">
              Send reset link
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
