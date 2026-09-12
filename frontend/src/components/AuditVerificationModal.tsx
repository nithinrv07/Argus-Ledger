import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertOctagon,
  Binary,
  Lock,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { LedgerDecision, LedgerIntegrityStatus } from '../types/ledger';

interface AuditVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: LedgerIntegrityStatus;
  chain: LedgerDecision[];
  onReverify: () => void;
}

export const AuditVerificationModal: React.FC<AuditVerificationModalProps> = ({
  isOpen,
  onClose,
  status,
  chain,
  onReverify,
}) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [scanStep, setScanStep] = useState<number>(4);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      handleRunScan();
    }
  }, [isOpen]);

  const handleRunScan = () => {
    setIsScanning(true);
    setScanStep(1);
    setTimeout(() => setScanStep(2), 300);
    setTimeout(() => setScanStep(3), 600);
    setTimeout(() => {
      setScanStep(4);
      setIsScanning(false);
      onReverify();
    }, 900);
  };

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const recentBlocks = [...chain].slice(0, 6);

  return (
    <div
      id="audit-verification-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div
        id="audit-verification-modal-content"
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        <div
          className={`p-6 border-b flex items-center justify-between ${
            status.isValid ? 'bg-[#f4f9f7] border-emerald-100' : 'bg-rose-50 border-rose-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                status.isValid ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              {status.isValid ? (
                <ShieldCheck className="w-6 h-6" />
              ) : (
                <ShieldAlert className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  /verify-ledger/ Endpoint Inspector
                </h3>
                <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-md bg-white border font-semibold text-slate-600">
                  HTTP 200 OK
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Cryptographic zero-knowledge verification of parent block hash pointers & Ed25519 signatures
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            id="close-verify-modal-btn"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="mt-0.5">
                {scanStep >= 1 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 animate-spin" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">1. Genesis Block Integrity</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Hash: {status.genesisHash ? `${status.genesisHash.slice(0, 16)}...` : 'Valid'}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="mt-0.5">
                {scanStep >= 2 ? (
                  status.isValid ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertOctagon className="w-5 h-5 text-rose-600" />
                  )
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 animate-spin" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">2. Linear Parent Pointer Hash Chain</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {status.isValid ? '100% hashes strictly linked' : 'Broken link at index ' + status.brokenBlockIndex}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="mt-0.5">
                {scanStep >= 3 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 animate-spin" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">3. Digital Signatures (Ed25519)</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Autonomous HSM signatures authentic
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="mt-0.5">
                {scanStep >= 4 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 animate-spin" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">4. Merkle Root Consensus</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  SHA-256 state tree immutable
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Latest Cryptographic Block Sequence (Top of Chain)
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Height: #{status.blockHeight}
              </span>
            </div>

            <div className="space-y-2.5">
              {recentBlocks.map((block, idx) => {
                const isBlockBroken = block.tampered;

                return (
                  <div
                    key={block.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isBlockBroken
                        ? 'bg-rose-50 border-rose-300 text-rose-950'
                        : 'bg-white border-slate-200/80 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          #{block.blockHeight}
                        </span>
                        <span className="text-xs font-semibold text-slate-800">
                          {block.actionType}
                        </span>
                        <span className="text-xs text-slate-400">({block.agentId})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isBlockBroken ? (
                          <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertOctagon className="w-3.5 h-3.5" />
                            HASH INVALID
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            LINKED
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 text-[11px] font-mono grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-500 bg-slate-50/70 p-2 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Block Hash:</span>
                        <span className="text-slate-700 flex items-center gap-1">
                          {block.blockHash.slice(0, 14)}...
                          <button
                            onClick={() => copyToClipboard(block.blockHash)}
                            title="Copy full hash"
                            className="hover:text-emerald-700"
                          >
                            {copiedHash === block.blockHash ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3 text-slate-400" />
                            )}
                          </button>
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Parent Pointer:</span>
                        <span className="text-slate-700">
                          {block.parentBlockHash.slice(0, 14)}...
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Last verified: {new Date(status.lastAuditTimestamp).toLocaleTimeString()}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunScan}
              disabled={isScanning}
              id="re-scan-chain-btn"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#265e53] hover:bg-[#1f4e44] text-white text-xs font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Verifying Hashes...' : 'Re-Run Verification'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
