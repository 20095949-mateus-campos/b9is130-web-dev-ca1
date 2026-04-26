const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function getRecords() {
    try {
        const response = await fetch(`${API_BASE_URL}/records`);
        if (!response.ok) {
            throw new Error("Failed to fetch records");
        }
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
}

export async function getRecordById(id) {
    try {
        const records = await getRecords();
        return records.find((record) => String(record.id) === String(id));
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
}