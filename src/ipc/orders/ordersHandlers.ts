import { ipcMain } from 'electron';
import { Order } from '../../database/models/Order/Order'
import { Product } from '../../database/models/Product/Product';

// Order Handlers
ipcMain.handle('create-order', async (event, { products }) => {
  try {
    let totalPrice = 0;

    // Validate products
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found.`);
      }
      if (item.orderQuantity > product.quantity) {
        throw new Error(`Insufficient quantity for product ID ${item.productId}.`);
      }
    }

    // Deduct stock and calculate total price
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (product) {
        item.price = item.orderQuantity * product.unitPrice;
        totalPrice += item.price;

        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: -item.orderQuantity },
        });
      }
    }

    const newOrder = new Order({
      products,
      totalPrice,
      status: 'notpayed',
    });

    const savedOrder = await newOrder.save();
    return savedOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
});

ipcMain.handle('fetch-all-orders', async () => {
  try {
    const orders = await Order.find().populate('products.productId');
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
});

ipcMain.handle('fetch-order-by-id', async (event, orderId) => {
  try {
    const order = await Order.findById(orderId).populate('products.productId');
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found.`);
    }
    return order;
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    throw error;
  }
});

ipcMain.handle('update-order', async (event, { orderId, updates }) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, { new: true });
    if (!updatedOrder) {
      throw new Error(`Order with ID ${orderId} not found.`);
    }
    return updatedOrder;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
});

ipcMain.handle('delete-order', async (event, orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found.`);
    }

    // Restore stock for products in the order
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: item.orderQuantity },
      });
    }

    await Order.findByIdAndDelete(orderId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
});