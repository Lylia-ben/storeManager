import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import CustomerData from "../CustomerData/CustomerData";
import CustomerOrders from "../CustomerOrders/CustomerOrders";
import * as XLSX from "xlsx";

const CustomerProfil: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const fetchedCustomer = await window.electronAPI.fetchCustomerById(id);
        if (fetchedCustomer) {
          setCustomer(fetchedCustomer);
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleExportToExcel = () => {
    if (!customer || orders.length === 0) return;
  
    // Create workbook
    const wb = XLSX.utils.book_new();
  
    // 1. Customer Info Sheet
    const customerData = [
      ["Customer Profile"],
      [],
      ["Name:", customer.name],
      ["Email:", customer.email || "N/A"],
      ["Address:", customer.address || "N/A"],
      ["Phone:", customer.phoneNumber],
      ["Status:", customer.status],
      [],
      ["Orders Summary"],
      ["Total Orders:", orders.length],
      ["Total Amount:", `$${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}`],
      ["Paid Orders:", orders.filter(o => o.status === "paid").length],
      ["Pending Orders:", orders.filter(o => o.status === "not paid").length],
      [], // Empty row before table
      // Table headers (will be bolded using cell references)
      ["Order ID", "Date", "Total Amount", "Status"],
      // Table data
      ...orders.map(order => [
        order.id,
        new Date(order.createdAt).toLocaleDateString(),
        `$${order.total.toFixed(2)}`,
        order.status.toUpperCase()
      ]),
      [], // Empty row after table
      ["Detailed Orders Breakdown"] // Section header
    ];
  
    const customerWs = XLSX.utils.aoa_to_sheet(customerData);
    
    // Alternative way to bold headers without using 's' property
    const headerRow = customerData.length - orders.length - 2;
    for (let col = 0; col < 4; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: headerRow, c: col });
      if (!customerWs[cellRef]) continue;
      customerWs[cellRef].t = 's'; // Set cell type to string
      customerWs[cellRef].v = customerData[headerRow][col];
      customerWs[cellRef].bold = true; // Some versions support this
    }
  
    XLSX.utils.book_append_sheet(wb, customerWs, "Customer Report");
  
    // 2. Detailed Orders Sheet
    const ordersData = [
      ["Order ID", "Date", "Status", "Total", "Items Count", "Items Details"],
      ...orders.map(order => [
        order.id,
        new Date(order.createdAt).toLocaleDateString(),
        order.status.toUpperCase(),
        `$${order.total.toFixed(2)}`,
        order.orderItems.length,
        order.orderItems.map(item => 
          `${item.name} (${item.customerQuantity} × $${item.unitPrice})`
        ).join("\n")
      ])
    ];
  
    const ordersWs = XLSX.utils.aoa_to_sheet(ordersData);
    
    // Bold headers in the detailed sheet
    for (let col = 0; col < 6; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!ordersWs[cellRef]) continue;
      ordersWs[cellRef].t = 's';
      ordersWs[cellRef].v = ordersData[0][col];
      ordersWs[cellRef].bold = true;
    }
  
    XLSX.utils.book_append_sheet(wb, ordersWs, "Order Details");
  
    // Export file
    const fileName = `${customer.name.replace(/[^a-z0-9]/gi, '_')}_report_${new Date().toISOString().slice(0,10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  if (loading) return <CircularProgress />;
  if (!customer) return <Typography>No customer found</Typography>;

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button 
          variant="contained" 
          color="success" 
          onClick={handleExportToExcel}
          disabled={orders.length === 0}
          sx={{ 
            zIndex: 1000,
            '&:disabled': { opacity: 0.5 }
          }}
        >
          Export to Excel
        </Button>
      </Box>
      <CustomerData customer={customer} />
      <CustomerOrders 
        customerId={customer.id} 
        onOrdersLoaded={setOrders} 
      />
    </Box>
  );
};

export default CustomerProfil;