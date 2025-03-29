import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Box,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';
import * as XLSX from 'xlsx';

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await window.electronAPI.fetchOrderById(orderId);
        if (response.success && response.data) {
          setOrder(response.data);
          console.log(response)
        } else {
          setError(response.message || "Failed to fetch order details");
          console.log(response)
        }
      } catch (err) {
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Handle deleting an item from the order
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

  // Handle updating the order status
  const handleStatusChange = async (event: SelectChangeEvent<"paid" | "not paid">) => {
    if (!order) return;

    const newStatus = event.target.value as "paid" | "not paid";
    try {
      const response = await window.electronAPI.toggleOrderStatus(order.id);
      if (response.success) {
        setOrder((prevOrder) => ({
          ...prevOrder!,
          status: newStatus,
        }));
        console.log(response)
      } else {
        setError(response.message || "Failed to update order status");
        console.log(response)
      }
    } catch (err) {
      setError("Failed to update order status");
    }
  };

  // Handle editing the order
  const handleEditOrder = () => {
    navigate(`/main/edit-order/${orderId}`);
  };

  // Handle exporting to Excel
  const handleExportToExcel = () => {
    if (!order) return
    // Prepare the data for Excel
    const excelData: ExcelRow[] = order.orderItems.map(item => ({
      'Product Name': item.name,
      'Shape': item.shape,
      'Dimensions': 
        item.shape === "Rectangular" ? `${item.width} x ${item.height}` :
        item.shape === "Square" ? `${item.sideLength}` :
        `Radius: ${item.radius}`,
      'Quantity': item.customerQuantity,
      'Unit Price': item.unitPrice.toFixed(2),
      'Total': item.totalAmount.toFixed(2)
    }));
  
    // Add empty row and summary rows
    excelData.push({
      'Product Name': '',
      'Shape': '',
      'Dimensions': '',
      'Quantity': '',
      'Unit Price': '',
      'Total': ''
    });
    
    excelData.push({
      'Product Name': 'TOTAL',
      'Shape': '',
      'Dimensions': '',
      'Quantity': '',
      'Unit Price': '',
      'Total': order.total.toFixed(2)
    });
    
    excelData.push({
      'Product Name': 'STATUS',
      'Shape': '',
      'Dimensions': '',
      'Quantity': '',
      'Unit Price': '',
      'Total': order.status.toUpperCase()
    });
  
    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Order Details");
  
    // Generate file name
    const fileName = `Order_${order.id}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  
    // Export the file
    XLSX.writeFile(workbook, fileName);
  };
  // Handle exporting to Text file
  const handleExportToText = () => {
    if (!order) return;

    // Create text content
    let textContent = `Order Details - Order #${order.id}\n\n`;
    textContent += 'Product Name\tShape\tDimensions\tQuantity\tUnit Price\tTotal\n';
    textContent += '--------------------------------------------------------------------------------\n';

    // Add order items
    order.orderItems.forEach(item => {
      const dimensions = 
        item.shape === "Rectangular" ? `${item.width} x ${item.height}` :
        item.shape === "Square" ? `${item.sideLength}` :
        `Radius: ${item.radius}`;
      
      textContent += `${item.name}\t${item.shape}\t${dimensions}\t${item.customerQuantity}\t${item.unitPrice.toFixed(2)}\t${item.totalAmount.toFixed(2)}\n`;
    });

    // Add summary
    textContent += '\n--------------------------------------------------------------------------------\n';
    textContent += `TOTAL:\t\t\t\t\t${order.total.toFixed(2)}\n`;
    textContent += `STATUS:\t\t\t\t\t${order.status.toUpperCase()}\n`;

    // Create file and download
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Order_${order.id}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      <Alert severity="error" sx={{ margin: 2, marginLeft: "250px" }}>
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
      {/* Title and Edit Order Button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
          Order Details
        </Typography>
        <Button variant="contained" color="primary" onClick={handleEditOrder}>
          Edit Order
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
                  {item.shape === "Square" && `${item.sideLength}`}
                  {item.shape === "Circular" && `Radius: ${item.radius}`}
                </TableCell>
                <TableCell>{item.customerQuantity}</TableCell>
                <TableCell>{item.unitPrice.toFixed(2)}</TableCell>
                <TableCell>{item.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Button variant="contained" color="error" onClick={() => handleDeleteItem(item.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5} align="right">
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Total Price:
                </Typography>
              </TableCell>
              <TableCell colSpan={2}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  ${order.total.toFixed(2)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
  
      {/* Order Status */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select value={order.status} onChange={handleStatusChange} label="Status">
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="not paid">Not Paid</MenuItem>
          </Select>
        </FormControl>
      </Box>
  
      {/* Export to Excel Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <Button variant="contained" color="success" onClick={handleExportToExcel} startIcon={<DownloadIcon />}>
          Export to Excel
        </Button>
        <Button 
          variant="contained" 
          color="info" 
          onClick={handleExportToText} 
          startIcon={<DescriptionIcon />}
          sx={{ 
            textTransform: 'none',
            marginLeft:"10px",
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0'
            }
          }}
        >
          Export to Text
        </Button>
      </Box>
    </Box>
  );
  
};

export default OrderDetail;