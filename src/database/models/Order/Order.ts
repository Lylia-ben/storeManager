import mongoose, { Schema, Document, ObjectId, Model } from "mongoose";
import { Product } from "../Product/Product"; // Import Product model to fetch unit price
import { Customer } from "../Customer/Customer"; // Import Customer model

// 🟡 Order Interface
interface IOrder extends Document {
  _id: ObjectId;
  customer: ObjectId;
  products: { productId: ObjectId; quantity: number }[];
  total: number;
  status: "paid" | "not paid";
}

// 📦 Order Schema
const OrderSchema = new Schema<IOrder>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    total: { type: Number, default: 0 },
    status: { type: String, enum: ["paid", "not paid"], default: "not paid" },
  },
  { timestamps: true }
);

// 🔄 Auto-calculate `total` in Order before saving
OrderSchema.pre("save", async function (next) {
  let total = 0;

  for (const item of this.products) {
    const product = await Product.findById(item.productId);
    if (product) {
      total += product.unitPrice * item.quantity;
    }
  }

  this.total = total;

  // Update customer's total price & status
  const customer = await Customer.findById(this.customer);
  if (customer) {
    const unpaidOrders = await Order.find({ customer: customer._id, status: "not paid" });
    customer.totalPrice = unpaidOrders.reduce((sum, order) => sum + order.total, 0);
    customer.status = customer.totalPrice > 0 ? "has debt" : "no debt";
    await customer.save();
  }

  next();
});

// Order Model
const Order: Model<IOrder> = mongoose.model<IOrder>("Order", OrderSchema);

export { Order, IOrder };
