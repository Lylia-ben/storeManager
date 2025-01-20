import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // Existing methods for user management
  createUser: (user: { name: string; password: string }) =>
    ipcRenderer.invoke("user:create", user),

  authenticateUser: (credentials: { name: string; password: string }) =>
    ipcRenderer.invoke("user:auth", credentials),

  // Existing methods for product management
  createProduct: (productData: {
    shape: "Rectangular" | "Circular" | "Square";
    name: string;
    quantity: number;
    cost: number;
    unitPrice: number;
    width?: number; // For RectangularProduct
    height?: number; // For RectangularProduct
    radius?: number; // For CircularProduct
    sideLength?: number; // For SquareProduct
  }) => ipcRenderer.invoke("product:create", productData),

  deleteProduct: (productId: string) =>
    ipcRenderer.invoke("product:delete", productId),

  fetchProductsByType: (
    shape: "Rectangular" | "Circular" | "Square"
  ) => ipcRenderer.invoke("product:fetchByType", shape),

  // New methods for customer management
  createCustomer: (customerData: {
    name: string;
    address: string;
    email: string;
    phoneNumber: string;
  }) => ipcRenderer.invoke("customer:create", customerData),

  deleteCustomer: (customerId: string) =>
    ipcRenderer.invoke("customer:delete", customerId),

  fetchAllCustomers: () => ipcRenderer.invoke("customer:fetchAll"),

  fetchCustomerById: (customerId: string) =>
    ipcRenderer.invoke("customer:fetchById", customerId),
  // Orders Operations
  createOrder: (orderData: { products: { productId: string; orderQuantity: number }[] }) =>
    ipcRenderer.invoke("order:create", orderData),

  // Fetch all orders
  fetchAllOrders: () => ipcRenderer.invoke("order:fetchAll"),

  // Fetch a specific order by ID
  fetchOrderById: (orderId: string) => ipcRenderer.invoke("order:fetchById", orderId),

  // Delete an order by ID
  deleteOrder: (orderId: string) => ipcRenderer.invoke("order:delete", orderId),
});
