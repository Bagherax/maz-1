import React, { useState, useEffect } from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';

interface CountdownTimerProps {
  endDate: string | Date;
}

const calculateTimeLeft = (endDate: Date) => {
  const difference = +endDate - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endDate }) => {
  const { t } = useLocalization();
  const targetDate = new Date(endDate);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents: React.ReactNode[] = [];
  Object.keys(timeLeft).forEach((interval) => {
    if (!(timeLeft as any)[interval] && interval !== 'seconds' && timerComponents.length === 0) {
        return;
    }
    timerComponents.push(
      <div key={interval} className="flex flex-col items-center">
        <span className="text-2xl font-bold text-gray-800 dark:text-white">
          {(timeLeft as any)[interval].toString().padStart(2, '0')}
        </span>
        <span className="text-xs text-gray-500 uppercase">{t(`auction.${interval}` as any)}</span>
      </div>
    );
  });
  
  return (
    <div>
        <h3 className="text-sm font-semibold text-center text-gray-500 dark:text-gray-400 mb-2">{t('auction.time_left')}</h3>
        {timerComponents.length ? (
            <div className="flex justify-center gap-4">
                {timerComponents}
            </div>
        ) : (
            <p className="text-center font-bold text-xl text-red-500">{t('auction.ended')}</p>
        )}
    </div>
  );
};

export default CountdownTimer;
