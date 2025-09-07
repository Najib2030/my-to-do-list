import { useState } from "react";
import { auth, googleProvider } from "../config/fireBase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  User,
} from "firebase/auth";

interface Props {
  setError: (error: string) => void;
  error: string;
  setIsAuthenticated: (isAuth: boolean) => void;
}

const Auth = ({ setError, error, setIsAuthenticated }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleUser, setGoogleUser] = useState<User | null>(null);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      localStorage.setItem("auth", "true");
      setError("");
    } catch {
      setError("Email or Password is not correct");
    }
  };

  const handleLogIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      localStorage.setItem("auth", "true");
      setError("");
    } catch {
      setError("There is already an account with this email");
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
      setError("Google sign-in failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-gradient bg-light">
      <div
        className="card shadow-lg p-4 animate__animated animate__fadeInUp"
        style={{ maxWidth: "420px", width: "100%", borderRadius: "20px" }}
      >
        <h3 className="text-center mb-4 fw-bold text-primary">Welcome🚀</h3>
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
        {error && (
          <p className="text-danger small text-center mb-2 animate__animated animate__shakeX">
            {error}
          </p>
        )}
        <div className="d-grid gap-2 mb-3">
          <button className="btn btn-primary btn-lg" onClick={handleSignIn}>
            Sign In
          </button>
          <button className="btn btn-secondary btn-lg" onClick={handleLogIn}>
            Register
          </button>
        </div>
        <div className="d-flex align-items-center justify-content-between p-2 border rounded bg-white shadow-sm">
          <button
            className="btn  w-100 d-flex align-items-center justify-content-center"
            onClick={handleGoogleSignIn}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              width="20"
              height="20"
              className="me-2"
            />
            Sign In with Google
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
      </div>
    </div>
  );
};

export default Auth;
