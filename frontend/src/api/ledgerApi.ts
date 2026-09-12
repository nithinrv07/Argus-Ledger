import { LedgerDecision, LedgerIntegrityStatus } from '../types/ledger';
import { verifyLedgerChain } from '../utils/cryptoLedger';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export interface DecisionSimulationRequest {
  preset?: 'normal' | 'review' | 'attack' | 'custom';
  agent: string;
  actionType: string;
  intent: string;
  amountUsd: number;
  deviceTrustScore?: number;
  mfaVerified?: boolean;
  targetResource?: string;
}

export const ledgerApi = {
  async getLedger(): Promise<{ data: LedgerDecision[]; isLive: boolean }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/ledger`, {
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: LedgerDecision[] = await res.json();
      return { data, isLive: true };
    } catch (err) {
      console.warn('[ARGUS API] Live backend unavailable, returning empty ledger:', err);
      return { data: [], isLive: false };
    }
  },

  async verifyLedger(localChain: LedgerDecision[]): Promise<{ status: LedgerIntegrityStatus; isLive: boolean }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/verify-ledger`, {
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const status: LedgerIntegrityStatus = await res.json();
      return { status, isLive: true };
    } catch (err) {
      console.warn('[ARGUS API] Using client-side ledger verification:', err);
      return { status: verifyLedgerChain(localChain), isLive: false };
    }
  },

  async decideAndLog(request: DecisionSimulationRequest): Promise<{ decision: LedgerDecision; isLive: boolean }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/decide-and-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const decision: LedgerDecision = await res.json();
      return { decision, isLive: true };
    } catch (err) {
      console.warn('[ARGUS API] Offline decision fallback:', err);
      throw err;
    }
  },

  async simulateTamper(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/simulate-tamper`, { method: 'POST' });
      return res.ok;
    } catch (err) {
      return false;
    }
  },

  async restoreLedger(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/restore-ledger`, { method: 'POST' });
      return res.ok;
    } catch (err) {
      return false;
    }
  },

  async deleteReport(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/ledger/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (err) {
      console.warn('[ARGUS API] Delete report error:', err);
      return false;
    }
  },

  async clearAllReports(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/ledger`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (err) {
      console.warn('[ARGUS API] Clear reports error:', err);
      return false;
    }
  }
};
