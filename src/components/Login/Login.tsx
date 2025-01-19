import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Grid, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate(); // React Router's navigate hook

  const validateForm = () => {
    if (!name.trim()) {
      setError('Name is required.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    setError(null); // Clear error if validation passes
    return true;
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await window.electronAPI.authenticateUser({ name, password });
      setSuccess(true);
      setError(null);
      navigate('/main'); // Redirect to /main
    } catch (authError: any) {
      setError(authError.message || 'Authentication failed.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container style={{ height: '100vh' }}>
      <Grid
        item
        xs={12}
        md={6}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          component="img"
          src="../../assets/first.png"
          alt="Image"
          sx={{
            width: '100%',
            maxWidth: 600,
          }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        style={{
          backgroundColor: '#e3f2fd',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          style={{
            width: '80%',
            maxWidth: 400,
            padding: 20,
            borderRadius: 8,
            backgroundColor: '#ffffff',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="h4"
            style={{
              textAlign: 'center',
              marginBottom: '20px',
              color: '#1e88e5',
            }}
          >
            Welcome
          </Typography>

          {success && (
            <Alert severity="success" style={{ marginBottom: '20px' }}>
              Login successful! Redirecting...
            </Alert>
          )}

          {error && (
            <Alert severity="error" style={{ marginBottom: '20px' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              label="Name"
              fullWidth
              variant="outlined"
              margin="normal"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              margin="normal"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{
                marginTop: '20px',
                backgroundColor: '#1e88e5',
                color: '#ffffff',
              }}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
