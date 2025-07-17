import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { addData, readData } from "../../../database/storage";
import userSchema from "../../../validator/user-validator";
import BaseResponse from "../../../utils/responses";

const USERS_FILE = "users";

export const registerUserService = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const parseResult = userSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errorMessages = parseResult.error.errors.map(
        (err: any) => err.message,
      );
      return BaseResponse.validationError(
        res,
        "Validation Failed",
        errorMessages,
      );
    }

    const { name, email, mobileNo, password } = parseResult.data;

    const users = readData(USERS_FILE);
    const existingUser = users.find((user: any) => user.mobileNo === mobileNo);

    if (existingUser) {
      return BaseResponse.validationError(
        res,
        "User with this mobile number already exists",
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now(),
      name,
      email,
      mobileNo,
      password: hashedPassword,
    };

    addData(USERS_FILE, newUser);

    return BaseResponse.created(res, "User registered successfully", {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      mobileNo: newUser.mobileNo,
    });
  } catch (err: any) {
    return BaseResponse.internalServerError(res, err, err.message);
  }
};
