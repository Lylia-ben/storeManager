import mongoose, { Schema, Document, Model, ObjectId } from 'mongoose';

// Transform helper function
function toJSONTransform(doc: any, ret: any) {
  ret.id = ret._id.toString();
  delete ret._id;
  delete ret.__v;
  return ret;
}

// Base interface
interface IProduct extends Document {
  _id: ObjectId;
  name: string;
  quantity: number;
  cost: number;
  unitPrice: number;
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
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    cost: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { discriminatorKey: "shape", timestamps: true }
);

ProductSchema.set("toJSON", { transform: toJSONTransform });

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

// Apply transform helper
RectangularProductSchema.set("toJSON", { transform: toJSONTransform });
CircularProductSchema.set("toJSON", { transform: toJSONTransform });
SquareProductSchema.set("toJSON", { transform: toJSONTransform });

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