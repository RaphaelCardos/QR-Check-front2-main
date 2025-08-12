import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import pattern from '../assets/pattern.png';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full opacity-90 bg-repeat-y bg-center bg-cover" style={{backgroundImage: `url(${pattern})` }}></div>
        </div>
        
        <div className="container mx-auto px-4 py-10 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start mb-16">
            <div className="md:w-3/4 mb-10 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Gerencie seu <span className="text-green-500">evento</span>
                <br />de forma simplificada!
                <div className="h-1 w-96 bg-green-500 mt-2"></div>
              </h2>
              
              <p className="text-lg font-bold mb-6">Confira algumas funcionalidades:</p>
              
              <ul className="list-disc list-inside text-lg font-bold space-y-2">
              <li>Criação e gestão de eventos personalizados.</li>
              <li>Controle de check-in de participantes com QR Code.</li>
              <li>Gestão de inscrições e participantes.</li>
              <li>Relatórios completos de presença.</li>
              <li>Área exclusiva para organizadores e participantes.</li>
            </ul>

              <div className="mt-10 flex items-center space-x-4">
              <p className="text-lg font-bold whitespace-nowrap">
                Tá esperando mais o quê? Não pense muito, é rápido!
              </p>
              <Link to="/register">
                <button className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-lg font-bold cursor-pointer">
                  Quero criar meu evento!
                </button>
              </Link>
            </div>
            </div>
            
            <div className="md:w-1/3">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">
                  É apenas <span className="text-green-500">participante</span>?
                </h3>
                <Link to="/login">
                  <button className="bg-white px-6 py-3 border border-green-500 text-green-500 rounded-md hover:bg-green-50 transition font-bold cursor-pointer">
                    Acessar meu perfil
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};
