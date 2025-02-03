import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

interface Product {
  id: string;
  name: string;
  radius?: number;
  width?: number;
  height?: number;
  sideLength?: number;
}

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
        setProducts(response || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [shape]);

  // Fix: Use SelectChangeEvent<string> instead of ChangeEvent
  const handleChange = (event: SelectChangeEvent<string>) => {
    const productId = event.target.value;
    setSelectedProduct(productId);

    // Fetch product details asynchronously but do not make handleChange async
    window.electronAPI.fetchProductById(productId).then(onSelect).catch(console.error);
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
