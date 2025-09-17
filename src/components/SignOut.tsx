import { auth } from "../config/fireBase";
import { signOut } from "firebase/auth";

interface Props {
  setIsAuthenticated: (isAuth: boolean) => void;
  header: string;
}

function SignOut({ setIsAuthenticated, header }: Props) {
  const handleSignOut = async () => {
    await signOut(auth);
    console.log("User signed out successfully");
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
  };

  return (
    <button className="btn btn-sm mt-1 text-white" onClick={handleSignOut} style={{fontWeight: "bold", backgroundColor: header === "Task Notes" ? ("#ab0fda") : ("#0d6efd")}}>
      {" "}
      Sign Out{" "}
    </button>
  );
}

export default SignOut;
