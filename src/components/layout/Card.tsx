import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "interactive";
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * Card - Consistent card component with dark theme styling.
 * Variants: default, elevated, interactive (with hover glow)
 */
export const Card = ({
  children,
  className = "",
  variant = "default",
  padding = "md",
}: CardProps) => {
  const baseClasses = paddingClasses[padding];
  
  const variantClasses = {
    default: "surface",
    elevated: "surface-elevated",
    interactive: "surface-interactive",
  };

  return (
    <div className={`${variantClasses[variant]} ${baseClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
