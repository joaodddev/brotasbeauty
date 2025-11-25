import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const filePath = path.join(process.cwd(), "bookings.json");

  try {
    const fileData = fs.readFileSync(filePath, "utf8");
    const bookings = JSON.parse(fileData);
    return res.status(200).json({ bookings });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao ler arquivo" });
  }
}
