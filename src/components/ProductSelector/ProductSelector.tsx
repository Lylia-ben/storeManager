import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

interface ProductSelectorProps {
  shape: "Circular" | "Square" | "Rectangular";
  onSelect: (product: Product) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ shape, onSelect }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await window.electronAPI.fetchProductsByType(shape);
        if (!response || response.length === 0) {
          console.warn("No products found for shape:", shape);
        }
        setProducts(response || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [shape]);

  const handleChange = async (event: SelectChangeEvent<string>) => {
    const productId = event.target.value;
    setSelectedProduct(productId);

    console.log("Selected Product ID:", productId); // Debugging line

    if (!productId) {
      console.error("Error: Product ID is undefined.");
      return;
    }

    try {
      const product = await window.electronAPI.fetchProductById(productId);
      console.log("Fetched Product Details:", product); // Debugging line
      onSelect(product);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Select Product</InputLabel>
      <Select value={selectedProduct} onChange={handleChange}>
        {products.map((product) => (
          <MenuItem key={product.id} value={product.id}>
            {product.name} (
            {shape === "Circular"
              ? `Radius: ${product.radius}`
              : shape === "Rectangular"
              ? `W: ${product.width}, H: ${product.height}`
              : `Side: ${product.sideLength}`}
            )
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ProductSelector;
