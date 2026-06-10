import { SAMPLE_JDS } from "@/app/mockDecoder";
import { ArrowRight, RotateCcw } from "lucide-react";
import React, { useState } from "react";

interface InputProps {
  isAnalyzing: boolean;
  onDecode: (text: string) => void;
}

const Input = ({ isAnalyzing, onDecode }: InputProps) => {
  const [jdText, setJdText] = useState("");

  const handleSampleClick = (type: "frontend" | "backend" | "fullstack") => {
    setJdText(SAMPLE_JDS[type].text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdText.trim() || isAnalyzing) return;
    onDecode(jdText);
  };

  return (
    <section className="mb-8">
      {/* Header Actions / Preset Selection */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#8B949E]">
          Input Source File
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-[#8B949E]">
            Quick presets:
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => handleSampleClick("frontend")}
              className="font-mono text-[10px] bg-[#161B22] hover:bg-[#30363D] border border-[#30363D] text-[#C9D1D9] px-2 py-0.5 rounded transition-colors cursor-pointer"
            >
              frontend_dev.txt
            </button>
            <button
              type="button"
              onClick={() => handleSampleClick("backend")}
              className="font-mono text-[10px] bg-[#161B22] hover:bg-[#30363D] border border-[#30363D] text-[#C9D1D9] px-2 py-0.5 rounded transition-colors cursor-pointer"
            >
              backend_dev.txt
            </button>
            <button
              type="button"
              onClick={() => handleSampleClick("fullstack")}
              className="font-mono text-[10px] bg-[#161B22] hover:bg-[#30363D] border border-[#30363D] text-[#C9D1D9] px-2 py-0.5 rounded transition-colors cursor-pointer"
            >
              fullstack_dev.txt
            </button>
          </div>
        </div>
      </div>

      {/* IDE style Container */}
      <div className="border border-[#30363D] rounded-lg overflow-hidden bg-[#161B22]">
        {/* Signature Terminal Tab Bar */}
        <div className="bg-[#161B22] border-b border-[#30363D] px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] opacity-75" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] opacity-75" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] opacity-75" />
          </div>
          <span className="font-mono text-[11px] text-[#8B949E]">
            jd_source.txt
          </span>
          <div className="w-10" />
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0D1117]">
          <div className="relative">
            <textarea
              className="w-full min-h-[180px] max-h-[360px] bg-transparent text-[#F0F6FC] placeholder-[#8B949E] p-4 outline-none resize-y text-xs font-mono leading-relaxed"
              placeholder="Paste the raw job description text here to decode requirements..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              required
            />
            {jdText && (
              <button
                type="button"
                onClick={() => setJdText("")}
                className="absolute bottom-3 right-3 text-[#8B949E] hover:text-[#F0F6FC] p-1 bg-[#161B22] border border-[#30363D] rounded transition-colors cursor-pointer"
                title="Clear input"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Action bar inside the window */}
          <div className="border-t border-[#30363D] px-4 py-2.5 bg-[#161B22]/50 flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#8B949E]">
              ASCII characters: {jdText.length}
            </span>

            <button
              type="submit"
              disabled={isAnalyzing || !jdText.trim()}
              className="bg-[#D4933A] hover:bg-[#c2822d] text-[#0D1117] font-mono text-xs font-bold px-4 py-1.5 rounded transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer"
            >
              {isAnalyzing ? (
                <span>DECODING...</span>
              ) : (
                <>
                  <span>DECODE_JD</span>
                  <ArrowRight className="h-3 w-3" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Input;
