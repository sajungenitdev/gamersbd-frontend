"use client";
import React, { useState, useEffect } from "react";
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
  ArrowLeft,
  Send,
  Key,
  Sparkles,
} from "lucide-react";
import { useUserAuth } from "../../app/contexts/UserAuthContext";
import { useCart } from "../../app/contexts/CartContext";

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
  disabled = false,
  autoComplete = "off",
}: any) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-1.5 w-full">
      <div className="relative group">
        <div
          className={`absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300 ${focused ? "opacity-60" : ""
            }`}
        ></div>
        <div className="relative">
          <Icon
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focused ? "text-purple-400" : "text-gray-500"
              }`}
          />
          <input
            type={isPassword ? (showToggle ? "text" : "password") : type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            autoComplete={autoComplete}
            className={`w-full pl-12 pr-12 py-3.5 bg-[#121212]/80 backdrop-blur-xl border ${error
              ? "border-red-500/50"
              : focused
                ? "border-purple-500/50"
                : "border-white/10"
              } rounded-xl outline-none text-white placeholder-gray-500 transition-all duration-300 ${disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
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
    if (password.length >= 8) s++;
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
  const messages = [
    "Very Weak",
    "Weak",
    "Fair",
    "Good",
    "Strong",
  ];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1.5 h-1 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-full flex-1 rounded-full transition-all duration-500 ${i <= strength ? colors[strength] : "bg-white/10"
              }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-1.5">
        Password strength: <span className="text-white">{messages[strength]}</span>
      </p>
    </div>
  );
};

// --- Login Form ---
const LoginForm = ({ onSwitch, onSuccess, onForgotPassword }: any) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useUserAuth();
  const { syncGuestCartWithBackend } = useCart();

  // In your login component, update the handleSubmit:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!formData.password) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      // Use the login method from context
      await login(formData.email, formData.password, rememberMe);

      // Cart will be synced automatically via useCartSync hook
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return "Signing In...";
    if (isSyncing) return "Syncing Cart...";
    return "Sign In";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
        <p className="text-gray-400 mt-2">
          Enter your credentials to access your account.
        </p>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-center gap-2 text-red-400 text-sm animate-in slide-in-from-top-2 duration-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <InputField
        type="email"
        placeholder="Email Address"
        icon={Mail}
        value={formData.email}
        autoComplete="email"
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
          autoComplete="current-password"
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
            onClick={onForgotPassword}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || isSyncing}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden relative group"
      >
        <span className={`flex items-center gap-2 ${isLoading || isSyncing ? "opacity-0" : ""}`}>
          <LogIn className="w-5 h-5" /> {getButtonText()}
        </span>
        {(isLoading || isSyncing) && (
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

// --- Register Form ---
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

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

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
        <h2 className="text-3xl font-bold text-white tracking-tight">Join the Community</h2>
        <p className="text-gray-400 mt-2">Create your account and start gaming.</p>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-center gap-2 text-red-400 text-sm animate-in slide-in-from-top-2 duration-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <InputField
        type="text"
        placeholder="Full Name"
        icon={User}
        value={formData.name}
        autoComplete="name"
        onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
      />
      <InputField
        type="email"
        placeholder="Email Address"
        icon={Mail}
        value={formData.email}
        autoComplete="email"
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
          autoComplete="new-password"
          onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
        />
        <PasswordStrength password={formData.password} />
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

// --- Forgot Password Form ---
const ForgotPasswordForm = ({ onBack, onSuccess }: any) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const { forgotPassword } = useUserAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await forgotPassword(email);
      setSuccess(true);
      if (response?.resetToken) {
        setResetToken(response.resetToken);
      }
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6">
        <header className="text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Check Your Email</h2>
          <p className="text-gray-400 mt-2">
            We've sent password reset instructions to:
            <br />
            <span className="text-purple-400 font-medium">{email}</span>
          </p>
        </header>

        {resetToken && process.env.NODE_ENV === "development" && (
          <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4">
            <p className="text-yellow-400 text-sm font-medium mb-2">⚠️ Development Mode Only</p>
            <p className="text-gray-300 text-xs break-all">Reset Token: {resetToken}</p>
            <p className="text-gray-500 text-xs mt-2">In production, this would be sent via email.</p>
          </div>
        )}

        <button
          onClick={onSuccess}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300"
        >
          Go to Reset Password
        </button>

        <button
          onClick={onBack}
          className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <header className="mb-6">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>
        <h2 className="text-2xl font-bold text-white">Forgot Password?</h2>
        <p className="text-gray-400 mt-2 text-sm">
          No worries! Enter your email and we'll send you reset instructions.
        </p>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <InputField
        type="email"
        placeholder="Email Address"
        icon={Mail}
        value={email}
        autoComplete="email"
        onChange={(e: any) => setEmail(e.target.value)}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Send Reset Instructions
          </>
        )}
      </button>
    </form>
  );
};

// --- Reset Password Form ---
const ResetPasswordForm = ({ token, onBack, onSuccess }: any) => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { resetPassword } = useUserAuth();

  const validateForm = () => {
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await resetPassword(token, formData.password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <header className="mb-6">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>
        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Key className="w-8 h-8 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-white text-center">Reset Password</h2>
        <p className="text-gray-400 mt-2 text-center text-sm">
          Create a new strong password for your account.
        </p>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-center gap-2 text-red-400 text-sm animate-in slide-in-from-top-2 duration-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <InputField
          isPassword
          placeholder="New Password"
          icon={Lock}
          showToggle={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          value={formData.password}
          autoComplete="new-password"
          onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
        />
        <PasswordStrength password={formData.password} />
      </div>

      <InputField
        isPassword
        placeholder="Confirm New Password"
        icon={Lock}
        showToggle={showConfirmPassword}
        onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
        value={formData.confirmPassword}
        autoComplete="new-password"
        onChange={(e: any) => setFormData({ ...formData, confirmPassword: e.target.value })}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Reset Password
          </>
        )}
      </button>
    </form>
  );
};

// --- Reset Password Success ---
const ResetPasswordSuccess = ({ onBack }: any) => {
  return (
    <div className="space-y-6 text-center">
      <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-emerald-500" />
      </div>
      <header>
        <h2 className="text-2xl font-bold text-white">Password Reset!</h2>
        <p className="text-gray-400 mt-2">
          Your password has been successfully reset.
          <br />
          You can now log in with your new password.
        </p>
      </header>
      <button
        onClick={onBack}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300"
      >
        Go to Login
      </button>
    </div>
  );
};

// --- Main Auth Page ---
export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register" | "forgot" | "reset">("login");
  const [resetToken, setResetToken] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Check URL for reset token
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      setResetToken(token);
      setMode("reset");
      // Clean URL without reload
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleLoginSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);
  };

  const handleRegisterSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);
  };

  const handleForgotSuccess = () => {
    setMode("reset");
  };

  const handleResetSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setMode("login");
      setShowSuccess(false);
    }, 2000);
  };

  const renderForm = () => {
    switch (mode) {
      case "register":
        return (
          <RegisterForm
            onSwitch={() => setMode("login")}
            onSuccess={handleRegisterSuccess}
          />
        );
      case "forgot":
        return (
          <ForgotPasswordForm
            onBack={() => setMode("login")}
            onSuccess={handleForgotSuccess}
          />
        );
      case "reset":
        return (
          <ResetPasswordForm
            token={resetToken}
            onBack={() => setMode("login")}
            onSuccess={handleResetSuccess}
          />
        );
      default:
        return (
          <LoginForm
            onSwitch={() => setMode("register")}
            onSuccess={handleLoginSuccess}
            onForgotPassword={() => setMode("forgot")}
          />
        );
    }
  };

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
              {mode === "reset" ? "Create New" : mode === "forgot" ? "Reset Access" : "Unlock the next"}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {mode === "reset" ? "Strong Password" : mode === "forgot" ? "Your Account" : "Level of Gaming"}
              </span>
            </h1>
            <p className="mt-6 text-gray-400 text-lg max-w-sm">
              {mode === "reset"
                ? "Choose a strong password to keep your account secure."
                : mode === "forgot"
                  ? "We'll help you get back into your account quickly."
                  : "Connect with millions of players, compete in global tournaments, and track your progress."}
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
            {renderForm()}
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
            <h3 className="text-2xl font-bold text-white mb-2">
              {mode === "reset" ? "Password Reset!" : "Success!"}
            </h3>
            <p className="text-gray-400 mb-8">
              {mode === "reset"
                ? "Your password has been successfully reset."
                : "Access granted. Preparing your gaming dashboard..."}
            </p>
            <div className="w-12 h-12 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
}