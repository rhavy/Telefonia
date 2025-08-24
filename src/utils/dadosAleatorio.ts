import { prisma } from "@/lib/prisma";

export async function dadosAleatoriosAdmin(){
    await prisma.administrador.create({
        data: {
        nome: "Rahvy moraes",
        email: "admin@email.com",
        senhaHash: "123456789",
        },
    });
}

export async function dadosAleatoriosPlano(id:string){    
    await prisma.plano.create({
    data: {
        nome: "Intermediário",
        descricao: "Perfeito para famílias e uso moderado.",
        precoMensal: 10000,
        precoAnual: 80000,
        internet:      "300MB",
        atendimento:   "VIP",
        chamadas:      "ilimitadas nacionais",
        seguranca:     "avançada",
        suporte:       "24h",       
        adminId: id,
        },
    });
    await prisma.plano.create({
        data: {
        nome: "Básico",
        descricao: "Ideal para iniciantes",
        precoMensal: 4900,
        precoAnual: 50000,
        internet:      "100MB",
        atendimento:   "VIP",
        chamadas:      "limitadas locais",
        seguranca:     "avançada",
        suporte:       "24h",       
        adminId: id,
        },
    });
}

export async function dadosAleatoriosBeneficios(id:string){    
    
    await prisma.beneficioPlano.create({
        data: {
        descricao: "100MB de internet",
        planoId: id,
        },
    });
    await prisma.beneficioPlano.create({
        data: {
        descricao: "Chamadas limitadas locais",
        planoId: id,
        },
    });
    await prisma.beneficioPlano.create({
        data: {
        descricao: "Suporte 24h",
        planoId: id,
        },
    });
}