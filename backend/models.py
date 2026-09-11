from sqlalchemy import Column, String, Float, JSON, DateTime, Integer, Boolean, Text
from database import Base
import datetime

class AuditLogModel(Base):
    __tablename__ = "audit_logs"

    log_id = Column(String, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    agent_id = Column(String, index=True)
    action_type = Column(String)
    input_payload = Column(JSON)
    reasoning_steps = Column(JSON)
    policies_triggered = Column(JSON)
    confidence_score = Column(Float)
    execution_mode = Column(String)
    previous_hash = Column(String)
    current_hash = Column(String, unique=True, index=True)


class LedgerBlockModel(Base):
    __tablename__ = "ledger_blocks"

    id = Column(String, primary_key=True, index=True)
    block_height = Column(Integer, unique=True, index=True)
    timestamp = Column(String)
    agent_id = Column(String, index=True)
    agent_name = Column(String)
    action_type = Column(String)
    execution_mode = Column(String)
    outcome = Column(String)
    risk_score = Column(Float)
    confidence_score = Column(Float)
    latency_ms = Column(Integer, default=112)
    task_completed = Column(Boolean, default=True)
    policies_triggered = Column(JSON)
    policies_evaluated = Column(JSON)
    block_hash = Column(String, unique=True, index=True)
    parent_block_hash = Column(String)
    digital_signature = Column(String)
    merkle_root = Column(String)
    tampered = Column(Boolean, default=False)
    
    raw_input_payload = Column(JSON)
    output_payload = Column(JSON)
    step_by_step_reasoning = Column(JSON)
    human_readable_narrative = Column(Text)