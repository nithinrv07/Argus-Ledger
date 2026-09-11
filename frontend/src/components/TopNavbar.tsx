import React from 'react';
import {
  Search,
  Settings,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { LedgerIntegrityStatus } from '../types/ledger';

interface TopNavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenVerifyModal?: () => void;
  onOpenSimulateModal?: () => void;
  integrityStatus?: LedgerIntegrityStatus;
  isVerifying: boolean;
  onRefresh: () => void;
  isBackendConnected?: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenVerifyModal,
  onOpenSimulateModal,
  integrityStatus,
  isVerifying,
  onRefresh,
  isBackendConnected = false,
}) => {
  return (
    <header
      id="aegis-top-navbar"
      className="sticky top-0 z-20 bg-[#f0f6f4]/95 backdrop-blur-md px-6 py-4 flex items-center justify-between gap-4 border-b border-emerald-900/5 transition-all"
    >
      {/* Left Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or type command (Transaction ID, Agent, Policy)..."
            className="w-full pl-10 pr-12 py-2.5 bg-white rounded-full text-sm text-slate-700 placeholder-slate-400 shadow-sm border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-[#265e53]/30 focus:border-[#265e53] transition-all"
          />
          <div className="absolute right-3 hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Controls & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Backend Connectivity Status Pill */}
        <div 
          id="badge-backend-status"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 shadow-sm"
          title={isBackendConnected ? "Connected to live FastAPI backend at http://127.0.0.1:8000" : "Offline mode (using client fallback)"}
        >
          <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-slate-600 font-mono text-[11px]">
            {isBackendConnected ? 'API :8000 LIVE' : 'CLIENT STANDBY'}
          </span>
        </div>



        {/* Refresh Sync Button */}
        <button
          onClick={onRefresh}
          id="btn-refresh-feed"
          className={`w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-200/80 shadow-sm transition-transform active:scale-95 ${
            isVerifying ? 'animate-spin text-emerald-600' : ''
          }`}
          title="Re-verify ledger chain"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Settings Button */}
        <button
          onClick={() => alert('Governance Ledger Settings: Cryptographic Suite Ed25519-SHA256, Merkle Patricia Tree v2.1, Zero-Knowledge Oracle v4.')}
          id="btn-top-settings"
          className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-200/80 shadow-sm transition-colors"
          title="Configuration"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button
          onClick={() => alert('Active Audit Alerts: 0 Critical, 2 Human-in-the-Loop Reviews Pending.')}
          id="btn-top-notifications"
          className="relative w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-200/80 shadow-sm transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#f5b842]" />
        </button>

        {/* User Profile Pill - Matching "Michael Smith" from reference design */}
        <div
          id="user-profile-pill"
          className="flex items-center gap-2.5 pl-2 pr-3 py-1 bg-white rounded-full border border-slate-200/80 shadow-sm cursor-pointer hover:border-emerald-300 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#265e53] to-[#488e7f] text-white text-xs font-bold flex items-center justify-center shadow-inner">
            MS
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 leading-tight">
              Michael Smith
            </span>
            <span className="text-[10px] text-slate-400 font-medium leading-none">
              Chief AI Auditor
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
