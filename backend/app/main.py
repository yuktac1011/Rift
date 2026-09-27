from fastapi import FastAPI
from app.config.settings import settings
from app.core.exceptions import setup_exception_handlers
from app.core.logging import logger
from app.features.observation.router import router as observation_router

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
    )
    
    setup_exception_handlers(app)
    
    app.include_router(observation_router, prefix=settings.API_V1_STR)
    
    @app.on_event("startup")
    async def startup_event():
        logger.info(f"Starting up {settings.PROJECT_NAME}...")

    @app.on_event("shutdown")
    async def shutdown_event():
        logger.info(f"Shutting down {settings.PROJECT_NAME}...")

    @app.get("/health/liveness", tags=["health"])
    async def liveness():
        return {"status": "up"}

    @app.get("/health/readiness", tags=["health"])
    async def readiness():
        # In a real app, verify DB/cache connections here
        return {"status": "ready"}
        
    return app

app = create_app()
