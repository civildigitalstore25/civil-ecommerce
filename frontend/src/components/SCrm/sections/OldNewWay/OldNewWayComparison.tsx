import { useAdminTheme } from "../../../../contexts/AdminThemeContext";
import { 
  ChatBubbleLeftRightIcon, 
  DocumentTextIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  ChatBubbleBottomCenterTextIcon,
  RocketLaunchIcon,
  EnvelopeIcon,
  FunnelIcon
} from "@heroicons/react/24/outline";

interface ComparisonItemProps {
  icon: React.ReactNode;
  text: string;
}

const ComparisonItem = ({ icon, text }: ComparisonItemProps) => {
  return (
    <div className="flex items-start gap-3 bg-slate-900/60 rounded-xl p-4 border border-white/5">
      <div className="flex-shrink-0 mt-0.5 text-white">
        {icon}
      </div>
      <p className="text-white/90 text-sm leading-relaxed">{text}</p>
    </div>
  );
};

interface ComparisonCardProps {
  type: "old" | "new";
  title: string;
  subtitle: string;
  items: { icon: React.ReactNode; text: string }[];
}

const ComparisonCard = ({ type, title, subtitle, items }: ComparisonCardProps) => {
  const { colors } = useAdminTheme();
  const isOld = type === "old";

  return (
    <div 
      className={`flex flex-col items-center w-full rounded-2xl border-2 p-8 bg-slate-900/40 backdrop-blur`}
      style={{
        borderColor: isOld ? "rgba(239, 68, 68, 0.5)" : colors.interactive.primary + "80",
      }}
    >
      {/* Icon */}
      <div 
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-6`}
        style={{
          backgroundColor: isOld ? "rgba(239, 68, 68, 0.2)" : `${colors.interactive.primary}20`,
        }}
      >
        {isOld ? (
          <span className="text-4xl font-black text-red-500">✕</span>
        ) : (
          <span className="text-4xl font-black" style={{ color: colors.interactive.primary }}>✓</span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-2xl font-black text-white mb-2">{title}</h3>
      <p className="text-white/70 text-sm mb-8">{subtitle}</p>

      {/* Items */}
      <div className="w-full space-y-4">
        {items.map((item, index) => (
          <ComparisonItem key={index} icon={item.icon} text={item.text} />
        ))}
      </div>
    </div>
  );
};

const OldNewWayComparison = () => {
  const { colors } = useAdminTheme();

  const oldWayItems = [
    {
      icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />,
      text: "Send replies and follow-ups manually"
    },
    {
      icon: <DocumentTextIcon className="w-5 h-5" />,
      text: "Use spreadsheets or notes to track leads"
    },
    {
      icon: <ClockIcon className="w-5 h-5" />,
      text: "Spend hours switching tabs and tools"
    },
    {
      icon: <ExclamationTriangleIcon className="w-5 h-5" />,
      text: "Miss out on follow-ups or lose leads"
    }
  ];

  const newWayItems = [
    {
      icon: <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />,
      text: "Set up auto-replies and chatbot flows"
    },
    {
      icon: <RocketLaunchIcon className="w-5 h-5" />,
      text: "Visual lead tracking with Kanban CRM"
    },
    {
      icon: <EnvelopeIcon className="w-5 h-5" />,
      text: "Bulk message + schedule in one place"
    },
    {
      icon: <FunnelIcon className="w-5 h-5" />,
      text: "Smart follow-up funnels = no lead left behind"
    }
  ];

  return (
    <section className="border-b border-white/10 bg-slate-950/95 py-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl sm:text-5xl font-black leading-tight mb-3"
            style={{ color: "#ef4444" }}
          >
            Ditch the WhatsApp Chaos, Sell Smarter
          </h2>
          <h3 
            className="text-3xl sm:text-4xl font-black mb-6"
            style={{ color: colors.interactive.primary }}
          >
            with Super CRM
          </h3>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Save hours, capture every lead, and close more deals—all without the messy spreadsheets and missed messages.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ComparisonCard
            type="old"
            title="Old Way"
            subtitle="Manual WhatsApp Management"
            items={oldWayItems}
          />
          <ComparisonCard
            type="new"
            title="New Way"
            subtitle="Automated Selling with Super CRM"
            items={newWayItems}
          />
        </div>
      </div>
    </section>
  );
};

export default OldNewWayComparison;

