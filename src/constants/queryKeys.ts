export const queryKeys = {
  apps: ["apps"] as const,
  app: (slug: string) => ["apps", slug] as const,
  keys: (slug: string) => ["apps", slug, "keys"] as const,
  sessions: ["sessions"] as const,
  session: (id: string) => ["sessions", id] as const,
} as const;
