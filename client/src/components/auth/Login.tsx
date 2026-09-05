import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { useAuthStore } from "../../store/authStore";
import type { LoginResponse } from "../../types/user";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Mail, Lock, LogIn } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      setUser(response.data.data);
      navigate(
        response.data.data.role === "superAdmin"
          ? "/dashboard/admin"
          : "/dashboard/owner",
      );
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden"
        style={{ background: "oklch(0.25 0.08 250)" }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10"
          style={{ background: "oklch(0.65 0.15 250)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "oklch(0.50 0.10 250)" }}
        />

        <div className="relative z-10 text-center px-12 space-y-6">
          <div
            className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center shadow-lg"
            style={{ background: "oklch(0.35 0.08 250)" }}
          >
            <span className="text-3xl font-bold text-white">J</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            JOZY Tech
          </h1>
          <p className="text-lg text-white/70 max-w-sm">
            Digital menu management platform. Sign in to manage your venues,
            menus, and more.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center space-y-2">
            <div
              className="w-14 h-14 rounded-xl mx-auto flex items-center justify-center shadow-md"
              style={{ background: "oklch(0.25 0.08 250)" }}
            >
              <span className="text-2xl font-bold text-white">J</span>
            </div>
            <h2
              className="text-xl font-bold"
              style={{ color: "oklch(0.25 0.08 250)" }}
            >
              JOZY Tech
            </h2>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500">
              Enter your credentials to access your dashboard
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-sm font-medium cursor-pointer"
              style={{ background: "oklch(0.30 0.08 250)" }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="size-4" />
                  Sign in
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
