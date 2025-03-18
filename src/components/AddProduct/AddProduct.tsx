import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const shapeOptions = ["Square", "Circular", "Rectangular"] as const;
type ShapeOption = typeof shapeOptions[number];

const AddProductForm: React.FC = () => {
  const [shape, setShape] = useState<ShapeOption | "">("");

  const formik = useFormik({
    initialValues: {
      name: "",
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
      quantity: Yup.number()
        .typeError("Quantity must be a number")
        .positive("Quantity must be positive")
        .required("Quantity is required"),
      cost: Yup.number()
        .typeError("Cost must be a number")
        .positive("Cost must be positive")
        .required("Cost is required"),
      unitPrice: Yup.number()
        .typeError("Unit Price must be a number")
        .positive("Unit Price must be positive")
        .required("Unit Price is required"),
      radius: shape === "Circular"
        ? Yup.number()
            .typeError("Radius must be a number")
            .positive("Radius must be positive")
            .required("Radius is required")
        : Yup.number().notRequired(),
      width: shape === "Rectangular"
        ? Yup.number()
            .typeError("Width must be a number")
            .positive("Width must be positive")
            .required("Width is required")
        : Yup.number().notRequired(),
      height: shape === "Rectangular"
        ? Yup.number()
            .typeError("Height must be a number")
            .positive("Height must be positive")
            .required("Height is required")
        : Yup.number().notRequired(),
      sideLength: shape === "Square"
        ? Yup.number()
            .typeError("Side Length must be a number")
            .positive("Side Length must be positive")
            .required("Side Length is required")
        : Yup.number().notRequired(),
    }),
    onSubmit: async (values) => {
      try {
        const productData = {
          shape: shape as ShapeOption,
          name: values.name,
          quantity: parseInt(values.quantity, 10),
          cost: parseFloat(values.cost),
          unitPrice: parseFloat(values.unitPrice),
          ...(shape === "Circular" && { radius: parseFloat(values.radius) }),
          ...(shape === "Rectangular" && {
            width: parseFloat(values.width),
            height: parseFloat(values.height),
          }),
          ...(shape === "Square" && { sideLength: parseFloat(values.sideLength) }),
        };

        const response = await window.electronAPI.createProduct(productData);
        console.log("Product created successfully:", response);
        alert("Product added successfully!");
        formik.resetForm();
        setShape("");
      } catch (error) {
        console.error("Error creating product:", error);
        alert("Failed to add product. Please try again.");
      }
    },
  });

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "auto",
        padding: 3,
        border: "1px solid #1565c0",
        borderRadius: 2,
        backgroundColor: "#e3f2fd",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ color: "#1565c0" }}
      >
        Add Product
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Quantity"
          name="quantity"
          type="number"
          value={formik.values.quantity}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.quantity && Boolean(formik.errors.quantity)}
          helperText={formik.touched.quantity && formik.errors.quantity}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Cost"
          name="cost"
          type="number"
          value={formik.values.cost}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.cost && Boolean(formik.errors.cost)}
          helperText={formik.touched.cost && formik.errors.cost}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Unit Price"
          name="unitPrice"
          type="number"
          value={formik.values.unitPrice}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.unitPrice && Boolean(formik.errors.unitPrice)}
          helperText={formik.touched.unitPrice && formik.errors.unitPrice}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="shape-label">Shape</InputLabel>
          <Select
            labelId="shape-label"
            value={shape}
            onChange={(e) => {
              const newShape = e.target.value as ShapeOption;
              setShape(newShape);
              formik.setFieldValue("radius", "");
              formik.setFieldValue("width", "");
              formik.setFieldValue("height", "");
              formik.setFieldValue("sideLength", "");
            }}
          >
            {shapeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {shape === "Circular" && (
          <TextField
            fullWidth
            label="Radius (meters)"
            name="radius"
            type="number"
            placeholder="Enter radius in meters"
            value={formik.values.radius}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.radius && Boolean(formik.errors.radius)}
            helperText={formik.touched.radius && formik.errors.radius}
            margin="normal"
          />
        )}
        {shape === "Rectangular" && (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Width (meters)"
                name="width"
                type="number"
                placeholder="Enter width in meters"
                value={formik.values.width}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.width && Boolean(formik.errors.width)}
                helperText={formik.touched.width && formik.errors.width}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Height (meters)"
                name="height"
                type="number"
                placeholder="Enter height in meters"
                value={formik.values.height}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.height && Boolean(formik.errors.height)}
                helperText={formik.touched.height && formik.errors.height}
                margin="normal"
              />
            </Grid>
          </Grid>
        )}
        {shape === "Square" && (
          <TextField
            fullWidth
            label="Side Length (meters)"
            name="sideLength"
            type="number"
            placeholder="Enter side length in meters"
            value={formik.values.sideLength}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.sideLength && Boolean(formik.errors.sideLength)}
            helperText={formik.touched.sideLength && formik.errors.sideLength}
            margin="normal"
          />
        )}
        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{ mt: 3, backgroundColor: "#1565c0", color: "white" }}
        >
          Add Product
        </Button>
      </form>
    </Box>
  );
};

export default AddProductForm;
