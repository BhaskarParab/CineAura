import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/Store";
import logo from "../../assets/logo/CineAuraLight.png";
import darkLogo from "../../assets/logo/CineAuraDark.png";

function Footer() {
  const isDark = useSelector((state: RootState) => state.darkTheme.value);

  return (
    <footer className="w-full bg-bg-primary text-text-primary border-t border-gray-600/20 px-6 py-10">

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">

        {/* COLUMN 1 — Logo + Description */}
        <div>
          <img
            src={isDark ? darkLogo : logo}
            alt="CineAura Logo"
            className="w-12 h-12 object-contain mb-3"
          />
          <p className="text-sm opacity-70 leading-relaxed">
            CineAura brings you curated details of movies and web series —
            discover cast, ratings, trailers, and more in one clean experience.
          </p>
        </div>

        {/* COLUMN 2 — Useful Links */}
        <div>
          <h3 className="font-semibold mb-3 text-base">Useful Links</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li><a className="hover:opacity-100 transition" href="#">About Us</a></li>
            <li><a className="hover:opacity-100 transition" href="#">Privacy Policy</a></li>
            <li><a className="hover:opacity-100 transition" href="#">Terms of Service</a></li>
            <li><a className="hover:opacity-100 transition" href="#">Contact</a></li>
          </ul>
        </div>

        {/* COLUMN 3 — Social Media */}
        <div>
          <h3 className="font-semibold mb-3 text-base">Follow Us</h3>
          <div className="flex gap-4 text-xl opacity-80">
            <a className="hover:opacity-100 transition" href="#">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a className="hover:opacity-100 transition" href="#">
              <i className="fa-brands fa-youtube"></i>
            </a>
            <a className="hover:opacity-100 transition" href="#">
              <i className="fa-brands fa-github"></i>
            </a>
          </div>
        </div>

      </div>

      <div className="text-center mt-10 text-xs opacity-60">
        © {new Date().getFullYear()} CineAura — All Rights Reserved.
      </div>

    </footer>
  );
}

export default Footer;
