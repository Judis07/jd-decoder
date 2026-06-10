import React from "react";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-[#30363D] bg-[#0D1117]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <Logo />

        <p className="text-[#8B949E] text-center md:text-left">
          &copy; {new Date().getFullYear()} jdstrip.com. Created by{" "}
          <a
            href="https://www.linkedin.com/in/arvind-m-ab2a71148"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C9D1D9] hover:underline font-mono"
          >
            Arvind M
          </a>
        </p>

        <a
          href="https://frontendprep.io"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[#8B949E] hover:text-[#C9D1D9]"
        >
          frontendprep.io
        </a>
      </div>
    </footer>
  );
};

export default Footer;
