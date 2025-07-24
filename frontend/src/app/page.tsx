"use client";
import EventSection from "./components/event_section";
import FAQSection from "./components/faq_session";
import FeaturesSection from "./components/feature_section";
import GallerySection from "./components/gallary_section";
import HeroSection from "./components/hero_section";
import Navigation from "./components/navigation";
import WorkflowSection from "./components/workflow_section";
import SEO from "./seo";
const TickifyLanding = () => {
  return (
    <>
      <SEO
        title="TickEasy: Your Event Our Responsibility"
        description="TickEasy is a platform that allows you to buy and sell tickets for events."
        url="https://event-grid-2-0.vercel.app"
      />

      <main>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
          <Navigation />
          <HeroSection />
          <EventSection />
          <WorkflowSection />
          <FeaturesSection />
          <GallerySection />
          <FAQSection />
        </div>
      </main>
    </>
  );
};

export default TickifyLanding;
