import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("designer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, fullName, role);
      }
      navigate("/profiles");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#ffd700] rounded-lg flex items-center justify-center">
                <span className="text-[#0a0a0a] font-bold text-2xl">S</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#d4af37] to-[#ffd700] bg-clip-text text-transparent">
                StyleLink
              </h1>
            </div>
            <p className="text-[#a8a8a8]">
              The luxury fashion networking platform
            </p>
          </div>

          {/* Auth Card */}
          <Card glass className="p-8">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`
                  flex-1 py-2 rounded-lg font-medium transition-all
                  ${isLogin
                    ? "bg-[#d4af37] text-[#0a0a0a]"
                    : "bg-[#1a1a1a] text-[#fafafa]"
                  }
                `}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`
                  flex-1 py-2 rounded-lg font-medium transition-all
                  ${!isLogin
                    ? "bg-[#d4af37] text-[#0a0a0a]"
                    : "bg-[#1a1a1a] text-[#fafafa]"
                  }
                `}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-[#fafafa] mb-2">
                      I am a...
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#d4af37]/20 rounded-lg text-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                    >
                      <option value="designer">Designer</option>
                      <option value="stylist">Stylist</option>
                      <option value="model">Model</option>
                      <option value="photographer">Photographer</option>
                      <option value="client">Client</option>
                    </select>
                  </div>
                </>
              )}

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
              </Button>
            </form>
          </Card>

          <p className="text-center text-[#a8a8a8] text-sm mt-6">
            By continuing, you agree to StyleLink's Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
