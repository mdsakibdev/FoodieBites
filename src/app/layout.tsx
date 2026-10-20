import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FoodieBites — Fresh food, delivered fast",
    template: "%s | FoodieBites",
  },
  description:
    "FoodieBites serves fresh, chef-crafted meals for delivery and pickup. Browse the menu, reserve a table and order your favourites in minutes.",
  keywords: ["restaurant", "food delivery", "menu", "FoodieBites", "order online"],
  openGraph: {
    title: "FoodieBites — Fresh food, delivered fast",
    description: "Chef-crafted meals, delivered hot to your door.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="foodiebites"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-base-200 font-sans text-base-content">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
