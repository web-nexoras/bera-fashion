import { AboutHeroSection } from "./AboutHeroSection";
import {
  AboutCraftSection,
  AboutStatsSection,
  AboutTeamCtaSection,
  AboutValuesSection,
} from "./AboutSections";

export const dynamic = "force-static";

export default function AboutPage() {
  return (
    <>
      <AboutHeroSection />
      <AboutStatsSection />
      <AboutValuesSection />
      <AboutCraftSection />
      <AboutTeamCtaSection />
    </>
  );
}
