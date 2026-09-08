import {z} from "zod";

async function fetchOk({input, init}: {
  input: RequestInfo | URL;
  init?: RequestInit;
}) {
  const response = await fetch(input, init).catch(() => null);
  if (!response?.ok) {
    return null;
  }

  return response;
}

// Fetches JSON and validates it against `schema`. A failed request, a non-JSON body,
// or a response that doesn't match all collapse to the schema's empty parse - so a
// malformed response can never masquerade as the expected shape, and callers get a
// typed object to destructure instead of threading a null through every field access.
// Pass a schema whose fields are all optional so the empty-parse fallback holds.
export async function fetchJson<TSchema extends z.ZodType>({input, init, schema}: {
  input: RequestInfo | URL;
  init?: RequestInit;
  schema: TSchema;
}) {
  const response = await fetchOk({input, init});
  const body = response ? await response.json().catch(() => null) : null;
  const parsed = schema.safeParse(body);
  return parsed.success ? parsed.data : schema.parse({});
}
