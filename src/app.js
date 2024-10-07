import express from "express";
import { homeRouter } from "./routes/home.js";
import { agendaRouter } from "./routes/agenda.js";

export const app = express();

// Obriga o servidor a utilizar protocolo JSON
app.use(express.json());
// Indica para o Express utilizar a biblioteca QS para parse de requisições
app.use(express.urlencoded({ extended: true }));

// Configurações dos routers para rotas definidas do projeto
app.use("/", homeRouter);
app.use("/api/agenda/v1", agendaRouter);
