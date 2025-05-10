from flask import Blueprint, request, jsonify
from ..services import get_gemini_response, retrieve_places


gemini_bp = Blueprint("gemini", __name__)


@gemini_bp.route("/gemini", methods=["POST"])
def gemini():
    data = request.get_json()
    prompt = data.get("prompt", "")
    response = get_gemini_response(prompt)
    return jsonify(response)
