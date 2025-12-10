import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Hero } from "../sections/Hero";
import { WhyAutoMate } from "../sections/WhyAutoMate";
import { HowItWorks } from "../sections/HowItWorks";
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
      <Hero onPrimaryCTA={handleGetStarted}>
        <AgentDemo />
      </Hero>

      {/* Why AutoMate - Value Proposition */}
      <WhyAutoMate />

      {/* How It Works - 3 Step Process */}
      <HowItWorks />

      {/* Feature Cards Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">How AutoMate works</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our AI agent handles the entire car-buying process, so you don't have to.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-thistle to-mauve flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Smart Search</h3>
            <p className="text-slate-600">Describe what you need in plain English. Our AI understands context.</p>
          </div>

          <div className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-light to-sky-pale flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">AI Negotiator</h3>
            <p className="text-slate-600">We negotiate with dealers automatically to get you the best price.</p>
          </div>

          <div className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-lavender to-lavender-veil flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Complete Service</h3>
            <p className="text-slate-600">Insurance, financing, and delivery—all handled in one place.</p>
          </div>
        </div>
      </section>

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
