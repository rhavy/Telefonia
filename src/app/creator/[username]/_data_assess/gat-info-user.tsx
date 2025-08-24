"use server"

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const getInforUserSchemar = z.object({
    username: z.string({message: "O username é obrigatorio!"}).min(4, "o Username precisa ter no minimo 4 caracter!")
})
type GetInforUserSchemar = z.infer<typeof getInforUserSchemar>

export async function getInforUser(data: GetInforUserSchemar) {
    const schemar = getInforUserSchemar.safeParse(data);
    if(!schemar.success){
        return null;
    }
    try {
        const user = await prisma.user.findUnique({
            where:{
                username: data.username
            }
        }) 
        return user;
    } catch (err) {
        return null;   
    }
}