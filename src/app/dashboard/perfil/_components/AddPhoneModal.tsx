"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Phone, MessageSquare } from "lucide-react";
import { formatarTelefone } from "@/utils/format";

export function AddPhoneModal() {
  const [step, setStep] = useState<"number" | "code">("number");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  function sendCode() {
    const fullPhone = `+55${phone.replace(/\D/g, "")}`; // remove espaços, traços etc.

    if (!/^\+55\d{10,11}$/.test(fullPhone)) {
      alert("Número inválido. Ex: +5511999999999");
      return;
    }

    // Chamar API para envio do código
    console.log("Enviando código para:", fullPhone);
    setStep("code");
  }


  async function verifyCode() {
    // Simulação de chamada à API
    const isValid = await new Promise((resolve) => {
      setTimeout(() => resolve(code === "123456"), 1000);
    });

    if (isValid) {
      alert("Telefone validado com sucesso!");
      // salvar no backend
      setStep("number");
      setPhone("");
      setCode("");
    } else {
      alert("Código inválido!");
    }
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Phone className="h-4 w-4" /> Adicionar Telefone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "number" ? "Adicionar Telefone" : "Validar Código"}
          </DialogTitle>
        </DialogHeader>

        {step === "number" && (
          <div className="space-y-3">
            <Input
              placeholder="+55 11 99999-9999"
              value={formatarTelefone(phone)}
              maxLength={15}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button className="w-full" onClick={sendCode}>
              <MessageSquare className="h-4 w-4 mr-2" /> Enviar código via WhatsApp
            </Button>
          </div>
        )}

        {step === "code" && (
          <div className="space-y-3">
            <Input
              placeholder="Digite o código recebido"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("number")}>
                Voltar
              </Button>
              <Button onClick={verifyCode}>Validar</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
