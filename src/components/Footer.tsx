import { Heart } from "lucide-react";

interface FooterProps {
  onSubmitClick: () => void;
}

const Footer = ({ onSubmitClick }: FooterProps) => {
  return (
    <footer className="border-t bg-secondary/30 py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1.5fr]">
          <div>
            <h3 className="mb-3 text-lg font-bold text-gradient">Fund Her Idea</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A micro-crowdfunding platform celebrating women founders and the bold ideas shaping our future.
              Every contribution - no matter how small - sends a powerful signal of belief.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={onSubmitClick} className="text-foreground hover:text-primary transition-colors">
                  Submit an Idea
                </button>
              </li>
              <li>
                <a href="#ideas" className="text-foreground hover:text-primary transition-colors">
                  Browse Ideas
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">About</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Fund Her Idea is a prototype built for International Women's Day 2026,
              celebrating women who dare to build. Back an idea and be part of the change.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            Built with <Heart className="h-3.5 w-3.5 fill-primary text-primary" /> for International Women's Day 2026 - SheBuilds by Claude, Lovable & Stripe
          </div>
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Nishevitha Venkatesh. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
