import React, { useState } from 'react';
import clsx from 'clsx';
import Footer from '../components/Footer';
import pattern from '../assets/pattern.png';
import TabQr from './tabs/TabQr';
import TabEventos from './tabs/TabEventos';
import TabInscri from './tabs/TabInscri';
import logo from '@/assets/logo.svg';

// Ícones SVG inline extraídos em um objeto
const Icons = {
  qr: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="5" height="5" x="3" y="3" rx="1"/>
      <rect width="5" height="5" x="16" y="3" rx="1"/>
      <rect width="5" height="5" x="3" y="16" rx="1"/>
      <path d="m21 16-3.5-3.5-3.5 3.5"/>
      <path d="m21 21-3.5-3.5-3.5 3.5"/>
    </svg>
  ),
  eventos: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v4"/>
      <path d="M16 2v4"/>
      <rect width="18" height="18" x="3" y="4" rx="2"/>
      <path d="M3 10h18"/>
    </svg>
  ),
  inscri: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
      <path d="M10 9H8"/>
      <path d="M16 13H8"/>
      <path d="M16 17H8"/>
    </svg>
  ),
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState('qr');

  const tabs = [
    { id: 'qr',     label: 'Meu QR' },
    { id: 'eventos',label: 'Meus eventos' },
    { id: 'inscri', label: 'Minhas inscrições' },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 bg-repeat-y bg-center bg-cover opacity-90"
           style={{ backgroundImage: `url(${pattern})` }} />

      {/* Logo */}
      <header className="flex justify-center pt-6 z-10">
        <img src={logo} alt="QRCheck Logo" className="h-10 md:h-12" />
      </header>

      <main className="flex-grow flex flex-col relative z-10">
        {/* Tabs */}
        <nav className="flex space-x-2 px-4 md:px-10 pt-8">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              aria-pressed={activeTab === id}
              className={clsx(
                'flex items-center gap-2 px-4 py-3 rounded-t-xl border font-semibold transition',
                'border-b-0',
                activeTab === id
                  ? 'bg-[#03C04A] text-white border-[#03C04A]'
                  : 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100'
              )}
            >
              {Icons[id]()}
              {label}
            </button>
          ))}
        </nav>

        {/* Conteúdo das Tabs */}
        <section
          className="flex-grow bg-white rounded-b-xl border p-6 mx-4 md:mx-10"
          style={{ borderColor: '#03C04A' }}
        >
          {activeTab === 'qr'      && <TabQr />}
          {activeTab === 'eventos' && <TabEventos />}
          {activeTab === 'inscri'  && <TabInscri />}
        </section>
      </main>

      <Footer />
    </div>
  );
}
