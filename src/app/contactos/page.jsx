"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactosPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    servico: "",
    mensagem: "",
  });

  const [status, setStatus] = useState({ tipo: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ tipo: "", msg: "" });

    // Validação básica
    if (!formData.nome || !formData.email || !formData.mensagem) {
      setStatus({ tipo: "erro", msg: "Por favor, preencha os campos obrigatórios (Nome, Email e Mensagem)." });
      setLoading(false);
      return;
    }

    try {
      // Ajuste o link abaixo se o endereço do seu WordPress local/produção for diferente
      const response = await fetch("http://localhost/aaaibwewp.com/wp-json/aaai/v1/contacto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.sucesso) {
        setStatus({ tipo: "sucesso", msg: "Mensagem enviada com sucesso! Brevemente entraremos em contacto." });
        setFormData({ nome: "", email: "", telefone: "", servico: "", mensagem: "" });
      } else {
        setStatus({ tipo: "erro", msg: data.mensagem || "Ocorreu um erro ao enviar a mensagem." });
      }
    } catch (error) {
      setStatus({ tipo: "erro", msg: "Erro de ligação ao servidor. Tente mais tarde." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gray-50">
      <section className="bg-angola-red text-white">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <h1 className="text-5xl font-bold">Contacte-nos</h1>
          <p className="mt-6 text-red-100 max-w-2xl">
            Estamos disponíveis para esclarecer dúvidas, prestar orientação migratória e apoiar o seu processo.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-14">
          
          {/* Formulário */}
          <div className="bg-white rounded-2xl shadow-lg p-10">
            <h2 className="text-3xl font-bold mb-8">Envie uma Mensagem</h2>
            
            {status.msg && (
              <div className={`p-4 mb-6 rounded-lg font-medium text-sm ${
                status.tipo === "sucesso" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}>
                {status.msg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Nome Completo *"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none"
                required
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email *"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none"
                required
              />

              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="Telefone"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none"
              />

              <select 
                name="servico"
                value={formData.servico}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value="">Selecione um serviço opcional</option>
                <option value="Vistos">Vistos</option>
                <option value="DIRE">DIRE</option>
                <option value="Tradução">Tradução</option>
                <option value="Apoio Jurídico">Apoio Jurídico</option>
                <option value="Consultoria">Consultoria</option>
                <option value="Emprego">Emprego</option>
              </select>

              <textarea
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                rows={6}
                placeholder="Escreva a sua mensagem... *"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none"
                required
              ></textarea>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-angola-red text-white py-4 rounded-lg hover:bg-red-700 transition font-bold disabled:opacity-50"
              >
                {loading ? "A enviar..." : "Enviar Mensagem"}
              </button>
            </form>
          </div>

          {/* Informações */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow">
              <p className="text-gray-600 mt-2"><i className="fas fa-location-dot text-3xl text-angola-red"></i> Endereço</p>
              <h3 className="font-bold text-xl mt-4">
                Zango Zero rua 1, Condóminio das Acácias, casa 38 - Luanda, Angola
              </h3>
            </div>

            <div className="bg-white rounded-xl p-8 shadow">
              <p className="text-gray-600 mt-2"><i className="fas fa-phone text-3xl text-angola-red"></i> Telefones</p>
              <h3 className="font-bold text-xl mt-4">(+244) 924 217 955</h3>
            </div>

            <div className="bg-white rounded-xl p-8 shadow">
              <p className="text-gray-600 mt-2"><i className="fas fa-envelope text-3xl text-angola-red"></i> Email</p>
              <h3 className="font-bold text-xl mt-4">geral@apoioimigrantes.com</h3>
            </div>

            <div className="bg-white rounded-xl p-8 shadow">
              <p className="text-gray-600 mt-2"> <i className="fas fa-clock text-3xl text-angola-red"></i> Horário</p>
              <h3 className="font-bold text-xl mt-4">Segunda a Sexta - 08h00 às 16h00</h3>
            </div>
          </div>

        </div>
      </section>

      <section className="bg-white border-t">
        <div className="max-w-5xl mx-auto py-16 text-center">
          <h2 className="text-3xl font-bold">Precisa de Atendimento Personalizado?</h2>
          <p className="text-gray-600 mt-4">Solicite um acompanhamento especializado da nossa equipa.</p>
          <Link href="/atendimento" className="inline-block mt-8 bg-angola-red text-white px-8 py-4 rounded-lg hover:bg-red-700">
            Solicitar Atendimento
          </Link>
        </div>
      </section>
    </main>
  );
}