import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import IdeaCard, { type Idea } from "@/components/IdeaCard";
import BackIdeaModal from "@/components/BackIdeaModal";

interface IdeasGridProps {
  refreshKey: number;
}

const IdeasGrid = ({ refreshKey }: IdeasGridProps) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchIdeas = async () => {
    const { data } = await supabase
      .from("ideas")
      .select("id, founder_name, title, description, category, amount_raised, backer_count")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (data) setIdeas(data);
  };

  useEffect(() => {
    fetchIdeas();
  }, [refreshKey]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("ideas-changes")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "ideas" }, (payload) => {
        setIdeas((prev) =>
          prev.map((idea) =>
            idea.id === payload.new.id
              ? { ...idea, amount_raised: payload.new.amount_raised, backer_count: payload.new.backer_count }
              : idea
          )
        );
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "ideas" }, () => {
        fetchIdeas();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <section id="ideas" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
          Ideas Worth Backing
        </h2>
        <p className="mx-auto mb-16 max-w-lg text-center text-muted-foreground">
          Discover innovative ideas from women founders and help bring them to life.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onBack={(idea) => { setSelectedIdea(idea); setModalOpen(true); }}
            />
          ))}
        </div>
      </div>

      <BackIdeaModal
        idea={selectedIdea}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={fetchIdeas}
      />
    </section>
  );
};

export default IdeasGrid;
