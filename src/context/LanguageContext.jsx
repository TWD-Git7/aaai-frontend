"use client"; /** context/LanguageContext **/ 

import React, { createContext, useState, useContext } from 'react';
import { formTranslations } from '../constants/translations'; 

// Criar o Contexto
const LanguageContext = createContext();

// Provedor do Contexto
export const LanguageProvider = ({ children }) => {
  // Idioma padrão inicial (Português)
  const [language, setLanguage] = useState('pt');

  // Função para mudar o idioma de forma dinâmica
  const changeLanguage = (lang) => {
    if (formTranslations[lang]) {
      setLanguage(lang);
    }
  };

  // Pegar apenas as traduções do idioma atual para facilitar o uso no componente
  const t = formTranslations[language];

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personalizado para facilitar o consumo nos componentes
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage deve ser usado dentro de um LanguageProvider');
  }
  return context;
};