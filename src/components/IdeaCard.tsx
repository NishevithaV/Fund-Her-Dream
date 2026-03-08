import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Sparkles } from "lucide-react";

export interface Idea {
  id: string;
  founder_name: string;
  title: string;
  description: string;
  category: string;
  amount_raised: number;
  backer_count: number;
  ai_pitch?: string | null;
  ai_tags?: string[] | null;
}

const categoryColors: Record<string, string> = {
  FinTech: "bg-primary/10 text-primary",
  HealthTech: "bg-emerald-100 text-emerald-700",
  EdTech: "bg-blue-100 text-blue-700",
  Climate: "bg-green-100 text-green-700",
  SaaS: "bg-violet-100 text-violet-700",
  "Social Impact": "bg-amber-100 text-amber-700",
};

interface IdeaCardProps {
  idea: Idea;
  onBack: (idea: Idea) => void;
}

const IdeaCard = ({ idea, onBack }: IdeaCardProps) => {
  const colorClass = categoryColors[idea.category] || "bg-muted text-muted-foreground";

  return (
    <Card className="group flex flex-col transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="mb-3 flex items-center justify-between">
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${colorClass}`}>
            {idea.category}
          </span>
        </div>
        <h3 className="text-lg font-bold leading-tight">{idea.title}</h3>
        <p className="text-sm text-muted-foreground">by {idea.founder_name}</p>
      </CardHeader>

      <CardContent className="flex-1 pb-4 space-y-3">
        {idea.ai_pitch && (
          <div className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/10 p-3">
            <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-sm font-medium text-foreground leading-snug">{idea.ai_pitch}</p>
          </div>
        )}
        <p className="text-sm text-muted-foreground leading-relaxed">{idea.description}</p>
        {idea.ai_tags && idea.ai_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {idea.ai_tags.map((tag) => (
              <span
                key={tag}
                className="inline-block rounded-full bg-accent/60 px-2.5 py-0.5 text-[11px] font-medium text-accent-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-4 border-t pt-4">
        <div className="flex w-full items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 font-semibold text-primary">
            <DollarSign className="h-4 w-4" />
            ${idea.amount_raised.toLocaleString()} raised
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-4 w-4" />
            {idea.backer_count} backers
          </div>
        </div>
        <Button
          variant="hero"
          className="w-full"
          onClick={() => onBack(idea)}
        >
          Back This Idea
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IdeaCard;
