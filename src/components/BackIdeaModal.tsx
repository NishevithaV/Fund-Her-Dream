import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import type { Idea } from "@/components/IdeaCard";
import { toast } from "sonner";

const amounts = [5, 10, 25, 50];

interface BackIdeaModalProps {
  idea: Idea | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const BackIdeaModal = ({ idea, open, onOpenChange, onSuccess }: BackIdeaModalProps) => {
  const [selected, setSelected] = useState<number | null>(10);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const isCustom = selected === null;

  const finalAmount = isCustom ? parseInt(custom) || 0 : selected!;

  const handleBack = async () => {
    if (!idea || finalAmount < 1) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { ideaId: idea.id, amount: finalAmount, ideaTitle: idea.title },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
        onOpenChange(false);
        onSuccess();
      }
    } catch (e: any) {
      toast.error("Payment failed. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!idea) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Back "{idea.title}"</DialogTitle>
          <DialogDescription>
            Choose an amount to support {idea.founder_name}'s idea.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-4">
          {amounts.map((amt) => (
            <Button
              key={amt}
              variant={selected === amt ? "hero" : "outline"}
              className="h-14 text-lg font-bold"
              onClick={() => { setSelected(amt); setCustom(""); }}
            >
              ${amt}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={isCustom ? "hero" : "outline"}
            className="shrink-0"
            onClick={() => setSelected(null)}
          >
            Custom
          </Button>
          {isCustom && (
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                type="number"
                min={1}
                placeholder="Enter amount"
                className="pl-7"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                autoFocus
              />
            </div>
          )}
        </div>

        <Button
          variant="hero"
          className="mt-4 h-12 w-full text-base"
          disabled={finalAmount < 1 || loading}
          onClick={handleBack}
        >
          {loading ? "Processing..." : `Contribute $${finalAmount}`}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default BackIdeaModal;
