// src/api/auth.js
import axiosInstance from "../setup/axios.setup";

// Register a new user
export const registerUser = async (userData) => {
    try {
        const response = await axiosInstance.post("/auth/register", userData);
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error.response.data;
    }
};

// Login a user
export const loginUser = async (credentials) => {
    try {
        const response = await axiosInstance.post("/auth/login", credentials);
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error.response.data;
    }
};

// Refresh token
export const refreshToken = async () => {
    try {
        const response = await axiosInstance.post("/auth/refresh-token");
        return response.data;
    } catch (error) {
        console.error("Error refreshing token:", error);
        throw error.response.data;
    }
};

// Logout a user
export const logoutUser = async () => {
    try {
        const response = await axiosInstance.post("/auth/logout");
        return response.data;
    } catch (error) {
        console.error("Error logging out:", error);
        throw error.response.data;
    }
};

// Fetch all users
export const fetchAllUsers = async () => {
    try {
        const response = await axiosInstance.get("/users");
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error.response.data;
    }
};

// Fetch user by ID
export const fetchUserById = async (userId) => {
    try {
        const response = await axiosInstance.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
        throw error.response.data;
    }
};

// Update a user
export const updateUser = async (userId, updatedData) => {
    try {
        const response = await axiosInstance.put(`/users/${userId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error(`Error updating user with ID ${userId}:`, error);
        throw error.response.data;
    }
};

// Delete a user
export const deleteUser = async (userId) => {
    try {
        const response = await axiosInstance.delete(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting user with ID ${userId}:`, error);
        throw error.response.data;
    }
};
