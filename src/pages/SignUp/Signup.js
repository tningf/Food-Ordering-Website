import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, IconButton, InputAdornment, Snackbar, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Container } from "@mui/system";


const Signup = () => {
  const [open, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [messageServerity, setMessageServerity] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [gender, setGender] = useState("");


  const handleClick = () => {
    setOpenSnackbar(true);
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const clearFields = () => {
    setName("");
    setEmail("");
    setPassword("");
    setGender("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const fetchUserData = async (event) => {
    event.preventDefault();
    setIsSigningUp(true);
    const userDataToSend = {
      Name: name,
      Gender: gender,
      Email: email,
      Password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/users",
        userDataToSend
      );

      if (response.status === 200) {
        console.log(response.data);
        clearFields();
        setMessage("Đăng ký thành công");
        setMessageServerity("success");
        handleClick();
      } else {
        clearFields();    
        setMessage("Email hoặc tên đăng nhập đã được sử dụng");
        setMessageServerity("error");
        handleClick();
      }
    } catch (error) {
      clearFields();
      setMessage("Có lỗi xảy ra khi đăng ký");
      setMessageServerity("error");
      handleClick();
    } finally {
      setIsSigningUp(false);
    }
  };
  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt:10,ml:40, maxWidth: "40%"}}>
        <Typography variant="h4" sx={{ mb: 2 }}>Sign Up</Typography>
        <FormControl sx={{ width: "100%", mb: 2}}>
          <TextField
            label="Name"
            value={name}
            required
            autoFocus
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl sx={{ width: "100%", mb: 2 }}>
          <TextField
            label="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl sx={{ width: "100%", mb: 2 }}>
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        <FormControl sx={{ width: "100%", mb: 2 }}>
          <InputLabel>Gender</InputLabel>
          <Select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          disabled={isSigningUp}
          onClick={fetchUserData}
        >
          Sign Up
        </Button>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={messageServerity}
        >
          {message}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default Signup;
