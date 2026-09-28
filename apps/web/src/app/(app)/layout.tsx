import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { BackendWarmupBanner } from "@/components/ui/BackendWarmupBanner";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F4F6F9] text-[#334155] overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav />
        <BackendWarmupBanner />
        <main className="flex-1 overflow-y-auto relative">
          {children}
        </main>
      </div>
    </div>
  );
}
