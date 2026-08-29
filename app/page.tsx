const VALUES = [
  "Premium Quality",
  "Trendy Designs",
  "Affordable Prices",
  "Secure Shopping",
  "Fast Delivery",
];

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <section className="w-full max-w-xl text-center">
        <div className="mx-auto flex flex-col items-center rounded-3xl border border-line bg-surface/70 px-8 py-14 shadow-[0_30px_80px_-40px_rgba(109,21,51,0.35)] backdrop-blur-sm sm:px-14">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-stacked.svg"
            alt="Marvel's Online Clothings"
            width={260}
            height={159}
            className="h-auto w-[240px]"
          />

          <span className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-bg">
            Launching Soon
          </span>

          <h1 className="mt-6 font-display text-3xl font-semibold leading-tight text-primary sm:text-4xl">
            Timeless style.
            <br />
            Made for you.
          </h1>

          <p className="mt-4 font-script text-2xl text-primary-hover">
            Style that defines you
          </p>

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            A new home for women&apos;s ethnic &amp; fusion wear — kurtis, dresses
            and co-ord sets. Elegant. Feminine. Effortless.
          </p>

          <ul className="mt-9 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[0.72rem] uppercase tracking-[0.16em] text-ink/70">
            {VALUES.map((value) => (
              <li key={value} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-gold" aria-hidden />
                {value}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-xs uppercase tracking-[0.24em] text-muted">
          www.marvelsonline.in
        </p>
      </section>
    </main>
  );
}
