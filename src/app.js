import express from "express";
const app = express();
import { homeRouter } from "./routes/home.js";
import { agendaRouter } from "./routes/agenda.js";

const PORT = process.env.PORT || 3000;

app.use("/", homeRouter);
app.use("/agenda", agendaRouter);

app.listen(PORT, () => {
  console.log(`Server online at http://localhost:${PORT}`);
});

export default { app };
