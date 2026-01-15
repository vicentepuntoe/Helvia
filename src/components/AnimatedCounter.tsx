import { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: string;
  duration?: number;
}

const AnimatedCounter = ({ value, duration = 2000 }: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    // Extract number from value (handles cases like "143.683", "40%", "2.3 min")
    const numericValue = parseFloat(value.replace(/[^\d.]/g, ''));
    if (isNaN(numericValue)) {
      setDisplayValue(value);
      return;
    }

    const suffix = value.replace(/[\d.]/g, '').trim();
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (numericValue - startValue) * easeOutQuart;

      if (progress < 1) {
        // Format based on original value
        if (value.includes('.')) {
          setDisplayValue(currentValue.toFixed(3) + suffix);
        } else if (value.includes('%')) {
          setDisplayValue(Math.round(currentValue) + suffix);
        } else {
          setDisplayValue(Math.round(currentValue).toLocaleString() + suffix);
        }
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, value, duration]);

  return <span ref={ref}>{displayValue}</span>;
};

export default AnimatedCounter;

