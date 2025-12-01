import { useState } from "react";
import { useNavigate } from "react-router";
import darkLogo from "../../assets/logo/CineAuraDark.png";
import logo from "../../assets/logo/CineAuraLight.png";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/Store";
import DarkToggle from "../DarkToggle/DarkToggle";
import SearchBar from "../SearchBar/SearchBar";

function Navbar() {
  const navigate = useNavigate();
  const isDark = useSelector((state: RootState) => state.darkTheme.value);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false); // Close menu after navigation
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-4 sm:px-6 py-3 bg-bg-primary/95 backdrop-blur-sm text-text-primary z-50 shadow-sm">
        {/* LEFT - Logo */}
        <div onClick={() => navigate("/")} className="flex items-center">
          <img
            src={isDark === "dark" ? darkLogo : logo}
            alt="CineAura Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain cursor-pointer"
          />
        </div>

        {/* CENTER - Menu (Desktop) */}
        <div className="hidden md:flex flex-1 justify-center gap-8 lg:gap-10">
          <a
            onClick={() => navigate("/")}
            className="cursor-pointer text-base sm:text-lg font-medium hover:opacity-70 transition"
          >
            Home
          </a>
          <a
            onClick={() => navigate("/About")}
            className="cursor-pointer text-base sm:text-lg font-medium hover:opacity-70 transition"
          >
            About
          </a>
          <a
            href="#movies"
            className="text-base sm:text-lg font-medium hover:opacity-70 transition"
          >
            Movies
          </a>
        </div>

        {/* Search Bar - Desktop (between menu and toggle) */}
        <div className="hidden md:flex absolute right-1/10 md:right-1/11 lg:right-1/12 items-center">
          <div className="w-55 md:w-50 lg:w-110">
            <SearchBar />
          </div>
        </div>

        {/* Mobile Search Bar - Centered */}
      <div className="md:hidden flex justify-center px-4 py-2 z-50">
        <div className="w-full max-w-md">
          <SearchBar />
        </div>
      </div>

        {/* RIGHT - Controls (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <DarkToggle />
        </div>

        {/* Mobile Controls - Centered Search Bar and Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleMenu}
            className="flex flex-col justify-center items-center w-8 h-8"
            aria-label="Toggle menu"
          >
            <span
              className={`bg-text-primary block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                isMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
              }`}
            ></span>
            <span
              className={`bg-text-primary block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`bg-text-primary block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                isMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
              }`}
            ></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-bg-primary/95 backdrop-blur-sm z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col h-full pt-20 px-6">
          <div className="flex flex-col space-y-6 text-xl">
            <a
              onClick={() => handleNavigation("/")}
              className="cursor-pointer font-medium mt-5 hover:opacity-70 transition py-2"
            >
              Home
            </a>
            <a
              onClick={() => handleNavigation("/About")}
              className="cursor-pointer font-medium hover:opacity-70 transition py-2"
            >
              About
            </a>
            <a
              href="#movies"
              onClick={() => setIsMenuOpen(false)}
              className="font-medium hover:opacity-70 transition py-2"
            >
              Movies
            </a>
          </div>

          <div className="mt-auto flex justify-start pb-8">
            <DarkToggle />
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;