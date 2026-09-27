from typing import Dict, Any
from .opa_client import opa_client
from .baseline import BehavioralBaseline
from .reasoner import CompositionalReasoner

baseline = BehavioralBaseline()
reasoner = CompositionalReasoner()

class VerificationService:
    @staticmethod
    async def pre_execution_check(agent_id: str, action: Dict[str, Any]) -> bool:
        """
        Validates an action before it is executed.
        """
        is_allowed = await opa_client.check_policy("rift/verification/agent", action)
        
        drift_score = baseline.compute_deviation(agent_id, action)
        if drift_score > 0.8:
            return False
            
        return is_allowed

    @staticmethod
    async def post_execution_check(agent_chain: list) -> bool:
        """
        Validates the side-effects of an execution chain.
        """
        return reasoner.evaluate_chain_of_actions(agent_chain)
