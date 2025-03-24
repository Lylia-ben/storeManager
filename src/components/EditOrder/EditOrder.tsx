import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // ✅ Import uuid
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Box,
  Alert,
  TextField,
} from "@mui/material";
import ProductShapeSelector from "../ShapeSelector/ShapeSelector";
import ProductSelector from "../ProductSelector/ProductSelector";

const EditOrder = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedShape, setSelectedShape] = useState<"Rectangular" | "Circular" | "Square">("Rectangular");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await window.electronAPI.fetchOrderById(orderId);
        if (response.success && response.data) {
          setOrder({
            ...response.data,
            createdAt: new Date(response.data.createdAt).toISOString(),
            updatedAt: new Date(response.data.updatedAt).toISOString(),
          });
          console.log("Fetched Order:", response.data);
        } else {
          setError(response.message || "Failed to fetch order details");
        }
      } catch (err) {
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Handle quantity change
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (!order) return;
    setOrder((prevOrder) => ({
      ...prevOrder!,
      orderItems: prevOrder!.orderItems.map((item) =>
        item.id === itemId ? { ...item, customerQuantity: newQuantity } : item
      ),
    }));
  };

  // Handle deleting an item
  const handleDeleteItem = async (itemId: string) => {
    if (!order) return;
  
    const response = await window.electronAPI.deleteOrderItem(orderId, itemId);
  
    if (response.success) {
      setOrder((prevOrder) => ({
        ...prevOrder!,
        orderItems: prevOrder!.orderItems.filter((item) => item.id !== itemId),
      }));
    } else {
      alert(response.message);
    }
  };
  

  // Handle adding a product
  const handleAddProduct = () => {
    if (!selectedProduct || !order) return;
  
    const newItem: OrderItem = {
      id: uuidv4(), // Unique ID for the order item
      productId: selectedProduct.id || "", // Ensure `productId` is included
      name: selectedProduct.name,
      quantity: selectedProduct.quantity || 0, // Ensure `quantity` is included
      shape: selectedProduct.shape,
      width: selectedProduct.width ?? undefined,
      height: selectedProduct.height ?? undefined,
      radius: selectedProduct.radius ?? undefined,
      sideLength: selectedProduct.sideLength ?? undefined,
      customerQuantity: 1, // Default quantity for new items
      unitPrice: selectedProduct.unitPrice,
      cost: selectedProduct.cost,
      totalAmount: selectedProduct.unitPrice, // Initial total amount
    };
  
    setOrder((prevOrder) => ({
      ...prevOrder!,
      orderItems: [...prevOrder!.orderItems, newItem],
    }));
  
    // Reset selected product
    setSelectedProduct(null);
  };

  const handleSaveOrder = async () => {
    if (!order) return;

    try {
      const updatedOrderItems = order.orderItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        shape: item.shape,
        width: item.width,
        height: item.height,
        radius: item.radius,
        sideLength: item.sideLength,
        customerQuantity: item.customerQuantity,
        unitPrice: item.unitPrice,
        cost: item.cost,
        totalAmount: item.unitPrice * item.customerQuantity, // Calculate total
      }));

      const response = await window.electronAPI.updateOrder(
        order.id,
        updatedOrderItems
      );

      if (response.success) {
        navigate(`/main/order-details/${order.id}`);
      } else {
        setError(response.message || "Failed to update order");
      }
    } catch (err) {
      setError("Failed to update order");
      console.error("Update error:", err);
    }
  };
  

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ margin: 2 }}>
        {error}
      </Alert>
    );
  }

  // No order found
  if (!order) {
    return (
      <Alert severity="warning" sx={{ margin: 2 }}>
        Order not found.
      </Alert>
    );
  }

  return (
    <Box sx={{ padding: 3, marginLeft: "250px" }}>
      <Typography variant="h4" gutterBottom>
        Edit Order
      </Typography>

      {/* Shape and Product Selectors */}
      <Box sx={{ display: "flex", gap: 2, marginBottom: 3 }}>
        <ProductShapeSelector selectedShape={selectedShape} onShapeSelect={setSelectedShape} />
        <ProductSelector shape={selectedShape} onSelect={setSelectedProduct} />
        <Button variant="contained" color="primary" onClick={handleAddProduct} disabled={!selectedProduct}>
          Add Product
        </Button>
      </Box>

      {/* Order Items Table */}
      <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Shape</TableCell>
              <TableCell>Dimensions</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Operations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.orderItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.shape}</TableCell>
                <TableCell>
                  {item.shape === "Rectangular" && `${item.width} x ${item.height}`}
                  {item.shape === "Square" && `${item.sideLength} `}
                  {item.shape === "Circular" && `Radius: ${item.radius}`}
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={item.customerQuantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    inputProps={{ min: 1 }}
                    size="small"
                  />
                </TableCell>
                <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                <TableCell>${(item.unitPrice * item.customerQuantity).toFixed(2)}</TableCell>
                <TableCell>
                  <Button variant="contained" color="error" onClick={() =>  handleDeleteItem(item.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Save Button */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSaveOrder}>
          Save Order
        </Button>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default EditOrder;
