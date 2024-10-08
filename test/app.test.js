import { connection } from "../src/config/db.js";
import { Agenda } from "../src/model/Agenda.js";

const agenda = new Agenda();

describe("Teste para funções do modelo Agenda", () => {
  // Configurações antes de todos os testes
  beforeAll(async () => {
    // Cria uma tabela de testes chamada agenda_test idêntica à tabela original
    await connection.query("CREATE TABLE IF NOT EXISTS `estetica_plus`.`agenda_test` LIKE `agenda`");
  });

  // Insere dados antes de cada teste
  beforeEach(async () => {
    await connection.query(`
      INSERT INTO agenda_test (nome_pessoa, contato_telefonico, email, data_agendamento)
      VALUES ('William Carvalho', '75991826988', 'willcarvalho@gmail.com', '2024-10-07')
    `);
  });

  // Limpa os dados após cada teste
  afterEach(async () => {
    await connection.query("TRUNCATE TABLE agenda_test");
    await connection.query("ALTER TABLE agenda_test AUTO_INCREMENT = 1");
  });

  // Limpa o banco e encerra a conexão ao final dos testes
  afterAll(async () => {
    // Limpa a tabela de testes ao final de cada teste
    await connection.query("TRUNCATE TABLE agenda_test");
    await connection.end();
  });

  test("✨ Criação de novo agendamento", async () => {
    const agendamento = await agenda.newAgendamento("Thiago Vinicius", "75991826988", "thiagopazba@gmail.com", "07/10/2024", "agenda_test");
    expect(agendamento).toHaveProperty("id_agendamento", 2); // O primeiro agendamento foi inserido no beforeEach
  });

  test("✨ Busca de agendamento por ID", async () => {
    const user = await agenda.getAgendamentoById(1, "agenda_test");
    expect(user).toHaveProperty("nome_pessoa", "William Carvalho");
    expect(user).toHaveProperty("contato_telefonico", "75991826988");
    expect(user).toHaveProperty("email", "willcarvalho@gmail.com");
    expect(user.data_agendamento.toISOString()).toBe("2024-10-07T03:00:00.000Z");
  });

  test("✨ Busca de agendamento por nome completo", async () => {
    const user = await agenda.getAgendamentoByName("William Carvalho", "agenda_test");
    expect(user).toHaveProperty("nome_pessoa", "William Carvalho");
  });

  test("✨ Busca inválida de agendamento por ID", async () => {
    const user = await agenda.getAgendamentoById(999, "agenda_test");
    expect(user).toBeNull();
  });

  test("✨ Busca de agendamento por parte do nome", async () => {
    const user = await agenda.getAgendamentoById(1, "agenda_test");
    expect(user.nome_pessoa).toMatch(/Will/);
  });

  test("✨ Busca de agendamentos por intervalo de datas", async () => {
    await connection.query(`
      INSERT INTO agenda_test (nome_pessoa, contato_telefonico, email, data_agendamento)
      VALUES ('Ana Souza', '75991826989', 'anasouza@gmail.com', '2024-10-10')
    `);
    await connection.query(`
      INSERT INTO agenda_test (nome_pessoa, contato_telefonico, email, data_agendamento)
      VALUES ('Carlos Silva', '75991826990', 'carlos@gmail.com', '2024-09-29')
    `);

    const agendamentos = await agenda.getAgendamentoByData("2024-10-01", "2024-10-31", "agenda_test");
    expect(agendamentos.length).toBe(2);

    expect(agendamentos[0]).toHaveProperty("nome_pessoa", "William Carvalho");
    expect(new Date(agendamentos[0].data_agendamento).toISOString().split("T")[0]).toBe("2024-10-07");

    expect(agendamentos[1]).toHaveProperty("nome_pessoa", "Ana Souza");
    expect(new Date(agendamentos[1].data_agendamento).toISOString().split("T")[0]).toBe("2024-10-10");

    agendamentos.forEach((agendamento) => {
      const data = new Date(agendamento.data_agendamento);
      expect(data >= new Date("2024-10-01") && data <= new Date("2024-10-31")).toBe(true);
    });
  });

  test("✨ Atualização de agendamento existente", async () => {
    const novoAgendamento = await agenda.newAgendamento("Carlos Silva", "75991826991", "carlos@gmail.com", "20/10/2024", "agenda_test");
    const id = novoAgendamento.id_agendamento;

    const result = await agenda.updateAgendamento(id, "Carlos Souza", "75999999999", "carlossouza@gmail.com", "25/10/2024", "agenda_Test");
    expect(result).toHaveProperty("message", "Agendamento atualizado com sucesso.");

    const updatedAgendamento = await agenda.getAgendamentoById(id, "agenda_test");
    expect(updatedAgendamento).toHaveProperty("nome_pessoa", "Carlos Souza");
    expect(updatedAgendamento).toHaveProperty("contato_telefonico", "75999999999");
    expect(updatedAgendamento).toHaveProperty("email", "carlossouza@gmail.com");
    expect(new Date(updatedAgendamento.data_agendamento).toISOString().split("T")[0]).toBe("2024-10-25");
  });

  test("✨ Exclusão de agendamento existente", async () => {
    // Primeiro, insira um agendamento no banco para testar a deleção
    const novoAgendamento = await agenda.newAgendamento("Mariana Lima", "75991826990", "mariana@gmail.com", "22/10/2024", "agenda_test");

    // Captura o ID do novo agendamento
    const id = novoAgendamento.id_agendamento;

    // Executa a função de deleção
    const result = await agenda.deleteAgendamento(id, "agenda_test");

    // Verifica se a mensagem de sucesso foi retornada
    expect(result).toHaveProperty("message", "Agendamento deletado com sucesso.");

    // Verifica se o agendamento foi realmente deletado do banco
    const deletedAgendamento = await agenda.getAgendamentoById(id, "agenda_test");
    expect(deletedAgendamento).toBeNull();
  });

  test("✨ Busca de agendamento por ID executada em menos de 100ms", async () => {
    const inicio = performance.now();
    await agenda.getAgendamentoById(1, "agenda_test");
    const fim = performance.now();

    const duracao = fim - inicio;
    console.log(`Tempo de execução de getAgendamentoById | ${duracao.toFixed(2)}ms`);

    expect(duracao).toBeLessThanOrEqual(100);
  });
});
