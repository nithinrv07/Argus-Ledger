
import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar, TabType } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { DashboardOverview } from './pages/DashboardOverview';
import { AuditLedgerExplorer } from './pages/AuditLedgerExplorer';
import { DecisionInspector } from './pages/DecisionInspector';
import { ComplianceAnalytics } from './pages/ComplianceAnalytics';
import { LiveDecisionStudio } from './pages/LiveDecisionStudio';
import { AuditVerificationModal } from './components/AuditVerificationModal';
import { SimulateDecisionModal } from './components/SimulateDecisionModal';
import { LedgerDecision } from './types/ledger';
import { verifyLedgerChain } from './utils/cryptoLedger';
import { ledgerApi } from './api/ledgerApi';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [decisions, setDecisions] = useState<LedgerDecision[]>([]);
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isTampered, setIsTampered] = useState<boolean>(false);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  useEffect(() => {
    async function loadBackendLedger() {
      try {
        const result = await ledgerApi.getLedger();
        if (result.isLive && result.data && result.data.length > 0) {
          setDecisions(result.data);
          setSelectedDecisionId(result.data[0].id);
          setIsBackendConnected(true);
        } else {
          setIsBackendConnected(result.isLive);
        }
      } catch (err) {
        console.warn('Backend unavailable, running in standby mode:', err);
        setIsBackendConnected(false);
      }
    }
    loadBackendLedger();
  }, []);

  const integrityStatus = useMemo(() => {
    return verifyLedgerChain(decisions);
  }, [decisions]);

  const handleToggleTamper = async () => {
    if (!isTampered) {
      if (isBackendConnected) {
        await ledgerApi.simulateTamper();
      }
      if (decisions.length > 0) {
        setDecisions((prev) =>
          prev.map((d, idx) => {
            if (idx === 0) {
              return {
                ...d,
                tampered: true,
                blockHash: '0xBAD0000000000000000000000000000000000000000000000000000000000BAD',
              };
            }
            return d;
          })
        );
      }
      setIsTampered(true);
    } else {
      if (isBackendConnected) {
        await ledgerApi.restoreLedger();
        const res = await ledgerApi.getLedger();
        setDecisions(res.data || []);
      }
      setIsTampered(false);
    }
  };

  const handleRefreshVerification = async () => {
    setIsVerifying(true);
    if (isBackendConnected) {
      try {
        const res = await ledgerApi.verifyLedger(decisions);
        const ledgerRes = await ledgerApi.getLedger();
        if (ledgerRes.data && ledgerRes.data.length > 0) {
          setDecisions(ledgerRes.data);
        }
      } catch (e) {
        console.warn('Re-verify failed on backend, using local check:', e);
      }
    }
    setTimeout(() => {
      setIsVerifying(false);
    }, 500);
  };

  const handleAddDecision = (newDecision: LedgerDecision) => {
    setDecisions((prev) => [newDecision, ...prev]);
    setSelectedDecisionId(newDecision.id);
  };

  const handleDeleteDecision = async (id: string) => {
    if (isBackendConnected) {
      try {
        await ledgerApi.deleteReport(id);
      } catch (err) {
        console.warn('Backend delete report failed:', err);
      }
    }
    setDecisions((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      if (selectedDecisionId === id) {
        setSelectedDecisionId(updated.length > 0 ? updated[0].id : null);
      }
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-[#f0f6f4] text-slate-800 flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 ml-20 md:ml-24 flex flex-col min-w-0 pb-16">
        <TopNavbar
          searchQuery={globalSearchQuery}
          setSearchQuery={(query) => {
            setGlobalSearchQuery(query);
            if (query.trim() && activeTab !== 'ledger') {
              setActiveTab('ledger');
            }
          }}
          onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
          onOpenSimulateModal={() => setActiveTab('studio')}
          integrityStatus={integrityStatus}
          isVerifying={isVerifying}
          onRefresh={handleRefreshVerification}
          isBackendConnected={isBackendConnected}
        />

        <main className="p-4 sm:p-6 md:p-8 max-w-[1600px] w-full mx-auto">
          {activeTab === 'overview' && (
            <DashboardOverview
              decisions={decisions}
              integrityStatus={integrityStatus}
              onNavigateTab={setActiveTab}
              onSelectDecision={setSelectedDecisionId}
              onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
              onOpenSimulateModal={() => setActiveTab('studio')}
              onToggleTamper={handleToggleTamper}
              isTampered={isTampered}
            />
          )}

          {activeTab === 'studio' && (
            <LiveDecisionStudio
              onDecisionCreated={(newDecision) => {
                handleAddDecision(newDecision);
              }}
              onNavigateToInspector={(decisionId) => {
                setSelectedDecisionId(decisionId);
                setActiveTab('inspector');
              }}
              latestBlock={decisions[0]}
            />
          )}

          {activeTab === 'ledger' && (
            <AuditLedgerExplorer
              decisions={decisions}
              onSelectDecision={setSelectedDecisionId}
              onNavigateToInspector={() => setActiveTab('inspector')}
              onDeleteDecision={handleDeleteDecision}
            />
          )}

          {activeTab === 'inspector' && (
            <DecisionInspector
              decisions={decisions}
              selectedDecisionId={selectedDecisionId}
              onSelectDecision={setSelectedDecisionId}
              onDeleteDecision={handleDeleteDecision}
            />
          )}

          {activeTab === 'analytics' && <ComplianceAnalytics decisions={decisions} />}
        </main>
      </div>

      <AuditVerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        status={integrityStatus}
        chain={decisions}
        onReverify={handleRefreshVerification}
      />

      <SimulateDecisionModal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
        latestBlock={decisions[0]}
        onAddDecision={handleAddDecision}
      />
    </div>
  );
}
