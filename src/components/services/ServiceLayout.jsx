import Link from "next/link";
import { generateSEO } from "@/lib/seo";

export default function ServiceLayout({
  title,
  subtitle,
  description,
  documents = [],
  steps = [],
  faq = [],
}) {
  return (
    <main className="bg-gray-50">

      {/* HERO */}
      <section className="bg-gradient-to-r from-red-700 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24">

          <span className="uppercase tracking-widest text-red-200 text-sm font-semibold">
            Serviço AAAI
          </span>

          <h1 className="text-5xl font-bold mt-4">{title}</h1>

          <p className="mt-6 max-w-3xl text-red-100 text-lg">
            {subtitle}
          </p>

          <div className="mt-10 flex gap-4 flex-wrap">
            <Link href="/atendimento" className="bg-white text-angola-red px-8 py-4 rounded-lg font-semibold"
            >
              Solicitar Atendimento
            </Link>

            <Link href="/contactos" className="border border-white px-8 py-4 rounded-lg">
              Contactar
            </Link>
          </div>

        </div>
      </section>

      {/* DESCRIÇÃO */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-6">Sobre o Serviço</h2>
        <p className="text-gray-600 leading-8 max-w-3xl">
          {description}
        </p>
      </section>

      {/* DOCUMENTOS */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold mb-10">
            Documentos Necessários
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {documents.map((doc, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-lg flex gap-3">
                <i className="fas fa-file text-angola-red"></i>
                <span>{doc}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ETAPAS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-14">
            Como Funciona
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {steps.map((step, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow text-center">

                <div className="w-14 h-14 mx-auto bg-red-100 text-angola-red rounded-full flex items-center justify-center text-xl">
                  <i className={`fas ${step.icon}`}></i>
                </div>

                <h3 className="font-bold mt-6">{step.title}</h3>

                <p className="text-gray-600 mt-3 text-sm">
                  {step.description}
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-10">
            Perguntas Frequentes
          </h2>

          <div className="space-y-5">

            {faq.map((item, i) => (
              <div key={i} className="border p-6 rounded-lg">
                <h3 className="font-bold">{item.question}</h3>
                <p className="text-gray-600 mt-2">{item.answer}</p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-angola-red text-white text-center py-20">

        <h2 className="text-4xl font-bold">
          Precisa de apoio?
        </h2>

        <p className="mt-5 text-red-100">
          Fale com a nossa equipa para análise do seu caso.
        </p>

        <Link
          href="/atendimento"
          className="mt-10 inline-block bg-white text-angola-red px-8 py-4 rounded-lg font-semibold">
          Solicitar Atendimento
        </Link>
      </section>

    </main>
  );
}