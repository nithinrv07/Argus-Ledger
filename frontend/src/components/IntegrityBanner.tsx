import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Binary,
  CheckCircle2,
  AlertTriangle,
  Flame,
  RotateCcw,
} from 'lucide-react';
import { LedgerIntegrityStatus } from '../types/ledger';

interface IntegrityBannerProps {
  status: LedgerIntegrityStatus;
  onVerifyClick: () => void;
  onToggleTamper: () => void;
  isTampered: boolean;
  totalDecisionsCount: number;
}

export const IntegrityBanner: React.FC<IntegrityBannerProps> = ({
  status,
  onVerifyClick,
  onToggleTamper,
  isTampered,
  totalDecisionsCount,
}) => {
  return (
    <div
      id="integrity-status-banner"
      className={`relative overflow-hidden rounded-3xl p-5 mb-6 transition-all duration-300 border shadow-sm ${
        status.isValid
          ? 'bg-gradient-to-r from-[#205248] via-[#265e53] to-[#2f7063] text-white border-emerald-600/30'
          : 'bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-white border-rose-500/50 animate-pulse'
      }`}
    >
      <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none blur-2xl" />
      <div className="absolute right-32 top-0 w-32 h-32 rounded-full bg-emerald-300/5 pointer-events-none blur-xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
              status.isValid
                ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-300/30'
                : 'bg-rose-500/30 text-rose-300 border border-rose-400/40'
            }`}
          >
            {status.isValid ? (
              <ShieldCheck className="w-6 h-6 text-[#9ef2db]" />
            ) : (
              <ShieldAlert className="w-6 h-6 text-rose-300" />
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/10 text-emerald-200 border border-white/10 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ENDPOINT: /verify-ledger/
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  status.isValid
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-rose-500/30 text-rose-200 border border-rose-400/40'
                }`}
              >
                {status.isValid ? 'SECURE & UNTAMPERED' : 'CRYPTOGRAPHIC BREACH DETECTED'}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold mt-1 text-white tracking-tight flex items-center gap-2">
              {status.isValid ? (
                <>Cryptographic Hash Chain Intact</>
              ) : (
                <>Tampered Ledger Block Detected</>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/80 mt-0.5 max-w-2xl leading-relaxed">
              {status.isValid ? (
                <>
                  Continuous real-time verification confirms all{' '}
                  <span className="font-semibold text-white">
                    {totalDecisionsCount.toLocaleString()}
                  </span>{' '}
                  blocks are strictly sequenced with SHA-256 parent pointer hashes and Ed25519 digital signatures. Zero state anomalies detected.
                </>
              ) : (
                <>
                  CRITICAL: Hash mismatch at Block #{status.brokenBlockIndex ?? 'N/A'}. Parent pointer hash does not match mathematical consensus. Chain validation halted!
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0 shrink-0">
          <div className="hidden xl:flex flex-col text-right pr-3 border-r border-white/15">
            <span className="text-[11px] text-emerald-200/70 uppercase tracking-wider font-mono">
              Merkle Root
            </span>
            <span className="text-xs font-mono text-white/90">
              {status.latestBlockHash ? `${status.latestBlockHash.slice(0, 10)}...${status.latestBlockHash.slice(-8)}` : '0x8f7...92fa'}
            </span>
          </div>

          <button
            onClick={onVerifyClick}
            id="btn-trigger-ledger-audit"
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#265e53] hover:bg-emerald-50 text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Verify Proof Tree</span>
          </button>

          <button
            onClick={onToggleTamper}
            id="btn-tamper-simulation-toggle"
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              isTampered
                ? 'bg-amber-400 text-slate-900 border-amber-300 hover:bg-amber-300'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
            title="Simulate adversarial block modification to test cryptographic chain defense"
          >
            {isTampered ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 text-slate-900" />
                <span>Restore Chain</span>
              </>
            ) : (
              <>
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                <span>Test Tamper Attack</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
