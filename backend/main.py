from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from appwrite.services.databases import Databases
from database import get_databases
from routers import auth, products, categories
from config import settings

app = FastAPI(
    title="Vastraya API (Appwrite Powered)",
    description="Backend API for Vastraya E-commerce using Appwrite",
    version="1.0.0",
)

# CORS Configuration
origins = [
    settings.FRONTEND_URL,
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/api/v1/health", tags=["health"])
async def health_check(db: Databases = Depends(get_databases)):
    try:
        # Check database connection by listing collections
        db.list_collections(database_id=settings.APPWRITE_DATABASE_ID)
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "ok",
        "database": db_status,
        "provider": "appwrite"
    }

# Register Routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(products.router, prefix="/api/v1")
app.include_router(categories.router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
