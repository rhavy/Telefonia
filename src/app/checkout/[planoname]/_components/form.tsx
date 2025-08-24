'use client';

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { format } from "date-fns";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateAssinar } from "@/app/checkout/_actions/create-assinar"; // Verifique o caminho para sua Server Action
import { toast } from "sonner";
import { formatCEP, formatCPF, formatCurrency, isValiCdPF, isValidCEP, sanitizeName } from "@/utils/format";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { buscarCEP } from "@/utils/buscaCep";
import { Separator } from "@/components/ui/separator";
import { getStripeJs } from "@/lib/stripe-js";
import { authClient } from "@/lib/auth-client";
import { prisma } from "@/lib/prisma";

// Esquema de validação do formulário com Zod
const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório!"),
  email: z.string().email("E-mail inválido"),
  cpf: z
    .string()
    .min(11, "CPF é obrigatório")
    .refine((val) => isValiCdPF(val), {
      message: "CPF inválido",
  }),
  nasc: z
    .string()
    .refine((val) => {
      if (!val) return false;
      const nascimento = new Date(val);
      const hoje = new Date();
      const maioridade = new Date(
        hoje.getFullYear() - 18,
        hoje.getMonth(),
        hoje.getDate()
      );
      return nascimento <= maioridade;
    }, "É necessário ter no mínimo 18 anos."),
  cep: z
    .string()
    .min(8, "O CEP é obrigatório!")
    .refine((val) => isValidCEP(val), {
      message: "CEP inválido",
    }),
  genero: z.string().min(1, "Gênero é obrigatório!"),
  rua: z.string().min(1, "Rua é obrigatória!"),
  numero: z.string().min(0, "Número é obrigatório!"),
  referencia: z.string().min(1, "Referência é obrigatória!"),
  bairro: z.string().min(1, "Bairro é obrigatório!"),
  cidade: z.string().min(1, "Cidade é obrigatória!"),
  estado: z.string().min(1, "Estado é obrigatório!"),
  pais: z.string().min(1, "País é obrigatório!"),
  password: z.string().min(8, "Senha deve Conter pelo memos 6 Caracteres"),
  passwordConfime: z.string().min(8, "Senha deve Conter pelo memos 6 Caracteres"),
  periodo: z.string({
    required_error: "O Periodo é obrigatorio.",
  }),
  pagamento: z.string().min(1, "O pagamento é obrigatorio!"),
}).refine((data) => data.password === data.passwordConfime, {
    message: "As senhas não coincidem",
    path: ["passwordConfime"],
  });

// Tipagem dos dados do formulário
type FormData = z.infer<typeof formSchema>;

// Interfaces para as propriedades do componente
interface Beneficio {
  id: string;
  descricao: string;
}
interface FormAssinarProps {
  id:           string;
  nome:         string;
  precoMensal:  number;
  precoAnual:   number;
  desconto:     number;
  descricao:    string;
  internet:     string;
  atendimento:  string;
  chamadas:     string;
  seguranca:    string;
  suporte:      string;
  beneficios:   Beneficio[];
}

export default function AssinarContrato({plano}:{ plano : FormAssinarProps}) {
  // Inicialização do formulário com react-hook-form e zodResolver
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name:             "",
      email:            "",
      cpf:              "",
      cep:              "",
      genero:           "",
      nasc:             "",
      rua:              "",
      numero:           "",
      referencia:       "",
      bairro:           "",
      cidade:           "",
      estado:           "",
      pais:             "",
      password:         "",
      passwordConfime:  "",
      periodo:          "",
      pagamento:        "",
    },
  });

  const [date, setDate] = useState<Date | undefined>();

  // Função chamada ao submeter o formulário

  async function onSubmit(datas: FormData) {
    try {
      const verificar = await verificarCliente({
        email: datas.email.trim(),
        cpf: datas.cpf,
        nasc: datas.nasc,
      });
      if (verificar.error) {
        toast.error(verificar.error);
        return;
      }
      const { data, error } = await authClient.signUp.email({
        name: datas.name,
        email: datas.email,
        password: datas.password,        
      });

      if (error || !data) {
        toast.error("Erro ao cadastrar");
        return;
      }

      const ciarPerfil =  await perfilCliente({
        id: data.user.id,
        cpf: datas.cpf,
        genero: datas.genero,
        nasc: datas.nasc,
        cep: datas.cep,
        logradouro: datas.rua,
        numero: datas.numero,
        complemento: datas.referencia,
        bairro: datas.bairro,
        cidade: datas.cidade,
        estado: datas.estado,
        pais: datas.pais,
      });
      if (!ciarPerfil || ciarPerfil.error) {
        toast.error("Erro ao Criar perfil cliente: " + (ciarPerfil?.error || "Resposta nula"));
        return;
      }
      const checkout = await CreateAssinar({
        idCliente: data.user.id,
        name: datas.name,
        periodo: datas.periodo === "MENSAL" ? "MENSAL" : "ANUAL",
        pagamento: datas.pagamento,
        valor: datas.periodo === "MENSAL" ? plano.precoMensal : plano.precoAnual,
        plano: plano.nome,
      });
      if ( !checkout || checkout.error) {
        toast.error(checkout.error);
        return;
      }
      await handlePaymentResponse(checkout);
      toast.success("Cadastro realizado com sucesso!");
      return;
      // await handlePaymentResponse(checkout);
    } catch (err) {
      console.error(err);
      toast.error("Erro inesperado");
    }
    
  }

async function verificarCliente({ email, cpf, nasc }: { email: string; cpf: string; nasc: string }) {
  try {
    const params = new URLSearchParams({ email, cpf, nasc });
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/checkout?${params.toString()}`);

    const result = await res.json();

    return {
      ok: res.ok,
      error: result.error,
    };
  } catch (err) {
    console.error("Erro ao verificar cliente:", err);
    return {
      ok: false,
      error: "Erro inesperado ao verificar cliente.",
    };
  }
}

async function perfilCliente({ id, ...dados }: { id: string; [key: string]: any }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...dados }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Erro ao atualizar cliente:", result.error || result);
      return { error: result.error || "Erro desconhecido ao atualizar cliente." };
    }

    return result;
  } catch (err) {
    console.error("Erro inesperado ao atualizar cliente:", err);
    return { error: "Erro inesperado ao atualizar cliente." };
  }
}


  // Função para lidar com a resposta da criação do checkout
  async function handlePaymentResponse(checkout: { sessionId?: string; error?: string }) {
    if(checkout.error){
      toast.error(checkout.error);
      return;
    }

    if(!checkout.sessionId){
      toast.error("Falha ao criar o pagamento, tente mais tarde.");
      return;
    }

    // 3. Redireciona para a página de pagamento do Stripe
    const stripe = await getStripeJs();

    if(!stripe){
      toast.error("Falha ao inicializar o sistema de pagamento, tente mais tarde.");
      return;
    }

    await stripe.redirectToCheckout({
      sessionId: checkout.sessionId
    });
  }

  return (
    <div className="gap-8 p-10">
      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm p-6 rounded-lg max-w-md mx-auto">
        <CardHeader className="mb-4">
          <CardTitle className="text-2xl font-bold text-gray-900">Fechar Contrato</CardTitle>
          <CardDescription className="text-gray-600 mt-1">
            Escolha o plano ideal e envie seus dados para iniciarmos o processo.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Nome */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="email@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CPF */}
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input
                        value={formatCPF(field.value)}
                        onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                        placeholder="000.000.000-00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sexo */}
              <FormField
                control={form.control}
                name="genero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexo</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o Sexo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MASCULINO">Mascúlino</SelectItem>
                          <SelectItem value="FEMININO">Fêminino</SelectItem>
                          {/* ...demais estados */}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              {/* Nascimento */}
              <FormField
                control={form.control}
                name="nasc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nascimento</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            data-empty={!date}
                            className="w-[280px] justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date
                              ? format(date, "dd/MM/yyyy")
                              : <span>Selecione uma data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            disabled={(d) => {
                              const hoje = new Date();
                              const maioridade = new Date(
                                hoje.getFullYear() - 18,
                                hoje.getMonth(),
                                hoje.getDate()
                              );
                              return d > maioridade;
                            }}
                            onSelect={(selectedDate) => {
                              setDate(selectedDate);
                              field.onChange(
                                selectedDate
                                  ? format(selectedDate, "yyyy-MM-dd")
                                  : ""
                              );
                            }}
                            fromYear={1950}
                            toYear={new Date().getFullYear() - 18}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CEP */}
              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input
                        value={formatCEP(field.value)}
                        maxLength={9}
                        onChange={async (e) => {
                          const rawCep = e.target.value.replace(/\D/g, "");
                          field.onChange(rawCep);

                          if (rawCep.length === 8) {
                            const endereco = await buscarCEP(rawCep);
                            if (endereco) {
                              form.setValue("rua", endereco.rua);
                              form.setValue("bairro", endereco.bairro);
                              form.setValue("cidade", endereco.cidade);
                              form.setValue("estado", endereco.uf);
                              form.setValue("pais", "BRASIL");
                            }
                          }
                        }}
                        placeholder="00000-000"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Rua */}
              <FormField
                control={form.control}
                name="rua"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rua</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua Exemplo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Numero */}
              <FormField
                control={form.control}
                name="numero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input placeholder="151" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Referência */}
              <FormField
                control={form.control}
                name="referencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referência</FormLabel>
                    <FormControl>
                      <Input placeholder="Próximo ao mercado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bairro */}
              <FormField
                control={form.control}
                name="bairro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Glória" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cidade */}
              <FormField
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Vila Velha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Estado */}
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o Estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ES">Espírito Santo</SelectItem>
                          <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                          <SelectItem value="SP">São Paulo</SelectItem>
                          {/* ...demais estados */}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* País */}
              <FormField
                control={form.control}
                name="pais"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o País" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BRASIL">Brasil</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />
              {/* password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* passwordConfime */}
              <FormField
                control={form.control}
                name="passwordConfime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmação de senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator />

                <FormField
                  control={form.control}
                  name="periodo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Escolha o Período de Cobrança
                      </FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="bg-white border border-gray-300 rounded-md px-4 py-2">
                            <SelectValue placeholder="Selecione o período" />
                          </SelectTrigger>
                          <SelectContent className="z-[999]">
                            <SelectItem value="MENSAL">
                              📆 Mensal — {formatCurrency(plano.precoMensal! / 100)} / mês
                            </SelectItem>
                            <SelectItem value="ANUAL">
                              📅 Anual — {formatCurrency(plano.precoAnual! / 100)} / ano
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("periodo") === "ANUAL" && plano.desconto > 0 && (
                  <div className="text-sm text-blue-500 font-medium">
                    Desconto de: {plano.desconto}% no plano anual
                  </div>
                )}
                {/* Forma de pagamento */}
                <FormField
                  control={form.control}
                  name="pagamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Escolha a forma de pagamento
                      </FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="bg-white border border-gray-300 rounded-md px-4 py-2">
                            <SelectValue placeholder="Selecione a forma de pagamento" />
                          </SelectTrigger>
                          <SelectContent className="z-[999]">
                            <SelectItem value="CARTAO">
                              Cartão
                            </SelectItem>
                            <SelectItem value="BOLETO">
                              Boleto
                            </SelectItem>
                            <SelectItem value="PIX">
                              Pix
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              {/* Botão */}
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
              >
                {form.formState.isSubmitting ? "Enviando..." : "Ir para o Pagamento"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
