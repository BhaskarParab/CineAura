import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import type { RootState } from "../../Redux/Store";
import logo from "../../assets/images/android-chrome-192x192.png";
import darkLogo from "../../assets/images/dark-android-chrome-192x192.png";

const Loader = () => {
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const isDark = useSelector((state: RootState) => state.darkTheme.value);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (isLoading) {
      // defer state update (avoids eslint warning)
      timeout = setTimeout(() => setVisible(true), 0);
    } else {
      timeout = setTimeout(() => setVisible(false), 1500);
    }

    return () => clearTimeout(timeout);
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div
    className={`fixed inset-0 z-50 flex justify-center items-center bg-bg-primary transition-opacity duration-1500 ${
      isLoading ? "opacity-100" : "opacity-0"
    }`}
  >
    <div
      className={`relative w-20 h-20 transition-transform duration-1500 ${
        isLoading ? "scale-100" : "scale-95"
      }`}
    >
      <img
        className="w-20 h-20"
        src={isDark === "dark" ? logo : darkLogo}
        alt="Loading..."
      />
    </div>
  </div>
  );
};

export default Loader;