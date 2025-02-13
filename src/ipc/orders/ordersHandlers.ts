import { ipcMain } from "electron";
import { Order } from "../../database/models/Order/Order";
import { Customer } from "../../database/models/Customer/Customer";
import { Product } from "../../database/models/Product/Product";

export const orderIpcHandlers = (): void => {
  // 📌 Create Order
  ipcMain.handle(
    "order:create",
    async (_event, orderData: { customerId: string; products: { productId: string; quantity: number }[] }) => {
      const { customerId, products } = orderData;
  
      try {
        console.log("🔹 Received order data:", orderData);
  
        // Validate customer ID
        if (typeof customerId !== "string") {
          throw new Error("Invalid customerId: Must be a string");
        }
  
        // Find the customer
        const customer = await Customer.findById(customerId);
        if (!customer) {
          console.error(`❌ Customer with ID ${customerId} not found`);
          return { success: false, message: `Customer with ID ${customerId} not found` };
        }
  
        let total = 0;
        const validProducts = [];
  
        for (const item of products) {
          if (typeof item.productId !== "string") {
            throw new Error("Invalid productId: Must be a string");
          }
  
          // Find the product
          const product = await Product.findById(item.productId);
          if (!product) {
            console.error(`❌ Product with ID ${item.productId} not found`);
            return { success: false, message: `Product with ID ${item.productId} not found` };
          }
  
          // Check if enough stock is available
          if (product.quantity < item.quantity) {
            console.error(`❌ Not enough stock for product ${product.name}`);
            return { success: false, message: `Not enough stock for ${product.name}` };
          }
  
          // Reduce stock
          product.quantity -= item.quantity;
          await product.save();
  
          // Calculate total price
          total += product.unitPrice * item.quantity;
  
          validProducts.push({
            productId: product._id,
            quantity: item.quantity,
            unitPrice: product.unitPrice, // Ensuring correct pricing
          });
        }
  
        // Create the order
        const newOrder = new Order({
          customer: customerId,
          products: validProducts,
          total,
          status: "not paid",
        });
  
        const savedOrder = await newOrder.save();
        console.log(`✅ Order successfully saved with ID: ${savedOrder._id}`);
  
        // Update customer orders & debt status
        customer.orders.push(savedOrder.id);
        customer.totalPrice += total;
        customer.status = "has debt";
  
        await customer.save();
        console.log(`✅ Customer updated: ${customerId}, Order added: ${savedOrder._id}`);
  
        return { success: true, data: savedOrder.toJSON(), message: "Order created successfully" };
      } catch (error) {
        console.error("❌ Error creating order:", error);
        return { success: false, message: "Failed to create order", error };
      }
    }
  );
  
  
  

  // 📌 Delete Order
  ipcMain.handle("order:delete", async (_event, orderId) => {
    try {
      const order = await Order.findById(orderId);
      if (!order) return { success: false, message: "Order not found" };

      const customer = await Customer.findById(order.customer);
      if (customer) {
        customer.orders = customer.orders.filter((id) => id.toString() !== orderId);
        customer.totalPrice -= order.total;
        customer.status = customer.totalPrice > 0 ? "has debt" : "no debt";
        await customer.save();
      }

      await Order.findByIdAndDelete(orderId);

      return { success: true, message: "Order deleted successfully" };
    } catch (error) {
      console.error("Error deleting order:", error);
      return { success: false, message: "Failed to delete order", error };
    }
  });

  // 📌 Fetch All Orders
  ipcMain.handle("order:fetchAll", async () => {
    try {
      const orders = await Order.find().populate("customer").populate("products.productId");

      return {
        success: true,
        data: orders.map((o) => ({
          ...o.toJSON(),
          id: o._id.toString(), // Convert _id to string
        })),
      };
    } catch (error) {
      console.error("Error fetching orders:", error);
      return { success: false, message: "Failed to fetch orders", error };
    }
  });

  // 📌 Fetch Order by ID
  ipcMain.handle("order:fetchById", async (_event, orderId) => {
    try {
      const order = await Order.findById(orderId).populate("customer").populate("products.productId");
      if (!order) return { success: false, message: "Order not found" };

      return { success: true, data: { ...order.toJSON(), id: order._id.toString() } };
    } catch (error) {
      console.error("Error fetching order:", error);
      return { success: false, message: "Failed to fetch order", error };
    }
  });

  // 📌 Update Order (Modify products & recalculate total)
  ipcMain.handle("order:update", async (_event, { orderId, updateData }) => {
    try {
      let newTotal = 0;

      if (updateData.products) {
        for (const item of updateData.products) {
          const product = await Product.findById(item.productId);
          if (!product) throw new Error(`Product with ID ${item.productId} not found`);
          newTotal += product.unitPrice * item.quantity;
        }
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { ...updateData, total: newTotal },
        { new: true, runValidators: true }
      );

      if (!updatedOrder) return { success: false, message: "Order not found" };

      // Update customer's totalPrice
      const customer = await Customer.findById(updatedOrder.customer);
      if (customer) {
        const unpaidOrders = await Order.find({ customer: customer._id, status: "not paid" });
        customer.totalPrice = unpaidOrders.reduce((sum, order) => sum + order.total, 0);
        customer.status = customer.totalPrice > 0 ? "has debt" : "no debt";
        await customer.save();
      }

      return { success: true, data: { ...updatedOrder.toJSON(), id: updatedOrder._id.toString() }, message: "Order updated successfully" };
    } catch (error) {
      console.error("Error updating order:", error);
      return { success: false, message: "Failed to update order", error };
    }
  });

  // 📌 Mark Order as Paid
  ipcMain.handle("order:markPaid", async (_event, orderId) => {
    try {
      const order = await Order.findById(orderId);
      if (!order) return { success: false, message: "Order not found" };

      order.status = "paid";
      await order.save();

      // Update customer's debt status
      const customer = await Customer.findById(order.customer);
      if (customer) {
        const unpaidOrders = await Order.find({ customer: customer._id, status: "not paid" });
        customer.totalPrice = unpaidOrders.reduce((sum, order) => sum + order.total, 0);
        customer.status = customer.totalPrice > 0 ? "has debt" : "no debt";
        await customer.save();
      }

      return { success: true, message: "Order marked as paid" };
    } catch (error) {
      console.error("Error marking order as paid:", error);
      return { success: false, message: "Failed to mark order as paid", error };
    }
  });
};
