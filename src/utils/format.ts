export function formatCurrency(value: number):string{
    return new Intl.NumberFormat('pt-BR',{
        style: "currency",
        currency: "BRL",
    }).format(value)
}

export function formateDate(date: Date): string {
    return new Intl.DateTimeFormat('pr-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',    
    }).format(new Date(date))
} 
export function formatarTelefone(numero: string): string {
  const apenasDigitos = numero.replace(/\D/g, '');

  if (apenasDigitos.length === 11) {
    // Celular: (XX) 9XXXX-XXXX
    return apenasDigitos.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (apenasDigitos.length === 10) {
    // Fixo: (XX) XXXX-XXXX
    return apenasDigitos.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  return numero; // Retorna como está se não bater com os padrões
}

export function formatDataBrasileira(data?: string): string {
  if (!data) return "";
  const d = new Date(data);
  return d.toLocaleDateString("pt-BR"); // Ex: 22/08/2025
}

export function sanitizeName(name: string): string {
  return name
    .normalize("NFD") // separa acentos das letras
    .replace(/[\u0300-\u036f]/g, "") // remove os acentos
    .replace(/[^a-zA-Z0-9]/g, "") // remove caracteres especiais e espaços
    .toLowerCase(); // opcional: tudo minúsculo
}

export function isValiCdPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let firstCheck = (sum * 10) % 11;
  if (firstCheck === 10 || firstCheck === 11) firstCheck = 0;
  if (firstCheck !== parseInt(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  let secondCheck = (sum * 10) % 11;
  if (secondCheck === 10 || secondCheck === 11) secondCheck = 0;
  return secondCheck === parseInt(cpf[10]);
}

export const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, '') // Remove tudo que não for número
    .slice(0, 11)        // Limita a 11 dígitos
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export function isValidCEP(cep: string): boolean {
  const cleaned = cep.replace(/\D/g, '');
  return /^[0-9]{8}$/.test(cleaned);
}


export const formatCEP = (value: string) => {
  return value
    .replace(/\D/g, '')        // Remove tudo que não for número
    .slice(0, 8)               // Limita a 8 dígitos
    .replace(/(\d{5})(\d)/, '$1-$2'); // Aplica a máscara
};


export function isUnder18(nasc: string | Date): boolean {
  const birthDate = new Date(nasc);
  const today = new Date();

  const age = today.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  return age < 18 || (age === 18 && !hasHadBirthdayThisYear);
}
