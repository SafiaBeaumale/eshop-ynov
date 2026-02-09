import { CategoriesSection } from "@/components/categories-section";
import { FeaturedProducts } from "@/components/featured-products";
import { Hero } from "@/components/hero";
import { PromoSection } from "@/components/promo-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <FeaturedProducts />
      <PromoSection />
    </>
  );
}
