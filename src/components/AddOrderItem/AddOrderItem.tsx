import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  SelectChangeEvent,
} from "@mui/material";

interface AddOrderItemProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
  availableShapes: string[];
  availableProducts: any[];
}

const AddOrderItem: React.FC<AddOrderItemProps> = ({
  open,
  onClose,
  onSave,
  availableShapes,
  availableProducts,
}) => {
  const [selectedShape, setSelectedShape] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const handleShapeChange = (event: SelectChangeEvent<string>) => {
    setSelectedShape(event.target.value);
  };

  const handleProductChange = (event: SelectChangeEvent<string>) => {
    const selectedProductId = event.target.value;
    setSelectedProduct(
      availableProducts.find((product) => product.id === selectedProductId) || null
    );
  };

  const handleSaveClick = () => {
    if (selectedProduct && quantity > 0) {
      onSave({
        ...selectedProduct,
        shape: selectedShape,
        quantity,
        totalPrice: selectedProduct.price * quantity,
      });
      onClose();
    } else {
      alert("Please select a product and a valid quantity.");
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(event.target.value));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Product to Order</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel id="shape-select-label">Select Shape</InputLabel>
              <Select
                labelId="shape-select-label"
                value={selectedShape}
                onChange={handleShapeChange}
                label="Select Shape"
              >
                {availableShapes.map((shape, index) => (
                  <MenuItem key={index} value={shape}>
                    {shape}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="product-select-label">Select Product</InputLabel>
              <Select
                labelId="product-select-label"
                value={selectedProduct?.id || ""}
                onChange={handleProductChange}
                label="Select Product"
              >
                {availableProducts.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name} - ${product.price}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={quantity}
              onChange={handleQuantityChange}
              margin="normal"
            />
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSaveClick} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddOrderItem;
