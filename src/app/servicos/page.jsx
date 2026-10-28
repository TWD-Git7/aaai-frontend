import Link from "next/link";
import { generateSEO } from "@/lib/seo";

const servicos = [
  {
    titulo: "Vistos e DIRE",
    descricao:
      "Orientação passo a passo para emissão, renovação e regularização junto ao SME.",
    icon: "fa-passport",
    color: "red",
    slug: "vistos",
  },
  {
    titulo: "Tradução de Documentos",
    descricao:
      "Tradução oficial, certificação e legalização de documentos nacionais e estrangeiros.",
    icon: "fa-language",
    color: "amber",
    slug: "traducoes",
  },
  {
    titulo: "Apoio Jurídico",
    descricao:
      "Assistência jurídica em matérias migratórias, direitos dos imigrantes e regularização documental.",
    icon: "fa-scale-balanced",
    color: "blue",
    slug: "apoio-juridico",
  },
  {
    titulo: "Reagrupamento Familiar",
    descricao:
      "Acompanhamento completo em processos de reunificação familiar.",
    icon: "fa-people-roof",
    color: "green",
    slug: "reagrupamento-familiar",
  },
  {
    titulo: "Consultoria Migratória",
    descricao:
      "Informações sobre vistos, residência, mobilidade internacional e legislação migratória.",
    icon: "fa-earth-africa",
    color: "purple",
    slug: "consultoria",
  },
  {
    titulo: "Apoio Consular",
    descricao:
      "Orientação para emissão de documentos, consulados e embaixadas.",
    icon: "fa-building-columns",
    color: "cyan",
    slug: "apoio-consular",
  },
  {
    titulo: "Emprego e Integração",
    descricao:
      "Apoio na integração profissional, elaboração de CV e encaminhamento ao mercado de trabalho.",
    icon: "fa-briefcase",
    color: "orange",
    slug: "emprego",
  },
  {
    titulo: "Formação e Capacitação",
    descricao:
      "Cursos, workshops e palestras para desenvolvimento pessoal e profissional.",
    icon: "fa-graduation-cap",
    color: "indigo",
    slug: "formacao",
  },
  {
    titulo: "Estudantes Internacionais",
    descricao:
      "Apoio documental e integração para estudantes estrangeiros em Angola.",
    icon: "fa-user-graduate",
    color: "pink",
    slug: "estudantes",
  },
  {
    titulo: "Atendimento Humanitário",
    descricao:
      "Encaminhamento social e apoio a migrantes em situação de vulnerabilidade.",
    icon: "fa-hand-holding-heart",
    color: "rose",
    slug: "humanitario",
  },
  {
    titulo: "Integração Social",
    descricao:
      "Programas de acolhimento, inclusão social e adaptação cultural.",
    icon: "fa-users",
    color: "emerald",
    slug: "integracao-social",
  },
  {
    titulo: "Mediação Institucional",
    descricao:
      "Ligação entre migrantes, empresas, instituições públicas e organizações parceiras.",
    icon: "fa-handshake",
    color: "teal",
    slug: "mediacao",
  },
];

export default function ServicosPage() {
  return (
    <main className="bg-gray-50 min-h-screen">

      {/* Hero */}

      <section className="bg-angola-red text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">

          <h1 className="text-4xl md:text-5xl font-bold mt-3">
            Nossos Serviços
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-red-100">
            Prestamos serviços especializados de apoio aos imigrantes,
            expatriados, estudantes internacionais, empresas e cidadãos
            estrangeiros residentes em Angola, promovendo uma migração segura,
            regular e integrada.
          </p>

        </div>
      </section>

      {/* Serviços */}

      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="text-center mb-14">

          <h2 className="text-3xl font-bold text-gray-900">
            Como podemos ajudar?
          </h2>

          <p className="text-gray-600 mt-3">
            Conheça os principais serviços disponibilizados pela Associação
            Angolana de Apoio aos Imigrantes.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

          {servicos.map((servico) => (

            <div
              key={servico.slug}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >

              <div className="p-7 flex-1">

                <div
                  className={`w-14 h-14 rounded-xl bg-${servico.color}-100 text-${servico.color}-600 flex items-center justify-center text-2xl mb-5`}
                >
                  <i className={`fas ${servico.icon}`}></i>
                </div>

                <h3 className="font-bold text-xl text-gray-900 mb-3">
                  {servico.titulo}
                </h3>

                <p className="text-gray-600 leading-relaxed text-sm">
                  {servico.descricao}
                </p>

              </div>

              <div className="border-t px-7 py-5">

                <Link
                  href={`/servicos/${servico.slug}`}
                  className="text-angola-red font-semibold hover:underline inline-flex items-center gap-2"
                >
                  Saber mais

                  <i className="fas fa-arrow-right text-xs"></i>

                </Link>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* CTA */}

      <section className="bg-white border-t">

        <div className="max-w-5xl mx-auto px-6 py-20 text-center">

          <h2 className="text-3xl font-bold text-gray-900">
            Precisa de apoio?
          </h2>

          <p className="mt-5 text-gray-600 max-w-3xl mx-auto">
            A nossa equipa está preparada para prestar orientação personalizada
            sobre processos migratórios, documentação, integração social e
            outros serviços relacionados com imigração.
          </p>

          <div className="mt-10 flex justify-center gap-4 flex-wrap">

            <Link href="/contactos" className="bg-angola-red text-white px-8 py-4 rounded-lg hover:bg-red-700 transition font-semibold">
              Solicitar Atendimento
            </Link>

            <Link href="/sobrenos" className="border border-gray-300 px-8 py-4 rounded-lg hover:bg-gray-100 transition font-semibold">
              Conheça a AAAI
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}