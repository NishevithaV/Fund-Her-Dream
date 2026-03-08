import { Lightbulb, Search, CreditCard } from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    title: "Submit Your Idea",
    description: "Women founders share their startup ideas with the community in seconds.",
  },
  {
    icon: Search,
    title: "Discover & Connect",
    description: "The community browses, discovers, and connects with ideas they believe in.",
  },
  {
    icon: CreditCard,
    title: "Back via Stripe",
    description: "Supporters fund their favourites with secure payments starting at $5.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
          How It Works
        </h2>
        <p className="mx-auto mb-16 max-w-lg text-center text-muted-foreground">
          Three simple steps to fund the next generation of women-led startups.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group flex flex-col items-center text-center animate-fade-up"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl gradient-hero text-primary-foreground shadow-hero transition-transform duration-300 group-hover:scale-110">
                <step.icon className="h-9 w-9" />
              </div>
              <div className="mb-2 text-sm font-bold text-primary">Step {i + 1}</div>
              <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
