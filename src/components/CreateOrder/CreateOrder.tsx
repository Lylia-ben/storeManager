import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
} from "@mui/material";
import CustomerSelector from "../CustomerSelector/CustomerSelector";
import OrderItemsTable from "../OrderItemsTable/OrderItemsTable";
import AddOrderItem from "../AddOrderItem/AddOrderItem";
import { addOrder } from "../../OrderActions";

const CreateOrder: React.FC = () => {
  const dispatch = useDispatch();
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [addProductOpen, setAddProductOpen] = useState<boolean>(false);
  const [selectedShape, setSelectedShape] = useState<"Square" | "Circular" | "Rectangular" | "">("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedShape) {
      setLoading(true);
      const fetchProducts = async () => {
        try {
          const response = await window.electronAPI.fetchProductsByType(selectedShape);
          setProducts(response);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [selectedShape]);

  const handleAddProduct = (product: any) => {
    setOrderItems((prevItems) => [...prevItems, product]);
  };

  const handleDeleteOrderItem = (id: string) => {
    setOrderItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleSaveOrder = () => {
    if (!customerId || orderItems.length === 0) {
      alert("Please select a customer and add order items");
      return;
    }

    const orderData = {
      customerId,
      items: orderItems,
      totalPrice: orderItems.reduce((acc, item) => acc + item.totalPrice, 0),
    };

    dispatch(addOrder(orderData)); // Dispatch the action to Redux
    alert("Order saved successfully!");
  };

  return (
    <Box p={3} sx={{marginLeft:"300px"}}>
      <Typography variant="h4" gutterBottom>
        Create New Order
      </Typography>

      <CustomerSelector onSelectCustomer={(customerId) => setCustomerId(customerId)} />

      {customerId && (
        <>
          <FormControl fullWidth>
            <Select
              value={selectedShape}
              onChange={(e) => setSelectedShape(e.target.value as "Square" | "Circular" | "Rectangular" | "")}
            >
              <MenuItem value="">-- Select Shape --</MenuItem>
              <MenuItem value="Square">Square</MenuItem>
              <MenuItem value="Circular">Circular</MenuItem>
              <MenuItem value="Rectangular">Rectangular</MenuItem>
            </Select>
          </FormControl>

          {loading ? (
            <CircularProgress />
          ) : (
            <OrderItemsTable orderItems={orderItems} onDelete={handleDeleteOrderItem} />
          )}

          <Button variant="contained" color="primary" onClick={() => setAddProductOpen(true)}>
            Add Product
          </Button>

          <Button variant="contained" color="success" onClick={handleSaveOrder} style={{ marginTop: "16px" }}>
            Save Order
          </Button>
        </>
      )}

      <AddOrderItem
        open={addProductOpen}
        onClose={() => setAddProductOpen(false)}
        onSave={handleAddProduct}
        availableShapes={["Square", "Circular", "Rectangular"]}
        availableProducts={products}
      />
    </Box>
  );
};

export default CreateOrder;
