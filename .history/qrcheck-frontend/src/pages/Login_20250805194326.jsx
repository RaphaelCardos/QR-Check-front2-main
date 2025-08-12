import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import pattern from '../assets/pattern.png';
import logo from "@/assets/logo.svg";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      {/* Fundo com padrão */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full opacity-90 bg-repeat-y bg-center bg-cover"
          style={{ backgroundImage: `url(${pattern})` }}
        ></div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 items-center bg-white justify-center">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-sm z-20">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="QRCheck Logo" className="h-8 md:h-10" />
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Insira suas credenciais:</label>
              <input
                type="text"
                placeholder="Email"
                className="w-full px-4 py-2 rounded bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Senha"
                className="w-full px-4 py-2 rounded bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition font-bold cursor-pointer"
            >
              Acessar meu perfil
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-green-600 hover:underline font-semibold underline cursor-pointer">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
