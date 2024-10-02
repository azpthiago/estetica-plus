const express = require("express");
const app = express();
const { getUserById } = require("./db");

app.get("/usuarios/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await getUserById(id);
    console.log(user);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ status: 404, message: "Usuário não existe" });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: "Erro de conexão ao banco de dados" });
  }
});

app.listen(3000, () => {
  console.log(`Server online at http://localhost:3000`);
});

module.exports = { app };
