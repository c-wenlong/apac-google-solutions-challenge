import os
from google import genai
from google.genai import types
import time
from dotenv import load_dotenv

load_dotenv()

DEFAULT_MODEL = "gemini-2.5-flash-preview-04-17"
SMART_MODEL = "gemini-2.5-pro-preview-05-06"


# Chat completion (text generation)
def get_gemini_response(prompt: str, context: str = "") -> dict:
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    contents = []
    system_instruction = ""
    for line in context.splitlines():
        if not line.strip():
            continue
        if line.startswith("user: "):
            text = line[len("user: ") :]
            contents.append(types.Content(role="user", parts=[types.Part(text=text)]))
        elif line.startswith("assistant: "):
            text = line[len("assistant: ") :]
            contents.append(types.Content(role="model", parts=[types.Part(text=text)]))
        elif line.startswith("system: "):
            text = line[len("system: ") :]
            system_instruction += text
    # Add the latest user prompt
    contents.append(types.Content(role="user", parts=[types.Part(text=prompt)]))
    print("system_instruction: ", system_instruction)
    print(contents)
    response = client.models.generate_content(
        config=types.GenerateContentConfig(system_instruction=system_instruction),
        model=DEFAULT_MODEL,
        contents=contents,
    )
    return {"response": response.text}


def wait_for_file_active(client, file_name, timeout=120):
    start = time.time()
    while time.time() - start < timeout:
        try:
            file_info = client.files.get(name=file_name)
            print("File info:", file_info)
            if getattr(file_info, "state", None) == "ACTIVE":
                return True
            elif getattr(file_info, "state", None) == "FAILED":
                print("File processing failed.")
                return False
        except Exception as e:
            print("Error while polling file status:", e)
        time.sleep(2)  # Slightly longer delay between polls
    return False


def gemini_speech_to_text(audio_path: str) -> str:
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    myfile = client.files.upload(file=audio_path)
    file_name = myfile.name
    print("Uploaded file name:", file_name)
    print("File status:", myfile.state)
    print("File size (bytes):", getattr(myfile, "size_bytes", "Unknown"))
    if not wait_for_file_active(client, file_name):
        raise Exception("File did not become ACTIVE in time.")
    prompt = "Generate a transcript of the speech. Do not include any other text than the transcript."
    response = client.models.generate_content(
        model=DEFAULT_MODEL, contents=[prompt, myfile]
    )
    return response.text
