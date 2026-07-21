import fs from "node:fs";
import OpenAI from "openai";

function readLocalKey() {
  const envFile = fs.readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  const match = envFile.match(/^OPENAI_API_KEY=(.*)$/m);

  if (!match) {
    throw new Error("OPENAI_API_KEY is missing from .env.local");
  }

  return match[1].trim().replace(/^['\"]|['\"]$/g, "");
}

const client = new OpenAI({ apiKey: readLocalKey() });

try {
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL ?? "gpt-5.6",
    input: "Reply with exactly STAYFI_OK.",
    max_output_tokens: 16,
  });

  console.log(
    JSON.stringify({
      ok: response.output_text.trim() === "STAYFI_OK",
      model: response.model,
      response: response.output_text.trim(),
    }),
  );
} catch (error) {
  console.error(
    JSON.stringify({
      ok: false,
      status: error?.status,
      code: error?.code,
      type: error?.type,
      message: error instanceof Error ? error.message : "Unknown OpenAI API error",
    }),
  );
  process.exitCode = 1;
}
