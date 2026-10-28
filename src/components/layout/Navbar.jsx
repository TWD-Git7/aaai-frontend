"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4">

        {/* LOGO */}
        <Link href="/" className="font-bold text-xl text-angola-red">
          AAAI
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex gap-6 font-medium text-gray-700">

          <Link href="/">Início</Link>
          <Link href="/sobre">Sobre</Link>
          <Link href="/servicos">Serviços</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contactos">Contactos</Link>

        </nav>

        {/* CTA */}
        <Link
          href="/atendimento"
          className="hidden md:block bg-angola-red text-white px-5 py-2 rounded-lg hover:bg-red-700"
        >
          Solicitar Atendimento
        </Link>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl"
        >
          <i className="fas fa-bars"></i>
        </button>

      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t px-6 py-4 space-y-4">

          <Link href="/" onClick={() => setOpen(false)}>Início</Link>
          <Link href="/sobre" onClick={() => setOpen(false)}>Sobre</Link>
          <Link href="/servicos" onClick={() => setOpen(false)}>Serviços</Link>
          <Link href="/faq" onClick={() => setOpen(false)}>FAQ</Link>
          <Link href="/contactos" onClick={() => setOpen(false)}>Contactos</Link>

          <Link
            href="/atendimento"
            className="block bg-angola-red text-white px-4 py-2 rounded-lg text-center"
            onClick={() => setOpen(false)}
          >
            Solicitar Atendimento
          </Link>

        </div>
      )}

    </header>
  );
}