import React, { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';

interface CountdownTimerProps {
  dealEndDate: Date;
  colors: any;
  variant?: 'compact' | 'featured';
}

const TimeBox: React.FC<{ value: string; label: string; colors: any }> = ({ value, label, colors }) => (
  <div
    className="flex flex-col items-center justify-center min-w-[3rem] sm:min-w-[4rem] py-2 px-1.5 sm:py-3 sm:px-2 rounded-lg"
    style={{
      backgroundColor: colors.background.primary,
      border: `2px solid ${colors.status.warning}`,
      boxShadow: `0 2px 8px ${colors.status.warning}30`,
    }}
  >
    <span
      className="font-bold text-lg sm:text-xl md:text-2xl font-mono tabular-nums"
      style={{ color: colors.status.warning }}
    >
      {value}
    </span>
    <span
      className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider mt-0.5"
      style={{ color: colors.text.secondary }}
    >
      {label}
    </span>
  </div>
);

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ dealEndDate, colors, variant = 'compact' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(dealEndDate).getTime();
      const difference = endTime - now;

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
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [dealEndDate]);

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return null;
  }

  // Featured variant: flasher-style boxes for product detail page
  if (variant === 'featured') {
    return (
      <div
        className="rounded-xl p-4 sm:p-5 border-2"
        style={{
          background: `linear-gradient(135deg, ${colors.status.warning}12 0%, ${colors.status.warning}08 100%)`,
          borderColor: colors.status.warning,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 shrink-0" style={{ color: colors.status.warning }} />
          <span
            className="text-sm font-semibold uppercase tracking-wide"
            style={{ color: colors.text.primary }}
          >
            Limited time offer – grab it before it ends
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {timeLeft.days > 0 && (
            <>
              <TimeBox
                value={String(timeLeft.days).padStart(2, '0')}
                label="Days"
                colors={colors}
              />
              <span className="text-xl font-bold pb-4" style={{ color: colors.status.warning }}>:</span>
            </>
          )}
          <TimeBox
            value={String(timeLeft.hours).padStart(2, '0')}
            label="Hours"
            colors={colors}
          />
          <span className="text-xl font-bold pb-4" style={{ color: colors.status.warning }}>:</span>
          <TimeBox
            value={String(timeLeft.minutes).padStart(2, '0')}
            label="Mins"
            colors={colors}
          />
          <span className="text-xl font-bold pb-4" style={{ color: colors.status.warning }}>:</span>
          <TimeBox
            value={String(timeLeft.seconds).padStart(2, '0')}
            label="Secs"
            colors={colors}
          />
        </div>
      </div>
    );
  }

  // Compact variant: for deal cards
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border"
      style={{
        backgroundColor: `${colors.status.warning}15`,
        borderColor: colors.status.warning,
      }}
    >
      <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: colors.status.warning }} />
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="text-[10px] md:text-xs font-medium" style={{ color: colors.text.primary }}>
          Deal ends in:
        </span>
        <div className="flex gap-0.5 font-mono font-semibold text-xs md:text-sm tabular-nums" style={{ color: colors.status.warning }}>
          {timeLeft.days > 0 && <span>{timeLeft.days}d </span>}
          <span>{String(timeLeft.hours).padStart(2, '0')}:</span>
          <span>{String(timeLeft.minutes).padStart(2, '0')}:</span>
          <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
};
