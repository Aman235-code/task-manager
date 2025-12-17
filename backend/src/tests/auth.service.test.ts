import { registerUser, loginUser } from "../modules/auth/auth.service";
import { User } from "../modules/users/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Mock the User model to isolate AuthService logic.
 *
 * This prevents real database access and allows
 * full control over returned user data.
 */
jest.mock("../modules/users/user.model");

/**
 * Test suite for authentication service logic.
 *
 * These tests validate:
 * - User registration
 * - Successful login
 * - Failed login due to invalid credentials
 *
 * External dependencies like the database are mocked
 * to ensure fast and deterministic test runs.
 */
describe("AuthService", () => {
  /**
   * Verifies that a new user can be registered successfully.
   *
   * Expectations:
   * - User record is created
   * - Returned user data matches input
   * - A JWT token is generated
   */
  it("should register a new user", async () => {
    (User.create as jest.Mock).mockResolvedValue({
      _id: "1",
      name: "Test",
      email: "test@example.com",
      password: await bcrypt.hash("password", 10),
    });

    const result = await registerUser("Test", "test@example.com", "password");

    expect(result.user.email).toBe("test@example.com");
    expect(result.token).toBeDefined();
  });

  /**
   * Verifies successful login with valid credentials.
   *
   * Expectations:
   * - User is found by email
   * - Password comparison succeeds
   * - A JWT token is returned
   */
  it("should login a user with correct password", async () => {
    const hashed = await bcrypt.hash("password", 10);

    (User.findOne as jest.Mock).mockResolvedValue({
      _id: "1",
      email: "test@example.com",
      password: hashed,
      comparePassword: jest.fn().mockResolvedValue(true),
    });

    const result = await loginUser("test@example.com", "password");
    expect(result.token).toBeDefined();
  });

  /**
   * Verifies login failure when an incorrect password is provided.
   *
   * Expectations:
   * - User is found
   * - Password comparison fails
   * - An appropriate authentication error is thrown
   */
  it("should throw error for wrong password", async () => {
    const hashed = await bcrypt.hash("password", 10);

    (User.findOne as jest.Mock).mockResolvedValue({
      _id: "1",
      email: "test@example.com",
      password: hashed,
      comparePassword: jest.fn().mockResolvedValue(false),
    });

    await expect(
      loginUser("test@example.com", "wrongpass")
    ).rejects.toThrow("Invalid credentials");
  });
});
