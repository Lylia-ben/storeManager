import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import { Box, Typography } from "@mui/material";
import CustomerData from "../CustomerData/CustomerData";
import OrdersTable from "../OrdersTable/OrdersTable";

interface Order {
  id: string;
  total: number;
  status: string;
}

interface Customer {
  id: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  orders: Order[];
  profileImage: string; // URL for the profile image
}

const CustomerProfile: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>(); // Extract customerId from the route
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchCustomerProfile = async () => {
      if (!customerId) return; // Guard against undefined customerId
      try {
        const fetchedCustomer = await window.electronAPI.fetchCustomerById(customerId);
        setCustomer(fetchedCustomer);
      } catch (error) {
        console.error("Error fetching customer profile:", error);
        alert("Failed to load customer data. Please try again later.");
      }
    };

    fetchCustomerProfile();
  }, [customerId]);

  if (!customer) {
    return <Typography>Loading customer data...</Typography>;
  }

  return (
    <Box p={3}>
      <CustomerData
        profileImage={customer.profileImage}
        name={customer.name}
        address={customer.address}
        email={customer.email}
        phoneNumber={customer.phoneNumber}
      />
      <OrdersTable orders={customer.orders} />
    </Box>
  );
};

export default CustomerProfile;
