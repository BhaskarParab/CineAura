import logo from "../../assets/logo/CineAuraLight.png";
import darkLogo from "../../assets/logo/CineAuraDark.png";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/Store";
import DarkToggle from "../DarkToggle/DarkToggle";

function Navbar() {
  const isDark = useSelector((state: RootState) => state.darkTheme.value);

  return (
    <>
      <nav className="w-full flex items-center justify-between px-6 py-3 bg-bg-primary text-text-primary">
      
      {/* LEFT - Logo */}
      <div className="flex-1 flex items-center">
        <img
          src={isDark ? darkLogo : logo}
          alt="CineAura Logo"
          className="w-10 h-10 object-contain cursor-pointer"
        />
      </div>

      {/* CENTER - Menu */}
      <div className="flex-1 flex justify-center gap-10">
        <a href="#home" className="text-lg font-medium hover:opacity-70 transition">Home</a>
        <a href="#about" className="text-lg font-medium hover:opacity-70 transition">About</a>
        <a href="#movies" className="text-lg font-medium hover:opacity-70 transition">Movies</a>
      </div>

      {/* RIGHT - Dark Toggle */}
      <div className="flex-1 flex justify-end">
        <DarkToggle />
      </div>

    </nav>
    </>
  );
}

export default Navbar;
