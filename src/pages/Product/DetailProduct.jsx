import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardMedia, CardContent, CircularProgress, Grid, Button, Box } from '@mui/material';
import { getProductById } from '../../services/product.service';
import { getBrands } from '../../services/brand.service';
import { getCategories } from '../../services/category.service';
import Navigation from '../../components/Navigation/Navigation';
import { toast } from 'react-toastify';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
});

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productData = await getProductById(id);
                setProduct(productData.product);
                const brandsResponse = await getBrands();
                const categoriesResponse = await getCategories();
                setBrands(brandsResponse.brands);
                setCategories(categoriesResponse.categories);

                // Set the first image as the selected image by default
                if (productData.product.images.length > 0) {
                    setSelectedImage(productData.product.images[0]);
                }
            } catch (error) {
                console.error("Failed to fetch product details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const getBrandName = (id) => {
        const brand = brands.find(b => b._id === id);
        return brand ? brand.name : 'Unknown Brand';
    };

    const getCategoryName = (id) => {
        const category = categories.find(c => c._id === id);
        return category ? category.name : 'Unknown Category';
    };

    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProductIndex = cart.findIndex(item => item._id === product._id);
        
        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        toast.success('Product added to cart!');
    };

    const handleBackToHome = () => {
        navigate('/'); // Navigate to the home page
    };

    return (
        <>
            <Navigation />
            <Container sx={{ padding: 4 }}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleBackToHome}
                    sx={{ marginBottom: 4 }}
                >
                    Back to Home
                </Button>
                {loading ? (
                    <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: 4 }} />
                ) : product ? (
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Card sx={{ boxShadow: 3, marginBottom: 2 }}>
                                    {selectedImage && (
                                        <CardMedia
                                            component="img"
                                            image={selectedImage}
                                            alt={product.name}
                                            sx={{ height: 400, objectFit: 'cover' }}
                                        />
                                    )}
                                </Card>
                                {product.images.length > 1 && (
                                    <Box sx={{ display: 'flex', overflowX: 'auto' }}>
                                        {product.images.slice(0, 5).map((image, index) => (
                                            <Card
                                                key={index}
                                                sx={{
                                                    width: 100,
                                                    height: 100,
                                                    marginRight: 1,
                                                    cursor: 'pointer',
                                                    boxShadow: 3,
                                                    border: selectedImage === image ? '2px solid #1976d2' : 'none'
                                                }}
                                                onClick={() => setSelectedImage(image)}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    image={image}
                                                    alt={`Thumbnail ${index}`}
                                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </Card>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card sx={{ boxShadow: 3, padding: 3 }}>
                                <CardContent>
                                    <Typography variant="h3" gutterBottom>
                                        {product.name}
                                    </Typography>
                                    <Typography variant="h5" gutterBottom>
                                        {currencyFormatter.format(product.price)}
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        {product.description}
                                    </Typography>
                                    <Typography variant="h6" gutterBottom>
                                        Brand: <strong>{getBrandName(product.brand)}</strong>
                                    </Typography>
                                    <Typography variant="h6" gutterBottom>
                                        Category: <strong>{getCategoryName(product.category)}</strong>
                                    </Typography>
                                    <Typography variant="h6" gutterBottom>
                                        Stock: <strong>{product.stock} items</strong>
                                    </Typography>
                                    {product.stock > 0 && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleAddToCart}
                                            sx={{ marginTop: 2 }}
                                        >
                                            Add to Cart
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                ) : (
                    <Typography variant="h6" textAlign="center">Product not found</Typography>
                )}
            </Container>
        </>
    );
}

export default ProductDetailPage;
