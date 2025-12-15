import { Request, Response } from "express";
import { RegisterDto, LoginDto } from "./auth.dto";
import { registerUser, loginUser } from "./auth.service";

export async function register(req: Request, res: Response) {
  const data = RegisterDto.parse(req.body);

  const { user, token } = await registerUser(
    data.name,
    data.email,
    data.password
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax"
  });

  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email
  });
}

export async function login(req: Request, res: Response) {
  const data = LoginDto.parse(req.body);

  const { user, token } = await loginUser(data.email, data.password);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax"
  });

  res.json({
    id: user._id,
    name: user.name,
    email: user.email
  });
}
