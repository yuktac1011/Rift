from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from .kafka_client import event_bus
from .telemetry import tracer
from app.core.logging import logger

router = APIRouter(prefix="/observation", tags=["observation"])

class EventPayload(BaseModel):
    agent_id: str
    action_type: str
    data: Dict[str, Any]

@router.post("/events", status_code=202)
async def ingest_event(payload: EventPayload):
    with tracer.start_as_current_span("ingest_event"):
        try:
            logger.info(f"Ingesting event for agent {payload.agent_id}")
            event_bus.produce(
                topic="agent-events",
                key=payload.agent_id,
                value=payload.model_dump()
            )
            return {"status": "accepted"}
        except Exception as e:
            logger.error(f"Failed to ingest event: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")
