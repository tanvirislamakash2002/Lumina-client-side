import { HeroSection } from "@/components/modules/public/home/HeroSection/HeroSection";
import { FeaturesSection } from "@/components/modules/public/home/FeaturesSection/FeaturesSection";
import { RolesSection } from "@/components/modules/public/home/RolesSection/RolesSection";
import { HowItWorks } from "@/components/modules/public/home/HowItWorks/HowItWorks";
import { StatsSection } from "@/components/modules/public/home/StatsSection/StatsSection";
import { CTASection } from "@/components/modules/public/home/CTASection/CTASection";

export default async function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <RolesSection />
      <HowItWorks />
      <StatsSection/>
      <CTASection />
    </main>
  );
}