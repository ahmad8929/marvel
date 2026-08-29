"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Accordion({
  items,
}: {
  items: { title: string; content: React.ReactNode }[];
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => (
        <div key={item.title}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between py-4 text-left text-sm font-medium"
          >
            {item.title}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <div className="pb-4 text-sm leading-relaxed text-muted">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}
