import mongoose, { Schema, Document, ObjectId, Model } from "mongoose";

// 🟢 Customer Interface
interface ICustomer extends Document {
  _id: string; // Change to string to ensure correct handling in frontend
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  orders: string[]; // Change to string[] to avoid ObjectId issues in frontend
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
  { 
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString(); // Convert _id to string
        ret.orders = ret.orders.map((order: ObjectId) => order.toString()); // Convert order IDs to strings
        delete ret._id; // Remove _id
        delete ret.__v; // Remove __v (version key)
        return ret;
      },
    },
  }
);

// Customer Model
const Customer: Model<ICustomer> = mongoose.model<ICustomer>("Customer", CustomerSchema);

export { Customer, ICustomer };
