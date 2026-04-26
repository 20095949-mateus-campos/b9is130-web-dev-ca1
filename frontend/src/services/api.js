const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function getToken() {
    return localStorage.getItem("token");
}

function authHeaders() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(response, fallbackMessage) {
    if (!response.ok) {
        let message = fallbackMessage;

        try {
            const data = await response.json();
            message = data.detail || fallbackMessage;
        } catch {
            message = fallbackMessage;
        }

        throw new Error(message);
    }

    return response.json();
}

export async function loginUser(email, password) {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
    }

    const data = await response.json();

    localStorage.setItem("token", data.access_token);

    return data;
}

export async function registerUser(username, email, password) {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
    });

    return handleResponse(response, "Registration failed");
}

export async function getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: authHeaders(),
    });

    return handleResponse(response, "Please sign in first");
}

export async function getMyOrders() {
    const response = await fetch(`${API_BASE_URL}/api/orders/my-history`, {
        headers: authHeaders(),
    });

    return handleResponse(response, "Could not load orders");
}

export async function getOrderById(orderId) {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        headers: authHeaders(),
    });

    return handleResponse(response, "Could not load order details");
}

export function logoutUser() {
    localStorage.removeItem("token");
}

export async function getRecords(searchQuery = "") {
    const url = searchQuery 
        ? `${API_BASE_URL}/records?search=${encodeURIComponent(searchQuery)}`
        : `${API_BASE_URL}/records`;
    
    const response = await fetch(`${url}`);

    if (!response.ok) {
        throw new Error("Failed to fetch records");
    }

    return await response.json();
}

// Get wishlist
export async function getWishlist() {
  const response = await fetch(`${API_BASE_URL}/wishlist`, {
    headers: authHeaders(),
  });

  return handleResponse(response, "Failed to fetch wishlist");
}

// Add to wishlist
export async function addToWishlistAPI(recordId) {
  const response = await fetch(`${API_BASE_URL}/wishlist/${recordId}`, {
    method: "POST",
    headers: {
      ...authHeaders(),
    },
  });

  return handleResponse(response, "Failed to add to wishlist");
}

// Remove from wishlist
export async function removeFromWishlistAPI(recordId) {
  const response = await fetch(`${API_BASE_URL}/wishlist/${recordId}`, {
    method: "DELETE",
    headers: {
      ...authHeaders(),
    },
  });

  return handleResponse(response, "Failed to remove from wishlist");
}

//Checkout
export async function checkoutOrder(checkoutData) {
    const response = await fetch(`${API_BASE_URL}/checkout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(), // already uses localStorage token
        },
        body: JSON.stringify(checkoutData),
    });

    return handleResponse(response, "Checkout failed");
}

export async function updateRecord(recordId, updateData) {
  const response = await fetch(`${API_BASE_URL}/records/${recordId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to update record");
  }
  return await response.json();
}

export async function deleteRecord(recordId) {
  const response = await fetch(`${API_BASE_URL}/records/${recordId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to delete record");
  }
  return true;
}
