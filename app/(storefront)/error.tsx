"use client";

export default function StorefrontError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-3xl text-primary">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        We hit a snag loading this page. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm text-bg hover:bg-primary-hover"
      >
        Try again
      </button>
    </main>
  );
}
