import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
} from "@mui/material";

interface Customer {
  id: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  orders: any[]; // Assuming orders are an array
  total: number;
}

const CustomersTable: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Fetch customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const fetchedCustomers = await window.electronAPI.fetchAllCustomers();
        setCustomers(fetchedCustomers);
        console.log(fetchedCustomers);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  // Handle customer deletion
  const handleDelete = async (customerId: string) => {
    try {
      await window.electronAPI.deleteCustomer(customerId);
      setCustomers((prev) => prev.filter((customer) => customer.id !== customerId));
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: "#1565c0" }}>
          <TableRow>
            <TableCell sx={{ color: "white" }}>Name</TableCell>
            <TableCell sx={{ color: "white" }}>Address</TableCell>
            <TableCell sx={{ color: "white" }}>Email</TableCell>
            <TableCell sx={{ color: "white" }}>Phone Number</TableCell>
            <TableCell sx={{ color: "white" }}>Number of Orders</TableCell>
            <TableCell sx={{ color: "white" }}>Total</TableCell>
            <TableCell sx={{ color: "white" }}>Operations</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.address}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phoneNumber}</TableCell>
              <TableCell>{customer.orders.length}</TableCell>
              <TableCell>{customer.total}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to={`/customer/${customer.id}`}
                >
                  View Profile
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(customer.id)}
                  style={{ marginLeft: "8px" }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomersTable;
