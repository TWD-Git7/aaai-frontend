import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import SeuFormulario from './components/SeuFormulario'; // O componente do seu portal
import SeletorIdioma from './components/SeletorIdioma';

function App() {
  return (
    <LanguageProvider>
      <div className="app-container">
        <header>
          {/* Seletor de idiomas vai aqui no topo */}
          <SeletorIdioma />
        </header>
        <main>
          <SeuFormulario />
        </main>
      </div>
    </LanguageProvider>
  );
}

export default App;