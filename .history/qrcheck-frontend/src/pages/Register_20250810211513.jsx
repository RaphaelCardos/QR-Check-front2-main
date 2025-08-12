// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerParticipante } from "../services/participanteService";
import { listarOcupacoes } from "../services/ocupacaoService";
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
    data_nasc: "",
    ocupacao_id: "",
    senha: "",
    confirmarSenha: "",
    necessidades_especificas: [],
  });

  const [ocupacoes, setOcupacoes] = useState([]);
  const [temNecessidade, setTemNecessidade] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // carrega ocupações ao montar
  useEffect(() => {
    listarOcupacoes()
      .then((data) => setOcupacoes(data))
      .catch((err) => console.error("Erro ao listar ocupações:", err));
  }, []);

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    if (name === "ocupacao_id") {
      // permite vazio (placeholder) e número para o backend
      value = value === "" ? "" : parseInt(value, 10);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatCPF = (v) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");

  const handleCPFChange = (e) => {
    const cpf = formatCPF(e.target.value);
    setFormData((prev) => ({ ...prev, cpf }));
  };

  const handleSubmit = async (e) => {
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
        data_nasc: formData.data_nasc,
        ocupacao_id: formData.ocupacao_id || 1, // se seu backend exige default, mantenha; se não, remova o fallback
        senha: formData.senha,
        necessidades_especificas: temNecessidade ? [1] : [],
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
      <div className="flex flex-1 items-center justify-center z-20 px-4">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-2xl">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="QRCheck Logo" className="h-10" />
          </div>

          {(formData.nome || formData.sobrenome) && (
            <div className="mb-6 p-3 bg-green-50 text-green-900 rounded text-sm">
              Nome completo sugerido:{" "}
              <strong>{`${formData.nome} ${formData.sobrenome}`.trim()}</strong>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* GRID RESPONSIVO: 1 coluna no mobile, 2 colunas a partir de md */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div>
                <label className="block text-sm mb-1" htmlFor="nome">
                  Nome
                </label>
                <input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  aria-invalid={!!fieldErrors.nome}
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
                <label className="block text-sm mb-1" htmlFor="sobrenome">
                  Sobrenome
                </label>
                <input
                  id="sobrenome"
                  name="sobrenome"
                  value={formData.sobrenome}
                  onChange={handleInputChange}
                  aria-invalid={!!fieldErrors.sobrenome}
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
                <label className="block text-sm mb-1" htmlFor="cpf">
                  CPF
                </label>
                <input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleCPFChange}
                  maxLength="14"
                  placeholder="000.000.000-00"
                  aria-invalid={!!fieldErrors.cpf}
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
                <label className="block text-sm mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  aria-invalid={!!fieldErrors.email}
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
                <label className="block text-sm mb-1" htmlFor="data_nasc">
                  Data de Nascimento
                </label>
                <input
                  id="data_nasc"
                  type="date"
                  name="data_nasc"
                  value={formData.data_nasc}
                  onChange={handleInputChange}
                  aria-invalid={!!fieldErrors.data_nasc}
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
                <label className="block text-sm mb-1" htmlFor="ocupacao_id">
                  Ocupação
                </label>
                <select
                  id="ocupacao_id"
                  name="ocupacao_id"
                  value={formData.ocupacao_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded bg-green-100 focus:ring-2"
                >
                  <option value="">Selecione...</option>
                  <option value="2"> Estudante</option>
                  <option value="3"> Professor</option>
                  <option value="4"> Empresário</option>
                  <option value="5"> Autônomo</option>
                  <option value="6"> Trabalho Formal ou Assalariado</option>
                  
                </select>
                {fieldErrors.ocupacao_id && (
                  <p className="text-red-600 text-xs">
                    {fieldErrors.ocupacao_id}
                  </p>
                )}
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm mb-1" htmlFor="senha">
                  Senha
                </label>
                <input
                  id="senha"
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  minLength={6}
                  aria-invalid={!!fieldErrors.senha}
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
                <label className="block text-sm mb-1" htmlFor="confirmarSenha">
                  Confirme a Senha
                </label>
                <input
                  id="confirmarSenha"
                  type="password"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded bg-green-100 focus:ring-2"
                  placeholder="Repita a senha"
                />
              </div>

              {/* Necessidades (spana 2 colunas no md+) */}
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">
                  Necessidades Específicas?
                </label>
                <div className="flex gap-6">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="necessidades_especificas"
                      value="true"
                      checked={temNecessidade}
                      onChange={() => setTemNecessidade(true)}
                    />
                    <span>Sim</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="necessidades_especificas"
                      value="false"
                      checked={!temNecessidade}
                      onChange={() => setTemNecessidade(false)}
                    />
                    <span>Não</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded font-bold text-white ${
                loading
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? (
                "Cadastrando..."
              ) : (
                <>
                  <FaRegRegistered className="inline mr-2" />
                  Criar Conta
                </>
              )}
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
