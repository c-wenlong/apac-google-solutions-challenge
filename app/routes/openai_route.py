from flask import Blueprint, request, send_file
from ..services import openai_text_to_speech


openai_bp = Blueprint("openai", __name__)


@openai_bp.route("/openai/text-to-speech", methods=["POST"])
def openai_text_speech():
    data = request.get_json()
    text = data.get("text", "")
    audio_path = openai_text_to_speech(text)
    # Return the audio file as a response
    return send_file(audio_path, mimetype="audio/mpeg", as_attachment=False)
