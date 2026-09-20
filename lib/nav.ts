/**
 * Curated category + facet navigation. Powers the MENU drawer and the SEO
 * link footer. `tag` values line up with product tags in the catalog so the
 * links actually filter to results.
 */
export type NavLink = { label: string; href: string };
export type NavGroup = { title: string; slug: string; links: NavLink[] };

// Kept for when kurti/dress products are added (tags below must then exist on products).
export const KURTI_TAG_LINKS: NavLink[] = [
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

export const DRESS_TAG_LINKS: NavLink[] = [
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
  ["Sharara Sets", "sharara"],
  ["Palazzo Sets", "palazzo"],
  ["Bell-Sleeve Sets", "bell-sleeve"],
  ["Embroidered Sets", "embroidered"],
  ["Festive Sets", "festive"],
  ["Party Wear", "party"],
  ["Summer Sets", "summer"],
].map(([label, tag]) => ({ label, href: `/collections/co-ord-sets?tag=${tag}` }));

export const NAV_GROUPS: NavGroup[] = [
  { title: "Kurtis", slug: "kurtis", links: [] },
  { title: "Dresses", slug: "dresses", links: [] },
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


/**
 * Footer facets. Every tag here is carried by at least 3 live products, and the
 * links go to the all-products page so they always show results.
 * Re-check counts if products are removed.
 */
const facet = (tag: string) => `/collections/the-collection?tag=${tag}`;
export type FacetGroup = { title: string; links: NavLink[] };
export const FACET_GROUPS: FacetGroup[] = [
  {
    title: "Shop by Style",
    links: [
      ["Sharara Sets", "sharara"],
      ["Palazzo Sets", "palazzo"],
      ["Bell-Sleeve Sets", "bell-sleeve"],
      ["Embroidered Sets", "embroidered"],
      ["Gold Work", "gold-work"],
      ["Silver Work", "silver-work"],
      ["Sets with Dupatta", "dupatta"],
    ].map(([label, tag]) => ({ label, href: facet(tag) })),
  },
  {
    title: "Shop by Occasion",
    links: [
      ["Festive", "festive"],
      ["Party Wear", "party"],
      ["Wedding Guest", "wedding-guest"],
      ["Sangeet", "sangeet"],
      ["Haldi", "haldi"],
      ["Mehendi", "mehendi"],
      ["Eid", "eid"],
      ["Diwali", "diwali"],
      ["Summer", "summer"],
    ].map(([label, tag]) => ({ label, href: facet(tag) })),
  },
  {
    title: "Shop by Category",
    links: [
      { label: "Kurtis", href: "/collections/kurtis" },
      { label: "Dresses", href: "/collections/dresses" },
      { label: "Co-ord Sets", href: "/collections/co-ord-sets" },
      { label: "Sharara Sets", href: "/collections/sharara-sets" },
      { label: "Palazzo Sets", href: "/collections/palazzo-sets" },
      { label: "The Collection", href: "/collections/the-collection" },
    ],
  },
];

/** Curated menu collections. Each tag is on 5-8 live products (see marvels-api/scripts/curate-menu-tags.mjs). */
export const NEW_IN_HREF = "/collections/the-collection?tag=new-in&sort=newest";
export const MENU_EXTRAS: NavLink[] = [
  { label: "Sharara Edit", href: "/collections/the-collection?tag=edit-sharara" },
  { label: "Palazzo Edit", href: "/collections/the-collection?tag=edit-palazzo" },
  { label: "Festive Edit", href: "/collections/the-collection?tag=edit-festive" },
  { label: "Party Edit", href: "/collections/the-collection?tag=edit-party" },
  { label: "Wedding Guest", href: "/collections/the-collection?tag=wedding-guest" },
];
