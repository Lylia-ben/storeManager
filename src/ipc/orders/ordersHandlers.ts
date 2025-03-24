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
    async (_event, orderData) => {
      try {
        console.log("🔹 Received order data:", JSON.stringify(orderData, null, 2)); // Log the incoming data
  
        // Validate customer ID
        if (!orderData.customerId) throw new Error("Customer ID is required");
  
        // Find customer
        const customer = await Customer.findById(orderData.customerId);
        if (!customer) return { success: false, message: "Customer not found" };
  
        let totalPrice = 0;
        const processedItems = [];
  
        for (const item of orderData.orderItems) {
          // Validate item fields
          if (!item.productId || !item.customerQuantity) {
            throw new Error("Invalid order item structure");
          }
  
          // Find the product
          const product = await Product.findById(item.productId);
          if (!product) throw new Error(`Product with ID ${item.productId} not found`);
  
          // Check if there's enough quantity
          if (product.quantity < item.customerQuantity) {
            throw new Error(`Not enough quantity for product ${product.name}`);
          }
  
          // Subtract customerQuantity from product quantity
          product.quantity -= item.customerQuantity;
          await product.save();
  
          // Compute total price for the item
          const itemTotal = product.unitPrice * item.customerQuantity;
          totalPrice += itemTotal;
  
          processedItems.push({
            ...item, // Include all fields from the frontend
            id: uuidv4(), // Generate a unique ID for each order item
            productId: product.id, // Store the product ID
            productName: product.name, // Snapshot of product name at time of order
            dimensions: product.shape === "Rectangular"
              ? `${product.width}x${product.height}`
              : product.shape === "Square"
              ? `${product.sideLength}x${product.sideLength}`
              : `${product.radius}`, // Dimensions as a string
            total: itemTotal, // Total price for this item (customerQuantity * unitPrice)
          });
        }
  
        // Create order
        const newOrder = new Order({
          customerId: orderData.customerId, // Ensure this matches the schema
          orderItems: processedItems,
          total: totalPrice,
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
        data: orders.map((order) => ({
          ...order.toJSON(),
          id: order._id.toString(), // Ensure `id` is a string
        })),
      };
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      return { success: false, message: "Failed to fetch orders", error };
    }
  });

  // 📌 Fetch Order by ID
  ipcMain.handle("order:fetchById", async (_event, orderId: string) => {
    try {
      console.log("🔍 Fetching order with ID:", orderId);
  
      if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
        console.error("❌ Invalid or missing order ID:", orderId);
        throw new Error("Invalid or missing order ID");
      }
  
      // Fetch the order without populating 'customer'
      const order = await Order.findById(orderId);
  
      if (!order) {
        console.warn("⚠️ Order not found for ID:", orderId);
        return { success: false, message: "Order not found" };
      }
  
      console.log("✅ Order fetched:", order);
  
      return {
        success: true,
        data: {
          ...order.toJSON(),
          id: order._id.toString(), // Ensure `id` is a string
        },
      };
    } catch (error) {
      console.error("❌ Error fetching order:", error);
      return { success: false, message: "Failed to fetch order", error: error.message };
    }
  });
  
  

  // 📌 Fetch Orders by Customer ID
  ipcMain.handle("order:fetchByCustomerId", async (_event, customerId: string) => {
    try {
      if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
        throw new Error("Invalid or missing customer ID");
      }

      console.log("🔹 Fetching orders for customerId:", customerId); // Debugging

      const orders = await Order.find({ customerId }).populate("customerId");

      console.log("✅ Orders found:", orders.length); // Debugging

      return {
        success: true,
        data: orders.map((order) => ({
          ...order.toJSON(),
          id: order._id.toString(),
        })),
      };
    } catch (error) {
      console.error("❌ Error fetching orders for customer:", error);
      return { success: false, message: "Failed to fetch orders for customer", error };
    }
  });

  // 🛑 Delete Order by ID
  ipcMain.handle("order:delete", async (_event, orderId: string) => {
    try {
      const deletedOrder = await Order.findByIdAndDelete(orderId);
      
      if (!deletedOrder) {
        return { success: false, message: "Order not found" };
      }
  
      return { success: true, message: "Order deleted successfully" };
    } catch (error) {
      console.error("Error deleting order:", error);
      return { success: false, message: "Failed to delete order" };
    }
  });
  

  // 📌 Toggle Order Paid Status
  ipcMain.handle("order:toggleStatus", async (_event, orderId: string) => {
    try {
      if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
        throw new Error("Invalid or missing order ID");
      }

      const order = await Order.findById(orderId);
      if (!order) return { success: false, message: "Order not found" };

      // Toggle status
      order.status = order.status === "paid" ? "not paid" : "paid";
      await order.save();

      return { success: true, data: order.toJSON(), message: "Order status toggled successfully" };
    } catch (error) {
      console.error("❌ Error toggling order status:", error);
      return { success: false, message: "Failed to toggle order status", error };
    }
  });
 
  // 📌 Update order 
  ipcMain.handle(
    "order:update-order",
    async (_event, { orderId, updatedOrderItems }: { orderId: string; updatedOrderItems: OrderItem[] }) => {
      try {
        const order = await Order.findById(orderId);
        if (!order) {
          return { success: false, message: "Order not found" };
        }

        // Process updates and product quantity changes
        const existingItemsMap = new Map(order.orderItems.map(item => [item.id, item]));

        for (const updatedItem of updatedOrderItems) {
          const existingItem = existingItemsMap.get(updatedItem.id);
          
          if (existingItem) {
            const quantityDiff = updatedItem.customerQuantity - existingItem.customerQuantity;
            if (quantityDiff !== 0) {
              const product = await Product.findById(updatedItem.productId);
              if (product) {
                product.quantity -= quantityDiff;
                await product.save();
              }
            }
          } else {
            const product = await Product.findById(updatedItem.productId);
            if (product) {
              product.quantity -= updatedItem.customerQuantity;
              await product.save();
            }
          }
        }

        // Handle removed items
        const updatedItemIds = new Set(updatedOrderItems.map(item => item.id));
        for (const existingItem of order.orderItems) {
          if (!updatedItemIds.has(existingItem.id)) {
            const product = await Product.findById(existingItem.productId);
            if (product) {
              product.quantity += existingItem.customerQuantity;
              await product.save();
            }
          }
        }

        // Update order
        order.orderItems = updatedOrderItems;
        order.total = updatedOrderItems.reduce(
          (sum, item) => sum + (item.unitPrice * item.customerQuantity),
          0
        );

        const savedOrder = await order.save();
        return {
          success: true,
          data: savedOrder.toJSON(),
          message: "Order updated successfully"
        };
      } catch (error) {
        console.error("Update order error:", error);
        return {
          success: false,
          message: "Failed to update order",
          error: error.message
        };
      }
    }
  );

  // 🛑 Delete Order Item by Order ID & Item ID
  ipcMain.handle("order:item:delete", async (_event, orderId: string, itemId: string) => {
    try {
      const order = await Order.findById(orderId);
      
      if (!order) {
        return { success: false, message: "Order not found" };
      }

      // Filter out the item to be deleted
      const updatedItems = order.orderItems.filter(item => item.id !== itemId);

      if (updatedItems.length === order.orderItems.length) {
        return { success: false, message: "Order item not found" };
      }

      // Update order items and recalculate total
      order.orderItems = updatedItems;
      order.total = updatedItems.reduce((sum, item) => sum + item.totalAmount, 0);

      await order.save();

      return { success: true, message: "Order item deleted successfully" };
    } catch (error) {
      console.error("Error deleting order item:", error);
      return { success: false, message: "Failed to delete order item" };
    }
  });
};