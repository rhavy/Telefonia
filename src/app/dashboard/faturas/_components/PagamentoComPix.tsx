import { PixCanvas } from 'react-qrcode-pix';

// Supondo que você receba a chave PIX como uma prop
// ou a tenha em um estado (ex: const [pixKey, setPixKey] = useState('N/A');)
export function PagamentoComPix({ titulo, carregamento, chavePix, nome, city, amount, }:{titulo: string, carregamento: String, chavePix: string, nome: string, city:string, amount:number, }) {

  // 1. Verifica se a chave é válida antes de renderizar
  const isPixKeyValid = chavePix && chavePix !== 'N/A';

  return (
    <div>
      <h2>{titulo} </h2>
      
      {/* 2. Só renderiza o PixCanvas se a chave for válida */}
      {isPixKeyValid ? (
        <PixCanvas
          pixkey={chavePix}
          merchant={nome}
          city={city}
          amount={amount}
        />
      ) : (
        // 3. Mostra uma mensagem de carregamento ou erro enquanto a chave não chega
        <p>{carregamento}</p>
      )}
    </div>
  );
}