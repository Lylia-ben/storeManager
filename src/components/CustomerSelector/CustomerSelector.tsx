import React, { useState, useEffect } from "react";
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";

interface CustomerSelectProps {
  onCustomerSelect: (customerId: string) => void;
}

const CustomerSelect: React.FC<CustomerSelectProps> = ({ onCustomerSelect }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");

  // Fetch customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const fetchedCustomers = await window.electronAPI.fetchAllCustomers();
        setCustomers(fetchedCustomers);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  // Handle selection change
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const selectedId = event.target.value;
    setSelectedCustomer(selectedId);

    // Find the selected customer
    const customer = customers.find((cust) => cust.id === selectedId);

    // Print the selected customer ID and name
    console.log("Selected Customer:", {
      id: customer?.id,
      name: customer?.name,
    });

    // Pass the selected customer ID to the parent component
    onCustomerSelect(selectedId);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Select Customer</InputLabel>
      <Select
        value={selectedCustomer}
        label="Select Customer"
        onChange={handleSelectChange} 
      >
        {customers.map((customer) => (
          <MenuItem key={customer.id} value={customer.id}>
            {customer.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomerSelect;
