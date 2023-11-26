/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { UserServices } from "./user.services";
// import userSchemaZod from './user.validation.zod';
import { User } from "./user.model";

export const maxDuration = 300;

const createUser = async (req: Request, res: Response) => {
  try {
    const { user: userData } = req.body;

    // data validation using zod
    // const userValidateData = userSchemaZod.parse(userData);

    const result = await UserServices.createUserIntoDB(userData);
    // const result = await UserServices.createUserIntoDB(userValidateData);

    res.status(200).json({
      success: true,
      message: "User created successfully!",
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || `Something wrong.`,
      error: err,
    });
  }
};

// Get All User
const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.getAllUserFromDB();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully!",
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "User not found",
      error: {
        code: 404,
        description: "User not found!",
      },
    });
  }
};

// Get One User By ID
const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const result = await UserServices.getUserById(userId);
    res.status(200).json({
      success: true,
      message: "User fetched successfully!",
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "User not found",
      error: {
        code: 404,
        description: "User not found!",
      },
    });
  }
};

// Update One User
const updateOneUser = async (req: Request, res: Response) => {
  const { userId: id } = req.params;
  try {
    const { user } = req.body;
    const result = await UserServices.updateOneUser(id, user);
    // console.log(result);
    res.status(200).json({
      success: true,
      message: "User Update successfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "User not found",
      error: {
        code: 404,
        description: "User not found!",
      },
    });
  }
};

// deleteUserFromDB
const deleteUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    await UserServices.deleteUserFromDB(userId);
    res.status(200).json({
      success: true,
      message: `User deleted successfully!`,
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "User not found",
      error: {
        code: 404,
        description: "User not found!",
      },
    });
  }
};

// Update Orders
const updateOrder = async (req: Request, res: Response) => {
  const { userId: id } = req.params;
  try {
    const { order } = req.body;
    const result = await UserServices.updateOrder(id, order);
    res.status(200).json({
      success: true,
      message: `Order Update successfully!`,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "User not found",
      error: {
        code: 404,
        description: "User not found!",
      },
    });
  }
};

// /:userId/orders
const getAllOrderByUserId = async (req: Request, res: Response) => {
  const { userId: id } = req.params;
  if (await User.isExists(Number(id))) {
    try {
      const orders = await UserServices.getAllOrderByUserId(id);
      res.status(200).json({
        success: true,
        message: `Order fetched successfully!`,
        data: orders,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Orders not found",
        error: {
          code: 404,
          description: "Orders not found!",
        },
      });
    }
  } else {
    res.status(500).json({
      success: false,
      message: "User not found",
      error: {
        code: 404,
        description: "User not found!",
      },
    });
  }
};

const getTotalPriceByUserId = async (req: Request, res: Response) => {
  const { userId: id } = req.params;
  try {
    const totalPrice = await UserServices.getTotalPriceByUserId(id);
    res.status(200).json({
      success: true,
      message: `Order Price fetched successfully!`,
      data: { totalPrice: totalPrice },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Orders not found",
      error: {
        code: 404,
        description: "Orders not found!",
      },
    });
  }
};

export const UserControllers = {
  createUser,
  getUsers,
  getUserById,
  updateOneUser,
  deleteUserById,
  updateOrder,
  getAllOrderByUserId,
  getTotalPriceByUserId,
};
