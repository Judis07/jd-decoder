import React from "react";
import { Terminal } from "lucide-react";

interface TerminalLoaderProps {
  isAnalyzing: boolean;
  currentLoadingStep: number;
  loadingSteps: string[];
}

const TerminalLoader = ({
  isAnalyzing,
  currentLoadingStep,
  loadingSteps,
}: TerminalLoaderProps) => {
  if (!isAnalyzing) return null;

  return (
    <section className="mb-8 animate-fade-in-up">
      <div className="border border-[#30363D] rounded-lg overflow-hidden bg-[#161B22]">
        <div className="border-b border-[#30363D] px-4 py-1.5 bg-[#161B22] flex items-center gap-2">
          <Terminal className="h-3 w-3 text-[#8B949E]" />
          <span className="font-mono text-[10px] text-[#8B949E]">
            stdout.log
          </span>
        </div>
        <div className="p-4 bg-[#0D1117] font-mono text-[11px] leading-relaxed space-y-1.5">
          {loadingSteps.map((stepMsg, idx) => {
            const isCurrent = idx === currentLoadingStep;
            const isDone = idx < currentLoadingStep;
            return (
              <div
                key={idx}
                className={
                  isCurrent
                    ? "text-[#F0F6FC]"
                    : isDone
                      ? "text-[#8B949E]"
                      : "text-[#30363D]"
                }
              >
                {isDone ? "[OK] " : isCurrent ? "[..] " : "[  ] "}
                {stepMsg}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TerminalLoader;
