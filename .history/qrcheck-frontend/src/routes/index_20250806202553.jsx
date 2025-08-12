// routes/index.jsx
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Profile from "../pages/Profile";
import Register from "@/pages/Register";
import ConnectionTest from "../components/ConnectionTest";
import '../index.css';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/register" element={<Register />} />
      <Route path="/test" element={<ConnectionTest />} />
    </Routes>
  );
};

export default Router;