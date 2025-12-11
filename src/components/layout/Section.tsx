import { ReactNode, useEffect, useRef, useState } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  id?: string;
}

/**
 * Section - Standard section wrapper with optional scroll-triggered animation.
 * Uses Intersection Observer for reveal animation.
 */
export const Section = ({ 
  children, 
  className = "", 
  animate = true,
  id 
}: SectionProps) => {
  const ref = useRef<HTMLElement>(null);
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
    <section
      ref={ref}
      id={id}
      className={`
        py-section-sm lg:py-section
        ${animate ? 'transition-all duration-700 ease-out' : ''}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${className}
      `}
    >
      {children}
    </section>
  );
};

export default Section;
