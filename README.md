# Campaign Viz

Interactive funnel and sequence visualization system for marketing campaigns. Built with D3.js, deployed on Cloudflare Workers.

## Live Demo

**https://signet-viz.jake-2ab.workers.dev**

## Campaigns

### Signet AI Digest (`/signet`)
Media-first newsletter approach for AI tools and news.
- Weekly AI Digest emails (Morning Brew style)
- Video watch % tracking (25/50/75/100% milestones)
- Engagement-triggered deals (earned scarcity, not manufactured)
- Soft CTAs to offers page

### Burton Method (`/burton`)
Application funnel with time-boxed claim windows.
- Application → Acceptance → 48-hour claim window
- Real urgency from genuine scarcity
- Milestone-based progression with recovery paths
- Urgency escalation through window timeline

## Features

- **4 Visualization Modes**: Funnel, Network, Timeline, Kanban
- **Full Message Copy**: Click any sequence to see all SMS/email content
- **Export to JSON**: Download complete campaign data
- **Interactive D3 Canvas**: Zoom, pan, drag nodes
- **Dark Mode UI**: Easy on the eyes

## Project Structure

```
campaign-viz/
├── src/
│   └── index.js           # Main router
├── campaigns/
│   ├── signet-ai-digest/
│   │   ├── campaign.js    # Full HTML + D3 visualization
│   │   └── sequences/     # JSON sequence data
│   └── burton-method/
│       └── campaign.js    # Full HTML + D3 visualization
├── wrangler.toml          # Cloudflare config
└── package.json
```

## Adding a New Campaign

1. Create `campaigns/your-campaign/campaign.js`
2. Export `html` containing full HTML document with D3 visualization
3. Import in `src/index.js` and add route
4. Add card to selector page

## Development

```bash
# Install wrangler
npm install -g wrangler

# Local dev
wrangler dev

# Deploy
wrangler deploy
```

## Campaign Data Structure

Each campaign exports a `blueprint` object:

```javascript
const blueprint = {
  philosophy: "Campaign approach description",
  pipeline: {
    stages: [
      { position: 0, name: "Stage Name", color: "#hex" },
      // ...
    ]
  },
  sequences: [
    {
      id: "S1",
      name: "Sequence Name",
      phase: "phase-id",
      trigger: "What triggers this",
      duration: "How long",
      methodology: ["Tag1", "Tag2"]
    }
  ],
  contactTypes: [
    { id: "type-id", name: "Display Name", description: "..." }
  ]
};

const sequenceMessages = {
  "S1": [
    {
      id: "S1-1",
      timing: "0min",
      channel: "email",
      subject: "Email subject",
      methodology: "Approach used",
      content: "Full message content with {{variables}}"
    }
  ]
};
```

## License

MIT
