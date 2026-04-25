const BASE_URL = "http://127.0.0.1:8000";

export const getRecords = async () => {
  try {
    const response = await fetch(`${BASE_URL}/records`);
    if (!response.ok) {
      throw new Error("Failed to fetch records");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};