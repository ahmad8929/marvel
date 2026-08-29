import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  redirect("/pages/faq");
}
