import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import IdeaCard, { type Idea } from "@/components/IdeaCard";
import BackIdeaModal from "@/components/BackIdeaModal";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const PREVIEW_COUNT = 6;

interface IdeasGridProps {
  refreshKey?: number;
  preview?: boolean;
}

const IdeasGrid = ({ refreshKey = 0, preview = false }: IdeasGridProps) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchIdeas = async () => {
    const { data } = await supabase
      .from("ideas")
      .select("id, founder_name, title, description, category, amount_raised, backer_count, ai_pitch, ai_tags")
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

  const displayedIdeas = preview ? ideas.slice(0, PREVIEW_COUNT) : ideas;
  const hasMore = preview && ideas.length > PREVIEW_COUNT;

  return (
    <section id="ideas" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
          Ideas Worth Backing
        </h2>
        <p className="mx-auto mb-16 max-w-lg text-center text-muted-foreground">
          Discover innovative ideas from women founders and help bring them to life.
        </p>

        {displayedIdeas.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No ideas yet — be the first to submit!</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onBack={(idea) => { setSelectedIdea(idea); setModalOpen(true); }}
              />
            ))}
          </div>
        )}

        {(preview || hasMore) && (
          <div className="mt-12 flex justify-center">
            <Button
              variant="hero-outline"
              size="lg"
              className="gap-2"
              onClick={() => navigate("/ideas")}
            >
              View All Ideas
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
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
