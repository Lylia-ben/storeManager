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
    };
  }
}

export {};
