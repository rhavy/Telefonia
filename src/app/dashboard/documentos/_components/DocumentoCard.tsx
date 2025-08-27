"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle2, Clock, XCircle, Image as ImageIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useFaturaTraducoes } from "@/utils/translateClient";

export type DocumentoType = {
  id: string;
  nome: string;
  tipo: "RG" |"CPF"| "RESIDENCIA"
  status: "PENDENTE" | "APROVADO" | "REJEITADO";
  url?: string | null;
};

type Props = {
  doc: DocumentoType;
  selectedDoc: string | null;
  setSelectedDoc: (id: string | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
};

export default function DocumentoCard({ doc, selectedDoc, setSelectedDoc, fileInputRef }: Props) {
  const [previewFile, setPreviewFile] = useState<{ name: string; url?: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const queryClient = useQueryClient();

  // Ouvir seleção de arquivo
  useEffect(() => {
    function handleFileSelected(event: CustomEvent) {
      const file: File = event.detail.file;
      if (selectedDoc !== doc.id) return;

      // Criar preview se imagem
      const preview = {
        name: file.name,
        url: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      };
      setPreviewFile(preview);
      setUploadProgress(0);
    }

    window.addEventListener("file-selected", handleFileSelected as EventListener);
    return () => window.removeEventListener("file-selected", handleFileSelected as EventListener);
  }, [selectedDoc, doc.id]);
  const { baixarFatura, baixarFaturaErro, } = useFaturaTraducoes();

  return (
    <Card className="shadow-sm hover:shadow-md transition rounded-2xl">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <FileText className="h-5 w-5 text-blue-600" />
          {doc.nome}
        </CardTitle>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            doc.status === "APROVADO"
              ? "bg-green-100 text-green-700"
              : doc.status === "PENDENTE"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {doc.status === "APROVADO" && <CheckCircle2 className="inline-block mr-1 h-4 w-4" />}
          {doc.status === "PENDENTE" && <Clock className="inline-block mr-1 h-4 w-4" />}
          {doc.status === "REJEITADO" && <XCircle className="inline-block mr-1 h-4 w-4" />}
          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1).toLowerCase()}
        </span>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          {doc.url ? (
            <a href={doc.url} download className="text-sm text-blue-600 hover:underline">
              {baixarFatura}
            </a>
          ) : (
            <p className="text-sm text-gray-500">{baixarFaturaErro}</p>
          )}
        </div>

        {/* Preview do arquivo + barra de progresso */}
        {previewFile && selectedDoc === doc.id && (
          <div className="flex flex-col gap-2 p-3 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-3">
              {previewFile.url ? (
                <img
                  src={previewFile.url}
                  alt="preview"
                  className="h-12 w-12 object-cover rounded-md border"
                />
              ) : (
                <ImageIcon className="h-10 w-10 text-gray-500" />
              )}
              <span className="text-sm text-gray-700 truncate">{previewFile.name}</span>
            </div>

            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
