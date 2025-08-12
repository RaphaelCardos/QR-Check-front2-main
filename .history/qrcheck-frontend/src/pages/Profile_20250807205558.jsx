import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import pattern from '../assets/pattern.png';
import TabQr from './tabs/TabQr';
import TabEventos from './tabs/TabEventos';
import TabInscri from './tabs/TabInscri';
import logo from "@/assets/logo.svg";

const QrCodeIcon = () => (/* ... */);
const CalendarIcon = () => (/* ... */);
const FileTextIcon = () => (/* ... */);

export default function Profile({ participantId }) {
  const [activeTab, setActiveTab] = useState("qr");
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);

  // 1. Carregar dados do participante (exemplo fetch)
  useEffect(() => {
    fetch(`/api/participants/${participantId}`)
      .then(res => res.json())
      .then(data => {
        setName(data.name);
        setAvatarUrl(data.avatarUrl);
      })
      .catch(() => {
        setName("Participante");
      });
  }, [participantId]);

  // 2. Handler de upload local
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setAvatarUrl(preview);
    // enviar ao backend:
    // const form = new FormData();
    // form.append('avatar', file);
    // fetch(`/api/participants/${participantId}/avatar`, { method: 'POST', body: form })
  };

  const tabs = [
    { id: "qr", label: "Meu QR", icon: QrCodeIcon },
    { id: "eventos", label: "Meus eventos", icon: CalendarIcon },
    { id: "inscri", label: "Minhas inscrições", icon: FileTextIcon },
  ];

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
        {/* Header do participante */}
        <div className="flex items-center space-x-4 px-4 md:px-10 mt-6">
          <div className="w-16 h-16 rounded-full overflow-hidden border">
            {avatarUrl
              ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-gray-200" />}
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{name}</h2>
            <label className="text-sm text-green-600 hover:underline cursor-pointer">
              Alterar foto
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 px-4 md:px-10 mt-4">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 rounded-t-xl border border-b-0 font-semibold transition flex items-center gap-2
                  ${isActive
                    ? "text-white border-[#03C04A]"
                    : "bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
                  }`}
                style={isActive ? { backgroundColor: '#03C04A' } : {}}
              >
                <Icon />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Conteúdo das Tabs */}
        <div
          className="flex-grow border rounded-b-xl bg-white p-6 mx-4 md:mx-10"
          style={{ borderColor: '#03C04A' }}
        >
          {activeTab === "qr" && <TabQr />}
          {activeTab === "eventos" && <TabEventos />}
          {activeTab === "inscri" && <TabInscri />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
