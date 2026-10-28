import "./globals.css";

import TopBar from "@/components/TopBar";
import Navbar from "@/components/layout/Navbar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from '@/context/LanguageContext';
import { formTranslations } from '@/constants/translations';

import type { Metadata } from "next";
//import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
// Importe o seu Provider aqui (ajuste o caminho de acordo com a sua pasta)
import { LanguageProvider } from "@/context/LanguageContext"; 

// Adicionada a tipagem ': Metadata' para o objeto de metadados
export const metadata: Metadata = {
  title: "AAAI - Associação Angolana de Apoio a Imigrantes",
  description: "Seu parceiro seguro para a integração e legalização em Angola",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-icon.png",
  },
};

// Adicionada a tipagem para as props do RootLayout ({ children: React.ReactNode })
export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="pt">
      <head>
        {/* Injeção temporária do FontAwesome via CDN para manter compatibilidade com o teu HTML */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="bg-gray-50 font-sans text-gray-800 min-h-screen flex flex-col">
        {/* O LanguageProvider encapsula tudo dentro do body */}
        <LanguageProvider>
          <TopBar />
          <Header />
          <div className="flex-grow">
            {children}
            <WhatsAppButton />
          </div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}