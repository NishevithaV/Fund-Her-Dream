import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onSubmitClick?: () => void;
}

const Navbar = ({ onSubmitClick }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${id}`);
    }
  };

  const handleSubmit = () => {
    setMenuOpen(false);
    if (isHome && onSubmitClick) {
      onSubmitClick();
    } else {
      navigate("/");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 font-black text-lg text-foreground">
          <Heart className="h-5 w-5 fill-primary text-primary" />
          Fund Her Dream
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollTo("how-it-works")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            How It Works
          </button>
          <Link
            to="/ideas"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Browse Ideas
          </Link>
          <Button variant="hero" size="sm" onClick={handleSubmit}>
            Submit Your Idea
          </Button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 px-4 py-4 flex flex-col gap-4">
          <button
            onClick={() => scrollTo("how-it-works")}
            className="text-left text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            How It Works
          </button>
          <Link
            to="/ideas"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Browse Ideas
          </Link>
          <Button variant="hero" size="sm" className="w-full" onClick={handleSubmit}>
            Submit Your Idea
          </Button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
