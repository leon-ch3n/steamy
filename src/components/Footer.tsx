import { Link } from "react-router-dom";

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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-light via-mauve to-cyan-light flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
                </svg>
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

