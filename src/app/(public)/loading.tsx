import { HeroSectionSkeleton } from "@/components/modules/public/home/HeroSection/HeroSectionSkeleton";
import { FeaturesSectionSkeleton } from "@/components/modules/public/home/FeaturesSection/FeaturesSectionSkeleton";
import { RolesSectionSkeleton } from "@/components/modules/public/home/RolesSection/RolesSectionSkeleton";
import { HowItWorksSkeleton } from "@/components/modules/public/home/HowItWorks/HowItWorksSkeleton";
import { StatsSectionSkeleton } from "@/components/modules/public/home/StatsSection/StatsSectionSkeleton";
import { CTASectionSkeleton } from "@/components/modules/public/home/CTASection/CTASectionSkeleton";

export default function LandingLoading() {
    return (
        <main className="min-h-screen">
            <HeroSectionSkeleton />
            <FeaturesSectionSkeleton />
            <RolesSectionSkeleton />
            <HowItWorksSkeleton />
            <StatsSectionSkeleton />
            <CTASectionSkeleton />
        </main>
    );
}