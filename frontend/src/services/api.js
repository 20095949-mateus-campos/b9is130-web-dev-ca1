const API_BASE_URL = "http://127.0.0.1:8000";
function getToken() {
    return localStorage.getItem("token");
}

function authHeaders() {
    const token = getToken();

    return token
        ? {
            Authorization: `Bearer ${token}`,
        }
        : {};
}

// Records
export async function getRecords() {
    try {
        const response = await fetch(`${API_BASE_URL}/records`);
        if (!response.ok) throw new Error("Failed to fetch records");
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
}

export async function getRecordById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/records/${id}`);
        if (!response.ok) throw new Error("Failed to fetch record");
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
}

// Auth
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
        throw new Error("Invalid email or password");
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

    if (!response.ok) {
        throw new Error("Registration failed");
    }

    return await response.json();
}

export function logoutUser() {
    localStorage.removeItem("token");
}

// User
export async function getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
            ...authHeaders(),
        },
    });

    if (!response.ok) {
        throw new Error("Please sign in first");
    }

    return await response.json();
}

// Orders
export async function getMyOrders() {
    const response = await fetch(`${API_BASE_URL}/api/orders/my-history`, {
        headers: {
            ...authHeaders(),
        },
    });

    if (!response.ok) {
        throw new Error("Could not load orders");
    }

    return await response.json();
}