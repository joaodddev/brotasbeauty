import { db } from "./db.js";

export async function agendar(req, res) {
  const { data, horario } = req.body;

  try {
    await db.run(
      `
      INSERT INTO agendamentos (data, horario)
      VALUES (?, ?)
    `,
      [data, horario]
    );

    res.json({ sucesso: true });
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(409).json({ erro: "Horário já ocupado" });
    }

    res.status(500).json({ erro: "Erro ao agendar" });
  }
}
