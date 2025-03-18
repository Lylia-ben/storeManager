declare global {
  interface Window {
    electronAPI: {
      // 🔹 User Handlers
      createUser: (user: { name: string; password: string; role: string }) => Promise<any>;
      authenticateUser: (credentials: { name: string; password: string }) => Promise<any>;

      // 🔹 Product Handlers
      createProduct: (product: ProductInput) => Promise<Product>;
      deleteProduct: (productId: string) => Promise<ApiResponse>;
      fetchAllProducts: () => Promise<Product[]>;
      fetchProductsByType: (shape: ProductShape) => Promise<Product[]>;
      fetchProductById: (productId: string) => Promise<Product | null>;
      updateProduct: (productId: string, updateData: Partial<Product>) => Promise<ApiResponse>;

      // 🔹 Customer Handlers
      createCustomer: (customer: CustomerInput) => Promise<Customer>;
      deleteCustomer: (customerId: string) => Promise<ApiResponse>;
      fetchAllCustomers: () => Promise<Customer[]>;
      fetchCustomerById: (customerId: string) => Promise<Customer | null>;
      updateCustomer: (customerId: string, updateData: Partial<Customer>) => Promise<ApiResponse>;
      toggleCustomerDebt: (customerId: string) => Promise<ApiResponse & { status: "has debt" | "no debt" }>;

      // 🔹 Order Handlers
      createOrder: (orderData: OrderInput) => Promise<ApiResponse & { data?: Order }>;
      deleteOrder: (orderId: string) => Promise<ApiResponse>;
      fetchAllOrders: () => Promise<ApiResponse & { data: Order[] }>;
      fetchOrderById: (orderId: string) => Promise<ApiResponse & { data?: Order }>;
      updateOrder: (
        orderId: string,
        orderItems: any[]
      ) => Promise<ApiResponse & { data?: Order }>;
      fetchOrdersByCustomerId: (customerId: string) => Promise<ApiResponse & { data?: Order[] }>;
      toggleOrderPaid: (orderId: string) => Promise<ApiResponse & { status: "not paid" | "paid" }>;

      // 🔹 Order Item Handlers
      deleteOrderItem: (payload: { orderId: string; itemId: string }) => Promise<ApiResponse & { data?: Order }>;
    };
  }

  // 🔹 Common Types
  type ProductShape = "Square" | "Circular" | "Rectangular";

  interface ApiResponse {
    success: boolean;
    message: string;
  }

  // 🔹 Product Types
  interface ProductInput {
    name: string;
    quantity: number;
    cost: number;
    unitPrice: number;
    shape: ProductShape;
    radius?: number;
    width?: number;
    height?: number;
    sideLength?: number;
  }

  interface Product extends ProductInput {
    id: string;
    createdAt: Date | string;
    updatedAt: Date | string;
  }

  // 🔹 Customer Types
  interface CustomerInput {
    name: string;
    address?: string;
    email?: string;
    phoneNumber: string;
  }

  interface Customer extends CustomerInput {
    id: string;
    totalPrice: number;
    status: "no debt" | "has debt";
    createdAt: Date | string;
    updatedAt: Date | string;
  }

  // 🔹 Order Types
  interface OrderInput {
    customerId: string;
    orderItems: {
      productName: string; // ✅ Added `productName`
      shape: ProductShape; // ✅ Added `shape`
      dimensions: string; // ✅ Added `dimensions`
      quantity: number;
      unitPrice: number; // ✅ Added `unitPrice`
    }[];
  }

  interface Order {
    id: string;
    customer: string;
    orderItems: {
      id: string; // Unique ID for each order item
      productName: string; // ✅ Added `productName`
      shape: ProductShape; // ✅ Added `shape`
      dimensions: string; // ✅ Added `dimensions`
      quantity: number;
      unitPrice: number; // ✅ Added `unitPrice`
      total: number; // ✅ Added `total`
    }[];
    totalPrice: number;
    status: "not paid" | "paid";
    createdAt: Date | string;
    updatedAt: Date | string;
  }
}

export {};