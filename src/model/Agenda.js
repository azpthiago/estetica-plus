import { connection } from "../config/db.js";
import { isValid, parse, format } from "date-fns";

export class Agenda {
  // Método para criar um novo agendamento
  async newAgendamento(nomePessoa, contatoTelefonico, email, dataAgendamento, tabela = "agenda") {
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
        `INSERT INTO ${tabela} (nome_pessoa, contato_telefonico, email, data_agendamento) VALUES (?, ?, ?, ?)`,
        [nomePessoa, contatoTelefonico, email, mysqlFormattedDate]
      );
      // Retornar o ID do novo agendamento inserido
      return { id_agendamento: result.insertId, message: "Agendamento criado com sucesso." };
    } catch (error) {
      console.error("Erro ao criar o agendamento:", error.message);
      throw new Error(`Erro ao criar o agendamento | ${error.message}. Tente novamente mais tarde.`);
    }
  }
  // Método para buscar um agendamento por ID
  async getAgendamentoById(id, tabela = "agenda") {
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
      const [rows] = await connection.query(`SELECT * FROM ${tabela} WHERE id_agenda = ?`, [numericId]);
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
  // Método para buscar um agendamento por ID
  async getAllAgendamentos(tabela = "agenda") {
    try {
      // Verificar se a conexão está disponível
      if (!connection) {
        throw new Error("Conexão com o banco de dados não está disponível.");
      }
      // Executar a consulta diretamente no banco
      const [rows] = await connection.query(`SELECT * FROM ${tabela}`);
      // Verificar se algum resultado foi encontrado
      if (rows.length === 0) {
        return null; // Retorne null ou algo similar
      }
      return rows;
    } catch (error) {
      // Capturar e tratar o erro
      console.error("Erro ao buscar o agendamento:", error.message);
      throw new Error("Erro ao buscar o agendamento. Tente novamente mais tarde.");
    }
  }
  // Método para buscar um agendamento por nome da pessoa
  async getAgendamentoByName(nomePessoa, tabela = "agenda") {
    try {
      // Verificar se a conexão está disponível
      if (!connection) {
        throw new Error("Conexão com o banco de dados não está disponível.");
      }
      // Executar a consulta diretamente no banco
      const [rows] = await connection.query(`SELECT * FROM ${tabela} WHERE nome_pessoa = ?`, [nomePessoa]);
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
  // Método para buscar um agendamento por range de datas
  async getAgendamentoByData(dataInicial, dataFinal, tabela = "agenda") {
    try {
      // Verificar se a conexão está disponível
      if (!connection) {
        throw new Error("Conexão com o banco de dados não está disponível.");
      }
      // Executar a consulta diretamente no banco
      const [rows] = await connection.query(`SELECT * FROM ${tabela} WHERE DATE(data_agendamento) BETWEEN ? AND ?`, [
        dataInicial,
        dataFinal,
      ]);
      console.log(rows);
      // Verificar se algum resultado foi encontrado
      if (rows.length === 0) {
        return null; // Retorne null ou algo similar
      }
      return rows;
    } catch (error) {
      // Capturar e tratar o erro
      console.error("Erro ao buscar o agendamento:", error.message);
      throw new Error("Erro ao buscar o agendamento. Tente novamente mais tarde.");
    }
  }
  // Método para atualizar um agendamento existente
  async updateAgendamento(id, nomePessoa, contatoTelefonico, email, dataAgendamento, tabela = "agenda") {
    const beforeUser = this.getAgendamentoById(id);

    // Verifica se o agendamento existe antes de tentar atualizar
    if (!beforeUser) {
      throw new Error("Agendamento não encontrado.");
    }

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
        `UPDATE ${tabela} SET nome_pessoa = ?, contato_telefonico = ?, email = ?, data_agendamento = ? WHERE id_agenda = ?`,
        [nomePessoa, contatoTelefonico, email, mysqlFormattedDate, id]
      );

      if (result.affectedRows === 0) {
        throw new Error("Nenhum agendamento foi atualizado.");
      }

      // Retornar o ID do novo agendamento inserido
      return { message: "Agendamento atualizado com sucesso.", agendamento: result };
    } catch (error) {
      console.error("Erro ao criar o agendamento:", error.message);
      throw new Error("Erro ao criar o agendamento. Tente novamente mais tarde.");
    }
  }
  // Método para deletar um agendamento existente
  async deleteAgendamento(id, tabela = "agenda") {
    try {
      if (!connection) {
        throw new Error("Conexão com o banco de dados não está disponível.");
      }

      // Verifica se o agendamento existe antes de tentar deletar
      const agendamentoExistente = await this.getAgendamentoById(id, tabela);
      if (!agendamentoExistente) {
        throw new Error("Agendamento não encontrado.");
      }

      // Executa a query de delete
      const [result] = await connection.query(`DELETE FROM ${tabela} WHERE id_agenda = ?`, [id]);

      if (result.affectedRows === 0) {
        throw new Error("Nenhum agendamento foi deletado.");
      }

      return { message: "Agendamento deletado com sucesso." };
    } catch (error) {
      console.error("Erro ao deletar o agendamento:", error.message);
      throw new Error(`Erro ao deletar o agendamento ${error.message}. Tente novamente mais tarde.`);
    }
  }
}
