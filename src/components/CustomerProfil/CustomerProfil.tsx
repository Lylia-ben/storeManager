import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import CustomerData from "../CustomerData/CustomerData";
import CustomerOrders from "../CustomerOrders/CustomerOrders";

const CustomerProfil: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get customer ID from URL params
  const [customer, setCustomer] = useState<Customer | null>(null);
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

  if (loading) {
    return <CircularProgress />;
  }

  if (!customer) {
    return <Typography>No customer found</Typography>;
  }

  return (
    <Box p={3}>
      <CustomerData customer={customer} />
      {/* Pass customerId, total, and status to CustomerOrders */}
      <CustomerOrders customerId={customer.id} /> 
    </Box>
  );
};

export default CustomerProfil;
