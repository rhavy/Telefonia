"use client";

import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Footer from "@/components/template/footer";
import DocumentoCard, { DocumentoType } from "./_components/DocumentoCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Clock, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useDocumentosTraducoes } from "@/utils/translateClient";

export default function DocumentosPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { 
    titulo, subTitulo, isLoadingDoc, erroDoc, erroReDoc, erroReDescDoc, sussecTitleDoc, sussecMessDoc, erroProcDoc, statusAguardandoDoc, statusDocumentacaoDoc, 
    statusDocumentacaoRecusadaDoc, tiposDocumentosRecusadaDoc, buttonEnviarDocumentacaoDoc, buttonReEnviarDocumentacaoDoc, nessageEnviarDocumentacaoDoc } = useDocumentosTraducoes();
  const tiposDocumentos = [
    { id: "RG", nome: "RG/CNH" },
    { id: "CPF", nome: "CPF" },
    { id: "RESIDENCIA", nome: `${tiposDocumentosRecusadaDoc}` },
  ];

  const { data: documentos = [], isLoading, error } = useQuery<DocumentoType[]>({
    queryKey: ["documentos"],
    queryFn: async () => {
      const res = await fetch("/api/documentos");
      const json = await res.json();
      if (!json.ok) return [];
      return json.data;
    },
    refetchInterval: 10000,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !selectedDoc) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("docId", selectedDoc);

    try {
      const res = await fetch("/api/documentos", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `${erroReDescDoc}` }));
        throw new Error(errorData.error || `${erroReDoc}`);
      }

      await res.json();
      toast.success(`✅ ${sussecTitleDoc} ${selectedDoc} ${sussecMessDoc}`);
      
      // 🔄 Atualiza a lista de documentos
      queryClient.invalidateQueries({ queryKey: ["documentos"] });
    } catch (err: any) {
      toast.error(err.message);
      console.error(`${erroProcDoc}`, err);
    } finally {
      setSelectedDoc(null);
    }
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return (
          <div className="flex items-center gap-2 text-yellow-600 bg-yellow-100 px-3 py-2 rounded-lg text-sm font-medium">
            <Clock className="h-4 w-4" /> {statusAguardandoDoc}
          </div>
        );
      case "APROVADO":
        return (
          <div className="flex items-center gap-2 text-green-600 bg-green-100 px-3 py-2 rounded-lg text-sm font-medium">
            <CheckCircle2 className="h-4 w-4" /> {statusDocumentacaoDoc}
          </div>
        );
      case "REJEITADO":
        return (
          <div className="flex items-center gap-2 text-red-600 bg-red-100 px-3 py-2 rounded-lg text-sm font-medium">
            <XCircle className="h-4 w-4" /> {statusDocumentacaoRecusadaDoc}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-700 tracking-tight mb-3">
              {titulo}
            </h1>
            <p className="text-gray-600 text-lg">
              {subTitulo}
            </p>
          </div>

          {isLoading && <p className="text-center text-gray-500">{isLoadingDoc}</p>}
          {error && <p className="text-center text-red-500">{erroDoc}</p>}

          {!isLoading && !error && (
            <div className="space-y-6 mb-6">
              {tiposDocumentos.map((tipo) => {
                const documento = documentos.find((d) => d.tipo === tipo.id);

                return (
                  <Card
                    key={tipo.id}
                    className="shadow-sm hover:shadow-md transition rounded-2xl max-w-3xl mx-auto border border-gray-200"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        {tipo.nome}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      {!documento ? (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedDoc(tipo.id);
                            fileInputRef.current?.click();
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" /> {buttonEnviarDocumentacaoDoc}
                        </Button>
                      ) : (
                        <div className="w-full flex flex-col items-center gap-3">
                          {renderStatus(documento.status)}

                          {documento.status === "PENDENTE" && (
                            <p className="text-sm text-gray-500">
                              {nessageEnviarDocumentacaoDoc}
                            </p>
                          )}

                          {documento.status === "REJEITADO" && (
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedDoc(tipo.id);
                                fileInputRef.current?.click();
                              }}
                            >
                              <Upload className="h-4 w-4 mr-2" /> {buttonReEnviarDocumentacaoDoc}
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {!isLoading && !error && documentos.length > 0 && (
            <div className="grid gap-6 max-w-3xl mx-auto">
              {documentos
                .filter((doc) => doc.status === "APROVADO")
                .map((doc) => (
                  <DocumentoCard
                    key={doc.id}
                    doc={doc}
                    selectedDoc={selectedDoc}
                    setSelectedDoc={setSelectedDoc}
                    fileInputRef={fileInputRef}
                  />
                ))}
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,application/pdf"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
