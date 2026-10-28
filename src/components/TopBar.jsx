'use client';

import { useLanguage } from '@/context/LanguageContext';
import { formTranslations } from '@/constants/translations';

export default function TopBar() {
  const { language, changeLanguage } = useLanguage();

  // Proteção preventiva contra valores indefinidos (fallback seguro)
  const t = formTranslations[language] || formTranslations.pt || {};

  return (
    <div className="bg-angola-dark text-white text-sm py-2 px-4 flex justify-between items-center flex-wrap gap-2">
      {/* Informações de Contato */}
      <div className="flex items-center gap-4">
        <span>
          <i className="fas fa-phone text-angola-yellow mr-1"></i> +244 924 217 955
        </span>
        <span className="hidden md:inline text-gray-600">|</span>
        <span className="hidden md:inline">
          <i className="fas fa-envelope text-angola-yellow mr-1"></i> geral@apoioimigrantes.com
        </span>
      </div>
      
      {/* Seleção de Idioma e Login */}
      <div className="flex items-center gap-3">
        <label htmlFor="lang-select" className="text-xs text-gray-400 flex items-center gap-1 cursor-pointer">
          <i className="fas fa-globe text-angola-yellow"></i> 
          {/* Texto traduzido dinamicamente */}
          <span>{t.languageLabel || "Idioma"}:</span>
        </label>
        
        <select 
          id="lang-select" 
          value={language} 
          onChange={(e) => changeLanguage(e.target.value)}
          className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-500 cursor-pointer"
        >
          <option value="pt">🇵🇹 Português</option>
          <option value="en">🇬🇧 English</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="es">🇪🇸 Español</option>
          <option value="zh">🇨🇳 中文 (Mandarim)</option>
        </select>
        
        {/* Botão Área do Associado Traduzido */}
        <a href="/login" className="bg-angola-red hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded transition flex items-center gap-1"
        >
          <i className="fas fa-user-lock"></i> 
          <span>{t.memberArea || "Área do Associado"}</span>
        </a>
      </div>
    </div>
  );
}