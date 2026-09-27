import httpx
import asyncio
from app.core.logging import logger

async def run_load_test():
    """
    Simulates a burst of malicious agent behavior to test 
    the Verification and Enforcement planes under load.
    """
    logger.info("Starting Rift Chaos Test...")
    async with httpx.AsyncClient() as client:
        tasks = []
        for i in range(100):
            payload = {
                "agent_id": f"chaos-agent-{i}",
                "action_type": "delete_system_files",
                "confidence_score": 0.9,
                "data": {}
            }
            tasks.append(client.post("http://localhost:8000/api/v1/verification/pre-check", json=payload))
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        successes = sum(1 for r in results if not isinstance(r, Exception) and getattr(r, 'status_code', None) == 200)
        logger.info(f"Chaos Test Complete. Processed {successes}/100 requests successfully under load.")

if __name__ == "__main__":
    asyncio.run(run_load_test())
