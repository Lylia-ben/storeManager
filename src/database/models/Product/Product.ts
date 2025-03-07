import mongoose, { Schema, Document, Model } from "mongoose";

// Transform helper function
function toJSONTransform(doc: any, ret: any) {
  ret.id = ret._id?.toString(); // Convert _id to string
  delete ret._id; // Remove raw ObjectId
  delete ret.__v; // Remove version key
  return ret;
}

// Base interface
interface IProduct extends Document {
  id: string; // Ensure `id` is always a string
  name: string;
  quantity: number;
  cost: number;
  unitPrice: number;
  shape: "RectangularProduct" | "SquareProduct" | "CircularProduct";
  width?: number;
  height?: number;
  sideLength?: number;
  radius?: number;
}

// Extended interfaces
interface IRectangularProduct extends IProduct {
  width: number;
  height: number;
}

interface ICircularProduct extends IProduct {
  radius: number;
}

interface ISquareProduct extends IProduct {
  sideLength: number;
}

// Base schema
const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    cost: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { discriminatorKey: "shape", timestamps: true }
);

// Apply transformation to both toJSON and toObject
ProductSchema.set("toJSON", { transform: toJSONTransform });
ProductSchema.set("toObject", { transform: toJSONTransform });

// Product model
const Product: Model<IProduct> = mongoose.model<IProduct>("Product", ProductSchema);

// Discriminator schemas
const RectangularProductSchema = new Schema<IRectangularProduct>({
  width: { type: Number, required: true },
  height: { type: Number, required: true },
});

const CircularProductSchema = new Schema<ICircularProduct>({
  radius: { type: Number, required: true },
});

const SquareProductSchema = new Schema<ISquareProduct>({
  sideLength: { type: Number, required: true },
});

// Apply transformation to discriminators
[RectangularProductSchema, CircularProductSchema, SquareProductSchema].forEach((schema) => {
  schema.set("toJSON", { transform: toJSONTransform });
  schema.set("toObject", { transform: toJSONTransform });
});

// Discriminators
const RectangularProduct = Product.discriminator<IRectangularProduct>(
  "RectangularProduct",
  RectangularProductSchema
);

const CircularProduct = Product.discriminator<ICircularProduct>(
  "CircularProduct",
  CircularProductSchema
);

const SquareProduct = Product.discriminator<ISquareProduct>(
  "SquareProduct",
  SquareProductSchema
);

// Export models
export { Product, RectangularProduct, CircularProduct, SquareProduct };
