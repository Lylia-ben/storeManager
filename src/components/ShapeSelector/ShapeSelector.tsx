import React, { useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface ProductShapeSelectorProps {
  onShapeSelect: (shape: "Circular" | "Square" | "Rectangular") => void;
  selectedShape: "Circular" | "Square" | "Rectangular";
}

const ProductShapeSelector: React.FC<ProductShapeSelectorProps> = ({ onShapeSelect, selectedShape }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Product Shape</InputLabel>
      <Select value={selectedShape} onChange={(e) => onShapeSelect(e.target.value as any)}>
        <MenuItem value="Circular">Circular</MenuItem>
        <MenuItem value="Square">Square</MenuItem>
        <MenuItem value="Rectangular">Rectangular</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ProductShapeSelector;
