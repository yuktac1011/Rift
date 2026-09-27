from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .engine import decision_engine
from app.core.logging import logger

router = APIRouter(prefix="/enforcement", tags=["enforcement"])

class ViolationPayload(BaseModel):
    agent_id: str
    severity_score: float

@router.post("/trigger")
async def trigger_enforcement(payload: ViolationPayload):
    try:
        level = decision_engine.evaluate_violation(payload.agent_id, payload.severity_score)
        signed_record = decision_engine.execute_response(payload.agent_id, level)
        return {"status": "enforced", "record": signed_record}
    except Exception as e:
        logger.error(f"Failed to enforce action: {e}")
        raise HTTPException(status_code=500, detail="Enforcement execution failed")
