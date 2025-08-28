import { useAssinaturaTraducoes } from "@/utils/translateClient";
import { Contrato } from "../page";
import { CheckCircle, Clock, CreditCard, Tag } from "lucide-react";

type AssinaturaAtualProps = {
  contrato: Contrato;
  valor: number;
  prazo: string;
};

export default function AssinaturaAtual({ contrato, valor, prazo }: AssinaturaAtualProps) {  
  const { planoAtualAssinatura, planoAssinatura, precoAssinatura, statusAssinatura, renovacaoAssinatura, beneficiosAssinatura, valorCalculoLocalAssinatura, 
    valorCalculoAssinatura, statusAtivoAssinatura, statusInativoAssinatura } = useAssinaturaTraducoes();
  const preco = Number(valor) / 100;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg mb-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">{planoAtualAssinatura}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Tag className="w-5 h-5 text-blue-500" />
          <span>
            <strong>{planoAssinatura}:</strong> {contrato.plano.nome}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-green-500" />
          <span>
            <strong>{precoAssinatura}:</strong>{" "}
            {preco.toLocaleString(`${valorCalculoLocalAssinatura}`, { style: "currency", currency: `${valorCalculoAssinatura}` })}/{prazo}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {contrato.ativo ? (<CheckCircle className="w-5 h-5 text-green-600" />)
          :(<CheckCircle className="w-5 h-5 text-red-600" />)}
          <span>
            <strong>{statusAssinatura}:</strong> {contrato.ativo ? `${statusAtivoAssinatura}` : `${statusInativoAssinatura}`}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-yellow-500" />
          <span>
            <strong>{renovacaoAssinatura}:</strong>{" "}
            {contrato.faturas[0]?.vencimento
              ? new Date(contrato.faturas[0].vencimento).toLocaleDateString("pt-BR")
              : "N/A"}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <strong>{beneficiosAssinatura}:</strong>
        <ul className="list-disc list-inside mt-2 text-gray-700">
          {contrato.plano.beneficios.map((b, idx) => (
            <li key={idx}>{b}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
