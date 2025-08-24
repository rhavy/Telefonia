"use server";
import { prisma } from "@/lib/prisma";

// Função server para buscar perfil
export async function getUserProfile(userId: string) {
  if (!userId) return null;

  const perfil = await prisma.perfil.findFirst({
    where: { userId },
    include: { user: { select: { role: true } } },
  });

  if (!perfil || !perfil.user) return null;

  return { ...perfil, role: perfil.user.role || "User" };
}
