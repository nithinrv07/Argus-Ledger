export type DecisionOutcome = 'ALLOW' | 'REVIEW' | 'BLOCK';

export type ExecutionMode = 'AUTONOMOUS' | 'HITL';

export interface ReasoningStep {
  step: number;
  phase: string;
  title: string;
  detail: string;
  status: 'PASSED' | 'WARNING' | 'FAILED' | 'INFO';
  timestampMs?: number;
}

export interface LedgerDecision {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  actionType: string;
  executionMode: ExecutionMode;
  outcome: DecisionOutcome;
  riskScore: number;
  confidenceScore: number;
  latencyMs: number;
  taskCompleted: boolean;
  policiesTriggered: string[];
  policiesEvaluated: string[];
  blockHeight: number;
  blockHash: string;
  parentBlockHash: string;
  digitalSignature: string;
  merkleRoot: string;
  tampered?: boolean;
  rawInputPayload: {
    intent: string;
    requesterId: string;
    requesterRole: string;
    targetResource: string;
    amountUsd?: number;
    destinationAccount?: string;
    sourceIp: string;
    geoCountry: string;
    deviceTrustScore: number;
    mfaVerified: boolean;
    sessionTokensAgeSec: number;
    promptPromptTokens?: number;
    contextPayload: Record<string, any>;
  };
  outputPayload: {
    decisionStatus: DecisionOutcome;
    authLevelGranted: string;
    circuitBreakerTripped: boolean;
    policyViolationCount: number;
    complianceCode: string;
    reviewerNotes?: string;
    enforcementAction: string;
    auditReceiptSignature: string;
  };
  stepByStepReasoning: ReasoningStep[];
  humanReadableNarrative: string;
}

export interface LedgerIntegrityStatus {
  isValid: boolean;
  blockHeight: number;
  verifiedBlockCount: number;
  latestBlockHash: string;
  genesisHash: string;
  lastAuditTimestamp: string;
  brokenBlockIndex: number | null;
  signatureAlgorithm: string;
  hashAlgorithm: string;
  tamperCount: number;
}

export interface AgentMetrics {
  agentId: string;
  agentName: string;
  role: string;
  decisionsCount: number;
  avgConfidence: number;
  avgLatencyMs: number;
  autonomousRate: number;
  taskCompletionRate: number;
  allowCount: number;
  reviewCount: number;
  blockCount: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  status: 'ONLINE' | 'STANDBY' | 'DEGRADED';
}

export interface PolicyTriggerStat {
  policyId: string;
  policyName: string;
  category: 'SECURITY' | 'FINANCIAL' | 'PRIVACY' | 'BEHAVIORAL';
  triggerCount: number;
  blockRate: number;
  trend: string;
  description: string;
}
