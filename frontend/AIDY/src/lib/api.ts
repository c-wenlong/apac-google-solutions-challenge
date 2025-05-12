const API_BASE_URL = import.meta.env.APP_URL;

// Types for places API
export interface CrowdData {
  name: string; // Day of week
  data: number[]; // Hourly data
}

export interface Place {
  place_name: string;
  address: string;
  crowd_data?: CrowdData[] | null;
  current_density?: number;
  current_time?: string;
  id?: string;
}

export interface PlacesResponse {
  results: Place[];
}

export interface CurrentCrowdDataResponse {
  timestamp: string;
  places: {
    place_name: string;
    address: string;
    current_density: number | null;
    current_time: string;
  }[];
}

// Function to retrieve places from text
export async function retrievePlaces(query: string): Promise<PlacesResponse> {
  const response = await fetch(`${API_BASE_URL}/gemini/places`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
}

// Function to update places database
export async function updatePlaces(query: string): Promise<PlacesResponse> {
  const response = await fetch(`${API_BASE_URL}/gemini/places/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
}

// Function to get current crowd data
export async function getCurrentCrowdData(): Promise<CurrentCrowdDataResponse> {
  const response = await fetch(
    `${API_BASE_URL}/gemini/places/current-crowd-data`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
}

export async function updateKnowledgeBase(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/gemini/places/save-to-kb`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
}
