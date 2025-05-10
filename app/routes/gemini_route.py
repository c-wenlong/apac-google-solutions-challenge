from flask import Blueprint, request, jsonify
from ..services import get_gemini_response, retrieve_places, gemini_speech_to_text


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
