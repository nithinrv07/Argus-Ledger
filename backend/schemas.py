from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime

class AuditLogCreate(BaseModel):
    log_id: str
    agent_id: str
    action_type: str
    input_payload: Dict[str, Any]
    reasoning_steps: List[str]
    policies_triggered: List[str]
    confidence_score: float
    execution_mode: str

class AuditLogResponse(AuditLogCreate):
    timestamp: datetime
    previous_hash: str
    current_hash: str

    class Config:
        from_attributes = True