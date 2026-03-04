import EditorsPicks from "../components/HomePage/EditorsPicks";
import GamesAchivement from "../components/HomePage/GamesAchivement";
import HeroSection from "../components/HomePage/HeroSection";
import ProductSlider from "../components/HomePage/ProductSlider";
import PromotionalSection from "../components/HomePage/PromotionalSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProductSlider />
      <PromotionalSection />
      <EditorsPicks />
      <GamesAchivement />
    </>
  );
}
