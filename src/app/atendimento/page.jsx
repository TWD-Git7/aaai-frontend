"use client";

import { useState } from "react";
import Link from "next/link";

export default function AtendimentoPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    nacionalidade: "",
    documento: "",
    servico: "Vistos e DIRE",
    atendimento: "Presencial",
    assunto: "",
    mensagem: "",
  });
  const [files, setFiles] = useState(null);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleFileChange(e) {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (files) {
        for (let i = 0; i < files.length; i++) {
          formData.append("anexos", files[i]);
        }
      }

      const res = await fetch("/api/atendimento", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setStatus({
          type: "success",
          message: "A sua solicitação foi enviada com sucesso! A nossa equipa analisará o caso nas próximas 24-48h.",
        });
        
        setForm({
          nome: "",
          email: "",
          telefone: "",
          nacionalidade: "",
          documento: "",
          servico: "Vistos e DIRE",
          atendimento: "Presencial",
          assunto: "",
          mensagem: "",
        });
        setFiles(null);
        e.target.reset();
      } else {
        setStatus({
          type: "error",
          message: data.message || "Ocorreu um erro ao processar a solicitação. Por favor, tente novamente.",
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: "Falha de ligação com o servidor. Verifique a sua internet.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-gray-50">
      {/* Hero */}
      <section className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <span className="uppercase tracking-widest text-red-200 font-semibold">
            Atendimento
          </span>
          <h1 className="text-5xl font-bold mt-4">Solicitar Atendimento</h1>
          <p className="mt-6 max-w-3xl text-lg text-red-100">
            A nossa equipa está preparada para analisar o seu caso e prestar
            orientação personalizada de forma segura, confidencial e profissional.
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Informações */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-8">
              <div className="w-14 h-14 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-2xl mb-5">
                <i className="fas fa-user-check"></i>
              </div>
              <h3 className="font-bold text-xl">Atendimento Personalizado</h3>
              <p className="mt-3 text-gray-600 leading-7">
                Cada pedido é analisado individualmente por profissionais da associação.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-8">
              <div className="w-14 h-14 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-2xl mb-5">
                <i className="fas fa-lock"></i>
              </div>
              <h3 className="font-bold text-xl">Confidencialidade</h3>
              <p className="mt-3 text-gray-600 leading-7">
                Todas as informações fornecidas são tratadas com absoluto sigilo.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-8">
              <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mb-5">
                <i className="fas fa-clock"></i>
              </div>
              <h3 className="font-bold text-xl">Tempo de Resposta</h3>
              <p className="mt-3 text-gray-600 leading-7">
                Respondemos normalmente entre 24 e 48 horas úteis.
              </p>
            </div>
          </div>

          {/* Formulário */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-lg p-10 space-y-6"
            >
              <h2 className="text-3xl font-bold text-gray-900">
                Formulário de Solicitação
              </h2>

              {/* Mensagem de Feedback Elegante */}
              {status && (
                <div
                  className={`p-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-start gap-3 ${
                    status.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  <i className={`fas mt-0.5 ${status.type === "success" ? "fa-check-circle text-green-600" : "fa-exclamation-circle text-red-600"}`}></i>
                  <div>{status.message}</div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  placeholder="Nome Completo"
                  onChange={handleChange}
                  className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="Email"
                  onChange={handleChange}
                  className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />

                <input
                  type="tel"
                  name="telefone"
                  value={form.telefone}
                  placeholder="Telefone"
                  onChange={handleChange}
                  className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                <input
                  type="text"
                  name="nacionalidade"
                  value={form.nacionalidade}
                  placeholder="Nacionalidade"
                  onChange={handleChange}
                  className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                <input
                  type="text"
                  name="documento"
                  value={form.documento}
                  placeholder="Passaporte ou BI"
                  onChange={handleChange}
                  className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                <select
                  name="servico"
                  value={form.servico}
                  onChange={handleChange}
                  className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                >
                  <option value="Vistos e DIRE">Vistos e DIRE</option>
                  <option value="Tradução">Tradução</option>
                  <option value="Apoio Jurídico">Apoio Jurídico</option>
                  <option value="Consultoria Migratória">Consultoria Migratória</option>
                  <option value="Emprego">Emprego</option>
                  <option value="Formação">Formação</option>
                  <option value="Estudantes">Estudantes</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <select
                name="atendimento"
                value={form.atendimento}
                onChange={handleChange}
                className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value="Presencial">Presencial</option>
                <option value="Online">Online</option>
              </select>

              <input
                type="text"
                name="assunto"
                value={form.assunto}
                placeholder="Assunto"
                onChange={handleChange}
                className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />

              <textarea
                rows={6}
                name="mensagem"
                value={form.mensagem}
                placeholder="Descreva detalhadamente o seu caso..."
                onChange={handleChange}
                className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              ></textarea>

              <div>
                <label className="block mb-2 font-semibold">
                  Anexar Documentos
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full border rounded-lg p-3 bg-gray-50 cursor-pointer"
                  accept=".pdf,.jpg,.jpeg,.png,.docx"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Formatos aceites: PDF, JPG, PNG, DOCX.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <input type="checkbox" required className="mt-1 cursor-pointer" />
                <span className="text-sm text-gray-600">
                  Declaro que as informações fornecidas são verdadeiras e autorizo
                  o tratamento dos meus dados para efeitos de atendimento.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-md"
              >
                {loading && <i className="fas fa-spinner fa-spin"></i>}
                {loading ? "A processar pedido..." : "Enviar Solicitação"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white border-t">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-bold">Ainda tem dúvidas?</h2>
          <p className="text-gray-600 mt-5">
            Consulte as perguntas frequentes ou fale diretamente com a nossa equipa.
          </p>
          <div className="flex justify-center gap-5 mt-10 flex-wrap">
            <Link
              href="/faq"
              className="border border-gray-300 px-8 py-4 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              Perguntas Frequentes
            </Link>
            <Link href="/contactos"
              className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 cursor-pointer"
            >
              Contactar
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}