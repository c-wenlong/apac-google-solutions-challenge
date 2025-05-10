from pydantic import BaseModel, RootModel
from typing import List, Optional
from google import genai
from google.genai import types
from populartimes import get_id
from livepopulartimes.crawler import get_populartimes_by_formatted_address
import googlemaps, os, dotenv, json

dotenv.load_dotenv()

GEMINI_KEY   = os.getenv("GEMINI_API_KEY")           # Gemini / genai key
MODEL_NAME   = "gemini-2.0-flash"

client = genai.Client(api_key=GEMINI_KEY)

class PlaceInfo(BaseModel):
    place_name: str
    address:    Optional[str] = None

class PlacesPayload(RootModel[List[PlaceInfo]]): pass

def retrieve_places(raw_text: str):
    prompt = (
        "Return JSON array with objects {place_name, address of the place} "
        "for every venue listed below.\n\n" + raw_text
    )
    resp = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": PlacesPayload,
        },
    )
    places: PlacesPayload = resp.parsed
    results = []

    for p in places.root:
        livepopulartimes_updates = get_populartimes_by_formatted_address(p.place_name + " " + (p.address or ""))
        if livepopulartimes_updates:
            results.append({
                **p.model_dump(),
                "crowd_data": livepopulartimes_updates.get('populartimes'),
            })
        else:
            results.append({
                "place_info": p.model_dump(),
                "crowd_data": None,
                "warning": "No Crowd Data Found"
            })
    return {"results": results}

# ---------- 3.  Example run ---------- #
if __name__ == "__main__":
    demo = """
Stockholm Public Library - https://maps.app.goo.gl/jSKZEsPDBkYuUS446
Epicenter - https://maps.app.goo.gl/Cs4aAiCt1RzhwMjL8
Meatballs for the People - https://maps.app.goo.gl/fvcW2g6KnG81gT6r5
Matcha Ya - https://maps.app.goo.gl/JyUz5YAvNQTgN3y1A  
    """
    result = retrieve_places(demo)
    with open("test.json", "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
        print("Results saved to test.json")
