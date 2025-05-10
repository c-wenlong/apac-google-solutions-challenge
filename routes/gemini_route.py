from fastapi import APIRouter, Request

router = APIRouter()

@router.post("/gemini")
async def gemini_service(request: Request):
    data = await request.json()
    prompt = data.get("prompt", "")
    # Placeholder response
    return {"response": f"Gemini placeholder response to: {prompt}"}
