import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  // Wrap plain-text "Authorization failed" from Keystatic's OAuth callback
  if (
    context.url.pathname.startsWith('/api/keystatic/github/oauth/callback') &&
    response.status === 401
  ) {
    const body = await response.text();
    if (body.includes('Authorization failed')) {
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Authorization Failed — Taskip Docs</title>
  <link rel="icon" type="image/png" href="/favicon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --brand: #00B289;
      --brand-glow: rgba(0,178,137,0.15);
      --bg: #09100e;
      --text: #e8f5f1;
      --text-muted: rgba(232,245,241,0.45);
      --error: #ff6b6b;
    }
    html, body {
      height: 100%;
      background: var(--bg);
      font-family: 'Sora', system-ui, sans-serif;
      color: var(--text);
    }
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(rgba(0,178,137,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,178,137,0.04) 1px, transparent 1px);
      background-size: 48px 48px;
      pointer-events: none;
      z-index: 0;
    }
    .glow {
      position: fixed;
      width: 500px; height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,107,107,0.08) 0%, transparent 70%);
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }
    .page {
      position: relative;
      z-index: 1;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,107,107,0.2);
      border-radius: 16px;
      padding: 48px 40px;
      max-width: 440px;
      width: 100%;
      text-align: center;
      box-shadow: 0 0 60px rgba(255,107,107,0.06);
    }
    .icon {
      width: 56px; height: 56px;
      border-radius: 12px;
      background: rgba(255,107,107,0.1);
      border: 1px solid rgba(255,107,107,0.3);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 24px;
    }
    .title {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.03em;
      margin-bottom: 12px;
      color: var(--text);
    }
    .desc {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 32px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--brand);
      color: #fff;
      border: none;
      border-radius: 10px;
      padding: 13px 24px;
      font-family: 'Sora', sans-serif;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: -0.01em;
      cursor: pointer;
      text-decoration: none;
      box-shadow: 0 8px 24px rgba(0,178,137,0.25);
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(0,178,137,0.35);
    }
    .brand {
      position: fixed; top: 0; left: 0; right: 0;
      padding: 20px 32px;
      display: flex; align-items: center; gap: 10px;
      background: linear-gradient(to bottom, rgba(9,16,14,0.95), transparent);
      z-index: 10;
    }
    .brand img { width: 32px; height: 32px; border-radius: 7px; }
    .brand-name { font-size: 14px; font-weight: 700; letter-spacing: -0.02em; }
    .brand-sub {
      font-family: 'DM Mono', monospace;
      font-size: 10px; color: var(--brand);
      letter-spacing: 0.1em; text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="glow"></div>
  <header class="brand">
    <img src="/favicon.png" alt="Taskip" />
    <div>
      <p class="brand-name">Taskip</p>
      <p class="brand-sub">Docs CMS</p>
    </div>
  </header>
  <main class="page">
    <div class="card">
      <div class="icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#ff6b6b" stroke-width="1.5"/>
          <path d="M12 8v4M12 16h.01" stroke="#ff6b6b" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <h1 class="title">Authorization Failed</h1>
      <p class="desc">
        We couldn't complete the GitHub sign-in. This can happen if the OAuth
        session expired or the request was cancelled. Please try again.
      </p>
      <a href="/keystatic" class="btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Back to Login
      </a>
    </div>
  </main>
</body>
</html>`;
      return new Response(html, {
        status: 401,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }
  }

  return response;
});
