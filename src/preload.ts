import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // 📌 User Management
  createUser: (user: { name: string; password: string }) =>
    ipcRenderer.invoke("user:create", user),

  authenticateUser: (credentials: { name: string; password: string }) =>
    ipcRenderer.invoke("user:auth", credentials),

  // 📌 Product Management
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

  fetchAllProducts: () => ipcRenderer.invoke("product:fetchAll"), // ✅ Added

  fetchProductById: (productId: string) =>
    ipcRenderer.invoke("product:fetchById", productId), // ✅ Added

  fetchProductsByType: (shape: "Rectangular" | "Circular" | "Square") =>
    ipcRenderer.invoke("product:fetchByType", shape),

  updateProduct: (productId: string, updateData: any) =>
    ipcRenderer.invoke("product:update", { productId, updateData }), // ✅ Added

  // 📌 Customer Management
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

  updateCustomer: (customerId: string, updateData: any) =>
    ipcRenderer.invoke("customer:update", { customerId, updateData }), // ✅ Added

  // 📌 Orders Management
  createOrder: (orderData: {
    customerId: string;
    products: { productId: string; orderQuantity: number }[];
  }) => ipcRenderer.invoke("order:create", orderData),

  fetchAllOrders: () => ipcRenderer.invoke("order:fetchAll"),

  fetchOrderById: (orderId: string) => ipcRenderer.invoke("order:fetchById", orderId),

  deleteOrder: (orderId: string) => ipcRenderer.invoke("order:delete", orderId),

  updateOrder: (orderId: string, updateData: any) =>
    ipcRenderer.invoke("order:update", { orderId, updateData }), // ✅ Added
});
