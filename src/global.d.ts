declare global {
  interface Window {
    electronAPI: {
      // Existing user handlers
      createUser: (user: { name: string; password: string }) => Promise<any>;
      authenticateUser: (credentials: { name: string; password: string }) => Promise<any>;

      // New product handlers
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
      }) => Promise<any>;

      deleteProduct: (productId: string) => Promise<any>;

      fetchProductsByType: (shape: "Square" | "Circular" | "Rectangular") => Promise<Product[]>;

      fetchProductById: (productId: string) => Promise<Product>; // ✅ Added

      // New customer handlers
      createCustomer: (customer: {
        name: string;
        address: string;
        email: string;
        phoneNumber: string;
      }) => Promise<any>;

      deleteCustomer: (customerId: string) => Promise<any>;

      fetchAllCustomers: () => Promise<Customer[]>;

      fetchCustomerById: (customerId: string) => Promise<Customer>;

      // New order handlers
      createOrder: (orderData: { customerId: string; products: { productId: string; quantity: number }[] }) => Promise<Order>;

      deleteOrder: (orderId: string) => Promise<{ message: string; order: Order }>;

      fetchAllOrders: () => Promise<Order[]>;

      fetchOrderById: (orderId: string) => Promise<Order>;

      updateOrder: (orderId: string, updateData: { products?: { productId: string; quantity: number }[] }) => Promise<Order>;

      markOrderPaid: (orderId: string) => Promise<{ message: string }>;
    };
  }

  // Product type
  interface Product {
    id: string;
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

  // Customer type
  interface Customer {
    _id: string; // MongoDB default
    id?: string; // Optional in case you need it elsewhere
    name: string;
    address: string;
    email: string;
    phoneNumber: string;
    orders: string[];
    totalPrice: number;
    status: "no debt" | "has debt";
  }
  

  // Order type
  interface Order {
    id: string;
    customer: string; // Customer ID
    products: { productId: string; quantity: number }[]; // Array of products in the order
    total: number; // Total cost of the order
    status: "not paid" | "paid"; // Order status
    createdAt: string; // Timestamp of when the order was created
    updatedAt: string; // Timestamp of when the order was last updated
  }
}

export {};
