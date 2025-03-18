import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Grid, TextField, Typography, Paper, CircularProgress } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";

// Validation Schema
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  address: Yup.string().required("Address is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
});

const CustomerEdit: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>(); // Get ID from URL
  console.log(customerId)
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<{
    name: string;
    address?: string;
    email?: string;
    phoneNumber: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch customer by ID
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        console.log(customerId)
        const fetchedCustomer = await window.electronAPI.fetchCustomerById(customerId);
        if (!fetchedCustomer) throw new Error("Customer not found");

        setCustomer({
          name: fetchedCustomer.name,
          address: fetchedCustomer.address || "",
          email: fetchedCustomer.email || "",
          phoneNumber: fetchedCustomer.phoneNumber,
        });
      } catch (err) {
        console.error("Error fetching customer:", err);
        setError("Failed to load customer data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

  const handleSubmit = async (values: typeof customer) => {
    try {
      await window.electronAPI.updateCustomer(customerId, values);
      alert("Customer updated successfully!");
      navigate("/main/customers"); // Redirect after update
    } catch (err) {
      console.error("Error updating customer:", err);
      alert("Failed to update customer.");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" mt={5}>
        {error}
      </Typography>
    );
  }

  return (
    <Paper elevation={3} sx={{ maxWidth: 900, margin: "50px auto", padding: 3, borderRadius: 2 }}>
      <Typography variant="h5" textAlign="center" mb={3} fontWeight="bold" sx={{ color: "primary.main" }}>
        Edit Customer
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box component="img" src="../../assets/member-list.png" alt="Customer" sx={{ width: "100%", maxWidth: 400, borderRadius: 2 }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Formik initialValues={customer || { name: "", address: "", email: "", phoneNumber: "" }} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
            {({ errors, touched, handleChange, handleBlur, values }) => (
              <Form>
                <TextField fullWidth margin="normal" label="Name" name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} error={touched.name && Boolean(errors.name)} helperText={touched.name && errors.name} />
                <TextField fullWidth margin="normal" label="Address" name="address" value={values.address} onChange={handleChange} onBlur={handleBlur} error={touched.address && Boolean(errors.address)} helperText={touched.address && errors.address} />
                <TextField fullWidth margin="normal" label="Email" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} error={touched.email && Boolean(errors.email)} helperText={touched.email && errors.email} />
                <TextField fullWidth margin="normal" label="Phone Number" name="phoneNumber" value={values.phoneNumber} onChange={handleChange} onBlur={handleBlur} error={touched.phoneNumber && Boolean(errors.phoneNumber)} helperText={touched.phoneNumber && errors.phoneNumber} />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, textTransform: "none" }}>
                  Update Customer
                </Button>
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CustomerEdit;
