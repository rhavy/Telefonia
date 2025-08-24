import { getInforUser } from "./_data_assess/gat-info-user";
import FormDonate from "./_components/form";
import { notFound } from "next/navigation";
import { CoverSection } from "./_components/cover-section";
import { AboutSection } from "./_components/about-section";

export default async function Apoia({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params;

  const user = await getInforUser({username});
  if(!user){
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <CoverSection coverImage={user?.image ?? ""} profileImage={user?.image ?? ""} nome={user?.name ?? "Sem nome"}/>
      <main className="container mx-auto max-w-6xl p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 -mt-8 md:-mt-16 relative z-10">
          <div className="order-2 lg:order-1">
            <AboutSection description={user?.bio ?? "Sem Biografia"} name={user?.name ?? "Sem Nome"}/>
          </div>
          <div className="order-1 lg:order-2">
            <FormDonate slug={user?.username!} creatorId={user?.connectedStripeAccountId ?? ""} />
          </div>
        </div>
      </main>
    </div>
  )
}
