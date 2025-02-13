import { ipcMain } from 'electron';
import { Product, RectangularProduct, CircularProduct, SquareProduct } from '../../database/models/Product/Product';

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
  
      return { ...product.toObject(), id: String(product._id) }; // Ensure ID is a string
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
  });
  
};
