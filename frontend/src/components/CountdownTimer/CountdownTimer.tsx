import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  dealEndDate: Date;
  colors: any;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ dealEndDate, colors }) => {
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

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 animate-pulse"
      style={{
        backgroundColor: `${colors.status.warning}15`,
        borderColor: colors.status.warning,
      }}
    >
      <Clock className="w-5 h-5" style={{ color: colors.status.warning }} />
      <div className="flex items-center gap-2">
        <span className="font-semibold" style={{ color: colors.text.primary }}>
          Deal ends in:
        </span>
        <div className="flex gap-2 font-mono font-bold text-lg" style={{ color: colors.status.warning }}>
          {timeLeft.days > 0 && <span>{timeLeft.days}d </span>}
          <span>{String(timeLeft.hours).padStart(2, '0')}:</span>
          <span>{String(timeLeft.minutes).padStart(2, '0')}:</span>
          <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
};
