import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, IconButton, Dialog, DialogActions,
    DialogContent, DialogTitle, TextField, Box, Pagination, InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/product.service';
import { getCategories } from '../../services/category.service';
import { getBrands } from '../../services/brand.service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProductManagementPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: '',
        price: '',
        description: '',
        images: [], // File objects
        categoryId: '',
        brandId: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 25;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await getProducts();
                const categoryResponse = await getCategories();
                const brandResponse = await getBrands();

                setProducts(productResponse.products);
                setCategories(categoryResponse.categories);
                setBrands(brandResponse.brands);
                setFilteredProducts(productResponse.products);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        handleSearch(searchQuery);
    }, [products, searchQuery]);

    const handleOpen = (product = null) => {
        if (product) {
            setEditMode(true);
            setSelectedProduct(product);
            setProductForm({
                name: product.name,
                price: product.price,
                description: product.description,
                images: product.images || [], // Handle existing images
                categoryId: product.categoryId,
                brandId: product.brandId
            });
        } else {
            setEditMode(false);
            setProductForm({ name: '', price: '', description: '', images: [], categoryId: '', brandId: '' });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedProduct(null);
    };

    const handleChange = useCallback((e) => {
        const { name, value, files } = e.target;
        if (name === 'images') {
            setProductForm(prevState => ({
                ...prevState,
                images: Array.from(files)
            }));
        } else {
            setProductForm(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    }, []);

    const handleSave = async () => {
        try {
            const formData = new FormData();
    
            // Append product form data to FormData
            Object.keys(productForm).forEach(key => {
                if (key === 'images' && Array.isArray(productForm[key])) {
                    productForm[key].forEach(image => formData.append('images', image));
                } else {
                    formData.append(key, productForm[key]);
                }
            });
    
            // Log FormData contents for debugging
            for (const [key, value] of formData.entries()) {
                if (key === 'images') {
                    // Log file names for debugging
                    console.log(`${key}:`, Array.from(formData.getAll('images')).map(file => file.name));
                } else {
                    console.log(`${key}:`, value);
                }
            }
    
            // Call the API to create or update the product
            if (editMode && selectedProduct) {
                await updateProduct(selectedProduct._id, formData);
                toast.success('Product updated successfully');
            } else {
                await createProduct(formData);
                toast.success('Product created successfully');
            }
    
            // Refresh product list
            const response = await getProducts();
            setProducts(response.products);
            handleClose();
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('There was an error saving the product.');
        }
    };
    

    const handleDelete = async (productId) => {
        try {
            await deleteProduct(productId);
            setProducts(products.filter(product => product._id !== productId));
            toast.success('Product deleted successfully');
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('There was an error deleting the product.');
        }
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(filtered);
        setCurrentPage(1); // Reset to first page after search
    };

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getCategoryNameById = (id) => {
        const category = categories.find(cat => cat._id === id);
        return category ? category.name : 'Unknown';
    };

    const getBrandNameById = (id) => {
        const brand = brands.find(br => br._id === id);
        return brand ? brand.name : 'Unknown';
    };

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center" my={4}>
                <Typography variant="h4">Product Management</Typography>
                
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                    <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={() => navigate('/')}>
                        Back to Home
                    </Button>
                    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpen()}>
                        Add Product
                    </Button>
                </div>
            </Box>
            <TextField
                variant="outlined"
                placeholder="Search by name"
                fullWidth
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                sx={{ mb: 4 }}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Brand</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedProducts.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell>
                                    {product.images[0] ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            style={{ width: 80, height: 80, objectFit: 'cover' }}
                                        />
                                    ) : 'No Image'}
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                                <TableCell>{getCategoryNameById(product.category)}</TableCell>
                                <TableCell>{getBrandNameById(product.brand)}</TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" onClick={() => handleOpen(product)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="secondary" onClick={() => handleDelete(product._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" justifyContent="center" my={4}>
                <Pagination
                    count={Math.ceil(filteredProducts.length / itemsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editMode ? 'Edit Product' : 'Add Product'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={productForm.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="price"
                        label="Price"
                        type="number"
                        fullWidth
                        value={productForm.price}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        value={productForm.description}
                        onChange={handleChange}
                    />
                    <input
                        type="file"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={handleChange}
                        style={{ marginTop: '16px', width: '100%' }}
                    />
                    <TextField
                        margin="dense"
                        name="categoryId"
                        label="Category"
                        select
                        fullWidth
                        SelectProps={{
                            native: true,
                        }}
                        value={productForm.categoryId}
                        onChange={handleChange}
                    >
                        <option value="" />
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        margin="dense"
                        name="brandId"
                        label="Brand"
                        select
                        fullWidth
                        SelectProps={{
                            native: true,
                        }}
                        value={productForm.brandId}
                        onChange={handleChange}
                    >
                        <option value="" />
                        {brands.map((brand) => (
                            <option key={brand._id} value={brand._id}>
                                {brand.name}
                            </option>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProductManagementPage;
