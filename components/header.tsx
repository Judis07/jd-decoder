import { ExternalLink } from "lucide-react";
import Logo from "./Logo";

const Header = () => {
  return (
    <header className="border-b border-[#30363D] bg-[#0D1117]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Logo />

        <nav className="flex items-center gap-6">
          <a
            href="https://frontendprep.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-mono text-xs text-[#8B949E] hover:text-[#F0F6FC] transition-colors"
          >
            frontendprep.io
            <ExternalLink className="h-3 w-3 text-[#8B949E]" />
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
