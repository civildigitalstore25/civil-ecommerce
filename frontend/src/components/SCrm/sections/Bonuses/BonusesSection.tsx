import { useAdminTheme } from "../../../../contexts/AdminThemeContext";

const BonusesSection = () => {
  const { colors } = useAdminTheme();

  // Calculate the next Saturday date
  const getNextSaturday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + daysUntilSaturday);
    return nextSaturday;
  };

  const deadlineDate = getNextSaturday();
  const formattedDate = deadlineDate.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <section className=" bg-slate-950/95 py-20">
      <div className="mx-auto max-w-4xl px-4">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 
            className="text-3xl sm:text-4xl font-black leading-tight mb-6"
            style={{ color: "#06b6d4" }}
          >
            Limited Time - Free Bonuses (Offer Never Before)
          </h2>
        </div>

        {/* Bonus Items */}
        <div className="space-y-4 mb-8">
          <div className="bg-slate-900/60 rounded-xl p-6 border border-white/10">
            <p className="text-white text-lg font-semibold text-center">
              100+ Digital Marketing Bonuses (Worth <span className="text-green-400">₹30,000/-</span>)
            </p>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-6 border border-white/10">
            <p className="text-white text-lg font-semibold text-center">
              Complete WhatsApp Marketing Course (Worth <span className="text-green-400">₹10,000/-</span>)
            </p>
          </div>
        </div>

        {/* Offer Deadline Box */}
        <div className="bg-amber-900/30 border-2 border-amber-600/50 rounded-2xl p-8 mb-8">
          <div className="text-center">
            <p className="text-white/80 text-base mb-2">
              Purchase before midnight of
            </p>
            <p 
              className="text-2xl sm:text-3xl font-black mb-2"
              style={{ color: "#f59e0b" }}
            >
              {formattedDate}
            </p>
            <p className="text-white/80 text-base">
              to get bonuses worth{" "}
              <span className="font-bold text-green-400">₹40,000/-</span> for{" "}
              <span className="font-bold text-green-400">FREE</span>
            </p>
          </div>
        </div>

        {/* Money-Back Guarantee Badge */}
        <div className="flex justify-center mb-6">
          <div 
            className="relative w-32 h-32 rounded-full flex items-center justify-center border-4"
            style={{
              backgroundColor: "#fbbf24",
              borderColor: "#f59e0b",
            }}
          >
            <div className="text-center">
              <p className="text-xs font-black text-slate-900 leading-tight">
                MONEY BACK
              </p>
              <p className="text-2xl font-black text-slate-900 leading-tight">
                30 DAY
              </p>
              <p className="text-xs font-black text-slate-900 leading-tight">
                GUARANTEED
              </p>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-white/90">
            Try it Risk-Free for 30 Days
          </h3>
        </div>

        {/* Guarantee Details */}
        <div className="text-center">
          <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            We are so confident that Super CRM will transform your business that we offer a 100% no-questions-asked money-back guarantee. If you don't love it, we'll refund your entire purchase.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BonusesSection;

