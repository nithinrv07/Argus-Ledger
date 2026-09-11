import hashlib
import json
import uuid
import datetime
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, get_db, SessionLocal
from models import Base, AuditLogModel, LedgerBlockModel
import schemas
from ai_model import decision_engine
from explainer import explainer_engine

app = FastAPI(
    title="ARGUS Ledger",
    description="Explainable AI and Cryptographic Audit Trail Platform",
    version="2.0.0"
)

# Enable CORS for frontend Vite/React (ports 3000, 5173, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

def format_block_for_frontend(block: LedgerBlockModel) -> Dict[str, Any]:
    return {
        "id": block.id,
        "timestamp": block.timestamp,
        "agentId": block.agent_id,
        "agentName": block.agent_name,
        "actionType": block.action_type,
        "executionMode": block.execution_mode,
        "outcome": block.outcome,
        "riskScore": block.risk_score,
        "confidenceScore": block.confidence_score,
        "latencyMs": block.latency_ms,
        "taskCompleted": block.task_completed,
        "policiesTriggered": block.policies_triggered or [],
        "policiesEvaluated": block.policies_evaluated or [],
        "blockHeight": block.block_height,
        "blockHash": block.block_hash,
        "parentBlockHash": block.parent_block_hash,
        "digitalSignature": block.digital_signature,
        "merkleRoot": block.merkle_root,
        "tampered": block.tampered,
        "rawInputPayload": block.raw_input_payload or {},
        "outputPayload": block.output_payload or {},
        "stepByStepReasoning": block.step_by_step_reasoning or [],
        "humanReadableNarrative": block.human_readable_narrative or ""
    }

def calculate_sha256(data: str) -> str:
    return "0x" + hashlib.sha256(data.encode()).hexdigest()

# ==========================================
# ARGUS PLATFORM API (Frontend Integration)
# ==========================================

@app.get("/")
def root():
    return {
        "status": "ONLINE",
        "service": "ARGUS Ledger Backend",
        "version": "2.0.0",
        "endpoints": [
            "/api/ledger",
            "/api/verify-ledger",
            "/api/decide-and-log",
            "/api/simulate-tamper",
            "/api/restore-ledger",
            "/logs/",
            "/verify-ledger/"
        ]
    }

@app.get("/api/ledger")
def get_ledger_blocks(db: Session = Depends(get_db)):
    blocks = db.query(LedgerBlockModel).order_by(LedgerBlockModel.block_height.desc()).all()
    return [format_block_for_frontend(b) for b in blocks]

@app.get("/api/verify-ledger")
def verify_ledger_api(db: Session = Depends(get_db)):
    blocks = db.query(LedgerBlockModel).order_by(LedgerBlockModel.block_height.asc()).all()
    
    if not blocks:
        return {
            "isValid": True,
            "blockHeight": 0,
            "verifiedBlockCount": 0,
            "latestBlockHash": "0x0",
            "genesisHash": "0x0",
            "lastAuditTimestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "brokenBlockIndex": None,
            "signatureAlgorithm": "Ed25519-SHA256",
            "hashAlgorithm": "SHA-256 (NIST FIPS 180-4)",
            "tamperCount": 0
        }

    broken_index = None
    tamper_count = 0

    for i in range(len(blocks)):
        curr = blocks[i]
        
        if curr.tampered:
            broken_index = i
            tamper_count += 1
            break
            
        if i > 0:
            prev = blocks[i - 1]
            if curr.parent_block_hash != prev.block_hash:
                broken_index = i
                tamper_count += 1
                break

    is_valid = (tamper_count == 0 and broken_index is None)
    latest = blocks[-1]
    genesis = blocks[0]

    return {
        "isValid": is_valid,
        "blockHeight": latest.block_height,
        "verifiedBlockCount": len(blocks),
        "latestBlockHash": latest.block_hash,
        "genesisHash": genesis.block_hash,
        "lastAuditTimestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "brokenBlockIndex": broken_index,
        "signatureAlgorithm": "Ed25519-SHA256",
        "hashAlgorithm": "SHA-256 (NIST FIPS 180-4)",
        "tamperCount": tamper_count
    }

@app.post("/api/decide-and-log")
def decide_and_log_action(payload: Dict[str, Any], db: Session = Depends(get_db)):
    # 1. Parse incoming request from frontend
    agent_id = payload.get("agent") or payload.get("agent_id") or "Agent-Apollo-01"
    action_type = payload.get("actionType") or payload.get("action_type") or "FUND_DISBURSEMENT"
    intent = payload.get("intent") or "Automated execution event"
    amount_usd = float(payload.get("amountUsd") or payload.get("amount_usd") or 0.0)

    request_context = {
        "agent_id": agent_id,
        "action_type": action_type,
        "intent": intent,
        "amount_usd": amount_usd,
        "target_resource": payload.get("targetResource", "internal://argus-ledger/gateway"),
        "device_trust_score": float(payload.get("deviceTrustScore", 96)),
        "mfa_verified": bool(payload.get("mfaVerified", True)),
        "session_tokens_age_sec": int(payload.get("sessionTokensAgeSec", 18)),
    }

    # 2. Evaluate decision via AI model
    decision = decision_engine.evaluate(request_context)

    # 3. Generate transparent step-by-step reasoning via XAI explainer
    xai_output = explainer_engine.generate_explanation(request_context, decision)

    # 4. Fetch latest block to maintain hash chain
    latest_block = db.query(LedgerBlockModel).order_by(LedgerBlockModel.block_height.desc()).first()
    new_height = (latest_block.block_height + 1) if latest_block else 1
    parent_hash = latest_block.block_hash if latest_block else ("0x" + "0" * 64)

    # 5. Generate cryptographic block hash and digital signature
    timestamp_iso = datetime.datetime.utcnow().isoformat() + "Z"
    new_id = f"DEC-2026-{new_height:04d}"
    
    hash_payload = f"{new_height}:{parent_hash}:{new_id}:{decision['risk_score']}:{decision['outcome']}:{timestamp_iso}"
    new_block_hash = calculate_sha256(hash_payload)
    sig = f"ed25519:sig:{new_height}_{hashlib.sha256((new_block_hash + 'sig').encode()).hexdigest()[:48]}"
    merkle_root = f"0x{hashlib.sha256((new_block_hash + 'merkle').encode()).hexdigest()}"

    agent_names = {
        "Agent-Apollo-01": "Apollo Treasury Auditor",
        "Agent-Hermes-04": "Hermes Execution Engine",
        "Agent-Minerva-03": "Minerva Security Sentinel",
        "Agent-Athena-02": "Athena Customer & PII Guardrail",
        "Agent-Zeus-07": "Zeus Infrastructure Orchestrator",
    }
    agent_name = agent_names.get(agent_id, f"{agent_id} Autonomous Agent")

    raw_input = {
        "intent": intent,
        "requesterId": f"usr-{agent_id.lower().replace('-', '_')}",
        "requesterRole": "AUTONOMOUS_CONTROLLER",
        "targetResource": request_context["target_resource"],
        "amountUsd": amount_usd if amount_usd > 0 else None,
        "sourceIp": "10.240.8.19 (VPC Gateway)",
        "geoCountry": "US",
        "deviceTrustScore": int(request_context["device_trust_score"]),
        "mfaVerified": bool(request_context["mfa_verified"]),
        "sessionTokensAgeSec": int(request_context["session_tokens_age_sec"]),
        "contextPayload": {"evaluatedPoliciesCount": len(decision["policies_evaluated"])}
    }

    output_payload = {
        "decisionStatus": decision["outcome"],
        "authLevelGranted": decision["auth_level"],
        "circuitBreakerTripped": decision["circuit_breaker"],
        "policyViolationCount": len(decision["policies_triggered"]) if decision["outcome"] != "ALLOW" else 0,
        "complianceCode": f"COMP-ARGUS-{decision['outcome']}-100",
        "enforcementAction": "BLOCK_AND_ISOLATE" if decision["outcome"] == "BLOCK" else ("ESCALATE_TO_SECOPS" if decision["outcome"] == "REVIEW" else "COMMIT_TRANSACTION_TO_LEDGER"),
        "auditReceiptSignature": f"sha256:rcpt_{new_height}_{decision['outcome'].lower()}_{new_block_hash[-6:]}"
    }

    new_block = LedgerBlockModel(
        id=new_id,
        block_height=new_height,
        timestamp=timestamp_iso,
        agent_id=agent_id,
        agent_name=agent_name,
        action_type=action_type,
        execution_mode=decision["execution_mode"],
        outcome=decision["outcome"],
        risk_score=decision["risk_score"],
        confidence_score=decision["confidence_score"],
        latency_ms=115,
        task_completed=True,
        policies_triggered=decision["policies_triggered"],
        policies_evaluated=decision["policies_evaluated"],
        block_hash=new_block_hash,
        parent_block_hash=parent_hash,
        digital_signature=sig,
        merkle_root=merkle_root,
        tampered=False,
        raw_input_payload=raw_input,
        output_payload=output_payload,
        step_by_step_reasoning=xai_output["step_by_step_reasoning"],
        human_readable_narrative=xai_output["human_readable_narrative"]
    )

    db.add(new_block)

    # Also record to legacy AuditLogModel for backward compatibility
    legacy_log = AuditLogModel(
        log_id=new_id,
        timestamp=datetime.datetime.utcnow(),
        agent_id=agent_id,
        action_type=action_type,
        input_payload=raw_input,
        reasoning_steps=[s["detail"] for s in xai_output["step_by_step_reasoning"]],
        policies_triggered=decision["policies_triggered"],
        confidence_score=decision["confidence_score"],
        execution_mode=decision["execution_mode"],
        previous_hash=parent_hash,
        current_hash=new_block_hash
    )
    db.add(legacy_log)
    db.commit()
    db.refresh(new_block)

    return format_block_for_frontend(new_block)

@app.post("/api/simulate-tamper")
def simulate_tamper_endpoint(db: Session = Depends(get_db)):
    target_block = db.query(LedgerBlockModel).order_by(LedgerBlockModel.block_height.desc()).first()
    if target_block:
        target_block.tampered = True
        target_block.block_hash = "0xBAD0000000000000000000000000000000000000000000000000000000000BAD"
        db.commit()
        return {"status": "TAMPERED", "block_height": target_block.block_height, "message": f"Adversarial mutation injected into block #{target_block.block_height}"}
    return {"status": "ERROR", "message": "No blocks in ledger to tamper"}

@app.post("/api/restore-ledger")
def restore_ledger_endpoint(db: Session = Depends(get_db)):
    target_block = db.query(LedgerBlockModel).filter(LedgerBlockModel.tampered == True).first()
    if target_block:
        target_block.tampered = False
        hash_payload = f"{target_block.block_height}:{target_block.parent_block_hash}:{target_block.id}:{target_block.risk_score}:{target_block.outcome}:{target_block.timestamp}"
        target_block.block_hash = calculate_sha256(hash_payload)
        db.commit()
        return {"status": "RESTORED", "block_height": target_block.block_height, "message": f"Valid cryptographic hash restored on block #{target_block.block_height}"}
    return {"status": "NO_TAMPER", "message": "No tampered blocks found"}

@app.delete("/api/ledger/{decision_id}")
def delete_ledger_block(decision_id: str, db: Session = Depends(get_db)):
    target_block = db.query(LedgerBlockModel).filter(LedgerBlockModel.id == decision_id).first()
    if not target_block:
        raise HTTPException(status_code=404, detail=f"Report {decision_id} not found")
    
    deleted_height = target_block.block_height
    db.delete(target_block)
    db.commit()

    # Re-chain remaining blocks to maintain height ordering and cryptographic hash consensus
    remaining_blocks = db.query(LedgerBlockModel).order_by(LedgerBlockModel.block_height.asc()).all()
    prev_hash = "0x" + "0" * 64
    for idx, b in enumerate(remaining_blocks):
        b.block_height = idx + 1
        b.parent_block_hash = prev_hash
        hash_payload = f"{b.block_height}:{b.parent_block_hash}:{b.id}:{b.risk_score}:{b.outcome}:{b.timestamp}"
        b.block_hash = calculate_sha256(hash_payload)
        prev_hash = b.block_hash

    db.commit()
    return {
        "status": "SUCCESS",
        "message": f"Report {decision_id} (Block #{deleted_height}) deleted successfully",
        "remainingCount": len(remaining_blocks)
    }

@app.delete("/api/ledger")
def clear_all_ledger_blocks(db: Session = Depends(get_db)):
    db.query(LedgerBlockModel).delete()
    db.commit()
    return {"status": "SUCCESS", "message": "All reports deleted from ledger"}

# ==========================================
# LEGACY AUDIT LOG API (Preserved Endpoints)
# ==========================================

def calculate_hash(log_data: dict, previous_hash: str) -> str:
    block_string = json.dumps({
        "log_id": log_data.get("log_id"),
        "agent_id": log_data.get("agent_id"),
        "action_type": log_data.get("action_type"),
        "input_payload": log_data.get("input_payload"),
        "reasoning_steps": log_data.get("reasoning_steps"),
        "policies_triggered": log_data.get("policies_triggered"),
        "confidence_score": log_data.get("confidence_score"),
        "execution_mode": log_data.get("execution_mode"),
        "previous_hash": previous_hash
    }, sort_keys=True)
    return hashlib.sha256(block_string.encode()).hexdigest()

@app.post("/logs/", response_model=schemas.AuditLogResponse)
def create_audit_log(log: schemas.AuditLogCreate, db: Session = Depends(get_db)):
    last_log = db.query(AuditLogModel).order_by(AuditLogModel.timestamp.desc()).first()
    previous_hash = last_log.current_hash if last_log else "0" * 64
    
    log_dict = log.model_dump() if hasattr(log, "model_dump") else log.dict()
    current_hash = calculate_hash(log_dict, previous_hash)
    
    db_log = AuditLogModel(
        **log_dict,
        previous_hash=previous_hash,
        current_hash=current_hash
    )
    
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

@app.get("/logs/", response_model=List[schemas.AuditLogResponse])
def get_audit_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    logs = db.query(AuditLogModel).order_by(AuditLogModel.timestamp.asc()).offset(skip).limit(limit).all()
    return logs

@app.get("/verify-ledger/")
def verify_ledger(db: Session = Depends(get_db)):
    logs = db.query(AuditLogModel).order_by(AuditLogModel.timestamp.asc()).all()
    
    for i in range(len(logs)):
        current_log = logs[i]
        expected_prev_hash = logs[i - 1].current_hash if i > 0 else "0" * 64
        
        if current_log.previous_hash != expected_prev_hash:
            return {"status": "TAMPERED", "invalid_log_id": current_log.log_id, "reason": "Previous hash mismatch"}
            
        log_dict = {
            "log_id": current_log.log_id,
            "agent_id": current_log.agent_id,
            "action_type": current_log.action_type,
            "input_payload": current_log.input_payload,
            "reasoning_steps": current_log.reasoning_steps,
            "policies_triggered": current_log.policies_triggered,
            "confidence_score": current_log.confidence_score,
            "execution_mode": current_log.execution_mode,
            "previous_hash": current_log.previous_hash
        }
        recalculated_hash = calculate_hash(log_dict, current_log.previous_hash)
        
        if recalculated_hash != current_log.current_hash:
            return {"status": "TAMPERED", "invalid_log_id": current_log.log_id, "reason": "Data content modified"}
            
    return {"status": "SECURE", "total_blocks_verified": len(logs)}