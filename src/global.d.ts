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
        updatedOrderItems: OrderItem[]
      ) => Promise<ApiResponse & { data?: Order }>;
      fetchOrdersByCustomerId: (customerId: string) => Promise<ApiResponse & { data?: Order[] }>;
      toggleOrderStatus: (orderId: string) => Promise<ApiResponse & { status: "not paid" | "paid"; data?: Order }>;

      // 🔹 Order Item Handlers
      deleteOrderItem: (orderId: string, itemId: string) => Promise<ApiResponse & { data?: Order }>;

    };
  }

  // 🔹 Common Types
  type ProductShape = "Rectangular" | "Square" | "Circular";

  interface ApiResponse {
    success: boolean;
    message: string;
    error?: any; // Optional error field for error handling
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
    orderItems: OrderItem[];
  }

  interface Order {
    id: string;
    customerId: string;
    orderItems: OrderItem[];
    total: number;
    status: "paid" | "not paid";
    createdAt: string | Date;
    updatedAt: string | Date;
  }
  interface OrderItem {
    id: string;
    productId: string;
    name: string;
    quantity: number;
    shape: "Rectangular" | "Square" | "Circular";
    width?: number;
    height?: number;
    sideLength?: number;
    radius?: number;
    customerQuantity: number;
    unitPrice: number;
    cost: number;
    totalAmount: number;
  }
  // Define the type for Excel row data
  type ExcelRow = {
    'Product Name': string;
    'Shape': "Rectangular" | "Square" | "Circular";
    'Dimensions': string;
    'Quantity': number;
    'Unit Price': string;
    'Total': string;
  } | {
    'Product Name': string;
    'Shape': '';
    'Dimensions': '';
    'Quantity': '';
    'Unit Price': '';
    'Total': string;
  };
}

export {};
