// Esta função corre no servidor do Vercel, nunca no browser do estudante.
// Usa a API gratuita do Google Gemini (ai.google.dev) — não é preciso
// cartão de crédito nem pagamento para o volume de uso de uma escola.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "Falta configurar a variável GEMINI_API_KEY no Vercel."
    });
  }

  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Mensagens em falta." });
    }

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }]
    }));

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [
              {
                text: "Tu és um(a) professor(a) de Química virtual para estudantes moçambicanos da 9ª classe. Responde sempre em português, de forma clara, simpática e didáctica, com exemplos do dia-a-dia quando possível. Se o estudante pedir a resposta directa de um exercício de avaliação, não a dês de imediato: guia-o com perguntas socráticas e pistas até ele chegar à resposta sozinho, para preservar a integridade académica. Podes explicar livremente conceitos, dar exemplos e corrigir erros de raciocínio."
              }
            ]
          },
          contents
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro da Gemini:", data);
      return res.status(response.status).json({ error: "Falha ao contactar a IA." });
    }

    const text =
      (data.candidates?.[0]?.content?.parts || [])
        .map((p) => p.text || "")
        .join("\n")
        .trim() || "Não consegui gerar uma resposta agora. Tenta novamente.";

    return res.status(200).json({ text });
  } catch (e) {
    console.error("Erro no proxy do Professor IA:", e);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}
