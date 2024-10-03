import express from "express";
const app = express();
import { getUserById } from "./config/db";

const PORT = process.env.PORT;

app.get("/agenda/:id", async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server online at http://localhost:${PORT}`);
});

export default { app };
