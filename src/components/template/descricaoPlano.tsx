import { Phone, ShieldCheck, Wifi } from "lucide-react";

interface Beneficio {
  id: string;
  descricao: string;
}

interface PlanoComBeneficios {
  id:           string;
  nome:         string;
  precoMensal:  number;
  precoAnual:   number;
  descricao:    string;
  internet:     string;
  atendimento:  string;
  chamadas:     string;
  seguranca:    string;
  suporte:      string;   
  beneficios: Beneficio[];
}

export default function DescricaoPlano({
  children,
  planos,
}: {
  children: React.ReactNode;
  planos: PlanoComBeneficios;
}) {
  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">
            Plano {planos.nome}
          </h2>
          <p className="text-lg text-gray-600">
            {planos.descricao}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Benefícios fixos */}
          <div className="flex items-start gap-4">
            <Wifi className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-blue-700">{planos.internet} de Internet</h3>
              <p className="text-gray-600 text-sm">
                Conexão ultrarrápida com estabilidade garantida para streaming, trabalho remoto e jogos online.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-blue-700">Chamadas {planos.chamadas}</h3>
              <p className="text-gray-600 text-sm">
                Ligue para sem custo adicional, com qualidade HD.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-blue-700">Atendimento {planos.atendimento}</h3>
              <p className="text-gray-600 text-sm">
                Suporte dedicado {planos.suporte} com prioridade no atendimento e resolução de problemas.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-blue-700">Segurança {planos.seguranca}</h3>
              <p className="text-gray-600 text-sm">
                Proteção de dados com criptografia de ponta e monitoramento constante.
              </p>
            </div>
          </div>
        </div>

        {/* Benefícios dinâmicos */}
        {planos.beneficios.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">Benefícios adicionais:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              {planos.beneficios.map((beneficio) => (
                <li key={beneficio.id}>{beneficio.descricao}</li>
              ))}
            </ul>
          </div>
        )}

        {children}
      </div>
    </main>
  );
}
