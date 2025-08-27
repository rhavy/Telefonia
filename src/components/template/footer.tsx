"use client"

import { useFooterTraducoes } from "@/utils/translateClient";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  
  const {
    infSobreEmpresa, institucional, institucionalSobre, institucionalTrabalhe, institucionalTermos, institucionalPolitica, contato, email, endereco, direitos
  } = useFooterTraducoes();
 return (
    <footer className="bg-blue-50 mt-24">
        <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-700">
          <div>
            <h4 className="text-lg font-semibold text-blue-700 mb-4">ConectaNet</h4>
            <p>{infSobreEmpresa}</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-blue-700 mb-4">{institucional}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">{institucionalSobre}</a></li>
              <li><a href="#" className="hover:underline">{institucionalTrabalhe}</a></li>
              <li><a href="#" className="hover:underline">{institucionalTermos}</a></li>
              <li><a href="#" className="hover:underline">{institucionalPolitica}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-blue-700 mb-4">{contato}</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-600" /> {email}</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600" /> {endereco}</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} {direitos}
        </div>
    </footer>
  );
}