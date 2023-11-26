/* eslint-disable @typescript-eslint/no-explicit-any */
import { IOrder, IUser } from './user.interface';
import { User } from './user.model';

// Create User
const createUserIntoDB = async (user: IUser) => {
  if (await User.isExists(Number(user.userId))) {
    throw new Error(`User ID: ${user.userId} already exists`);
  } else {
    const newUser = await User.create(user);
    if (newUser) {
      const result = await User.findOne({
        userId: { $eq: Number(user.userId) },
      }).select({ _id: 0, password: 0, __v: 0 });
      return result;
    }
  }
};

// Get All User
const getAllUserFromDB = async () => {
  const users = await User.find().select({
    _id: 0,
    username: 1,
    fullName: 1,
    age: 1,
    email: 1,
    address: 1,
  });
  if (users.length > 0) {
    return users;
  } else return 'No User Found';
};

// Get User By ID
const getUserById = async (id: string) => {
  if (await User.isExists(Number(id))) {
    const user = await User.findOne({ userId: { $eq: Number(id) } }).select({
      _id: 0,
      password: 0,
      __v: 0,
    });
    return user;
  } else {
    throw new Error(`User ID: ${id} not exists`);
  }
};

// Update User
const updateOneUser = async (id: string, user: IUser) => {
  try {
    const update = await User.findOneAndUpdate(
      { userId: Number(id) },
      {
        'fullName.firstName': user.fullName.firstName,
        'fullName.lastName': user.fullName.lastName,
        age: user.age,
        password: user.password,
        email: user.email,
        isActive: user.isActive,
        hobbies: user.hobbies,
        'address.street': user.address.street,
        'address.city': user.address.city,
        'address.country': user.address.country,
      },
      {
        returnOriginal: false,
      },
    ).select({ orders: 0, _id: 0, password: 0, __v: 0 });

    return update;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

// Delete User
const deleteUserFromDB = async (id: string) => {
  if (await User.isExists(Number(id))) {
    const result = User.findOneAndDelete({ userId: Number(id) });
    return result;
  } else {
    throw new Error(`User ID: ${id} not exists`);
  }
};

const updateOrder = async (id: string, order: IOrder) => {
  if (await User.isExists(Number(id))) {
    await User.updateOne(
      { userId: Number(id) },
      { $addToSet: { orders: order } },
    )
      .then((result) => {
        return result;
      })
      .catch((err) => {
        return err;
      });
  } else {
    throw new Error(`User ID: ${id} not exists`);
  }
};

// get all order by user id
const getAllOrderByUserId = async (id: string) => {
  if (await User.isExists(Number(id))) {
    const orders = await User.findOne({
      userId: { $eq: Number(id) },
    }).select({ orders: 1, _id: 0 });
    // return orders;
    if ((orders?.orders?.length as number) > 0) {
      return orders;
    } else return 'No Order Found';
    return;
  } else {
    throw new Error(`User ID: ${id} not exists`);
  }
};

// Total Price by user id
const getTotalPriceByUserId = async (id: string) => {
  if (await User.isExists(Number(id))) {
    const user = await User.findOne({
      userId: { $eq: Number(id) },
    }).select({ orders: 1, _id: 0 });
    return user?.orders?.reduce(
      (price: any, order: any) => price + order.price * order.quantity,
      0,
    );
  } else {
    throw new Error(`User ID: ${id} not exists`);
  }
};

export const UserServices = {
  createUserIntoDB,
  getAllUserFromDB,
  getUserById,
  updateOneUser,
  deleteUserFromDB,
  updateOrder,
  getAllOrderByUserId,
  getTotalPriceByUserId,
};
