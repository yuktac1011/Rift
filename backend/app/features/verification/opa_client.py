import httpx
from typing import Dict, Any
from app.core.logging import logger

class OPAClient:
    def __init__(self, opa_url: str = "http://localhost:8181"):
        self.opa_url = opa_url

    async def check_policy(self, policy_path: str, input_data: Dict[str, Any]) -> bool:
        url = f"{self.opa_url}/v1/data/{policy_path}"
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json={"input": input_data})
                response.raise_for_status()
                result = response.json().get("result", {})
                return result.get("allow", False)
        except Exception as e:
            logger.error(f"OPA policy check failed: {e}")
            return False

opa_client = OPAClient()
