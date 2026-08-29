import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-script text-3xl text-primary-hover">Oops</p>
      <h1 className="mt-2 font-display text-4xl text-primary">Page not found</h1>
      <p className="mt-3 max-w-sm text-sm text-muted">
        The page you&apos;re looking for has moved or never existed.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm text-bg hover:bg-primary-hover"
      >
        Back to home
      </Link>
    </main>
  );
}
