/**
 * Campaign Visualization System
 * Multi-campaign funnel/sequence visualization with management UX.
 *
 * Routes:
 *   /                    - Campaign selector
 *   /signet              - Signet AI Digest (media-first)
 *   /burton              - Burton Method (application funnel)
 *   /api/campaigns       - List available campaigns
 */

import { html as signetHtml } from '../campaigns/signet-ai-digest/campaign.js';
import { html as burtonHtml } from '../campaigns/burton-method/campaign.js';

// Campaign selector landing page
const selectorPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Campaign Viz - Funnel & Sequence Visualization</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #0f0f13 0%, #1a1a2e 100%);
      color: #e4e4e7;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }
    h1 {
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 8px;
      background: linear-gradient(90deg, #f59e0b, #ef4444, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle { color: #71717a; font-size: 18px; margin-bottom: 60px; }
    .campaigns { display: flex; gap: 30px; flex-wrap: wrap; justify-content: center; }
    .campaign-card {
      width: 340px;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 16px;
      padding: 30px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      color: inherit;
    }
    .campaign-card:hover {
      border-color: #8b5cf6;
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(139, 92, 246, 0.15);
    }
    .campaign-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      margin-bottom: 20px;
    }
    .campaign-card h2 { font-size: 20px; font-weight: 600; margin-bottom: 8px; }
    .campaign-card p { font-size: 14px; color: #71717a; line-height: 1.6; margin-bottom: 20px; }
    .campaign-stats { display: flex; gap: 20px; }
    .stat { text-align: center; }
    .stat-value { font-size: 24px; font-weight: 700; color: #fafafa; }
    .stat-label { font-size: 10px; color: #52525b; text-transform: uppercase; letter-spacing: 0.5px; }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .footer { margin-top: 60px; color: #52525b; font-size: 12px; text-align: center; }
    .footer a { color: #8b5cf6; text-decoration: none; }
    .footer a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Campaign Viz</h1>
  <p class="subtitle">Funnel & Sequence Visualization System</p>

  <div class="campaigns">
    <a href="/signet" class="campaign-card">
      <div class="campaign-icon" style="background: linear-gradient(135deg, #f59e0b33, #ef444433);">
        <span style="font-size: 32px;">&#128240;</span>
      </div>
      <span class="badge" style="background: #f59e0b22; color: #fbbf24; border: 1px solid #f59e0b44;">Media-First</span>
      <h2>Signet AI Digest</h2>
      <p>Newsletter-style AI content with soft CTAs. Video watch % tracking and engagement-triggered deals. Morning Brew meets AI tools.</p>
      <div class="campaign-stats">
        <div class="stat"><div class="stat-value">24</div><div class="stat-label">Sequences</div></div>
        <div class="stat"><div class="stat-value">13</div><div class="stat-label">Stages</div></div>
        <div class="stat"><div class="stat-value">4</div><div class="stat-label">Triggers</div></div>
      </div>
    </a>

    <a href="/burton" class="campaign-card">
      <div class="campaign-icon" style="background: linear-gradient(135deg, #22c55e33, #06b6d433);">
        <span style="font-size: 32px;">&#127919;</span>
      </div>
      <span class="badge" style="background: #22c55e22; color: #4ade80; border: 1px solid #22c55e44;">Application Funnel</span>
      <h2>Burton Method</h2>
      <p>Application &rarr; Acceptance &rarr; 48-hour claim window. Real urgency from genuine scarcity. Milestone-based conversion.</p>
      <div class="campaign-stats">
        <div class="stat"><div class="stat-value">18</div><div class="stat-label">Sequences</div></div>
        <div class="stat"><div class="stat-value">10</div><div class="stat-label">Stages</div></div>
        <div class="stat"><div class="stat-value">48hr</div><div class="stat-label">Window</div></div>
      </div>
    </a>
  </div>

  <p class="footer">
    Built with <a href="https://github.com/BusyBee3333/campaign-viz" target="_blank">Campaign Viz</a><br>
    Deployed on Cloudflare Workers
  </p>
</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Route to appropriate campaign
    if (path === '/' || path === '') {
      return new Response(selectorPage, {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    }

    if (path === '/signet' || path.startsWith('/signet/')) {
      return new Response(signetHtml, {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    }

    if (path === '/burton' || path.startsWith('/burton/')) {
      return new Response(burtonHtml, {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    }

    // API endpoints
    if (path === '/api/campaigns') {
      return new Response(JSON.stringify({
        campaigns: [
          { id: 'signet', name: 'Signet AI Digest', type: 'media-first', url: '/signet' },
          { id: 'burton', name: 'Burton Method', type: 'application-funnel', url: '/burton' }
        ]
      }, null, 2), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 404
    return new Response('Not Found', { status: 404 });
  }
};
