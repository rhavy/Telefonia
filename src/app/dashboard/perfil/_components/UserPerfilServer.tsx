// src/components/UserPerfilServer.tsx
import UserPerfilClient from "./UserPerfilClient";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type UserPerfilClientProps = {
  session: {
    user: {
      name?: string;
      email?: string;
      image?: string;
      role?: string;
    };
  };
};
export default async function UserPerfilServer() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || session.user?.role !== "USER" ) {
    
    redirect("/login"); // já manda pro login
  }

  return <UserPerfilClient session={ session } />;
}
