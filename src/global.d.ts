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
        shape: string;
        radius?: number;
        width?: number;
        height?: number;
        sideLength?: number;
      }) => Promise<any>;

      deleteProduct: (productId: string) => Promise<any>;

      fetchProductsByType: (shape: "Square" | "Circular" | "Rectangular") => Promise<Product[]>;

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
      createOrder: (orderData: { products: { productId: string; orderQuantity: number }[] }) => Promise<Order>;

      fetchAllOrders: () => Promise<Order[]>;

      fetchOrderById: (orderId: string) => Promise<Order>;

      deleteOrder: (orderId: string) => Promise<{ message: string; order: Order }>;
    };
  }
}

// Add necessary type definitions for Order and Product if not already defined elsewhere.
interface Order {
  id: string;
  totalPrice: number;
  status: "payed" | "notpayed";
  products: { productId: string; orderQuantity: number }[];
}

interface Product {
  id: string;
  name: string;
  quantity: number;
  cost: number;
  unitPrice: number;
  shape: "Square" | "Circular" | "Rectangular";
  // Additional product-specific fields
  radius?: number;
  width?: number;
  height?: number;
  sideLength?: number;
}

export {};
