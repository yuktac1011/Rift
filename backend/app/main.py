from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.core.exceptions import setup_exception_handlers
from app.core.logging import logger
from app.features.observation.router import router as observation_router
from app.features.verification.router import router as verification_router
from app.features.enforcement.router import router as enforcement_router
from app.features.evidence.router import router as evidence_router
from app.features.governance.router import router as governance_router

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
    )
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    setup_exception_handlers(app)
    
    app.include_router(observation_router, prefix=settings.API_V1_STR)
    app.include_router(verification_router, prefix=settings.API_V1_STR)
    app.include_router(enforcement_router, prefix=settings.API_V1_STR)
    app.include_router(evidence_router, prefix=settings.API_V1_STR)
    app.include_router(governance_router, prefix=settings.API_V1_STR)
    
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
