import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const filePath = path.join(process.cwd(), "bookings.json");
  const { booking } = req.body;

  try {
    const fileData = fs.readFileSync(filePath, "utf8");
    const bookings = JSON.parse(fileData);

    bookings.push(booking);

    fs.writeFileSync(filePath, JSON.stringify(bookings, null, 2));

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao salvar" });
  }
}
