import { ipcMain } from "electron";
import { Order } from "../../database/models/Order/Order";
import { Customer } from "../../database/models/Customer/Customer";
import { Product } from "../../database/models/Product/Product";

export const orderIpcHandlers = (): void => {
  // 📌 Create Order
  ipcMain.handle(
    "order:create",
    async (_event, orderData: { customerId: string; orderItems: { productId: string; quantity: number }[] }) => {
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
          // Find product
          const product = await Product.findById(item.productId);
          if (!product) return { success: false, message: `Product ${item.productId} not found` };

          // Check stock
          if (product.quantity < item.quantity) {
            return { success: false, message: `Insufficient stock for ${product.name}` };
          }

          // Reduce stock
          product.quantity -= item.quantity;
          await product.save();

          // Compute total price
          const itemTotal = product.unitPrice * item.quantity;
          totalPrice += itemTotal;

          processedItems.push({
            product: product._id,
            productName: product.name,
            shape: product.shape,
            dimensions:
              "width" in product && "height" in product
                ? `Width: ${product.width}cm, Height: ${product.height}cm`
                : "sideLength" in product
                ? `Side: ${product.sideLength}cm`
                : "radius" in product
                ? `Radius: ${product.radius}cm`
                : "Unknown dimensions",
            quantity: item.quantity,
            unitPrice: product.unitPrice,
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
        console.log(`✅ Order saved with ID: ${savedOrder._id}`);

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
      const orders = await Order.find().populate("customer").populate("orderItems.product");

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
      const order = await Order.findById(orderId).populate("customer").populate("orderItems.product");
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
  ipcMain.handle("order:update", async (_event, { orderId, updateData }) => {
    try {
      const existingOrder = await Order.findById(orderId);
      if (!existingOrder) return { success: false, message: "Order not found" };

      let newTotalPrice = 0;
      if (updateData.orderItems) {
        for (const item of updateData.orderItems) {
          const product = await Product.findById(item.product);
          if (!product) throw new Error(`Product with ID ${item.product} not found`);
          newTotalPrice += product.unitPrice * item.quantity;
        }
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { ...updateData, totalPrice: newTotalPrice },
        { new: true, runValidators: true }
      ).populate("customer").populate("orderItems.product");

      if (!updatedOrder) return { success: false, message: "Order not found" };

      // Update customer total debt
      const customer = await Customer.findById(updatedOrder.customer);
      if (customer) {
        const unpaidOrders = await Order.find({ customer: customer._id, status: "pending" });
        customer.totalPrice = unpaidOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        customer.status = customer.totalPrice > 0 ? "has debt" : "no debt";
        await customer.save();
      }

      return { success: true, data: { ...updatedOrder.toJSON(), id: updatedOrder._id.toString() }, message: "Order updated successfully" };
    } catch (error) {
      console.error("❌ Error updating order:", error);
      return { success: false, message: "Failed to update order", error };
    }
  });

  // 📌 Fetch Orders by Customer ID
  ipcMain.handle("order:fetchByCustomerId", async (_event, customerId) => {
    try {
      if (!customerId) throw new Error("Customer ID is required");

      const orders = await Order.find({ customer: customerId }).populate("orderItems.product");

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
};
