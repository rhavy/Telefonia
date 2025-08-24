import { Mail, MapPin } from "lucide-react";

export default function Footer() {
 return (
    <footer className="bg-blue-50 mt-24">
        <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-700">
          <div>
            <h4 className="text-lg font-semibold text-blue-700 mb-4">ConectaNet</h4>
            <p>Conectando pessoas e empresas com soluções modernas em telefonia e internet.</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-blue-700 mb-4">Institucional</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Sobre nós</a></li>
              <li><a href="#" className="hover:underline">Trabalhe conosco</a></li>
              <li><a href="#" className="hover:underline">Termos de uso</a></li>
              <li><a href="#" className="hover:underline">Política de privacidade</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-blue-700 mb-4">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-600" /> contato@conectanet.com</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600" /> Rua das Comunicações, 123 - São Paulo, SP</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ConectaNet. Todos os direitos reservados.
        </div>
    </footer>
  );
}