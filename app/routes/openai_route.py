from flask import Blueprint, request, jsonify
from ..services import openai_text_to_speech


openai_bp = Blueprint("openai", __name__)


@openai_bp.route("/openai/text-to-speech", methods=["POST"])
def openai_text_speech():
    data = request.get_json()
    text = data.get("text", "")
    response = openai_text_to_speech(text)
    return jsonify(response)
