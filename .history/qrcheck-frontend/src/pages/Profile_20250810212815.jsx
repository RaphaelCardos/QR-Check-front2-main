import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import pattern from '../assets/pattern.png';
import TabQr from './tabs/TabQr';
import TabEventos from './tabs/TabEventos';
import TabInscri from './tabs/TabInscri';
import logo from "@/assets/logo.svg";

// Ícones SVG
const QrCodeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="5" height="5" x="3" y="3" rx="1"/>
    <rect width="5" height="5" x="16" y="3" rx="1"/>
    <rect width="5" height="5" x="3" y="16" rx="1"/>
    <path d="m21 16-3.5-3.5-3.5 3.5"/>
    <path d="m21 21-3.5-3.5-3.5 3.5"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v4"/>
    <path d="M16 2v4"/>
    <rect width="18" height="18" x="3" y="4" rx="2"/>
    <path d="M3 10h18"/>
  </svg>
);

const FileTextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
    <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
    <path d="M10 9H8"/>
    <path d="M16 13H8"/>
    <path d="M16 17H8"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

export default function Profile() {
  const [activeTab, setActiveTab] = useState("qr");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const tabs = [
    { id: "qr", label: "Meu QR", icon: QrCodeIcon },
    { id: "eventos", label: "Meus eventos", icon: CalendarIcon },
    { id: "inscri", label: "Minhas inscrições", icon: FileTextIcon },
    { id: "logout", label: "Sair", icon: LogoutIcon },
  ];

  const handleTabClick = (tabId) => {
    if (tabId === "logout") {
      setShowLogoutConfirm(true);
    } else {
      setActiveTab(tabId);
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem("access_token"); // remove token se houver
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full opacity-90 bg-repeat-y bg-center bg-cover"
          style={{ backgroundImage: `url(${pattern})` }}
        />
      </div>

      {/* Logo no topo */}
      <div className="flex justify-center pt-6 z-10">
        <img src={logo} alt="QRCheck Logo" className="h-10 md:h-12" />
      </div>

      <main className="flex-grow flex flex-col relative z-10">
        <div className="flex flex-col flex-grow pt-8 pb-0">
          {/* Tabs estilo guia */}
          <div className="flex space-x-2 px-4 md:px-10">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-4 py-3 rounded-t-xl border border-b-0 font-semibold transition flex items-center gap-2
                    ${isActive
                      ? "bg-[#03C04A] text-white border-[#03C04A]"
                      : "bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
                    }`}
                >
                  <IconComponent />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Conteúdo */}
          <div
            className="flex-grow border rounded-b-xl bg-white p-6 mx-4 md:mx-10"
            style={{ borderColor: '#03C04A' }}
          >
            {activeTab === "qr" && <TabQr />}
            {activeTab === "eventos" && <TabEventos />}
            {activeTab === "inscri" && <TabInscri />}
          </div>
        </div>
      </main>

      {/* Modal de confirmação */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Deseja sair?</h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Não
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
