import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for the User document
export interface IUser extends Document {
  name: string;
  password: string;
}

// User schema
const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// User model
const UserModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
