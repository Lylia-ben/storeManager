import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const CustomersTable: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const fetchedCustomers = await window.electronAPI.fetchAllCustomers();
        if (Array.isArray(fetchedCustomers)) {
          setCustomers(fetchedCustomers);
          console.log(fetchedCustomers)
        } else {
          console.error("Fetched data is not an array", fetchedCustomers);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  const handleViewProfile = (id: string) => {
    console.log("Navigating to profile with ID:", id); // Debugging
    navigate(`/main/customer-profil/${id}`);
  };
  
  
  const handleDelete = async (id: string) => {
    try {
      await window.electronAPI.deleteCustomer(id);
  
      // ✅ Remove the deleted customer from the UI
      setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer.id !== id));
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };
  

  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h6" component="h2" mb={2} textAlign="center">
        Customers List
      </Typography>
      <TableContainer component={Box}>
        <Table sx={{ minWidth: 650 }} aria-label="customers table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Operations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phoneNumber}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleViewProfile(customer.id)}
                      variant="contained"
                      sx={{
                        backgroundColor: "#3386ff",
                        color: "#fff",
                        mr: 2,
                        "&:hover": { backgroundColor: "#2a72d0" },
                      }}
                    >
                      View Profile
                    </Button>
                    <Button
                      onClick={() => handleDelete(customer.id)}
                      variant="contained"
                      sx={{
                        backgroundColor: "#d32f2f",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#b71c1c" },
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No customers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CustomersTable;
