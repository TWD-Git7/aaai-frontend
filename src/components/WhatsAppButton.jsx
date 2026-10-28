"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 6000); // Esconde após 6 segundos

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showMessage && (
        <div className="mb-3 bg-white text-gray-800 p-3 rounded-lg shadow-lg w-64 relative animate-bounce">
          <button onClick={() => setShowMessage(false)}
            className="absolute top-1 right-2 text-gray-500 hover:text-black"
          > ×
          </button>

          <p className="text-sm">
            👋 Olá! Precisa de ajuda com vistos, documentos ou apoio jurídico?
            Fale connosco pelo WhatsApp.
          </p>
        </div>
      )}

    <a href="https://wa.me/244924217955?text=Olá!%20Visitei%20o%20site%20da%20AAAI%20e%20gostaria%20de%20obter%20mais%20informações."
      target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50">
      <i className="fab fa-whatsapp text-2xl"></i>
    </a>
    </div>
  );
}