// src/database/models/Order/Order.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";

// 🟢 Order Item Interface (Simplified without Mongoose-specific properties)
interface IOrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  shape: "Rectangular" | "Square" | "Circular";
  width?: number;
  height?: number;
  sideLength?: number;
  radius?: number;
  customerQuantity: number;
  unitPrice: number;
  cost: number;
  totalAmount: number;
}

// 🟢 Order Interface
interface IOrder extends Document {
  id: string;
  customerId: Types.ObjectId;
  orderItems: IOrderItem[];
  total: number;
  status: "paid" | "not paid";
  createdAt: Date;
  updatedAt: Date;
}

// 🏠 Order Item Schema
const OrderItemSchema = new Schema<IOrderItem>({
  id: { type: String, default: () => uuidv4(), unique: true },
  productId: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  shape: { 
    type: String, 
    required: true, 
    enum: ["Rectangular", "Square", "Circular"] 
  },
  width: { type: Number },
  height: { type: Number },
  sideLength: { type: Number },
  radius: { type: Number },
  customerQuantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  cost: { type: Number, required: true, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
}, { _id: false }); // Disable automatic _id for subdocuments

// 🏠 Order Schema
const OrderSchema = new Schema<IOrder>(
  {
    customerId: { 
      type: Schema.Types.ObjectId, 
      ref: "Customer", 
      required: true 
    },
    orderItems: [OrderItemSchema],
    total: { type: Number, required: true, min: 0 },
    status: { 
      type: String, 
      enum: ["paid", "not paid"], 
      default: "not paid" 
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// 🧮 Pre-save Hook for Calculations
OrderSchema.pre<IOrder>("save", function (next) {
  // Calculate total amount for each order item
  this.orderItems.forEach((item) => {
    item.totalAmount = item.customerQuantity * item.unitPrice;
  });

  // Calculate the total for the entire order
  this.total = this.orderItems.reduce(
    (sum, item) => sum + item.totalAmount, 
    0
  );

  next();
});

// 🏭 Order Model
const Order: Model<IOrder> = mongoose.model<IOrder>("Order", OrderSchema);

// 📦 Exports
export { Order, IOrder, IOrderItem };