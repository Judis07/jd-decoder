"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Input from "@/components/Input";
import TerminalLoader from "@/components/TerminalLoader";
import Results from "@/components/Results";
import { decodeJobDescription, type DecodedResult } from "./mockDecoder";

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const [results, setResults] = useState<DecodedResult | null>(null);
  const [checklist, setChecklist] = useState<DecodedResult["studyChecklist"]>(
    [],
  );

  const resultsRef = useRef<HTMLDivElement>(null);

  const loadingSteps = [
    "[RUNNING] scanning text segments...",
    "[PARSING] separating must-haves from fluff...",
    "[ANALYZE] mapping seniority level ratios...",
    "[CHECK] flagging corporate jargon patterns...",
    "[PROCESS] generating custom study roadmap...",
  ];

  const handleDecode = (text: string) => {
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
        const decoded = decodeJobDescription(text);
        setResults(decoded);
        setChecklist(decoded.studyChecklist);
        setIsAnalyzing(false);
      }
    }, 300);
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
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0D1117] text-[#C9D1D9] selection:bg-[#30363D]">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Hero />

        <Input isAnalyzing={isAnalyzing} onDecode={handleDecode} />

        <TerminalLoader
          isAnalyzing={isAnalyzing}
          currentLoadingStep={currentLoadingStep}
          loadingSteps={loadingSteps}
        />

        {results && !isAnalyzing && (
          <Results
            results={results}
            checklist={checklist}
            progressPercent={progressPercent}
            toggleChecklistItem={toggleChecklistItem}
            resultsRef={resultsRef}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
