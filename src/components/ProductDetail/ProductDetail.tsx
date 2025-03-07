import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<any>(null);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const product = await window.electronAPI.fetchProductById(productId);
        setInitialData(product);
        console.log(product)
      } catch (err) {
        setError("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);
  // Formik for handling form
  const formik = useFormik({
    enableReinitialize: true, // Ensures the form updates when initialData is fetched
    initialValues: initialData || {
      name: "",
      shape: "",
      quantity: "",
      cost: "",
      unitPrice: "",
      radius: "",
      width: "",
      height: "",
      sideLength: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      quantity: Yup.number().positive("Must be positive").required("Required"),
      cost: Yup.number().positive("Must be positive").required("Required"),
      unitPrice: Yup.number().positive("Must be positive").required("Required"),
      radius: Yup.number().notRequired(),
      width: Yup.number().notRequired(),
      height: Yup.number().notRequired(),
      sideLength: Yup.number().notRequired(),
    }),
    onSubmit: async (values) => {
      try {
        console.log("Updating Product ID:", typeof productId, productId);
        
        // Ensure productId is a string before sending
        if (!productId || typeof productId !== "string") {
          throw new Error("Invalid product ID");
        }
    
        await window.electronAPI.updateProduct(productId, values);
        alert("Product updated successfully!");
        navigate("/main/products"); // Redirect to product list
      } catch (err) {
        console.error("Update failed", err);
        alert("Failed to update product.");
      }
    }
    
  });

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "auto",
        padding: 3,
        border: "1px solid #1565c0",
        borderRadius: 2,
        backgroundColor: "#e3f2fd",
        marginLeft:"250px"
      }}
    >
      <Typography variant="h4" align="center" gutterBottom sx={{ color: "#1565c0" }}>
        Edit Product
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={typeof formik.errors.name === "string" ? formik.errors.name : undefined}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Shape</InputLabel>
          <Select
            name="shape"
            value={formik.values.shape}
            onChange={formik.handleChange}
          >
           <MenuItem value="RectangularProduct">Rectangular</MenuItem>
           <MenuItem value="SquareProduct">Square</MenuItem>
           <MenuItem value="CircularProduct">Circular</MenuItem>
          </Select>
        </FormControl>

        {formik.values.shape === "CircularProduct" && (
          <TextField
            fullWidth
            label="Radius"
            name="radius"
            type="number"
            value={formik.values.radius}
            onChange={formik.handleChange}
            error={formik.touched.radius && Boolean(formik.errors.radius)}
            helperText={typeof formik.errors.radius === "string" ? formik.errors.radius : undefined}
            margin="normal"
          />
        )}

        {formik.values.shape === "RectangularProduct" && (
          <>
            <TextField
              fullWidth
              label="Width"
              name="width"
              type="number"
              value={formik.values.width}
              onChange={formik.handleChange}
              error={formik.touched.width && Boolean(formik.errors.width)}
              helperText={typeof formik.errors.width === "string" ? formik.errors.width : undefined}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Height"
              name="height"
              type="number"
              value={formik.values.height}
              onChange={formik.handleChange}
              error={formik.touched.height && Boolean(formik.errors.height)}
              helperText={typeof formik.errors.height === "string" ? formik.errors.height : undefined}
              margin="normal"
            />
          </>
        )}

        {formik.values.shape === "SquareProduct" && (
          <TextField
            fullWidth
            label="Side Length"
            name="sideLength"
            type="number"
            value={formik.values.sideLength}
            onChange={formik.handleChange}
            error={formik.touched.sideLength && Boolean(formik.errors.sideLength)}
            helperText={typeof formik.errors.sideLength === "string" ? formik.errors.sideLength : undefined}
            margin="normal"
          />
        )}

        <TextField
          fullWidth
          label="Quantity"
          name="quantity"
          type="number"
          value={formik.values.quantity}
          onChange={formik.handleChange}
          error={formik.touched.quantity && Boolean(formik.errors.quantity)}
          helperText={typeof formik.errors.quantity === "string" ? formik.errors.quantity : undefined}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Cost"
          name="cost"
          type="number"
          value={formik.values.cost}
          onChange={formik.handleChange}
          error={formik.touched.cost && Boolean(formik.errors.cost)}
          helperText={typeof formik.errors.cost === "string" ? formik.errors.cost : undefined}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Unit Price"
          name="unitPrice"
          type="number"
          value={formik.values.unitPrice}
          onChange={formik.handleChange}
          error={formik.touched.unitPrice && Boolean(formik.errors.unitPrice)}
          helperText={typeof formik.errors.unitPrice === "string" ? formik.errors.unitPrice : undefined}
          margin="normal"
        />

        <Button type="submit" variant="contained" sx={{ mt: 2, backgroundColor: "#1565c0" }}>
          Update Product
        </Button>
      </form>
    </Box>
  );
};

export default ProductDetail;
