import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

// Define shapes and possible dimensions for each
const shapeDimensions = {
  Square: ["Side Length"],
  Circular: ["Radius"],
  Rectangular: ["Width", "Height"],
};

interface AddProductFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
  availableShapes: string[];
}

const AddOrderItem: React.FC<AddProductFormProps> = ({
  open,
  onClose,
  onSave,
  availableShapes,
}) => {
  const [shape, setShape] = useState<string>("");
  const [dimensions, setDimensions] = useState<{ [key: string]: number }>({});
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);

  useEffect(() => {
    if (shape && shapeDimensions[shape]) {
      // Initialize dimension fields with default values when the shape changes
      const newDimensions: { [key: string]: number } = {};
      shapeDimensions[shape].forEach((dim) => {
        newDimensions[dim] = 0; // Default value for each dimension
      });
      setDimensions(newDimensions);
    }
  }, [shape]);
  

  const handleDimensionChange = (dim: string, value: number) => {
    setDimensions((prev) => ({
      ...prev,
      [dim]: value,
    }));
  };

  const handleSave = () => {
    const newProduct = {
      id: Math.random().toString(),
      name: `Product ${Math.random()}`,
      shape,
      dimensions,
      quantity,
      unitPrice,
      totalPrice: quantity * unitPrice,
    };
    onSave(newProduct);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Product</DialogTitle>
      <DialogContent>
        {/* Shape Selector */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Shape</InputLabel>
          <Select
            value={shape}
            onChange={(e) => setShape(e.target.value)}
            label="Shape"
          >
            {availableShapes.map((shapeOption) => (
              <MenuItem key={shapeOption} value={shapeOption}>
                {shapeOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Dynamically display dimension inputs based on shape */}
        {shapeDimensions[shape]?.map((dim) => (
          <TextField
            key={dim}
            fullWidth
            label={dim}
            type="number"
            value={dimensions[dim] || 0}
            onChange={(e) => handleDimensionChange(dim, Number(e.target.value))}
            margin="normal"
          />
        ))}

        {/* Quantity Input */}
        <TextField
          fullWidth
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          margin="normal"
        />

        {/* Unit Price Input */}
        <TextField
          fullWidth
          label="Unit Price"
          type="number"
          value={unitPrice}
          onChange={(e) => setUnitPrice(Number(e.target.value))}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddOrderItem;
