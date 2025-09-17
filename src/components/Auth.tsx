import { auth, googleProvider } from "../config/fireBase";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  User,
} from "firebase/auth";

interface Props {
  error: string;
  setError: (error: string) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
}

const Auth = ({ setError, error, setIsAuthenticated }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [googleUser, setGoogleUser] = useState<User | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter your email and password");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        setError("Please verify your email before signing in");
        return;
      }
      setIsAuthenticated(true);
      localStorage.setItem("auth", "true");
      setError("");
    } catch {
      setError("❌ Email or Password is not correct, please Register first");
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Weak-password, Password should be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      setError("✅ Verification email sent! Please check your inbox");
    } catch(err) {
      console.log("error:", err)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        setError("Verification email sent! Please verify your email, check your spam folder too");
        return;
      }
      setError("❌ There is already an account with this email, Please Sign In");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setIsAuthenticated(true);
      localStorage.setItem("auth", "true");
      setError("");
      setGoogleUser(result.user);
    } catch {
      setError("❌ Google sign-in failed");
    }
  };

  const isSuccess = error.startsWith("✅");

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-gradient bg-light">
      <div
        className="card p-4 animate__animated animate__fadeInUp"
        style={{ maxWidth: "420px", width: "100%", borderRadius: "20px", boxShadow: "rgb(139 26 237 / 57%) 0px 0rem 3rem 0px" }}
      >
        <h3 className="text-center mb-4 fw-bold text-primary">
          {isRegister ? "Register 🚀" : "Sign In 🚀"}
        </h3>

        {/* Email Input */}
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control form-control-lg"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control form-control-lg"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Confirm Password Input (only for Register) */}
        {isRegister && (
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Confirm your password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}

        {/* Error / Success Messages */}
        {error && (
          <p
            className={`small text-center mb-2 animate__animated animate__shakeX fw-bold`}
            style={{ color: isSuccess ? "green" : "red" }}
          >
            {error}
          </p>
        )}

        {/* Auth Buttons */}
        <div className="d-grid gap-2 mb-3">
          {isRegister ? (
            <button className="btn btn-primary btn-lg" onClick={handleRegister}>
              Register
            </button>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={handleSignIn}>
              Sign In
            </button>
          )}
        </div>

        {/* Google Auth */}
        <div className="d-flex align-items-center justify-content-between p-2 border rounded bg-white shadow-sm mb-3">
          <button
            className="btn w-100 d-flex align-items-center justify-content-center"
            onClick={handleGoogleSignIn}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              width="20"
              height="20"
              className="me-2"
            />
            {isRegister ? "Register with Google" : "Sign In with Google"}
          </button>
          {googleUser && (
            <div className="ms-3 d-flex align-items-center">
              <img
                src={googleUser.photoURL || "https://via.placeholder.com/40"}
                alt="Google profile"
                className="rounded-circle me-2"
                width="40"
                height="40"
              />
              <span className="fw-semibold">{googleUser.displayName}</span>
            </div>
          )}
        </div>

        {/* Toggle between Register and Sign In */}
        <p className="text-center">
          {isRegister ? (
            <>
              You have an account?{" "}
              <span
                className="text-primary fw-bold"
                style={{ cursor: "pointer" }}
                onClick={() => setIsRegister(false)}
              >
                Sign In
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span
                className="text-primary fw-bold"
                style={{ cursor: "pointer" }}
                onClick={() => setIsRegister(true)}
              >
                Register
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Auth;
