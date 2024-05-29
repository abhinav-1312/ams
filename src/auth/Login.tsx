import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
// import Link from "@mui/material/Link";
// import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Navigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import axios from "axios";

const defaultTheme = createTheme();

export default function SignIn() {
  // const [value, setValue] = React.useState(0);

  const [userLoginId, setUserLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = async () => {
    try {
      const response = await axios.get(
        `https://asset-management-service.azurewebsites.net/asset-management/login?userName=${userLoginId}&password=${password}`
      );

      if (response.status === 200) {
        const responseData = response.data.responseData;

        const privileges = responseData.privileges.split(",");
        localStorage.setItem("userName", responseData.userName);
        localStorage.setItem("userId", responseData.userId);
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("mobileNumber", responseData.mobileNumber);
        localStorage.setItem("userRole", JSON.stringify(privileges));
        localStorage.setItem("locationId", responseData.locationId);
        setIsLoggedIn(true);
        window.location.reload();
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred while logging in.");
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    login();
  };

  // const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setValue(newValue);
  // };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <Box
          sx={{
            paddingTop: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "#f2f2f2",
            height: "100vh",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <br />
          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{ mt: 1 }}
          >
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="textField"
                label="Username"
                name="userId"
                autoComplete="userId"
                value={userLoginId}
                onChange={(e) => setUserLoginId(e.target.value)}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            </>

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
