import React, { useEffect, useState } from "react";

function formatCountdown(expiryDate, now) {
  const seconds = Math.max(0, Math.ceil((expiryDate - now) / 1000));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const pad = (num) => String(num).padStart(2, "0");

  return `${days ? `${days}d ` : ""}${pad(hours)}h ${pad(minutes)}m ${pad(remainingSeconds)}s`;
}

const CountdownTimer = ({ expiryDate }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (expiryDate == null) return;

    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);

    return () => clearInterval(interval);
  }, [expiryDate]);

  if (expiryDate == null) return null;

  return (
    <div className="de_countdown">
      {formatCountdown(expiryDate, now)}
    </div>
  );
};

export default CountdownTimer;