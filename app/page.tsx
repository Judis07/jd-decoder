"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ExternalLink,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  Terminal,
} from "lucide-react";
import { SAMPLE_JDS, decodeJobDescription, type DecodedResult } from "./mockDecoder";

export default function Home() {
  const [jdText, setJdText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const [results, setResults] = useState<DecodedResult | null>(null);
  const [checklist, setChecklist] = useState<DecodedResult["studyChecklist"]>([]);

  const resultsRef = useRef<HTMLDivElement>(null);

  const loadingSteps = [
    "[RUNNING] scanning text segments...",
    "[PARSING] separating must-haves from fluff...",
    "[ANALYZE] mapping seniority level ratios...",
    "[CHECK] flagging corporate jargon patterns...",
    "[PROCESS] generating custom study roadmap...",
  ];

  const handleSampleClick = (type: "frontend" | "backend" | "fullstack") => {
    setJdText(SAMPLE_JDS[type].text);
  };

  const handleDecode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdText.trim()) return;

    setIsAnalyzing(true);
    setCurrentLoadingStep(0);
    setResults(null);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < loadingSteps.length) {
        setCurrentLoadingStep(step);
      } else {
        clearInterval(interval);
        const decoded = decodeJobDescription(jdText);
        setResults(decoded);
        setChecklist(decoded.studyChecklist);
        setIsAnalyzing(false);
      }
    }, 300); // 1500ms total loading
  };

  // Scroll to results
  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [results]);

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0D1117] text-[#C9D1D9] selection:bg-[#30363D]">
      
      {/* Navigation */}
      <header className="border-b border-[#30363D] bg-[#0D1117]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold tracking-tight text-[#F0F6FC] text-sm">
              JD_<span className="text-[#D4933A]">DECODER</span>
            </span>
            <span className="text-[10px] font-mono text-[#8B949E] border border-[#30363D] px-1.5 py-0.2 rounded bg-[#161B22]">
              v1.0.0
            </span>
          </div>

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

      {/* Main Container */}
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* Compact, Editorial Hero Section */}
        <section className="mb-12 text-left border-l-2 border-[#30363D] pl-6">
          <div className="font-mono text-xs text-[#8B949E] mb-2">// tool</div>
          <h1 className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-[#F0F6FC] mb-2">
            Cut through the <span className="text-[#D4933A]">noise</span><br />
            in any job description
          </h1>
          <p className="text-[#8B949E] text-xs sm:text-sm max-w-xl leading-relaxed">
            Paste a JD. Get what actually matters — real requirements, <span className="text-[#D4933A]">red flags</span>, seniority reality check, and what to study before you apply.
          </p>
        </section>

        {/* Input Section */}
        <section className="mb-8">
          {/* Header Actions / Preset Selection */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#8B949E]">
              Input Source File
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[#8B949E]">Quick presets:</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => handleSampleClick("frontend")}
                  className="font-mono text-[10px] bg-[#161B22] hover:bg-[#30363D] border border-[#30363D] text-[#C9D1D9] px-2 py-0.5 rounded transition-colors"
                >
                  frontend_dev.txt
                </button>
                <button
                  type="button"
                  onClick={() => handleSampleClick("backend")}
                  className="font-mono text-[10px] bg-[#161B22] hover:bg-[#30363D] border border-[#30363D] text-[#C9D1D9] px-2 py-0.5 rounded transition-colors"
                >
                  backend_dev.txt
                </button>
                <button
                  type="button"
                  onClick={() => handleSampleClick("fullstack")}
                  className="font-mono text-[10px] bg-[#161B22] hover:bg-[#30363D] border border-[#30363D] text-[#C9D1D9] px-2 py-0.5 rounded transition-colors"
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
              <span className="font-mono text-[11px] text-[#8B949E]">jd_source.txt</span>
              <div className="w-10" />
            </div>

            <form onSubmit={handleDecode} className="bg-[#0D1117]">
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
                    className="absolute bottom-3 right-3 text-[#8B949E] hover:text-[#F0F6FC] p-1 bg-[#161B22] border border-[#30363D] rounded transition-colors"
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
                  className="bg-[#D4933A] hover:bg-[#c2822d] text-[#0D1117] font-mono text-xs font-bold px-4 py-1.5 rounded transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
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

        {/* Terminal Loading Simulation */}
        {isAnalyzing && (
          <section className="mb-8 animate-fade-in-up">
            <div className="border border-[#30363D] rounded-lg overflow-hidden bg-[#161B22]">
              <div className="border-b border-[#30363D] px-4 py-1.5 bg-[#161B22] flex items-center gap-2">
                <Terminal className="h-3 w-3 text-[#8B949E]" />
                <span className="font-mono text-[10px] text-[#8B949E]">stdout.log</span>
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
        )}

        {/* Output Results */}
        {results && !isAnalyzing && (
          <section ref={resultsRef} className="space-y-6 animate-fade-in-up">
            
            {/* Header Banner */}
            <div className="border border-[#30363D] bg-[#161B22] rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#8B949E] border border-[#30363D] px-1.5 py-0.2 rounded bg-[#0D1117]">
                    OUTPUT_DECODED
                  </span>
                  <span className="font-mono text-[10px] text-[#8B949E] flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {results.confidence}% match confidence
                  </span>
                </div>
                <h2 className="font-mono font-bold text-lg text-[#F0F6FC]">
                  {results.roleTitle}
                </h2>
              </div>
              
              <div className="flex items-center gap-3 bg-[#0D1117] border border-[#30363D] px-3.5 py-1.5 rounded-lg self-start md:self-auto">
                <div className="text-right">
                  <div className="font-mono text-[9px] uppercase text-[#8B949E]">seniority</div>
                  <div className="font-mono text-xs font-bold text-[#F0F6FC]">{results.seniority}</div>
                </div>
              </div>
            </div>

            {/* Results Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Summary Card */}
              <div className="border border-[#30363D] bg-[#161B22] rounded-lg p-5 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-[10px] text-[#D4933A] uppercase tracking-wider mb-3">
                    // 01 / role summary
                  </div>
                  <p className="text-xs text-[#C9D1D9] leading-relaxed mb-4">
                    {results.summary}
                  </p>
                  
                  {/* Candid Translation Pane */}
                  <div className="border border-[#30363D] bg-[#0D1117] p-3.5 rounded-lg">
                    <div className="font-mono text-[9px] text-[#8B949E] uppercase tracking-wider mb-1">
                      candid translation:
                    </div>
                    <p className="text-xs text-[#8B949E] italic leading-relaxed">
                      &ldquo;{results.translatedSummary}&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Seniority Assessment Card */}
              <div className="border border-[#30363D] bg-[#161B22] rounded-lg p-5 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-[10px] text-[#D4933A] uppercase tracking-wider mb-3">
                    // 02 / seniority assessment
                  </div>
                  
                  {/* Flat progress representation */}
                  <div className="mb-4 bg-[#0D1117] p-3 rounded-lg border border-[#30363D]">
                    <div className="flex justify-between font-mono text-[10px] text-[#8B949E] mb-1.5">
                      <span>Assessed:</span>
                      <span className="text-[#F0F6FC] font-semibold">{results.seniority}</span>
                    </div>
                    
                    {/* Visual Meter */}
                    <div className="h-1.5 w-full bg-[#30363D] rounded-sm overflow-hidden flex">
                      <div 
                        className={`h-full bg-[#8B949E] transition-all duration-300 ${
                          results.seniority === 'Junior' 
                            ? 'w-1/4' 
                            : results.seniority === 'Mid-Level'
                            ? 'w-2/4'
                            : results.seniority === 'Senior'
                            ? 'w-3/4'
                            : 'w-full'
                        }`}
                      />
                    </div>
                    
                    <div className="flex justify-between font-mono text-[8px] text-[#8B949E] mt-1.5">
                      <span>JUNIOR</span>
                      <span>MID</span>
                      <span>SENIOR</span>
                      <span>LEAD+</span>
                    </div>
                  </div>

                  <div className="font-mono text-[9px] text-[#8B949E] uppercase tracking-wider mb-1">
                    rationale logic:
                  </div>
                  <p className="text-xs text-[#8B949E] leading-relaxed">
                    {results.seniorityReason}
                  </p>
                </div>
              </div>

              {/* Skills Breakdown Card */}
              <div className="border border-[#30363D] bg-[#161B22] rounded-lg p-5">
                <div className="font-mono text-[10px] text-[#D4933A] uppercase tracking-wider mb-3">
                  // 03 / skills audit
                </div>
                
                <div className="space-y-4">
                  {/* Must-Haves */}
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-wider text-[#F0F6FC] mb-2">
                      [+] must-have competencies
                    </div>
                    <ul className="space-y-1 font-mono text-xs text-[#C9D1D9]">
                      {results.mustHaves.map((skill, index) => (
                        <li key={index} className="flex items-center gap-1.5 py-0.5">
                          <span className="text-[#8B949E]">-</span>
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Nice-to-haves */}
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-wider text-[#8B949E] mb-2">
                      [?] nice-to-have options
                    </div>
                    <ul className="space-y-1 font-mono text-xs text-[#8B949E]">
                      {results.niceToHaves.map((skill, index) => (
                        <li key={index} className="flex items-center gap-1.5 py-0.5">
                          <span className="text-[#30363D]">-</span>
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Red Flags Card */}
              <div className="border border-[#30363D] bg-[#161B22] rounded-lg p-5">
                <div className="font-mono text-[10px] text-[#D4933A] uppercase tracking-wider mb-3">
                  // 04 / jargon & red flags
                </div>
                
                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1 no-scrollbar">
                  {results.redFlags.map((flag, index) => (
                    <div key={index} className="border border-[#30363D] bg-[#0D1117] p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[10px] text-[#F0F6FC] font-semibold">
                          {flag.flag}
                        </span>
                        <span className={`font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.2 border ${
                          flag.severity === "high" || flag.severity === "medium"
                            ? "border-[#D4933A]/40 text-[#D4933A] bg-[#D4933A]/5"
                            : "border-[#30363D] text-[#8B949E] bg-[#161B22]"
                        }`}>
                          {flag.severity}_risk
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8B949E] leading-relaxed">
                        {flag.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Study Checklist Card */}
            <div className="border border-[#30363D] bg-[#161B22] rounded-lg p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#30363D]">
                <div>
                  <div className="font-mono text-[10px] text-[#D4933A] uppercase tracking-wider">
                    // 05 / study checklist
                  </div>
                  <div className="text-xs text-[#8B949E] mt-0.5">Select items to mark target study goals</div>
                </div>

                {/* Progress metrics */}
                <div className="w-full md:w-56">
                  <div className="flex justify-between items-center font-mono text-[10px] mb-1">
                    <span className="text-[#8B949E]">Status:</span>
                    <span className="text-[#D4933A] font-semibold">{progressPercent}% done</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#30363D] rounded-sm overflow-hidden">
                    <div 
                      className="h-full bg-[#D4933A] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Checklist Elements */}
              <div className="space-y-1.5">
                {checklist.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`w-full text-left font-mono text-[11px] p-2.5 border rounded flex items-center justify-between gap-3 transition-colors ${
                      item.completed 
                        ? "border-[#30363D] bg-[#161B22]/20 text-[#8B949E]" 
                        : "border-[#30363D] bg-[#0D1117] hover:bg-[#161B22] text-[#C9D1D9]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] select-none ${item.completed ? "text-[#8B949E]" : "text-[#D4933A]"}`}>
                        {item.completed ? "[X]" : "[ ]"}
                      </span>
                      <span className={item.completed ? "line-through text-[#8B949E]" : ""}>
                        {item.topic}
                      </span>
                    </div>
                    
                    <span className={`text-[8px] uppercase tracking-wider ${item.completed ? "text-[#8B949E]" : "text-[#D4933A]"}`}>
                      {item.completed ? "ready" : "todo"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-[#30363D] bg-[#0D1117]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <span className="font-mono font-bold tracking-tight text-[#F0F6FC] text-sm">
            JD_<span className="text-[#D4933A]">DECODER</span> // PHASE_1
          </span>

          <p className="text-[#8B949E] text-center md:text-left">
            &copy; {new Date().getFullYear()} JD Decoder. Created by{" "}
            <a
              href="https://www.linkedin.com/in/arvind-m-ab2a71148"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9D1D9] hover:underline font-mono"
            >
              arvindm
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
    </div>
  );
}
