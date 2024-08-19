import React, { useState, useEffect } from 'react';
import { Grid, Container, Box, Typography, CircularProgress, TextField, Button, Card, CardContent, CardMedia, Pagination, MenuItem, Select, Slider } from '@mui/material';
import { Link } from 'react-router-dom';
import Navigation from "../../components/Navigation/Navigation";
import { getProducts } from '../../services/product.service';
import { getBrands } from '../../services/brand.service';
import { getCategories } from '../../services/category.service';

// Currency formatter for Vietnamese Dong (VND)
const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
});

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 24;

    // New state variables
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState([0, 100000000]);
    const [hasFiltersApplied, setHasFiltersApplied] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productsResponse = await getProducts();
                setProducts(productsResponse.products);
                setFilteredProducts(productsResponse.products);

                // Fetch brands and categories
                const brandsResponse = await getBrands();
                const categoriesResponse = await getCategories();
                setBrands(brandsResponse.brands);
                setCategories(categoriesResponse.categories);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Map IDs to names
    const getBrandName = (id) => {
        const brand = brands.find(b => b._id === id);
        return brand ? brand.name : 'Unknown Brand';
    };

    const getCategoryName = (id) => {
        const category = categories.find(c => c._id === id);
        return category ? category.name : 'Unknown Category';
    };

    // Filter products
    useEffect(() => {
        const applyFilters = () => {
            let filtered = products;

            if (filter) {
                filtered = filtered.filter(product =>
                    product.name.toLowerCase().includes(filter.toLowerCase())
                );
            }

            if (selectedBrand) {
                filtered = filtered.filter(product => product.brand === selectedBrand);
            }

            if (selectedCategory) {
                filtered = filtered.filter(product => product.category === selectedCategory);
            }

            if (priceRange) {
                filtered = filtered.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);
            }

            // Filter out products without images
            filtered = filtered.filter(product => product.images && product.images.length > 0);

            setFilteredProducts(filtered);
            setCurrentPage(1); // Reset to first page when filter changes
        };

        if (hasFiltersApplied) {
            applyFilters();
        } else {
            // Apply the same image filtering logic to products with no filters applied
            const productsWithImages = products.filter(product => product.images && product.images.length > 0);
            setFilteredProducts(productsWithImages);
        }
    }, [filter, selectedBrand, selectedCategory, priceRange, products, hasFiltersApplied]);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setHasFiltersApplied(true);
    };

    const handleBrandChange = (event) => {
        setSelectedBrand(event.target.value);
        setHasFiltersApplied(true);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        setHasFiltersApplied(true);
    };

    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);
        setHasFiltersApplied(true);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const productsToDisplay = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <>
            <Navigation />
            <Container sx={{ padding: 0 }}>
                <Grid container spacing={2} sx={{ marginTop: 4 }}>
                    <Grid item xs={12} md={9} lg={8}>
                        <Box
                            sx={{
                                padding: 2,
                                border: '1px solid #ddd',
                                borderRadius: 1,
                                boxShadow: 2,
                                height: '100%',
                                overflowY: 'auto',
                            }}
                        >
                            <Typography variant="h4" gutterBottom>
                                Product List
                            </Typography>
                            {loading ? (
                                <CircularProgress />
                            ) : (
                                <>
                                    <Grid container spacing={2}>
                                        {productsToDisplay.map(product => (
                                            <Grid item xs={12} sm={6} md={4} key={product._id}>
                                                <Link to={`/product-detail/${product._id}`} style={{ textDecoration: 'none' }}>
                                                    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                                        {product.images.length > 0 && (
                                                            <CardMedia
                                                                component="img"
                                                                image={product.images[0]}
                                                                alt={product.name}
                                                                sx={{ height: 140, objectFit: 'cover' }}
                                                            />
                                                        )}
                                                        <CardContent>
                                                            <Typography variant="h6">{product.name}</Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                {product.description}
                                                            </Typography>
                                                            <Typography variant="h6">{currencyFormatter.format(product.price)}</Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                Brand: {getBrandName(product.brand)}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                Category: {getCategoryName(product.category)}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Link>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                                        <Pagination
                                            count={totalPages}
                                            page={currentPage}
                                            onChange={handlePageChange}
                                            color="primary"
                                        />
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={3} lg={4}>
                        <Box
                            sx={{
                                border: '1px solid #ddd',
                                padding: 2,
                                borderRadius: 1,
                                boxShadow: 2,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Filter Products
                            </Typography>
                            <TextField
                                label="Search"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={filter}
                                onChange={handleFilterChange}
                            />
                            <Select
                                label="Brand"
                                value={selectedBrand}
                                onChange={handleBrandChange}
                                fullWidth
                                margin="normal"
                            >
                                <MenuItem value="">All Brands</MenuItem>
                                {brands.map(brand => (
                                    <MenuItem key={brand._id} value={brand._id}>
                                        {brand.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Select
                                label="Category"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                fullWidth
                                margin="normal"
                            >
                                <MenuItem value="">All Categories</MenuItem>
                                {categories.map(category => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Typography gutterBottom>Price Range</Typography>
                            <Slider
                                value={priceRange}
                                onChange={handlePriceRangeChange}
                                valueLabelDisplay="auto"
                                min={0}
                                max={100000000}
                                step={1000000}
                                marks
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ marginTop: 2 }}
                                onClick={() => setHasFiltersApplied(true)}
                            >
                                Apply Filters
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default HomePage;
