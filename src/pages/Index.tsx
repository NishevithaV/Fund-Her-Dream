import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import IdeasGrid from "@/components/IdeasGrid";
import SubmitIdeaForm from "@/components/SubmitIdeaForm";
import Footer from "@/components/Footer";

const Index = () => {
  const [submitOpen, setSubmitOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const scrollToIdeas = () => {
    document.getElementById("ideas")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        onSubmitClick={() => setSubmitOpen(true)}
        onBrowseClick={scrollToIdeas}
      />
      <HowItWorks />
      <IdeasGrid refreshKey={refreshKey} />
      <Footer onSubmitClick={() => setSubmitOpen(true)} />

      <SubmitIdeaForm
        open={submitOpen}
        onOpenChange={setSubmitOpen}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
};

export default Index;
