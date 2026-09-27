from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from .audit_log import audit_log
from .attestation import attestor
from .bundles import bundler
from .historian import historian
from app.core.logging import logger

router = APIRouter(prefix="/evidence", tags=["evidence"])

class EvidencePayload(BaseModel):
    spiffe_id: str
    svid: str
    action_data: Dict[str, Any]
    decision_data: Dict[str, Any]

@router.post("/submit")
async def submit_evidence(payload: EvidencePayload):
    try:
        # 1. Attest agent identity
        is_valid = attestor.verify_agent_identity(payload.spiffe_id, payload.svid)
        if not is_valid:
            raise HTTPException(status_code=401, detail="Agent identity attestation failed")
            
        # 2. Bundle evidence
        bundle = bundler.create_bundle(
            agent_id=payload.spiffe_id,
            action=payload.action_data,
            decision=payload.decision_data
        )
        
        # 3. Append to immutable log
        tx_hash = audit_log.append_record(bundle)
        
        # 4. Index for search
        historian.index_evidence(bundle)
        
        return {"status": "archived", "transaction_hash": tx_hash}
    except Exception as e:
        logger.error(f"Failed to process evidence: {e}")
        raise HTTPException(status_code=500, detail="Evidence submission failed")
