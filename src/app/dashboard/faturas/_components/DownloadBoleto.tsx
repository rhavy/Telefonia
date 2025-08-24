import { Download } from "lucide-react";

export default function DownloadBoleto({ faturaId, visualizar }: { faturaId: string, visualizar: boolean }) {
  const baixarPdf = () => {
    window.open(`/api/fatura/${faturaId}/pdf`, "_blank");
  };
  if(visualizar){
    return (     
      <button onClick={baixarPdf} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
        <Download className="h-4 w-4" />
        Baixar Boleto
      </button>
    );
  }
  return(
    <button onClick={baixarPdf} className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition">
      <Download className="h-4 w-4" />
      Baixar boleto
    </button>
  );
}
