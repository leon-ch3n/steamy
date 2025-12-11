import { Link } from "react-router-dom";
import logoImg from "../Screenshot_2025-12-08_at_1.37.15_PM-removebg-preview.png";

/**
 * Footer - Site footer with copyright and tagline.
 * Purely presentational component.
 */

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo and copyright */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img src={logoImg} alt="AutoMate" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-semibold text-primary">AutoMate</span>
            </Link>
            <span className="text-slate-400">·</span>
            <span className="text-sm text-slate-500">
              © {currentYear} AutoMate. All rights reserved.
            </span>
          </div>

          {/* Tagline */}
          <p className="text-sm text-slate-500">
            Made for people who hate car dealerships.
          </p>
        </div>

        {/* Optional: Footer links */}
        <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap items-center justify-center gap-6 text-sm">
          <Link to="/how-it-works" className="text-slate-500 hover:text-primary transition-colors">
            How It Works
          </Link>
          <Link to="/about" className="text-slate-500 hover:text-primary transition-colors">
            About Us
          </Link>
          <Link to="/contact" className="text-slate-500 hover:text-primary transition-colors">
            Contact
          </Link>
          <a href="#" className="text-slate-500 hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-slate-500 hover:text-primary transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

