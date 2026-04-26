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

    const data = await handleResponse(response, "Invalid email or password");
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