import mongoose, { Schema, Document, Model, ObjectId } from 'mongoose';
import { Order } from '../Order/Order'; // Import the Order model for reference

// Define an interface for the Order reference in Customer
interface ICustomerOrder {
  orderId: ObjectId; // Reference to the Order schema
  status: 'payed' | 'notpayed'; // Status from the Order schema
}

// Define the base interface for a Customer
interface ICustomer extends Document {
  _id: ObjectId;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  orders: ICustomerOrder[];
  total: number; // Sum of all order prices
  status: 'has debt' | 'no debt'; // Calculated status based on orders
}

// Define the schema for a Customer
const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Phone number must be 10 digits'],
    },    
    orders: [
      {
        orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
        status: { type: String, enum: ['payed', 'notpayed'], required: true },
      },
    ],
    total: { type: Number, default: 0, min: [0, 'Total cannot be negative'] },
    status: { type: String, enum: ['has debt', 'no debt'], default: 'no debt' },
  },
  { timestamps: true }
);

// Pre-save middleware to calculate the total and customer status
CustomerSchema.pre<ICustomer>('save', async function (next) {
  let totalAmount = 0;
  let hasDebt = false;

  // Populate order details and calculate total
  for (const orderItem of this.orders) {
    const order = await Order.findById(orderItem.orderId);
    if (!order) {
      return next(new Error(`Order with ID ${orderItem.orderId} not found.`));
    }

    // Use the order's totalPrice and status
    totalAmount += order.totalPrice;
    if (order.status === 'notpayed') {
      hasDebt = true;
    }

    // Sync status with the latest from the Order schema
    orderItem.status = order.status;
  }

  // Set total and customer status
  this.total = totalAmount;
  this.status = hasDebt ? 'has debt' : 'no debt';
  next();
});

// Transform _id to id and clean up JSON output
CustomerSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Export the Customer model
const Customer: Model<ICustomer> = mongoose.model<ICustomer>('Customer', CustomerSchema);

export { Customer };
