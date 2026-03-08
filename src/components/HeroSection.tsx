import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface HeroSectionProps {
  onSubmitClick: () => void;
  onBrowseClick: () => void;
}

const HeroSection = ({ onSubmitClick, onBrowseClick }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="mx-auto max-w-3xl animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Heart className="h-4 w-4 fill-primary" />
            International Women's Day 2026
          </div>

          <h1 className="mb-6 text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Back a <span className="text-gradient">Woman-Led</span> Idea Today
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            A micro-crowdfunding platform celebrating International Women's Day.
            Support women founders with contributions starting at just $5 and help turn bold ideas into reality.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="hero" size="lg" className="h-14 px-10 text-lg" onClick={onSubmitClick}>
              Submit Your Idea
            </Button>
            <Button variant="hero-outline" size="lg" className="h-14 px-10 text-lg" onClick={onBrowseClick}>
              Browse Ideas
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
