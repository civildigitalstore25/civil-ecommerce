import { useAdminTheme } from "../../../../contexts/AdminThemeContext";
import { 
  ChartBarIcon, 
  ChatBubbleBottomCenterTextIcon, 
  RocketLaunchIcon 
} from "@heroicons/react/24/outline";

interface StepCardProps {
  stepNumber: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
}

const StepCard = ({ stepNumber, icon, title, description, imageUrl, imageAlt }: StepCardProps) => {
  const { colors } = useAdminTheme();

  return (
    <div className="flex flex-col bg-slate-900/60 backdrop-blur border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group h-full">
      {/* Icon */}
      <div className="flex justify-center pt-8 pb-2">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: `${colors.interactive.primary}20`,
          }}
        >
          <div style={{ color: colors.interactive.primary }} className="w-8 h-8">
            {icon}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-4 flex-1 flex flex-col">
        <div className="text-center mb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-3">
            STEP {stepNumber}
          </p>
          <h3 className="text-xl font-black text-white mb-4">{title}</h3>
          <p className="text-sm text-white/70 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Image/Visual */}
      {imageUrl && (
        <div className="relative w-full mt-auto bg-slate-950/80 overflow-hidden rounded-b-2xl">
          <div className="aspect-[4/3] bg-gradient-to-br from-slate-900 to-slate-950">
            <img 
              src={imageUrl} 
              alt={imageAlt || title}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const JourneySteps = () => {
  const { colors } = useAdminTheme();

  const steps = [
    {
      stepNumber: 1,
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: "Secure Your Access",
      description: "Choose your plan and get instant access. We'll immediately send your login details, tutorials, and bonuses to your email and WhatsApp.",
    },
    {
      stepNumber: 2,
      icon: <ChatBubbleBottomCenterTextIcon className="w-8 h-8" />,
      title: "Configure & Automate",
      description: "Activate your dashboard in minutes. Set up automated follow-ups, chatbots, and pipelines to handle your leads 24/7.",
    },
    {
      stepNumber: 3,
      icon: <RocketLaunchIcon className="w-8 h-8" />,
      title: "Scale & Convert",
      description: "Engage your audience with our powerful tools, track your performance with analytics, and close more deals effortlessly.",
    }
  ];

  return (
    <section className="border-b border-white/10 bg-slate-950/95 py-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black leading-tight text-white mb-2">
            Your Journey to{" "}
            <span style={{ color: colors.interactive.primary }}>
              Automated Sales
            </span>{" "}
            in 3 Simple Steps
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <StepCard
              key={step.stepNumber}
              stepNumber={step.stepNumber}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default JourneySteps;

