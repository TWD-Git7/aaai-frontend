"use client";

import { useEffect, useState } from "react";

interface Atendimento {
  id: number;
  nome: string;
  email: string;
  servico: string;
  mensagem: string;
}

export default function AdminPage() {
  const [data, setData] = useState<Atendimento[]>([]);

  async function load() {
    const res = await fetch("/api/admin");
    const json = await res.json();
    setData(json);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">
        Pedidos de Atendimento
      </h1>

      {data.map((item) => (
        <div
          key={item.id}
          className="border p-4 mb-4 rounded"
        >
          <p>
            <b>Nome:</b> {item.nome}
          </p>

          <p>
            <b>Email:</b> {item.email}
          </p>

          <p>
            <b>Serviço:</b> {item.servico}
          </p>

          <p><b>Mensagem:</b> {item.mensagem}</p>
        </div>
      ))}
    </div>
  );
}