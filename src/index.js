import { app } from "./app.js";

// Puxa a porta do arquivo .env
const PORT = process.env.PORT || 3000;

// Iniciar o servidor WEB com a porta e loga no console
app.listen(PORT, () => {
  console.log(`Server online at http://localhost:${PORT}`);
});
