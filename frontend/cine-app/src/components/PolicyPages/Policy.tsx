// =========================
// Privacy Policy Page

import { useDispatch } from "react-redux";
import { hideLoader } from "../../Redux/LoaderSlice/LoaderSlice";
import SEO from "../../SEOs/SEO";

// =========================
export function PrivacyPolicy() {
  const dispatch = useDispatch();

  dispatch(hideLoader());
  return (
    <>
      <SEO
        title="Privacy Policy | CineAura"
        description="Read how CineAura handles your data"
      />
      <div className=" bg-bg-primary text-text-primary px-6 py-12 mt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

          <p className="mb-4">
            At CineAura, we value your privacy. This Privacy Policy explains how
            we collect, use, and protect your information when you use our
            platform.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">
            1. Information We Collect
          </h2>
          <p className="mb-4">
            We may collect basic user information such as name, email address,
            profile image (from Google OAuth), and usage data like reviews and
            interactions.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">
            2. How We Use Information
          </h2>
          <p className="mb-4">
            We use your information to provide personalized movie reviews,
            improve user experience, and maintain account authentication.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">3. Data Storage</h2>
          <p className="mb-4">
            Your data is securely stored in our backend database and is not sold
            or shared with third parties without consent.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">4. Google OAuth</h2>
          <p className="mb-4">
            We use Google OAuth for authentication. We only access basic profile
            information required for login.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">5. Your Rights</h2>
          <p className="mb-4">
            You can request deletion of your data or account at any time by
            contacting us.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">6. Contact</h2>
          <p>
            If you have any questions, contact us at{" "}
            <span className="font-semibold">
              digital.bhaskarparab@gmail.com
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

// =========================
// Terms & Conditions Page
// =========================
export function TermsAndConditions() {
  const dispatch = useDispatch();

  dispatch(hideLoader());
  return (
    <>
      <SEO
        title="Terms & Conditions | CineAura"
        description="Read what are terms and conditions to use CineAura"
      />
      <div className="bg-bg-primary text-text-primary px-6 py-12 mt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Terms & Conditions</h1>

          <p className="mb-4">
            By using CineAura, you agree to the following terms and conditions.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">
            1. Use of Service
          </h2>
          <p className="mb-4">
            CineAura is a movie review platform. You agree to use it only for
            lawful purposes and not to abuse or manipulate the system.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">2. User Content</h2>
          <p className="mb-4">
            You are responsible for the content you post (reviews, comments). We
            reserve the right to remove inappropriate content.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">3. Accounts</h2>
          <p className="mb-4">
            You are responsible for maintaining the security of your account
            created via Google OAuth.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">
            4. Intellectual Property
          </h2>
          <p className="mb-4">
            All CineAura branding, UI, and design belong to CineAura unless
            otherwise stated.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">
            5. Limitation of Liability
          </h2>
          <p className="mb-4">
            We are not responsible for any data loss, service downtime, or
            user-generated content issues.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">
            6. Changes to Terms
          </h2>
          <p className="mb-4">
            We may update these terms at any time. Continued use of CineAura
            means acceptance of the updated terms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">7. Contact</h2>
          <p>
            For questions, contact:{" "}
            <span className="font-semibold">
              digital.bhaskarparab@gmail.com
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
