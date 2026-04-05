"use client";
import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Shield,
  Trophy,
} from "lucide-react";
import { useUserAuth } from "../../app/contexts/UserAuthContext";

// --- Sub-components ---

const InputField = ({
  type,
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  showToggle,
  onToggle,
  isPassword,
}: any) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-1.5 w-full">
      <div className="relative group">
        <div
          className={`absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300 ${
            focused ? "opacity-60" : ""
          }`}
        ></div>
        <div className="relative">
          <Icon
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
              focused ? "text-purple-400" : "text-gray-500"
            }`}
          />
          <input
            type={isPassword ? (showToggle ? "text" : "password") : type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`w-full pl-12 pr-12 py-3.5 bg-[#121212]/80 backdrop-blur-xl border ${
              error
                ? "border-red-500/50"
                : focused
                ? "border-purple-500/50"
                : "border-white/10"
            } rounded-xl outline-none text-white placeholder-gray-500 transition-all duration-300`}
          />
          {isPassword && (
            <button
              type="button"
              onClick={onToggle}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              {showToggle ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>
      {error && (
        <p className="text-[12px] text-red-400 flex items-center gap-1.5 ml-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};


const PasswordStrength = ({ password }: { password: string }) => {
  const getStrength = () => {
    if (!password) return 0;
    let s = 0;
    if (password.length > 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };
  const strength = getStrength();
  const colors = [
    "bg-gray-700",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-emerald-500",
  ];

  return (
    <div className="mt-2 flex gap-1.5 h-1 w-full px-1">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`h-full flex-1 rounded-full transition-all duration-500 ${
            i <= strength ? colors[strength] : "bg-white/10"
          }`}
        />
      ))}
    </div>
  );
};

// --- Main Components ---

const LoginForm = ({ onSwitch, onSuccess }: any) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useUserAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(formData.email, formData.password, rememberMe);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">Login</h2>
        <p className="text-gray-400 mt-2">
          Enter your credentials to access your account.
        </p>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <InputField
        type="email"
        placeholder="Email Address"
        icon={Mail}
        value={formData.email}
        onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
      />

      <div className="space-y-1">
        <InputField
          isPassword
          placeholder="Password"
          icon={Lock}
          showToggle={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          value={formData.password}
          onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
        />
        <div className="flex justify-between items-center">
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-gray-600 bg-transparent text-purple-500 focus:ring-purple-500"
            />
            Remember me
          </label>
          <button
            type="button"
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden relative group"
      >
        <span className={`flex items-center gap-2 ${isLoading ? "opacity-0" : ""}`}>
          <LogIn className="w-5 h-5" /> Sign In
        </span>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </button>

      <p className="text-center text-gray-500 text-sm mt-6">
        New here?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-white font-medium hover:text-purple-400 underline underline-offset-4 transition-colors"
        >
          Create an account
        </button>
      </p>
    </form>
  );
};

const RegisterForm = ({ onSwitch, onSuccess }: any) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useUserAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Full name is required");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-white tracking-tight">Register</h2>
        <p className="text-gray-400 mt-2">Join thousands of players worldwide.</p>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <InputField
        type="text"
        placeholder="Full Name"
        icon={User}
        value={formData.name}
        onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
      />
      <InputField
        type="email"
        placeholder="Email Address"
        icon={Mail}
        value={formData.email}
        onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
      />
      <div>
        <InputField
          isPassword
          placeholder="Password"
          icon={Lock}
          showToggle={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          value={formData.password}
          onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
        />
        <PasswordStrength password={formData.password} />
        <p className="text-xs text-gray-500 mt-2">
          Password must be at least 6 characters
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-4 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all duration-300 flex items-center justify-center gap-2 group"
      >
        <span className={`flex items-center gap-2 ${isLoading ? "hidden" : ""}`}>
          <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" /> Create Account
        </span>
        {isLoading && (
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        )}
      </button>

      <p className="text-center text-gray-500 text-sm mt-6">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-white font-medium hover:text-purple-400 underline underline-offset-4 transition-colors"
        >
          Sign In
        </button>
      </p>
    </form>
  );
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 selection:bg-purple-500/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-[#161618]/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        {/* Left Side: Brand/Visuals */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-purple-600/10 via-transparent to-transparent relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <span className="text-xl font-bold text-white tracking-wider uppercase">
                Gamers BD
              </span>
            </div>

            <h1 className="text-5xl font-extrabold text-white leading-tight">
              Unlock the next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Level of Gaming.
              </span>
            </h1>
            <p className="mt-6 text-gray-400 text-lg max-w-sm">
              Connect with millions of players, compete in global tournaments,
              and track your progress.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold">Secure by Default</h4>
                <p className="text-gray-500 text-sm">Enterprise-grade encryption.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
              <div className="p-3 bg-cyan-500/20 rounded-xl">
                <Trophy className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold">Pro Stats</h4>
                <p className="text-gray-500 text-sm">Detailed performance tracking.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Forms */}
        <div className="p-8 lg:p-16 flex flex-col justify-center bg-[#111113]/60">
          <div className="w-full max-w-md mx-auto">
            {isLogin ? (
              <LoginForm onSwitch={() => setIsLogin(false)} onSuccess={() => setShowSuccess(true)} />
            ) : (
              <RegisterForm onSwitch={() => setIsLogin(true)} onSuccess={() => setShowSuccess(true)} />
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1C1C1E] border border-white/10 p-8 rounded-[2rem] max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
            <p className="text-gray-400 mb-8">
              Access granted. Preparing your gaming dashboard...
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Let's Go
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
