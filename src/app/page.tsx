import Link from "next/link";
import { Dumbbell, ShieldCheck, Database, LayoutGrid, KeyRound, CheckCircle2 } from "lucide-react";
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
      badge: "Schema Validated",
    },
    {
      icon: <KeyRound className="h-5 w-5 text-primary" />,
      title: "Auth.js & RBAC",
      description: "Dual-role architecture (ADMIN & MEMBER) with defense-in-depth route protection and JWT sessions.",
      badge: "Configured",
    },
    {
      icon: <LayoutGrid className="h-5 w-5 text-primary" />,
      title: "Design System & UI",
      description: "Curated dark tokens (#0B0D0F, #15191D, #B7F34A), Plus Jakarta Sans, and 11 foundational UI components.",
      badge: "Ready",
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-primary" />,
      title: "Quality & Tooling",
      description: "Strict TypeScript, ESLint, Prettier, Zod validations, QR generation/decoding, and path aliases (@/*).",
      badge: "Verified",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top Header */}
      <header className="border-b border-border bg-card/40 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black">
              <Dumbbell className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-sm sm:text-base tracking-wider uppercase text-foreground">
              {siteConfig.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="success" size="sm">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-success mr-1.5 animate-pulse" />
              Foundation Active
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex max-w-6xl flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <div className="max-w-2xl space-y-4">
          <Badge variant="primary" size="md">
            Phase 1 Foundation Setup
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground lg:text-5xl">
            Production-Ready Architecture Established
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            The structural foundation for the Gym Management web platform is fully initialized.
            Core database models, role-based authentication, and the fitness-focused design system are configured.
          </p>
          <div className="pt-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-extrabold text-[#0B0D0F] hover:bg-primary-hover active:scale-[0.98] transition-all"
            >
              <span>Open Admin Dashboard</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Foundation Status Cards */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {foundations.map((item, index) => (
            <Card key={index} hoverEffect>
              <CardHeader className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    {item.icon}
                  </div>
                  <Badge variant="outline" size="sm">
                    <CheckCircle2 className="h-3 w-3 text-success mr-1" />
                    {item.badge}
                  </Badge>
                </div>
                <CardTitle className="mt-3 text-base">{item.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Design Tokens Preview Section */}
        <div className="mt-10 rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Design Tokens & Component Foundation
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
            <Badge variant="primary">#B7F34A</Badge>
            <Badge variant="success">#4ADE80</Badge>
            <Badge variant="warning">#FBBF24</Badge>
            <Badge variant="danger">#F87171</Badge>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Gym Management System • Production Foundation • Next.js & PostgreSQL
      </footer>
    </div>
  );
}
