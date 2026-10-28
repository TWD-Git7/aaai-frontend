import Link from "next/link";
import { FaHome, FaWhatsapp } from "react-icons/fa";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="max-w-2xl text-center">

        <div className="text-7xl mb-6">🌍</div>

        <h1 className="text-8xl font-extrabold text-red-600">
          404
        </h1>

        <h2 className="mt-4 text-4xl font-bold text-gray-900">
          Página não encontrada
        </h2>

        <p className="mt-6 text-lg text-gray-700 leading-8">
          A página que procura não existe ou foi movida.
          Continue a navegar pelos nossos serviços ou entre em
          contacto com a nossa equipa.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            <FaHome />
            Página Inicial
          </Link>

          <a
            href="https://wa.me/244924217955"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold transition"
          >
            <FaWhatsapp />
            Falar no WhatsApp
          </a>

        </div>

        <div className="mt-12 border-t pt-8">

          <h3 className="font-bold text-black mb-4">
            Também pode visitar:
          </h3>

          <div className="flex flex-wrap justify-center gap-3">

            <Link
              href="/sobre"
              className="px-4 py-2 rounded-full bg-black text-yellow-400 hover:bg-red-600 hover:text-white transition"
            >
              Sobre
            </Link>

            <Link
              href="/servicos"
              className="px-4 py-2 rounded-full bg-black text-yellow-400 hover:bg-red-600 hover:text-white transition"
            >
              Serviços
            </Link>

            <Link
              href="/faq"
              className="px-4 py-2 rounded-full bg-black text-yellow-400 hover:bg-red-600 hover:text-white transition"
            >
              FAQ
            </Link>

            <Link
              href="/contactos"
              className="px-4 py-2 rounded-full bg-black text-yellow-400 hover:bg-red-600 hover:text-white transition"
            >
              Contactos
            </Link>

          </div>

        </div>

      </div>
    </main>
  );
}