import Link from "next/link";

export const metadata = {
  title: "Vistos e DIRE | AAAI",
  description:
    "Orientação e acompanhamento para emissão, renovação e regularização de Vistos e DIRE em Angola.",
};

const documentos = [
  "Passaporte válido",
  "Fotografia tipo passe",
  "Formulário de pedido devidamente preenchido",
  "Comprovativo de residência (quando aplicável)",
  "Contrato de trabalho ou documento que justifique a permanência",
  "Comprovativo de meios financeiros (quando exigido)",
  "Outros documentos solicitados pelas autoridades competentes",
];

const etapas = [
  {
    titulo: "Análise Inicial",
    descricao:
      "Avaliamos o seu caso e identificamos o tipo de visto ou DIRE mais adequado.",
    icon: "fa-search",
  },
  {
    titulo: "Preparação da Documentação",
    descricao:
      "Orientamos na organização e verificação de toda a documentação necessária.",
    icon: "fa-folder-open",
  },
  {
    titulo: "Submissão do Processo",
    descricao:
      "Prestamos apoio na preparação do processo para apresentação junto das autoridades competentes.",
    icon: "fa-file-signature",
  },
  {
    titulo: "Acompanhamento",
    descricao:
      "Acompanhamos o andamento do processo e prestamos esclarecimentos durante todas as etapas.",
    icon: "fa-user-check",
  },
];

const perguntas = [
  {
    pergunta: "A AAAI emite vistos?",
    resposta:
      "Não. A AAAI presta orientação, preparação documental e acompanhamento. A emissão compete às autoridades governamentais.",
  },
  {
    pergunta: "Quanto tempo demora o processo?",
    resposta:
      "O prazo depende do tipo de visto, da documentação apresentada e da entidade responsável pela análise.",
  },
  {
    pergunta: "Posso renovar o meu DIRE através da AAAI?",
    resposta:
      "A AAAI pode prestar apoio na preparação da documentação e no acompanhamento do processo de renovação.",
  },
];

export default function VistosPage() {
  return (
    <main className="bg-gray-50">

      {/* HERO */}

      <section className="bg-gradient-to-r from-red-700 to-red-600 text-white">

        <div className="max-w-7xl mx-auto px-6 py-24">

          <span className="uppercase tracking-widest text-red-200 font-semibold">
            Serviços
          </span>

          <h1 className="text-5xl font-bold mt-4">
            Vistos e DIRE
          </h1>

          <p className="mt-6 max-w-3xl text-red-100 text-lg leading-8">
            Prestamos orientação especializada para emissão, renovação,
            regularização e acompanhamento de processos migratórios,
            facilitando o cumprimento das exigências legais em Angola.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              href="/atendimento"
              className="bg-white text-angola-red px-8 py-4 rounded-lg font-semibold hover:bg-gray-100"
            >
              Solicitar Atendimento
            </Link>

            <Link
              href="/contactos"
              className="border border-white px-8 py-4 rounded-lg hover:bg-white hover:text-angola-red transition"
            >
              Contactar
            </Link>

          </div>

        </div>

      </section>

      {/* SOBRE */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-2 gap-16">

          <div>

            <h2 className="text-3xl font-bold mb-6">
              Sobre este Serviço
            </h2>

            <p className="text-gray-600 leading-8 mb-6">
              A AAAI presta apoio técnico e administrativo a cidadãos
              estrangeiros e empresas que necessitam de orientação sobre
              processos de imigração em Angola.
            </p>

            <p className="text-gray-600 leading-8">
              Acompanhamos desde a análise inicial até à preparação da
              documentação, contribuindo para processos mais organizados e
              conformes com a legislação em vigor.
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-10">

            <h3 className="text-2xl font-bold mb-8">
              O que fazemos
            </h3>

            <ul className="space-y-5">

              {[
                "Orientação sobre tipos de vistos",
                "Renovação de DIRE",
                "Regularização documental",
                "Preparação de processos",
                "Consultoria migratória",
                "Acompanhamento personalizado",
              ].map((item) => (

                <li key={item} className="flex gap-3">

                  <i className="fas fa-circle-check text-green-600 mt-1"></i>

                  <span>{item}</span>

                </li>

              ))}

            </ul>

          </div>

        </div>

      </section>

      {/* DOCUMENTOS */}

      <section className="bg-white py-20">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-14">
            Documentação Habitualmente Necessária
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {documentos.map((doc) => (

              <div
                key={doc}
                className="bg-gray-50 rounded-xl p-6 flex items-center gap-4"
              >

                <i className="fas fa-file-lines text-angola-red text-xl"></i>

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

            {etapas.map((etapa, index) => (

              <div
                key={index}
                className="bg-white rounded-xl shadow p-8 text-center"
              >

                <div className="w-16 h-16 mx-auto rounded-full bg-red-100 text-angola-red flex items-center justify-center text-2xl">

                  <i className={`fas ${etapa.icon}`}></i>

                </div>

                <h3 className="font-bold mt-6 text-xl">
                  {etapa.titulo}
                </h3>

                <p className="text-gray-600 mt-4 leading-7">
                  {etapa.descricao}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* FAQ */}

      <section className="bg-white py-20">

        <div className="max-w-5xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-12">
            Perguntas Frequentes
          </h2>

          <div className="space-y-6">

            {perguntas.map((faq) => (

              <div
                key={faq.pergunta}
                className="border rounded-xl p-6"
              >

                <h3 className="font-bold text-lg">
                  {faq.pergunta}
                </h3>

                <p className="text-gray-600 mt-3 leading-7">
                  {faq.resposta}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="bg-angola-red">

        <div className="max-w-5xl mx-auto px-6 py-20 text-center text-white">

          <h2 className="text-4xl font-bold">
            Precisa de apoio com o seu processo?
          </h2>

          <p className="mt-5 text-red-100 max-w-2xl mx-auto">
            A nossa equipa está disponível para analisar a sua situação e orientá-lo em cada etapa do processo.
          </p>

          <div className="flex flex-wrap justify-center gap-5 mt-10">

            <Link
              href="/atendimento"
              className="bg-white text-angola-red px-8 py-4 rounded-lg font-semibold hover:bg-gray-100"
            >
              Solicitar Atendimento
            </Link>

            <Link
              href="/servicos"
              className="border border-white px-8 py-4 rounded-lg hover:bg-white hover:text-angola-red transition"
            >
              Ver Todos os Serviços
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}