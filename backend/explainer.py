"""
ARGUS Ledger - Explainable AI (XAI) Engine
Generates simple, human-friendly step-by-step reasoning and plain-English explanations
that normal people, managers, and non-technical stakeholders can immediately understand.
"""
from typing import Dict, Any, List

FRIENDLY_AGENTS = {
    "Agent-Apollo-01": "Apollo Treasury Auditor",
    "Agent-Hermes-04": "Hermes Execution Engine",
    "Agent-Minerva-03": "Minerva Security Sentinel",
    "Agent-Athena-02": "Athena Customer Guardrail",
    "Agent-Zeus-07": "Zeus Infrastructure Orchestrator",
}

FRIENDLY_ACTIONS = {
    "FUND_DISBURSEMENT": "Fund Transfer",
    "EMERGENCY_CIRCUIT_BREAK": "Emergency Traffic Shutdown",
    "PRIVILEGED_IAM_GRANT": "Admin Access Request",
    "CREDENTIAL_ROTATION": "API Key Rotation",
    "EXPORT_SYSTEM_DATA": "System Data Export",
    "POLICY_OVERRIDE": "Security Policy Override",
}

FRIENDLY_POLICIES = {
    "Dual-Key Custody Policy": "Two-Person Sign-Off Rule (Amounts over $50,000)",
    "Transaction Velocity & Liquidity Buffer": "Large Transfer Limit (Amounts over $100,000)",
    "Privileged IAM Escalation Guardrail": "Administrator Permission Check",
    "Zero-Trust Device Attestation": "Recognized Device & Login Check",
    "Prompt Delimiter & Exfiltration Screen": "Data Leak & Tampering Defense",
    "Off-Hours Execution Filter": "Off-Hours Activity Check",
    "Normal Velocity Profile": "Standard Routine Transaction Rule",
    "Standard Governance Profile Verified": "Standard Business Safety Check",
}

def get_action_phrase(action_name: str) -> str:
    lower = action_name.lower()
    if lower.startswith("emergency") or lower.startswith("admin"):
        return f"an {action_name}"
    return f"a {action_name}"

class ArgusExplainer:
    def __init__(self):
        self.explainer_name = "Argus-PlainEnglish-Explainer"

    def generate_explanation(
        self,
        request_data: Dict[str, Any],
        decision_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        agent_id = request_data.get("agent_id", "Agent-Argus-01")
        action_type = request_data.get("action_type", "GENERIC_ACTION")
        intent = request_data.get("intent", "No description provided").strip()
        amount_usd = float(request_data.get("amount_usd", 0) or 0)
        device_trust = float(request_data.get("device_trust_score", 95))
        mfa_verified = bool(request_data.get("mfa_verified", True))

        risk_score = decision_result["risk_score"]
        outcome = decision_result["outcome"]
        execution_mode = decision_result["execution_mode"]
        confidence = decision_result["confidence_score"]
        raw_policies = decision_result.get("policies_triggered", [])
        threat_signals = decision_result.get("threat_signals", [])

        # Map to friendly names
        agent_friendly = FRIENDLY_AGENTS.get(agent_id, agent_id)
        action_friendly = FRIENDLY_ACTIONS.get(action_type, action_type.replace("_", " ").title())
        action_phrase = get_action_phrase(action_friendly)
        amount_str = f" for ${amount_usd:,.2f}" if amount_usd > 0 else ""
        friendly_policies = [
            FRIENDLY_POLICIES.get(p, p) for p in raw_policies
        ]

        # Determine primary plain-language trigger reason
        if amount_usd > 100000:
            trigger_reason = f"the requested amount (${amount_usd:,.2f}) is over the $100,000 limit for automatic approvals"
        elif amount_usd > 50000:
            trigger_reason = f"the transfer amount (${amount_usd:,.2f}) requires a two-person sign-off"
        elif any("Prompt" in p or "Exfiltration" in p for p in raw_policies):
            trigger_reason = "it looks like an attempt to extract secret keys or bypass security boundaries"
        elif any("IAM" in p for p in raw_policies):
            trigger_reason = "granting administrator permissions requires manager confirmation"
        elif device_trust < 70:
            trigger_reason = f"the request came from an unfamiliar or untrusted device (Trust score: {device_trust:g}/100)"
        elif any("Off-Hours" in p for p in raw_policies):
            trigger_reason = "this critical action was initiated outside standard operating hours"
        else:
            trigger_reason = "this sensitive action requires human verification"

        # -------------------------------------------------------------
        # 1. Plain-English Human-Readable Narrative
        # -------------------------------------------------------------
        if outcome == "ALLOW":
            narrative = (
                f"Approved: {agent_friendly} requested {action_phrase}{amount_str}. "
                f"Everything looks normal and safe—the device is recognized, the amount is within standard limits, "
                f"and no security risks were detected. The request was approved automatically."
            )
        elif outcome == "REVIEW":
            narrative = (
                f"Held for Human Approval: {agent_friendly} requested {action_phrase}{amount_str}. "
                f"Because {trigger_reason}, ARGUS paused automatic execution. "
                f"A manager must review and sign off before this action is carried out."
            )
        else: # BLOCK
            narrative = (
                f"Blocked for Safety: {agent_friendly} attempted {action_phrase}{amount_str}. "
                f"This action was stopped immediately because {trigger_reason}. "
                f"ARGUS blocked the request to protect company systems and notified the security team."
            )

        # -------------------------------------------------------------
        # 2. 5-Phase Clear Reasoning Chain
        # -------------------------------------------------------------
        # Step 1: What was requested?
        step1 = {
            "step": 1,
            "phase": "Request Summary",
            "title": "What was requested?",
            "detail": f"{agent_friendly} requested {action_phrase}{amount_str}. Purpose: \"{intent}\".",
            "status": "PASSED"
        }

        # Step 2: Who asked & are they trusted?
        if device_trust >= 80 and mfa_verified:
            step2_detail = f"Login verified. {agent_friendly} is using an authorized company device (Trust: {device_trust:g}/100) with two-factor authentication confirmed."
            step2_status = "PASSED"
        elif device_trust >= 60:
            step2_detail = f"Login verified with minor notice. Device trust score is moderate ({device_trust:g}/100)."
            step2_status = "WARNING"
        else:
            step2_detail = f"Security Warning: Login came from an untrusted or suspicious device (Trust: {device_trust:g}/100)."
            step2_status = "FAILED"

        step2 = {
            "step": 2,
            "phase": "Identity & Security Check",
            "title": "Who asked & is the login secure?",
            "detail": step2_detail,
            "status": step2_status
        }

        # Step 3: Red flags / warning signs
        if outcome == "ALLOW":
            step3_detail = f"No red flags found. Risk is very low ({risk_score:g}%). The AI system is {confidence * 100:.1f}% confident this request is safe."
            step3_status = "PASSED"
        elif outcome == "REVIEW":
            step3_detail = f"Notice: {trigger_reason.capitalize()}. Risk score evaluated at {risk_score:g}%."
            step3_status = "WARNING"
        else:
            step3_detail = f"Danger Alert: Suspicious activity detected ({trigger_reason}). High risk score: {risk_score:g}%."
            step3_status = "FAILED"

        step3 = {
            "step": 3,
            "phase": "Risk & Safety Scan",
            "title": "Were any warning signs found?",
            "detail": step3_detail,
            "status": step3_status
        }

        # Step 4: Company rule check
        if outcome == "ALLOW":
            step4_detail = f"Follows all rules. Matches: {friendly_policies[0] if friendly_policies else 'Standard routine operations'}."
            step4_status = "PASSED"
        elif outcome == "REVIEW":
            step4_detail = f"Triggered safety rule: {', '.join(friendly_policies)}. Requires manager approval before proceeding."
            step4_status = "WARNING"
        else:
            step4_detail = f"Violated company safety policy: {', '.join(friendly_policies)}. Automatic block enforced."
            step4_status = "FAILED"

        step4 = {
            "step": 4,
            "phase": "Company Rules Check",
            "title": "Does this follow company policy?",
            "detail": step4_detail,
            "status": step4_status
        }

        # Step 5: Final action
        if outcome == "ALLOW":
            step5_detail = "Approved & Completed: The action was executed immediately and permanently recorded in the audit ledger."
            step5_status = "PASSED"
        elif outcome == "REVIEW":
            step5_detail = "Held for Approval: Paused safely. No money or changes have moved yet. Waiting for a manager's sign-off."
            step5_status = "WARNING"
        else:
            step5_detail = "Blocked & Locked Down: Action was halted immediately. No changes were made, and security was alerted."
            step5_status = "FAILED"

        step5 = {
            "step": 5,
            "phase": "Final Outcome",
            "title": "What happens now?",
            "detail": step5_detail,
            "status": step5_status
        }

        steps = [step1, step2, step3, step4, step5]

        return {
            "step_by_step_reasoning": steps,
            "human_readable_narrative": narrative
        }

explainer_engine = ArgusExplainer()
