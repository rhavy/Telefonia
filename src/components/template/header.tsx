
import { Phone } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useHeaderTraducoes } from "@/utils/translateClient";
// Traduções

export default function Header() {
    const { button } = useHeaderTraducoes();
 return (
   <header className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center text-blue-600 font-bold text-xl">
                <Phone className="h-6 w-6 mr-2" />
                <span>ConectaNet</span>
            </Link>

            {/* Botão de login */}
            <Link href={"/login"}>
                <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 h-10 text-sm"
                >
                    {button}
                </Button>            
            </Link>
        </div>
    </header>

  );
}