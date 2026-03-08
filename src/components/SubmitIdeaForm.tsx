import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

const categories = ["FinTech", "HealthTech", "EdTech", "Climate", "SaaS", "Social Impact"];

interface SubmitIdeaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const SubmitIdeaForm = ({ open, onOpenChange, onSuccess }: SubmitIdeaFormProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    founder_name: "",
    email: "",
    title: "",
    description: "",
    category: "",
    link: "",
  });

  const handleSubmit = async () => {
    if (!form.founder_name || !form.email || !form.title || !form.description || !form.category) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (form.description.length > 150) {
      toast.error("Description must be 150 characters or fewer.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("ideas").insert({
        founder_name: form.founder_name,
        email: form.email,
        title: form.title,
        description: form.description,
        category: form.category,
        link: form.link || null,
      });

      if (error) throw error;
      setSubmitted(true);
      onSuccess();
    } catch (e: any) {
      toast.error("Something went wrong. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (val: boolean) => {
    if (!val) {
      setSubmitted(false);
      setForm({ founder_name: "", email: "", title: "", description: "", category: "", link: "" });
    }
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-primary" />
            <DialogTitle className="text-2xl">Your idea is live!</DialogTitle>
            <p className="text-muted-foreground">Share it and get backed.</p>
            <Button variant="hero" onClick={() => handleClose(false)}>Done</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Submit Your Idea</DialogTitle>
              <DialogDescription>Share your startup idea and get funded by the community.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input id="name" placeholder="Jane Doe" value={form.founder_name} onChange={(e) => setForm({ ...form, founder_name: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" placeholder="jane@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Idea Title *</Label>
                <Input id="title" placeholder="My Awesome Startup" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Short Description * ({form.description.length}/150)</Label>
                <Textarea
                  id="desc"
                  placeholder="Describe your idea in 150 characters or less..."
                  maxLength={150}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="link">Pitch Deck / Website (optional)</Label>
                <Input id="link" type="url" placeholder="https://..." value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
              </div>
            </div>

            <Button variant="hero" className="h-12 w-full" disabled={loading} onClick={handleSubmit}>
              {loading ? "Submitting..." : "Submit Your Idea"}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SubmitIdeaForm;
