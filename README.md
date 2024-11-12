- npm init
- npm i -D typescript tsx
- npx tsc --init
- npm i express cors helmet
- npm i -D @types/express @types/cors @types/node

- package.json
```
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "node --import=tsx --watch --env-file=.env ./src/server.ts"
  },
```
- server.ts
```
import express, { urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";

const server = express();

server.use(helmet());
server.use(cors());
server.use(urlencoded({extended: true}));
server.use(express.json());

// rotas

server.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor rodando em ${process.env.PORT}`);
})
```

- npm install prisma --save-dev
- npx prisma init --datasource-provider mysql
- npm i @prisma/client
- cria o arquivo prisma.ts na pasta utils
```
import { PrismaClient } from "@prisma/client";
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient};
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```
- cria os models no schema
- dar um migrate
  - npx prisma migrate dev || npx prisma migrate dev --name init
  - npx prisma generate