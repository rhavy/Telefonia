"use server"

import { signOut } from "@/lib/auth"

export async function Logout() {
 await signOut();
}