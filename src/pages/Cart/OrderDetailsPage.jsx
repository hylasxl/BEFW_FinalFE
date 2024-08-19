import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById } from '../../services/order.service';
import { getProductById } from '../../services/product.service';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box } from '@mui/material';

const OrderDetailsPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await getOrderById(id);
                setOrder(response.data.order);
                const productDetails = await Promise.all(
                    response.data.order.products.map(async (item) => {
                        const productResponse = await getProductById(item.product);
                        return { ...productResponse.product, quantity: item.quantity };
                    })
                );
                setProducts(productDetails);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching order details:', error);
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container>
            {order ? (
                <Paper sx={{ padding: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        Order Details
                    </Typography>
                    <Box sx={{ marginBottom: 2 }}>
                        <Typography variant="subtitle1">Order ID: {order._id}</Typography>
                        <Typography variant="subtitle1">Total Amount: {order.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Typography>
                        <Typography variant="subtitle1">Status: {order.status}</Typography>
                        <Typography variant="subtitle1">Order Date: {new Date(order.createdAt).toLocaleDateString()}</Typography>
                        <Typography variant="subtitle1">Shipping Address: {order.shippingAddress}</Typography>
                        <Typography variant="subtitle1">Payment Method: {order.paymentMethod}</Typography>
                    </Box>

                    <Typography variant="h5" gutterBottom>
                        Products
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Product Name</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product._id}>
                                        <TableCell>
                                            <img 
                                                src={product.images[0]} 
                                                alt={product.name} 
                                                style={{ 
                                                    width: 80, 
                                                    height: 80, 
                                                    objectFit: 'cover' 
                                                }} 
                                            />
                                        </TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.quantity}</TableCell>
                                        <TableCell>
                                            {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </TableCell>
                                        <TableCell>
                                            {(product.price * product.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            ) : (
                <Typography variant="h6">Loading order details...</Typography>
            )}
        </Container>
    );
};

export default OrderDetailsPage;
