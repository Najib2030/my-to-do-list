import Auth from "./components/Auth";
import { useEffect, useState } from "react";
import MainApp from "./MainApp";

const App = () => {
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("auth") === "true"
  );

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
