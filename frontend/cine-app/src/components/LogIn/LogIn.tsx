import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import InfiniteScrollPage from "../InfiniteScrollPage/InfiniteScrollPage";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log("Login successful!");

      await refreshUser();

      setFormData({
        email: "",
        password: "",
      });

      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Something went wrong");
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-bg-primary px-4 overflow-hidden">
      {/*Background Infinite Scroll */}
      <div className="absolute inset-0 z-0">
        <InfiniteScrollPage />
      </div>

      {/* Optional dark overlay (VERY IMPORTANT for readability) */}
      <div
        className="pointer-events-none absolute bottom-0 h-80 w-full z-10 
  bg-linear-to-b 
   to-bg-primary"
      />

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md bg-bg-secondary/90 backdrop-blur-md border border-border rounded-2xl shadow-md p-8 space-y-8">
        <h1 className="text-2xl font-semibold text-center">Create Account</h1>

        {/* Username
      <div className="space-y-2">
        <label className="text-sm text-text-secondary">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter your username"
          className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div> */}

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm text-text-secondary">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm text-text-secondary">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-2 rounded-lg bg-accent text-white font-medium hover:opacity-90 transition cursor-pointer"
        >
          Login
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted">OR</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <GoogleLogin
          theme="outline"
          size="large"
          text="signin_with"
          shape="pill"
          logo_alignment="left"
          onSuccess={async (credentialResponse) => {
            const token = credentialResponse.credential;

            const res = await fetch("http://localhost:5001/api/auth/google", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ token }),
            });

            if (res.ok) {
              await refreshUser();
              navigate("/");
            }
          }}
          onError={() => console.log("Login Failed")}
        />

        <p className="text-center text-sm text-muted">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/sign-up")}
            className="text-accent cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
