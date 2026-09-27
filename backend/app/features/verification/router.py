from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from .service import VerificationService
from app.core.logging import logger

router = APIRouter(prefix="/verification", tags=["verification"])

class ActionPayload(BaseModel):
    agent_id: str
    action_type: str
    confidence_score: float
    data: Dict[str, Any]

@router.post("/pre-check")
async def pre_execution_check(payload: ActionPayload):
    try:
        is_safe = await VerificationService.pre_execution_check(
            agent_id=payload.agent_id,
            action=payload.model_dump()
        )
        return {"safe": is_safe, "action_type": payload.action_type}
    except Exception as e:
        logger.error(f"Pre-check failed: {e}")
        raise HTTPException(status_code=500, detail="Verification failed")
