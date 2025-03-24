import { ipcMain } from 'electron';
import { Product, RectangularProduct, CircularProduct, SquareProduct } from '../../database/models/Product/Product';
import mongoose from "mongoose";
// Register IPC handlers for product-related operations
export const productIpcHandlers = (): void => {
  // Handle product creation
  ipcMain.handle("product:create", async (_event, productData) => {
    const { shape, ...productDetails } = productData;

    try {
      let newProduct;

      // Create the product based on its type
      switch (shape) {
        case "Rectangular":
          newProduct = await RectangularProduct.create(productDetails);
          break;
        case "Circular":
          newProduct = await CircularProduct.create(productDetails);
          break;
        case "Square":
          newProduct = await SquareProduct.create(productDetails);
          break;
        default:
          throw new Error(`Invalid product type: ${shape}`);
      }

      return newProduct.toObject(); // Convert to plain object for IPC response
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  });

  // Handle product deletion by ID
  ipcMain.handle("product:delete", async (_event, productId) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        throw new Error(`Product with ID ${productId} not found`);
      }
      return { message: "Product deleted successfully", product: deletedProduct.toObject() };
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  });

  // Handle fetching products by type
  ipcMain.handle("product:fetchByType", async (_event, shape) => {
    try {
      let products;
      switch (shape) {
        case "Rectangular":
          products = await RectangularProduct.find();
          break;
        case "Circular":
          products = await CircularProduct.find();
          break;
        case "Square":
          products = await SquareProduct.find();
          break;
        default:
          throw new Error(`Invalid product type: ${shape}`);
      }
  
      return products.map(product => ({
        ...product.toJSON(),
        shape, // Normalize shape to match frontend expectations
      }));
    } catch (error) {
      console.error(`Error fetching ${shape}s:`, error);
      throw error;
    }
  });

  // Handle fetching a product by ID
  ipcMain.handle("product:fetchById", async (_event, productId) => {
    try {
      if (!productId || typeof productId !== "string") {
        throw new Error(`Invalid productId: ${productId}`);
      }
  
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }
  
      return { ...product.toObject(), id: String(product.id) }; // Ensure ID is a string
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
  });
  // Update product handler
  ipcMain.handle("product:update", async (event, productId: string, updateData: any) => {
    try {
      console.log("Updating Product ID:", productId, "Type:", typeof productId);
  
      // Ensure `productId` is correctly formatted as ObjectId
      const objectId = new mongoose.Types.ObjectId(productId);
  
      const existingProduct = await Product.findById(objectId);
      if (!existingProduct) {
        throw new Error("Product not found.");
      }
  
      let updatedProduct;
      switch (existingProduct.shape) {
        case "Rectangular":
          updatedProduct = await RectangularProduct.findByIdAndUpdate(objectId, updateData, {
            new: true,
            runValidators: true,
          });
          break;
        case "Circular":
          updatedProduct = await CircularProduct.findByIdAndUpdate(objectId, updateData, {
            new: true,
            runValidators: true,
          });
          break;
        case "Square":
          updatedProduct = await SquareProduct.findByIdAndUpdate(objectId, updateData, {
            new: true,
            runValidators: true,
          });
          break;
        default:
          throw new Error("Unknown product shape.");
      }
  
      if (!updatedProduct) {
        throw new Error("Failed to update product.");
      }
  
      return updatedProduct.toJSON();
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  });
};
