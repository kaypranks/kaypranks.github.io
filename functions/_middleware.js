export async function onRequest(context) {
  const req = context.request;

  const ip =
    req.headers.get("CF-Connecting-IP") ??
    req.headers.get("x-forwarded-for") ??
    "";

  const ua = req.headers.get("User-Agent") || "";

  // 🚫 MUST be IPv6 (contains :)
  const isIPv6 = ip.includes(":");

  // 🚫 Block Cloudflare IPv6 ranges
  const isCloudflareIPv6 =
    ip.startsWith("2a06:98c0") || // Cloudflare IPv6
    ip.startsWith("2606:4700");   // Cloudflare IPv6 (alt)

  // 🚫 Block bots / scanners
  const blockedAgents = [
    "bot",
    "crawler",
    "spider",
    "python",
    "aiohttp",
    "curl",
    "letsencrypt",
    "cloudflare"
  ];

  const isBlockedUA = blockedAgents.some(a =>
    ua.toLowerCase().includes(a)
  );

  // ❌ HARD FILTER
  if (!isIPv6 || isCloudflareIPv6 || isBlockedUA) {
    return context.next();
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
