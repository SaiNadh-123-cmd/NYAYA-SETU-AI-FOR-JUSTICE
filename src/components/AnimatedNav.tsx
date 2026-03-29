import { useState } from "react";
import { Scale, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";

const AnimatedNav = () => {
  const { user, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <nav className="animated-nav">
        <div className="nav-logo">
          <svg className="logo-icon" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="#c9a84c" strokeWidth="1.5" strokeDasharray="4 2" />
            <path d="M20 8L20 32M8 20L32 20" stroke="#c9a84c" strokeWidth="1.5" opacity="0.5" />
            <circle cx="20" cy="20" r="6" fill="rgba(201,168,76,0.15)" stroke="#c9a84c" strokeWidth="1.5" />
            <path d="M14 14L20 20L26 14M14 26L20 20L26 26" stroke="#00e5ff" strokeWidth="1" opacity="0.7" />
          </svg>
          <div className="logo-text">
            <div className="logo-nyaya">NYAYA SETU</div>
            <div className="logo-sub">LegalEase</div>
          </div>
        </div>
        <ul className="nav-links-list">
          <li><a href="#services">Services</a></li>
          <li><a href="#process">Process</a></li>
          <li><a href="#technology">Technology</a></li>
          <li><a href="#tools">Tools</a></li>
        </ul>
        
        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-gold font-body text-sm font-semibold tracking-wider">
              <User className="w-4 h-4" />
              {user.email?.split('@')[0]}
            </div>
            <button className="nav-cta-btn" onClick={signOut}>
              <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </span>
            </button>
          </div>
        ) : (
          <button className="nav-cta-btn" onClick={() => setIsAuthModalOpen(true)}>
            <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 8 }}>
              <Scale className="w-3.5 h-3.5" />
              Sign In
            </span>
          </button>
        )}
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default AnimatedNav;
