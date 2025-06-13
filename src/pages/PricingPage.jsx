import withPageLoader from "@/components/hoc/withPageLoader";
import { Button } from "@/components/ui/button";
import { fetchPlans } from "@/services/api";
import { motion } from "framer-motion";
import { CheckCircle, Star, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/* ---------- Icon helpers (tie plan.id → icon) ---------- */
const planIcons = {
  founder: <Zap />,
  scaleup: <Star />,
  enterprise: <Users />
};
const getIcon = (id) => planIcons[id] ?? <Star />;

/* ---------- Tier card ------------ */
const PricingTierCard = ({ tier, delay = 0 }) => (
  <motion.div
    className={`flex flex-col p-8 rounded-xl shadow-xl border ${
      tier.isPopular ? "border-primary bg-primary/5" : "border-border bg-card"
    } relative overflow-hidden`}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: delay * 0.15 }}
    viewport={{ once: true }}
  >
    {tier.isPopular && (
      <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-xs font-semibold rounded-bl-lg shadow-md">
        POPULAR
      </div>
    )}
    <div className="mb-6 text-center">
      <div
        className={`inline-block p-3 mb-3 rounded-lg ${
          tier.isPopular ? "bg-primary/15 text-primary" : "bg-secondary/15 text-secondary"
        }`}
      >
        {getIcon(tier.id)}
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-1">{tier.name}</h3>
      <p className="text-muted-foreground text-sm">{tier.description}</p>
    </div>

    <div className="mb-8 text-center">
      <span className="text-4xl font-extrabold text-foreground">
        {tier.price === 0 ? "Free" : tier.price == null ? "Custom" : `$${tier.price}`}
      </span>
      {tier.price > 0 && <span className="text-muted-foreground">/month</span>}
    </div>

    <ul className="space-y-3 mb-10 flex-grow">
      {(tier.features ?? []).map((feat, idx) => (
        <li key={idx} className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
          <span className="text-muted-foreground text-sm">{feat}</span>
        </li>
      ))}
    </ul>

    <Button
      size="lg"
      className={`w-full ${
        tier.isPopular ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
      }`}
      asChild
    >
      <Link to="/signup">{tier.cta ?? "Get Started"}</Link>
    </Button>
  </motion.div>
);

/* ---------- Main page ------------ */
const PricingPage = () => {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Fetch plans once on mount */
  useEffect(() => {
    const load = async () => {
      try {
        const plans = await fetchPlans(); // [{id,name,price,description,features,is_popular,cta}, ...]
        setTiers(
          plans.map((p) => ({
            ...p,
            isPopular: p.is_popular ?? p.id === "scaleup" // fallback
          }))
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return null; // Page-loader HOC will show spinner

  return (
    <div className="py-16 md:py-24 bg-gradient-to-b from-background via-background to-card/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Find the <span className="text-gradient-purple-blue">Perfect Plan</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Choose the Zer0Mind plan that best fits your venture&apos;s needs and budget.
            No hidden fees, cancel anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, idx) => (
            <PricingTierCard key={tier.id} tier={tier} delay={idx} />
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground">
            Need something different?{" "}
            <Link to="/contact" className="text-primary hover:underline">
              Contact us
            </Link>{" "}
            for custom solutions.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default withPageLoader(PricingPage);
