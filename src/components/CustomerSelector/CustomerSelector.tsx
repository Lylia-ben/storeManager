import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, CircularProgress, SelectChangeEvent } from "@mui/material";

interface CustomerSelectorProps {
  onSelect: (customerId: string) => void;
}

const CustomerSelector: React.FC<CustomerSelectorProps> = ({ onSelect }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await window.electronAPI.fetchAllCustomers();
        setCustomers(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Fix: Use SelectChangeEvent<string> instead of ChangeEvent
  const handleChange = (event: SelectChangeEvent<string>) => {
    const customerId = event.target.value;
    setSelectedCustomer(customerId);
    onSelect(customerId);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Select Customer</InputLabel>
      {loading ? (
        <CircularProgress size={24} />
      ) : (
        <Select value={selectedCustomer} onChange={handleChange}>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <MenuItem key={customer._id} value={customer._id}>
                {customer.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No customers available</MenuItem>
          )}
        </Select>
      )}
    </FormControl>
  );
};

export default CustomerSelector;
