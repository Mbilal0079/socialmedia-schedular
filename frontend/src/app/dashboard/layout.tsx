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
    <div style={{ minHeight: "100vh", background: "#050816", display: "flex" }}>
      <AppSidebar />
      <div style={{ flex: 1, minWidth: 0, marginLeft: 240 }}>
        <TopBar />
        <main style={{ padding: "24px" }}>
          {children}
        </main>
      </div>
      <CreatePostForm />
    </div>
  );
}
