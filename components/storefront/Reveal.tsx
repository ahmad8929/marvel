/**
 * Formerly faded content in on scroll. Content now renders immediately (no hidden
 * first state); kept as a passthrough so existing call sites don't change.
 */
export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  /** kept for compatibility; ignored */
  delay?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
