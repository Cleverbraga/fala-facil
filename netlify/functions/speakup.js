import { OpenAI } from "openai";

export default async (request, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (request.method === "OPTIONS") {
    return new Response("OK", { headers, status: 200 });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), { headers, status: 405 });
  }

  try {
    const body = await request.json();
    const userMessage = body.message;

    if (!userMessage) {
      return new Response(JSON.stringify({ error: "A mensagem está vazia." }), { headers, status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é um assistente prestativo e amigável." },
        { role: "user", content: userMessage }
      ],
    });

    const reply = completion.choices.message.content;
    return new Response(JSON.stringify({ reply }), { headers, status: 200 });

  } catch (error) {
    console.error("Erro na Netlify Function:", error);
    return new Response(JSON.stringify({ error: "Erro interno no servidor." }), { headers, status: 500 });
  }
};
