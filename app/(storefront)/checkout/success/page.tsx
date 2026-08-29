import Link from "next/link";
import { Check } from "lucide-react";
import { Container, ButtonLink } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <Container className="py-20 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary text-bg">
        <Check className="h-8 w-8" />
      </div>
      <h1 className="mt-6 font-display text-3xl text-primary">Thank you for your order</h1>
      {order && (
        <p className="mt-2 text-muted">
          Your order number is <span className="font-medium text-ink">{order}</span>. A
          confirmation email is on its way.
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/account/orders">View my orders</ButtonLink>
        <ButtonLink href="/collections/kurtis" variant="outline">
          Continue shopping
        </ButtonLink>
      </div>
      <p className="mt-6 text-sm text-muted">
        Questions?{" "}
        <Link href="/contact" className="text-primary underline">
          Contact us
        </Link>
        .
      </p>
    </Container>
  );
}
