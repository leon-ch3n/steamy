import { ReactNode, useEffect, useRef, useState } from "react";

interface SplitSectionProps {
  left: ReactNode;
  right: ReactNode;
  reverse?: boolean;
  sticky?: boolean;
  className?: string;
  animate?: boolean;
}

/**
 * SplitSection - Left/right split layout for context + visual content.
 * Left side: text/context content
 * Right side: image/video/demo
 */
export const SplitSection = ({
  left,
  right,
  reverse = false,
  sticky = false,
  className = "",
  animate = true,
}: SplitSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!animate);

  useEffect(() => {
    if (!animate) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [animate]);

  return (
    <div
      ref={ref}
      className={`
        grid lg:grid-cols-2 gap-0 min-h-[60vh]
        ${animate ? 'transition-all duration-700 ease-out' : ''}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${className}
      `}
    >
      {/* Left content */}
      <div
        className={`
          flex flex-col justify-center p-8 lg:p-16
          ${reverse ? 'lg:order-2' : 'lg:order-1'}
        `}
      >
        {left}
      </div>

      {/* Right content */}
      <div
        className={`
          relative flex items-center justify-center p-8 lg:p-12
          bg-dark-900
          ${reverse ? 'lg:order-1' : 'lg:order-2'}
          ${sticky ? 'lg:sticky lg:top-20 lg:self-start lg:h-screen' : ''}
        `}
      >
        {right}
      </div>
    </div>
  );
};

export default SplitSection;
