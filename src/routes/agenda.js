import Express from "express";
import { Agenda } from "./../model/Agenda.js";

// Inicializa o Router da rota em questão.
export const agendaRouter = Express.Router();

// Instancia a classe da agenda para utilização dos métodos referentes
const agenda = new Agenda();

// Método de rota POST para criação de novo agendamento
agendaRouter.post("/", async (request, response) => {
  const { nomePessoa, contatoTelefonico, email, dataAgendamento } = request.body;

  try {
    const result = await agenda.newAgendamento(nomePessoa, contatoTelefonico, email, dataAgendamento);
    response.status(201).json(result);
  } catch (error) {
    response.status(400).json({ status: 400, message: error.message });
  }
});

// Método de rota GET para busca de usuário por id através de query params da URL
agendaRouter.get("/id/:id", async (request, response) => {
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

agendaRouter.get("/", async (request, response) => {
  // Consulta no banco através da instancia do modulo Agenda
  const agendamento = await agenda.getAllAgendamentos();

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

agendaRouter.put("/:id", async (request, response) => {
  // Captura de parâmetos de requisição
  const { id } = request.params;
  // Captura de valores vindo através do body
  const { nomePessoa, contatoTelefonico, email, dataAgendamento } = request.body;

  // Try Catch de execução da query no banco e resposta do servidor
  try {
    const result = await agenda.updateAgendamento(id, nomePessoa, contatoTelefonico, email, dataAgendamento);
    response.json({ status: 200, message: "Agendamento atualizado com sucesso.", result });
  } catch (error) {
    response.status(400).json({ status: 400, message: error.message });
  }
});

agendaRouter.delete("/:id", async (request, response) => {
  // Captura de parâmetro de requisição
  const { id } = request.params;

  // Try Catch de execução da query no banco e resposta do servidor
  try {
    const result = await agenda.deleteAgendamento(id);
    response.json({ status: 200, message: result.message });
  } catch (error) {
    response.status(400).json({ status: 400 });
  }
});

agendaRouter.get("/nome/:nomePessoa", async (request, response) => {
  // Captura de parâmetro de requisição
  const { nomePessoa } = request.params;

  // Try Catch de execução da query no banco e resposta do servidor
  try {
    const agendamento = await agenda.getAgendamentoByName(nomePessoa);

    if (agendamento) {
      response.json({ status: 200, agendamento });
    } else {
      response.status(404).json({ status: 404, message: `Nenhum agendamento encontrado com o nome ${nomePessoa}` });
    }
  } catch (error) {
    response.status(500).json({ status: 500, message: "Erro de conexão ao banco de dados" });
  }
});

agendaRouter.get("/data", async (request, response) => {
  // Captura de valores de datas através do body
  const { dataInicial, dataFinal } = request.body;

  // Try Catch de execução da query no banco e resposta do servidor
  try {
    const agendamentos = await agenda.getAgendamentoByData(dataInicial, dataFinal);

    if (agendamentos) {
      response.json({ status: 200, agendamentos });
    } else {
      response.status(404).json({ status: 404, message: "Nenhum agendamento encontrado nesse intervalo de datas." });
    }
  } catch (error) {
    response.status(500).json({ status: 500, message: "Erro de conexão ao banco de dados." });
  }
});
