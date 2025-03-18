import { ipcMain } from "electron";
import { Order } from "../../database/models/Order/Order";
import { Customer } from "../../database/models/Customer/Customer";
import { Product } from "../../database/models/Product/Product";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs

export const orderIpcHandlers = (): void => {
  // 📌 Create Order
  ipcMain.handle(
    "order:create",
    async (_event, orderData: { customerId: string; orderItems: { productName: string; shape: string; dimensions: string; quantity: number; unitPrice: number }[] }) => {
      const { customerId, orderItems } = orderData;

      try {
        console.log("🔹 Received order data:", orderData);

        // Validate customer ID
        if (!customerId) throw new Error("Customer ID is required");

        // Find customer
        const customer = await Customer.findById(customerId);
        if (!customer) return { success: false, message: "Customer not found" };

        let totalPrice = 0;
        const processedItems = [];

        for (const item of orderItems) {
          // Validate item fields
          if (
            !item.productName ||
            !item.shape ||
            !item.dimensions ||
            !item.quantity ||
            !item.unitPrice
          ) {
            throw new Error("Invalid order item structure");
          }

          // Compute total price for the item
          const itemTotal = item.unitPrice * item.quantity;
          totalPrice += itemTotal;

          processedItems.push({
            id: uuidv4(), // Generate a unique ID for each order item
            productName: item.productName,
            shape: item.shape,
            dimensions: item.dimensions,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: itemTotal,
          });
        }

        // Create order
        const newOrder = new Order({
          customer: customerId,
          orderItems: processedItems,
          totalPrice,
          status: "not paid",
        });

        const savedOrder = await newOrder.save();
        console.log(`✅ Order saved with ID: ${savedOrder.id}`);

        // Update customer
        customer.totalPrice += totalPrice;
        customer.status = "has debt";
        await customer.save();

        return { success: true, data: savedOrder.toJSON(), message: "Order created successfully" };
      } catch (error) {
        console.error("❌ Error creating order:", error);
        return { success: false, message: "Failed to create order", error };
      }
    }
  );

  // 📌 Fetch All Orders
  ipcMain.handle("order:fetchAll", async () => {
    try {
      const orders = await Order.find().populate("customer");

      return {
        success: true,
        data: orders.map((o) => ({
          ...o.toJSON(),
          id: o._id.toString(),
        })),
      };
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      return { success: false, message: "Failed to fetch orders", error };
    }
  });

  // 📌 Fetch Order by ID
  ipcMain.handle("order:fetchById", async (_event, orderId) => {
    try {
      const order = await Order.findById(orderId).populate("customer");
      if (!order) return { success: false, message: "Order not found" };

      return { success: true, data: { ...order.toJSON(), id: order._id.toString() } };
    } catch (error) {
      console.error("❌ Error fetching order:", error);
      return { success: false, message: "Failed to fetch order", error };
    }
  });

  // 📌 Delete Order
  ipcMain.handle("order:delete", async (_event, orderId) => {
    try {
      const order = await Order.findById(orderId);
      if (!order) return { success: false, message: "Order not found" };

      const customer = await Customer.findById(order.customer);
      if (customer) {
        customer.totalPrice -= order.totalPrice;
        customer.status = customer.totalPrice > 0 ? "has debt" : "no debt";
        await customer.save();
      }

      await Order.findByIdAndDelete(orderId);

      return { success: true, message: "Order deleted successfully" };
    } catch (error) {
      console.error("❌ Error deleting order:", error);
      return { success: false, message: "Failed to delete order", error };
    }
  });

  // 📌 Update Order
  ipcMain.handle("order:update", async (_event, orderId: string, orderItems: any[]) => {
    try {
      // Validate order ID
      if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
        throw new Error("Invalid or missing order ID");
      }

      // Validate orderItems
      if (!Array.isArray(orderItems)) {
        throw new Error("orderItems must be an array");
      }

      // Process orderItems to ensure they match the schema
      const processedOrderItems = orderItems.map((item) => {
        if (
          !item.id ||
          !item.productName ||
          !item.shape ||
          !item.dimensions ||
          !item.quantity ||
          !item.unitPrice ||
          !item.total
        ) {
          throw new Error("Invalid order item structure");
        }

        return {
          id: item.id, // Unique ID for each order item
          productName: item.productName, // Snapshot of product name at time of order
          shape: item.shape, // Shape of the product
          dimensions: item.dimensions, // Dimensions as a string
          quantity: item.quantity, // Quantity of the product
          unitPrice: item.unitPrice, // Unit price of the product
          total: item.total, // Total price for this item (quantity * unitPrice)
        };
      });

      // Update the order
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { orderItems: processedOrderItems },
        { new: true, runValidators: true }
      );

      if (!updatedOrder) {
        throw new Error("Order not found");
      }

      return { success: true, order: updatedOrder.toJSON() };
    } catch (error) {
      console.error("❌ Error updating order:", error);
      return { success: false, message: error.message };
    }
  });

  // 📌 Fetch Orders by Customer ID
  ipcMain.handle("order:fetchByCustomerId", async (_event, customerId) => {
    console.log("Received customer ID in backend:", customerId); // Debugging line
    try {
      if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
        throw new Error("Invalid or missing customer ID");
      }

      const orders = await Order.find({ customer: customerId });
      return {
        success: true,
        data: orders.map((order) => ({
          ...order.toJSON(),
          id: order._id.toString(),
        })),
      };
    } catch (error) {
      console.error("❌ Error fetching orders for customer:", error);
      return { success: false, message: "Failed to fetch orders for customer", error: error.message };
    }
  });

  // 📌 Toggle Order Paid Status
  ipcMain.handle("order:togglePaid", async (_, orderId: string) => {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error("Order not found");
      }

      // Toggle status
      order.status = order.status === "paid" ? "not paid" : "paid";
      await order.save();

      return { success: true, status: order.status };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  });

  // 📌 Delete Order Item
  ipcMain.handle("order:deleteOrderItem", async (_event, { orderId, itemId }) => {
    try {
      const order = await Order.findById(orderId);
      if (!order) return { success: false, message: "Order not found" };

      // Filter out the deleted item
      const updatedOrderItems = order.orderItems.filter((item) => item.id !== itemId);

      // Recalculate total price
      const totalPrice = updatedOrderItems.reduce((sum, item) => sum + item.total, 0);

      // Save the updated order
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { orderItems: updatedOrderItems, totalPrice },
        { new: true, runValidators: true }
      ).populate("customer");

      if (!updatedOrder) return { success: false, message: "Failed to update order" };

      return { success: true, data: updatedOrder.toJSON(), message: "Order item deleted successfully" };
    } catch (error) {
      console.error("❌ Error deleting order item:", error);
      return { success: false, message: "Failed to delete order item", error };
    }
  });
};