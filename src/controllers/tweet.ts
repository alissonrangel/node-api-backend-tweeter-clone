import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { addTweetSchema } from "../schemas/add-tweet";
import { createTweet, findTweet } from "../services/tweet";
import { addHashtag } from "../services/trend";


export const addTweet = async (req:ExtendedRequest, res: Response) => {
  
  //Validar os dados enviados com o zod
  const safeData = addTweetSchema.safeParse(req.body);
  if(!safeData.success){
    return res.json({ error: safeData.error.flatten().fieldErrors })
  }
  
  //verificar se é resposta
  if (safeData.data.answer) {
    const hasAnswerTweet = await findTweet(parseInt(safeData.data.answer))
    if (!hasAnswerTweet) {
      return res.json({ error: "Tweet original inexistente!" });
    }
  }

  //cria o tweet
  const newTweet = await createTweet(
    req.userSlug as string, 
    safeData.data.body, 
    safeData.data.answer ? parseInt(safeData.data.answer) : 0
  )

  //adiciona a hashtag ao trend
  const hashtags = safeData.data.body.match(/#[a-zA-Z0-9_]+/g)

  if (hashtags) {
    for (const hashtag of hashtags) {
      if (hashtag.length >= 2) {
        await addHashtag(hashtag);
      }
    }
  }

  res.status(201).json({tweet: newTweet})
}