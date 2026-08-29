"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({
  images,
  title,
}: {
  images: ProductImage[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      <div className="flex gap-2 md:flex-col">
        {images.slice(0, 6).map((im, i) => (
          <button
            key={im.url}
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            className={`relative h-16 w-14 shrink-0 overflow-hidden rounded-md border ${
              i === active ? "border-primary" : "border-line"
            }`}
          >
            <Image src={im.url} alt="" fill sizes="56px" className="object-cover" />
          </button>
        ))}
      </div>
      <div className="relative aspect-[3/4] flex-1 overflow-hidden rounded-2xl bg-blush/40">
        {current?.isVideo ? (
          <video src={current.url} controls className="h-full w-full object-cover" />
        ) : (
          current && (
            <Image
              src={current.url}
              alt={current.alt ?? title}
              fill
              priority
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover"
            />
          )
        )}
      </div>
    </div>
  );
}
