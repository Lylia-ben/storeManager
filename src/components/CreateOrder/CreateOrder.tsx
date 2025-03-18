import React, { useState } from "react";
import { Button, Grid } from "@mui/material";
import CustomerSelector from "../CustomerSelector/CustomerSelector";
import ProductShapeSelector from "../ShapeSelector/ShapeSelector";
import ProductSelector from "../ProductSelector/ProductSelector";
import OrderTable from "../OrderTable/OrderTable";

// Define the ProductShape type
type ProductShape = "Square" | "Circular" | "Rectangular";

const CreateOrder: React.FC = () => {
  const [customerId, setCustomerId] = useState<string>("");
  const [selectedShape, setSelectedShape] = useState<ProductShape>("Rectangular");
  const [selectedProducts, setSelectedProducts] = useState<
    {
      id: string;
      name: string;
      quantity: number;
      unitPrice: number;
      shape: ProductShape; // ✅ Explicitly type `shape` as `ProductShape`
      width?: number;
      height?: number;
      sideLength?: number;
      radius?: number;
    }[]
  >([]);

  const handleShapeSelect = (shape: ProductShape) => {
    setSelectedShape(shape);
    console.log("Selected Shape:", shape);
  };

  const handleProductSelect = (product: any) => {
    console.log("Selected Product:", product); // Debugging

    if (!product || !product.id) {
      console.error("Error: Selected product has no valid ID!", product);
      return;
    }

    setSelectedProducts((prev) => {
      const existingProduct = prev.find((p) => p.id === product.id);
      if (existingProduct) return prev; // Prevent duplicates

      return [
        ...prev,
        {
          ...product,
          id: String(product.id),
          quantity: 1,
          shape: product.shape as ProductShape, // ✅ Ensure `shape` is of type `ProductShape`
          width: product.width ?? undefined,
          height: product.height ?? undefined,
          sideLength: product.sideLength ?? undefined,
          radius: product.radius ?? undefined,
        },
      ];
    });
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity } : p))
    );
  };

  const handleSaveOrder = async () => {
    if (!customerId || selectedProducts.length === 0) {
      alert("Please select a customer and at least one product.");
      return;
    }

    const orderData = {
      customerId,
      orderItems: selectedProducts.map((p) => ({
        productName: p.name, // ✅ Added `productName`
        shape: p.shape, // ✅ `shape` is already of type `ProductShape`
        dimensions:
          p.shape === "Rectangular"
            ? `Width: ${p.width}cm, Height: ${p.height}cm`
            : p.shape === "Square"
            ? `Side: ${p.sideLength}cm`
            : `Radius: ${p.radius}cm`, // ✅ Added `dimensions`
        quantity: p.quantity, // ✅ Added `quantity`
        unitPrice: p.unitPrice, // ✅ Added `unitPrice`
      })),
    };

    console.log("Final Order Data:", orderData); // Debugging

    try {
      const response = await window.electronAPI.createOrder(orderData);
      console.log("Order Response:", response);
      alert(response.message);
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Failed to create order.");
    }
  };

  return (
    <Grid container spacing={2} sx={{ marginLeft: "200px" }}>
      <Grid item xs={12}>
        <CustomerSelector onCustomerSelect={setCustomerId} />
      </Grid>
      <Grid item xs={6}>
        <ProductShapeSelector selectedShape={selectedShape} onShapeSelect={handleShapeSelect} />
      </Grid>
      <Grid item xs={6}>
        <ProductSelector shape={selectedShape} onSelect={handleProductSelect} />
      </Grid>
      <Grid item xs={12}>
        <OrderTable products={selectedProducts} onQuantityChange={handleQuantityChange} />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSaveOrder}>
          Save Order
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateOrder;