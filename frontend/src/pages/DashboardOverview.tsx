import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Zap,
  Clock,
  ArrowUpRight,
  Sparkles,
  Download,
  Flame,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  AlertOctagon,
  Eye,
  Sliders,
  Check,
} from 'lucide-react';
import { LedgerDecision, LedgerIntegrityStatus } from '../types/ledger';
import { TabType } from '../components/Sidebar';
import { IntegrityBanner } from '../components/IntegrityBanner';
import { exportSignedLedgerJSON } from '../utils/cryptoLedger';

interface DashboardOverviewProps {
  decisions: LedgerDecision[];
  integrityStatus: LedgerIntegrityStatus;
  onNavigateTab: (tab: TabType) => void;
  onSelectDecision: (decisionId: string) => void;
  onOpenVerifyModal: () => void;
  onOpenSimulateModal: () => void;
  onToggleTamper: () => void;
  isTampered: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  decisions,
  integrityStatus,
  onNavigateTab,
  onSelectDecision,
  onOpenVerifyModal,
  onOpenSimulateModal,
  onToggleTamper,
  isTampered,
}) => {
  const [profitTimeframe, setProfitTimeframe] = useState<'Day' | 'Week' | 'Month'>('Week');
  const [copiedKey, setCopiedKey] = useState(false);

  const totalDecisions = decisions.length;
  const autonomousCount = decisions.filter((d) => d.executionMode === 'AUTONOMOUS').length;
  const hitlCount = decisions.filter((d) => d.executionMode === 'HITL').length;
  const autonomousPercentage = decisions.length > 0 ? ((autonomousCount / decisions.length) * 100).toFixed(1) : '100.0';
  const hitlPercentage = decisions.length > 0 ? ((hitlCount / decisions.length) * 100).toFixed(1) : '0.0';

  const avgConfidence = decisions.length > 0
    ? ((decisions.reduce((acc, curr) => acc + curr.confidenceScore, 0) / decisions.length) * 100).toFixed(1)
    : '0.0';

  const recentFeed = decisions.slice(0, 5);

  const handleCopyKey = () => {
    navigator.clipboard.writeText('ed25519:pub:7f8a9101b2e3c4d5e6f7a8b9c0d1e2f3');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div id="dashboard-overview-page" className="space-y-6 animate-in fade-in duration-300">
      <IntegrityBanner
        status={integrityStatus}
        onVerifyClick={onOpenVerifyModal}
        onToggleTamper={onToggleTamper}
        isTampered={isTampered}
        totalDecisionsCount={totalDecisions}
      />

      <div className="bg-gradient-to-r from-[#265e53] to-[#183d35] rounded-3xl p-5 sm:p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-800/40">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner shrink-0">
            <Zap className="w-6 h-6 text-[#f5b842]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Live Decision Studio & Explainer
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#f5b842] text-slate-950 font-mono font-bold text-[10px]">
                INTERACTIVE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-0.5">
              Enter custom transaction amounts, roles, and prompts to see ARGUS AI decisions and XAI reasoning in real time.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('studio')}
          id="btn-open-studio-banner"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#f5b842] hover:bg-[#e69828] text-slate-950 font-bold text-xs rounded-full transition-all shadow-md active:scale-95 shrink-0"
        >
          <span>Enter Data & Run AI</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-emerald-950/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Cryptographic Key & Vault
              <button
                onClick={onOpenSimulateModal}
                className="text-xs font-semibold text-[#265e53] hover:underline flex items-center gap-1"
              >
                <span>Add new</span>
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-[#265e53] inline-flex items-center justify-center text-[10px] font-bold">
                  +
                </span>
              </button>
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              What would you like to do?
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-[#2a6d5f] via-[#215a4e] to-[#1a493f] text-white shadow-md shadow-emerald-900/10">
              <div className="absolute inset-0 opacity-15 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 400 240" fill="none">
                  <path
                    d="M-20 60 C80 20, 160 100, 240 40 C320 -20, 360 80, 420 50"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <path
                    d="M-20 120 C80 80, 160 160, 240 100 C320 40, 360 140, 420 110"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <path
                    d="M-20 180 C80 140, 160 220, 240 160 C320 100, 360 200, 420 170"
                    stroke="white"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div className="relative z-10 flex flex-col justify-between h-36">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-100/90 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>Aegis Sovereign Node</span>
                  </div>
                  <span className="text-xs font-bold font-mono tracking-widest bg-white/20 px-2 py-0.5 rounded text-white">
                    HSM-v4
                  </span>
                </div>

                <div className="font-mono text-sm tracking-wider text-emerald-100/90 flex items-center justify-between">
                  <span>1489 •••• 9101 1121</span>
                  <div className="w-7 h-5 rounded bg-amber-400/80 border border-amber-300/40 opacity-90 shadow-inner" />
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[10px] text-emerald-200/70 uppercase tracking-wider font-medium">
                      Cryptographic Ledger Height
                    </div>
                    <div className="text-xl font-extrabold text-white tracking-tight">
                      #{totalDecisions.toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={onOpenVerifyModal}
                    className="text-xs font-semibold text-emerald-200 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>View details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 grid grid-cols-3 gap-2.5">
              <button
                onClick={onOpenVerifyModal}
                id="action-verify-btn"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#f4f9f7] hover:bg-[#eaf4f0] border border-emerald-900/5 transition-all text-slate-700 hover:text-[#265e53] group"
              >
                <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#265e53] group-hover:scale-110 transition-transform mb-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-center">Verify</span>
              </button>

              <button
                onClick={onOpenSimulateModal}
                id="action-simulate-btn"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#f4f9f7] hover:bg-[#eaf4f0] border border-emerald-900/5 transition-all text-slate-700 hover:text-[#265e53] group"
              >
                <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#265e53] group-hover:scale-110 transition-transform mb-1.5">
                  <Sparkles className="w-4 h-4 text-[#e69828]" />
                </div>
                <span className="text-xs font-semibold text-center">Inject</span>
              </button>

              <button
                onClick={() => exportSignedLedgerJSON(decisions)}
                id="action-export-btn"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#f4f9f7] hover:bg-[#eaf4f0] border border-emerald-900/5 transition-all text-slate-700 hover:text-[#265e53] group"
              >
                <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#265e53] group-hover:scale-110 transition-transform mb-1.5">
                  <Download className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-center">Export</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-emerald-950/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Model Confidence Velocity
              </h3>
              <p className="text-xs text-slate-400">Continuous scoring trajectory</p>
            </div>

            <div className="flex items-center bg-slate-100/80 p-0.5 rounded-full text-xs font-medium text-slate-600">
              {(['Day', 'Week', 'Month'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setProfitTimeframe(t)}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    profitTimeframe === t
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="relative h-28 my-2">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 300 80"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#265e53" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#265e53" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 50 C 40 25, 70 65, 110 40 C 150 15, 180 60, 220 30 C 260 5, 280 20, 300 12 L 300 80 L 0 80 Z"
                fill="url(#profitGrad)"
              />
              <path
                d="M 0 50 C 40 25, 70 65, 110 40 C 150 15, 180 60, 220 30 C 260 5, 280 20, 300 12"
                fill="none"
                stroke="#265e53"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="220" cy="30" r="4.5" fill="#265e53" className="animate-ping opacity-75" />
              <circle cx="220" cy="30" r="3.5" fill="#f5b842" stroke="white" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
            <span>Aggregated Confidence: <strong className="text-slate-800 font-bold">{avgConfidence}%</strong></span>
            <button
              onClick={() => onNavigateTab('analytics')}
              className="text-[#265e53] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Show all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-emerald-950/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#265e53] flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-800">Total Decisions</span>
            </div>
            <span className="text-xs text-slate-400">Lifetime</span>
          </div>

          <div className="h-14 my-3">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 200 40"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#488e7f" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#488e7f" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 30 C 50 10, 100 35, 150 15 C 180 5, 190 10, 200 8 L 200 40 L 0 40 Z"
                fill="url(#incomeGrad)"
              />
              <path
                d="M 0 30 C 50 10, 100 35, 150 15 C 180 5, 190 10, 200 8"
                fill="none"
                stroke="#265e53"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {totalDecisions.toLocaleString()}
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              +14.8% ↑
            </span>
          </div>
        </div>

        <div className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-emerald-950/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#265e53] flex items-center justify-center font-bold">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-800">Autonomous vs HITL</span>
            </div>
            <span className="text-xs text-slate-400">Execution Mode</span>
          </div>

          <div className="h-14 my-3">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 200 40"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e69828" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#e69828" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 15 C 40 25, 90 5, 140 28 C 170 38, 190 20, 200 24 L 200 40 L 0 40 Z"
                fill="url(#expGrad)"
              />
              <path
                d="M 0 15 C 40 25, 90 5, 140 28 C 170 38, 190 20, 200 24"
                fill="none"
                stroke="#327567"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {autonomousPercentage}%
              </span>
              <span className="text-xs text-slate-400 font-medium ml-1">Auto</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {hitlPercentage}% HITL
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-emerald-950/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#265e53] flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-800">Decision Statistics</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Monthly</span>
          </div>

          <div className="flex items-end justify-between h-20 px-1 pt-3">
            {[
              { label: 'Jan', totalH: 70, yellowH: 30 },
              { label: 'Feb', totalH: 85, yellowH: 45 },
              { label: 'Mar', totalH: 60, yellowH: 20 },
              { label: 'Apr', totalH: 95, yellowH: 65 },
              { label: 'May', totalH: 75, yellowH: 35 },
              { label: 'Jun', totalH: 65, yellowH: 25 },
              { label: 'Jul', totalH: 90, yellowH: 55 },
              { label: 'Aug', totalH: 80, yellowH: 40 },
              { label: 'Sep', totalH: 100, yellowH: 75 },
            ].map((bar, idx) => (
              <div key={bar.label} className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-2.5 sm:w-3 bg-emerald-100/60 rounded-full h-14 flex flex-col justify-end overflow-hidden">
                  <div
                    className="w-full bg-[#f3b73e] rounded-b-full transition-all duration-500"
                    style={{ height: `${bar.yellowH}%` }}
                    title={`${bar.label}: ${bar.yellowH}% Flagged/Reviewed`}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{bar.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-200" />
              Autonomous Cleared
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f3b73e]" />
              HITL Reviews
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-emerald-950/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Governance Milestones
            </h3>
            <button
              onClick={() => onNavigateTab('analytics')}
              className="text-xs font-semibold text-[#265e53] hover:underline flex items-center gap-1"
            >
              <span>Add goal</span>
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-[#265e53] inline-flex items-center justify-center text-[10px] font-bold">
                +
              </span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#f4f9f7] border border-emerald-900/5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                <span>ISO-42001 Hash Coverage</span>
                <span className="text-[#265e53]">99.8% / 100%</span>
              </div>
              <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
                <div className="bg-[#265e53] h-full rounded-full w-[99.8%]" />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f4f9f7] border border-emerald-900/5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                <span>Zero-Trust HITL Containment</span>
                <span className="text-[#e69828]">100% / 100%</span>
              </div>
              <div className="w-full bg-amber-100 rounded-full h-2 overflow-hidden">
                <div className="bg-[#f3b73e] h-full rounded-full w-full" />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f4f9f7] border border-emerald-900/5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                <span>Average Decision Latency &lt; 150ms</span>
                <span className="text-[#265e53]">114ms</span>
              </div>
              <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
                <div className="bg-[#265e53] h-full rounded-full w-[82%]" />
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Audited by Sentinel Engine</span>
            <span className="text-emerald-700 font-semibold">Active & Healthy</span>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-emerald-950/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Recent Activity Feed
              </h3>
              <p className="text-xs text-slate-400">5 most recent agent decisions</p>
            </div>
            <button
              onClick={() => onNavigateTab('ledger')}
              className="text-xs font-semibold text-[#265e53] hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentFeed.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <p className="font-semibold text-slate-600">No decisions in ledger yet</p>
                <p>Run your first autonomous decision in the Live Decision Studio.</p>
                <button
                  type="button"
                  onClick={() => onNavigateTab('studio')}
                  className="px-3 py-1.5 bg-[#265e53] hover:bg-[#1b433b] text-white rounded-full text-xs font-bold mt-1"
                >
                  Open Decision Studio
                </button>
              </div>
            ) : (
              recentFeed.map((decision) => {
              const isAllow = decision.outcome === 'ALLOW';
              const isReview = decision.outcome === 'REVIEW';
              const isBlock = decision.outcome === 'BLOCK';

              return (
                <div
                  key={decision.id}
                  onClick={() => {
                    onSelectDecision(decision.id);
                    onNavigateTab('inspector');
                  }}
                  id={`recent-decision-${decision.id}`}
                  className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#f4f9f7] cursor-pointer transition-colors border border-transparent hover:border-emerald-100 group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full shrink-0 ${
                        isAllow
                          ? 'bg-emerald-500 ring-4 ring-emerald-100'
                          : isReview
                          ? 'bg-[#f3b73e] ring-4 ring-amber-100'
                          : 'bg-rose-500 ring-4 ring-rose-100'
                      }`}
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-[#265e53] transition-colors flex items-center gap-1.5">
                        <span>{decision.agentName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {decision.id}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(decision.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}{' '}
                        • {decision.actionType}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isAllow
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isReview
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {decision.outcome}
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {decision.latencyMs}ms • {(decision.confidenceScore * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              );
            }))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Stream synchronized</span>
            <span className="font-mono text-[11px]">Real-time feed live</span>
          </div>
        </div>

        <div className="lg:col-span-3 bg-gradient-to-br from-[#f8fcfa] to-[#edf7f4] rounded-3xl p-6 shadow-sm border border-emerald-900/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#265e53] text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6 text-[#9ef2db]" />
              </div>
              <span className="text-[10px] font-mono font-bold text-[#265e53] bg-white px-2 py-1 rounded-full border border-emerald-200">
                NIST FIPS 180-4
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Cryptographic Anchor
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Every decision receipt is mathematically sealed with a Merkle Patricia proof, preventing retroactive alteration by any agent or human.
            </p>
          </div>

          <div className="space-y-2 mt-4">
            <button
              onClick={onOpenVerifyModal}
              id="dashboard-verify-audit-cta"
              className="w-full py-2.5 px-4 bg-[#265e53] hover:bg-[#1e4e44] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-[#f5b842]" />
              <span>Verify Proof Chain</span>
            </button>

            <button
              onClick={() => exportSignedLedgerJSON(decisions)}
              id="dashboard-export-cta"
              className="w-full py-2 px-4 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Download Auditor JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
