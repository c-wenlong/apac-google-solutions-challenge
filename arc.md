# Architecture Diagram: Crowd Control - Tourism Density Mapper

```mermaid
graph TD
    subgraph Frontend React/Vite
        A[User Interface]
        B[AI Chat & Guidance]
        C[Tourism Density Visualizer]
        D[Speech/Text Integration]
        E[Custom Lists & Itinerary]
    end

    subgraph Backend Flask API
        F[API Gateway]
        G[Gemini Service]
        H[OpenAI Service]
        I[Places & Crowd Data Service]
        J[Crowd Data Storage]
    end

    subgraph External Services
        K[Google Gemini API]
        L[OpenAI API]
        M[Live Popular Times API]
    end

    %% User interaction
    A -->|User actions| F
    B --> F
    C --> F
    D --> F
    E --> F

    %% Backend routing
    F -->|/gemini/text-to-text, /gemini/speech-to-text| G
    F -->|/openai/text-to-speech| H
    F -->|/gemini/places, /gemini/places/update, /gemini/places/current-crowd-data| I

    %% AI and data services
    G -->|Text/Speech requests| K
    H -->|Text-to-Speech| L
    I -->|Crowd data fetch| M
    I --> J
    I --> G

    %% Data flow
    J --> I
    I --> F
    G --> F
    H --> F
```

---

**Description:**
- The **Frontend** (React, Vite, shadcn/ui) provides the user interface, chat, visualizations, and speech/text features.
- The **Backend** (Flask API) acts as an API gateway, routing requests to Gemini, OpenAI, and the Places/Crowd Data service.
- **Gemini Service** handles AI chat and speech-to-text via Google Gemini API.
- **OpenAI Service** handles text-to-speech via OpenAI API.
- **Places & Crowd Data Service** manages place extraction, crowd data retrieval (from Live Popular Times API), and stores results in `test.json`.
- Data flows between frontend, backend, AI services, and external APIs as shown above.
