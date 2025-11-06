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
