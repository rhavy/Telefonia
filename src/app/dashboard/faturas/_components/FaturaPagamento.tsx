"use client";
import { useState } from "react";
import { Fatura } from "./cardFatura";

type Props = {
  fatura: Fatura;
};

export default function FaturaPagamento({ fatura }: Props) {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  const pagar = async (metodo: "pix" | "boleto") => {
    setLoading(true);
    const res = await fetch("/api/pagar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ faturaId: fatura.id, metodo }),
    });
    const data = await res.json();
    setPaymentData(data);
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-md shadow-sm space-y-2">
      <p>Valor: R$ {(fatura.valor / 100).toFixed(2)}</p>
      <button
        disabled={loading}
        onClick={() => pagar("pix")}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Pagar via Pix
      </button>
      <button
        disabled={loading}
        onClick={() => pagar("boleto")}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Pagar via Boleto
      </button>

      {paymentData && paymentData.next_action && (
        <div className="mt-2">
          {paymentData.next_action.display_instructions || "Pagamento gerado!"}
        </div>
      )}
    </div>
  );
}
