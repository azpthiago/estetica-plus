const { getUserById, connection } = require("./db");

describe("Teste para função getUserById", () => {
  beforeAll(async () => {
    await connection.query("CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255))");
    // A linha abaixo executa uma inserção toda vez que o teste é executado, como o dado ja esta inserido não a necessidade da reinserção
    // Dos dados no banco, caso não aja dado execute a mesa.
    // await connection.query("INSERT INTO users (name, email) VALUES ('Thiago Vinicius Silva Paz', 'thiagopazba@gmail.com')");
  });

  test("✨ Deve retornar o usuário correto pelo ID", async () => {
    const user = await getUserById(1);
    // toHaveProperty matcher do JEST para verificar se um objeto possui uma propriedade específica;
    expect(user).toHaveProperty("name", "Thiago Vinicius Silva Paz");
    expect(user).toHaveProperty("email", "thiagopazba@gmail.com");
  });

  test("✨ Deve retornar undefined se o usuário não existir", async () => {
    // Como a ROW retornada pelo drive do MySQL vai ser vazia, o JS entende como undefined
    const user = await getUserById(999);
    expect(user).toBeUndefined();
  });
});
