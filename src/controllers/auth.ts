import { Request, RequestHandler, Response } from "express";
import { signupSchema } from "../schemas/signup";
import { createUser, findUserByEmail, findUserBySlug } from "../services/user";
import slug from "slug";
import { compare, hash } from "bcrypt-ts";
import { createJWT } from "../utils/jwt";
import { signinSchema } from "../schemas/signin";

export const signup = async (req: Request, res: Response) => {

  // validar os dados recebidos
  const safeData = signupSchema.safeParse(req.body);
  if(!safeData.success){
    return res.json({error: safeData.error.flatten().fieldErrors})
  }
  
  // ferificar email
  const hasEmail = await findUserByEmail(safeData.data.email)

  if (hasEmail) {
    return res.json({error: "E-mail já existe!"});
  }
  
  // verificar slug
  let genSlug = true
  let userSlug = slug(safeData.data.name);
  while (genSlug) {
    const hasSlug = await findUserBySlug(userSlug);
    if (hasSlug) {
      let slugSuffix = Math.floor(Math.random() * 999999).toString();
      userSlug = slug(safeData.data.name + slugSuffix)
    } else {
      genSlug = false
    }
  }
  
  // gerar hash de senha
  const hashPassword = await hash(safeData.data.password, 11)

  // cria o user
  const newUser = await createUser({
    slug: userSlug,
    name: safeData.data.name,
    email: safeData.data.email,
    password: hashPassword
  })
  // cria o token
  const token = createJWT(userSlug);

  // retorna o resultado (token, user)

  res.status(201).json({
    token,
    user: {
      name: newUser.name,
      slug: newUser.slug,
      avatar: newUser.avatar
    }
  })
}

export const signin = async (req: Request, res: Response) => {

  const safeData = signinSchema.safeParse(req.body);
  if(!safeData.success){
    return res.json({error: safeData.error.flatten().fieldErrors})
  }

  const user = await findUserByEmail(safeData.data.email)
  if (!user) {
    return res.status(401).json({ error: "Acesso negado!" });
  }

  const verifyPass = await compare(safeData.data.password, user.password)

  console.log(safeData.data.password);
  console.log(user.password);
  
  

  if (!verifyPass) {
    return res.status(401).json({ error: "Acesso negado!" });
  }

  const token = createJWT(user.slug);

  res.json({
    token,
    user: {
      name: user.name,
      slug: user.slug,
      avatar: user.avatar
    }
  })

}