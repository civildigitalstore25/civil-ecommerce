import { useAdminTheme } from "../../../../contexts/AdminThemeContext";

interface FeatureCenterCardProps {
  image: string;
  title: string;
  description: string;
  badge?: string;
}

export default function FeatureCenterCard({ image, title, description, badge }: FeatureCenterCardProps) {
  const { colors } = useAdminTheme();

  return (
    <div className="flex flex-col items-start justify-center w-full bg-slate-900/60 backdrop-blur border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group">
      <div className="relative w-full aspect-video overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
      </div>
      <div className="p-6 w-full"> 
        {badge && (
          <div 
            className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold mb-3"
            style={{
              backgroundColor: `${colors.interactive.primary}20`,
              color: colors.interactive.primary,
            }}
          >
            <span>⭐</span>
            <span>{badge}</span>
          </div>
        )}
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white transition-colors">{title}</h3>
        <p className="text-sm text-white/60 text-start leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

