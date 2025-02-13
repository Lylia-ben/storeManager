import mongoose, { Schema, Document } from "mongoose";

// Define the interface for an order
export interface IOrder extends Document {
  customer: mongoose.Types.ObjectId; // ✅ Explicitly define as ObjectId
  products: {
    productId: mongoose.Types.ObjectId; // ✅ Fix product reference
    quantity: number;
    unitPrice: number;
  }[];
  total: number;
  status: "not paid" | "paid";
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema
const OrderSchema = new Schema<IOrder>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true }, // ✅ Explicit type fix
    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    status: { type: String, enum: ["not paid", "paid"], default: "not paid" },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
