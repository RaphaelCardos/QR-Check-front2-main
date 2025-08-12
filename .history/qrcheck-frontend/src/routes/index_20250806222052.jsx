// routes/index.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import ConnectionTest  from "../components/ConnectionTest";
import PrivateRoute    from "PrivateRouter";
import '../index.css';

const Router = () => (
  <Routes>
    {/* Públicas */}
    <Route path="/"        element={<Home />} />
    <Route path="/login"   element={<Login />} />
    <Route path="/register"element={<Register />} />

    {/* Protegidas */}
    <Route
      path="/profile"
      element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      }
    />
    <Route
      path="/test"
      element={
        <PrivateRoute>
          <ConnectionTest />
        </PrivateRoute>
      }
    />

    {/* Qualquer outra rota */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default Router;
