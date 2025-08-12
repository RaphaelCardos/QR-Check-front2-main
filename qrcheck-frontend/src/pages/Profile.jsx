// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import pattern from '../assets/pattern.png';
import TabQr from './tabs/TabQr';
import TabEventos from './tabs/TabEventos';
import TabInscri from './tabs/TabInscri';
import logo from '@/assets/logo.svg';

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
    <path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>
  </svg>
);
const FileTextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
    <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
    <path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

export default function Profile() {
  const [activeTab, setActiveTab] = useState('qr');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  // Protege a rota: se não houver usuário após carregar, vai para login
  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true });
  }, [loading, user, navigate]);

  const tabs = [
    { id: 'qr', label: 'Meu QR', icon: QrCodeIcon },
    { id: 'eventos', label: 'Meus eventos', icon: CalendarIcon },
    { id: 'inscri', label: 'Minhas inscrições', icon: FileTextIcon },
    { id: 'logout', label: 'Sair', icon: LogoutIcon },
  ];

  const handleTabClick = (tabId) => {
    if (tabId === 'logout') setShowLogoutConfirm(true);
    else setActiveTab(tabId);
  };

  const confirmLogout = async () => {
    try {
      await logout(); // limpa token e estado via AuthContext
    } finally {
      setShowLogoutConfirm(false);
      navigate('/login');
    }
  };

  // Loader enquanto busca o perfil
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-green-700">Carregando...</div>
      </div>
    );
  }

  // Evita flash caso redirecione
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full opacity-90 bg-repeat-y bg-center bg-cover"
          style={{ backgroundImage: `url(${pattern})` }}
        />
      </div>

      {/* Logo */}
      <div className="flex justify-center pt-6 z-10">
        <img src={logo} alt="QRCheck Logo" className="h-10 md:h-12" />
      </div>

      <main className="flex-grow flex flex-col relative z-10">
        <div className="flex flex-col flex-grow pt-8 pb-0">
          {/* Saudação opcional */}
          <div className="px-4 md:px-10 mb-3 text-green-900">
            <span className="text-sm">Bem-vindo(a),</span>{' '}
            <strong className="font-semibold">{user?.nome} {user?.sobrenome}</strong>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 px-4 md:px-10" role="tablist" aria-label="Navegação do perfil">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  role="tab"
                  aria-selected={isActive}
                  className={`px-4 py-3 rounded-t-xl border border-b-0 font-semibold transition flex items-center gap-2
                    ${isActive
                      ? 'bg-[#03C04A] text-white border-[#03C04A]'
                      : 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100'
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
            role="tabpanel"
          >
            {activeTab === 'qr' && <TabQr user={user} />}
            {activeTab === 'eventos' && <TabEventos user={user} />}
            {activeTab === 'inscri' && <TabInscri user={user} />}
          </div>
        </div>
      </main>

      {/* Modal de confirmação */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => { if (e.target === e.currentTarget) setShowLogoutConfirm(false); }}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold mb-2">Deseja sair?</h2>
            <p className="text-sm text-gray-600 mb-6">Você voltará para a tela de login.</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
              >
                Não
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
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
