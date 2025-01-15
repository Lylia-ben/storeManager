import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";

interface Customer {
  id: string;
  name: string;
}

interface CustomerSelectProps {
  onSelectCustomer?: (customerId: string) => void;
}

const CustomerSelector: React.FC<CustomerSelectProps> = ({ onSelectCustomer }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customersData = await window.electronAPI.fetchAllCustomers();
        setCustomers(customersData);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const customerId = event.target.value as string;
    setSelectedCustomerId(customerId);
    console.log(customerId);

    if (onSelectCustomer) {
      onSelectCustomer(customerId);
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="customer-select-label">Select Customer</InputLabel>
      {loading ? (
        <CircularProgress size={24} style={{ margin: "16px auto" }} />
      ) : (
        <Select
          labelId="customer-select-label"
          id="customer-select"
          value={selectedCustomerId}
          onChange={handleChange}
        >
          <MenuItem value="" disabled>
            -- Choose a Customer --
          </MenuItem>
          {customers.map((customer) => (
            <MenuItem key={customer.id} value={customer.id}>
              {customer.name}
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  );
};

export default CustomerSelector;
