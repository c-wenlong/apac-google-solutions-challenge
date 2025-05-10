from flask import Blueprint, request, jsonify
from ..services import get_gemini_response, retrieve_places, gemini_speech_to_text, update_places, get_place_current_crowd_data
import tempfile
import os
import ffmpeg

gemini_bp = Blueprint("gemini", __name__)


@gemini_bp.route("/gemini/text-to-text", methods=["POST"])
def gemini_text():
    data = request.get_json()
    prompt = data.get("prompt", "")
    context = data.get("context", "")
    print(prompt)
    print(context)
    response = get_gemini_response(prompt, context)
    return jsonify(response)


@gemini_bp.route("/gemini/speech-to-text", methods=["POST"])
def gemini_speech():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided."}), 400
    audio_file = request.files['audio']
    # Save to a temporary webm file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as tmp_webm:
        audio_file.save(tmp_webm)
        webm_path = tmp_webm.name
    # Prepare a temporary wav file path
    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp_wav:
        wav_path = tmp_wav.name
    try:
        # Convert webm to wav using ffmpeg
        ffmpeg.input(webm_path).output(wav_path).run(overwrite_output=True)
        response = gemini_speech_to_text(wav_path)
        return jsonify({"text": response})
    finally:
        os.remove(webm_path)
        os.remove(wav_path)
