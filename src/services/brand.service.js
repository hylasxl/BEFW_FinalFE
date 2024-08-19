import axiosInstance from "../setup/axios.setup";

export const getBrands = async () => {
    try {
        const response = await axiosInstance.get('/brands');
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch brands: ${error.message}`);
    }
};

// Get brand by ID
export const getBrandById = async (id) => {
    try {
        const response = await axiosInstance.get(`/brands/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch brand by ID: ${error.message}`);
    }
};

// Create a new brand
export const createBrand = async (brandData) => {
    try {
        const response = await axiosInstance.post('/brands', brandData);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to create brand: ${error.message}`);
    }
};

// Update a brand by ID
export const updateBrand = async (id, brandData) => {
    try {
        const response = await axiosInstance.put(`/brands/${id}`, brandData);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to update brand: ${error.message}`);
    }
};

// Delete a brand by ID
export const deleteBrand = async (id) => {
    try {
        const response = await axiosInstance.delete(`/brands/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to delete brand: ${error.message}`);
    }
};

// Add multiple brands from a JSON file
export const addMultipleBrands = async (brands) => {
    try {
        const response = await axiosInstance.post('/brands/bulk', brands);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to add multiple brands: ${error.message}`);
    }
};
