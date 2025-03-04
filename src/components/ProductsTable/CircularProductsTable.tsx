import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
const CircularProductTable: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch CircularProduct data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await window.electronAPI.fetchProductsByType("Circular");
        console.log(data); // Inspect the structure of the data
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // edit product
  const handleEdit = (productId: string) => {
    navigate(`/main/edit-product/${productId}`);
  };
  // Handle delete operation
  const handleDelete = async (productId: string) => {
    try {
      await window.electronAPI.deleteProduct(productId);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (err) {
      setError("Failed to delete product.");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Box color="error.main">{error}</Box>;
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        marginLeft: "220px",
        width: "calc(100% - 200px)", 
        maxWidth: "900px",
        marginTop: "20px", // Adds spacing from the top
      }}
    >
      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: "#1565c0" }}>
            <TableCell style={{ color: "#ffffff" }}>Name</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Shape</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Radius</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Quantity</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Cost</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Unit Price</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Operation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.shape}</TableCell>
              <TableCell>{product.radius}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{product.cost}</TableCell>
              <TableCell>{product.unitPrice}</TableCell>
              <TableCell>
              <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#1565c0",
                    color: "#ffffff",
                  }}
                  size="small"
                  onClick={() => handleEdit(product.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "red",
                    color: "#ffffff",
                    marginLeft: "8px",
                  }}
                  size="small"
                  onClick={() => handleDelete(product.id)}
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

export default CircularProductTable;
