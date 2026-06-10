import React from "react";
import { TrendingUp } from "lucide-react";
import { type DecodedResult } from "@/app/mockDecoder";

interface ResultsProps {
  results: DecodedResult;
  checklist: DecodedResult["studyChecklist"];
  progressPercent: number;
  toggleChecklistItem: (id: string) => void;
  resultsRef: React.RefObject<HTMLDivElement | null>;
}

const Results = ({
  results,
  checklist,
  progressPercent,
  toggleChecklistItem,
  resultsRef,
}: ResultsProps) => {
  return (
    <section ref={resultsRef} className="space-y-6 animate-fade-in-up">
      {/* Header Banner */}
      <div className="border border-[#30363D] bg-[#161B22] rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[10px] uppercase font-bold text-[#8B949E] border border-[#30363D] px-1.5 py-0.2 rounded bg-[#0D1117]">
              OUTPUT_STRIPPED
            </span>
            <span className="font-mono text-[10px] text-[#8B949E] flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              {results.confidence}% match confidence
            </span>
          </div>
          <h2 className="font-mono font-bold text-xl sm:text-2xl text-[#F0F6FC] tracking-tight">
            {results.roleTitle}
          </h2>
        </div>

        <div className="flex items-center gap-3 bg-[#0D1117] border border-[#30363D] px-3.5 py-1.5 rounded-lg self-start md:self-auto">
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase text-[#8B949E] tracking-wider">
              seniority
            </div>
            <div className="font-mono text-sm font-bold text-[#F0F6FC]">
              {results.seniority}
            </div>
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
            <p className="text-sm text-[#C9D1D9] leading-relaxed font-medium mb-4">
              {results.summary}
            </p>

            {/* Candid Translation Pane */}
            <div className="border border-[#30363D] bg-[#0D1117] p-3.5 rounded-lg">
              <div className="font-mono text-[9px] text-[#8B949E] uppercase tracking-wider mb-1">
                candid translation:
              </div>
              <p className="text-sm sm:text-base text-[#8B949E] italic leading-relaxed font-medium">
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
                <span className="text-[#F0F6FC] font-semibold">
                  {results.seniority}
                </span>
              </div>

              {/* Visual Meter */}
              <div className="h-1.5 w-full bg-[#30363D] rounded-sm overflow-hidden flex">
                <div
                  className={`h-full bg-[#8B949E] transition-all duration-300 ${
                    results.seniority === "Junior"
                      ? "w-1/4"
                      : results.seniority === "Mid-Level"
                        ? "w-2/4"
                        : results.seniority === "Senior"
                          ? "w-3/4"
                          : "w-full"
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
            <p className="text-xs sm:text-sm text-[#8B949E] leading-relaxed font-medium">
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
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#F0F6FC] mb-2 font-bold">
                [+] must-have competencies
              </div>
              <ul className="space-y-1.5 font-mono text-xs sm:text-sm text-[#C9D1D9] font-medium">
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
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#8B949E] mb-2 font-bold">
                [?] nice-to-have options
              </div>
              <ul className="space-y-1.5 font-mono text-xs sm:text-sm text-[#8B949E] font-medium">
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
              <div
                key={index}
                className="border border-[#30363D] bg-[#0D1117] p-3 rounded-lg"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs sm:text-sm text-[#F0F6FC] font-bold">
                    {flag.flag}
                  </span>
                  <span
                    className={`font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.2 border ${
                      flag.severity === "high" ||
                      flag.severity === "medium"
                        ? "border-[#D4933A]/40 text-[#D4933A] bg-[#D4933A]/5"
                        : "border-[#30363D] text-[#8B949E] bg-[#161B22]"
                    }`}
                  >
                    {flag.severity}_risk
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#8B949E] leading-relaxed font-medium">
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
            <div className="text-xs text-[#8B949E] mt-0.5">
              Select items to mark target study goals
            </div>
          </div>

          {/* Progress metrics */}
          <div className="w-full md:w-56">
            <div className="flex justify-between items-center font-mono text-[10px] mb-1">
              <span className="text-[#8B949E]">Status:</span>
              <span className="text-[#D4933A] font-semibold">
                {progressPercent}% done
              </span>
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
              className={`w-full text-left font-mono text-[11px] sm:text-xs p-2.5 border rounded flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                item.completed
                  ? "border-[#30363D] bg-[#161B22]/20 text-[#8B949E]"
                  : "border-[#30363D] bg-[#0D1117] hover:bg-[#161B22] text-[#C9D1D9]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                    item.completed
                      ? "border-[#30363D] bg-[#30363D]"
                      : "border-[#D4933A] bg-[#0D1117]"
                  }`}
                >
                  {item.completed && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B949E]" />
                  )}
                </div>
                <span
                  className={
                    item.completed ? "line-through text-[#8B949E]" : ""
                  }
                >
                  {item.topic}
                </span>
              </div>

              <span
                className={`text-[8px] uppercase tracking-wider ${
                  item.completed ? "text-[#8B949E]" : "text-[#D4933A]"
                }`}
              >
                {item.completed ? "ready" : "todo"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Results;
