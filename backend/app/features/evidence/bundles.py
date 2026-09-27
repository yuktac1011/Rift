from typing import Dict, Any

class EvidenceBundler:
    @staticmethod
    def create_bundle(agent_id: str, action: dict, decision_record: dict) -> Dict[str, Any]:
        """
        Compiles the full context of an action, its verification, and enforcement 
        into a single package for governance review.
        """
        return {
            "agent_id": agent_id,
            "action": action,
            "decision": decision_record,
            "metadata": {
                "system": "Rift Core",
                "attested": True
            }
        }

bundler = EvidenceBundler()
