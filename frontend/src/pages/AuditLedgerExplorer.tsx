import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Copy,
  Check,
  Eye,
  ArrowUpDown,
  FileSpreadsheet,
  FileCode,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { LedgerDecision, DecisionOutcome, ExecutionMode } from '../types/ledger';
import { exportSignedLedgerJSON, exportLedgerCSV } from '../utils/cryptoLedger';

interface AuditLedgerExplorerProps {
  decisions: LedgerDecision[];
  onSelectDecision: (decisionId: string) => void;
  onNavigateToInspector: () => void;
  onDeleteDecision?: (decisionId: string) => void;
}

export const AuditLedgerExplorer: React.FC<AuditLedgerExplorerProps> = ({
  decisions,
  onSelectDecision,
  onNavigateToInspector,
  onDeleteDecision,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState<string>('ALL');
  const [selectedMode, setSelectedMode] = useState<string>('ALL');
  const [selectedOutcome, setSelectedOutcome] = useState<string>('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'timestamp' | 'riskScore' | 'blockHeight'>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const uniquePolicies = useMemo(() => {
    const set = new Set<string>();
    decisions.forEach((d) => d.policiesTriggered.forEach((p) => set.add(p)));
    return Array.from(set);
  }, [decisions]);

  const filteredDecisions = useMemo(() => {
    return decisions.filter((d) => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesId = d.id.toLowerCase().includes(query);
        const matchesAgent = d.agentName.toLowerCase().includes(query) || d.agentId.toLowerCase().includes(query);
        const matchesAction = d.actionType.toLowerCase().includes(query);
        const matchesHash = d.blockHash.toLowerCase().includes(query);
        const matchesPolicies = d.policiesTriggered.some((p) => p.toLowerCase().includes(query));
        if (!matchesId && !matchesAgent && !matchesAction && !matchesHash && !matchesPolicies) {
          return false;
        }
      }

      if (selectedPolicy !== 'ALL') {
        if (!d.policiesTriggered.includes(selectedPolicy)) {
          return false;
        }
      }

      if (selectedMode !== 'ALL') {
        if (d.executionMode !== selectedMode) {
          return false;
        }
      }

      if (selectedOutcome !== 'ALL') {
        if (d.outcome !== selectedOutcome) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === 'timestamp') {
        comparison = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else if (sortField === 'riskScore') {
        comparison = b.riskScore - a.riskScore;
      } else if (sortField === 'blockHeight') {
        comparison = b.blockHeight - a.blockHeight;
      }
      return sortDirection === 'desc' ? comparison : -comparison;
    });
  }, [
    decisions,
    searchTerm,
    selectedPolicy,
    selectedMode,
    selectedOutcome,
    selectedDateRange,
    sortField,
    sortDirection,
  ]);

  const totalPages = Math.ceil(filteredDecisions.length / pageSize) || 1;
  const paginatedDecisions = filteredDecisions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleInspect = (id: string) => {
    onSelectDecision(id);
    onNavigateToInspector();
  };

  const toggleSort = (field: 'timestamp' | 'riskScore' | 'blockHeight') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div id="audit-ledger-explorer-page" className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-emerald-950/5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Audit Ledger Explorer
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#265e53] text-xs font-bold font-mono border border-emerald-200">
              Page 2
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Chronological master record of all cryptographically anchored decisions. Every entry is immutably linked with previous block hash and verified digital signature.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => exportSignedLedgerJSON(filteredDecisions)}
            id="export-ledger-json-btn"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#265e53] hover:bg-[#1e4e44] text-white text-xs font-bold rounded-2xl shadow-sm transition-all active:scale-95"
            title="Download signed JSON export with cryptographic envelope"
          >
            <FileCode className="w-4 h-4 text-[#f5b842]" />
            <span>Export Signed JSON</span>
          </button>

          <button
            onClick={() => exportLedgerCSV(filteredDecisions)}
            id="export-ledger-csv-btn"
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-2xl border border-slate-200/90 shadow-sm transition-all active:scale-95"
            title="Download CSV for spreadsheets and external compliance tooling"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-950/5 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              id="ledger-table-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Transaction ID, Agent, Action type, Hash, or Policy..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#265e53]/30 focus:border-[#265e53]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium px-2">
            <span>
              Showing <strong className="text-slate-800">{filteredDecisions.length}</strong> of{' '}
              {decisions.length} records
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Compliance Policy Triggered
            </label>
            <select
              value={selectedPolicy}
              onChange={(e) => {
                setSelectedPolicy(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#265e53]/30"
            >
              <option value="ALL">All Policies Triggered</option>
              {uniquePolicies.map((pol) => (
                <option key={pol} value={pol}>
                  {pol}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Execution Mode
            </label>
            <select
              value={selectedMode}
              onChange={(e) => {
                setSelectedMode(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#265e53]/30"
            >
              <option value="ALL">All Execution Modes</option>
              <option value="AUTONOMOUS">Autonomous Only</option>
              <option value="HITL">Human-in-the-Loop (HITL) Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Decision Outcome
            </label>
            <select
              value={selectedOutcome}
              onChange={(e) => {
                setSelectedOutcome(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#265e53]/30"
            >
              <option value="ALL">All Outcomes</option>
              <option value="ALLOW">ALLOW Only</option>
              <option value="REVIEW">REVIEW (HITL) Only</option>
              <option value="BLOCK">BLOCK Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Date Range
            </label>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#265e53]/30"
            >
              <option value="ALL">All Time History</option>
              <option value="TODAY">Today (Last 24 Hours)</option>
              <option value="7DAYS">Last 7 Days</option>
              <option value="30DAYS">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-emerald-950/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="audit-ledger-master-table">
            <thead>
              <tr className="bg-[#f4f9f7] text-slate-600 text-xs font-bold border-b border-emerald-900/5">
                <th
                  onClick={() => toggleSort('blockHeight')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#265e53] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Block Height</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('timestamp')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#265e53] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Timestamp (UTC)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Transaction / ID</th>
                <th className="py-3.5 px-4">Agent Identity</th>
                <th className="py-3.5 px-4">Action Type</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4">Outcome</th>
                <th
                  onClick={() => toggleSort('riskScore')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#265e53] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Risk Score</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Cryptographic Hash</th>
                <th className="py-3.5 px-4 text-right">Inspect</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {paginatedDecisions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No ledger entries match the current search filters.
                  </td>
                </tr>
              ) : (
                paginatedDecisions.map((decision) => {
                  const isAllow = decision.outcome === 'ALLOW';
                  const isReview = decision.outcome === 'REVIEW';
                  const isBlock = decision.outcome === 'BLOCK';

                  return (
                    <tr
                      key={decision.id}
                      className="hover:bg-[#f8fbf9] transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        #{decision.blockHeight}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(decision.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                        <span className="block text-[10px] text-slate-400">
                          {new Date(decision.timestamp).toISOString().slice(0, 10)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-[#265e53]">
                        {decision.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">
                          {decision.agentName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {decision.agentId}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-mono">
                          {decision.actionType}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            decision.executionMode === 'AUTONOMOUS'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {decision.executionMode}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
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
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-bold ${
                              decision.riskScore > 70
                                ? 'text-rose-600'
                                : decision.riskScore > 35
                                ? 'text-amber-600'
                                : 'text-emerald-600'
                            }`}
                          >
                            {decision.riskScore}/100
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({(decision.confidenceScore * 100).toFixed(0)}% conf)
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div className="flex items-center gap-1 text-slate-600">
                          <span title={decision.blockHash}>
                            {decision.blockHash.slice(0, 10)}...{decision.blockHash.slice(-6)}
                          </span>
                          <button
                            onClick={() => handleCopyHash(decision.blockHash)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                            title="Copy full SHA-256 hash"
                          >
                            {copiedHash === decision.blockHash ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 ml-auto">
                          <button
                            onClick={() => handleInspect(decision.id)}
                            id={`btn-inspect-${decision.id}`}
                            className="px-3 py-1.5 bg-[#f4f9f7] hover:bg-[#eaf4f0] text-[#265e53] font-bold rounded-xl border border-emerald-900/10 transition-all flex items-center gap-1 group-hover:shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>
                          {onDeleteDecision && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to delete report ${decision.id}? This will remove it from the audit ledger.`)) {
                                  onDeleteDecision(decision.id);
                                }
                              }}
                              id={`btn-delete-${decision.id}`}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                              title={`Delete report ${decision.id}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#f8fbf9] border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Page <strong className="text-slate-800">{currentPage}</strong> of{' '}
            <strong className="text-slate-800">{totalPages}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                  currentPage === page
                    ? 'bg-[#265e53] text-white'
                    : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
