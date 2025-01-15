import { ipcMain } from 'electron';
import { Customer } from '../../database/models/Customer/Customer';

export const customerIpcHandlers = (): void => {
  // Handle customer creation with minimal data
  ipcMain.handle("customer:create", async (_event, customerData) => {
    const { name, address, email, phoneNumber } = customerData;

    try {
      // Create a new customer with the provided data
      const newCustomer = await Customer.create({
        name,
        address,
        email,
        phoneNumber,
        orders: [], // Initialize with no orders
        total: 0, // Initial total is 0
        status: 'no debt', // Initial status is 'no debt'
      });

      return newCustomer.toJSON(); // Convert to plain object for IPC response
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  });

  // Handle customer deletion by ID
  ipcMain.handle("customer:delete", async (_event, customerId) => {
    try {
      const deletedCustomer = await Customer.findByIdAndDelete(customerId);
      if (!deletedCustomer) {
        throw new Error(`Customer with ID ${customerId} not found`);
      }

      return { message: "Customer deleted successfully", customer: deletedCustomer.toJSON() };
    } catch (error) {
      console.error("Error deleting customer:", error);
      throw error;
    }
  });

  // Handle fetching all customers
  ipcMain.handle("customer:fetchAll", async () => {
    try {
      const customers = await Customer.find();
      return customers.map(customer => customer.toJSON()); // Convert to plain objects for IPC
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  });

  // Handle fetching a single customer by ID
  ipcMain.handle("customer:fetchById", async (_event, customerId) => {
    try {
      const customer = await Customer.findById(customerId);
      if (!customer) {
        throw new Error(`Customer with ID ${customerId} not found`);
      }

      return customer.toJSON(); // Convert to plain object for IPC
    } catch (error) {
      console.error("Error fetching customer:", error);
      throw error;
    }
  });
};
