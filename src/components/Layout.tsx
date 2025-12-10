import { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: ReactNode;
  /** Whether to include the Navbar (default: true) */
  showNavbar?: boolean;
  /** Whether to apply the gradient background (default: true) */
  withGradient?: boolean;
  /** Container max-width variant (default: "default") */
  maxWidth?: "sm" | "md" | "default" | "lg" | "xl" | "full";
  /** Additional className for the main content wrapper */
  className?: string;
}

const maxWidthClasses = {
  sm: "max-w-3xl",
  md: "max-w-4xl",
  default: "max-w-6xl",
  lg: "max-w-7xl",
  xl: "max-w-screen-xl",
  full: "max-w-full",
};

/**
 * Layout wrapper component that provides consistent structure across pages.
 * Includes optional Navbar, gradient background, and centered content container.
 */
export const Layout = ({
  children,
  showNavbar = true,
  withGradient = true,
  maxWidth = "default",
  className = "",
}: LayoutProps) => {
  return (
    <div
      className={`min-h-screen ${withGradient ? "gradient-bg" : "bg-surface"}`}
    >
      {showNavbar && <Navbar />}
      <main
        className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth]} ${className}`}
      >
        {children}
      </main>
    </div>
  );
};

/**
 * Simple container component for consistent content width.
 * Use this inside pages that need custom outer structure.
 */
export const Container = ({
  children,
  maxWidth = "default",
  className = "",
}: {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "default" | "lg" | "xl" | "full";
  className?: string;
}) => {
  return (
    <div
      className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth]} ${className}`}
    >
      {children}
    </div>
  );
};

export default Layout;

