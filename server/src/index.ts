import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import { AuthRoutes } from "./modules/auth/auth.routes";
import cors from "@elysiajs/cors";

const app = new Elysia({ adapter: node() })
  .use(
    cors({
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  )
  .use(AuthRoutes)
  .listen(8080, ({ hostname, port }) => {
    console.log(`Servidor rodando em ${hostname}:${port}`);
  });
