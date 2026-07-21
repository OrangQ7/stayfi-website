import underwritingSchema from "@/schemas/underwriting.schema.json";

const unsupportedStrictKeywords = new Set([
  "$schema",
  "$id",
  "format",
  "minimum",
  "maximum",
  "minLength",
  "minItems",
  "pattern",
]);

function stripUnsupportedKeywords(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripUnsupportedKeywords);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !unsupportedStrictKeywords.has(key))
      .map(([key, child]) => [key, stripUnsupportedKeywords(child)]),
  );
}

export const underwritingResponseSchema = stripUnsupportedKeywords(
  underwritingSchema,
) as Record<string, unknown>;
