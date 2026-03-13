const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
console.log("API_BASE_URL", API_BASE_URL);

async function parseResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export async function signup(payload) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return parseResponse(response);
}

export async function signin(payload) {
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return parseResponse(response);
}

export async function verifyAuthToken(token) {
  const response = await fetch(`${API_BASE_URL}/auth/verify`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return parseResponse(response);
}

export async function getAllProducts(token) {
  const response = await fetch(`${API_BASE_URL}/products/getAllProducts`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return parseResponse(response);
}

export async function getMyCart(token) {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return parseResponse(response);
}

export async function addToCart(token, payload) {
  const response = await fetch(`${API_BASE_URL}/cart/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  return parseResponse(response);
}

export async function updateCartItem(token, productId, payload) {
  const response = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  return parseResponse(response);
}

export async function removeCartItem(token, productId) {
  const response = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return parseResponse(response);
}

export async function clearMyCart(token) {
  const response = await fetch(`${API_BASE_URL}/cart/clear`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return parseResponse(response);
}

export async function placeOrder(token) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return parseResponse(response);
}

export async function getMyOrders(token) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return parseResponse(response);
}

export async function getMyProfile(token) {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return parseResponse(response);
}

export async function updateMyProfile(token, payload) {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  return parseResponse(response);
}
