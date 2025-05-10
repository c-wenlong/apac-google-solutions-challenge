from flask import Blueprint, request, jsonify
from ..services import get_gemini_response, retrieve_places, gemini_speech_to_text, update_places, get_place_current_crowd_data


gemini_bp = Blueprint("gemini", __name__)


@gemini_bp.route("/gemini/text-to-text", methods=["POST"])
def gemini_text():
    data = request.get_json()
    prompt = data.get("prompt", "")
    print(prompt)
    response = get_gemini_response(prompt)
    return jsonify(response)


@gemini_bp.route("/gemini/speech-to-text", methods=["POST"])
def gemini_speech():
    data = request.get_json()
    audio_path = data.get("audio_path", "")
    print(audio_path)
    response = gemini_speech_to_text(audio_path)
    return jsonify(response)

@gemini_bp.route("/gemini/places", methods=["POST"])
def gemini_places():
    text = request.get_json()
    query = text.get("query", "")
    response = retrieve_places(query)
    return jsonify(response)

@gemini_bp.route("/gemini/places/update", methods=["POST"])
def gemini_places_update():
    text = request.get_json()
    query = text.get("query", "")
    print(query)
    response = update_places(query)
    return jsonify(response)

@gemini_bp.route("/gemini/places/current-crowd-data", methods=["GET"])
def gemini_places_current_crowd_data():
    response = get_place_current_crowd_data()
    return jsonify(response)


