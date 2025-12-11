import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "./AuthModal";
import logoImg from "../Screenshot_2025-12-08_at_1.37.15_PM-removebg-preview.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How it works" },
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
      <header className="fixed top-0 inset-x-0 z-40 bg-white/40 backdrop-blur-2xl border-b border-white/40" style={{ boxShadow: 'inset 0 -1px 1px 0 rgba(255, 255, 255, 0.3)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-200 shadow-sm">
              <img src={logoImg} alt="AutoMate" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-semibold text-primary">AutoMate</span>
          </Link>
          
          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {/* Nav Links - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
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
