import { ReactNode } from "react";
import { Navbar } from "../Navbar";
import { Footer } from "../Footer";

interface PageContainerProps {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  maxWidth?: "sm" | "md" | "default" | "lg" | "xl" | "full";
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
 * PageContainer - Wraps all pages with consistent structure.
 * Includes navbar, footer, and centered content container.
 */
export const PageContainer = ({
  children,
  showNavbar = true,
  showFooter = true,
  maxWidth = "lg",
  className = "",
}: PageContainerProps) => {
  return (
    <div className="min-h-screen bg-dark-950">
      {showNavbar && <Navbar />}
      <main
        className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth]} ${className}`}
      >
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default PageContainer;
