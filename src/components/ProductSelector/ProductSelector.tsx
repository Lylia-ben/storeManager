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
  
    if (!productId || productId === "undefined") {
      console.error("Error: Selected Product ID is invalid!", productId);
      return;
    }
  
    try {
      const product = await window.electronAPI.fetchProductById(productId);
  
      if (!product || !product.id) {
        console.error("Error: Fetched product has no valid ID!", product);
        return;
      }
  
      console.log("Fetched Product Details:", product); // Debugging
      onSelect({ ...product, id: String(product.id) }); // Ensure ID is a string
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
