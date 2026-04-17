export const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Signet AI Digest - Media-First Campaign System</title>
  <script src="https://d3js.org/d3.v7.min.js"><\/script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #0f0f13; color: #e4e4e7; overflow: hidden; }
    #app { display: flex; height: 100vh; }
    #sidebar { width: 360px; background: #18181b; border-right: 1px solid #27272a; display: flex; flex-direction: column; overflow: hidden; }
    #sidebar-header { padding: 20px; border-bottom: 1px solid #27272a; }
    #sidebar-header h1 { font-size: 18px; font-weight: 600; color: #fafafa; margin-bottom: 4px; background: linear-gradient(90deg, #f59e0b, #ef4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    #sidebar-header p { font-size: 12px; color: #71717a; }
    #filter-section { padding: 16px 20px; border-bottom: 1px solid #27272a; }
    #filter-section label { display: block; font-size: 11px; font-weight: 500; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .filter-buttons { display: flex; flex-wrap: wrap; gap: 6px; }
    .filter-btn { padding: 6px 12px; font-size: 12px; border: 1px solid #3f3f46; border-radius: 6px; background: transparent; color: #a1a1aa; cursor: pointer; transition: all 0.15s; }
    .filter-btn:hover { border-color: #52525b; color: #e4e4e7; }
    .filter-btn.active { background: #f59e0b; border-color: #f59e0b; color: black; }
    #sequence-list { flex: 1; overflow-y: auto; padding: 12px; }
    .sequence-card { background: #1f1f23; border: 1px solid #27272a; border-radius: 8px; padding: 12px; margin-bottom: 8px; cursor: pointer; transition: all 0.15s; }
    .sequence-card:hover { border-color: #f59e0b; transform: translateX(2px); }
    .sequence-card.selected { border-color: #f59e0b; background: #2d2517; }
    .sequence-card h3 { font-size: 13px; font-weight: 600; color: #fafafa; margin-bottom: 4px; }
    .sequence-card p { font-size: 11px; color: #71717a; margin-bottom: 8px; }
    .sequence-meta { display: flex; gap: 12px; font-size: 10px; }
    .sequence-meta span { display: flex; align-items: center; gap: 4px; color: #52525b; }
    .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; margin-right: 4px; }
    .badge-digest { background: #f59e0b22; color: #fbbf24; border: 1px solid #f59e0b44; }
    .badge-video { background: #8b5cf622; color: #a78bfa; border: 1px solid #8b5cf644; }
    .badge-deal { background: #22c55e22; color: #4ade80; border: 1px solid #22c55e44; }
    .badge-engage { background: #06b6d422; color: #22d3ee; border: 1px solid #06b6d444; }
    #canvas-container { flex: 1; position: relative; overflow: hidden; }
    #canvas { width: 100%; height: 100%; }
    #legend { position: absolute; top: 20px; left: 20px; background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 12px 16px; }
    #legend h4 { font-size: 11px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
    .legend-item { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #a1a1aa; margin-bottom: 6px; }
    .legend-dot { width: 10px; height: 10px; border-radius: 50%; }
    #toolbar { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 8px 12px; }
    .toolbar-btn { padding: 8px 16px; border: 1px solid #3f3f46; background: transparent; border-radius: 6px; color: #a1a1aa; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; }
    .toolbar-btn:hover { border-color: #f59e0b; color: #e4e4e7; }
    .toolbar-btn.active { background: #f59e0b; border-color: #f59e0b; color: black; }
    #stats-bar { position: absolute; bottom: 20px; left: 20px; display: flex; gap: 12px; background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 12px 16px; }
    .stat { text-align: center; }
    .stat-value { font-size: 20px; font-weight: 700; color: #fafafa; }
    .stat-label { font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; }
    #zoom-controls { position: absolute; bottom: 160px; right: 20px; display: flex; flex-direction: column; gap: 4px; }
    .zoom-btn { width: 36px; height: 36px; border: 1px solid #27272a; background: #18181b; border-radius: 8px; color: #a1a1aa; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; }
    .zoom-btn:hover { background: #27272a; color: #fafafa; }
    #minimap { position: absolute; bottom: 20px; right: 20px; width: 200px; height: 120px; background: #18181b; border: 1px solid #27272a; border-radius: 8px; overflow: hidden; }
    #details-panel { position: absolute; top: 0; right: 0; width: 560px; height: 100vh; background: #18181b; border-left: 1px solid #27272a; overflow: hidden; display: none; box-shadow: -10px 0 30px rgba(0,0,0,0.5); z-index: 100; }
    #details-panel.visible { display: flex; flex-direction: column; }
    #details-header { padding: 16px 20px; border-bottom: 1px solid #27272a; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
    #details-header h2 { font-size: 16px; font-weight: 600; }
    #close-details { width: 28px; height: 28px; border: none; background: #27272a; border-radius: 6px; color: #71717a; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    #close-details:hover { background: #3f3f46; color: #e4e4e7; }
    #details-content { padding: 20px; overflow-y: auto; flex: 1; }
    .detail-section { margin-bottom: 20px; }
    .detail-section h4 { font-size: 11px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .message-card { background: #1f1f23; border: 1px solid #27272a; border-radius: 8px; padding: 14px; margin-bottom: 10px; position: relative; }
    .message-card.sms { border-left: 3px solid #22c55e; }
    .message-card.email { border-left: 3px solid #3b82f6; }
    .message-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .message-id { font-size: 11px; font-weight: 600; color: #a1a1aa; }
    .message-timing { font-size: 10px; color: #71717a; background: #27272a; padding: 2px 8px; border-radius: 4px; }
    .message-channel { font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; margin-left: 6px; }
    .message-channel.sms { background: #22c55e22; color: #4ade80; }
    .message-channel.email { background: #3b82f622; color: #60a5fa; }
    .message-subject { font-size: 12px; font-weight: 600; color: #fafafa; margin-bottom: 8px; padding: 8px 10px; background: #27272a; border-radius: 4px; }
    .message-content { font-size: 12px; color: #d4d4d8; line-height: 1.6; white-space: pre-wrap; font-family: 'SF Mono', Monaco, monospace; background: #09090b; padding: 12px; border-radius: 6px; margin-top: 8px; max-height: 300px; overflow-y: auto; }
    .message-methodology { margin-top: 8px; display: flex; gap: 6px; flex-wrap: wrap; }
    .message-chars { font-size: 10px; color: #52525b; margin-top: 6px; }
    .message-chars.over { color: #ef4444; }
    .export-btn { position: absolute; bottom: 20px; left: 250px; padding: 10px 16px; background: #22c55e; border: none; border-radius: 8px; color: white; font-size: 12px; font-weight: 600; cursor: pointer; }
    .export-btn:hover { background: #16a34a; }
    #kanban-view { display: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #0f0f13; padding: 20px; overflow-x: auto; }
    #kanban-view.visible { display: flex; flex-direction: column; }
    .kanban-container { display: flex; gap: 16px; min-width: max-content; flex: 1; overflow-x: auto; padding-bottom: 20px; }
    .kanban-column { width: 280px; min-width: 280px; background: #18181b; border: 1px solid #27272a; border-radius: 10px; display: flex; flex-direction: column; max-height: calc(100vh - 150px); }
    .kanban-column-header { padding: 14px 16px; border-bottom: 1px solid #27272a; display: flex; align-items: center; gap: 10px; }
    .kanban-column-header .dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .kanban-column-header h3 { font-size: 12px; font-weight: 600; color: #fafafa; flex: 1; }
    .kanban-column-header .count { font-size: 10px; color: #71717a; background: #27272a; padding: 2px 8px; border-radius: 10px; }
    .kanban-column-body { flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 8px; }
    .kanban-item { background: #1f1f23; border: 1px solid #27272a; border-radius: 8px; padding: 12px; cursor: pointer; transition: all 0.15s; }
    .kanban-item:hover { border-color: #f59e0b; transform: translateY(-1px); }
    .kanban-item .item-id { font-size: 10px; font-weight: 700; color: #f59e0b; margin-bottom: 4px; }
    .kanban-item .item-name { font-size: 12px; font-weight: 600; color: #fafafa; margin-bottom: 6px; line-height: 1.3; }
    .kanban-item .item-meta { display: flex; gap: 10px; font-size: 10px; color: #71717a; }
    .kanban-filters { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
    .kanban-filter-btn { padding: 6px 14px; border: 1px solid #3f3f46; border-radius: 20px; font-size: 11px; font-weight: 600; cursor: pointer; background: transparent; color: #a1a1aa; transition: all 0.15s; }
    .kanban-filter-btn:hover { border-color: #52525b; color: #e4e4e7; }
    .kanban-filter-btn.active { background: #f59e0b; border-color: #f59e0b; color: black; }
    .offer-highlight { background: linear-gradient(135deg, #f59e0b22, #22c55e22); border: 1px solid #f59e0b44; }
    .price-tag { font-size: 14px; font-weight: 700; color: #22c55e; }
  </style>
</head>
<body>
  <div id="app">
    <div id="sidebar">
      <div id="sidebar-header">
        <h1>The AI Digest</h1>
        <p>Media-First Campaign | Signet AI</p>
      </div>
      <div id="filter-section">
        <label>Filter by Type</label>
        <div class="filter-buttons">
          <button class="filter-btn active" data-filter="all">All</button>
          <button class="filter-btn" data-filter="digest">Digest</button>
          <button class="filter-btn" data-filter="video">Video Watch</button>
          <button class="filter-btn" data-filter="engage">Engagement</button>
          <button class="filter-btn" data-filter="deal">Earned Deals</button>
        </div>
      </div>
      <div id="sequence-list"></div>
    </div>
    <div id="canvas-container">
      <svg id="canvas"></svg>
      <div id="legend">
        <h4>Campaign Philosophy</h4>
        <div class="legend-item"><span class="legend-dot" style="background:#f59e0b"></span>AI Digest (Newsletter)</div>
        <div class="legend-item"><span class="legend-dot" style="background:#8b5cf6"></span>Video Watch %</div>
        <div class="legend-item"><span class="legend-dot" style="background:#06b6d4"></span>Page Engagement</div>
        <div class="legend-item"><span class="legend-dot" style="background:#22c55e"></span>Earned Deals</div>
      </div>
      <div id="toolbar">
        <button class="toolbar-btn active" data-view="funnel"><span>&#8595;</span> Funnel</button>
        <button class="toolbar-btn" data-view="network"><span>&#9678;</span> Network</button>
        <button class="toolbar-btn" data-view="timeline"><span>&#8594;</span> Timeline</button>
        <button class="toolbar-btn" data-view="kanban"><span>&#9636;</span> Kanban</button>
      </div>
      <div id="stats-bar">
        <div class="stat"><div class="stat-value" id="sms-count">0</div><div class="stat-label">SMS</div></div>
        <div class="stat"><div class="stat-value" id="email-count">0</div><div class="stat-label">Emails</div></div>
        <div class="stat"><div class="stat-value">13</div><div class="stat-label">Stages</div></div>
        <div class="stat"><div class="stat-value">4</div><div class="stat-label">Triggers</div></div>
        <div class="stat"><div class="stat-value" id="seq-count">0</div><div class="stat-label">Sequences</div></div>
      </div>
      <button class="export-btn" onclick="exportJSON()">Export JSON</button>
      <div id="zoom-controls">
        <button class="zoom-btn" id="zoom-in">+</button>
        <button class="zoom-btn" id="zoom-out">-</button>
        <button class="zoom-btn" id="zoom-reset">&#8634;</button>
      </div>
      <div id="minimap"><svg id="minimap-svg" width="200" height="120"></svg></div>
      <div id="kanban-view"></div>
      <div id="details-panel">
        <div id="details-header"><h2 id="details-title">Details</h2><button id="close-details">&times;</button></div>
        <div id="details-content"></div>
      </div>
    </div>
  </div>
  <script>
    // MEDIA-FIRST CAMPAIGN: AI Digest + Engagement-Based Offers
    const blueprint = {
      philosophy: "Share AI news and tools in a fast, easy, fun way. Soft CTAs to offers page. Deals triggered by engagement behavior, not manufactured urgency.",
      pipeline: { stages: [
        { position: 0, name: "New Subscriber", color: "#f59e0b" },
        { position: 1, name: "Digest Reader", color: "#f59e0b" },
        { position: 2, name: "Active Reader", color: "#f59e0b" },
        { position: 3, name: "Offers Page Visitor", color: "#06b6d4" },
        { position: 4, name: "Video Started", color: "#8b5cf6" },
        { position: 5, name: "Video 25%", color: "#8b5cf6" },
        { position: 6, name: "Video 50%", color: "#8b5cf6" },
        { position: 7, name: "Video 75%", color: "#8b5cf6" },
        { position: 8, name: "Video 100%", color: "#8b5cf6" },
        { position: 9, name: "Deal Triggered", color: "#22c55e" },
        { position: 10, name: "Deal Active", color: "#22c55e" },
        { position: 99, name: "Customer", color: "#22c55e" },
        { position: 100, name: "Unsubscribed", color: "#71717a" }
      ]},
      sequences: [
        // AI DIGEST SEQUENCES
        { id: "D1", name: "Welcome to AI Digest", phase: "digest", trigger: "New Subscriber", duration: "Instant", methodology: ["Welcome", "Value Preview"], badge: "digest" },
        { id: "D2", name: "Weekly AI Digest", phase: "digest", trigger: "Every Tuesday", duration: "Ongoing", methodology: ["News", "Tools", "Soft CTA"], badge: "digest" },
        { id: "D3", name: "SMS Quick Tips", phase: "digest", trigger: "2x/week", duration: "Ongoing", methodology: ["Bite-sized", "Actionable"], badge: "digest" },

        // OFFER PAGE ENGAGEMENT
        { id: "O1", name: "First Offers Visit", phase: "engage", trigger: "Page View", duration: "24hr", methodology: ["Acknowledgment", "No Pressure"], badge: "engage" },
        { id: "O2", name: "Return Visitor", phase: "engage", trigger: "2+ Visits", duration: "24hr", methodology: ["Interest Noted", "Q&A Offer"], badge: "engage" },
        { id: "O3", name: "Deep Explorer", phase: "engage", trigger: "3+ Offers Viewed", duration: "24hr", methodology: ["Helper Mode", "Comparison"], badge: "engage" },
        { id: "O4", name: "CTA Clicked", phase: "engage", trigger: "Any CTA Click", duration: "2hr", methodology: ["Quick Response", "Clear Next Steps"], badge: "engage" },

        // VIDEO WATCH % - DWY
        { id: "V1-25", name: "DWY Video 25%", phase: "video", trigger: "25% watched", duration: "4hr", methodology: ["Engagement Check", "Question"], badge: "video" },
        { id: "V1-50", name: "DWY Video 50%", phase: "video", trigger: "50% watched", duration: "4hr", methodology: ["Halfway Acknowledgment"], badge: "video" },
        { id: "V1-75", name: "DWY Video 75%", phase: "video", trigger: "75% watched", duration: "2hr", methodology: ["Almost There", "Preview"], badge: "video" },
        { id: "V1-100", name: "DWY Video Complete", phase: "video", trigger: "100% watched", duration: "Instant", methodology: ["Celebration", "Deal Trigger"], badge: "video" },

        // VIDEO WATCH % - DFY
        { id: "V2-25", name: "DFY Video 25%", phase: "video", trigger: "25% watched", duration: "4hr", methodology: ["Engagement Check"], badge: "video" },
        { id: "V2-50", name: "DFY Video 50%", phase: "video", trigger: "50% watched", duration: "4hr", methodology: ["Value Reminder"], badge: "video" },
        { id: "V2-75", name: "DFY Video 75%", phase: "video", trigger: "75% watched", duration: "2hr", methodology: ["Anticipation"], badge: "video" },
        { id: "V2-100", name: "DFY Video Complete", phase: "video", trigger: "100% watched", duration: "Instant", methodology: ["Deal Trigger", "Premium Offer"], badge: "video" },

        // VIDEO WATCH % - CTO
        { id: "V3-25", name: "CTO Video 25%", phase: "video", trigger: "25% watched", duration: "4hr", methodology: ["Enterprise Tone"], badge: "video" },
        { id: "V3-50", name: "CTO Video 50%", phase: "video", trigger: "50% watched", duration: "4hr", methodology: ["Case Studies"], badge: "video" },
        { id: "V3-75", name: "CTO Video 75%", phase: "video", trigger: "75% watched", duration: "2hr", methodology: ["Discovery Offer"], badge: "video" },
        { id: "V3-100", name: "CTO Video Complete", phase: "video", trigger: "100% watched", duration: "Instant", methodology: ["Priority Access", "Extended Call"], badge: "video" },

        // EARNED DEAL SEQUENCES
        { id: "L1", name: "DWY Earned Deal", phase: "deal", trigger: "100% Video OR 3+ Visits", duration: "48hr", methodology: ["Earned Reward", "Real Scarcity"], badge: "deal" },
        { id: "L2", name: "DFY Earned Deal", phase: "deal", trigger: "100% Video OR 3+ Visits", duration: "48hr", methodology: ["Value Stack", "Bonus"], badge: "deal" },
        { id: "L3", name: "CTO Priority Access", phase: "deal", trigger: "100% Video OR Deep Engagement", duration: "72hr", methodology: ["Extended Discovery", "Priority Scheduling"], badge: "deal" },
        { id: "L4", name: "Comparison Helper", phase: "deal", trigger: "Multiple Offers Viewed", duration: "48hr", methodology: ["Decision Support", "No Pressure"], badge: "deal" }
      ],
      contactTypes: [
        { id: "new_subscriber", name: "New Subscriber", description: "Just joined the digest" },
        { id: "casual_reader", name: "Casual Reader", description: "Opens occasionally" },
        { id: "active_reader", name: "Active Reader", description: "Opens most digests" },
        { id: "offer_curious", name: "Offer Curious", description: "Visited offers page" },
        { id: "video_started", name: "Video Started", description: "Started watching an offer video" },
        { id: "video_completed", name: "Video Completed", description: "Watched full video" },
        { id: "deal_earned", name: "Deal Earned", description: "Triggered an earned deal" },
        { id: "customer", name: "Customer", description: "Purchased any offer" }
      ]
    };

    // SEQUENCE MESSAGES - AI DIGEST
    const sequenceMessages = {
      "D1": [
        {
          id: "D1-1",
          timing: "0min",
          channel: "email",
          subject: "Welcome to The AI Digest - let's make AI actually useful",
          methodology: "Welcome + Value Preview",
          content: "Hey {{first_name}},\\n\\nWelcome to The AI Digest.\\n\\nEvery Tuesday, you'll get:\\n- 3 AI tools worth trying (with honest takes on what they're actually good for)\\n- 1 workflow or automation idea you can steal\\n- Quick news hits so you sound smart in meetings\\n\\nNo fluff. No hype. Just practical AI stuff that makes your work easier.\\n\\nOh, and one more thing: Signet (the AI memory system behind this) is completely free and open source. If you ever want to go deeper with AI agents and memory, there's a page with some options:\\n\\n[See what's available &#8594;]\\n\\nBut honestly? Just enjoy the digest. That's why you're here.\\n\\nTalk Tuesday.\\n\\n- Jake\\n\\nP.S. - Reply to this email with what you're trying to figure out with AI. I read every one and it helps me write better issues."
        },
        {
          id: "D1-2",
          timing: "2hr",
          channel: "sms",
          chars: 142,
          methodology: "Casual welcome on SMS",
          content: "Hey {{first_name}}! Welcome to The AI Digest. You'll get your first issue Tuesday. Reply with what AI stuff you're curious about - I actually read these."
        }
      ],
      "D2": [
        {
          id: "D2-1",
          timing: "Tuesday 9am",
          channel: "email",
          subject: "AI Digest #{{issue_number}}: {{headline}}",
          methodology: "Weekly newsletter - Morning Brew style for AI",
          content: "Good morning {{first_name}},\\n\\nHere's your AI Digest for the week.\\n\\n---\\n\\n## TOOLS WORTH TRYING\\n\\n**{{tool_1_name}}** - {{tool_1_tagline}}\\n{{tool_1_honest_take}}\\nBest for: {{tool_1_use_case}}\\n[Try it &#8594;]\\n\\n**{{tool_2_name}}** - {{tool_2_tagline}}\\n{{tool_2_honest_take}}\\nBest for: {{tool_2_use_case}}\\n[Try it &#8594;]\\n\\n**{{tool_3_name}}** - {{tool_3_tagline}}\\n{{tool_3_honest_take}}\\nBest for: {{tool_3_use_case}}\\n[Try it &#8594;]\\n\\n---\\n\\n## STEAL THIS WORKFLOW\\n\\n**{{workflow_title}}**\\n\\n{{workflow_description}}\\n\\nSteps:\\n1. {{step_1}}\\n2. {{step_2}}\\n3. {{step_3}}\\n\\nTime saved: {{time_saved}}\\n\\n---\\n\\n## QUICK HITS\\n\\n- {{news_1}}\\n- {{news_2}}\\n- {{news_3}}\\n\\n---\\n\\nThat's it for this week.\\n\\nIf you want to go deeper with AI (agents, memory, automation), I've got some resources and services that might help:\\n\\n[See options &#8594;]\\n\\nOtherwise, see you next Tuesday.\\n\\n- Jake"
        }
      ],
      "D3": [
        {
          id: "D3-1",
          timing: "Thursday 2pm",
          channel: "sms",
          chars: 155,
          methodology: "Mid-week SMS tip",
          content: "Quick AI tip: {{tip_text}} Try it today and reply with what happens. -Jake"
        },
        {
          id: "D3-2",
          timing: "Sunday 10am",
          channel: "sms",
          chars: 148,
          methodology: "Weekend inspiration",
          content: "Weekend thought: {{thought_text}} More in Tuesday's digest. Enjoy your Sunday."
        }
      ],

      // OFFER PAGE ENGAGEMENT
      "O1": [
        {
          id: "O1-1",
          timing: "0min",
          channel: "email",
          subject: "Noticed you checking out the options",
          methodology: "Acknowledgment without pressure",
          content: "{{first_name}},\\n\\nI see you took a look at the offers page.\\n\\nNo sales pitch coming - just wanted to say: if you have any questions about which option might fit your situation, hit reply.\\n\\nOr don't. Totally fine to just browse.\\n\\nEither way, next digest drops Tuesday.\\n\\n- Jake"
        }
      ],
      "O2": [
        {
          id: "O2-1",
          timing: "0min",
          channel: "email",
          subject: "Looks like you're thinking about this seriously",
          methodology: "Interest noted + helpful positioning",
          content: "{{first_name}},\\n\\nYou've been back to the offers page a couple times.\\n\\nThat usually means you're genuinely evaluating whether any of this makes sense for you. Which is smart - these decisions shouldn't be impulsive.\\n\\nA few things that might help:\\n\\n1. **If you're trying to figure out which option fits:** I put together a quick comparison [here] that breaks down who each one is for.\\n\\n2. **If you have specific questions:** Reply to this email. I'll give you a straight answer.\\n\\n3. **If you just want to keep reading the digest and maybe decide later:** That's totally fine. The options aren't going anywhere.\\n\\nThe only thing I'd say: if you watch one of the videos all the way through, I do unlock a thank-you deal. Not manufactured urgency - just a genuine thanks for your time.\\n\\n- Jake"
        }
      ],
      "O3": [
        {
          id: "O3-1",
          timing: "0min",
          channel: "email",
          subject: "Comparing options? Let me help",
          methodology: "Helper mode - decision support",
          content: "{{first_name}},\\n\\nLooks like you're evaluating multiple options. That's actually the right approach - the worst thing would be picking something that doesn't fit.\\n\\nLet me make this easier:\\n\\n**Do-With-You ($499)** is right if:\\n- You want to understand how everything works\\n- You have 3-4 hours over the next month for training\\n- You learn by doing\\n\\n**Done-For-You ($1,499)** is right if:\\n- You just want it working, period\\n- Your time is worth more than the price difference\\n- You'd rather focus on running your business\\n\\n**Fractional CTO** is right if:\\n- You have ongoing technical decisions, not just a one-time setup\\n- You need strategic guidance, not just implementation\\n- Your challenges go beyond marketing systems\\n\\nStill not sure? Just reply and tell me about your situation. I'll give you a straight recommendation - even if it's 'none of these.'\\n\\n- Jake"
        }
      ],
      "O4": [
        {
          id: "O4-1",
          timing: "0min",
          channel: "sms",
          chars: 147,
          methodology: "Quick acknowledgment of CTA click",
          content: "Hey {{first_name}} - saw you clicked through on one of the offers. Any questions I can answer? Reply here or check your email for more details."
        },
        {
          id: "O4-2",
          timing: "30min",
          channel: "email",
          subject: "Quick follow-up on what you were looking at",
          methodology: "Helpful follow-up after interest signal",
          content: "{{first_name}},\\n\\nYou clicked on {{offer_clicked}} - wanted to make sure you have everything you need.\\n\\nQuick refresher on what's included:\\n{{offer_summary}}\\n\\nIf you're ready to move forward: [Continue here &#8594;]\\n\\nIf you have questions: Just reply to this email.\\n\\nNo rush either way. The offer's there when you're ready.\\n\\n- Jake"
        }
      ],

      // VIDEO WATCH % - DWY
      "V1-25": [
        {
          id: "V1-25-1",
          timing: "0min",
          channel: "sms",
          chars: 138,
          methodology: "Gentle check-in at 25%",
          content: "Hey {{first_name}} - noticed you started the DWY video. Got questions so far? Reply anytime. Or just keep watching - the good stuff is coming."
        }
      ],
      "V1-50": [
        {
          id: "V1-50-1",
          timing: "0min",
          channel: "sms",
          chars: 144,
          methodology: "Halfway acknowledgment",
          content: "Halfway through! The next section covers how we actually work together during the setup calls. Stick with it - that's where it clicks for most people."
        }
      ],
      "V1-75": [
        {
          id: "V1-75-1",
          timing: "0min",
          channel: "sms",
          chars: 151,
          methodology: "Almost there encouragement",
          content: "Almost done with the video. Quick heads up: if you finish it, I unlock a thank-you deal. Not a trick - just appreciate people who actually pay attention."
        }
      ],
      "V1-100": [
        {
          id: "V1-100-1",
          timing: "0min",
          channel: "email",
          subject: "You watched the whole thing - here's your thank you",
          methodology: "Earned deal trigger",
          content: "{{first_name}},\\n\\nYou watched the entire DWY video. That's 12 minutes of real attention.\\n\\nI appreciate that. So here's something I don't offer publicly:\\n\\n**$399 instead of $499** - good for 48 hours.\\n\\nThis isn't fake scarcity. It's a genuine thank-you for taking the time to actually understand what I'm offering before deciding.\\n\\nQuick recap of what you'd get:\\n- Complete Signet system setup\\n- 3 training sessions with me personally\\n- 30 days of support\\n- All templates and automations\\n\\nIf you're ready: [Claim $100 off &#8594;]\\n\\nIf you're not ready, no worries. The standard offer will still be here. But this specific deal expires {{deadline_timestamp}}.\\n\\n- Jake\\n\\nP.S. - Got questions before deciding? Just reply."
        },
        {
          id: "V1-100-2",
          timing: "24hr",
          channel: "sms",
          chars: 156,
          methodology: "Day-2 reminder",
          content: "Hey {{first_name}} - your $399 DWY deal expires tomorrow. Not gonna bug you about it, just wanted to make sure you saw it. Questions? Reply anytime."
        }
      ],

      // VIDEO WATCH % - DFY
      "V2-25": [
        {
          id: "V2-25-1",
          timing: "0min",
          channel: "sms",
          chars: 142,
          methodology: "Engagement check",
          content: "Started the Done-For-You video - nice. The next few minutes cover what 'done for you' actually means. Spoiler: you don't lift a finger on setup."
        }
      ],
      "V2-50": [
        {
          id: "V2-50-1",
          timing: "0min",
          channel: "sms",
          chars: 148,
          methodology: "Value reminder",
          content: "Halfway through! Coming up: the timeline breakdown and what your business looks like 2 weeks after we start. This is where people usually get excited."
        }
      ],
      "V2-75": [
        {
          id: "V2-75-1",
          timing: "0min",
          channel: "sms",
          chars: 155,
          methodology: "Anticipation building",
          content: "Almost done. Finish the video and I'll unlock a special deal - $300 off plus a bonus that's not available anywhere else. Worth the last few minutes."
        }
      ],
      "V2-100": [
        {
          id: "V2-100-1",
          timing: "0min",
          channel: "email",
          subject: "You did your homework - here's what that unlocks",
          methodology: "Premium earned deal",
          content: "{{first_name}},\\n\\nYou just spent real time understanding the Done-For-You system.\\n\\nThat kind of due diligence deserves a reward.\\n\\nFor the next 48 hours, I'm offering you:\\n\\n**$1,199 instead of $1,499** - that's $300 off\\n\\nPLUS a bonus that's not available anywhere else:\\n**Free Google Workspace setup** (normally a $150 add-on)\\n\\nQuick reminder of what DFY includes:\\n\\n- Complete system built FOR you (not with you - for you)\\n- CRM, automations, follow-up sequences - all done\\n- Google Business optimization\\n- 60 days of support\\n- Training so you actually understand what you have\\n\\nYou don't lift a finger on setup. You just start using it.\\n\\n[Claim $300 off + free Google Workspace &#8594;]\\n\\nExpires: {{deadline_timestamp}}\\n\\n- Jake\\n\\nP.S. - This deal exists because you showed up as a serious buyer, not a tire-kicker."
        },
        {
          id: "V2-100-2",
          timing: "36hr",
          channel: "sms",
          chars: 155,
          methodology: "Final day reminder",
          content: "{{first_name}} - about 12 hours left on your DFY deal ($1,199 + free Google Workspace). After that it's $1,499 with no bonus. Here if you have Qs."
        }
      ],

      // VIDEO WATCH % - CTO
      "V3-25": [
        {
          id: "V3-25-1",
          timing: "0min",
          channel: "email",
          subject: "Good start - a few things to know",
          methodology: "Enterprise tone, peer positioning",
          content: "{{first_name}},\\n\\nI see you've started watching the Fractional CTO overview.\\n\\nBefore you continue, I want to be upfront about something: this service isn't for everyone.\\n\\nIt makes sense if:\\n- You're making technical decisions without technical expertise\\n- You're spending money on development but unsure if you're getting value\\n- Your tech is becoming a bottleneck\\n\\nIt doesn't make sense if:\\n- You need someone coding 40 hours/week\\n- Your challenges are purely operational\\n- You're not ready to act on recommendations\\n\\nI turn away about 40% of prospects because the fit isn't right. Not false modesty - just how fractional CTO works best.\\n\\nIf this still sounds relevant, keep watching. The good stuff is coming.\\n\\n- Jake"
        }
      ],
      "V3-50": [
        {
          id: "V3-50-1",
          timing: "0min",
          channel: "email",
          subject: "Since you're seriously evaluating this",
          methodology: "Case study share",
          content: "{{first_name}},\\n\\nYou're halfway through - which tells me you're genuinely evaluating this.\\n\\nHere's a recent example of what this looks like in practice:\\n\\n**Client situation:** SaaS startup, 8-person team, burning through dev budget with nothing to show for it.\\n\\n**What I did:**\\n- Audited their tech stack (found 3 redundant tools costing $1,200/month)\\n- Reviewed their dev agency's work (discovered they were being overbilled by ~40%)\\n- Created a 90-day technical roadmap\\n- Sat in on vendor calls as their technical advocate\\n\\n**Result:** $34K saved in year one. Dev velocity doubled.\\n\\nThis isn't magic. It's just having someone technical on your side when you're making technical decisions.\\n\\nKeep watching - the next section covers how we'd actually work together.\\n\\n- Jake"
        }
      ],
      "V3-75": [
        {
          id: "V3-75-1",
          timing: "0min",
          channel: "sms",
          chars: 158,
          methodology: "Discovery offer preview",
          content: "Almost done with the CTO video. If you finish it, I'll open up my calendar for an extended discovery call - 60 min instead of 30. Worth the last few minutes."
        }
      ],
      "V3-100": [
        {
          id: "V3-100-1",
          timing: "0min",
          channel: "email",
          subject: "Re: Your interest in fractional CTO services",
          methodology: "Priority access earned",
          content: "{{first_name}},\\n\\nYou watched the entire Fractional CTO overview. That level of due diligence tells me you're evaluating this seriously.\\n\\nI'd like to offer you something I reserve for prospects who've done their homework:\\n\\n**Extended Discovery Session**\\nInstead of the standard 30-minute call, I'm offering you a 60-minute deep-dive. No pitch, no pressure - just an honest assessment of whether fractional CTO support makes sense for your situation.\\n\\n**Priority Scheduling**\\nI'm opening up calendar slots this week that aren't publicly available.\\n\\nThis offer is good for 72 hours. Not because of artificial scarcity, but because I keep these slots limited to ensure I can actually deliver on them.\\n\\n[Schedule Extended Discovery &#8594;]\\n\\nIf you'd prefer to continue evaluating, I understand. Happy to answer questions via email.\\n\\nRegards,\\nJake Shore"
        }
      ],

      // EARNED DEAL SEQUENCES
      "L1": [
        {
          id: "L1-1",
          timing: "0min",
          channel: "email",
          subject: "You watched the whole thing - here's a thank you",
          methodology: "Earned deal acknowledgment",
          content: "I noticed you watched the entire Do-With-You walkthrough.\\n\\nThat's not casual browsing. That's 12 minutes of actual attention.\\n\\nSo I want to offer you something I don't offer publicly:\\n\\n**$399 instead of $499** - but only for the next 48 hours.\\n\\nThis isn't manufactured urgency. It's a genuine thank-you for taking the time to actually understand what I'm offering before deciding.\\n\\nHere's the quick recap of what you'd get:\\n- Complete Local Bosses system setup\\n- 3 training sessions with me\\n- 30 days of support\\n- All the templates, all the automations\\n\\nIf you're ready: [Claim $100 off &#8594;]\\n\\nIf you're not ready, no worries. The standard offer will still be here.\\n\\nBut this specific deal expires {{deadline_timestamp}}.\\n\\n- Jake"
        },
        {
          id: "L1-2",
          timing: "18hr",
          channel: "email",
          subject: "Quick question about what you watched",
          methodology: "Check-in that adds value",
          content: "Hey {{first_name}},\\n\\nI wanted to check in on that $399 offer (expires in about 30 hours).\\n\\nBut more importantly - was there anything in the video that raised questions?\\n\\nMost people who watch the whole thing but don't move forward usually fall into one of these:\\n\\n**'I'm not sure I have time for 3 training sessions'**\\nWe schedule around you. Most clients do early morning or evening. Sessions are 45 minutes each.\\n\\n**'I tried something similar before and it didn't stick'**\\nThat's usually because it was pure DIY. This is Do-With-You - I'm building it alongside you.\\n\\n**'I need to think about the investment'**\\nTotally fair. $399 is real money. But if you're spending 5+ hours/week on manual follow-up, you'll get that back in month one.\\n\\nWant to hop on a quick call? [Schedule 15-min chat &#8594;]\\n\\nOr if ready: [Lock in $399 &#8594;]\\n\\n- Jake"
        },
        {
          id: "L1-3",
          timing: "36hr",
          channel: "sms",
          chars: 152,
          methodology: "Gentle 12-hour warning",
          content: "Hey {{first_name}} - your $399 DWY deal expires in about 12 hours. Just making sure you saw it before it's gone. No pressure: {{offer_link}}"
        },
        {
          id: "L1-4",
          timing: "47hr",
          channel: "email",
          subject: "Last call (then back to normal)",
          methodology: "Clean close",
          content: "{{first_name}},\\n\\nThis is the last note about the $399 deal - it expires in about an hour.\\n\\nAfter that, Do-With-You goes back to the standard $499.\\n\\nNo hard feelings either way. You watched the whole video, you know exactly what this is. You're capable of deciding if it's right for you.\\n\\nIf it is: [Get started at $399 &#8594;]\\n\\nIf it's not the right time, the door's always open. Just reply whenever you're ready to talk.\\n\\nThanks for taking the time to really look at this.\\n\\n- Jake\\n\\nP.S. Even if you don't grab this deal, I'd genuinely love to know what held you back. Just hit reply - it helps me make this better."
        }
      ],
      "L2": [
        {
          id: "L2-1",
          timing: "0min",
          channel: "email",
          subject: "You did your homework - here's what that unlocks",
          methodology: "Earned deal for serious buyer",
          content: "{{first_name}},\\n\\nYou just spent real time understanding the Done-For-You system.\\n\\nThat kind of due diligence deserves a reward.\\n\\nFor the next 48 hours, I'm offering you:\\n\\n**$1,199 instead of $1,499** - that's $300 off\\n\\nPLUS a bonus that's not available anywhere else:\\n**Free Google Workspace setup** (normally a $150 add-on)\\n\\nQuick reminder of what DFY includes:\\n\\n- Complete system built FOR you\\n- CRM, automations, follow-up sequences - all done\\n- Google Business optimization\\n- 60 days of support\\n- Training so you understand what you have\\n\\nYou don't lift a finger on setup. You just start using it.\\n\\n[Claim $300 off + free Google Workspace &#8594;]\\n\\nExpires: {{deadline_timestamp}}\\n\\n- Jake"
        },
        {
          id: "L2-2",
          timing: "20hr",
          channel: "email",
          subject: "What $1,199 actually gets you (broken down)",
          methodology: "Value justification",
          content: "{{first_name}},\\n\\nI wanted to break down what $1,199 actually means.\\n\\n**The System (worth $2,000+ if you built it yourself)**\\n- Full CRM setup and configuration\\n- Automated follow-up sequences\\n- Review request system\\n- Lead capture forms\\n- Appointment scheduling\\n\\n**The Optimization**\\n- Google Business Profile audit and fixes\\n- Local SEO foundations\\n\\n**The Support**\\n- 60 days of direct access to me\\n- Training on everything we build\\n- Tweaks and adjustments as needed\\n\\n**The Bonus (only with this deal)**\\n- Google Workspace setup ($150 value)\\n\\nIf you hired someone to do all this separately: $3,000-5,000.\\nIf you tried to DIY it: 40-60 hours of your time.\\n\\n$1,199 gets you done-and-working in about 2 weeks.\\n\\n[Lock in the deal &#8594;]\\n\\n- Jake"
        },
        {
          id: "L2-3",
          timing: "40hr",
          channel: "sms",
          chars: 158,
          methodology: "SMS reminder - 8 hours left",
          content: "{{first_name}} - about 8 hours left on your DFY deal ($1,199 + free Google Workspace). After that it's $1,499 with no bonus. Here if you have questions."
        },
        {
          id: "L2-4",
          timing: "47hr",
          channel: "email",
          subject: "Closing this out",
          methodology: "Clean close",
          content: "{{first_name}},\\n\\nThe Done-For-You deal expires in about an hour:\\n- $1,199 (instead of $1,499)\\n- Free Google Workspace setup\\n\\nAfter that, it goes back to standard pricing.\\n\\nI'm not going to pretend this is your 'last chance ever' - the service will still exist. But this specific deal won't.\\n\\nYou did your research. You know if this fits.\\n\\nIf it does: [Get started &#8594;]\\n\\nIf it doesn't, genuinely no hard feelings. You can always reach out when the timing is better.\\n\\n- Jake"
        }
      ],
      "L3": [
        {
          id: "L3-1",
          timing: "0min",
          channel: "email",
          subject: "Re: Your interest in fractional CTO services",
          methodology: "Enterprise earned access",
          content: "{{first_name}},\\n\\nI noticed you spent considerable time reviewing the Fractional CTO offering.\\n\\nThat level of due diligence tells me you're evaluating this seriously - which is exactly the kind of client I work best with.\\n\\nI'd like to offer you something I reserve for prospects who've done their homework:\\n\\n**Extended Discovery Session**\\nInstead of the standard 30-minute call, I'm offering you a 60-minute deep-dive. No pitch, no pressure - just an honest assessment of whether fractional CTO support makes sense for your situation.\\n\\n**Priority Scheduling**\\nI'm opening up calendar slots this week that aren't publicly available.\\n\\nThis offer is good for 72 hours - not because of artificial scarcity, but because I keep these slots limited.\\n\\n[Schedule Extended Discovery &#8594;]\\n\\nIf you'd prefer to continue your evaluation, I understand.\\n\\nRegards,\\nJake Shore"
        },
        {
          id: "L3-2",
          timing: "36hr",
          channel: "email",
          subject: "A few things to consider before we talk",
          methodology: "Adds value during consideration",
          content: "{{first_name}},\\n\\nI wanted to share some context that might help your evaluation.\\n\\n**When Fractional CTO makes sense:**\\n- You're making technical decisions without technical expertise\\n- You're spending money on development but not sure if you're getting value\\n- You need technical strategy but not a full-time hire\\n- Your tech is becoming a bottleneck\\n\\n**When it doesn't make sense:**\\n- You need someone writing code 40 hours/week\\n- Your challenges are purely operational\\n- You're not ready to act on recommendations\\n\\nI turn away about 40% of prospects because the fit isn't right. The discovery call is genuinely about figuring out if this is one of those situations.\\n\\n[Schedule the conversation &#8594;]\\n\\nOr reply with questions.\\n\\nRegards,\\nJake"
        },
        {
          id: "L3-3",
          timing: "71hr",
          channel: "email",
          subject: "Closing the loop on priority scheduling",
          methodology: "Professional close",
          content: "{{first_name}},\\n\\nThe priority scheduling window I offered is closing - those calendar slots will go back into regular availability.\\n\\nThe extended discovery call offer stands a bit longer, but scheduling will be subject to normal availability (usually 1-2 weeks out).\\n\\n[Schedule here &#8594;]\\n\\nIf the timing isn't right, I completely understand. Complex technical decisions shouldn't be rushed.\\n\\nFeel free to reach out whenever it makes sense.\\n\\nRegards,\\nJake Shore\\n\\nP.S. If you've decided this isn't the right fit, I'd appreciate knowing what factored into that decision."
        }
      ],
      "L4": [
        {
          id: "L4-1",
          timing: "0min",
          channel: "email",
          subject: "Looks like you're weighing options - let me help",
          methodology: "Helper positioning",
          content: "{{first_name}},\\n\\nI noticed you've been looking at a few different offers.\\n\\nThat's actually smart - the worst thing would be to pick something that doesn't fit your situation.\\n\\nLet me help you think through this:\\n\\n**Do-With-You ($499)** is right if:\\n- You want to understand how everything works\\n- You have 3-4 hours over the next month for training\\n- You want to be able to make changes yourself later\\n\\n**Done-For-You ($1,499)** is right if:\\n- You just want it working, period\\n- Your time is worth more than the price difference\\n- You'd rather focus on running your business\\n\\n**Fractional CTO** is right if:\\n- You have ongoing technical decisions\\n- You need strategic guidance, not just implementation\\n- Your challenges go beyond marketing systems\\n\\nMost local businesses do best with DWY or DFY. The CTO service is for more complex technical needs.\\n\\nStill not sure? Tell me about your business and I'll give you a straight answer.\\n\\n- Jake"
        },
        {
          id: "L4-2",
          timing: "24hr",
          channel: "email",
          subject: "Three questions to help you decide",
          methodology: "Self-sorting questions",
          content: "{{first_name}},\\n\\nStill thinking about which option fits? Here are three questions that usually make it clear:\\n\\n**1. How do you feel about learning new software?**\\nA) 'I actually enjoy it' -> Do-With-You\\nB) 'I'll do it if I have to' -> Either works\\nC) 'I'd rather not' -> Done-For-You\\n\\n**2. What's your time worth per hour?**\\nDWY requires about 4-5 hours of your time.\\nDFY requires about 1 hour.\\nDifference: $1,000 for ~4 hours = $250/hour value.\\n\\n**3. Do you want to modify things yourself later?**\\nIf yes -> DWY teaches you the system\\nIf no -> DFY just gives you a working system\\n\\nMost people know their answer after these three questions.\\n\\nStill stuck? Just reply and tell me what you're wrestling with.\\n\\n- Jake"
        },
        {
          id: "L4-3",
          timing: "48hr",
          channel: "email",
          subject: "No rush - just checking in",
          methodology: "Graceful close",
          content: "{{first_name}},\\n\\nJust checking in on your decision process.\\n\\nIf you've figured out which option fits: great. Here are the links:\\n- [Do-With-You &#8594;]\\n- [Done-For-You &#8594;]\\n- [Fractional CTO Discovery &#8594;]\\n\\nIf you're still thinking: also great. These decisions shouldn't be rushed.\\n\\nIf you've decided none of these are right: totally fine. No hard feelings.\\n\\nThe only thing I'd ask: if you're stuck on something specific, just tell me. Sometimes a 5-minute conversation clears up what feels like a big decision.\\n\\n- Jake"
        }
      ]
    };

    // Stats counting
    let smsCount = 0, emailCount = 0;
    Object.values(sequenceMessages).forEach(seq => {
      seq.forEach(msg => {
        if (msg.channel === 'sms') smsCount++;
        else if (msg.channel === 'email') emailCount++;
      });
    });
    document.getElementById('sms-count').textContent = smsCount;
    document.getElementById('email-count').textContent = emailCount;
    document.getElementById('seq-count').textContent = blueprint.sequences.length;

    // Render sequence list
    const sequenceList = document.getElementById('sequence-list');
    function renderSequenceList(filter = 'all') {
      sequenceList.innerHTML = '';
      blueprint.sequences
        .filter(s => filter === 'all' || s.phase === filter)
        .forEach(seq => {
          const card = document.createElement('div');
          card.className = 'sequence-card';
          card.dataset.id = seq.id;
          const badgeClass = 'badge-' + (seq.badge || seq.phase);
          card.innerHTML = \`
            <span class="badge \${badgeClass}">\${seq.phase}</span>
            <h3>\${seq.id}: \${seq.name}</h3>
            <p>\${seq.trigger}</p>
            <div class="sequence-meta">
              <span>\${seq.duration}</span>
              <span>\${seq.methodology.join(', ')}</span>
            </div>
          \`;
          card.onclick = () => showDetails(seq);
          sequenceList.appendChild(card);
        });
    }
    renderSequenceList();

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderSequenceList(btn.dataset.filter);
      };
    });

    // Details panel
    const detailsPanel = document.getElementById('details-panel');
    const detailsTitle = document.getElementById('details-title');
    const detailsContent = document.getElementById('details-content');
    document.getElementById('close-details').onclick = () => detailsPanel.classList.remove('visible');

    function showDetails(seq) {
      document.querySelectorAll('.sequence-card').forEach(c => c.classList.remove('selected'));
      document.querySelector(\`.sequence-card[data-id="\${seq.id}"]\`)?.classList.add('selected');

      detailsTitle.textContent = seq.id + ': ' + seq.name;
      const messages = sequenceMessages[seq.id] || [];

      detailsContent.innerHTML = \`
        <div class="detail-section">
          <h4>Sequence Info</h4>
          <p style="font-size:12px;color:#a1a1aa;margin-bottom:8px;"><strong>Trigger:</strong> \${seq.trigger}</p>
          <p style="font-size:12px;color:#a1a1aa;margin-bottom:8px;"><strong>Duration:</strong> \${seq.duration}</p>
          <p style="font-size:12px;color:#a1a1aa;"><strong>Methodology:</strong> \${seq.methodology.join(', ')}</p>
        </div>
        <div class="detail-section">
          <h4>Messages (\${messages.length})</h4>
          \${messages.map(msg => \`
            <div class="message-card \${msg.channel}">
              <div class="message-header">
                <span class="message-id">\${msg.id}</span>
                <div>
                  <span class="message-timing">\${msg.timing}</span>
                  <span class="message-channel \${msg.channel}">\${msg.channel.toUpperCase()}</span>
                </div>
              </div>
              \${msg.subject ? \`<div class="message-subject">\${msg.subject}</div>\` : ''}
              <div class="message-content">\${msg.content}</div>
              <div class="message-methodology"><span class="badge badge-\${seq.badge || seq.phase}">\${msg.methodology}</span></div>
              \${msg.chars ? \`<div class="message-chars \${msg.content.length > 160 ? 'over' : ''}">\${msg.content.length}/160 chars</div>\` : ''}
            </div>
          \`).join('')}
        </div>
      \`;
      detailsPanel.classList.add('visible');
    }

    // D3 Visualization
    const svg = d3.select('#canvas');
    const container = document.getElementById('canvas-container');
    let width = container.clientWidth;
    let height = container.clientHeight;
    svg.attr('viewBox', \`0 0 \${width} \${height}\`);

    const g = svg.append('g');
    const zoom = d3.zoom().scaleExtent([0.3, 3]).on('zoom', e => g.attr('transform', e.transform));
    svg.call(zoom);

    // Views
    let currentView = 'funnel';
    document.querySelectorAll('.toolbar-btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.toolbar-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentView = btn.dataset.view;
        document.getElementById('kanban-view').classList.toggle('visible', currentView === 'kanban');
        if (currentView !== 'kanban') drawView();
      };
    });

    function drawView() {
      g.selectAll('*').remove();
      if (currentView === 'funnel') drawFunnel();
      else if (currentView === 'network') drawNetwork();
      else if (currentView === 'timeline') drawTimeline();
    }

    function drawFunnel() {
      const stages = blueprint.pipeline.stages.filter(s => s.position < 90);
      const stageWidth = 180;
      const stageHeight = 50;
      const startX = width / 2 - (stages.length * stageWidth) / 2;
      const startY = 80;

      // Stage boxes
      stages.forEach((stage, i) => {
        const x = startX + i * stageWidth;
        g.append('rect')
          .attr('x', x)
          .attr('y', startY)
          .attr('width', stageWidth - 10)
          .attr('height', stageHeight)
          .attr('rx', 8)
          .attr('fill', stage.color + '33')
          .attr('stroke', stage.color)
          .attr('stroke-width', 2);

        g.append('text')
          .attr('x', x + (stageWidth - 10) / 2)
          .attr('y', startY + stageHeight / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', '#fafafa')
          .attr('font-size', '11px')
          .attr('font-weight', '600')
          .text(stage.name);
      });

      // Sequences below
      const seqsByPhase = {
        digest: blueprint.sequences.filter(s => s.phase === 'digest'),
        engage: blueprint.sequences.filter(s => s.phase === 'engage'),
        video: blueprint.sequences.filter(s => s.phase === 'video'),
        deal: blueprint.sequences.filter(s => s.phase === 'deal')
      };

      const phaseColors = { digest: '#f59e0b', engage: '#06b6d4', video: '#8b5cf6', deal: '#22c55e' };
      let yOffset = startY + stageHeight + 80;

      Object.entries(seqsByPhase).forEach(([phase, seqs]) => {
        const phaseLabel = phase.charAt(0).toUpperCase() + phase.slice(1);
        g.append('text')
          .attr('x', 60)
          .attr('y', yOffset)
          .attr('fill', phaseColors[phase])
          .attr('font-size', '14px')
          .attr('font-weight', '700')
          .text(phaseLabel + ' Sequences');

        yOffset += 30;
        const cols = Math.min(seqs.length, 6);
        const boxW = 160;
        const boxH = 70;
        const gapX = 20;

        seqs.forEach((seq, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = 60 + col * (boxW + gapX);
          const y = yOffset + row * (boxH + 15);

          g.append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', boxW)
            .attr('height', boxH)
            .attr('rx', 6)
            .attr('fill', '#1f1f23')
            .attr('stroke', phaseColors[phase])
            .attr('stroke-width', 1)
            .style('cursor', 'pointer')
            .on('click', () => showDetails(seq));

          g.append('text')
            .attr('x', x + 10)
            .attr('y', y + 18)
            .attr('fill', phaseColors[phase])
            .attr('font-size', '10px')
            .attr('font-weight', '700')
            .text(seq.id);

          g.append('text')
            .attr('x', x + 10)
            .attr('y', y + 35)
            .attr('fill', '#fafafa')
            .attr('font-size', '11px')
            .attr('font-weight', '600')
            .text(seq.name.substring(0, 22) + (seq.name.length > 22 ? '...' : ''));

          g.append('text')
            .attr('x', x + 10)
            .attr('y', y + 52)
            .attr('fill', '#71717a')
            .attr('font-size', '9px')
            .text(seq.trigger.substring(0, 25));
        });

        yOffset += Math.ceil(seqs.length / cols) * (boxH + 15) + 40;
      });
    }

    function drawNetwork() {
      const nodes = blueprint.sequences.map(s => ({ id: s.id, name: s.name, phase: s.phase }));
      const phaseColors = { digest: '#f59e0b', engage: '#06b6d4', video: '#8b5cf6', deal: '#22c55e' };

      const simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(50));

      const node = g.selectAll('g.node')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .style('cursor', 'pointer')
        .call(d3.drag()
          .on('start', (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
          .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
          .on('end', (e, d) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; }));

      node.append('circle')
        .attr('r', 30)
        .attr('fill', d => phaseColors[d.phase] + '33')
        .attr('stroke', d => phaseColors[d.phase])
        .attr('stroke-width', 2);

      node.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#fafafa')
        .attr('font-size', '10px')
        .attr('font-weight', '600')
        .text(d => d.id);

      node.on('click', (e, d) => {
        const seq = blueprint.sequences.find(s => s.id === d.id);
        if (seq) showDetails(seq);
      });

      simulation.on('tick', () => {
        node.attr('transform', d => \`translate(\${d.x}, \${d.y})\`);
      });
    }

    function drawTimeline() {
      const phases = ['digest', 'engage', 'video', 'deal'];
      const phaseColors = { digest: '#f59e0b', engage: '#06b6d4', video: '#8b5cf6', deal: '#22c55e' };
      const phaseLabels = { digest: 'AI Digest', engage: 'Engagement', video: 'Video Watch', deal: 'Earned Deals' };

      const rowHeight = 100;
      const startX = 200;
      const itemWidth = 150;

      phases.forEach((phase, i) => {
        const y = 80 + i * rowHeight;

        g.append('text')
          .attr('x', 30)
          .attr('y', y + 25)
          .attr('fill', phaseColors[phase])
          .attr('font-size', '14px')
          .attr('font-weight', '700')
          .text(phaseLabels[phase]);

        g.append('line')
          .attr('x1', startX)
          .attr('y1', y + 25)
          .attr('x2', width - 50)
          .attr('y2', y + 25)
          .attr('stroke', '#27272a')
          .attr('stroke-width', 2);

        const seqs = blueprint.sequences.filter(s => s.phase === phase);
        seqs.forEach((seq, j) => {
          const x = startX + j * (itemWidth + 20);

          g.append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', itemWidth)
            .attr('height', 50)
            .attr('rx', 6)
            .attr('fill', '#1f1f23')
            .attr('stroke', phaseColors[phase])
            .style('cursor', 'pointer')
            .on('click', () => showDetails(seq));

          g.append('text')
            .attr('x', x + 10)
            .attr('y', y + 20)
            .attr('fill', phaseColors[phase])
            .attr('font-size', '10px')
            .attr('font-weight', '700')
            .text(seq.id);

          g.append('text')
            .attr('x', x + 10)
            .attr('y', y + 36)
            .attr('fill', '#fafafa')
            .attr('font-size', '10px')
            .text(seq.name.substring(0, 18) + (seq.name.length > 18 ? '...' : ''));
        });
      });
    }

    // Kanban view
    function renderKanban() {
      const kanban = document.getElementById('kanban-view');
      const phases = [
        { id: 'digest', name: 'AI Digest', color: '#f59e0b' },
        { id: 'engage', name: 'Engagement', color: '#06b6d4' },
        { id: 'video', name: 'Video Watch', color: '#8b5cf6' },
        { id: 'deal', name: 'Earned Deals', color: '#22c55e' }
      ];

      kanban.innerHTML = \`
        <div class="kanban-filters">
          \${phases.map(p => \`<button class="kanban-filter-btn" data-phase="\${p.id}">\${p.name}</button>\`).join('')}
        </div>
        <div class="kanban-container">
          \${phases.map(phase => {
            const seqs = blueprint.sequences.filter(s => s.phase === phase.id);
            return \`
              <div class="kanban-column">
                <div class="kanban-column-header">
                  <span class="dot" style="background:\${phase.color}"></span>
                  <h3>\${phase.name}</h3>
                  <span class="count">\${seqs.length}</span>
                </div>
                <div class="kanban-column-body">
                  \${seqs.map(seq => \`
                    <div class="kanban-item" data-id="\${seq.id}">
                      <div class="item-id">\${seq.id}</div>
                      <div class="item-name">\${seq.name}</div>
                      <div class="item-meta">
                        <span>\${seq.trigger}</span>
                        <span>\${seq.duration}</span>
                      </div>
                    </div>
                  \`).join('')}
                </div>
              </div>
            \`;
          }).join('')}
        </div>
      \`;

      kanban.querySelectorAll('.kanban-item').forEach(item => {
        item.onclick = () => {
          const seq = blueprint.sequences.find(s => s.id === item.dataset.id);
          if (seq) showDetails(seq);
        };
      });
    }
    renderKanban();

    // Zoom controls
    document.getElementById('zoom-in').onclick = () => svg.transition().call(zoom.scaleBy, 1.3);
    document.getElementById('zoom-out').onclick = () => svg.transition().call(zoom.scaleBy, 0.7);
    document.getElementById('zoom-reset').onclick = () => svg.transition().call(zoom.transform, d3.zoomIdentity);

    // Export
    function exportJSON() {
      const data = { blueprint, sequenceMessages, exportedAt: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'signet-ai-digest-campaign.json';
      a.click();
      URL.revokeObjectURL(url);
    }
    window.exportJSON = exportJSON;

    // Initial draw
    drawView();

    // Resize
    window.addEventListener('resize', () => {
      width = container.clientWidth;
      height = container.clientHeight;
      svg.attr('viewBox', \`0 0 \${width} \${height}\`);
      drawView();
    });
  <\/script>
</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
      },
    });
  },
};
