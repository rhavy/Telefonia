"use client"; 

import Footer from "@/components/template/footer";
import ListasFatura from "./_components/listaFatura";
import { useFaturaTraducoes } from "@/utils/translateClient";

export default function FaturasPage() {
  const { titulo, subTitulo } = useFaturaTraducoes();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-700 tracking-tight mb-3">
              {titulo}
            </h1>
            <p className="text-gray-600 text-lg">{subTitulo}</p>
          </div>

          <ListasFatura />
        </div>
      </main>

      <Footer />
    </div>
  );
}
