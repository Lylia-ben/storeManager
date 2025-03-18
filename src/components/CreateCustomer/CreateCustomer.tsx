import React from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";

// Validation Schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  address: Yup.string().required("Address is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
});

const CreateCustomer: React.FC = () => {
  const initialValues = {
    name: "",
    address: "",
    email: "",
    phoneNumber: "",
  };

  const handleSubmit = async (values: typeof initialValues, { resetForm }: any) => {
    console.log("Form Values:", values); // Debugging Log

    try {
      const response = await window.electronAPI.createCustomer(values);
      console.log("Response from createCustomer:", response);
      alert("Customer Created Successfully!");
      resetForm(); // Clear the form after success
    } catch (error) {
      console.error("Error creating customer:", error);
      alert("Failed to create customer. Please try again.");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 900,
        margin: "50px auto",
        padding: 3,
        borderRadius: 2,
      }}
    >
      {/* Title */}
      <Typography
        variant="h5"
        component="h2"
        textAlign="center"
        mb={3}
        fontWeight="bold"
        sx={{ color: "primary.main" }}
      >
        Add New Customer
      </Typography>

      <Grid container spacing={2}>
        {/* Left Side: Image */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src="../../assets/member-list.png"
            alt="Customer Illustration"
            sx={{
              width: "100%",
              maxWidth: 400,
              borderRadius: 2,
            }}
          />
        </Grid>

        {/* Right Side: Form */}
        <Grid item xs={12} md={6}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, handleChange, handleBlur, values }) => (
              <Form>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Address"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Phone Number"
                  name="phoneNumber"
                  value={values.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                  helperText={touched.phoneNumber && errors.phoneNumber}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2, textTransform: "none" }}
                >
                  Create Customer
                </Button>
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CreateCustomer;
