"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Sparkles,
  ShieldAlert,
  GraduationCap,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Loader2,
  AlertTriangle,
  // Linkedin,
  Award,
  Layers,
  ArrowRight,
  TrendingUp,
  Bookmark,
  CheckSquare,
  Square,
  Sparkle,
} from "lucide-react";
import {
  SAMPLE_JDS,
  decodeJobDescription,
  type DecodedResult,
} from "./mockDecoder";

export default function Home() {
  const [jdText, setJdText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const [results, setResults] = useState<DecodedResult | null>(null);
  const [checklist, setChecklist] = useState<DecodedResult["studyChecklist"]>(
    [],
  );

  const resultsRef = useRef<HTMLDivElement>(null);

  const loadingSteps = [
    "Reading job description text patterns...",
    "Translating corporate jargon into realistic demands...",
    "Running seniority criteria analysis...",
    "Cross-referencing technology requirements...",
    "Compiling dynamic study roadmap & prep goals...",
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
    }, 300); // 300ms * 5 steps = 1500ms total
  };

  // Scroll to results when results are populated
  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [results]);

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="relative min-h-screen flex flex-col font-sans overflow-x-hidden">
      {/* Decorative background glow orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 glow-orb animate-glow" />
      <div
        className="absolute top-[40%] right-[-10%] w-[60%] h-[60%] bg-teal-500/5 glow-orb animate-glow"
        style={{ animationDelay: "-2s" }}
      />

      {/* Navigation */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl shadow-md shadow-violet-900/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              JD<span className="text-violet-400">Decoder</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-semibold tracking-wider text-violet-400/90 border border-violet-500/30 px-2 py-0.5 rounded-full bg-violet-950/40">
              Phase 1
            </span>
          </div>

          <nav className="flex items-center gap-6">
            <a
              href="https://frontendprep.io"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200"
            >
              frontendprep.io
              <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full z-10">
        {/* Hero Section */}
        <section className="text-center mb-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300 mb-4 animate-fade-in-up">
            <Sparkle
              className="h-3.5 w-3.5 text-teal-400 animate-spin"
              style={{ animationDuration: "8s" }}
            />
            <span>Behind-the-scenes Corporate Translator</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight animate-fade-in-up">
            Decode Any Job Description <br className="hidden sm:block" />
            <span className="text-gradient-purple-teal">In Seconds</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed animate-fade-in-up">
            Reveal the hidden expectations, filter out corporate buzzwords,
            evaluate seniority, and get a customized prep roadmap.
          </p>
        </section>

        {/* Input Card Container */}
        <section className="animate-fade-in-up">
          <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            {/* Top border ambient glow effect */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

            <form onSubmit={handleDecode} className="space-y-6">
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                  <label
                    htmlFor="jd-input"
                    className="block text-sm font-semibold tracking-wide uppercase text-slate-300"
                  >
                    Paste Job Description Text
                  </label>

                  {/* Preset Helper Tags */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">
                      Or try samples:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSampleClick("frontend")}
                        className="text-xs bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg transition-all"
                      >
                        Frontend
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSampleClick("backend")}
                        className="text-xs bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg transition-all"
                      >
                        Backend
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSampleClick("fullstack")}
                        className="text-xs bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg transition-all"
                      >
                        Fullstack
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative rounded-xl border border-slate-800 focus-within:border-violet-500/80 focus-within:ring-2 focus-within:ring-violet-500/20 bg-slate-950/60 transition-all duration-200">
                  <textarea
                    id="jd-input"
                    className="w-full min-h-[200px] max-h-[400px] bg-transparent text-slate-200 placeholder-slate-500 p-4 rounded-xl border-none outline-none resize-y text-sm leading-relaxed"
                    placeholder="We are looking for a rockstar Engineer with 5+ years experience... Paste the job posting details here."
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    required
                  />
                  {jdText && (
                    <button
                      type="button"
                      onClick={() => setJdText("")}
                      className="absolute bottom-3 right-3 text-slate-500 hover:text-slate-300 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all"
                      title="Clear text"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Action and Info Row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs text-slate-400 flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  <span>Phase 1 Mock Analysis Engine active</span>
                </div>

                <button
                  type="submit"
                  disabled={isAnalyzing || !jdText.trim()}
                  className="w-full sm:w-auto relative group overflow-hidden font-medium text-sm px-6 py-3 rounded-xl shadow-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none hover:shadow-violet-950/40"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        Decoding Job...
                      </>
                    ) : (
                      <>
                        Decode Job Description
                        <ArrowRight className="h-4 w-4 text-violet-200 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  {/* Subtle hover gradient reflection animation */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Dynamic Loading Component */}
        {isAnalyzing && (
          <section className="mt-8 glass-panel rounded-2xl p-6 border-violet-500/20 shadow-xl animate-fade-in-up">
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="relative mb-6">
                {/* Glowing ring under spinner */}
                <div className="absolute inset-0 w-12 h-12 bg-violet-600/30 rounded-full blur-md animate-pulse" />
                <Loader2 className="h-12 w-12 text-violet-400 animate-spin relative" />
              </div>
              <h3 className="font-display font-semibold text-lg text-white mb-2">
                Analyzing Job DNA
              </h3>
              <p className="text-slate-400 text-xs max-w-sm mb-6">
                Evaluating skills, calculating match criteria, and
                cross-referencing candidate checklists.
              </p>

              {/* Progress Log steps */}
              <div className="w-full max-w-md bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 text-left font-mono text-xs space-y-2.5">
                {loadingSteps.map((stepMsg, idx) => {
                  const isActive = idx === currentLoadingStep;
                  const isCompleted = idx < currentLoadingStep;
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-2.5 transition-all duration-200 ${
                        isActive
                          ? "text-violet-400 font-medium scale-[1.01]"
                          : isCompleted
                            ? "text-teal-400/80"
                            : "text-slate-600"
                      }`}
                    >
                      <span>{isCompleted ? "✔" : isActive ? "⚡" : "○"}</span>
                      <span>{stepMsg}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Results Card Display */}
        {results && !isAnalyzing && (
          <section
            ref={resultsRef}
            className="mt-12 space-y-8 animate-fade-in-up"
          >
            {/* Results Title Banner */}
            <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-violet-500 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full blur-2xl" />
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs uppercase font-bold tracking-wider text-violet-400 px-2 py-0.5 rounded-md bg-violet-950/50 border border-violet-800/40">
                    Analysis Completed
                  </span>
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-teal-400" />
                    {results.confidence}% Confidence Rate
                  </span>
                </div>
                <h2 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">
                  {results.roleTitle}
                </h2>
              </div>

              <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800/80 px-4 py-2 rounded-xl self-start md:self-auto shadow-inner">
                <Award className="h-5 w-5 text-teal-400" />
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    Decoded Level
                  </div>
                  <div className="text-sm font-bold text-white">
                    {results.seniority}
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Summary and Behind the scenes Card */}
              <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between shadow-lg relative">
                <div className="absolute top-0 right-0 p-4 text-violet-500/10 pointer-events-none">
                  <Layers className="h-20 w-20" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span className="p-1 bg-slate-900 border border-slate-800 rounded-lg text-violet-400">
                      📄
                    </span>
                    Role Summary & Reality Check
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    {results.summary}
                  </p>
                  <div className="mt-4 p-4 rounded-xl border border-teal-500/20 bg-teal-950/20 relative">
                    <div className="absolute top-2.5 right-3 text-[10px] uppercase font-bold tracking-wider text-teal-400/90 flex items-center gap-1 bg-teal-950 px-2 py-0.5 rounded border border-teal-800/30">
                      <span>Candid translation</span>
                    </div>
                    <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <span>Behind the Scenes:</span>
                    </h4>
                    <p className="text-xs text-teal-200/90 leading-relaxed italic">
                      &ldquo;{results.translatedSummary}&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Seniority Check Card */}
              <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between shadow-lg relative">
                <div>
                  <h3 className="font-display text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span className="p-1 bg-slate-900 border border-slate-800 rounded-lg text-violet-400">
                      ⚖
                    </span>
                    Seniority Check
                  </h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      <span>Assessed Experience Level</span>
                      <span className="font-semibold text-white">
                        {results.seniority}
                      </span>
                    </div>
                    {/* Visual Meter for experience ranges */}
                    <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 flex">
                      <div
                        className={`h-full rounded-l-full transition-all duration-500 ${
                          results.seniority === "Junior"
                            ? "w-1/4 bg-blue-500"
                            : results.seniority === "Mid-Level"
                              ? "w-2/4 bg-teal-500"
                              : results.seniority === "Senior"
                                ? "w-3/4 bg-violet-500"
                                : "w-full bg-gradient-to-r from-violet-500 to-indigo-500"
                        }`}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-600 mt-1 uppercase font-bold tracking-wider px-0.5">
                      <span>Junior</span>
                      <span>Mid</span>
                      <span>Senior</span>
                      <span>Lead+</span>
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Reasoning Analysis:
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {results.seniorityReason}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                  <span>Classification Confidence:</span>
                  <span className="font-semibold text-slate-300">
                    {results.confidence}%
                  </span>
                </div>
              </div>

              {/* Skills Card */}
              <div className="glass-panel rounded-2xl p-6 shadow-lg">
                <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="p-1 bg-slate-900 border border-slate-800 rounded-lg text-violet-400">
                    💡
                  </span>
                  Skills Breakdown
                </h3>

                <div className="space-y-4">
                  {/* Must-Haves */}
                  <div>
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      Must-Have Competencies
                    </h4>
                    <ul className="space-y-1.5">
                      {results.mustHaves.map((skill, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/50 border border-slate-800/80 px-2.5 py-1.5 rounded-lg"
                        >
                          <span className="text-emerald-400 font-bold text-xs select-none">
                            ✓
                          </span>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Nice-to-haves */}
                  <div>
                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                      Nice-To-Have Skills
                    </h4>
                    <ul className="space-y-1.5">
                      {results.niceToHaves.map((skill, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/50 border border-slate-800/80 px-2.5 py-1.5 rounded-lg"
                        >
                          <span className="text-indigo-400 font-bold text-xs select-none">
                            +
                          </span>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Red Flags Card */}
              <div className="glass-panel rounded-2xl p-6 shadow-lg border-t border-t-amber-500/20">
                <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-amber-500" />
                  Jargon & Red Flags
                </h3>

                <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                  {results.redFlags.map((flag, index) => {
                    const sevColor =
                      flag.severity === "high"
                        ? "border-red-500/30 bg-red-950/10 text-red-300"
                        : flag.severity === "medium"
                          ? "border-amber-500/30 bg-amber-950/10 text-amber-300"
                          : "border-yellow-500/20 bg-yellow-950/5 text-yellow-300";
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-xl border flex gap-3 text-xs leading-relaxed ${sevColor}`}
                      >
                        <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-amber-400" />
                        <div>
                          <div className="font-bold text-white flex items-center gap-2 mb-0.5">
                            {flag.flag}
                            <span
                              className={`text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.2 rounded border ${
                                flag.severity === "high"
                                  ? "border-red-500/40 text-red-400 bg-red-950/40"
                                  : "border-amber-500/40 text-amber-400 bg-amber-950/40"
                              }`}
                            >
                              {flag.severity} risk
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px] leading-relaxed">
                            {flag.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Study Checklist Card */}
            <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-xl border border-slate-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-violet-950/80 border border-violet-800/40 rounded-xl text-violet-400">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">
                      Study Checklist
                    </h3>
                    <p className="text-xs text-slate-500">
                      Interactive preparation targets curated for this role
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full md:w-64">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">
                      Topic Mastery Status
                    </span>
                    <span className="font-semibold text-violet-400 bg-violet-950/50 px-2 py-0.5 rounded border border-violet-800/30">
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-violet-600 to-teal-400 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 text-right mt-1.5">
                    {completedCount} of {totalCount} completed
                  </div>
                </div>
              </div>

              {/* Checklist items */}
              <div className="space-y-2.5">
                {checklist.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between gap-3.5 transition-all text-xs ${
                      item.completed
                        ? "border-teal-500/20 bg-teal-950/10 text-slate-400"
                        : "border-slate-800/80 hover:border-slate-700 bg-slate-950/20 hover:bg-slate-950/40 text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        {item.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-teal-400 fill-teal-950/30" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-slate-700 hover:border-slate-500 transition-colors" />
                        )}
                      </div>
                      <span
                        className={`leading-relaxed ${item.completed ? "line-through text-slate-500" : ""}`}
                      >
                        {item.topic}
                      </span>
                    </div>

                    <span
                      className={`shrink-0 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                        item.completed
                          ? "border-teal-500/30 text-teal-400 bg-teal-950/40"
                          : "border-slate-700/50 text-slate-500 bg-slate-900/30"
                      }`}
                    >
                      {item.completed ? "Acement ready" : "to learn"}
                    </span>
                  </button>
                ))}
              </div>

              {/* Encouragement banner */}
              {progressPercent === 100 && (
                <div className="mt-6 p-4 rounded-xl border border-teal-500/30 bg-teal-950/20 text-center animate-pulse">
                  <p className="text-teal-300 font-bold text-xs">
                    🎉 You are fully prepared to interview for this role! Go
                    crush it!
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-900 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg">
              <Sparkles className="h-4 w-4 text-violet-400" />
            </div>
            <span className="font-display font-semibold text-sm tracking-tight text-white">
              JD Decoder
            </span>
          </div>

          <p className="text-xs text-slate-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} JD Decoder. All rights reserved.
            Created by{" "}
            <a
              href="https://www.linkedin.com/in/arvindm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white underline inline-flex items-center gap-0.5 transition-colors"
            >
              Arvind M
            </a>
          </p>

          <a
            href="https://frontendprep.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Prep Tool: frontendprep.io
          </a>
        </div>
      </footer>
    </div>
  );
}
