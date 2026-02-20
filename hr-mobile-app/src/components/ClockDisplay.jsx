import { memo, useEffect, useState } from 'react';
const ClockDisplay = memo(() => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center mb-4">
      <p className="text-gray-400 text-xs font-medium mb-0.5">
        {time.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long' })}
      </p>
      <h2 className="text-4xl font-black tracking-tighter text-white">
        {time.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </h2>
    </div>
  );
});
export default ClockDisplay;