const { connection } = require("../src/config/db.js");
const { Agenda } = require("../src/model/Agenda.js");

const agenda = new Agenda();

describe("Teste para função getUserById", () => {
  beforeAll(async () => {
    await connection.query(
      "CREATE TABLE IF NOT EXISTS `estetica_plus`.`agenda` (`id_agenda` INT(11) NOT NULL AUTO_INCREMENT, `nome_pessoa` VARCHAR(255) NULL DEFAULT NULL, `contato_telefonico` VARCHAR(255) NULL DEFAULT NULL, `email` VARCHAR(255) NULL DEFAULT NULL, `data_agendamento` DATE NULL DEFAULT NULL, PRIMARY KEY (`id_agenda`))"
    );
    // A linha abaixo executa uma inserção toda vez que o teste é executado, como o dado ja esta inserido não a necessidade da reinserção
    // Dos dados no banco, caso não aja dado execute a mesa.
    await connection.query(
      "INSERT INTO agenda (nome_pessoa, contato_telefonico, email, data_agendamento) VALUES ('William Carvalho', '75991826988','willcarvalho@gmail.com', '2024-10-07')"
    );
  });

  afterAll(async () => {
    await connection.query("TRUNCATE TABLE agenda");
    await connection.query("ALTER TABLE agenda AUTO_INCREMENT = 1");
    await connection.end();
  });

  test("✨ Deve retornar um usuário de maneira correta no banco de dados", async () => {
    const agendamento = await agenda.newAgendamento("Thiago Vinicius", "75991826988", "thiagopazba@gmail.com", "07/10/2024");

    // Valida o agendamento retornado pelo banco com ID 2, ja que existe uma inserção anterior a mesma no beforeAll dos testes
    expect(agendamento).toHaveProperty("id_agendamento", 2);
  });

  test("✨ Deve retornar o usuário correto pelo ID", async () => {
    const user = await agenda.getAgendamentoById(1);
    // Converte o valor retornado pelo banco para o formato ISO de data
    expect(user).toHaveProperty("nome_pessoa", "William Carvalho");
    expect(user).toHaveProperty("contato_telefonico", "75991826988");
    expect(user).toHaveProperty("email", "willcarvalho@gmail.com");
    // Compara a data no formato ISO
    expect(user.data_agendamento.toISOString()).toBe("2024-10-07T03:00:00.000Z");
  });

  test("✨ Deve retornar um usuário buscado pelo nome completo", async () => {
    const user = await agenda.getAgendamentoByName("William Carvalho");
    // toHaveProperty matcher do JEST para verificar se um objeto possui uma propriedade específica;
    expect(user).toHaveProperty("nome_pessoa", "William Carvalho");
  });

  test("✨ Deve retornar undefined se o usuário não existir", async () => {
    // Como a ROW retornada pelo drive do MySQL vai ser vazia, o JS entende como undefined
    const user = await agenda.getAgendamentoById(999);
    expect(user).toBeNull();
  });

  test("✨ Deve retornar uma parte do nome especificado", async () => {
    const user = await agenda.getAgendamentoById(1);
    expect(user.nome_pessoa).toMatch(/Will/);
  });

  test("✨ Deve retornar todos agendamentos entre data X e data Y", async () => {
    // Limpa a tabela antes de inserir dados
    await connection.query("TRUNCATE TABLE agenda");

    // Insere agendamentos no banco para realizar o teste
    await connection.query(
      "INSERT INTO agenda (nome_pessoa, contato_telefonico, email, data_agendamento) VALUES ('William Carvalho', '75991826988', 'willcarvalho@gmail.com', '2024-10-05')"
    );
    await connection.query(
      "INSERT INTO agenda (nome_pessoa, contato_telefonico, email, data_agendamento) VALUES ('Ana Souza', '75991826989', 'anasouza@gmail.com', '2024-10-10')"
    );
    await connection.query(
      "INSERT INTO agenda (nome_pessoa, contato_telefonico, email, data_agendamento) VALUES ('Carlos Silva', '75991826990', 'carlos@gmail.com', '2024-09-29')"
    );

    // Executa a função que busca agendamentos por intervalo de datas
    const agendamentos = await agenda.getAgendamentoByData("2024-10-01", "2024-10-31");

    // Verifica se o array retornado possui dois agendamentos
    expect(agendamentos.length).toBe(2);

    // Verifica se o primeiro agendamento é do William Carvalho
    expect(agendamentos[0]).toHaveProperty("nome_pessoa", "William Carvalho");
    expect(new Date(agendamentos[0].data_agendamento).toISOString().split("T")[0]).toBe("2024-10-05");

    // Verifica se o segundo agendamento é da Ana Souza
    expect(agendamentos[1]).toHaveProperty("nome_pessoa", "Ana Souza");
    expect(new Date(agendamentos[1].data_agendamento).toISOString().split("T")[0]).toBe("2024-10-10");

    // Verifica se nenhum agendamento fora do intervalo foi retornado
    agendamentos.forEach((agendamento) => {
      const data = new Date(agendamento.data_agendamento);
      expect(data >= new Date("2024-10-01") && data <= new Date("2024-10-31")).toBe(true);
    });
  });

  test("✨ Deve atualizar os dados de um agendamento existente", async () => {
    // Primeiro, insira um agendamento no banco para testar a atualização
    await connection.query(
      "INSERT INTO agenda (nome_pessoa, contato_telefonico, email, data_agendamento) VALUES ('Carlos Silva', '75991826991', 'carlos@gmail.com', '2024-10-20')"
    );

    // Captura o ID do agendamento recém-inserido
    const [agendamento] = await connection.query("SELECT id_agenda FROM agenda WHERE nome_pessoa = 'Carlos Silva'");

    const id = agendamento[0].id_agenda;

    // Executa a função de atualização com novos dados
    const result = await agenda.updateAgendamento(id, "Carlos Souza", "75999999999", "carlossouza@gmail.com", "25/10/2024");

    // Verifica se a mensagem de sucesso foi retornada
    expect(result).toHaveProperty("message", "Agendamento atualizado com sucesso.");

    // Verifica se os dados foram realmente atualizados no banco
    const updatedAgendamento = await agenda.getAgendamentoById(id);

    expect(updatedAgendamento).toHaveProperty("nome_pessoa", "Carlos Souza");
    expect(updatedAgendamento).toHaveProperty("contato_telefonico", "75999999999");
    expect(updatedAgendamento).toHaveProperty("email", "carlossouza@gmail.com");
    expect(new Date(updatedAgendamento.data_agendamento).toISOString().split("T")[0]).toBe("2024-10-25");
  });

  test("✨ Deve deletar um agendamento existente", async () => {
    // Primeiro, insira um agendamento no banco para testar a deleção
    await connection.query(
      "INSERT INTO agenda (nome_pessoa, contato_telefonico, email, data_agendamento) VALUES ('Mariana Lima', '75991826990', 'mariana@gmail.com', '2024-10-22')"
    );

    // Captura o ID do agendamento recém-inserido
    const [agendamento] = await connection.query("SELECT id_agenda FROM agenda WHERE nome_pessoa = 'Mariana Lima'");

    const id = agendamento[0].id_agenda;

    // Executa a função de deleção
    const result = await agenda.deleteAgendamento(id);

    // Verifica se a mensagem de sucesso foi retornada
    expect(result).toHaveProperty("message", "Agendamento deletado com sucesso.");

    // Verifica se o agendamento foi realmente deletado do banco
    const deletedAgendamento = await agenda.getAgendamentoById(id);
    expect(deletedAgendamento).toBeNull();
  });

  // Versão inicial do teste de performance com console.time()
  // test("✨ Valida se a busca de agendamento por ID é executada em menos de 200ms", async () => {
  //   console.time("Tempo Inicial de execução"); // Inicia o timer do tempo de execução
  //   await agenda.getAgendamentoById(1);
  //   console.timeEnd("Tempo final de execução"); // Finaliza o timer do tempo de execução
  // });

  test("✨ Valida se a busca de agendamento por ID é executada em menos de 200ms", async () => {
    const inicio = performance.now(); // Inicia o timer
    await agenda.getAgendamentoById(1);
    const fim = performance.now(); // Finaliza o timer

    const duracao = fim - inicio;

    console.log(`Tempo de execução de getAgendamentoById | ${duracao.toFixed(2)}ms`);

    // Valida que o tempo de execução da função deve ser menor que 100ms
    expect(duracao).toBeLessThanOrEqual(100);
  });
});
