# Process Flow Diagram: AIDY - Crowd Control App

```mermaid
flowchart TD
    U[User wants to plan a trip]
    G[Import list of places from Google Maps]
    A[Upload/Import to AIDY]
    P[AIDY generates list of locations with crowd density data]
    S[Soft itinerary is created - suggested order/times]
    T[User starts traveling]
    R[Check real-time crowd density for each location]
    D[Decide next location based on live data]
    V[Visit location]
    C[Use AI chat for travel guidance, tips, and navigation]
    L[Loop: Repeat for next location or ask for new suggestions]
    F[Trip complete]

    U --> G
    G --> A
    A --> P
    P --> S
    S --> T
    T --> R
    R --> D
    D --> V
    V --> C
    C --> L
    L -->|Continue trip| R
    L -->|End trip| F
```

---

**Additional Notes:**
- The user can interact with the AI chat at any stage for recommendations, navigation, or local tips.
- The itinerary is flexible and adapts to real-time crowd data, helping users avoid crowded places and optimize their experience.
- The process supports both pre-trip planning and on-the-go decision making.
