/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { User, Mail, Lock } from "lucide-react";

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
    <div className=" flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md rounded-2xl bg-gray-800 shadow-2xl p-8 space-y-6 text-gray-100">
        <h2 className="text-3xl font-bold text-center text-indigo-400 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
            <input
              type="text"
              {...register("name")}
              placeholder="Enter your Name"
              className={`w-full rounded-xl bg-gray-700 px-10 py-2 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
            <input
              type="email"
              {...register("email")}
              placeholder="Enter your Email"
              className={`w-full rounded-xl bg-gray-700 px-10 py-2 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
            <input
              type="password"
              {...register("password")}
              placeholder="Enter your Password"
              className={`w-full rounded-xl bg-gray-700 px-10 py-2 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 py-2.5 rounded-xl font-semibold text-white hover:opacity-90 transition disabled:opacity-60"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-5 text-center text-gray-400">
          Already have an account?{" "}
          <span
            className="text-indigo-400 font-semibold cursor-pointer hover:underline"
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
