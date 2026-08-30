import { inr } from "@/lib/format";
import type { CartQuote } from "@/lib/types";

/** Shared server-authoritative price breakdown, used on cart + checkout. */
export function PriceBreakdown({
  quote,
  showCod = false,
}: {
  quote: CartQuote;
  showCod?: boolean;
}) {
  return (
    <dl className="space-y-2 text-sm">
      <Row label="Subtotal" value={inr(quote.subtotal)} />
      {quote.discount > 0 && (
        <Row label="Discount" value={`-${inr(quote.discount)}`} accent />
      )}
      <Row
        label={quote.labels.shipping}
        value={quote.shippingFee === 0 ? "Free" : inr(quote.shippingFee)}
      />
      {quote.platformFee > 0 && (
        <Row label={quote.labels.platformFee} value={inr(quote.platformFee)} />
      )}
      {quote.handlingFee > 0 && (
        <Row label={quote.labels.handlingFee} value={inr(quote.handlingFee)} />
      )}
      {showCod && quote.codFee > 0 && (
        <Row label={quote.labels.cod} value={inr(quote.codFee)} />
      )}
      <div className="flex justify-between border-t border-line pt-3 text-base font-medium text-ink">
        <dt>Total</dt>
        <dd>{inr(quote.total)}</dd>
      </div>
      {quote.taxNote && (
        <p className="pt-1 text-xs text-muted">{quote.taxNote}</p>
      )}
    </dl>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`flex justify-between ${accent ? "text-primary" : ""}`}>
      <dt className={accent ? "" : "text-muted"}>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
