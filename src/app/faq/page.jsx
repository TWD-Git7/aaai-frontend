"use client";

import { useState } from "react";
import Link from "next/link";

export default function FAQPage() {
  const [active, setActive] = useState(null);

  const faqs = [
    {
      pergunta: "Quem pode solicitar apoio à AAAI?",
      resposta:
        "Qualquer cidadão estrangeiro residente em Angola, angolano na diáspora ou pessoa que necessite de orientação sobre questões migratórias pode solicitar apoio junto da AAAI.",
    },
    {
      pergunta: "A AAAI emite vistos ou DIRE?",
      resposta:
        "Não. A AAAI presta orientação, acompanhamento e apoio na preparação da documentação. A emissão de vistos e do DIRE é competência das autoridades governamentais.",
    },
    {
      pergunta: "Quais documentos são necessários para iniciar um processo?",
      resposta:
        "Os documentos variam conforme o serviço solicitado. Após o primeiro atendimento, será fornecida uma lista personalizada da documentação necessária.",
    },
    {
      pergunta: "A associação presta apoio jurídico?",
      resposta:
        "Sim. Disponibilizamos orientação jurídica em matérias migratórias e encaminhamento para especialistas quando necessário.",
    },
    {
      pergunta: "Os serviços são pagos?",
      resposta:
        "Alguns serviços são gratuitos, enquanto outros podem ter custos administrativos ou taxas associadas. O utilizador será informado antes do início do processo.",
    },
    {
      pergunta: "Posso solicitar atendimento online?",
      resposta:
        "Sim. Através do formulário 'Solicitar Atendimento' é possível enviar o seu pedido e aguardar o contacto da nossa equipa.",
    },
    {
      pergunta: "Quanto tempo demora um processo?",
      resposta:
        "Depende do tipo de serviço e das entidades envolvidas. A AAAI acompanha cada processo e informa o requerente sobre os prazos estimados.",
    },
    {
      pergunta: "A AAAI atende empresas?",
      resposta:
        "Sim. Prestamos apoio a empresas na regularização documental de trabalhadores estrangeiros, mobilidade internacional e consultoria migratória.",
    },
  ];

  return (
    <main className="bg-gray-50 min-h-screen">

      {/* Hero */}

      <section className="bg-angola-red text-white">

        <div className="max-w-7xl mx-auto px-6 py-24">

          <span className="uppercase tracking-widest text-red-200 text-sm font-semibold">
            Central de Ajuda
          </span>

          <h1 className="text-5xl font-bold mt-4">
            Perguntas Frequentes
          </h1>

          <p className="mt-6 max-w-3xl text-red-100 text-lg">
            Encontre respostas para as dúvidas mais comuns sobre os serviços
            prestados pela Associação Angolana de Apoio aos Imigrantes.
          </p>

        </div>

      </section>

      {/* FAQ */}

      <section className="max-w-5xl mx-auto px-6 py-20">

        <div className="space-y-5">

          {faqs.map((faq, index) => (

            <div
              key={index}
              className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden"
            >

              <button
                onClick={() =>
                  setActive(active === index ? null : index)
                }
                className="w-full flex justify-between items-center px-8 py-6 text-left"
              >

                <h3 className="font-semibold text-lg text-gray-900">
                  {faq.pergunta}
                </h3>

                <i
                  className={`fas ${
                    active === index
                      ? "fa-minus"
                      : "fa-plus"
                  } text-angola-red`}
                ></i>

              </button>

              {active === index && (

                <div className="px-8 pb-6">

                  <p className="text-gray-600 leading-8">
                    {faq.resposta}
                  </p>

                </div>

              )}

            </div>

          ))}

        </div>

      </section>

      {/* CTA */}

      <section className="bg-white border-t">

        <div className="max-w-5xl mx-auto py-20 px-6 text-center">

          <div className="w-20 h-20 rounded-full bg-red-100 text-angola-red mx-auto flex items-center justify-center text-3xl mb-8">
            <i className="fas fa-headset"></i>
          </div>

          <h2 className="text-4xl font-bold text-gray-900">
            Não encontrou a resposta?
          </h2>

          <p className="text-gray-600 mt-5 max-w-2xl mx-auto leading-8">
            A nossa equipa está disponível para esclarecer qualquer dúvida e
            ajudá-lo a encontrar a melhor solução para o seu caso.
          </p>

          <div className="flex flex-wrap justify-center gap-5 mt-10">

            <Link href="/atendimento" className="bg-angola-red text-white px-8 py-4 rounded-lg hover:bg-red-700 transition">
              Solicitar Atendimento
            </Link>

            <Link href="/contactos" className="border border-gray-300 px-8 py-4 rounded-lg hover:bg-gray-100 transition">
              Contactar-nos
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}