import { z } from "zod"

export const CreateSessionBodySchema = z.object({
  name: z.string(),
  engine: z.enum(["webjs", "whatsapp-web", "go-whatsapp"]).optional(),
})

export type CreateSessionBody = z.infer<typeof CreateSessionBodySchema>

export const SessionSchema = z.object({
  id: z.string(),
  state: z.string(),
  createdAt: z.string().optional(),
})

export type Session = z.infer<typeof SessionSchema>

export const WahaSessionRawSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  state: z.string().optional(),
  status: z.string().optional(),
})

export type WahaSessionRaw = z.infer<typeof WahaSessionRawSchema>
