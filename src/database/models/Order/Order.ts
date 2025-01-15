import mongoose, { Schema, Document, Model, ObjectId } from 'mongoose';
import { Product } from '../Product/Product'; // Import the Product model for reference

// Define the interface for an order item
interface IOrderItem {
  productId: ObjectId; // Reference to Product
  orderQuantity: number;
  price: number; // Calculated as orderQuantity * unitPrice
}

// Define the base interface for an order
interface IOrder extends Document {
  _id: ObjectId;
  products: IOrderItem[];
  totalPrice: number; // Sum of all products' prices
  status: 'payed' | 'notpayed'; // Payment status
}

// Define the schema for an order item
const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  orderQuantity: { type: Number, required: true, min: [1, 'Order quantity must be at least 1'] },
  price: { type: Number, required: true, min: [0, 'Price cannot be negative'] },
});

// Define the schema for an order
const OrderSchema = new Schema<IOrder>(
  {
    products: { type: [OrderItemSchema], required: true },
    totalPrice: { type: Number, required: true, min: [0, 'Total price cannot be negative'] },
    status: { type: String, enum: ['payed', 'notpayed'], default: 'notpayed' },
  },
  { timestamps: true }
);

// Pre-save middleware to calculate the totalPrice
OrderSchema.pre<IOrder>('save', async function (next) {
  let total = 0;

  // Calculate the price for each product and the total price
  for (const item of this.products) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return next(new Error(`Product with ID ${item.productId} not found.`));
    }
    item.price = item.orderQuantity * product.unitPrice;
    total += item.price;
  }

  this.totalPrice = total;
  next();
});

// Transform _id to id and clean up JSON output
OrderSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Export the Order model
const Order: Model<IOrder> = mongoose.model<IOrder>('Order', OrderSchema);

export { Order };
