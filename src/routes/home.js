import Express from "express";

export const homeRouter = Express.Router();

homeRouter.get("/", (request, response) => {
  return response.json({ message: "Seja bem-vindo a Estetica Plus!" });
});
