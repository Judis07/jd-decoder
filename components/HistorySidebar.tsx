import React from "react";
import { Clock, Trash2, Database, AlertCircle, FileText } from "lucide-react";
import { type DecodedResult } from "@/app/mockDecoder";

export interface SavedScan {
  id: string;
  timestamp: number;
  roleTitle: string;
  result: DecodedResult;
}

interface HistorySidebarProps {
  scans: SavedScan[];
  activeScanId: string | null;
  onSelectScan: (scan: SavedScan) => void;
  onDeleteScan: (id: string, e: React.MouseEvent) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  isLoading: boolean;
}

const HistorySidebar = ({
  scans,
  activeScanId,
  onSelectScan,
  onDeleteScan,
  isLoggedIn,
  onLogin,
  isLoading,
}: HistorySidebarProps) => {
  const formatRelativeTime = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <section className="mb-8 border border-[#30363D] bg-[#161B22] rounded-lg overflow-hidden">
      {/* Panel Header */}
      <div className="bg-[#161B22] border-b border-[#30363D] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-3.5 w-3.5 text-[#D4933A]" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#8B949E]">
            scans_history.db ({scans.length})
          </span>
        </div>
        {!isLoggedIn && (
          <span className="font-mono text-[9px] text-[#8B949E] flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-[#D4933A]" />
            Local mode (not synced)
          </span>
        )}
      </div>

      <div className="p-3 bg-[#0D1117]">
        {/* Sync notification if logged out */}
        {!isLoggedIn && (
          <div className="mb-3 p-2.5 border border-[#D4933A]/20 bg-[#D4933A]/5 rounded font-mono text-[10px] text-[#8B949E] flex items-center justify-between gap-3">
            <span>Sign in to store your scan history securely in the cloud.</span>
            <button
              onClick={onLogin}
              className="text-[#D4933A] hover:underline cursor-pointer flex-shrink-0 font-bold"
            >
              [SIGN_IN]
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="py-4 text-center text-xs font-mono text-[#8B949E]">
            Loading historical data...
          </div>
        ) : scans.length === 0 ? (
          <div className="py-4 text-center text-xs font-mono text-[#8B949E] flex flex-col items-center justify-center gap-1.5">
            <FileText className="h-5 w-5 text-[#30363D]" />
            <span>No scan history found. Decode a JD to create an entry.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[190px] overflow-y-auto pr-1 no-scrollbar">
            {scans.map((scan) => {
              const isActive = scan.id === activeScanId;
              return (
                <div
                  key={scan.id}
                  onClick={() => onSelectScan(scan)}
                  className={`group relative p-2.5 border rounded flex items-center justify-between gap-3 cursor-pointer transition-all duration-150 ${
                    isActive
                      ? "border-[#D4933A] bg-[#161B22] text-[#F0F6FC]"
                      : "border-[#30363D] bg-[#161B22]/40 hover:bg-[#161B22] text-[#C9D1D9]"
                  }`}
                >
                  <div className="min-w-0 flex-grow pr-4">
                    <div className="font-mono text-xs font-semibold truncate leading-normal">
                      {scan.roleTitle}
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#8B949E] mt-1">
                      <Clock className="h-2.5 w-2.5" />
                      <span>{formatRelativeTime(scan.timestamp)}</span>
                      <span>•</span>
                      <span className="text-[#D4933A]">{scan.result.seniority}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => onDeleteScan(scan.id, e)}
                    className="absolute top-2.5 right-2 text-[#8B949E] hover:text-[#FF5F56] p-1 rounded opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-[#30363D]/50 cursor-pointer"
                    title="Delete Scan"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default HistorySidebar;
