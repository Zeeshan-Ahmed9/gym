import Link from "next/link";
import { Dumbbell, ShieldCheck, Database, LayoutGrid, KeyRound, CheckCircle2, ArrowRight, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  const foundations = [
    {
      icon: <Database className="h-5 w-5 text-primary" />,
      title: "Prisma & PostgreSQL",
      description: "Normalized schema with 6 core entities: User, Member, Membership, Payment, Attendance, Progress.",
      badge: "Validated",
    },
    {
      icon: <KeyRound className="h-5 w-5 text-primary" />,
      title: "Auth & Role Management",
      description: "Dual-role architecture (Admin & Member) with route protection and robust session management.",
      badge: "Configured",
    },
    {
      icon: <LayoutGrid className="h-5 w-5 text-primary" />,
      title: "Clean Light Design System",
      description: "Spacious fintech-inspired visual identity (#F5F8F6, #00A878 emerald, #E5F6EF mint, #17221D text).",
      badge: "Modern & Sleek",
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-primary" />,
      title: "Quality & Reliability",
      description: "Strict TypeScript, Next.js App Router, Zod validation schemas, and accessible UI components.",
      badge: "Verified",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-bold">
              <Dumbbell className="h-5 w-5" />
            </div>
            <span className="font-bold text-base tracking-tight text-foreground">
              {siteConfig.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/member"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs sm:text-sm font-semibold text-secondary-foreground hover:bg-[#F5F8F6] hover:text-foreground active:scale-[0.98] transition-all shadow-xs"
            >
              <User className="h-4 w-4 text-primary" />
              <span>Member Section</span>
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-primary-hover active:scale-[0.98] transition-all shadow-xs"
            >
              <span>Admin Console</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex max-w-6xl flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <div className="max-w-2xl space-y-4">
          <Badge variant="primary" size="md">
            Clean & Modern Gym App
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground lg:text-5xl">
            Streamlined Gym Management Experience
          </h1>
          <p className="text-base text-secondary-foreground leading-relaxed">
            A light, modern, spacious interface designed for gym operations.
            Effortlessly monitor memberships, manage attendance, track fee payments, and configure your facility.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover active:scale-[0.98] transition-all shadow-xs"
            >
              <span>Open Admin Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/member"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-secondary-foreground hover:bg-[#F5F8F6] hover:text-foreground active:scale-[0.98] transition-all shadow-xs"
            >
              <User className="h-4 w-4 text-primary" />
              <span>Member Section</span>
            </Link>
          </div>
        </div>

        {/* Foundation Status Cards */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {foundations.map((item, index) => (
            <Card key={index} hoverEffect>
              <CardHeader className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                    {item.icon}
                  </div>
                  <Badge variant="outline" size="sm">
                    <CheckCircle2 className="h-3 w-3 text-success mr-1" />
                    {item.badge}
                  </Badge>
                </div>
                <CardTitle className="mt-3.5 text-base font-semibold">{item.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed text-secondary-foreground">
                  {item.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Design Tokens Preview Section */}
        <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-xs">
          <h2 className="text-xs font-semibold text-secondary-foreground">
            Design Tokens & Components
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button variant="primary" size="sm">
              Primary Button
            </Button>
            <Button variant="secondary" size="sm">
              Secondary
            </Button>
            <Button variant="outline" size="sm">
              Outline
            </Button>
            <Button variant="danger" size="sm">
              Danger
            </Button>
            <Badge variant="primary">#00A878 Emerald</Badge>
            <Badge variant="success">#16865D Success</Badge>
            <Badge variant="warning">#B7791F Warning</Badge>
            <Badge variant="danger">#D64545 Danger</Badge>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Gym Management System • Light & Modern UI • Next.js
      </footer>
    </div>
  );
}
