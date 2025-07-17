import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { readData } from "../../../database/storage";
import BaseResponse from "../../../utils/responses";

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRY = parseInt(process.env.JWT_EXPIRY || "3600");
const USERS_FILE = "users";

export const loginUserService = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { mobileNo, password } = req.body;

    if (!mobileNo || !password) {
      return BaseResponse.validationError(
        res,
        "Mobile number and password are required"
      );
    }

    const users = readData(USERS_FILE);
    const existingUser = users.find((user: any) => user.mobileNo === mobileNo);

    if (!existingUser) {
      return BaseResponse.validationError(
        res,
        "Invalid mobile number or password"
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return BaseResponse.unauthorized(
        res,
        "Invalid mobile number or password"
      );
    }

    const token = jwt.sign(
      { userId: existingUser.id, mobileNo: existingUser.mobileNo },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    return BaseResponse.success(res, "User login successful", {
      token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        mobileNo: existingUser.mobileNo,
      },
    });
  } catch (err: any) {
    return BaseResponse.internalServerError(res, err, err.message);
  }
};
