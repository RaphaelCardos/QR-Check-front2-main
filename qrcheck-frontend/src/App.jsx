// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home      from './pages/Home';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Profile   from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/"        element={<Home />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rotas protegidas */}
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      {/* coloque aqui outras rotas que exigem login */}

      {/* Fallback 404 */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;
