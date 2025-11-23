import { useAdminTheme } from "../../../../contexts/AdminThemeContext";
import { useState, useEffect } from "react";
import { CheckIcon, GiftIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface CountdownTimerProps {
  targetDate: Date;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-slate-900/80 rounded-lg px-4 py-3 min-w-[80px] text-center border border-white/10">
        <span className="text-2xl font-bold text-white">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs font-semibold text-white/70 mt-2 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex items-center justify-center gap-4">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
};

const LimitedTimeOffer = () => {
  const { colors } = useAdminTheme();
  
  // Set target date to 3 days from now (or customize as needed)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 3);
  targetDate.setHours(23, 59, 59, 999);

  const offerItems = [
    {
      icon: <CheckIcon className="w-5 h-5" />,
      title: "Super CRM Lifetime License",
      originalPrice: "₹9,999",
    },
    {
      icon: <GiftIcon className="w-5 h-5" />,
      title: "BONUS #1: WhatsApp Marketing Course",
      originalPrice: "₹10,000",
    },
    {
      icon: <GiftIcon className="w-5 h-5" />,
      title: "BONUS #2: 100+ Digital Marketing Tools & Templates",
      originalPrice: "₹30,000",
    },
  ];

  const totalValue = "₹49,999";
  const currentPrice = "₹4,999";

  return (
    <section className="border border-white/10 bg-slate-950/95 py-20">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-black leading-tight text-white mb-4">
            Here's Everything You're Getting Today...
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            This isn't just a tool; it's a complete system to supercharge your WhatsApp sales.
          </p>
        </div>

        {/* Offer Items List */}
        <div className="space-y-4 mb-8">
          {offerItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between "
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: `${colors.interactive.primary}20`,
                    color: colors.interactive.primary,
                  }}
                >
                  {item.icon}
                </div>
                <span className="text-white font-medium">{item.title}</span>
              </div>
              <span className="text-white/60 line-through text-lg">
                {item.originalPrice}
              </span>
            </div>
          ))}
        </div>

        {/* Total Value */}
        <div className="text-center mb-8">
          <p className="text-white/80 text-lg mb-2">Total Value:</p>
          <p className="text-3xl font-black text-white">{totalValue}</p>
        </div>

        {/* Limited Time Deal Box */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-900/80 rounded-2xl border-2 p-8 max-w-md w-full" style={{ borderColor: colors.interactive.primary + "40" }}>
            <div className="text-center">
              <div
                className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
                style={{
                  backgroundColor: `${colors.interactive.primary}20`,
                  color: colors.interactive.primary,
                }}
              >
                Limited Time Deal
              </div>
              <p className="text-white/80 text-lg mb-4">
                Get Everything Today For A Single, One-Time Payment of
              </p>
              <div className="mb-6">
                <p className="text-5xl font-black text-white mb-2">{currentPrice}</p>
                <p className="text-2xl text-white/60 line-through">{totalValue}</p>
              </div>
              <button
                className="w-full max-w-md mx-auto px-8 py-4 text-lg font-bold text-slate-900 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)] active:scale-[0.98] mb-4"
                style={{
                  background: `linear-gradient(135deg, ${colors.interactive.primary}, ${colors.interactive.primaryHover || colors.interactive.primary})`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${colors.interactive.primaryHover || colors.interactive.primary}, ${colors.interactive.primary})`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${colors.interactive.primary}, ${colors.interactive.primaryHover || colors.interactive.primary})`;
                }}
              >
                Claim This Limited-Time Offer Now
              </button>
              <p className="text-sm text-white/60">100% Secure Checkout</p>
            </div>
          </div>
        </div>

        {/* Countdown Timer Section */}
        <div className="bg-red-900/30 border-2 border-red-500/50 rounded-2xl p-6 mb-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-black text-red-400">WARNING: Price Increases Soon</h3>
            </div>
            <p className="text-white/80 text-sm mb-6">
              Lifetime offer and free bonuses will expire when the timer hits zero.
            </p>
            <CountdownTimer targetDate={targetDate} />
          </div>
        </div>

        {/* Product Interface Screenshot */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-slate-900/60">
          <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center">
            <img
              src="https://via.placeholder.com/800x450/1e293b/ffffff?text=Super+CRM+Dashboard+Interface"
              alt="Super CRM Dashboard"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LimitedTimeOffer;

