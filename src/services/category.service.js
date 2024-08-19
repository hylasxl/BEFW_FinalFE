import axiosInstance from "../setup/axios.setup";
export const getCategories = async () => {
    try {
        const response = await axiosInstance.get('/categories');
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch categories: ${error.message}`);
    }
};

// Get category by ID
export const getCategoryById = async (id) => {
    try {
        const response = await axiosInstance.get(`/categories/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch category by ID: ${error.message}`);
    }
};

// Create a new category
export const createCategory = async (categoryData) => {
    try {
        const response = await axiosInstance.post('/categories', categoryData);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to create category: ${error.message}`);
    }
};

// Update a category by ID
export const updateCategory = async (id, categoryData) => {
    try {
        const response = await axiosInstance.put(`/categories/${id}`, categoryData);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to update category: ${error.message}`);
    }
};

// Delete a category by ID
export const deleteCategory = async (id) => {
    try {
        const response = await axiosInstance.delete(`/categories/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to delete category: ${error.message}`);
    }
};

// Add multiple categories from a JSON file
export const addMultipleCategories = async (categories) => {
    try {
        const response = await axiosInstance.post('/categories/bulk', categories);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to add multiple categories: ${error.message}`);
    }
};