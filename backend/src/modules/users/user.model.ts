import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

/**
 * Interface representing a User document in MongoDB.
 */
export interface IUser extends Document {
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** Hashed password */
  password: string;
  /**
   * Compares a candidate password with the stored hashed password.
   *
   * @param candidate - The plaintext password to compare
   * @returns True if passwords match, otherwise false
   */
  comparePassword(candidate: string): Promise<boolean>;
}

/**
 * Mongoose schema for User.
 *
 * Fields:
 * - name: required string, trimmed
 * - email: required, unique, lowercased string
 * - password: required string, minimum length 6
 *
 * Includes timestamps: `createdAt` and `updatedAt`
 */
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

/**
 * Pre-save hook to hash the password if modified.
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Method to compare a candidate password with the stored hash.
 */
userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

/**
 * Mongoose model for User.
 *
 * Provides standard CRUD operations and query helpers.
 */
export const User = mongoose.model<IUser>("User", userSchema);
