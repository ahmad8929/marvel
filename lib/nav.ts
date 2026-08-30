/**
 * Curated category + facet navigation. Powers the MENU drawer and the SEO
 * link footer. `tag` values line up with product tags in the catalog so the
 * links actually filter to results.
 */
export type NavLink = { label: string; href: string };
export type NavGroup = { title: string; slug: string; links: NavLink[] };

const kurtis: NavLink[] = [
  ["Cotton Kurtis", "cotton"],
  ["Anarkali Kurtis", "anarkali"],
  ["A-Line Kurtis", "a-line"],
  ["Straight Kurtis", "basics"],
  ["Peplum Kurtis", "peplum"],
  ["Printed Kurtis", "printed"],
  ["Embroidered Kurtis", "embroidered"],
  ["Block Print Kurtis", "block-print"],
  ["Party Wear Kurtis", "party"],
  ["Workwear Kurtis", "workwear"],
  ["Festive Kurtis", "festive"],
  ["Summer Kurtis", "summer"],
].map(([label, tag]) => ({ label, href: `/collections/kurtis?tag=${tag}` }));

const dresses: NavLink[] = [
  ["Midi Dresses", "midi"],
  ["Maxi Dresses", "maxi"],
  ["Wrap Dresses", "wrap"],
  ["Shirt Dresses", "shirt-dress"],
  ["Fit & Flare Dresses", "fit-and-flare"],
  ["Slip Dresses", "slip"],
  ["Floral Dresses", "floral"],
  ["Utility Dresses", "utility"],
  ["Everyday Dresses", "everyday"],
  ["Party Dresses", "party"],
  ["Brunch Dresses", "brunch"],
  ["Satin Dresses", "satin"],
].map(([label, tag]) => ({ label, href: `/collections/dresses?tag=${tag}` }));

const coords: NavLink[] = [
  ["Kurta-Palazzo Sets", "co-ord"],
  ["Angrakha Co-ords", "angrakha"],
  ["Kaftan Co-ords", "kaftan"],
  ["Linen Co-ords", "linen"],
  ["Loungewear Sets", "loungewear"],
  ["Bandhani Co-ords", "bandhani"],
  ["Printed Co-ords", "printed"],
  ["Embroidered Co-ords", "embroidered"],
  ["Festive Co-ords", "festive"],
  ["Summer Co-ords", "summer"],
].map(([label, tag]) => ({ label, href: `/collections/co-ord-sets?tag=${tag}` }));

export const NAV_GROUPS: NavGroup[] = [
  { title: "Kurtis", slug: "kurtis", links: kurtis },
  { title: "Dresses", slug: "dresses", links: dresses },
  { title: "Co-ord Sets", slug: "co-ord-sets", links: coords },
];

export const SHOP_BY_COLOUR: NavLink[] = [
  "Maroon",
  "Blush Pink",
  "Ivory",
  "Olive",
  "Navy",
  "Mustard",
  "Teal",
  "Black",
].map((c) => ({
  label: `${c} Styles`,
  href: `/collections/kurtis?color=${encodeURIComponent(c)}`,
}));
