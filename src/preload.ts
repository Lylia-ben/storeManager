import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // 📌 User Management
  createUser: (user: { name: string; password: string; role: string }) =>
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
    width?: number;
    height?: number;
    radius?: number;
    sideLength?: number;
  }) => ipcRenderer.invoke("product:create", productData),

  deleteProduct: (productId: string) =>
    ipcRenderer.invoke("product:delete", productId),

  fetchAllProducts: () => ipcRenderer.invoke("product:fetchAll"),

  fetchProductById: (productId: string) =>
    ipcRenderer.invoke("product:fetchById", productId),

  fetchProductsByType: (shape: "Rectangular" | "Circular" | "Square") =>
    ipcRenderer.invoke("product:fetchByType", shape),

  updateProduct: (productId: string, updateData: Partial<Record<string, any>>) =>
    ipcRenderer.invoke("product:update", productId, updateData), // ✅ Pass them separately

  // 📌 Customer Management
  createCustomer: (customerData: {
    name: string;
    address?: string;
    email?: string;
    phoneNumber: string;
  }) => ipcRenderer.invoke("customer:create", customerData),

  deleteCustomer: (customerId: string) =>
    ipcRenderer.invoke("customer:delete", customerId),

  fetchAllCustomers: () => ipcRenderer.invoke("customer:fetchAll"),

  fetchCustomerById: (customerId: string) =>
    ipcRenderer.invoke("customer:fetchById", customerId),

  updateCustomer: (customerId: string, updateData: Partial<Record<string, any>>) =>
    ipcRenderer.invoke("customer:update", { customerId, updateData }),

  toggleCustomerDebt: (customerId: string) =>
    ipcRenderer.invoke("customer:toggleDebt", customerId),

  // 📌 Order Management
  createOrder: (orderData: {
    customerId: string;
    products: { productId: string; quantity: number }[];
  }) => ipcRenderer.invoke("order:create", orderData),

  fetchAllOrders: () => ipcRenderer.invoke("order:fetchAll"),

  fetchOrderById: (orderId: string) =>
    ipcRenderer.invoke("order:fetchById", orderId),

  deleteOrder: (orderId: string) =>
    ipcRenderer.invoke("order:delete", orderId),

  updateOrder: (orderId: string, updateData: Partial<Record<string, any>>) =>
    ipcRenderer.invoke("order:update", { orderId, updateData }),

  fetchOrdersByCustomerId: (customerId: string) =>
    ipcRenderer.invoke("order:fetchByCustomerId", customerId),

  toggleOrderPaid: (orderId: string) =>
    ipcRenderer.invoke("order:togglePaid", orderId),
});
