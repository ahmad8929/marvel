export type Colour = { name: string; hex: string | null };

export type ProductImage = {
  url: string;
  alt: string | null;
  isVideo?: boolean;
};

export type ProductCard = {
  id: string;
  title: string;
  slug: string;
  price: number;
  mrp: number;
  ratingAvg: number;
  ratingCount: number;
  tags: string[];
  category: { name: string; slug: string };
  images: ProductImage[];
  colours: Colour[];
  inStock: boolean;
  discountPercent: number;
};

export type Variant = {
  id: string;
  size: string;
  color: string;
  colorHex: string | null;
  sku: string;
  stock: number;
  priceOverride: number | null;
};

export type ProductDetail = {
  id: string;
  title: string;
  slug: string;
  description: string;
  fabric: string | null;
  care: string | null;
  price: number;
  mrp: number;
  discountPercent: number;
  ratingAvg: number;
  ratingCount: number;
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  category: { name: string; slug: string };
  images: ProductImage[];
  variants: Variant[];
  colours: Colour[];
  sizes: string[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
};

export type Paginated<T> = {
  data: T[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
};

export type HomeContent = {
  slides: {
    id: string;
    imageDesktop: string;
    imageMobile: string;
    headline: string | null;
    sub: string | null;
    ctaLabel: string | null;
    ctaHref: string | null;
  }[];
  testimonials: {
    id: string;
    author: string;
    location: string | null;
    quote: string;
    rating: number;
  }[];
  categories: Category[];
  newArrivals: (Omit<ProductCard, "colours" | "inStock" | "variants"> & {
    discountPercent: number;
  })[];
  announcementText: string;
  announcementHref: string | null;
};

export type PublicSettings = {
  announcementText: string;
  announcementHref: string | null;
  freeShipThreshold: number;
  flatShipFee: number;
  codEnabled: boolean;
  codFee: number;
  supportEmail: string;
  supportPhone: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  whatsappNumber: string | null;
  gstin: string | null;
  businessAddress: string;
  comingSoon: boolean;
};

export type Reviews = {
  reviews: {
    id: string;
    rating: number;
    title: string | null;
    body: string;
    createdAt: string;
    user: { name: string };
  }[];
  breakdown: { star: number; count: number }[];
  total: number;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "STAFF" | "ADMIN";
};
