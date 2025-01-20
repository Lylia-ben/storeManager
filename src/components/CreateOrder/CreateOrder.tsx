import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import CustomerSelector from "../CustomerSelector/CustomerSelector";
import OrderItemsTable from "../OrderItemsTable/OrderItemsTable";
import AddOrderItem from "../AddOrderItem/AddOrderItem";

const CreateOrder: React.FC = () => {
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [addProductOpen, setAddProductOpen] = useState<boolean>(false);

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

    // You can call your API here to save the order
    console.log("Order saved with customer ID:", customerId, "and order items:", orderItems);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Create New Order
      </Typography>

      <CustomerSelector onSelectCustomer={(customerId) => setCustomerId(customerId)} />

      {customerId && (
        <>
          <OrderItemsTable orderItems={orderItems} onDelete={handleDeleteOrderItem} />
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
      />
    </Box>
  );
};

export default CreateOrder;
