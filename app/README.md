# APAC Solution Challenge Backend (`app/`)

This is the backend service for the APAC Solution Challenge project, providing AI-powered endpoints for text, speech, and tourism crowd data. It is built with **Flask** and integrates with **Google Gemini** and **OpenAI** APIs.

## Features

- **Text and Speech AI**: Text-to-text, speech-to-text, and text-to-speech using Gemini and OpenAI.
- **Tourism Place Data**: Extracts places from text, fetches live crowd data, and provides current density info.
- **CORS enabled**: Ready for frontend integration.

---

## Directory Structure

```
app/
├── main.py              # Flask app entrypoint
├── wsgi.py              # WSGI entrypoint for deployment
├── __init__.py
├── routes/              # API route blueprints
│   ├── gemini_route.py
│   ├── openai_route.py
│   └── __init__.py
├── services/            # Service logic for AI and data
│   ├── gemini.py
│   ├── openai.py
│   ├── gemini_places.py
│   └── __init__.py
├── public/              # Static files (if any)
├── templates/           # HTML templates (index.html, etc.)
├── test.json            # Stores place crowd data
```

---

## Setup

1. **Install dependencies**  
   (Recommended: use a virtual environment)
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables**  
   Create a `.env` file in the `app/` directory with:
   ```
   GEMINI_API_KEY=your_google_gemini_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

3. **Run the server**
   ```bash
   python -m app.main
   ```
   Or, for production:
   ```bash
   gunicorn app.wsgi:app
   ```

---

## API Endpoints

### Gemini Endpoints

- `POST /gemini/text-to-text`  
  **Body:** `{ "prompt": "...", "context": "..." }`  
  **Returns:** AI-generated text response.

- `POST /gemini/speech-to-text`  
  **Form-data:** `audio` (webm file)  
  **Returns:** `{ "text": "transcribed text" }`

- `POST /gemini/places`  
  **Body:** `{ "query": "list of places in text" }`  
  **Returns:** JSON with place info and crowd data.

- `POST /gemini/places/update`  
  **Body:** `{ "query": "list of places in text" }`  
  **Returns:** Updates and appends new places/crowd data to `test.json`.

- `GET /gemini/places/current-crowd-data`  
  **Returns:** Current crowd density for all places in `test.json`.

### OpenAI Endpoint

- `POST /openai/text-to-speech`  
  **Body:** `{ "text": "..." }`  
  **Returns:** MP3 audio file (cheerful voice).

---

## Data Storage

- **test.json**  
  Stores an array of places with their address and crowd density data (by day/hour).

---

## Notes

- Requires valid API keys for both Gemini and OpenAI.
- Uses `ffmpeg` for audio conversion (ensure it is installed on your system).
- CORS is enabled for all origins.

---

## License

MIT
