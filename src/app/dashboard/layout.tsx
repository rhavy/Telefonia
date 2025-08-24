import DashboardHeader from "./_components/header";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardHeader />
      <main className="w-full mx-auto">
        {children}
      </main>
    </>
  )
}