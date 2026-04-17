import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import InfiniteScrollPage from "../InfiniteScrollPage/InfiniteScrollPage";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../Redux/LoaderSlice/LoaderSlice";
import SEO from "../../SEOs/SEO";

interface FormData {
  username: string;
  email: string;
  password: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  general?: string;
}

const SignUp = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [googleSuccess, setGoogleSuccess] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { refreshUser } = useAuth();

  // ---------------- VALIDATION ----------------
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    const password = formData.password;
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Add at least 1 uppercase letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Add at least 1 number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- HANDLERS ----------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // clear field error on typing
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: undefined,
      general: undefined,
    }));
  };

  const handleSubmit = async () => {
    dispatch(showLoader());
    setSuccess(null);

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch(
        "https://cineaura-production.up.railway.app/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setSuccess("Account created successfully");

      await refreshUser();

      setFormData({ username: "", email: "", password: "" });

      setTimeout(() => navigate("/"), 1200);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrors({ general: err.message });
      } else {
        setErrors({ general: "Something went wrong" });
      }
    } finally {
      setLoading(false);
      dispatch(hideLoader());
    }
  };

  // ---------------- UI ----------------
  return (
    <>
      <SEO
        title="Sign Up | CineAura"
        description="Create your CineAura account"
        noIndex={true}
      />
      <div className="relative min-h-screen flex items-center justify-center bg-bg-primary px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <InfiniteScrollPage />
        </div>

        <div className="pointer-events-none absolute bottom-0 h-80 w-full z-10 bg-linear-to-b to-bg-primary" />

        <div className="relative z-10 w-full max-w-md bg-bg-secondary/90 backdrop-blur-md border border-border rounded-2xl shadow-md p-8 space-y-5">
          <h1 className="text-2xl font-semibold text-center">Create Account</h1>

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="p-2 text-sm rounded-md bg-green-500/10 text-green-500 border border-green-500/30">
              {success}
            </div>
          )}

          {/* GENERAL ERROR */}
          {errors.general && (
            <div className="p-2 text-sm rounded-md bg-red-500/10 text-red-500 border border-red-500/30">
              {errors.general}
            </div>
          )}

          {/* Username */}
          <div>
            <label className="text-sm text-text-secondary">Username</label>
            <input
              name="username"
              placeholder="Enter your name"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-bg-secondary border border-border focus:ring-2 focus:ring-accent"
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-text-secondary">Email</label>
            <input
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-bg-secondary border border-border focus:ring-2 focus:ring-accent"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-text-secondary">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-bg-secondary border border-border focus:ring-2 focus:ring-accent"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2 rounded-lg bg-accent text-white font-medium hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {googleSuccess && (
            <div className="p-2 text-sm rounded-md bg-green-500/10 text-green-500 border border-green-500/30">
              {googleSuccess}
            </div>
          )}

          {googleError && (
            <div className="p-2 text-sm rounded-md bg-red-500/10 text-red-500 border border-red-500/30">
              {googleError}
            </div>
          )}

          {googleLoading && (
            <div className="p-2 text-sm rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/30">
              Signing up with Google...
            </div>
          )}

          {/* GOOGLE LOGIN */}
          <div className="w-full max-w-md mx-auto">
          <GoogleLogin
            theme="outline"
            size="large"
            text="signup_with"
            shape="pill"
            logo_alignment="left"
            useOneTap={false}
            width="100%"
            onSuccess={async (credentialResponse) => {
              setGoogleLoading(true);
              setGoogleError(null);
              setGoogleSuccess(null);

              try {
                const token = credentialResponse.credential;

                const res = await fetch(
                  "https://cineaura-production.up.railway.app/api/auth/google",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ token }),
                  },
                );

                const data = await res.json();

                if (!res.ok) {
                  throw new Error(data.message || "Google signup failed");
                }

                setGoogleSuccess("Google signup successful");

                await refreshUser();

                setTimeout(() => {
                  navigate("/");
                }, 800);
              } catch (err: unknown) {
                if (err instanceof Error) {
                  setGoogleError(err.message);
                } else {
                  setGoogleError("Google signup failed");
                }
              } finally {
                setGoogleLoading(false);
              }
            }}
            onError={() => {
              setGoogleError("Google authentication failed");
            }}
          />
          </div>

          <p className="text-center text-sm text-muted">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/log-in")}
              className="text-accent cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
