import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";

interface CoverSectionProps{
    coverImage: string;
    profileImage: string;
    nome: string;
}

export function CoverSection({coverImage, profileImage, nome}: CoverSectionProps ) {
 return (
    <div className="relative h-48 w-full sm:h-64 md:h-80">
        <Image src={coverImage} alt="Capa do Usuario" fill className="object-cover" priority quality={100}/>
        <div className=" absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute bottom-2 md:bottom-6 left-0 right-0 p-4 nd:p-8">
            <div className="container mx-auto nax-w-6xl">
                <div className="flex flex-col items-center sm:items-end sm:flex-row gap-4 sm:gap-6">
                    <div className="relative flex-shrink-0">
                        <Avatar className="h-20 w-20 sm:w-24 sm:h-24 md:w-32 md:h-32 shadow group">
                            <AvatarImage src={profileImage} className="rounded-full border-2 md:border-4 border-white group-hover:scale-125 duration-300 group-hover:-rotate-6"/>
                            <AvatarFallback className="text-lg md:text-xl font-bold">{nome.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="pb-0 sm:pb-4">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white text-center sm:text-left">{nome}</h1>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
}