import { ipcMain } from "electron";
import { Customer } from "../../database/models/Customer/Customer";

export const customerIpcHandlers = (): void => {
  // 📌 Create a new customer
  ipcMain.handle("customer:create", async (_event, customerData) => {
    const { name, address, email, phoneNumber } = customerData;

    try {
      const newCustomer = await Customer.create({
        name,
        address,
        email,
        phoneNumber,
        orders: [],
        totalPrice: 0, // Corrected field name
        status: "no debt",
      });

      return {
        success: true,
        data: newCustomer.toJSON(),
        message: "Customer created successfully",
      };
    } catch (error) {
      console.error("Error creating customer:", error);
      return { success: false, message: "Failed to create customer", error };
    }
  });

  // 📌 Delete a customer by ID
  ipcMain.handle("customer:delete", async (_event, customerId) => {
    try {
      const deletedCustomer = await Customer.findByIdAndDelete(customerId);
      if (!deletedCustomer) {
        return { success: false, message: `Customer with ID ${customerId} not found` };
      }

      return {
        success: true,
        data: deletedCustomer.toJSON(),
        message: "Customer deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting customer:", error);
      return { success: false, message: "Failed to delete customer", error };
    }
  });

  // 📌 Fetch all customers
  ipcMain.handle("customer:fetchAll", async () => {
    try {
      const customers = await Customer.find();
      return customers.map((c) => c.toJSON()); // 👈 Directly returning an array of customers
    } catch (error) {
      console.error("Error fetching customers:", error);
      return []; // 👈 Return empty array if error occurs
    }
  });

  // 📌 Fetch a single customer by ID
  ipcMain.handle("customer:fetchById", async (_event, customerId) => {
    try {
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return { success: false, message: `Customer with ID ${customerId} not found` };
      }

      return {
        success: true,
        data: {
          ...customer.toJSON(),
          id: customer._id.toString(),
        },
      };
    } catch (error) {
      console.error("Error fetching customer:", error);
      return { success: false, message: "Failed to fetch customer", error };
    }
  });

  // 📌 Update a customer's details
  ipcMain.handle("customer:update", async (_event, { customerId, updateData }) => {
    try {
      const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updateData, {
        new: true, // Return updated document
        runValidators: true, // Ensure validations apply
      });

      if (!updatedCustomer) {
        return { success: false, message: `Customer with ID ${customerId} not found` };
      }

      return {
        success: true,
        data: {
          ...updatedCustomer.toJSON(),
          id: updatedCustomer._id.toString(),
        },
        message: "Customer updated successfully",
      };
    } catch (error) {
      console.error("Error updating customer:", error);
      return { success: false, message: "Failed to update customer", error };
    }
  });
};
