import { auth } from "../config/fireBase";
import { signOut } from "firebase/auth";

interface Props {
  setIsAuthenticated: (isAuth: boolean) => void;
}

function SignOut({ setIsAuthenticated }: Props) {
  const handleSignOut = async () => {
    await signOut(auth);
    console.log("User signed out successfully");
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
  };

  return (
    <button className="btn btn-sm mt-1 btn-primary" onClick={handleSignOut}>
      {" "}
      Sign Out{" "}
    </button>
  );
}

export default SignOut;
