from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.routes.upload import router as upload_router
from app.middleware.security import limiter
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="Sales Insight Automator API",
    description="Upload CSV/XLSX sales data → AI summary → Email delivery",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Rate limiter state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# Routes
app.include_router(upload_router, prefix="/api/v1", tags=["Upload"])

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "Sales Insight Automator"}