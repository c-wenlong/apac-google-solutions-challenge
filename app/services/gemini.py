import os
from google import genai
from google.genai import types

from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

DEFAULT_MODEL = "gemini-2.5-flash-preview-04-17"
SMART_MODEL = "gemini-2.5-pro-preview-05-06"

# Chat completion (text generation)
def get_gemini_response(prompt: str) -> dict:
    response = client.models.generate_content(model=DEFAULT_MODEL, contents=[prompt])
    return {"response": response.text}


# Speech-to-text (audio transcription)
def gemini_speech_to_text(audio_path: str) -> str:
    myfile = client.files.upload(file=audio_path)
    prompt = "Generate a transcript of the speech."
    response = client.models.generate_content(
        model=DEFAULT_MODEL, contents=[prompt, myfile]
    )
    return response.text


# Text-to-speech (Gemini does not natively support TTS as of now)
def gemini_text_to_speech(text: str) -> bytes:
    # Gemini API does not provide TTS (audio synthesis) as of June 2024.
    # Placeholder: return None or raise NotImplementedError
    # If Gemini adds TTS, update this function accordingly.
    raise NotImplementedError("Gemini API does not support text-to-speech (TTS) yet.")
