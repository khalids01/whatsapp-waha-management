"use client"

import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { endpoints } from "@/constants/endpoints"

export type SendMessageInput = {
  sessionId: string
  to: string
  text: string
}

export function useChat() {
  const sendMessage = useMutation({
    mutationFn: async (body: SendMessageInput) => {
      const res = await api.post(endpoints.api.sendMsg, body)
      return res
    },
  })

  return { sendMessage }
}
