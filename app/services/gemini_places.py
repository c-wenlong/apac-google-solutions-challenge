from pydantic import BaseModel, RootModel
from typing import List, Optional
from google import genai
from livepopulartimes.crawler import get_populartimes_by_formatted_address
import os, dotenv, json
import datetime

dotenv.load_dotenv()

GEMINI_KEY = os.getenv("GEMINI_API_KEY")  # Gemini / genai key
MODEL_NAME = "gemini-2.5-pro-preview-05-06"

client = genai.Client(api_key=GEMINI_KEY)


class PlaceInfo(BaseModel):
    place_name: str
    address: Optional[str] = None


class PlacesPayload(RootModel[List[PlaceInfo]]):
    pass


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
        livepopulartimes_updates = get_populartimes_by_formatted_address(
            f"({p.place_name})" + ", " + (p.address or "")
        )
        if livepopulartimes_updates:
            results.append(
                {
                    **p.model_dump(),
                    "crowd_data": livepopulartimes_updates.get("populartimes"),
                }
            )
        else:
            results.append(
                {
                    "place_info": p.model_dump(),
                    "crowd_data": None,
                    "warning": "No Crowd Data Found",
                }
            )
    json_data = {"results": results}
    with open("test.json", "w", encoding="utf-8") as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)
        print("Results saved to test.json")
    return json_data

# ---------- 3.  Example run ---------- #
# if __name__ == "__main__":
#     demo = """
# Stockholm Public Library - https://maps.app.goo.gl/jSKZEsPDBkYuUS446
# Epicenter - https://maps.app.goo.gl/Cs4aAiCt1RzhwMjL8
# Meatballs for the People - https://maps.app.goo.gl/fvcW2g6KnG81gT6r5
# Matcha Ya - https://maps.app.goo.gl/JyUz5YAvNQTgN3y1A
#     """
#     result = retrieve_places(demo)
#     with open("test.json", "w", encoding="utf-8") as f:
#         json.dump(result, f, ensure_ascii=False, indent=2)
#         print("Results saved to test.json")


def update_places(raw_text: str):
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
    new_results = []

    for p in places.root:
        print(f"({p.place_name})" + ", " + (p.address or ""))
        livepopulartimes_updates = get_populartimes_by_formatted_address(
            f"({p.place_name})" + ", " + (p.address or "")
        )
        if livepopulartimes_updates:
            new_results.append(
                {
                    **p.model_dump(),
                    "crowd_data": livepopulartimes_updates.get("populartimes"),
                }
            )
        else:
            new_results.append(
                {**p.model_dump(), "crowd_data": None, "warning": "No Crowd Data Found"}
            )
        print(livepopulartimes_updates)
    # Load existing data
    try:
        with open("test.json", "r", encoding="utf-8") as f:
            existing_data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        existing_data = {"results": []}

    # Append new results
    existing_data["results"].extend(new_results)

    # Write updated data back to file
    with open("test.json", "w", encoding="utf-8") as f:
        json.dump(existing_data, f, ensure_ascii=False, indent=2)

    print(f"Added {len(new_results)} new results to test.json")
    return {"results": new_results}


def get_place_current_crowd_data():
    # Get current day and hour
    now = datetime.datetime.now()
    day_of_week = now.weekday()  # 0 = Monday, 6 = Sunday
    current_hour = now.hour

    day_names = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ]
    current_day = day_names[day_of_week]

    # Load data from test.json
    with open("test.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    result = []

    # Extract current crowd data for each place
    for place in data.get("results", []):
        place_name = place.get("place_name", "Unknown")
        address = place.get("address", "")
        crowd_data = place.get("crowd_data", None)

        current_density = None

        if crowd_data:
            # Find the current day's data
            for day_data in crowd_data:
                if day_data.get("name") == current_day:
                    # Get the current hour's density
                    hourly_data = day_data.get("data", [])
                    if 0 <= current_hour < len(hourly_data):
                        current_density = hourly_data[current_hour]
                    break

        result.append(
            {
                "place_name": place_name,
                "address": address,
                "current_density": current_density,
                "current_time": f"{current_day} {current_hour}:00",
            }
        )

    return {"timestamp": now.isoformat(), "places": result}

def save_place_to_kb():
    data = get_place_current_crowd_data().get("places")
    with open("public/place_crowd_data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
