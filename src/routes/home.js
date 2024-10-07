import Express from "express";

// Inicializa o Router da rota em questão.
export const homeRouter = Express.Router();

// Rota de home & hello world do projeto.
homeRouter.get("/", (request, response) => {
  return response.json({ message: "Seja bem-vindo a Estetica Plus!" });
});
