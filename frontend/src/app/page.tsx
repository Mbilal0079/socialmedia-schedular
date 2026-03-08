import Link from "next/link";
import { ArrowRight, Calendar, Zap, BarChart3, Shield, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between mx-auto px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">PostPilot</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signin">
              <Button>
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
              <Zap className="mr-2 h-4 w-4 text-yellow-500" />
              Powered by BullMQ — Posts publish at the exact second
            </div>

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              Schedule Your Social Media{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Like a Pro
              </span>
            </h1>

            <p className="text-xl text-muted-foreground">
              Create, schedule, and publish posts across Twitter, Facebook,
              LinkedIn, and Instagram — all from one beautiful dashboard.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/auth/signin">
                <Button size="lg" className="text-lg">
                  Start Scheduling <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-lg">
                  See Features
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t bg-muted/30 py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Everything You Need
            </h2>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Calendar,
                  title: "Smart Scheduling",
                  description:
                    "Pick the perfect date and time. BullMQ ensures your posts publish at the exact moment you choose.",
                },
                {
                  icon: Globe,
                  title: "Multi-Platform",
                  description:
                    "Publish to Twitter, Facebook, LinkedIn, and Instagram simultaneously with one click.",
                },
                {
                  icon: BarChart3,
                  title: "Analytics Dashboard",
                  description:
                    "Track your posts performance with detailed analytics and success rates.",
                },
                {
                  icon: Clock,
                  title: "Background Jobs",
                  description:
                    "Powered by BullMQ + Redis. Your posts are queued reliably and retried on failure.",
                },
                {
                  icon: Shield,
                  title: "Secure Auth",
                  description:
                    "Sign in with Google, GitHub, or email. Powered by NextAuth.js with JWT sessions.",
                },
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description:
                    "Built with Next.js 14, Hono, and PostgreSQL. Enterprise-grade performance.",
                },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="rounded-xl border bg-background p-6 transition-shadow hover:shadow-lg"
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built with love using Next.js, Hono, Prisma, BullMQ and more.
          </p>
        </div>
      </footer>
    </div>
  );
}
