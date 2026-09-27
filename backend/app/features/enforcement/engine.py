from enum import Enum
from typing import Dict, Any
from app.core.logging import logger
from .signing import decision_signer
from .k8s_network_policy import k8s_enforcer

class ResponseLevel(str, Enum):
    LOG = "LOG"
    QUARANTINE = "QUARANTINE"
    SOFT_HALT = "SOFT_HALT"
    HARD_HALT = "HARD_HALT"

class DecisionEngine:
    @staticmethod
    def evaluate_violation(agent_id: str, severity_score: float) -> ResponseLevel:
        if severity_score < 0.3:
            return ResponseLevel.LOG
        elif severity_score < 0.6:
            return ResponseLevel.QUARANTINE
        elif severity_score < 0.9:
            return ResponseLevel.SOFT_HALT
        else:
            return ResponseLevel.HARD_HALT

    @staticmethod
    def execute_response(agent_id: str, level: ResponseLevel) -> Dict[str, Any]:
        logger.warning(f"Executing enforcement level {level} for agent {agent_id}")
        
        action_taken = ""
        if level == ResponseLevel.LOG:
            action_taken = "Logged violation for review"
        elif level == ResponseLevel.QUARANTINE:
            k8s_enforcer.isolate_agent(agent_id)
            action_taken = "Applied network isolation"
        elif level == ResponseLevel.SOFT_HALT:
            action_taken = "Sent graceful shutdown signal to agent proxy"
        elif level == ResponseLevel.HARD_HALT:
            action_taken = "Terminated agent container immediately via k8s API"

        decision_record = {
            "agent_id": agent_id,
            "response_level": level.value,
            "action_taken": action_taken,
        }
        
        return decision_signer.sign_decision(decision_record)

decision_engine = DecisionEngine()
