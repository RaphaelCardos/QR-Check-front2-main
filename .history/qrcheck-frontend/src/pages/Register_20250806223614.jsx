// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerParticipante } from "../services/participanteService";
import Footer from "../components/Footer";
import pattern from "../assets/pattern.png";
import logo from "@/assets/logo.svg";
import { FaRegRegistered } from "react-icons/fa6";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    cpf: "",
    email: "",
    nascimento: "",
    ocupacao: "",
    senha: "",
    confirmarSenha: ""
  });
  const [temNecessidade, setTemNecessidade] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [fieldErrors, setFieldErrors]   = useState({});

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatCPF = value =>
    value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");

  const handleCPFChange = e => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, cpf: formatCPF(value) }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    // Validações client-side
    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }
    if (!formData.nome || !formData.sobrenome) {
      setError("Nome e sobrenome são obrigatórios");
      setLoading(false);
      return;
    }

    try {
      await registerParticipante({
        nome: formData.nome,
        sobrenome: formData.sobrenome,
        cpf: formData.cpf,
        email: formData.email,
        senha: formData.senha,
        data_nasc: formData.nascimento,
        ocupacao_id: 1,
        necessidades_especificas: temNecessidade ? [1] : []
      });

      navigate("/login");
    } catch (err) {
      console.error("Erro detalhado:", err);

      // Se vier fieldErrors do service
      if (Array.isArray(err.fieldErrors)) {
        const errs = {};
        err.fieldErrors.forEach(({ field, message }) => {
          // mapeia field nomes de backend para names do form
          if (field === "data_nasc") field = "nascimento";
          errs[field] = message;
        });
        setFieldErrors(errs);
      } else {
        // mensagem geral
        setError(err.response?.data?.detail?.[0]?.msg || err.message || "Erro ao cadastrar");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full opacity-90 bg-repeat-y bg-center bg-cover"
          style={{ backgroundImage: `url(${pattern})` }}
        />
      </div>

      <div className="flex flex-1 items-center justify-center z-20">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-3xl">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="QRCheck Logo" className="h-8 md:h-10" />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div>
              <label className="block text-sm mb-1">Nome</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
                placeholder="Digite seu nome"
                className={`w-full px-4 py-2 rounded bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  fieldErrors.nome ? "border-red-500" : ""
                }`}
              />
              {fieldErrors.nome && (
                <p className="text-red-600 text-sm mt-1">{fieldErrors.nome}</p>
              )}
            </div>

            {/* Sobrenome */}
            <div>
              <label className="block text-sm mb-1">Sobrenome</label>
              <input
                type="text"
                name="sobrenome"
                value={formData.sobrenome}
                onChange={handleInputChange}
                required
                placeholder="Digite seu sobrenome"
                className={`w-full px-4 py-2 rounded bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  fieldErrors.sobrenome ? "border-red-500" : ""
                }`}
              />
              {fieldErrors.sobrenome && (
                <p className="text-red-600 text-sm mt-1">{fieldErrors.sobrenome}</p>
              )}
            </div>

            {/* CPF */}
            <div>
              <label className="block text-sm mb-1">CPF</label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleCPFChange}
                required
                placeholder="000.000.000-00"
                maxLength="14"
                className={`w-full px-4 py-2 rounded bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  fieldErrors.cpf ? "border-red-500" : ""
                }`}
              />
              {fieldErrors.cpf && (
                <p className="text-red-600 text-sm mt-1">{fieldErrors.cpf}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="seu@email.com"
                className={`w-full px-4 py-2 rounded bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  fieldErrors.email ? "border-red-500" : ""
                }`}
              />
              {fieldErrors.email && (
                <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Data de Nascimento */}
            <div>
              <label className="block text-sm mb-1">Data de Nascimento</label>
              <input
                type="date"
                name="nascimento"
                value={formData.nascimento}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 rounded bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  fieldErrors.nascimento ? "border-red-500" : ""
                }`}
              />
              {fieldErrors.nascimento && (
                <p className="text-red-600 text-sm mt-1">{fieldErrors.nascimento}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm mb-1">Senha</label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleInputChange}
                required
                minLength="6"
                placeholder="Mínimo 6 caracteres"
                className={`w-full px-4 py-2 rounded bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  fieldErrors.senha ? "border-red-500" : ""
                }`}
              />
              {fieldErrors.senha && (
                <p className="text-red-600 text-sm mt-1">{fieldErrors.senha}</p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="block text-sm mb-1">Confirme a Senha</label>
              <input
                type="password"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleInputChange}
                required
                placeholder="Repita a senha"
                className="w-full px-4 py-2 rounded bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Ocupação */}
            <div>
              <label className="block text-sm mb-1">Ocupação</label>
              <select
                name="ocupacao"
                value={formData.ocupacao}
                onChange={e => {
                  handleInputChange(e);
                  setOcupacao(e.target.value);
                }}
                required
                className="w-full px-4 py-2 rounded bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Selecione...</option>
                <option value="estudante">Estudante</option>
                <option value="professor">Professor</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            {/* Necessidades Específicas */}
            <div>
              <label className="block text-sm mb-1">Possui Necessidades Específicas?</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="necessidadesRadio"
                    checked={temNecessidade === true}
                    onChange={() => setTemNecessidade(true)}
                  />
                  Sim
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="necessidadesRadio"
                    checked={temNecessidade === false}
                    onChange={() => setTemNecessidade(false)}
                  />
                  Não
                </label>
              </div>
            </div>

            {/* Botão de Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-500 text-white py-2 rounded font-bold transition ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-600'
              }`}
            >
              {loading ? 'Cadastrando...' : <><FaRegRegistered className="inline mr-2" />Criar Conta</>}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-green-600 hover:underline font-semibold">
                Voltar ao login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
