import React, { useState } from "react";
import { Button, Grid } from "@mui/material";
import CustomerSelector from "../CustomerSelector/CustomerSelector";
import ProductShapeSelector from "../ShapeSelector/ShapeSelector";
import ProductSelector from "../ProductSelector/ProductSelector";
import OrderTable from "../OrderTable/OrderTable";
import { v4 as uuidv4 } from "uuid";

type ProductShape = "Rectangular" | "Circular" | "Square";

const CreateOrder: React.FC = () => {
  const [customerId, setCustomerId] = useState<string>("");
  const [selectedShape, setSelectedShape] = useState<ProductShape>("Rectangular");
  const [selectedProducts, setSelectedProducts] = useState<
    {
      id: string;
      name: string;
      quantity: number;
      unitPrice: number;
      cost: number;
      shape: ProductShape;
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
    console.log("Selected Product:", product);

    if (!product || !product.id) {
      console.error("Error: Selected product has no valid ID!", product);
      return;
    }

    setSelectedProducts((prev) => {
      const existingProduct = prev.find((p) => p.id === product.id);
      if (existingProduct) return prev;

      return [
        ...prev,
        {
          ...product,
          id: String(product.id),
          quantity: 1,
          shape: product.shape as ProductShape,
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
        id: uuidv4(),
        productId: p.id,
        customerQuantity: p.quantity,
        name: p.name,
        cost: p.cost,
        quantity: p.quantity,
        unitPrice: p.unitPrice,
        totalAmount: p.quantity * p.unitPrice,
        shape: p.shape,
        width: p.width,
        height: p.height,
        sideLength: p.sideLength,
        radius: p.radius,
      })),
    };
  
    console.log("Final Order Data:", orderData);
  
    try {
      const response = await window.electronAPI.createOrder(orderData);
      console.log("Order Response:", response);
      alert(response.message);
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Failed to create order.");
    }
  };

  const handleGetTicket = () => {
    if (selectedProducts.length === 0) {
      alert("Please add products to the order first.");
      return;
    }

    const ticketContent = generateTicketContent();
    downloadTextFile(ticketContent, `order_ticket_${new Date().toISOString().slice(0, 10)}.txt`);
  };

  const generateTicketContent = () => {
    const header = "=== ORDER TICKET ===\n\n";
    const date = `Date: ${new Date().toLocaleString()}\n`;
    const customerInfo = customerId ? `Customer ID: ${customerId}\n\n` : "\n";
    
    const productLines = selectedProducts.map(p => {
      const dimensions = getDimensionsString(p);
      return `${p.name}${dimensions}: ${p.quantity} × ${p.unitPrice.toFixed(2)} = ${(p.quantity * p.unitPrice).toFixed(2)}`;
    }).join("\n");
    
    const total = `\n\nTOTAL: ${selectedProducts.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0).toFixed(2)}`;
    
    return header + date + customerInfo + productLines + total;
  };

  const getDimensionsString = (product: typeof selectedProducts[0]) => {
    if (product.shape === "Rectangular" && product.width && product.height) {
      return ` (${product.width}×${product.height})`;
    }
    if (product.shape === "Square" && product.sideLength) {
      return ` (${product.sideLength}×${product.sideLength})`;
    }
    if (product.shape === "Circular" && product.radius) {
      return ` (Radius: ${product.radius})`;
    }
    return "";
  };

  const downloadTextFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Grid container spacing={2} sx={{ marginLeft: "200px", padding: 2 }}>
      <Grid item xs={12}>
        <CustomerSelector onCustomerSelect={setCustomerId} />
      </Grid>
      <Grid item xs={6}>
        <ProductShapeSelector 
          selectedShape={selectedShape} 
          onShapeSelect={handleShapeSelect} 
        />
      </Grid>
      <Grid item xs={6}>
        <ProductSelector 
          shape={selectedShape} 
          onSelect={handleProductSelect} 
        />
      </Grid>
      <Grid item xs={12}>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleGetTicket}
          disabled={selectedProducts.length === 0}
          sx={{ mb: 2, mr: 2 }}
        >
          Get Ticket
        </Button>
        <OrderTable 
          products={selectedProducts} 
          onQuantityChange={handleQuantityChange} 
        />
      </Grid>
      <Grid item xs={12}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSaveOrder}
          disabled={!customerId || selectedProducts.length === 0}
          sx={{ mt: 2 }}
        >
          Save Order
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateOrder;