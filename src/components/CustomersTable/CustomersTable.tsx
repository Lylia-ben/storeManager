import React, { useEffect, useState } from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";


const CustomersTable: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const fetchedCustomers = await window.electronAPI.fetchAllCustomers();
        if (Array.isArray(fetchedCustomers)) {
          setCustomers(fetchedCustomers); // Set the customers array directly
        } else {
          console.error("Fetched data is not an array", fetchedCustomers);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
  
    fetchCustomers();
  }, []);
  

  const handleEdit = (id: string) => {
    console.log(`Editing customer with ID: ${id}`);
    // Implement your edit functionality here
  };

  const handleDelete = (id: string) => {
    console.log(`Deleting customer with ID: ${id}`);
    // Implement your delete functionality here
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
              <TableCell>Orders</TableCell>
              <TableCell>Operations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers && customers.length > 0 ? (
              customers.map((customer) => (
                <TableRow key={customer.name}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phoneNumber}</TableCell>
                  <TableCell>{customer.orders.length}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(customer._id)} variant="contained" color="primary" sx={{ mr: 2 }}>
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(customer._id)} variant="contained" color="secondary">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">No customers found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CustomersTable;
