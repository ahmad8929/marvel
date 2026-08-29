import { Container } from "@/components/ui";

const VALUES = [
  {
    label: "Premium Quality",
    icon: (
      <path d="M12 3l2.2 4.5 5 .7-3.6 3.5.8 4.9L12 14.8 7.6 16.6l.8-4.9L4.8 8.2l5-.7L12 3z" />
    ),
  },
  {
    label: "Trendy Designs",
    icon: <path d="M9 3h6l-1 3 4 4-3 3v8H7v-8L4 10l4-4-1-3z" />,
  },
  {
    label: "Affordable Prices",
    icon: <path d="M20 12l-8 8-9-9V3h8l9 9z M7.5 7.5h.01" />,
  },
  {
    label: "Secure Shopping",
    icon: <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />,
  },
  {
    label: "Fast Delivery",
    icon: <path d="M3 7h11v9H3V7z M14 10h4l3 3v3h-7v-6z M6.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M17.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />,
  },
];

export function ValueStrip() {
  return (
    <section className="border-y border-line bg-surface/60">
      <Container className="grid grid-cols-2 gap-6 py-8 sm:grid-cols-3 lg:grid-cols-5">
        {VALUES.map((v) => (
          <div key={v.label} className="flex flex-col items-center gap-2 text-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7 text-gold"
            >
              {v.icon}
            </svg>
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-ink/80">
              {v.label}
            </span>
          </div>
        ))}
      </Container>
    </section>
  );
}
