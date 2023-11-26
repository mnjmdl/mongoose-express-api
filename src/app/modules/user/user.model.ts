import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import { Address, FullName, IOrder, IUser, UserModel } from "./user.interface";
import config from "../../config";

const fullNameSchema = new Schema<FullName>(
  {
    firstName: { type: String },
    lastName: { type: String },
  },
  {
    _id: false,
  }
);

const addressSchema = new Schema<Address>(
  {
    street: { type: String },
    city: { type: String },
    country: { type: String },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    productName: { type: String },
    price: { type: Number },
    quantity: { type: Number },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>({
  userId: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  fullName: fullNameSchema,
  age: { type: Number },
  email: { type: String },
  isActive: { type: Boolean },
  hobbies: { type: [String] },
  address: addressSchema,
  orders: [orderSchema],
});

// userSchema.methods.toJSON = function () {
//   const obj = this.toObject();
//   // obj.password = ;
//   delete obj.password;
//   return obj;
// };

// Static

userSchema.statics.isExists = async function (id: string) {
  const existingUser = await User.findOne({ userId: { $eq: Number(id) } });
  return existingUser?.userId;
};

userSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

export const User = model<IUser, UserModel>("User", userSchema);
