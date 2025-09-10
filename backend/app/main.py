from app.routes import auth_routes
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import dyslexia, adhd, adaptation, agentic_api, tts_simple

app = FastAPI(
    title="Accessibility Reading Platform - Agentic AI", 
    version="2.0.0",
    description="AI-powered accessibility platform with intelligent agents"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Traditional ML API routes
app.include_router(dyslexia.router, prefix="/api/dyslexia", tags=["dyslexia"])
app.include_router(adhd.router, prefix="/api/adhd", tags=["adhd"])
app.include_router(adaptation.router, prefix="/api/adaptation", tags=["adaptation"])

# Authentication routes
app.include_router(auth_routes.router, prefix="/auth", tags=["authentication"])

# Agentic AI routes
app.include_router(agentic_api.router, prefix="/api/agents", tags=["agentic-ai"])

# Text-to-Speech routes  
app.include_router(tts_simple.router, prefix="/api/tts", tags=["text-to-speech"])

@app.get("/")
async def root():
    return {"message": "Accessibility Reading Platform API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
