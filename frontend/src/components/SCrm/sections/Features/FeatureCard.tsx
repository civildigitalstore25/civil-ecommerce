import { useAdminTheme } from "../../../../contexts/AdminThemeContext";

interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
}

export default function FeatureCard({ image, title, description }: FeatureCardProps) {
  const { colors } = useAdminTheme();

  return (
    <div 
      className="flex flex-col items-start justify-center w-full bg-slate-900/60 backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group"
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.interactive.primary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
      }}
    >
      <div 
        className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
        style={{
          backgroundColor: `${colors.interactive.primary}20`,
        }}
      >
        <img src={image} alt={title} className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white transition-colors">{title}</h3>
      <p className="text-sm text-white/60 text-start leading-relaxed">{description}</p>
    </div>
  );
}

