import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "./AuthModal";

const navLinks = [
  { to: "/#product", label: "Product" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/#for-buyers", label: "For buyers" },
  { to: "/about", label: "For partners" },
];

export const Navbar = () => {
  const location = useLocation();
  const { user, loading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <>
      {/* Sticky navbar with blur effect */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white/60 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-light via-mauve to-cyan-light flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-sm">
              <svg 
                className="w-5 h-5 text-white" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
              </svg>
            </div>
            <span className="text-xl font-semibold text-primary">AutoMate</span>
          </Link>
          
          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {/* Nav Links - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to || 
                  (link.to.startsWith('/#') && location.pathname === '/');
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-primary bg-white/50"
                        : "text-slate-600 hover:text-primary hover:bg-white/30"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            
            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-slate-200/50 mx-2" />
            
            {/* Auth Section */}
            {!loading && (
              <div className="flex items-center gap-2">
                {user ? (
                  <>
                    {/* Try AutoMate - Primary CTA for signed-in users */}
                    <Link
                      to="/try"
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        location.pathname === "/try"
                          ? "bg-gradient-to-r from-mauve to-cyan-light text-primary shadow-md"
                          : "bg-gradient-to-r from-mauve/80 to-cyan-light/80 text-primary hover:from-mauve hover:to-cyan-light hover:shadow-lg hover:scale-[1.02]"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Try AutoMate</span>
                    </Link>
                    
                    <Link
                      to="/dashboard"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        location.pathname === "/dashboard"
                          ? "bg-white/50 text-primary"
                          : "text-slate-600 hover:text-primary hover:bg-white/30"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                    
                    {/* User Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/30 transition-all"
                      >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-mauve to-cyan-light flex items-center justify-center text-white text-xs font-semibold">
                          {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 py-1 bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 z-50">
                          <div className="px-4 py-2.5 border-b border-slate-100/50">
                            <p className="text-sm font-medium text-primary truncate">{user.email}</p>
                          </div>
                          <button
                            onClick={() => {
                              signOut();
                              setShowUserMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50/50 transition-colors"
                          >
                            Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-mauve to-cyan-light text-primary hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                  >
                    Join beta
                  </button>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};
