import axiosInstance from "../setup/axios.setup";

// Create a new product
export const createProduct = async (productData, files = []) => {  // Default files to an empty array
    try {
        const formData = new FormData();
        
        // Append product data to FormData
        Object.keys(productData).forEach(key => {
            formData.append(key, productData[key]);
        });
        
        // Append files to FormData if they exist
        if (Array.isArray(files)) {
            files.forEach(file => {
                formData.append('images', file);
            });
        }
        
        const response = await axiosInstance.post("/products", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error.response?.data || { message: "Error creating product" };
    }
};

// Get all products
export const getProducts = async () => {
    try {
        const response = await axiosInstance.get(`/products`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error.response?.data || { message: "Error fetching products" };
    }
};

// Get product by ID
export const getProductById = async (productId) => {
    try {
        const response = await axiosInstance.get(`/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with ID ${productId}:`, error);
        throw error.response?.data || { message: `Error fetching product with ID ${productId}` };
    }
};

// Update product by ID
export const updateProduct = async (productId, updatedData, files = []) => { 
    try {
        const formData = new FormData();

        // Append updated data to FormData
        Object.keys(updatedData).forEach(key => {
            // Handle files separately
            if (key === 'images' && Array.isArray(updatedData[key])) {
                updatedData[key].forEach(file => formData.append('images', file));
            } else {
                formData.append(key, updatedData[key]);
            }
        });

        // Log FormData contents for debugging
        for (const [key, value] of formData.entries()) {
            if (key === 'images') {
                // Since file values cannot be logged directly, you might want to log their names
                console.log(`${key}:`, Array.from(formData.getAll('images')).map(file => file.name));
            } else {
                console.log(`${key}:`, value);
            }
        }

        const response = await axiosInstance.put(`/products/${productId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error(`Error updating product with ID ${productId}:`, error);
        throw error.response?.data || { message: `Error updating product with ID ${productId}` };
    }
};


// Delete product by ID
export const deleteProduct = async (productId) => {
    try {
        const response = await axiosInstance.delete(`/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting product with ID ${productId}:`, error);
        throw error.response?.data || { message: `Error deleting product with ID ${productId}` };
    }
};

// Import multiple products from a JSON file
export const importProducts = async (importData) => {
    try {
        const response = await axiosInstance.post("/products/import", importData);
        return response.data;
    } catch (error) {
        console.error("Error importing products:", error);
        throw error.response?.data || { message: "Error importing products" };
    }
};
