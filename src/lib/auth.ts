
// import NextAuth from "next-auth"
// import { PrismaAdapter } from "@auth/prisma-adapter"
// import { prisma } from "./prisma"
// import Google from "next-auth/providers/google"
 
// export const { handlers, auth, signIn, signOut } = NextAuth({
//   secret: process.env.AUTH_SECRET,
//   trustHost: true,
//   adapter: PrismaAdapter(prisma),
//   providers: [Google],
// })

import { prismaAdapter } from 'better-auth/adapters/prisma';
import { betterAuth } from "better-auth";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    // Ajuste se usar outro provedor
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true, 
    requireEmailVerification: true,    
  }, 
  user:{
    additionalFields:{
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        label: "Função",
        placeholder: "USER, ADMIN, SUPERADMIN",
        helpText: "Define o nível de acesso do usuário",
        options: [
          { value: "USER", label: "Usuário" },
          { value: "ADMIN", label: "Administrador" },
          { value: "SUPERADMIN", label: "Super Administrador" },
        ],
        description: "Permissão atribuída ao usuário",
      }
    }    
  },
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID as string, 
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string, 
    }, 
  },
   
});
