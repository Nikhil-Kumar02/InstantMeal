import apiClient from "../../services/apiClient";

export const registerUser = async (data) => {
    try {
        const response = await apiClient.post('/register', data);
        return response;
    } catch (error) {
        throw error;
    }
}

export const login = async (data) => {
    try {
        const response = await apiClient.post("/login", data);
        return response;
    } catch (error) {
        throw error;
    }
}

export const getProfile = async () => {
    try {
        const response = await apiClient.get("/users/me");
        return response.data;
    } catch (error) {
        throw error;
    }
}