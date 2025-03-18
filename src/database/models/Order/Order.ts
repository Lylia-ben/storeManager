import mongoose, { Schema, Document, Types, Model } from "mongoose";

// 🟢 Order Item Interface
interface IOrderItem {
  id: string; // Unique ID for each order item
  productName: string; // Snapshot of product name at time of order
  shape: "RectangularProduct" | "CircularProduct" | "SquareProduct";
  dimensions: string; // Stores width/height, radius, or sideLength as string
  quantity: number;
  unitPrice: number;
  total: number; // quantity * unitPrice
}

// 🏠 Order Interface
interface IOrder extends Document {
  customer: Types.ObjectId; // Reference to Customer
  orderItems: IOrderItem[];
  status: "paid" | "not paid";
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

// 🛒 Order Item Schema
const OrderItemSchema = new Schema<IOrderItem>(
  {
    id: { type: String, required: true, unique: true },
    productName: { type: String, required: true },
    shape: { type: String, enum: ["RectangularProduct", "CircularProduct", "SquareProduct"], required: true },
    dimensions: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false } // Prevents Mongoose from creating separate IDs for each item
);

// 🏠 Order Schema
const OrderSchema = new Schema<IOrder>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    orderItems: { type: [OrderItemSchema], required: true },
    status: { type: String, enum: ["paid", "not paid"], default: "not paid" },
    totalPrice: { type: Number, required: true, min: 0 },
  },
  { timestamps: true, strict: true }
);

// 🛠 Transform Output for JSON
OrderSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    ret.customer = ret.customer.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// 📌 Order Model
const Order: Model<IOrder> = mongoose.model<IOrder>("Order", OrderSchema);

export { Order, IOrder };
