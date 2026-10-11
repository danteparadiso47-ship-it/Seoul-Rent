const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  },
});

export async function onRequestGet({ env }) {
  const apiKey = env.SEOUL_OPEN_API_KEY;
  if (!apiKey) {
    return json({ ok: false, error: "API_KEY_NOT_CONFIGURED" }, 503);
  }

  // Fetch one row to validate the server-side secret without returning it to the browser.
  const endpoint =
    "https://openapi.seoul.go.kr:8088/" +
    encodeURIComponent(apiKey) +
    "/json/tbLnOpendataRentV/1/1/";

  let response;
  try {
    response = await fetch(endpoint, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    return json({ ok: false, error: "UPSTREAM_UNAVAILABLE" }, 502);
  }

  if (!response.ok) {
    return json({ ok: false, error: "UPSTREAM_REQUEST_FAILED" }, 502);
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    return json({ ok: false, error: "UPSTREAM_INVALID_RESPONSE" }, 502);
  }

  const service = payload?.tbLnOpendataRentV;
  if (!service || !Array.isArray(service.row)) {
    return json({ ok: false, error: "UPSTREAM_REJECTED_REQUEST" }, 502);
  }

  const totalRecords = Number(service.list_total_count);
  return json({
    ok: true,
    totalRecords: Number.isFinite(totalRecords) ? totalRecords : 0,
    checkedAt: new Date().toISOString(),
  });
}
