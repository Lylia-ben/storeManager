import React, { useState, ChangeEvent, FormEvent } from "react";
import { TextField, Button, Box, Typography,MenuItem } from "@mui/material";

interface FormData {
  name: string; // Updated to match the Electron API
  password: string;
  role: string;
}

interface FormErrors {
  name?: string; // Updated to match the Electron API
  password?: string;
  role?: string;
}


const AddUserForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    password: "",
    role: "user", // ✅ Default role (can be changed as needed)
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
    // Clear errors on change
    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  };
  

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    const { name, password } = formData;
    const newErrors: FormErrors = {};

    // Validation
    if (!name.trim()) newErrors.name = "Name is required."; // Updated field name
    if (!password.trim()) newErrors.password = "Password is required.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Call Electron API
      try {
        window.electronAPI.createUser(formData);
        alert("User added successfully!");
        setFormData({ name: "", password: "" ,role:"user" }); // Clear form after submission
      } catch (error) {
        console.error("Error creating user:", error);
        alert("Failed to create user. Please try again.");
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        sx={{ textAlign: "center", mb: 3, color: "#3386ff" }}
      >
        Add User
      </Typography>
      <TextField
        fullWidth
        label="Name" // Updated field label
        name="name" // Updated field name
        value={formData.name}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
        variant="outlined"
        margin="normal"
        sx={{
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#3386ff",
          },
        }}
      />
      <TextField
        fullWidth
        type="password"
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
        variant="outlined"
        margin="normal"
        sx={{
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#3386ff",
          },
        }}
      />
      <TextField
        select
        fullWidth
        label="Role"
        name="role"
        value={formData.role}
        onChange={handleChange}
        variant="outlined"
        margin="normal"
        sx={{
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#3386ff",
          },
        }}
      >
        <MenuItem value="user">User</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
      </TextField>
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          mt: 2,
          backgroundColor: "#3386ff",
          "&:hover": {
            backgroundColor: "#3386ff",
          },
        }}
      >
        Add User
      </Button>
    </Box>
  );
};

export default AddUserForm;
