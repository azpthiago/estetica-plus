import { connection } from "../config/db.js";
import { isValid, parse, format } from "date-fns";

export class Agenda {
  // Método para buscar um agendamento por ID
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
  // Método para criar um novo agendamento
  async newAgendamento(nomePessoa, contatoTelefonico, email, dataAgendamento) {
    // Validações básicas de entrada
    if (!nomePessoa || !contatoTelefonico || !email || !dataAgendamento) {
      throw new Error("Todos os campos são obrigatórios.");
    }
    // Validação de e-mail usando regex
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      throw new Error("E-mail inválido.");
    }
    // Validação simples de telefone
    if (contatoTelefonico.length < 10) {
      throw new Error("Número de telefone inválido.");
    }
    // Validação da data no formato brasileiro usando date-fns
    const parsedDate = parse(dataAgendamento, "dd/MM/yyyy", new Date());
    if (!isValid(parsedDate)) {
      throw new Error("Data de agendamento inválida.");
    }
    // Formatar a data para o padrão do MySQL
    const mysqlFormattedDate = format(parsedDate, "yyyy-MM-dd");
    try {
      if (!connection) {
        throw new Error("Conexão com o banco de dados não está disponível.");
      }
      // Inserir os dados no banco, agora com a data formatada corretamente
      const [result] = await connection.query(
        "INSERT INTO agenda (nome_pessoa, contato_telefonico, email, data_agendamento) VALUES (?, ?, ?, ?)",
        [nomePessoa, contatoTelefonico, email, mysqlFormattedDate]
      );
      // Retornar o ID do novo agendamento inserido
      return { id_agendamento: result.insertId, message: "Agendamento criado com sucesso." };
    } catch (error) {
      console.error("Erro ao criar o agendamento:", error.message);
      throw new Error("Erro ao criar o agendamento. Tente novamente mais tarde.");
    }
  }
}
