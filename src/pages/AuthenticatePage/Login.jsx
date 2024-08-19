import React, { useState, useContext } from 'react';
import { TextField, Button, Box, Typography, Container, Avatar, Grid } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { loginUser } from '../../services/user.service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../../contexts/AuthContext';
const LoginPage = () => {
    const navigate = useNavigate()
    const { login } = useContext(AuthContext)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await loginUser({ username, password });
            toast.success(response.message)
            login(response.user)
            navigate("/")
        } catch (error) {
            setError(error.message || 'Login failed. Please try again.');
            toast.error("Login failed. Please try again.")
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isSubmitting}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isSubmitting}
                    />
                    {error && (
                        <Typography color="error" variant="body2">
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Button href="/register" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;
