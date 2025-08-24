"use client";

import { useEffect, useState } from "react";
import { Users, DollarSign, Wallet } from "lucide-react";
import { StatCard } from "./stats-card";
import { getStatus } from "../_data-access/get-status-creator";
import { formatCurrency } from "@/utils/format";

export function Stats({ userID, stripeAccountId }: { userID: string; stripeAccountId: string }) {
  const [stats, setStats] = useState({
    totalQtDonations: 0,
    totalAmountResult: 0,
    balance: 0
  });

  async function atualizarStatus() {
    try {
      const { totalQtDonations, totalAmountResult, balance, error } =
        await getStatus(userID, stripeAccountId);

      if (!error) {
        setStats({
          totalQtDonations: totalQtDonations ?? 0,
          totalAmountResult: totalAmountResult ?? 0,
          balance: balance ?? 0
        });
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
    }
  }

  useEffect(() => {
    atualizarStatus(); // Chamada inicial
    const interval = setInterval(atualizarStatus, 5000); // A cada 5s
    return () => clearInterval(interval); // Limpa ao desmontar
  }, []);

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-6">
      <StatCard
        title="Apoiadores"
        description="Total de apoiadores"
        icon={<Users className="w-8 h-8 text-blue-400" />}
        value={stats.totalQtDonations}
      />
      <StatCard
        title="Total recebido"
        description="Quantidade total recebida"
        icon={<DollarSign className="w-8 h-8 text-amber-500" />}
        value={formatCurrency(stats.totalAmountResult / 100)}
      />
      <StatCard
        title="Saldo em conta"
        description="Saldo pendente"
        icon={<Wallet className="w-8 h-8 text-green-500" />}
        value={formatCurrency(stats.balance / 100)}
      />
    </div>
  );
}
