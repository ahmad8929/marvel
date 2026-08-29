import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { apiGet, ApiError } from "@/lib/api";
import { Container } from "@/components/ui";

type Page = { slug: string; title: string; bodyMarkdown: string; updatedAt: string };

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const page = await apiGet<Page>(`/content/pages/${slug}`, { tags: ["pages"] });
    return { title: page.title, alternates: { canonical: `/pages/${slug}` } };
  } catch {
    return { title: "Page" };
  }
}

/** Very small markdown: paragraphs + **bold** + [links](url). */
function render(md: string) {
  return md
    .split(/\n{2,}/)
    .map((para, i) => {
      const html = para
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(
          /\[(.+?)\]\((.+?)\)/g,
          '<a class="text-primary underline" href="$2">$1</a>',
        )
        .replace(/\n/g, "<br/>");
      return <p key={i} dangerouslySetInnerHTML={{ __html: html }} />;
    });
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let page: Page;
  try {
    page = await apiGet<Page>(`/content/pages/${slug}`, { tags: ["pages"] });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <Container className="py-14">
      <article className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl text-primary">{page.title}</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink">
          {render(page.bodyMarkdown)}
        </div>
      </article>
    </Container>
  );
}
