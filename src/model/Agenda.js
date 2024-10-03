import { connection } from "../config/db.js";

export class Agenda {
  async getAgendamentoById(id) {
    const numericId = Number(id);

    // Verificar se o ID é válido
    if (isNaN(numericId) || numericId <= 0) {
      throw new Error("ID inválido. Deve ser um número válido.");
    }

    try {
      // Verificar se a conexão está disponível
      if (!connection) {
        throw new Error("Conexão com o banco de dados não está disponível.");
      }

      // Executar a consulta diretamente no banco
      const [rows] = await connection.query("SELECT * FROM agenda WHERE id_agenda = ?", [numericId]);

      // Verificar se algum resultado foi encontrado
      if (rows.length === 0) {
        return null; // Retorne null ou algo similar
      }

      return rows[0];
    } catch (error) {
      // Capturar e tratar o erro
      console.error("Erro ao buscar o agendamento:", error.message);
      throw new Error("Erro ao buscar o agendamento. Tente novamente mais tarde.");
    }
  }

  // Fazer rota de criação de agendamento
  // async newAgendamento(nomePessoa, contatoTelefonico, email, agendamento) {}
}
