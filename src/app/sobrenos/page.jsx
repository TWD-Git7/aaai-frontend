import Link from "next/link";

export const metadata = {
  title: "Sobre a AAAI",
  description:
    "Conheça a Associação Angolana de Apoio aos Imigrantes (AAAI), sua missão, visão e valores.",
};

export default function SobrePage() {
  return (
    <main className="bg-gray-50">

      {/* Hero */}

      <section className="bg-angola-red text-white">
        <div className="max-w-7xl mx-auto px-6 py-24">

          <h1 className="text-5xl font-bold mt-4">
            Associação Angolana de Apoio aos Imigrantes
          </h1>

          <p className="mt-6 text-lg text-red-100 max-w-3xl leading-relaxed">
            Trabalhamos para promover uma migração segura, regular e digna,
            prestando assistência aos cidadãos estrangeiros residentes em Angola
            e aos angolanos na diáspora.
          </p>

        </div>
      </section>

      {/* História */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Nossa História
            </h2>

            <p className="text-gray-600 leading-8 mb-6">
              A Associação Angolana de Apoio aos Imigrantes (AAAI) é uma organização sem fins lucrativos, que atua como ponte entre o estado Angolano, represe-ntações diplomáticas, ONGs, etc. para Angolanos na diáspora e todos cidadãos estrangeiros reside-ntes em a Angola. O nosso compromisso é de aco-Iher, orientar e apoiar todos que precisam de inte-gração legalização, regularização e oportunidades para prosperar.
            </p>

            <p className="text-gray-600 leading-8">
              Atuamos em colaboração com instituições públicas, organismos
              internacionais, embaixadas, empresas e organizações da sociedade
              civil para fortalecer políticas de inclusão e proteção dos
              migrantes.
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-10">

            <div className="w-14 h-14 bg-red-100 text-angola-red rounded-lg flex items-center justify-center text-2xl mb-6">
                <i className="fas fa-bullseye"></i>
              </div>


            <h3 className="font-bold text-2xl mb-6">
              A Nossa Missão
            </h3>

            <p className="text-gray-600 leading-8">
                Transformar vidas através do apoio social, jurídico e cultural a imigrantes e angolanos no exterior, promovendo a integração, inclusão e cooperação entre povos.
            </p>

          </div>

        </div>

      </section>

      {/* Missão Visão Valores */}

      <section className="bg-white py-20">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid md:grid-cols-2 gap-8">



            <div className="bg-gray-50 p-8 rounded-xl shadow">

              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl mb-6">
                <i className="fas fa-eye"></i>
              </div>

              <h3 className="font-bold text-xl mb-4">
                Visão
              </h3>

              <p className="text-gray-600 leading-7">
                  Ser uma referência nacional e internacional na defesa e apoio dos interesses dos Angolanos na diáspora e cidadãos estrangeiros residentes em Angola tornando Angola em um exemplo de acol-himento e integração
              </p>

            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow">

              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-2xl mb-6">
                <i className="fas fa-handshake"></i>
              </div>

              <h3 className="font-bold text-xl mb-4">
                Valores
              </h3>

              <p className="text-gray-600 leading-7">
                <span className="font-bold">Respeito - </span>Tratamos todas as pessoas com dignidade, reconhecendo suas histórias e culturas.<br />
                <span className="font-bold">Justiça - </span>Defendemos os direitos e deveres de forma imparcial e ética.<br />
                <span className="font-bold">Empatia - </span>Escutamos e compreendemos para agir de forma humana e assertiva.<br />
                <span className="font-bold">Coragem - </span>Enfrentamos desafios com determinação em prol de quem representamos.<br />
                <span className="font-bold">Colaboração - </span>Construímos pontes entre pessoas, comu-nidades e instituições.<br />
                <span className="font-bold">Transformação - </span>Criamos soluções que mudam realida-des e geram oportunidades.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Estatísticas */}

      <section className="py-20">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid md:grid-cols-4 gap-8 text-center">

            <div>
              <h2 className="text-5xl font-bold text-angola-red">100+</h2>
              <p className="text-gray-600 mt-2">Famílias Assistidas</p>
            </div>

            <div>
              <h2 className="text-5xl font-bold text-angola-red">20+</h2>
              <p className="text-gray-600 mt-2">Parceiros Institucionais</p>
            </div>

            <div>
              <h2 className="text-5xl font-bold text-angola-red">12</h2>
              <p className="text-gray-600 mt-2">Serviços Especializados</p>
            </div>

            <div>
              <h2 className="text-5xl font-bold text-angola-red">24/7</h2>
              <p className="text-gray-600 mt-2">Suporte e Orientação</p>
            </div>

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="bg-angola-red">

        <div className="max-w-5xl mx-auto px-6 py-20 text-center text-white">

          <h2 className="text-4xl font-bold">
            Estamos prontos para ajudar.
          </h2>

          <p className="mt-5 text-red-100">
            Entre em contacto com a nossa equipa e descubra como podemos apoiar
            o seu processo migratório.
          </p>

          <div className="mt-10 flex justify-center gap-5">

            <Link href="/contactos"
              className="bg-white text-angola-red px-8 py-4 rounded-lg font-semibold hover:bg-gray-100">
              Contactar
            </Link>

            <Link
              href="/servicos" className="border border-white px-8 py-4 rounded-lg hover:bg-white hover:text-angola-red transition">
              Nossos Serviços
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}