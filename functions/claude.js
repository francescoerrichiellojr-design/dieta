// functions/claude.js  ← va nella cartella "functions" del tuo repo
// Cloudflare Pages Function — proxy sicuro verso l'API Anthropic.
// La API key si configura in Cloudflare Pages dashboard (mai nell'HTML).

export async function onRequestPost(context) {
  const apiKey = context.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return json({ error: { message: 'Aggiungi ANTHROPIC_API_KEY in Cloudflare Pages → Settings → Environment variables' } }, 500);
  }

  try {
    const body = await context.request.text();

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01'
      },
      body
    });

    const data = await resp.text();
    return new Response(data, {
      status: resp.status,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return json({ error: { message: err.message } }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
