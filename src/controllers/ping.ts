import { Request, RequestHandler, Response } from "express";


// export const ping: RequestHandler = (req, res) => {

// }

export const ping = (req: Request, res: Response) => {
  res.json({pong: true})
}