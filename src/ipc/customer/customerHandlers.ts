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

  // Fetch a customer by ID
  ipcMain.handle("customer:fetchById", async (_event, customerId) => {
    try {
      const customer = await Customer.findById(customerId);
      return customer ? customer.toJSON() : null;
    } catch (error) {
      console.error("Error fetching customer:", error);
      return null;
    }
  });

  // Update customer details
  ipcMain.handle("customer:update", async (_event, customerId, updateData) => {
    try {
      const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedCustomer) {
        return { success: false, message: `Customer with ID ${customerId} not found` };
      }

      return {
        success: true,
        data: { ...updatedCustomer.toJSON(), id: updatedCustomer._id.toString() },
        message: "Customer updated successfully",
      };
    } catch (error) {
      console.error("Error updating customer:", error);
      return { success: false, message: "Failed to update customer", error };
    }
  });


  
  // 📌 Toggle Status has debt / no debt 
  ipcMain.handle("customer:toggleDebt", async (_event, customerId) => {
    console.log(`🔹 Received customer:toggleDebt for customerId: ${customerId}`);

    try {
      const customer = await Customer.findById(customerId);
      if (!customer) return { success: false, message: "Customer not found" };

      // Toggle status
      customer.status = customer.status === "has debt" ? "no debt" : "has debt";
      await customer.save();

      return {
        success: true,
        message: `Customer marked as ${customer.status}`,
        status: customer.status,
      };
    } catch (error) {
      console.error("❌ Error toggling customer debt status:", error);
      return { success: false, message: "Failed to toggle debt status", error };
    }
  });
};