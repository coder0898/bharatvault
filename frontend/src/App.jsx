import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./page/auth/Auth.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import Home from "./page/home/Home.jsx";

function App() {
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
