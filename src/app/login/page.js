'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulação de login - Substituir com sua lógica real
    try {
      // Exemplo: validar com WordPress
      const response = await fetch('http://localhost/aaaibwewp.com/wp-json/jwt-auth/v1/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('aaai_token', data.token);
        localStorage.setItem('aaai_user_name', data.user_display_name || 'Admin');
        router.push('/admin/dashboard');
      } else {
        setError('Credenciais inválidas. Tente novamente.');
      }
    } catch (err) {
      // Fallback: login simulado
      if (email === 'admin@aaai.com' && password === 'admin123') {
        localStorage.setItem('aaai_token', 'fake_token');
        localStorage.setItem('aaai_user_name', 'Administrador');
        router.push('/admin/dashboard');
      } else {
        setError('Erro ao conectar ao servidor. Verifique suas credenciais.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-angola-red rounded-full flex items-center justify-center text-white font-bold text-2xl border-2 border-angola-yellow">
              AAAI
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Área de Acesso
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Entre com suas credenciais para acessar o sistema
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-t-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-angola-red focus:border-angola-red focus:z-10 sm:text-sm"
                placeholder="E-mail"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-b-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-angola-red focus:border-angola-red focus:z-10 sm:text-sm"
                placeholder="Senha"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-angola-red focus:ring-angola-red border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Lembrar-me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/recuperar-senha" className="font-medium text-angola-red hover:text-angola-red/90">
                Esqueceu sua senha?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-angola-red hover:bg-angola-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-angola-red disabled:opacity-50 transition"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link href="/registrar" className="font-medium text-angola-red hover:text-angola-red/90">
              Registrar-se
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}