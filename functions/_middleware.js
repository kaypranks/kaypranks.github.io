export async function onRequest(context) {
  const req = context.request;

  const ip =
    req.headers.get("CF-Connecting-IP") ??
    req.headers.get("x-forwarded-for") ??
    "unknown";

  const ua = req.headers.get("User-Agent") || "";

  // 🚫 Ignore obvious bots / scanners
  const blockedAgents = [
    "Python",
    "aiohttp",
    "curl",
    "bot",
    "crawler",
    "spider",
    "Let's Encrypt",
    "Go-http-client"
  ];

  // 🚫 Ignore Cloudflare internal IPv6 range
  const isCloudflareInternal = ip.startsWith("2a06:98c0");

  const isBlockedUA = blockedAgents.some(agent =>
    ua.toLowerCase().includes(agent.toLowerCase())
  );

  if (isBlockedUA || isCloudflareInternal || !ua) {
    return context.next(); // ignore silently
  }

  const lookupLink = `https://www.whtop.com/tools.ip/${ip}`;

  context.waitUntil(
    fetch("https://discord.com/api/webhooks/1472333540430712962/GVPlr2A2S58PT5ibFnP3UUPVC0yDmxAkzaNXaI3R3gxdiX-B_07YxjiChQLmJuctLQ1i", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `${ip}\n${lookupLink}`
      })
    })
  );

  return context.next();
}
