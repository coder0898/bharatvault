import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./page/auth/Auth.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import Home from "./page/home/Home.jsx";

function App() {
  function checkEnv() {
    console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
    console.log(
      "VITE_FIREBASE_API_KEY:",
      import.meta.env.VITE_FIREBASE_API_KEY
    );
    console.log(
      "VITE_FIREBASE_PROJECT_ID:",
      import.meta.env.VITE_FIREBASE_PROJECT_ID
    );
  }

  checkEnv();
  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
