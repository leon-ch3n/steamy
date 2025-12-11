import { ReactNode } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
}

/**
 * FadeIn - Simple reveal animation component.
 * Fades in with optional directional movement when entering viewport.
 */
export function FadeIn({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: FadeInProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  const directionStyles = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
    none: "",
  };

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${directionStyles[direction]}`}
        ${className}
      `}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export default FadeIn;
