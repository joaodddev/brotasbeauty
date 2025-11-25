export default function handler(req, res) {
  // Aqui você pode buscar os agendamentos do banco de dados.
  // Por enquanto, vamos retornar um exemplo estático.

  return res.status(200).json({
    agendamentos: [{ nome: "Exemplo", data: "2025-01-02", horario: "14:00" }],
  });
}
