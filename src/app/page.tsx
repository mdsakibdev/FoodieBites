import { Suspense } from "react";
import { AppDownload } from "@/components/home/app-download";
import { Chefs } from "@/components/home/chefs";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { MenuPack } from "@/components/home/menu-pack";
import { PopularDishes } from "@/components/home/popular-dishes";
import { Reservation } from "@/components/home/reservation";
import { Services } from "@/components/home/services";
import { Testimonials } from "@/components/home/testimonials";
import { ProductGridSkeleton } from "@/components/ui/skeletons";
import { getProducts } from "@/lib/products";

async function ProductSections() {
  const products = await getProducts();
  const featured = products.filter((product) => product.featured).slice(0, 6);

  return (
    <>
      <PopularDishes products={featured} />
      <MenuPack products={products} />
    </>
  );
}

function ProductSectionsFallback() {
  return (
    <section className="container-page py-16">
      <div className="skeleton h-9 w-56" />
      <div className="mt-8">
        <ProductGridSkeleton count={4} />
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Suspense fallback={<ProductSectionsFallback />}>
        <ProductSections />
      </Suspense>
      <Services />
      <Reservation />
      <Testimonials />
      <Chefs />
      <AppDownload />
    </>
  );
}
