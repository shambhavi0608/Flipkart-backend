import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!email || !password) {
    setError("Please enter both email and password");
    return;
  }

  try {
    const res = await fetch("https://flipkart-backend-2-a3h1.onrender.com/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Signup failed");
    } else {
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    }
  } catch (err) {
    setError("Something went wrong. Please try again.");
  }
};


  return (
    <Box
      maxWidth={400}
      mx="auto"
      mt={10}
      p={4}
      borderRadius={2}
      boxShadow={3}
      bgcolor="white"
      sx={{
        fontFamily: "'Poppins', sans-serif",
        textAlign: "center",
      }}
    >
      <Typography variant="h5" mb={2}>
        Sign Up
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <Typography color="red" mt={1} fontSize="0.9rem">
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, py: 1.2, borderRadius: 2 }}
        >
          Create Account
        </Button>
      </form>

      <Typography mt={2}>
        Already have an account?{" "}
        <MuiLink component={Link} to="/login" color="primary">
          Login
        </MuiLink>
      </Typography>
    </Box>
  );
};

export default Signup;
