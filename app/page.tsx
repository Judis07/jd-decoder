"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Input from "@/components/Input";
import TerminalLoader from "@/components/TerminalLoader";
import Results from "@/components/Results";
import HistorySidebar, { type SavedScan } from "@/components/HistorySidebar";
import { getPuter, decodeJobDescriptionWithAI } from "@/lib/puter";
import { type DecodedResult } from "./mockDecoder";

export default function Home() {
  const [puter, setPuter] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [scans, setScans] = useState<SavedScan[]>([]);
  const [activeScanId, setActiveScanId] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const [results, setResults] = useState<DecodedResult | null>(null);
  const [checklist, setChecklist] = useState<DecodedResult["studyChecklist"]>(
    [],
  );

  const resultsRef = useRef<HTMLDivElement>(null);

  const loadingSteps = [
    "[RUNNING] scanning text segments...",
    "[AI_MODEL] sending payload to Claude 3.5 Sonnet...",
    "[PARSING] separating must-haves from fluff...",
    "[ANALYZE] mapping seniority level ratios...",
    "[CHECK] flagging corporate jargon patterns...",
    "[PROCESS] generating custom study roadmap...",
  ];

  // Initialize Puter client-side
  useEffect(() => {
    async function initPuter() {
      const p = await getPuter();
      if (p) {
        setPuter(p);
        if (p.auth.isSignedIn()) {
          try {
            const u = await p.auth.getUser();
            setUser(u);
            loadScansFromPuter(p);
          } catch (e) {
            console.error("Failed to load authenticated user:", e);
            loadScansFromLocalStorage();
          }
        } else {
          loadScansFromLocalStorage();
        }
      } else {
        loadScansFromLocalStorage();
      }
    }
    initPuter();
  }, []);

  const loadScansFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem("jd_scans");
      if (stored) {
        setScans(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error reading scans from local storage:", e);
    }
  };

  const loadScansFromPuter = async (p: any) => {
    setIsHistoryLoading(true);
    try {
      // Fetch scan items from Puter key-value database matching the scan key prefix
      const items = await p.kv.list("jd_scan:*", true);
      if (Array.isArray(items)) {
        const parsedScans: SavedScan[] = items
          .map((item) => {
            try {
              return typeof item.value === "string" ? JSON.parse(item.value) : item.value;
            } catch {
              return item.value;
            }
          })
          .filter((s) => s && s.id && s.result)
          .sort((a, b) => b.timestamp - a.timestamp);
        setScans(parsedScans);
      }
    } catch (e) {
      console.error("Failed to load scans from Puter KV:", e);
      loadScansFromLocalStorage();
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!puter) return;
    setIsLoggingIn(true);
    try {
      await puter.auth.signIn();
      if (puter.auth.isSignedIn()) {
        const u = await puter.auth.getUser();
        setUser(u);
        await loadScansFromPuter(puter);
      }
    } catch (e) {
      console.error("Puter login failed:", e);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    if (!puter) return;
    puter.auth.signOut();
    setUser(null);
    setActiveScanId(null);
    setResults(null);
    setChecklist([]);
    loadScansFromLocalStorage();
  };

  const saveScan = async (newScan: SavedScan) => {
    // Save locally
    setScans((prev) => {
      const updated = [newScan, ...prev.filter((s) => s.id !== newScan.id)];
      try {
        localStorage.setItem("jd_scans", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to cache scans locally:", e);
      }
      return updated;
    });

    // Save to Puter KV cloud if user is signed in
    if (puter && puter.auth.isSignedIn()) {
      try {
        await puter.kv.set(`jd_scan:${newScan.id}`, JSON.stringify(newScan));
      } catch (e) {
        console.error("Failed to save scan to cloud database:", e);
      }
    }
  };

  const handleDecode = async (text: string) => {
    setIsAnalyzing(true);
    setCurrentLoadingStep(0);
    setResults(null);

    // Visual loader animation loop
    let stepIdx = 0;
    const loaderInterval = setInterval(() => {
      if (stepIdx < loadingSteps.length - 1) {
        stepIdx++;
        setCurrentLoadingStep(stepIdx);
      }
    }, 500);

    try {
      const decoded = await decodeJobDescriptionWithAI(text);

      clearInterval(loaderInterval);
      setCurrentLoadingStep(loadingSteps.length - 1);

      const scanId = `scan-${Date.now()}`;
      const newScan: SavedScan = {
        id: scanId,
        timestamp: Date.now(),
        roleTitle: decoded.roleTitle,
        result: decoded,
      };

      await saveScan(newScan);
      setActiveScanId(scanId);
      setResults(decoded);
      setChecklist(decoded.studyChecklist);
    } catch (err: any) {
      clearInterval(loaderInterval);
      alert(err.message || "Failed to decode job description.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectScan = (scan: SavedScan) => {
    setActiveScanId(scan.id);
    setResults(scan.result);
    setChecklist(scan.result.studyChecklist);
  };

  const handleDeleteScan = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Delete locally
    setScans((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem("jd_scans", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to update local cache:", e);
      }
      return updated;
    });

    if (activeScanId === id) {
      setActiveScanId(null);
      setResults(null);
      setChecklist([]);
    }

    // Delete from cloud if signed in
    if (puter && puter.auth.isSignedIn()) {
      try {
        await puter.kv.del(`jd_scan:${id}`);
      } catch (e) {
        console.error("Failed to delete scan from cloud database:", e);
      }
    }
  };

  // Scroll to results
  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [results]);

  const toggleChecklistItem = async (id: string) => {
    if (!results || !activeScanId) return;

    const updatedChecklist = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item,
    );

    setChecklist(updatedChecklist);

    const activeScan = scans.find((s) => s.id === activeScanId);
    if (activeScan) {
      const updatedScan: SavedScan = {
        ...activeScan,
        result: {
          ...activeScan.result,
          studyChecklist: updatedChecklist,
        },
      };
      await saveScan(updatedScan);
    }
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0D1117] text-[#C9D1D9] selection:bg-[#30363D]">
      <Header
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoggingIn={isLoggingIn}
      />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Hero />

        <HistorySidebar
          scans={scans}
          activeScanId={activeScanId}
          onSelectScan={handleSelectScan}
          onDeleteScan={handleDeleteScan}
          isLoggedIn={!!user}
          onLogin={handleLogin}
          isLoading={isHistoryLoading}
        />

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
