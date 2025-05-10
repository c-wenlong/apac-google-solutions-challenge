from fastapi import FastAPI
from routes.gemini_route import router as gemini_router

app = FastAPI()
app.include_router(gemini_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}