import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { CreatePostForm } from "@/components/posts/create-post-form";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#050816" }}>
      <AppSidebar />
      {/* Main content — offset by sidebar width on desktop */}
      <div style={{ marginLeft: 0 }} className="dashboard-main">
        <style>{`
          @media (min-width: 1024px) {
            .dashboard-main {
              margin-left: 240px;
            }
          }
        `}</style>
        <TopBar />
        <main style={{ padding: "24px" }}>
          {children}
        </main>
      </div>
      <CreatePostForm />
    </div>
  );
}
