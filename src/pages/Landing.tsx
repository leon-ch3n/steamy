import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Hero } from "../sections/Hero";
import { WhyAutoMate } from "../sections/WhyAutoMate";
import { AgentCapabilities } from "../sections/AgentCapabilities";
import { FinalCTA } from "../sections/FinalCTA";
import { AgentDemo } from "../components/AgentDemo";
import { AuthModal } from "../components/AuthModal";
import { useAuth } from "../contexts/AuthContext";

export const Landing = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle primary CTA - open auth modal if not signed in, or go to Try AutoMate
  const handleGetStarted = () => {
    if (user) {
      // User is signed in, navigate to Try AutoMate
      navigate("/try");
    } else {
      // Show auth modal
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      {/* Hero Section with AgentDemo */}
      <Hero onPrimaryCTA={handleGetStarted} ctaLabel={user ? "Try Now" : "Get early access"}>
        <AgentDemo />
      </Hero>

      {/* Why AutoMate - Value Proposition */}
      <WhyAutoMate />

      {/* Agent Capabilities */}
      <AgentCapabilities />

      {/* Final CTA */}
      <FinalCTA />

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};
