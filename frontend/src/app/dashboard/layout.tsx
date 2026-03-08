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
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="lg:pl-64">
        <TopBar />
        <main className="p-6">{children}</main>
      </div>
      <CreatePostForm />
    </div>
  );
}
