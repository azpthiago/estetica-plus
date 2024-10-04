import Express from "express";
import { Agenda } from "./../model/Agenda.js";

export const agendaRouter = Express.Router();
const agenda = new Agenda();

agendaRouter.get("/:id", async (request, response) => {
  const { id } = request.params;

  const agendamento = await agenda.getAgendamentoById(id);

  try {
    if (agendamento) {
      response.json({ status: 200, agendamento });
    } else {
      response.status(404).json({ status: 404, message: `Nenhum agendamento encontrado com o ID: ${id}` });
    }
  } catch (error) {
    response.status(500).json({ status: 500, message: "Erro de conexão ao banco de dados" });
  }
});

agendaRouter.post("/novo", async (request, response) => {
  const { nomePessoa, contatoTelefonico, email, dataAgendamento } = request.body;

  try {
    const result = await agenda.newAgendamento(nomePessoa, contatoTelefonico, email, dataAgendamento);
    response.status(201).json(result);
  } catch (error) {
    response.status(400).json({ status: 400, message: error.message });
  }
});
