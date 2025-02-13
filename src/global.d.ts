declare global {
  interface Window {
    electronAPI: {
      // 🔹 User Handlers
      createUser: (user: { name: string; password: string }) => Promise<any>;
      authenticateUser: (credentials: { name: string; password: string }) => Promise<any>;

      // 🔹 Product Handlers
      createProduct: (product: {
        name: string;
        quantity: number;
        cost: number;
        unitPrice: number;
        shape: "Square" | "Circular" | "Rectangular";
        radius?: number;
        width?: number;
        height?: number;
        sideLength?: number;
      }) => Promise<Product>;

      deleteProduct: (productId: string) => Promise<{ success: boolean; message: string }>;

      fetchProductsByType: (shape: "Square" | "Circular" | "Rectangular") => Promise<Product[]>;

      fetchProductById: (productId: string) => Promise<Product | null>;

      // 🔹 Customer Handlers
      createCustomer: (customer: {
        name: string;
        address: string;
        email: string;
        phoneNumber: string;
      }) => Promise<Customer>;

      deleteCustomer: (customerId: string) => Promise<{ success: boolean; message: string }>;

      fetchAllCustomers: () => Promise<Customer[]>;

      fetchCustomerById: (customerId: string) => Promise<Customer | null>;

      // 🔹 Order Handlers
      createOrder: (orderData: {
        customerId: string;
        products: { productId: string; quantity: number }[];
      }) => Promise<{ success: boolean; data?: Order; message: string }>;

      deleteOrder: (orderId: string) => Promise<{ success: boolean; message: string }>;

      fetchAllOrders: () => Promise<{ success: boolean; data: Order[] }>;

      fetchOrderById: (orderId: string) => Promise<{ success: boolean; data?: Order }>;

      updateOrder: (orderId: string, updateData: { products?: { productId: string; quantity: number }[] }) => Promise<{ success: boolean; data?: Order; message: string }>;

      markOrderPaid: (orderId: string) => Promise<{ success: boolean; message: string }>;
    };
  }

  // 🔹 Product Type
  interface Product {
    _id: string; // MongoDB default ID
    id?: string; // Alias for frontend use
    name: string;
    quantity: number;
    cost: number;
    unitPrice: number;
    shape: "Square" | "Circular" | "Rectangular";
    radius?: number;
    width?: number;
    height?: number;
    sideLength?: number;
  }

  // 🔹 Customer Type
  interface Customer {
    _id: string;
    id?: string;
    name: string;
    address: string;
    email: string;
    phoneNumber: string;
    orders: string[]; // List of order IDs
    totalPrice: number;
    status: "no debt" | "has debt";
  }

  // 🔹 Order Type
  interface Order {
    _id: string;
    id?: string;
    customer: string; // Customer ID
    products: { productId: string; quantity: number; unitPrice: number }[]; // Include unit price
    total: number; // Total cost of the order
    status: "not paid" | "paid";
    createdAt: Date | string; // Ensure compatibility with MongoDB
    updatedAt: Date | string;
  }
}

export {};
