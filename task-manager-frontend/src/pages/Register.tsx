// src/pages/Register.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const res = await api.post("/api/v1/auth/register", data);
      if (res.status === 201) {
        login(res.data);
        navigate("/");
        toast.success("Registered Successfully");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100">
      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Create Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              {...register("name")}
              placeholder="Enter your Name"
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="Enter your Email"
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="Enter your Password"
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-5 text-center text-gray-500">
          Already have an account?{" "}
          <span
            className="text-indigo-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
