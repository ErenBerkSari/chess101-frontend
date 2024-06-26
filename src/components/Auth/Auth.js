import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  FormHelperText,
  Select,
  MenuItem,
  Box,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // Ensure you have this import to use your CSS

function Auth() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");

  const navigate = useNavigate();

  const handleEmail = (value) => {
    setEmail(value);
  };

  const handleUsername = (value) => {
    setUsername(value);
  };

  const handlePassword = (value) => {
    setPassword(value);
  };

  const sendRequest = async () => {
    setLoading(true);
    const path = mode === "register" ? "signup" : "signin";
    try {
      const res = await fetch("auth/" + path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          username: mode === "register" ? username : undefined,
        }),
      });

      const result = await res.json();
      setLoading(false);

      if (res.status !== 200) {
        throw new Error(result.message || "Invalid email or password");
      }

      sessionStorage.setItem("tokenKey", result.token);
      sessionStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: result.userId,
          email: email,
          username: mode === "register" ? username : result.username,
          role: result.role,
        })
      );

      navigate(mode === "register" ? "/user-guide" : "/");
    } catch (err) {
      setLoading(false);
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  const handleAuth = async () => {
    setError("");
    await sendRequest();
    setEmail("");
    setPassword("");
    setUsername("");
  };

  return (
    <Box className="auth-container">
      <Typography variant="h4" className="auth-title"></Typography>
      <Card className="auth-card">
        <CardContent>
          <FormControl className="auth-form">
            <InputLabel shrink={email !== ""}>Email</InputLabel>
            <Input
              value={email}
              onChange={(i) => handleEmail(i.target.value)}
              required
              type="email"
            />
          </FormControl>

          <FormControl className="auth-form">
            <InputLabel shrink={password !== ""}>Password</InputLabel>
            <Input
              type="password"
              value={password}
              onChange={(i) => handlePassword(i.target.value)}
              required
              minLength={6}
            />
          </FormControl>

          {mode === "register" && (
            <FormControl className="auth-form">
              <InputLabel shrink={username !== ""}>Username</InputLabel>
              <Input
                value={username}
                onChange={(i) => handleUsername(i.target.value)}
                required
                minLength={3}
              />
            </FormControl>
          )}

          {error && (
            <Typography sx={{ color: "red", mt: 2, textAlign: "center" }}>
              {error}
            </Typography>
          )}

          {loading && (
            <Typography sx={{ color: "#1976d2", mt: 2, textAlign: "center" }}>
              Loading...
            </Typography>
          )}

          <FormControl className="auth-form">
            <Select value={mode} onChange={(e) => setMode(e.target.value)}>
              <MenuItem value="login">Login</MenuItem>
              <MenuItem value="register">Register</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            className="auth-button"
            onClick={handleAuth}
            disabled={loading}
          >
            {mode === "register" ? "Register" : "Login"}
          </Button>

          <FormHelperText sx={{ mt: 2, textAlign: "center" }}>
            {mode === "login"
              ? "Don't have an account? Register"
              : "Already registered? Login"}
          </FormHelperText>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Auth;
