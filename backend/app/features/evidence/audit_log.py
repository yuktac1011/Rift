import hashlib
import json
from typing import Dict, Any, Optional

class ImmutableAuditLog:
    def __init__(self):
        # Simulating an in-memory Merkle chain or Immudb connection
        self._chain = []
        self._last_hash = "0000000000000000000000000000000000000000000000000000000000000000"

    def append_record(self, record: Dict[str, Any]) -> str:
        """
        Appends a record to the immutable audit log, cryptographically linking it 
        to the previous record via a SHA-256 hash.
        """
        payload = json.dumps(record, sort_keys=True).encode("utf-8")
        current_hash = hashlib.sha256(self._last_hash.encode("utf-8") + payload).hexdigest()
        
        entry = {
            "record": record,
            "previous_hash": self._last_hash,
            "hash": current_hash
        }
        
        self._chain.append(entry)
        self._last_hash = current_hash
        
        return current_hash

audit_log = ImmutableAuditLog()
