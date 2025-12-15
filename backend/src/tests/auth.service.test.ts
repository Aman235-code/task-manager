import { registerUser, loginUser } from "../modules/auth/auth.service";
import { User } from "../modules/users/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../modules/users/user.model");

describe("AuthService", () => {
  it("should register a new user", async () => {
    (User.create as jest.Mock).mockResolvedValue({
      _id: "1",
      name: "Test",
      email: "test@example.com",
      password: await bcrypt.hash("password", 10)
    });

    const result = await registerUser("Test", "test@example.com", "password");

    expect(result.user.email).toBe("test@example.com");
    expect(result.token).toBeDefined();
  });

  it("should login a user with correct password", async () => {
  const hashed = await bcrypt.hash("password", 10);

  (User.findOne as jest.Mock).mockResolvedValue({
    _id: "1",
    email: "test@example.com",
    password: hashed,
    comparePassword: jest.fn().mockResolvedValue(true) // <--- add this
  });

  const result = await loginUser("test@example.com", "password");
  expect(result.token).toBeDefined();
});


  it("should throw error for wrong password", async () => {
  const hashed = await bcrypt.hash("password", 10);

  (User.findOne as jest.Mock).mockResolvedValue({
    _id: "1",
    email: "test@example.com",
    password: hashed,
    comparePassword: jest.fn().mockResolvedValue(false) // <--- add this
  });

  await expect(
    loginUser("test@example.com", "wrongpass")
  ).rejects.toThrow("Invalid credentials");
});

});
