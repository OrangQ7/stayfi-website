import gold from "@/data/evals/fjordlight-complex-gold.json";

export function GET() {
  return Response.json(gold, {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Disposition": "attachment; filename=StayFi-Fjordlight-human-gold-standard.json",
    },
  });
}
