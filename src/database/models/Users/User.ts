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
      unique: true, // Ensures usernames are unique
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      validate: {
        validator: (value: string) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(value),
        message: "Password must contain at least one letter and one number",
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password; // Exclude password from responses
        return ret;
      },
    },
  }
);

// User model
const UserModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
