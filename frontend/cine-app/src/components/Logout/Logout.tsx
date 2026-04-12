import { isValidElement, useState, type ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutModal = ({ isOpen, onClose }: LogoutModalProps) => {
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();

  const handleLogout = async () => {
    try {
      setLoading(true);

      const res = await fetch("https://cineaura-production.up.railway.app/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.status !== 200) throw new Error("Logout failed");

      await refreshUser();

      // window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex min-h-screen items-center justify-center bg-black/10  px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-bg-secondary border border-border rounded-2xl shadow-lg p-6 space-y-4"
      >
        <h2 className="text-lg font-semibold text-text-primary">
          Confirm Logout
        </h2>

        <p className="text-sm text-text-secondary">
          Are you sure you want to logout from your account?
        </p>

        <div className="flex justify-end gap-3 pt-2">
          {/* Cancel */}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border cursor-pointer border-border text-text-primary text-sm transition"
          >
            Cancel
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm transition cursor-pointer"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function LogoutButton({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const isIcon = isValidElement(children) && typeof children.type !== "string";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`cursor-pointer font-medium ${
          !isIcon ? "hover:opacity-70" : ""
        }`}
      >
        {children}
      </button>

      <LogoutModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
