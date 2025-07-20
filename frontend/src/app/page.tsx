"use client";
import EventSection from "./components/event_section";
import FAQSection from "./components/faq_session";
import FeaturesSection from "./components/feature_section";
import GallerySection from "./components/gallary_section";
import HeroSection from "./components/hero_section";
import Navigation from "./components/navigation";
import WorkflowSection from "./components/workflow_section";
const TickifyLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <Navigation />
      <HeroSection />
      <EventSection />
      <WorkflowSection />
      <FeaturesSection />
      <GallerySection />
      <FAQSection />
    </div>
  );
};

export default TickifyLanding;
