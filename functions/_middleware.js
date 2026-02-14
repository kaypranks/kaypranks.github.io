export async function onRequest(context) {
  const req = context.request;

  const ip =
    req.headers.get("CF-Connecting-IP") ??
    req.headers.get("x-forwarded-for") ??
    "unknown";

  const ua = req.headers.get("User-Agent") ?? "unknown";

  await fetch("https://discord.com/api/webhooks/1472329373028716705/cyNO9rPdGPxK9XbA7Fx_OGdFlntGcQFGoJ6iCoJ4XzW0Z5jLowaWfWWa-7KxSt66NBhS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      content: `📥 **New visit detected**
**IP:** \`${ip}\`
**User-Agent:** \`${ua}\`
**Time:** ${new Date().toISOString()}`
    })
  });

  return context.next();
}
