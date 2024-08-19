// src/components/Register.js
import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { registerUser } from "../../services/user.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Register = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        name: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (formData.name.length < 3) {
            setError("Name must be at least 3 characters long");
            return false;
        }
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Invalid email address");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) {
            return;
        }

        try {
            const response = await registerUser(formData);
            console.log(response.message);
            toast.success(response.message);
            navigate("/login")
        } catch (error) {
            setError(error.message || "Error registering user");
            toast.error("Error registering user")
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField required fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} margin="normal" />
                    <TextField required fullWidth label="Username" name="username" value={formData.username} onChange={handleChange} margin="normal" />
                    <TextField required fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} margin="normal" />
                    <TextField required fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} margin="normal" />
                    <TextField required fullWidth label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} margin="normal" />
                    {error && <Typography color="error" variant="body2">{error}</Typography>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Register
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;
