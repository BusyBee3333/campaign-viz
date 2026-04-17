export const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Burton Method - Application Funnel Campaign</title>
  <script src="https://d3js.org/d3.v7.min.js"><\/script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #0f0f13; color: #e4e4e7; overflow: hidden; }
    #app { display: flex; height: 100vh; }
    #sidebar { width: 360px; background: #18181b; border-right: 1px solid #27272a; display: flex; flex-direction: column; overflow: hidden; }
    #sidebar-header { padding: 20px; border-bottom: 1px solid #27272a; }
    #sidebar-header h1 { font-size: 18px; font-weight: 600; color: #fafafa; margin-bottom: 4px; background: linear-gradient(90deg, #22c55e, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    #sidebar-header p { font-size: 12px; color: #71717a; }
    #filter-section { padding: 16px 20px; border-bottom: 1px solid #27272a; }
    #filter-section label { display: block; font-size: 11px; font-weight: 500; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .filter-buttons { display: flex; flex-wrap: wrap; gap: 6px; }
    .filter-btn { padding: 6px 12px; font-size: 12px; border: 1px solid #3f3f46; border-radius: 6px; background: transparent; color: #a1a1aa; cursor: pointer; transition: all 0.15s; }
    .filter-btn:hover { border-color: #52525b; color: #e4e4e7; }
    .filter-btn.active { background: #22c55e; border-color: #22c55e; color: black; }
    #sequence-list { flex: 1; overflow-y: auto; padding: 12px; }
    .sequence-card { background: #1f1f23; border: 1px solid #27272a; border-radius: 8px; padding: 12px; margin-bottom: 8px; cursor: pointer; transition: all 0.15s; }
    .sequence-card:hover { border-color: #22c55e; transform: translateX(2px); }
    .sequence-card.selected { border-color: #22c55e; background: #1a2e1f; }
    .sequence-card h3 { font-size: 13px; font-weight: 600; color: #fafafa; margin-bottom: 4px; }
    .sequence-card p { font-size: 11px; color: #71717a; margin-bottom: 8px; }
    .sequence-meta { display: flex; gap: 12px; font-size: 10px; }
    .sequence-meta span { display: flex; align-items: center; gap: 4px; color: #52525b; }
    .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; margin-right: 4px; }
    .badge-application { background: #3b82f622; color: #60a5fa; border: 1px solid #3b82f644; }
    .badge-acceptance { background: #22c55e22; color: #4ade80; border: 1px solid #22c55e44; }
    .badge-window { background: #ef444422; color: #f87171; border: 1px solid #ef444444; }
    .badge-claimed { background: #8b5cf622; color: #a78bfa; border: 1px solid #8b5cf644; }
    .badge-recovery { background: #f59e0b22; color: #fbbf24; border: 1px solid #f59e0b44; }
    #canvas-container { flex: 1; position: relative; overflow: hidden; }
    #canvas { width: 100%; height: 100%; }
    #legend { position: absolute; top: 20px; left: 20px; background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 12px 16px; }
    #legend h4 { font-size: 11px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
    .legend-item { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #a1a1aa; margin-bottom: 6px; }
    .legend-dot { width: 10px; height: 10px; border-radius: 50%; }
    #toolbar { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 8px 12px; }
    .toolbar-btn { padding: 8px 16px; border: 1px solid #3f3f46; background: transparent; border-radius: 6px; color: #a1a1aa; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; }
    .toolbar-btn:hover { border-color: #22c55e; color: #e4e4e7; }
    .toolbar-btn.active { background: #22c55e; border-color: #22c55e; color: black; }
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
    .back-link { position: absolute; top: 20px; right: 20px; padding: 8px 16px; background: #27272a; border: 1px solid #3f3f46; border-radius: 8px; color: #a1a1aa; text-decoration: none; font-size: 12px; z-index: 50; }
    .back-link:hover { background: #3f3f46; color: #fafafa; }
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
    .kanban-item:hover { border-color: #22c55e; transform: translateY(-1px); }
    .kanban-item .item-id { font-size: 10px; font-weight: 700; color: #22c55e; margin-bottom: 4px; }
    .kanban-item .item-name { font-size: 12px; font-weight: 600; color: #fafafa; margin-bottom: 6px; line-height: 1.3; }
    .kanban-item .item-meta { display: flex; gap: 10px; font-size: 10px; color: #71717a; }
    .kanban-filters { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
    .kanban-filter-btn { padding: 6px 14px; border: 1px solid #3f3f46; border-radius: 20px; font-size: 11px; font-weight: 600; cursor: pointer; background: transparent; color: #a1a1aa; transition: all 0.15s; }
    .kanban-filter-btn:hover { border-color: #52525b; color: #e4e4e7; }
    .kanban-filter-btn.active { background: #22c55e; border-color: #22c55e; color: black; }
    .urgency-indicator { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; animation: pulse 2s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  </style>
</head>
<body>
  <div id="app">
    <div id="sidebar">
      <div id="sidebar-header">
        <h1>Burton Method</h1>
        <p>Application Funnel | 48-Hour Claim Window</p>
      </div>
      <div id="filter-section">
        <label>Filter by Phase</label>
        <div class="filter-buttons">
          <button class="filter-btn active" data-filter="all">All</button>
          <button class="filter-btn" data-filter="application">Application</button>
          <button class="filter-btn" data-filter="acceptance">Acceptance</button>
          <button class="filter-btn" data-filter="window">48hr Window</button>
          <button class="filter-btn" data-filter="claimed">Claimed</button>
          <button class="filter-btn" data-filter="recovery">Recovery</button>
        </div>
      </div>
      <div id="sequence-list"></div>
    </div>
    <div id="canvas-container">
      <svg id="canvas"></svg>
      <a href="/" class="back-link">&#8592; All Campaigns</a>
      <div id="legend">
        <h4>Funnel Stages</h4>
        <div class="legend-item"><span class="legend-dot" style="background:#3b82f6"></span>Application</div>
        <div class="legend-item"><span class="legend-dot" style="background:#22c55e"></span>Acceptance</div>
        <div class="legend-item"><span class="legend-dot" style="background:#ef4444"></span>48hr Window</div>
        <div class="legend-item"><span class="legend-dot" style="background:#8b5cf6"></span>Claimed</div>
        <div class="legend-item"><span class="legend-dot" style="background:#f59e0b"></span>Recovery</div>
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
        <div class="stat"><div class="stat-value">10</div><div class="stat-label">Stages</div></div>
        <div class="stat"><div class="stat-value">48hr</div><div class="stat-label">Window</div></div>
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
    // BURTON METHOD: Application Funnel with 48-Hour Claim Window
    const blueprint = {
      philosophy: "Application -> Acceptance -> 48-hour claim window. Real urgency from genuine scarcity. Milestone-based progression with recovery paths.",
      pipeline: { stages: [
        { position: 0, name: "New Application", color: "#3b82f6" },
        { position: 1, name: "Under Review", color: "#3b82f6" },
        { position: 2, name: "Accepted", color: "#22c55e" },
        { position: 3, name: "Window Active", color: "#ef4444" },
        { position: 4, name: "24hr Mark", color: "#ef4444" },
        { position: 5, name: "6hr Warning", color: "#ef4444" },
        { position: 6, name: "Final Hour", color: "#ef4444" },
        { position: 7, name: "Claimed", color: "#8b5cf6" },
        { position: 99, name: "Customer", color: "#22c55e" },
        { position: 100, name: "Window Expired", color: "#71717a" }
      ]},
      sequences: [
        // APPLICATION PHASE
        { id: "A1", name: "Application Received", phase: "application", trigger: "Form Submit", duration: "2min", methodology: ["Confirmation", "Expectation Setting"], badge: "application" },
        { id: "A2", name: "Application Review", phase: "application", trigger: "24hr No Decision", duration: "24hr", methodology: ["Status Update", "Patience"], badge: "application" },
        { id: "A3", name: "More Info Needed", phase: "application", trigger: "Incomplete App", duration: "48hr", methodology: ["Clarification", "Help"], badge: "application" },

        // ACCEPTANCE PHASE
        { id: "B1", name: "Acceptance Notification", phase: "acceptance", trigger: "Approved", duration: "Instant", methodology: ["Celebration", "Window Start"], badge: "acceptance" },
        { id: "B2", name: "Welcome + Next Steps", phase: "acceptance", trigger: "1hr Post-Accept", duration: "1hr", methodology: ["Onboarding", "Clarity"], badge: "acceptance" },

        // 48-HOUR WINDOW
        { id: "W1", name: "Window Started", phase: "window", trigger: "Acceptance", duration: "0min", methodology: ["Urgency", "Value Stack"], badge: "window" },
        { id: "W2", name: "24hr Reminder", phase: "window", trigger: "24hr Mark", duration: "24hr", methodology: ["Halfway", "FOMO"], badge: "window" },
        { id: "W3", name: "6hr Warning", phase: "window", trigger: "42hr Mark", duration: "6hr", methodology: ["Urgency Increase", "Last Chance Preview"], badge: "window" },
        { id: "W4", name: "1hr Final", phase: "window", trigger: "47hr Mark", duration: "1hr", methodology: ["Final Call", "Clear CTA"], badge: "window" },
        { id: "W5", name: "15min Countdown", phase: "window", trigger: "47hr45min", duration: "15min", methodology: ["Extreme Urgency", "SMS"], badge: "window" },

        // CLAIMED
        { id: "C1", name: "Claim Confirmed", phase: "claimed", trigger: "Payment", duration: "Instant", methodology: ["Celebration", "Next Steps"], badge: "claimed" },
        { id: "C2", name: "Onboarding Start", phase: "claimed", trigger: "1hr Post-Claim", duration: "1hr", methodology: ["Momentum", "Quick Win"], badge: "claimed" },
        { id: "C3", name: "Day 1 Check-in", phase: "claimed", trigger: "24hr Post-Claim", duration: "24hr", methodology: ["Support", "Progress"], badge: "claimed" },

        // RECOVERY (Window Expired)
        { id: "R1", name: "Window Expired", phase: "recovery", trigger: "48hr No Claim", duration: "Instant", methodology: ["Empathy", "Door Open"], badge: "recovery" },
        { id: "R2", name: "Re-engagement", phase: "recovery", trigger: "3 Days Post-Expiry", duration: "72hr", methodology: ["Value Reminder", "New Offer"], badge: "recovery" },
        { id: "R3", name: "Waitlist Offer", phase: "recovery", trigger: "7 Days Post-Expiry", duration: "7d", methodology: ["Future Opportunity", "Priority"], badge: "recovery" },
        { id: "R4", name: "Final Re-engagement", phase: "recovery", trigger: "14 Days Post-Expiry", duration: "14d", methodology: ["Last Touch", "Survey"], badge: "recovery" }
      ],
      contactTypes: [
        { id: "applicant", name: "Applicant", description: "Submitted application" },
        { id: "under_review", name: "Under Review", description: "Application being evaluated" },
        { id: "accepted", name: "Accepted", description: "Approved, window started" },
        { id: "window_active", name: "Window Active", description: "In 48-hour claim period" },
        { id: "claimed", name: "Claimed", description: "Completed claim" },
        { id: "expired", name: "Window Expired", description: "Didn't claim in time" },
        { id: "customer", name: "Customer", description: "Active customer" }
      ]
    };

    // SEQUENCE MESSAGES
    const sequenceMessages = {
      "A1": [
        {
          id: "A1-1",
          timing: "0min",
          channel: "email",
          subject: "Application received - here's what happens next",
          methodology: "Confirmation + Expectation Setting",
          content: "{{first_name}},\\n\\nGot your application. Thank you.\\n\\nHere's what happens now:\\n\\n1. I personally review every application (yes, really)\\n2. You'll hear back within 24 hours\\n3. If accepted, you'll have 48 hours to claim your spot\\n\\nWhy 48 hours? Because the people who move fast are the people who get results. This isn't manufactured urgency - it's how I filter for action-takers.\\n\\nIf you have questions while you wait, just reply to this email.\\n\\n- Jake\\n\\nP.S. - I review applications in the order they come in. Yours is in the queue."
        },
        {
          id: "A1-2",
          timing: "2min",
          channel: "sms",
          chars: 145,
          methodology: "Quick confirmation on SMS",
          content: "Got your application, {{first_name}}. Reviewing now - you'll hear back within 24hrs. If accepted, 48hr window starts immediately. - Jake"
        }
      ],
      "A2": [
        {
          id: "A2-1",
          timing: "0min",
          channel: "email",
          subject: "Still reviewing - quick update",
          methodology: "Status update",
          content: "{{first_name}},\\n\\nQuick update: your application is still in review.\\n\\nI'm being thorough because I want to make sure this is actually right for you. Not everyone gets accepted - and that's a feature, not a bug.\\n\\nYou'll hear from me within the next few hours.\\n\\nThanks for your patience.\\n\\n- Jake"
        }
      ],
      "A3": [
        {
          id: "A3-1",
          timing: "0min",
          channel: "email",
          subject: "Need a bit more info on your application",
          methodology: "Clarification request",
          content: "{{first_name}},\\n\\nI'm reviewing your application and need to clarify a few things before I can make a decision.\\n\\n{{clarification_questions}}\\n\\nJust reply to this email with your answers and I'll get back to you quickly.\\n\\n- Jake"
        }
      ],
      "B1": [
        {
          id: "B1-1",
          timing: "0min",
          channel: "email",
          subject: "You're in - 48 hours starts NOW",
          methodology: "Acceptance + Window Start",
          content: "{{first_name}},\\n\\nYou're accepted.\\n\\nYour 48-hour window to claim your spot starts right now.\\n\\nDeadline: {{window_end_timestamp}}\\n\\nHere's what you're claiming:\\n\\n{{offer_summary}}\\n\\nThe investment: {{price}}\\n\\nThis window is real. After 48 hours, your spot goes to someone else on the waitlist. I'm not trying to pressure you - I'm trying to work with people who make decisions and take action.\\n\\n[Claim Your Spot Now &#8594;]\\n\\nGot questions? Reply to this email or text me at {{phone}}. I'll respond fast.\\n\\n- Jake\\n\\nP.S. - Your window ends {{window_end_timestamp}}. I'll send reminders, but don't count on the last minute."
        },
        {
          id: "B1-2",
          timing: "0min",
          channel: "sms",
          chars: 158,
          methodology: "Immediate SMS acceptance",
          content: "{{first_name}} - You're accepted! 48hr window starts NOW. Claim by {{window_end_short}}. Link in your email or reply here with questions. - Jake"
        }
      ],
      "B2": [
        {
          id: "B2-1",
          timing: "1hr",
          channel: "email",
          subject: "What happens after you claim",
          methodology: "Onboarding preview",
          content: "{{first_name}},\\n\\nWanted to give you a preview of what happens the moment you claim your spot.\\n\\n**Within 1 hour of claiming:**\\n- You'll get access to {{immediate_access}}\\n- We'll schedule your first {{first_milestone}}\\n- You'll join the private {{community_name}}\\n\\n**Within 24 hours:**\\n- {{day_1_deliverable}}\\n\\n**Within 1 week:**\\n- {{week_1_milestone}}\\n\\nThis isn't a course you buy and forget. We hit the ground running.\\n\\n[Claim Your Spot &#8594;]\\n\\nReminder: Window closes {{window_end_timestamp}}\\n\\n- Jake"
        }
      ],
      "W1": [
        {
          id: "W1-1",
          timing: "0min",
          channel: "email",
          subject: "Your 48-hour window is live",
          methodology: "Window activation",
          content: "{{first_name}},\\n\\nYour window is now active.\\n\\n**You have until {{window_end_timestamp}} to claim your spot.**\\n\\nAfter that, it goes to someone else.\\n\\nHere's the full breakdown of what you're getting:\\n\\n{{full_offer_details}}\\n\\nTotal value: {{total_value}}\\nYour investment: {{price}}\\n\\n[Claim Now &#8594;]\\n\\nEvery hour you wait is an hour of results you're not getting. The people who succeed in this program are the ones who decide fast and commit fully.\\n\\nWhich one are you?\\n\\n- Jake"
        }
      ],
      "W2": [
        {
          id: "W2-1",
          timing: "0min",
          channel: "email",
          subject: "24 hours left - halfway point",
          methodology: "Halfway urgency",
          content: "{{first_name}},\\n\\n24 hours down. 24 hours to go.\\n\\nYour window closes {{window_end_timestamp}}.\\n\\nI know you're thinking about this. Most people who get accepted are genuinely interested - they just get stuck in 'thinking about it' mode.\\n\\nHere's what I've learned: the people who wait until the last minute usually don't follow through. The ones who decide quickly are the ones who get results.\\n\\nYou already did the hard part - you applied, you got accepted. Don't let inertia steal this from you.\\n\\n[Claim Your Spot &#8594;]\\n\\nIf something's holding you back, just reply. Let's talk about it.\\n\\n- Jake"
        },
        {
          id: "W2-2",
          timing: "0min",
          channel: "sms",
          chars: 152,
          methodology: "24hr SMS reminder",
          content: "{{first_name}} - 24 hours left on your window. Halfway point. If you're on the fence, reply and tell me what's holding you back. - Jake"
        }
      ],
      "W3": [
        {
          id: "W3-1",
          timing: "0min",
          channel: "email",
          subject: "6 hours left - this is real",
          methodology: "Urgency increase",
          content: "{{first_name}},\\n\\n6 hours left.\\n\\nI'm not going to extend your window. I'm not going to make an exception. That's not how this works.\\n\\nAt {{window_end_timestamp}}, your spot goes to the next person on the waitlist.\\n\\nIf you're in, you need to be in now.\\n\\n[Claim Now &#8594;]\\n\\nIf you're out, that's okay too. But I need you to make a decision either way.\\n\\n- Jake"
        },
        {
          id: "W3-2",
          timing: "0min",
          channel: "sms",
          chars: 142,
          methodology: "6hr SMS warning",
          content: "6 hours left {{first_name}}. Window closes {{window_end_short}}. This is your last real chance to think about it. After that, decide time. - Jake"
        }
      ],
      "W4": [
        {
          id: "W4-1",
          timing: "0min",
          channel: "email",
          subject: "1 hour - final call",
          methodology: "Final hour",
          content: "{{first_name}},\\n\\n1 hour.\\n\\nYour window closes at {{window_end_timestamp}}.\\n\\nIf you want this, claim it now: [Claim Your Spot &#8594;]\\n\\nIf you don't, no hard feelings. But this is it.\\n\\n- Jake"
        },
        {
          id: "W4-2",
          timing: "0min",
          channel: "sms",
          chars: 138,
          methodology: "1hr SMS",
          content: "1 HOUR LEFT {{first_name}}. Closes {{window_end_short}}. If you want it, now is the time: {{claim_link}}"
        }
      ],
      "W5": [
        {
          id: "W5-1",
          timing: "0min",
          channel: "sms",
          chars: 145,
          methodology: "15min final countdown",
          content: "15 MINUTES. Window closes at {{window_end_short}}. Last chance: {{claim_link}} - After this, your spot goes to someone else. - Jake"
        }
      ],
      "C1": [
        {
          id: "C1-1",
          timing: "0min",
          channel: "email",
          subject: "You're in - let's go",
          methodology: "Claim confirmation + momentum",
          content: "{{first_name}},\\n\\nYou did it. You're in.\\n\\nI'm genuinely excited to work with you. The fact that you moved fast tells me you're the kind of person who gets results.\\n\\nHere's what happens now:\\n\\n**Immediate access:**\\n{{immediate_access_list}}\\n\\n**Next 24 hours:**\\n- I'll reach out to schedule {{first_session}}\\n- You'll get access to {{community}}\\n- We'll get your {{quick_win}} set up\\n\\n**Your login:**\\nEmail: {{login_email}}\\nTemporary password: {{temp_password}}\\n\\nLog in now and look around: [Access Dashboard &#8594;]\\n\\nWelcome to the team.\\n\\n- Jake\\n\\nP.S. - Save my number: {{phone}}. Text me anytime."
        },
        {
          id: "C1-2",
          timing: "0min",
          channel: "sms",
          chars: 148,
          methodology: "Claim confirmed SMS",
          content: "YOU'RE IN {{first_name}}! Check your email for login details. I'll be in touch within 24hrs to schedule your first session. Let's go. - Jake"
        }
      ],
      "C2": [
        {
          id: "C2-1",
          timing: "1hr",
          channel: "email",
          subject: "Quick question to get us started",
          methodology: "Momentum builder",
          content: "{{first_name}},\\n\\nNow that you're in, I want to hit the ground running.\\n\\nQuick question: What's the ONE thing you want to accomplish in the first week?\\n\\nNot 5 things. Not 'everything.' Just the single biggest priority.\\n\\nReply to this email and I'll make sure we tackle it first.\\n\\n- Jake\\n\\nP.S. - If you haven't logged into the dashboard yet, do that now. Get familiar with it."
        }
      ],
      "C3": [
        {
          id: "C3-1",
          timing: "24hr",
          channel: "email",
          subject: "Day 1 check-in",
          methodology: "Support + progress check",
          content: "{{first_name}},\\n\\nYou've been in for 24 hours. Quick check-in.\\n\\n**Have you:**\\n- [ ] Logged into the dashboard?\\n- [ ] Joined {{community}}?\\n- [ ] Scheduled your first session?\\n\\nIf not, do that today. Momentum matters.\\n\\nIf you're stuck on anything, reply or text me. Don't spin your wheels alone.\\n\\n- Jake"
        }
      ],
      "R1": [
        {
          id: "R1-1",
          timing: "0min",
          channel: "email",
          subject: "Your window closed",
          methodology: "Empathy + door open",
          content: "{{first_name}},\\n\\nYour 48-hour window closed.\\n\\nYour spot has been released to the waitlist.\\n\\nI'm not going to pretend to know why you didn't claim it. Maybe the timing was wrong. Maybe it wasn't the right fit. Maybe life just got in the way.\\n\\nWhatever the reason, I respect your decision.\\n\\nIf circumstances change and you want to re-apply, you're welcome to do that. But you'll go back to the end of the line - no special treatment.\\n\\nThanks for considering this. I wish you well.\\n\\n- Jake\\n\\nP.S. - If you want to tell me why you didn't move forward, I'd genuinely appreciate it. Just reply to this email."
        }
      ],
      "R2": [
        {
          id: "R2-1",
          timing: "3d",
          channel: "email",
          subject: "A thought about timing",
          methodology: "Value reminder",
          content: "{{first_name}},\\n\\nIt's been a few days since your window closed.\\n\\nI've been thinking about timing. Sometimes the 'right time' never comes. We wait for conditions to be perfect, for all our ducks to be in a row.\\n\\nBut here's what I've noticed: the people who succeed aren't the ones who wait for perfect timing. They're the ones who decide and then figure it out.\\n\\nIf you're still interested in {{offer_name}}, I occasionally open up new spots. Want me to put you on the priority list for the next opening?\\n\\nJust reply 'yes' and I'll make sure you hear first.\\n\\nNo pressure either way.\\n\\n- Jake"
        }
      ],
      "R3": [
        {
          id: "R3-1",
          timing: "7d",
          channel: "email",
          subject: "Priority waitlist spot",
          methodology: "Future opportunity",
          content: "{{first_name}},\\n\\nI'm opening a few new spots next month.\\n\\nBefore I announce it publicly, I wanted to offer you a priority position on the waitlist.\\n\\nThis means:\\n- You hear about it before anyone else\\n- You get first shot at claiming a spot\\n- No re-application required\\n\\nIf you want in, just reply 'waitlist' to this email.\\n\\nIf not, this will be my last message about it.\\n\\n- Jake"
        }
      ],
      "R4": [
        {
          id: "R4-1",
          timing: "14d",
          channel: "email",
          subject: "Final note + a question",
          methodology: "Last touch + feedback",
          content: "{{first_name}},\\n\\nThis is my final message about {{offer_name}}.\\n\\nBefore I stop reaching out, I have one question:\\n\\n**What would have made you say yes?**\\n\\nNot looking for a sale here. Genuinely curious what was missing - wrong timing, wrong price, wrong offer, or something else entirely.\\n\\nYour honest feedback helps me make this better for others.\\n\\nThanks for your time.\\n\\n- Jake"
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
          const urgencyDot = seq.phase === 'window' ? '<span class="urgency-indicator" style="background:#ef4444;"></span>' : '';
          card.innerHTML = \`
            <span class="badge \${badgeClass}">\${urgencyDot}\${seq.phase}</span>
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
      const centerX = width / 2;
      const startY = 60;
      const stageH = 60;
      const stageGap = 20;

      // Draw funnel stages vertically
      stages.forEach((stage, i) => {
        const y = startY + i * (stageH + stageGap);
        const w = 300 - i * 15;
        const x = centerX - w / 2;

        g.append('rect')
          .attr('x', x)
          .attr('y', y)
          .attr('width', w)
          .attr('height', stageH)
          .attr('rx', 8)
          .attr('fill', stage.color + '33')
          .attr('stroke', stage.color)
          .attr('stroke-width', 2);

        g.append('text')
          .attr('x', centerX)
          .attr('y', y + stageH / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', '#fafafa')
          .attr('font-size', '12px')
          .attr('font-weight', '600')
          .text(stage.name);

        // Stage number
        g.append('text')
          .attr('x', x + 15)
          .attr('y', y + stageH / 2)
          .attr('dominant-baseline', 'middle')
          .attr('fill', stage.color)
          .attr('font-size', '10px')
          .attr('font-weight', '700')
          .text(i);
      });

      // Draw sequences on the right side
      const seqStartX = centerX + 200;
      const seqBoxW = 180;
      const seqBoxH = 50;

      blueprint.sequences.forEach((seq, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const x = seqStartX + col * (seqBoxW + 10);
        const y = startY + row * (seqBoxH + 10);

        const phaseColors = {
          application: '#3b82f6',
          acceptance: '#22c55e',
          window: '#ef4444',
          claimed: '#8b5cf6',
          recovery: '#f59e0b'
        };

        g.append('rect')
          .attr('x', x)
          .attr('y', y)
          .attr('width', seqBoxW)
          .attr('height', seqBoxH)
          .attr('rx', 6)
          .attr('fill', '#1f1f23')
          .attr('stroke', phaseColors[seq.phase])
          .attr('stroke-width', 1)
          .style('cursor', 'pointer')
          .on('click', () => showDetails(seq));

        g.append('text')
          .attr('x', x + 10)
          .attr('y', y + 18)
          .attr('fill', phaseColors[seq.phase])
          .attr('font-size', '10px')
          .attr('font-weight', '700')
          .text(seq.id);

        g.append('text')
          .attr('x', x + 10)
          .attr('y', y + 35)
          .attr('fill', '#fafafa')
          .attr('font-size', '10px')
          .text(seq.name.substring(0, 20) + (seq.name.length > 20 ? '...' : ''));
      });
    }

    function drawNetwork() {
      const nodes = blueprint.sequences.map(s => ({ id: s.id, name: s.name, phase: s.phase }));
      const phaseColors = { application: '#3b82f6', acceptance: '#22c55e', window: '#ef4444', claimed: '#8b5cf6', recovery: '#f59e0b' };

      const simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength(-400))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(60));

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
        .attr('r', 35)
        .attr('fill', d => phaseColors[d.phase] + '33')
        .attr('stroke', d => phaseColors[d.phase])
        .attr('stroke-width', 2);

      node.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#fafafa')
        .attr('font-size', '11px')
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
      const phases = ['application', 'acceptance', 'window', 'claimed', 'recovery'];
      const phaseColors = { application: '#3b82f6', acceptance: '#22c55e', window: '#ef4444', claimed: '#8b5cf6', recovery: '#f59e0b' };
      const phaseLabels = { application: 'Application', acceptance: 'Acceptance', window: '48hr Window', claimed: 'Claimed', recovery: 'Recovery' };

      const rowHeight = 90;
      const startX = 180;
      const itemWidth = 140;

      phases.forEach((phase, i) => {
        const y = 60 + i * rowHeight;

        g.append('text')
          .attr('x', 30)
          .attr('y', y + 25)
          .attr('fill', phaseColors[phase])
          .attr('font-size', '13px')
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
          const x = startX + j * (itemWidth + 15);

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
            .text(seq.name.substring(0, 16) + (seq.name.length > 16 ? '...' : ''));
        });
      });
    }

    // Kanban
    function renderKanban() {
      const kanban = document.getElementById('kanban-view');
      const phases = [
        { id: 'application', name: 'Application', color: '#3b82f6' },
        { id: 'acceptance', name: 'Acceptance', color: '#22c55e' },
        { id: 'window', name: '48hr Window', color: '#ef4444' },
        { id: 'claimed', name: 'Claimed', color: '#8b5cf6' },
        { id: 'recovery', name: 'Recovery', color: '#f59e0b' }
      ];

      kanban.innerHTML = \`
        <div class="kanban-filters">
          <a href="/" style="padding:6px 14px;border:1px solid #3f3f46;border-radius:20px;font-size:11px;color:#a1a1aa;text-decoration:none;">&#8592; All Campaigns</a>
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
      a.download = 'burton-method-campaign.json';
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
