
const API_BASE_URL = "http://localhost:8080/api";

export async function getClothing() {
    const response = await fetch(`${API_BASE_URL}/clothing`);

    if (!response.ok) {
        throw new Error(`Failed to load clothing (${response.status})`);
    }

    return response.json();
}

export async function getMyListings() {
    const token = localStorage.getItem("rewearToken");

    if (!token) {
        throw new Error("Please log in first.");
    }

    const response = await fetch(
        "http://localhost:8080/api/clothing/my-listings",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Could not load your listings.");
    }

    return data;
}

export async function createClothing(clothingData) {
  const token = localStorage.getItem("rewearToken");

  if (!token) {
    throw new Error("Please log in to add clothing.");
  }

  const response = await fetch("http://localhost:8080/api/clothing", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(clothingData),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create clothing listing."
    );
  }

  return data;
}

