// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../services/authService';
import { getParticipantePerfil } from '../services/participanteService';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tenta restaurar a sessão pelo token salvo
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    getParticipantePerfil()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('access_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { access_token } = await apiLogin(email, password);
    if (access_token) {
      localStorage.setItem('access_token', access_token);
    }
    const perfil = await getParticipantePerfil();
    setUser(perfil);
    navigate('/profile', { replace: true });
  };

  const logout = async () => {
    localStorage.removeItem('access_token');
    setUser(null);
    navigate('/login', { replace: true });
  };

  const value = { user, loading, login, logout, setUser };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// // src/context/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { login as apiLogin } from '../services/authService';           // ⇦ ajuste caminhos
// import {
//   getParticipantePerfil,
//   logout as apiLogout,
// } from '../services/participanteService';

// const AuthContext = createContext();

// /**
//  * Hook de consumo – use const { user, login, logout } = useAuth();
//  */
// export const useAuth = () => useContext(AuthContext);


// export function AuthProvider({ children }) {
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);   // objeto de perfil (ou null)
//   const [loading, setLoading] = useState(true);

//   // Executa uma vez – tenta restaurar sessão pelo token salvo
//   useEffect(() => {
//     const token = localStorage.getItem('access_token');
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     // carrega perfil
//     getParticipantePerfil()
//       .then(setUser)
//       .catch(() => {
//         localStorage.removeItem('access_token');
//         setUser(null);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   /** Faz login, grava token e perfil */
//   const login = async (email, password) => {
//     const { access_token } = await apiLogin(email, password); // seu authService
//     localStorage.setItem('access_token', access_token);
//     const perfil = await getParticipantePerfil();
//     setUser(perfil);
//     navigate('/profile', { replace: true });
//   };

//   /** Desloga, limpa tudo e volta ao /login */
//   const logout = async () => {
//     try {
//       await apiLogout(); // opcional – invalida token no servidor
//     } catch (_) {
//       /* ignore */
//     }
//     localStorage.removeItem('access_token');
//     setUser(null);
//     navigate('/login', { replace: true });
//   };

//   const value = { user, loading, login, logout, setUser };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }
