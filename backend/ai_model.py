"""
ARGUS Ledger - Autonomous AI Decision Engine
Evaluates critical agent actions and determines risk score, outcome, and execution mode.
"""
from typing import Dict, Any, Tuple, List
import re

CRITICAL_THREAT_KEYWORDS = [
    "bypass", "exfiltrate", "dump", "unauthorized", "secrets", "api_key",
    "override", "delimiter", "prompt injection", "shadow admin", "shadow",
    "disable logging", "backdoor", "webhook export"
]

SUSPICIOUS_ELEVATION_KEYWORDS = [
    "elevation", "emergency", "sudo", "root", "hotfix", "iam_grant",
    "off-hours", "unrestricted", "grant_all", "imbalance"
]

class ArgusDecisionEngine:
    def __init__(self):
        self.version = "Argus-Aura-v2.4"

    def evaluate(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        intent = request_data.get("intent", "").lower()
        amount_usd = float(request_data.get("amount_usd", 0) or 0)
        action_type = request_data.get("action_type", "GENERIC_ACTION")
        agent_id = request_data.get("agent_id", "Agent-Argus-01")
        device_trust = float(request_data.get("device_trust_score", 95))

        threat_signals = []
        policies_evaluated = [
            "Dual-Key Custody Policy",
            "Transaction Velocity & Liquidity Buffer",
            "Privileged IAM Escalation Guardrail",
            "Zero-Trust Device Attestation",
            "Prompt Delimiter & Exfiltration Screen",
            "Off-Hours Execution Filter"
        ]
        policies_triggered = []

        base_risk = 5.0

        matched_critical = [kw for kw in CRITICAL_THREAT_KEYWORDS if kw in intent]
        matched_elevation = [kw for kw in SUSPICIOUS_ELEVATION_KEYWORDS if kw in intent]

        if matched_critical:
            threat_signals.append(f"Adversarial intent tokens detected: {', '.join(matched_critical)}")
            base_risk += 75.0
            policies_triggered.append("Prompt Delimiter & Exfiltration Screen")

        if matched_elevation:
            threat_signals.append(f"Privilege boundary escalation detected: {', '.join(matched_elevation)}")
            base_risk += 45.0
            policies_triggered.append("Privileged IAM Escalation Guardrail")

        if amount_usd > 100000:
            threat_signals.append(f"High-value threshold exceeded: ${amount_usd:,.2f} > $100k")
            base_risk += 50.0
            policies_triggered.append("Transaction Velocity & Liquidity Buffer")
        elif amount_usd > 50000:
            threat_signals.append(f"Medium-high value transfer requiring dual authorization: ${amount_usd:,.2f}")
            base_risk += 35.0
            policies_triggered.append("Dual-Key Custody Policy")
        elif amount_usd > 0:
            policies_triggered.append("Normal Velocity Profile")

        if action_type in ["CREDENTIAL_ROTATION", "EXPORT_SYSTEM_DATA"]:
            if not matched_critical:
                base_risk += 20.0
        elif action_type in ["PRIVILEGED_IAM_GRANT", "POLICY_OVERRIDE"]:
            base_risk += 30.0

        if device_trust < 70:
            base_risk += 25.0
            threat_signals.append(f"Sub-optimal device trust score: {device_trust}/100")
            policies_triggered.append("Zero-Trust Device Attestation")

        risk_score = min(max(round(base_risk, 1), 2.0), 99.0)

        if risk_score >= 75.0:
            outcome = "BLOCK"
            execution_mode = "AUTONOMOUS"
            confidence_score = round(0.96 + (risk_score / 2500.0), 3)
            auth_level = "REVOKED_ZERO_TRUST"
            circuit_breaker = True
        elif risk_score >= 35.0:
            outcome = "REVIEW"
            execution_mode = "HITL"
            confidence_score = round(0.82 + (risk_score / 500.0), 3)
            auth_level = "LEVEL_1_PENDING_SECOPS"
            circuit_breaker = False
        else:
            outcome = "ALLOW"
            execution_mode = "AUTONOMOUS"
            confidence_score = round(0.97 + ((100 - risk_score) / 3500.0), 3)
            auth_level = "LEVEL_3_AUTONOMOUS_SETTLEMENT"
            circuit_breaker = False

        if not policies_triggered:
            policies_triggered.append("Standard Governance Profile Verified")

        return {
            "risk_score": risk_score,
            "outcome": outcome,
            "execution_mode": execution_mode,
            "confidence_score": min(confidence_score, 0.999),
            "auth_level": auth_level,
            "circuit_breaker": circuit_breaker,
            "threat_signals": threat_signals,
            "policies_evaluated": policies_evaluated,
            "policies_triggered": policies_triggered,
            "model_version": self.version
        }

decision_engine = ArgusDecisionEngine()
