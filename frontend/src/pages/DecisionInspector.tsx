import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertOctagon,
  ShieldAlert,
  ShieldCheck,
  Copy,
  Check,
  FileCode,
  Layers,
  ArrowRight,
  Terminal,
  Activity,
  Cpu,
  Lock,
  Binary,
  Clock,
  Sparkles,
  Trash2,
  ScanEye,
} from 'lucide-react';
import { LedgerDecision, ReasoningStep } from '../types/ledger';

interface DecisionInspectorProps {
  decisions: LedgerDecision[];
  selectedDecisionId: string | null;
  onSelectDecision: (id: string) => void;
  onDeleteDecision?: (id: string) => void;
}

export const DecisionInspector: React.FC<DecisionInspectorProps> = ({
  decisions,
  selectedDecisionId,
  onSelectDecision,
  onDeleteDecision,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedProof, setCopiedProof] = useState(false);
  const [viewTab, setViewTab] = useState<'narrative' | 'payload' | 'crypto'>('narrative');

  const currentDecision =
    decisions.find((d) => d.id === selectedDecisionId) || decisions[0];

  const filteredList = decisions.filter((d) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      d.id.toLowerCase().includes(q) ||
      d.agentName.toLowerCase().includes(q) ||
      d.actionType.toLowerCase().includes(q) ||
      d.outcome.toLowerCase().includes(q)
    );
  });

  const handleCopyJson = (data: any, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  const isAllow = currentDecision?.outcome === 'ALLOW';
  const isReview = currentDecision?.outcome === 'REVIEW';
  const isBlock = currentDecision?.outcome === 'BLOCK';

  return (
    <div id="decision-inspector-page" className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-950/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Decision Inspector & Explainer
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#265e53] text-xs font-bold font-mono border border-emerald-200">
              Page 3
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Deep-dive forensic inspection of individual autonomous decisions. Inspect raw input payloads alongside resulting risk scores, policy guardrails, and the step-by-step explainer narrative.
          </p>
        </div>

        {currentDecision && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
              Viewing: <strong className="text-slate-900">{currentDecision.id}</strong>
            </span>
            {onDeleteDecision && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete report ${currentDecision.id}? This will remove this decision from the ledger.`)) {
                    onDeleteDecision(currentDecision.id);
                  }
                }}
                id="btn-delete-report"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                title="Delete this decision report from the ledger"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Delete Report</span>
              </button>
            )}
          </div>
        )}
      </div>

      {!currentDecision ? (
        <div className="bg-white p-12 rounded-3xl text-center space-y-3 border border-emerald-950/5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#265e53] flex items-center justify-center mx-auto">
            <ScanEye className="w-7 h-7 text-[#265e53]" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No decisions in ledger yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Use the Live Decision Studio to evaluate and seal your first autonomous AI decision, then inspect its full forensic proof here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 shadow-sm border border-emerald-950/5 flex flex-col h-[820px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">Historical Decisions</h3>
            <span className="text-xs text-slate-400 font-mono">{filteredList.length} records</span>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by ID, Agent, or Outcome..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#265e53]/30"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredList.map((item) => {
              const isSelected = item.id === currentDecision.id;
              const allow = item.outcome === 'ALLOW';
              const review = item.outcome === 'REVIEW';
              const block = item.outcome === 'BLOCK';

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectDecision(item.id)}
                  id={`select-decision-${item.id}`}
                  className={`p-3 rounded-2xl cursor-pointer transition-all border text-left ${
                    isSelected
                      ? 'bg-[#f4f9f7] border-[#265e53] shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono font-bold text-xs text-slate-900">
                      {item.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          allow
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : review
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {item.outcome}
                      </span>
                      {onDeleteDecision && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Are you sure you want to delete report ${item.id}?`)) {
                              onDeleteDecision(item.id);
                            }
                          }}
                          className="text-slate-300 hover:text-rose-600 p-0.5 rounded transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-slate-800 truncate">
                    {item.actionType}
                  </div>

                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                    <span className="truncate max-w-[140px]">{item.agentName}</span>
                    <span className="font-mono">{item.latencyMs}ms</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-emerald-950/5 flex flex-col h-[820px] overflow-y-auto">
          <div className="p-4 rounded-2xl bg-[#f4f9f7] border border-emerald-900/5 mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                  isAllow
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isReview
                    ? 'bg-[#f3b73e] text-slate-950 shadow-xs'
                    : 'bg-rose-600 text-white shadow-xs'
                }`}
              >
                {currentDecision.outcome}
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>{currentDecision.actionType}</span>
                  <span className="text-xs font-normal text-slate-500 font-mono">
                    (Block #{currentDecision.blockHeight})
                  </span>
                </h2>
                <div className="text-xs text-slate-500">
                  By <strong className="text-slate-800">{currentDecision.agentName}</strong> ({currentDecision.agentId})
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-slate-600">
              <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200">
                Mode: <strong className="text-slate-900">{currentDecision.executionMode}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200">
                Latency: <strong className="text-slate-900">{currentDecision.latencyMs}ms</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
            <button
              onClick={() => setViewTab('narrative')}
              id="tab-narrative-explainer"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewTab === 'narrative'
                  ? 'bg-[#265e53] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Plain-Language Narrative & Reasoning Path
            </button>
            <button
              onClick={() => setViewTab('payload')}
              id="tab-input-output-payload"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewTab === 'payload'
                  ? 'bg-[#265e53] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Input vs. Output Mapping (Raw JSON)
            </button>
            <button
              onClick={() => setViewTab('crypto')}
              id="tab-crypto-proof"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewTab === 'crypto'
                  ? 'bg-[#265e53] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Cryptographic Block Proof
            </button>
          </div>

          {viewTab === 'narrative' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div
                className={`p-5 rounded-3xl border shadow-xs ${
                  isAllow
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : isReview
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                    : 'bg-rose-50/70 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#f5b842]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Plain-English Explanation (Why was this decision made?)
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-white shadow-2xs border border-black/5">
                    {isAllow ? '✅ Approved' : isReview ? '⚠️ Held For Review' : '⛔ Blocked'}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                  {currentDecision.humanReadableNarrative}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 mt-3 border-t border-black/5 text-xs">
                  <div className="bg-white/90 p-3 rounded-xl border border-black/5 shadow-2xs">
                    <span className="font-bold text-slate-500 uppercase text-[10px] block mb-0.5">
                      👤 Agent
                    </span>
                    <span className="font-bold text-slate-900 block truncate">
                      {currentDecision.agentName}
                    </span>
                  </div>
                  <div className="bg-white/90 p-3 rounded-xl border border-black/5 shadow-2xs">
                    <span className="font-bold text-slate-500 uppercase text-[10px] block mb-0.5">
                      💡 Reason
                    </span>
                    <span className="font-bold text-slate-900 block truncate">
                      {isAllow
                        ? 'Passed all checks normally'
                        : isReview
                        ? (currentDecision.rawInputPayload?.amountUsd && currentDecision.rawInputPayload.amountUsd > 100000
                            ? 'Amount exceeds $100k limit'
                            : 'Manager sign-off required')
                        : 'Security threat detected'}
                    </span>
                  </div>
                  <div className="bg-white/90 p-3 rounded-xl border border-black/5 shadow-2xs">
                    <span className="font-bold text-slate-500 uppercase text-[10px] block mb-0.5">
                      🛡️ Status
                    </span>
                    <span className="font-bold text-slate-900 block truncate">
                      {isAllow
                        ? 'Executed & sealed in ledger'
                        : isReview
                        ? 'On hold for manager sign-off'
                        : 'Blocked & alert sent'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      How ARGUS Checked This Request (Step-by-Step)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      5 straightforward safety checks conducted prior to execution
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {currentDecision.stepByStepReasoning.length} Checks Completed
                  </span>
                </div>

                <div className="space-y-3">
                  {currentDecision.stepByStepReasoning.map((step) => {
                    const isStepPassed = step.status === 'PASSED';
                    const isStepWarning = step.status === 'WARNING';

                    return (
                      <div
                        key={step.step}
                        className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-start gap-3.5 hover:bg-slate-50 transition-colors"
                      >
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs mt-0.5 text-white shadow-2xs ${
                            isStepPassed
                              ? 'bg-emerald-600'
                              : isStepWarning
                              ? 'bg-amber-600'
                              : 'bg-rose-600'
                          }`}
                        >
                          {step.step}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">
                                {step.title}
                              </span>
                              <span className="text-[10px] font-medium text-slate-400">
                                • {step.phase}
                              </span>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isStepPassed
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isStepWarning
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {isStepPassed ? '✅ All Clear' : isStepWarning ? '⚠️ Needs Review' : '⛔ Alert / Blocked'}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
                            {step.detail}
                          </p>

                          {step.timestampMs && (
                            <div className="text-[10px] text-slate-400 font-mono mt-1">
                              Elapsed: +{step.timestampMs}ms
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {viewTab === 'payload' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200 flex-1">
              <div className="flex flex-col bg-slate-900 text-slate-200 rounded-2xl p-4 overflow-hidden shadow-inner">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 font-mono">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Raw JSON Input Payload</span>
                  </div>
                  <button
                    onClick={() => handleCopyJson(currentDecision.rawInputPayload, setCopiedInput)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedInput ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="flex-1 overflow-auto text-[11px] font-mono leading-relaxed text-slate-300 p-1">
                  {JSON.stringify(currentDecision.rawInputPayload, null, 2)}
                </pre>
              </div>

              <div className="flex flex-col bg-[#f8fbf9] border border-slate-200/80 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 font-mono">
                    <Activity className="w-3.5 h-3.5 text-[#265e53]" />
                    <span>Decision Assessment & Policies</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {currentDecision.outputPayload.complianceCode}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700">Composite Risk Score</span>
                    <span
                      className={`text-sm font-extrabold ${
                        currentDecision.riskScore > 70
                          ? 'text-rose-600'
                          : currentDecision.riskScore > 35
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {currentDecision.riskScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        currentDecision.riskScore > 70
                          ? 'bg-rose-500'
                          : currentDecision.riskScore > 35
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${currentDecision.riskScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Model Confidence</span>
                  <span className="text-sm font-extrabold text-slate-900 font-mono">
                    {(currentDecision.confidenceScore * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Policy Flags Triggered ({currentDecision.policiesTriggered.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentDecision.policiesTriggered.map((pol) => (
                      <span
                        key={pol}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200"
                      >
                        {pol}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs font-bold text-slate-700 block pt-2">
                    Policies Evaluated ({currentDecision.policiesEvaluated.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentDecision.policiesEvaluated.map((pol) => (
                      <span
                        key={pol}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-mono"
                      >
                        {pol}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Enforcement Action:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {currentDecision.outputPayload.enforcementAction}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Circuit Breaker Tripped:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {currentDecision.outputPayload.circuitBreakerTripped ? 'YES (TRIPPED)' : 'NO (CLEAR)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewTab === 'crypto' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-bold">Cryptographic Block Proof Height</span>
                  <span className="text-slate-900 font-extrabold text-sm">
                    #{currentDecision.blockHeight}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-0.5">
                    Block Hash (SHA-256):
                  </label>
                  <div className="p-2 bg-white rounded-xl border border-slate-200 text-slate-800 break-all select-all">
                    {currentDecision.blockHash}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-0.5">
                    Parent Pointer Hash (Previous Block):
                  </label>
                  <div className="p-2 bg-white rounded-xl border border-slate-200 text-slate-800 break-all select-all">
                    {currentDecision.parentBlockHash}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-0.5">
                    Ed25519 Digital Signature:
                  </label>
                  <div className="p-2 bg-white rounded-xl border border-slate-200 text-slate-800 break-all select-all">
                    {currentDecision.digitalSignature}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-0.5">
                    Merkle State Root:
                  </label>
                  <div className="p-2 bg-white rounded-xl border border-slate-200 text-slate-800 break-all select-all">
                    {currentDecision.merkleRoot}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-900 text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>
                  This block is mathematically linked to the genesis block via parent hash chaining. Any retrospective mutation of this record would break the SHA-256 consensus across all subsequent blocks.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};
