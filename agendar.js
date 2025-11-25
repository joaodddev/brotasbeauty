export default function handler(req, res) {
  if (req.method === "POST") {
    const dados = req.body;

    // Aqui você pode integrar com um banco de dados, como Firebase, Supabase, etc.
    // Por enquanto, vamos apenas retornar os dados recebidos.

    return res.status(200).json({
      message: "Agendamento criado com sucesso!",
      dados,
    });
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
