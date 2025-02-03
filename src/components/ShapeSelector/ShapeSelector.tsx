import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface ProductShapeSelectorProps {
  onShapeSelect: (shape: "Circular" | "Square" | "Rectangular") => void;
}

const ProductShapeSelector: React.FC<ProductShapeSelectorProps> = ({ onShapeSelect }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Product Shape</InputLabel>
      <Select onChange={(e) => onShapeSelect(e.target.value as any)}>
        <MenuItem value="Circular">Circular</MenuItem>
        <MenuItem value="Square">Square</MenuItem>
        <MenuItem value="Rectangular">Rectangular</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ProductShapeSelector;
