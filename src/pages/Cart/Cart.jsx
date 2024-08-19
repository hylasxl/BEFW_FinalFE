import React, { useState, useEffect, useContext } from 'react';
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Button, Box
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { createOrder } from '../../services/order.service';
import AuthContext from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
});

const CartPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [userId, setUserId] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        const loadCartItems = () => {
            const items = JSON.parse(localStorage.getItem('cart')) || [];
            setCartItems(items);
            calculateTotal(items);
        };

        loadCartItems();
        setUserId(authState.user._id);
        setShippingAddress("default");
        setPaymentMethod("COD");
    }, [authState.user._id]);

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalPrice(total);
    };

    const handleQuantityChange = (itemId, delta) => {
        const updatedCart = cartItems.map(item => {
            if (item._id === itemId) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        });

        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotal(updatedCart);
    };

    const handleRemoveItem = (itemId) => {
        const updatedCart = cartItems.filter(item => item._id !== itemId);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotal(updatedCart);
    };

    const handleClearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
        setTotalPrice(0);
    };

    const handleCheckout = async () => {
        try {
            if (!userId || !shippingAddress || !paymentMethod) {
                alert('Please complete all fields before checking out.');
                return;
            }

            const response = await createOrder(userId, cartItems, totalPrice, shippingAddress, paymentMethod);
            console.log('Order created successfully:', response);
            toast.success('Order placed successfully!');
            handleClearCart();
            navigate("/order");
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('There was an error placing your order.');
        }
    };

    return (
        <Container marginTop={5} >
            <Typography variant="h4" gutterBottom>Your Cart</Typography>
            <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={() => navigate('/')}>
                        Back to Home
                    </Button>
            {cartItems.length > 0 ? (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell align="center">Quantity</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cartItems.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell component="th" scope="row">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={item.images[0]} alt={item.name} style={{ height: 50, marginRight: 16 }} />
                                                <Typography variant="body1">{item.name}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton onClick={() => handleQuantityChange(item._id, -1)}>
                                                <RemoveIcon />
                                            </IconButton>
                                            {item.quantity}
                                            <IconButton onClick={() => handleQuantityChange(item._id, 1)}>
                                                <AddIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align="right">{currencyFormatter.format(item.price)}</TableCell>
                                        <TableCell align="right">{currencyFormatter.format(item.price * item.quantity)}</TableCell>
                                        <TableCell align="center">
                                            <Button variant="outlined" color="error" onClick={() => handleRemoveItem(item._id)}>
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ marginTop: 4, textAlign: 'right' }}>
                        <Typography variant="h5">Total: {currencyFormatter.format(totalPrice)}</Typography>
                        <Button variant="contained" color="primary" sx={{ marginRight: 2 }} onClick={handleCheckout}>
                            Checkout
                        </Button>
                        <Button variant="outlined" color="error" onClick={handleClearCart}>
                            Clear Cart
                        </Button>
                    </Box>
                </>
            ) : (
                <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                    <Typography variant="h6">Your cart is empty.</Typography>
                    
                </Box>
            )}
        </Container>
    );
};

export default CartPage;
