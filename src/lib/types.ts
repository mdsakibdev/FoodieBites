export type CategoryId =
  | "special-foods"
  | "italian"
  | "mexican"
  | "appetizers"
  | "lunch"
  | "drinks";

export interface Category {
  id: CategoryId;
  label: string;
}

export interface Product {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  image: string;
  category: CategoryId;
  rating: number;
  reviewCount: number;
  featured: boolean;
  prepTime: string;
  calories: number;
  ingredients: string[];
}

/** A line in the user's cart, stored in MongoDB. */
export interface CartLine {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartLine[];
  updatedAt: string;
}

export interface CartPayload {
  items: CartLine[];
  count: number;
  subtotal: number;
}

export interface Chef {
  name: string;
  role: string;
  image: string;
}

export interface Review {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  quote: string;
}

export interface NavLink {
  href: string;
  label: string;
}
