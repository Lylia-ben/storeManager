import mongoose, { Schema, Document, ObjectId, Model } from "mongoose";

// 🟢 Customer Interface
interface ICustomer extends Document {
  _id: ObjectId;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  orders: ObjectId[];
  status: "has debt" | "no debt";
  totalPrice: number;
}

// 🏠 Customer Schema
const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    status: { type: String, enum: ["has debt", "no debt"], default: "no debt" },
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Customer Model
const Customer: Model<ICustomer> = mongoose.model<ICustomer>("Customer", CustomerSchema);

export { Customer, ICustomer };
