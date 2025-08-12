// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerParticipante } from "../services/participanteService";
import { listarOcupacoes }      from "../services/ocupacaoService";
import Footer from "../components/Footer";
import pattern from "../assets/pattern.png";
import logo from "@/assets/logo.svg";
import { FaRegRegistered } from "react-icons/fa6";

export default function Register() {
  const navigate = useNavigate();

  // estados do form
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    cpf: "",
    email: "",
    data_nasc: "",         // note name = data_nasc
    ocupacao_id: "",       // armazenará o ID (string por enquanto)
    senha: "",
    confirmarSenha: ""
  });

  const [ocupacoes, setOcupacoes]       = useState([]);
  const [temNecessidade, setTemNecessidade] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [fieldErrors, setFieldErrors]   = useState({});

  // carrega ocupações ao montar
  useEffect(() => {
    listarOcupacoes()
      .then(data => setOcupacoes(data))
      .catch(err => console.error("Erro ao listar ocupações:", err));
  }, []);

  const handleInputChange = e => {
    let { name, value } = e.target;
    // se for ocupacao_id, converte para número
    if (name === "ocupacao_id") {
      value = parseInt(value);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatCPF = v =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");

  const handleCPFChange = e => {
    const cpf = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    // validações client
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
        data_nasc: formData.data_nasc,        // bate com schema
        ocupacao_id: formData.ocupacao_id,     // número agora
        senha: formData.senha,
        necessidades_especificas: temNecessidade ? [1] : []
      });
      navigate("/login");
    } catch (err) {
      console.error("Erro detalhado:", err);
      if (err.fieldErrors && typeof err.fieldErrors === "object") {
        setFieldErrors(err.fieldErrors);
      } else {
        const msg = err.response?.data?.detail?.[0]?.msg;
        setError(msg || err.message || "Erro ao cadastrar");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      {/* Fundo */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full opacity-90 bg-repeat-y bg-center bg-cover"
          style={{ backgroundImage: `url(${pattern})` }}
        />
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 items-center justify-center z-20">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="QRCheck Logo" className="h-10" />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm mb-1">Nome</label>
              <input
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded bg-green-100 focus:ring-2 ${
                  fieldErrors.nome ? "border-red-500" : ""
                }`}
                placeholder="João"
              />
              {fieldErrors.nome && (
                <p className="text-red-600 text-xs">{fieldErrors.nome}</p>
              )}
            </div>

            {/* Sobrenome */}
            <div>
              <label className="block text-sm mb-1">Sobrenome</label>
              <input
                name="sobrenome"
                value={formData.sobrenome}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded bg-green-100 focus:ring-2 ${
                  fieldErrors.sobrenome ? "border-red-500" : ""
                }`}
                placeholder="Silva"
              />
              {fieldErrors.sobrenome && (
                <p className="text-red-600 text-xs">{fieldErrors.sobrenome}</p>
              )}
            </div>

            {/* CPF */}
            <div>
              <label className="block text-sm mb-1">CPF</label>
              <input
                name="cpf"
                value={formData.cpf}
                onChange={handleCPFChange}
                maxLength="14"
                placeholder="000.000.000-00"
                className={`w-full px-4 py-2 rounded bg-green-100 focus:ring-2 ${
                  fieldErrors.cpf ? "border-red-500" : ""
                }`}
              />
              {fieldErrors.cpf && (
                <p className="text-red-600 text-xs">{fieldErrors.cpf}</p>
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
                className={`w-full px-4 py-2 rounded bg-green-100 focus:ring-2 ${
                  fieldErrors.email ? "border-red-500" : ""
                }`}
                placeholder="seu@email.com"
              />
              {fieldErrors.email && (
                <p className="text-red-600 text-xs">{fieldErrors.email}</p>
              )}
            </div>

            {/* Data de Nascimento */}
            <div>
              <label className="block text-sm mb-1">Data de Nascimento</label>
              <input
                type="date"
                name="data_nasc"
                value={formData.data_nasc}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded bg-green-100 focus:ring-2 ${
                  fieldErrors.data_nasc ? "border-red-500" : ""
                }`}
              />
              {fieldErrors.data_nasc && (
                <p className="text-red-600 text-xs">{fieldErrors.data_nasc}</p>
              )}
            </div>

            {/* Ocupação */}
            <div>
              <label className="block text-sm mb-1">Ocupação</label>
              <select
                name="ocupacao_id"
                value={formData.ocupacao_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-green-100 focus:ring-2"
              >
                <option value="">Selecione...</option>
                {ocupacoes.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.nome}
                  </option>
                ))}
              </select>
              {fieldErrors.ocupacao_id && (
                <p className="text-red-600 text-xs">{fieldErrors.ocupacao_id}</p>
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
                minLength={6}
                className={`w-full px-4 py-2 rounded bg-green-100 focus:ring-2 ${
                  fieldErrors.senha ? "border-red-500" : ""
                }`}
                placeholder="Mínimo 6 caracteres"
              />
              {fieldErrors.senha && (
                <p className="text-red-600 text-xs">{fieldErrors.senha}</p>
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
                className="w-full px-4 py-2 rounded bg-green-100 focus:ring-2"
                placeholder="Repita a senha"
              />
            </div>

            {/* Necessidades */}
            <div>
              <label className="block text-sm mb-1">
                Necessidades Específicas?
              </label>
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    name="necessidades_especificas"
                    value="true"
                    checked={temNecessidade}
                    onChange={() => setTemNecessidade(true)}
                  />{" "}
                  Sim
                </label>
                <label>
                  <input
                    type="radio"
                    name="necessidades_especificas"
                    value="false"
                    checked={!temNecessidade}
                    onChange={() => setTemNecessidade(false)}
                  />{" "}
                  Não
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded font-bold text-white ${
                loading ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Cadastrando..." : <><FaRegRegistered className="inline mr-2" />Criar Conta</>}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            Já tem conta?{" "}
            <Link to="/login" className="text-green-600 hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
