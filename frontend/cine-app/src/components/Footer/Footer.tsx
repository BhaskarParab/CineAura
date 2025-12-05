import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/Store";
import logo from "../../assets/logo/CineAuraLight.png";
import darkLogo from "../../assets/logo/CineAuraDark.png";
import { useNavigate } from "react-router";
import darkTwitter from "../../assets/images/icons8-x-50 (1).png";
import twitter from "../../assets/images/icons8-x-50.png";
import linkedin from "../../assets/images/icons8-linkedin-48.png";

function Footer() {
  const isDark = useSelector((state: RootState) => state.darkTheme.value);
  const navigate = useNavigate();

  return (
    <footer className="w-full mt-35 bg-bg-primary text-text-primary border-t border-gray-600/20 px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">
        {/* COLUMN 1 — Logo + Description */}
        <div>
          <img
            onClick={() => navigate("/")}
            src={isDark === "dark" ? darkLogo : logo}
            alt="CineAura Logo"
            className="cursor-pointer w-12 h-12 object-contain mb-3"
          />
          <p className="text-sm opacity-70 leading-relaxed">
            CineAura brings you curated details of movies and web series —
            discover cast, ratings, trailers, and more in one clean experience.
          </p>
        </div>

        {/* COLUMN 2 — Useful Links */}
        <div>
          <h3 className="font-semibold mb-3 text-base">Useful Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <button
                onClick={() => navigate("/about")}
                className="opacity-80 hover:opacity-100 cursor-pointer"
              >
                About Us
              </button>
            </li>
            <li>
              <a className="opacity-80 hover:opacity-100 cursor-pointer">Privacy Policy</a>
            </li>
            <li>
              <a className="opacity-80 hover:opacity-100 cursor-pointer">Terms of Service</a>
            </li>
            <li>
              <a className="opacity-80 hover:opacity-100 cursor-pointer">Contact</a>
            </li>
          </ul>
        </div>

        {/* COLUMN 3 — Social Media */}
        <div>
          <h3 className="font-semibold mb-3 text-base">Connect with me</h3>
          <div className="flex gap-4 text-xl">
            <a href="https://x.com/BhaskarParab7" target="_blank">
              <img
                src={isDark === "dark" ? twitter : darkTwitter}
                alt="X Logo"
                className="w-8 h-8 cursor-pointer"
              />
            </a>
            <a
              href="https://www.linkedin.com/in/bhaskar-parab-81193a28a/"
              target="_blank"
            >
              <img
                src={linkedin}
                alt="linkedin Logo"
                className="w-9 h-9 -mt-0.5 cursor-pointer"
              />
            </a>
            <a href="https://github.com/BhaskarParab" target="_blank">
              {isDark === "dark" ? (
                <svg
                  height="34"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  version="1.1"
                  width="34"
                  data-view-component="true"
                  stroke="black"
                  fill="white"
                  className="octicon -mt-0.5 octicon-mark-github v-align-middle"
                >
                  <path d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z"></path>
                </svg>
              ) : (
                <svg
                  height="34"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  version="1.1"
                  width="34"
                  data-view-component="true"
                  className="octicon -mt-0.5 octicon-mark-github v-align-middle"
                >
                  <path d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z"></path>
                </svg>
              )}
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
