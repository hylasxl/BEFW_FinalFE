import axiosInstance from "../setup/axios.setup";
// Create the order service functions

/**
 * Create a new order
 * @param {Object} orderData - The order data
 * @returns {Promise} - Axios promise
 */

/**
 * Get all orders
 * @returns {Promise} - Axios promise
 */
export const getOrders = () => {
    return axiosInstance.get('/orders');
};

/**
 * Get an order by ID
 * @param {string} id - The order ID
 * @returns {Promise} - Axios promise
 */
export const getOrderById = (id) => {
    return axiosInstance.get(`/orders/${id}`);
};

/**
 * Update an order by ID
 * @param {string} id - The order ID
 * @param {Object} orderData - The order data to update
 * @returns {Promise} - Axios promise
 */
export const updateOrder = (id, orderData) => {
    return axiosInstance.put(`/orders/${id}`, orderData);
};

/**
 * Delete an order by ID
 * @param {string} id - The order ID
 * @returns {Promise} - Axios promise
 */
export const deleteOrder = (id) => {
    return axiosInstance.delete(`/orders/${id}`);
};

export const createOrder = async (userId, cartItems, totalAmount, shippingAddress, paymentMethod) => {
    try {
        const orderData = {
            user: userId,
            products: cartItems.map(item => ({
                product: item._id,
                quantity: item.quantity
            })),
            total: totalAmount,
            shippingAddress,
            paymentMethod,
            status: 'pending' // You can adjust the default status if needed
        };

        const response = await axiosInstance.post("/orders", orderData);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

/**
 * Get orders by User ID
 * @param {string} userId - The user ID
 * @returns {Promise} - Axios promise
 */
export const getOrdersByUserId = (userId) => {
    return axiosInstance.get(`/orders/user/${userId}`);
};