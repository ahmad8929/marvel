"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Password field with a show/hide toggle. Drop-in replacement for
 * `<Input type="password" />` — every other prop (id, required, minLength,
 * value, onChange…) passes straight through to the underlying input.
 */
export const PasswordInput = forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">
>(({ className, ...props }, ref) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        ref={ref}
        type={show ? "text" : "password"}
        className={cn(
          "h-11 w-full rounded-sm border border-line bg-surface pl-3.5 pr-11 text-sm text-ink placeholder:text-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
          className,
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted transition-colors hover:text-ink"
      >
        {show ? (
          <EyeOff className="h-[18px] w-[18px]" />
        ) : (
          <Eye className="h-[18px] w-[18px]" />
        )}
      </button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";
