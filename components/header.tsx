import { ExternalLink, LogIn, LogOut, User, Loader2 } from "lucide-react";
import Logo from "./Logo";

interface HeaderProps {
  user: any | null;
  onLogin: () => void;
  onLogout: () => void;
  isLoggingIn?: boolean;
}

const Header = ({ user, onLogin, onLogout, isLoggingIn = false }: HeaderProps) => {
  return (
    <header className="border-b border-[#30363D] bg-[#0D1117] sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Logo />

        <nav className="flex items-center gap-4 sm:gap-6">
          <a
            href="https://frontendprep.io"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 font-mono text-xs text-[#8B949E] hover:text-[#F0F6FC] transition-colors"
          >
            frontendprep.io
            <ExternalLink className="h-3 w-3 text-[#8B949E]" />
          </a>

          <div className="h-4 w-px bg-[#30363D] hidden sm:block" />

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[#161B22] border border-[#30363D] px-2.5 py-1 rounded-full">
                <User className="h-3.5 w-3.5 text-[#D4933A]" />
                <span className="font-mono text-xs text-[#F0F6FC] font-medium max-w-[120px] truncate">
                  {user.username}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 font-mono text-xs text-[#8B949E] hover:text-[#FF5F56] transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              disabled={isLoggingIn}
              className="flex items-center gap-2 bg-[#161B22] hover:bg-[#30363D] border border-[#30363D] hover:border-[#8B949E] text-[#F0F6FC] font-mono text-xs px-3.5 py-1.5 rounded transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#D4933A]" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-3.5 w-3.5 text-[#D4933A]" />
                  <span>Sign In with Puter</span>
                </>
              )}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
