import { AIChatBot } from "../components/Extension/AIChatBot";
import CatalougeSection from "../components/HomePage/CatalougeSection";
import EditorsPicks from "../components/HomePage/EditorsPicks";
import GamesAchivement from "../components/HomePage/GamesAchivement";
import HeroSection from "../components/HomePage/HeroSection";
import ProductGridSections from "../components/HomePage/ProductGridSections";
import ProductSlider from "../components/HomePage/ProductSlider";
import PromotionalSection from "../components/HomePage/PromotionalSection";
import PromotionalSectionTwo from "../components/HomePage/PromotionalSectionTwo";
import RecentUploads from "../components/HomePage/RecentUploads";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProductSlider />
      <PromotionalSection />
      <EditorsPicks />
      <ProductGridSections />
      <GamesAchivement />
      <PromotionalSectionTwo />
      <RecentUploads />
      <CatalougeSection />
      <AIChatBot
        apiKey="AIzaSyD7ufhFGhs1XbzQWS3shGK2YBWsBQ1wLoA"
        position="bottom-right"
        welcomeMessage="Hello! I'm your gaming assistant. Ask me anything about our products, deals, or gaming recommendations!"
        suggestions={[
          "What are the best gaming mice?",
          "Show me mechanical keyboards",
          "Any ongoing discounts?",
          "Compare gaming monitors",
          "What's your return policy?",
          "Recommend a budget gaming headset",
        ]}
      />
    </>
  );
}
