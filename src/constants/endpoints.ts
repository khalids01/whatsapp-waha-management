export const endpoints = {
  api: {
    applications: "/api/applications",
    app: (slug: string) => `/api/applications/${encodeURIComponent(slug)}`,
    keys: (slug: string) => `/api/applications/${encodeURIComponent(slug)}/keys`,
    key: (slug: string, id: string) => `/api/applications/${encodeURIComponent(slug)}/keys/${encodeURIComponent(id)}`,
    overview: "/api/dashboard/overview",
    sendMsg: "/api/chat/send"
  },
  waha: {
    auth:{
      qr: (session: string) => `/api/${encodeURIComponent(session)}/auth/qr`,
    },
    session: {
      list: "/api/sessions",
      single: (id: string) => `/api/sessions/${encodeURIComponent(id)}`,
      start: (id: string) => `/api/sessions/${encodeURIComponent(id)}/start`,
      stop: (id: string) => `/api/sessions/${encodeURIComponent(id)}/stop`,
      delete: (id: string) => `/api/sessions/${encodeURIComponent(id)}`,
      me: (id: string) => `/api/sessions/${encodeURIComponent(id)}/me`,
      restart: (id: string) => `/api/sessions/${encodeURIComponent(id)}/restart`,
      logout: (id: string) => `/api/sessions/${encodeURIComponent(id)}/logout`,
    },
    observability: {
      health: "/health",
      serverVersion: "/api/server/version",
    },
    chatting: {
      send: "/api/sendText",
    }

  },
  pages: {
    dashboard: "/dashboard",
    applications: "/dashboard/applications",
    application: (slug: string) => `/dashboard/applications/${encodeURIComponent(slug)}`,
    signin: "/sign-in",
    signup: "/sign-up",
  },
} as const;
