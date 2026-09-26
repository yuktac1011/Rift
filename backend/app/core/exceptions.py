from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse

class RiftException(Exception):
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code

def setup_exception_handlers(app: FastAPI):
    @app.exception_handler(RiftException)
    async def rift_exception_handler(request: Request, exc: RiftException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.message},
        )
