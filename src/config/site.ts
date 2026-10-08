export const siteConfig = {
  name: "Gym Management System",
  shortName: "GymMS",
  description: "Production-ready gym and fitness club management platform.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  roles: ["ADMIN", "MEMBER"] as const,
  defaultRedirects: {
    ADMIN: "/admin",
    MEMBER: "/member",
  },
} as const;

export type SiteConfig = typeof siteConfig;
