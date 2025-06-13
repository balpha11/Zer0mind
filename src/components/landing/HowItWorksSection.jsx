import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, MessageCircle, BarChart, Rocket } from 'lucide-react';

const StepCard = ({ icon, title, description, stepNumber, delay }) => (
  <motion.div
    className="flex flex-col items-center text-center p-4 sm:p-6 bg-card rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300 relative"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: delay * 0.15 }}
  >
    <div className="absolute -top-4 -left-2 sm:-top-5 sm:-left-3 bg-secondary text-secondary-foreground h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-base sm:text-lg font-bold shadow-md">
      {stepNumber}
    </div>
    <div className="p-3 sm:p-4 mb-3 sm:mb-4 rounded-full bg-primary/10 text-primary inline-block">
      {React.cloneElement(icon, { size: 24, className: 'sm:w-8 sm:h-8' })}
    </div>
    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">{title}</h3>
    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
);

const steps = [
  {
    icon: <Lightbulb />,
    title: "Share Your Goals",
    description: "Tell us about your business objectives and challenges. Our AI understands your unique needs.",
    stepNumber: "1"
  },
  {
    icon: <MessageCircle />,
    title: "Get AI Insights",
    description: "Receive personalized recommendations and actionable strategies based on data-driven analysis.",
    stepNumber: "2"
  },
  {
    icon: <BarChart />,
    title: "Implement & Track",
    description: "Put the strategies into action and monitor your progress with our analytics tools.",
    stepNumber: "3"
  },
  {
    icon: <Rocket />,
    title: "Scale & Grow",
    description: "Achieve sustainable growth as our AI continues to optimize your business strategies.",
    stepNumber: "4"
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="w-full py-16 sm:py-20 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            How Zer0Mind Works
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto px-4">
            Achieve your startup goals in four simple steps with our AI-powered guidance.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8 pt-6">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              stepNumber={step.stepNumber}
              delay={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
