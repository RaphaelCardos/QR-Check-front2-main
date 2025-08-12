// src/pages/Login.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import pattern from "../assets/pattern.png";
import logo from "@/assets/logo.svg";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      console.error("Login falhou:", err.response?.data || err.message);
      setError("E-mail ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      {/* Fundo com padrão */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full opacity-90 bg-repeat-y bg-center bg-cover"
          style={{ backgroundImage: `url(${pattern})` }}
        />
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 items-center justify-center z-20">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-sm">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="QRCheck Logo" className="h-8 md:h-10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-red-600 text-center text-sm">{error}</p>
            )}

            <div>
              <label className="block text-sm mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@exemplo.com"
                required
                className="w-full px-4 py-2 rounded bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 rounded bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-500 text-white py-2 rounded font-bold transition ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
              }`}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm">
              Não tem uma conta?{" "}
              <Link
                to="/register"
                className="text-green-600 hover:underline font-semibold"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
