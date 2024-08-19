import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from '@mui/material';
import { getOrdersByUserId } from '../../services/order.service';
import AuthContext from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const { authState } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userId = authState.user._id;
                const response = await getOrdersByUserId(userId);
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [authState.user._id]);

    const handleViewOrder = (orderId) => {
        navigate(`/orders/${orderId}`);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Your Orders
            </Typography>
            <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={() => navigate('/')}>
                Back to Home
            </Button>
            {orders && orders.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Total Amount</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Order Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell>{order._id}</TableCell>
                                    <TableCell>{order.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    <TableCell>{format(new Date(order.createdAt), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" onClick={() => handleViewOrder(order._id)}>
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                    <Typography variant="h6">You have no orders.</Typography>

                </Box>
            )}
        </Container>
    );
};

export default OrderPage;
