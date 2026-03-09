import { useState } from "react";
import Navbar from "@/components/Navbar";
import IdeasGrid from "@/components/IdeasGrid";
import SubmitIdeaForm from "@/components/SubmitIdeaForm";
import Footer from "@/components/Footer";

const IdeasPage = () => {
  const [submitOpen, setSubmitOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSubmitClick={() => setSubmitOpen(true)} />

      <div className="pt-16">
        <div className="container mx-auto px-4 pt-12 pb-4">
          <h1 className="text-4xl font-black tracking-tight md:text-5xl text-center">
            All <span className="text-gradient">Ideas</span>
          </h1>
          <p className="mt-3 text-center text-muted-foreground">
            Every idea here is a woman daring to build something new.
          </p>
        </div>

        <IdeasGrid refreshKey={refreshKey} />
      </div>

      <Footer onSubmitClick={() => setSubmitOpen(true)} />

      <SubmitIdeaForm
        open={submitOpen}
        onOpenChange={setSubmitOpen}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
};

export default IdeasPage;
