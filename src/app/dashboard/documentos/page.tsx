"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useState } from "react";
import Footer from "@/components/template/footer";

type Documento = {
  id: number;
  nome: string;
  status: "pendente" | "aprovado" | "rejeitado";
  url?: string;
};

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState<Documento[]>([
    { id: 1, nome: "RG - Frente", status: "aprovado", url: "/docs/rg_frente.pdf" },
    { id: 2, nome: "RG - Verso", status: "pendente" },
    { id: 3, nome: "Comprovante de Endereço", status: "rejeitado" },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-16">
          {/* Título */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-700 tracking-tight mb-3">
              Meus Documentos
            </h1>
            <p className="text-gray-600 text-lg">
              Gerencie seus documentos enviados para validação.
            </p>
          </div>

          {/* Lista de Documentos */}
          <div className="grid gap-6 max-w-3xl mx-auto">
            {documentos.map((doc) => (
              <Card key={doc.id} className="shadow-sm hover:shadow-md transition rounded-2xl">
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <FileText className="h-5 w-5 text-blue-600" />
                    {doc.nome}
                  </CardTitle>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      doc.status === "aprovado"
                        ? "bg-green-100 text-green-700"
                        : doc.status === "pendente"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {doc.status === "aprovado" && (
                      <CheckCircle2 className="inline-block mr-1 h-4 w-4" />
                    )}
                    {doc.status === "pendente" && (
                      <Clock className="inline-block mr-1 h-4 w-4" />
                    )}
                    {doc.status === "rejeitado" && (
                      <XCircle className="inline-block mr-1 h-4 w-4" />
                    )}
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                </CardHeader>

                <CardContent className="flex justify-between items-center">
                  {doc.url ? (
                    <a
                      href={doc.url}
                      download
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Baixar Documento
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">Nenhum arquivo enviado</p>
                  )}

                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    {doc.url ? "Reenviar" : "Enviar"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
