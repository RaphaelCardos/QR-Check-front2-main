import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerParticipante } from "../services/participanteService";
import Footer from "../components/Footer";
import pattern from "../assets/pattern.png";
import logo from "@/assets/logo.svg";
import { FaRegRegistered } from "react-icons/fa6";

const Register = () => {
  const navigate = useNavigate();

  const [ocupacao, setOcupacao] = useState("");
  const [temNecessidade, setTemNecessidade] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    cpf: "",
    email: "",
    nascimento: "",
    ocupacao: "",
    nivelEnsino: "",
    instituicao: "",
    senha: "",
    confirmarSenha: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validações básicas
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
      console.log('📝 Dados do formulário:', formData);
      
      await registerParticipante({
        nome: formData.nome,
        sobrenome: formData.sobrenome,
        cpf: formData.cpf.replace(/\D/g, ''),
        email: formData.email,
        senha: formData.senha,
        data_nasc: formData.nascimento,
        ocupacao_id: 1, // Valor padrão temporário
        necessidades_especificas: temNecessidade ? [1] : [] // IDs de necessidades
      });
      
      navigate("/login"); // Redireciona para login após cadastro
    } catch (error) {
      console.error("Erro detalhado:", error);
      setError(error.message || "Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCPFChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      cpf: formatCPF(value)
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      {/* Fundo */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full opacity-90 bg-repeat-y bg-center bg-cover"
          style={{ backgroundImage: `url(${pattern})` }}
        ></div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 items-center bg-white justify-center">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-3xl z-20">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="QRCheck Logo" className="h-8 md:h-10" />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Nome e Sobrenome */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  placeholder="Digite seu nome"
                  className="w-full px-4 py-2 rounded bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Sobrenome</label>
                <input
                  type="text"
                  name="sobrenome"
                  value={formData.sobrenome}
                  onChange={handleInputChange}
                  required
                  placeholder="Digite seu sobrenome"
                  className="w-full px-4 py-2 rounded bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
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
                className="w-full px-4 py-2 rounded bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
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
                className="w-full px-4 py-2 rounded bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
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
                className="w-full px-4 py-2 rounded bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Senha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="w-full px-4 py-2 rounded bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
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
            </div>

            {/* Ocupação */}
            <div>
              <label className="block text-sm mb-1">Ocupação</label>
              <select
                name="ocupacao"
                value={formData.ocupacao}
                onChange={(e) => {
                  setOcupacao(e.target.value);
                  handleInputChange(e);
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
              className={`w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition font-bold ${
                loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cadastrando...
                </>
              ) : (
                <>
                  <FaRegRegistered className="inline mr-2" />
                  Criar Conta
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className="text-green-600 hover:underline font-semibold underline cursor-pointer"
              >
                Voltar ao login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;