import React, { useEffect, useRef, useState } from "react";

const OtpTimer = () => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [started, setStarted] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    // Observer detects visibility
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true);
          observer.disconnect(); // run only once
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, []);

  // Countdown when "started" becomes true
  useEffect(() => {
    if (!started || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [started, timeLeft]);

  return (
    <span className="text-success fw-bold" ref={elementRef}>
      {timeLeft > 0 ? `${timeLeft} seconds` : "Expired"}
    </span>
  );
};

export default OtpTimer;
