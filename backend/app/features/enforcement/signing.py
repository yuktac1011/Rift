import hashlib
import json
from datetime import datetime
from typing import Dict, Any

class DecisionSigner:
    def __init__(self, private_key: str = "dummy-private-key-from-vault"):
        self.private_key = private_key

    def sign_decision(self, decision: Dict[str, Any]) -> Dict[str, Any]:
        """
        Signs the decision record using a secret key (simulating COSE/JWT).
        In production, this should integrate with HashiCorp Vault.
        """
        decision["timestamp"] = datetime.utcnow().isoformat()
        payload = json.dumps(decision, sort_keys=True).encode("utf-8")
        
        # Simple HMAC-like signature for demo purposes
        signature = hashlib.sha256(payload + self.private_key.encode("utf-8")).hexdigest()
        
        return {
            "payload": decision,
            "signature": signature
        }

decision_signer = DecisionSigner()
