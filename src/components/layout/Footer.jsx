import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">

      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">

        {/* Sobre */}
        <div>
          <h3 className="text-white font-bold mb-4">AAAI</h3>
          <p className="text-sm leading-7">
            Associação Angolana de Apoio aos Imigrantes, dedicada à integração,
            orientação e apoio jurídico e social.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/sobre">Sobre</Link></li>
            <li><Link href="/servicos">Serviços</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/contactos">Contactos</Link></li>
          </ul>
        </div>

        {/* Serviços */}
        <div>
          <h4 className="text-white font-semibold mb-4">Serviços</h4>
          <ul className="space-y-2 text-sm">
            <li>Vistos</li>
            <li>Traduções</li>
            <li>Apoio Jurídico</li>
            <li>Emprego</li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contacto</h4>
          <p className="text-sm">Zango Zero rua 1, Condóminio das Acácias, casa 38 - Luanda, Angola</p>
          <p className="text-sm">+244 924 217 955</p>
          <p className="text-sm">geral@apoioimigrantes.com</p>
          <p className="text-sm">
            Coloca nesse campos as Redes Sociais (Facebook, Instagram, Tiktok, Linkedin), Os icones com links para abir em outas
          </p>
        </div>

      </div>

      <div className="border-t border-gray-800 text-center py-6 text-sm">
        © {new Date().getFullYear()} AAAI. Todos os direitos reservados.
      </div>

    </footer>
  );
}