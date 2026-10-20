import type { Chef, NavLink, Review } from "../lib/types";

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/#services", label: "About Us" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#contact", label: "Contacts" },
];

export const MARQUEE_ITEMS: string[] = [
  "Free delivery on orders over $30",
  "20% off your first order with code TASTE20",
  "Fresh ingredients, delivered daily",
  "Reserve a table and skip the queue",
  "Chef-crafted meals in under 30 minutes",
];

export const CHEFS: Chef[] = [
  { name: "Savannah Nguyen", role: "Head Chef", image: "/images/chef-1.jpg" },
  { name: "Esther Howard", role: "Sous Chef", image: "/images/chef-2.jpg" },
  { name: "Marvin McKinney", role: "Pastry Chef", image: "/images/chef-3.jpg" },
  { name: "Albert Flores", role: "Grill Master", image: "/images/chef-4.jpg" },
];

export const REVIEWS: Review[] = [
  {
    name: "Savannah Nguyen",
    role: "Food blogger",
    avatar: "/images/avatar-1.jpg",
    rating: 5,
    quote:
      "This place is great! The atmosphere is chill and cool, and the staff is really friendly. They know what they are doing and you can tell they love making customers happy.",
  },
  {
    name: "Cameron Wilson",
    role: "Regular guest",
    avatar: "/images/avatar-2.jpg",
    rating: 5,
    quote:
      "The flavours are honest and generous. Delivery arrived hot and on time, and the packaging kept everything looking as good as it tastes.",
  },
  {
    name: "Leslie Alexander",
    role: "Local foodie",
    avatar: "/images/avatar-3.jpg",
    rating: 4,
    quote:
      "Ordered for a family dinner and everyone found something they loved. The beef tacos and truffle fries disappeared first. Will order again.",
  },
];

export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: "Services",
    links: [
      { href: "/menu", label: "Online Order" },
      { href: "/#reservation", label: "Pre-Reservation" },
      { href: "/menu", label: "24/7 Service" },
      { href: "/#services", label: "Foodie Place" },
      { href: "/#chefs", label: "Super Chefs" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { href: "/menu", label: "Menu" },
      { href: "/#reviews", label: "Reviews" },
      { href: "/#reservation", label: "Reserve Table" },
      { href: "/cart", label: "Your Cart" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/#services", label: "About Us" },
      { href: "/#chefs", label: "Our Chefs" },
      { href: "/#contact", label: "Contact" },
      { href: "/menu", label: "Order Foods" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/#contact", label: "FAQs" },
      { href: "/#contact", label: "Support" },
      { href: "/#contact", label: "Privacy Policy" },
      { href: "/#contact", label: "Terms of Service" },
    ],
  },
];
