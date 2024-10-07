import Express from "express";
import { Agenda } from "./../model/Agenda.js";

// Inicializa o Router da rota em questão.
export const agendaRouter = Express.Router();

// Instancia a classe da agenda para utilização dos métodos referentes
const agenda = new Agenda();

// Método de rota GET para busca de usuário por id através de query params da URL
agendaRouter.get("/:id", async (request, response) => {
  const { id } = request.params;

  // Consulta no banco através da instancia do modulo Agenda
  const agendamento = await agenda.getAgendamentoById(id);

  // Try catch para tratamento de erros e retorno da resposta da API
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

// Método de rota POST para criação de novo agendamento
agendaRouter.post("/novo", async (request, response) => {
  const { nomePessoa, contatoTelefonico, email, dataAgendamento } = request.body;

  try {
    const result = await agenda.newAgendamento(nomePessoa, contatoTelefonico, email, dataAgendamento);
    response.status(201).json(result);
  } catch (error) {
    response.status(400).json({ status: 400, message: error.message });
  }
});
