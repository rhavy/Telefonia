import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Mars, Venus, VenusAndMars } from "lucide-react";
import React, { useState } from "react";

// Função para buscar CEP
async function buscarCEP(cep: string) {
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.erro) return null;
    return {
      rua: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      uf: data.uf,
    };
  } catch {
    return null;
  }
}

type FieldProps = {
  icon: React.ReactNode;
  value?: string;
  editValue?: string;
  fieldName: string;
  editMode: boolean;
  onChange: (key: string, value: string) => void;
  loading?: boolean;
};

export default function Field({
  icon,
  value = "",
  editValue = "",
  fieldName,
  editMode,
  onChange,
  loading = false,
}: FieldProps) {
  const [date, setDate] = useState<Date | undefined>(
    editValue ? new Date(editValue) : undefined
  );

  const renderInput = () => {
    const key = fieldName.toLowerCase();

    if (key === "genero") {
      return (
        <select
          className="border rounded-md p-2"
          value={editValue}
          onChange={(e) => onChange(fieldName, e.target.value)}
        >
          <option value="">Selecione</option>
          <option value="MASCULINO">Masculino</option>
          <option value="FEMININO">Feminino</option>
          <option value="OUTRO">Outro</option>
        </select>
      );
    }

    if (key === "cep") {
      return (
        <Input
          value={(editValue || "")
            .replace(/\D/g, "")
            .replace(/^(\d{5})(\d{0,3})/, "$1-$2")}
          maxLength={9}
          placeholder="00000-000"
          onChange={async (e) => {
            const rawCep = e.target.value.replace(/\D/g, "").slice(0, 8);
            onChange(fieldName, rawCep);

            if (rawCep.length === 8) {
              const endereco = await buscarCEP(rawCep);
              if (endereco) {
                onChange("logradouro", endereco.rua || "");
                onChange("bairro", endereco.bairro || "");
                onChange("cidade", endereco.cidade || "");
                onChange("estado", endereco.uf || "");
                onChange("pais", "BRASIL");
              }
            }
          }}
        />
      );
    }

    if (key === "cpf") {
      return (
        value
      //   <Input
      //     value={(editValue || "")
      //       .replace(/\D/g, "")
      //       .replace(/^(\d{3})(\d)/, "$1.$2")
      //       .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      //       .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{0,2})/, "$1.$2.$3-$4")}
      //     maxLength={14}
      //     placeholder="000.000.000-00"
      //     onChange={(e) => {
      //       const rawCpf = e.target.value.replace(/\D/g, "").slice(0, 11);
      //       onChange(fieldName, rawCpf);
      //     }}
      //   />
      );
    }
    if (key === "email") {
      return (value);
    }

  if (key === "nascimento") {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!date}
            className="w-[280px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd/MM/yyyy") : <span>Selecione uma data</span>}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            captionLayout={"dropdown"} 
            fromYear={1950}
            toYear={new Date().getFullYear() - 18} // só até maioridade
            disabled={(d) => {
              const hoje = new Date();
              const maioridade = new Date(
                hoje.getFullYear() - 18,
                hoje.getMonth(),
                hoje.getDate()
              );
              return d > maioridade; // bloqueia menor de 18
            }}
            onSelect={(selectedDate) => {
              const value = selectedDate
                ? format(selectedDate, "yyyy-MM-dd")
                : "";
              setDate(selectedDate);
              onChange(fieldName, value);
            }}
          />
        </PopoverContent>
      </Popover>

    );
  }


    return (
      <Input
        value={editValue}
        onChange={(e) => onChange(fieldName, e.target.value)}
      />
    );
  };

  const renderIcon = () => {
    const val = (value || "").toUpperCase();
    if (val === "MASCULINO") return <Mars className="text-blue-600" />;
    if (val === "FEMININO") return <Venus className="text-pink-500" />;
    if (val === "OUTRO") return <VenusAndMars className="text-purple-600" />;
    return icon;
  };

  return (
    <div className="flex items-center gap-3">
      {renderIcon()}
      {loading ? <p>Carregando...</p> : editMode ? renderInput() : <p>{value || "Não informado"}</p>}
    </div>
  );
}
