import { z } from "zod";


export const addTweetSchema = z.object({
  body: z.string({ message: "Precisa enviar uma mensagem!"}),
  answer: z.string().optional()
})