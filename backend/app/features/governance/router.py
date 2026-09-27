from fastapi import APIRouter
from pydantic import BaseModel
from .webhooks import notifier

router = APIRouter(prefix="/governance", tags=["governance"])

class AlertPayload(BaseModel):
    message: str
    severity: str

@router.post("/alert")
async def trigger_alert(payload: AlertPayload):
    # In production, lookup webhook_url from settings
    success = await notifier.alert_slack("https://hooks.slack.com/dummy", payload.model_dump())
    return {"alerted": success}
