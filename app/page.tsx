import UnifiedHero from "@/components/home/UnifiedHero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BestSellers from "@/components/home/BestSellers";
import TopBrands from "@/components/home/TopBrands";
import WhyTrustKaava from "@/components/home/WhyTrustKaava";
import HowItWorks from "@/components/home/HowItWorks";
import KnowYourAyurveda from "@/components/home/KnowYourAyurveda";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <UnifiedHero />
      <main>
        <FeaturedProducts />
        <BestSellers />
        <TopBrands />
        <WhyTrustKaava />
        <HowItWorks />
        <KnowYourAyurveda />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
