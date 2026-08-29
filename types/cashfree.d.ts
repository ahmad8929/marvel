declare module "@cashfreepayments/cashfree-js" {
  export type CashfreeMode = "sandbox" | "production";
  export interface CashfreeCheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: "_self" | "_blank" | "_top" | "_modal";
    returnUrl?: string;
  }
  export interface Cashfree {
    checkout(options: CashfreeCheckoutOptions): Promise<{
      error?: { message: string };
      redirect?: boolean;
      paymentDetails?: Record<string, unknown>;
    }>;
  }
  export function load(options: { mode: CashfreeMode }): Promise<Cashfree>;
}
