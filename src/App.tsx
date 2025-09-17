import { useEffect, useState } from "react";
import Auth from "./components/Auth";
import MainApp from "./MainApp";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("auth") === "true"
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  return !isAuthenticated ? (
    <Auth
      setError={setError}
      error={error}
      setIsAuthenticated={setIsAuthenticated}
    />
  ) : (
    <MainApp setIsAuthenticated={setIsAuthenticated} />
  );
};

export default App;
