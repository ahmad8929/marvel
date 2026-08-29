import type { Metadata } from "next";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Size Guide",
  description: "Measurements for kurtis, dresses and co-ord sets at Marvel's Online Clothings.",
};

const ROWS = [
  { size: "S", bust: "34", waist: "28", hip: "38" },
  { size: "M", bust: "36", waist: "30", hip: "40" },
  { size: "L", bust: "38", waist: "32", hip: "42" },
  { size: "XL", bust: "40", waist: "34", hip: "44" },
];

export default function SizeGuidePage() {
  return (
    <Container className="py-14">
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-3xl text-primary">Size guide</h1>
        <p className="mt-3 text-sm text-muted">
          All measurements are body measurements in inches. If you&apos;re between
          sizes, we recommend sizing up for a relaxed fit.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="py-2 pr-4">Size</th>
                <th className="py-2 pr-4">Bust</th>
                <th className="py-2 pr-4">Waist</th>
                <th className="py-2">Hip</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.size} className="border-b border-line">
                  <td className="py-2 pr-4 font-medium">{r.size}</td>
                  <td className="py-2 pr-4">{`${r.bust}"`}</td>
                  <td className="py-2 pr-4">{`${r.waist}"`}</td>
                  <td className="py-2">{`${r.hip}"`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-xs text-muted">
          Fit notes vary by style — check the product page for details.
        </p>
      </div>
    </Container>
  );
}
