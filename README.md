# 🔥 Raze Assistant

A powerful Discord bot built with **Node.js** + **discord.js v14** featuring:

- 📬 **Modmail** – Users DM the bot to open private support tickets
- 🛡️ **Moderation** – Ban, kick, timeout, warn, purge & more
- 🤖 **AI** – Chat with AI using `/ask` (powered by **Groq** + `openai/gpt-oss-20b`)

---

## ✨ Features

### Modmail
- Users DM the bot → creates a private ticket channel
- Staff reply in the ticket channel → message is relayed to the user
- Close tickets with `/close`

### Moderation
| Command | Description |
|---------|-------------|
| `/ban` | Ban a member |
| `/kick` | Kick a member |
| `/timeout` | Timeout (mute) a member |
| `/warn` | Warn a member |
| `/warnings` | View a user's warnings |
| `/purge` | Bulk delete messages |
| `/close` | Close a modmail ticket |

### AI (Groq)
- `/ask <question>` – Ask the AI anything
- Default model: **`openai/gpt-oss-20b`** (fast & free-tier friendly on Groq)
- Fully compatible with OpenAI, xAI, or any OpenAI-compatible endpoint

---

## 🚀 Setup

### 1. Prerequisites
- Node.js 18+
- A Discord Bot ([Discord Developer Portal](https://discord.com/developers/applications))
- A free Groq API key → [console.groq.com/keys](https://console.groq.com/keys)

### 2. Enable Intents
In the Discord Developer Portal → your bot → **Privileged Gateway Intents**:
- ✅ Message Content Intent
- ✅ Server Members Intent

### 3. Invite the Bot
```
https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

### 4. Install & Configure
```bash
git clone https://github.com/yoshi507/raze-assistant.git
cd raze-assistant
npm install
cp .env.example .env
```

Edit `.env`:

```env
DISCORD_TOKEN=your_bot_token
GUILD_ID=your_server_id
MODMAIL_CATEGORY_ID=your_modmail_category_id
STAFF_ROLE_ID=your_staff_role_id

# Groq (recommended)
AI_API_KEY=your_groq_api_key
AI_BASE_URL=https://api.groq.com/openai/v1
AI_MODEL=openai/gpt-oss-20b
```

### 5. Run
```bash
npm start
# or with auto-reload:
npm run dev
```

---

## 🤖 Switching AI Providers

Just change these 3 lines in `.env`:

| Provider | AI_BASE_URL | AI_MODEL |
|----------|-------------|----------|
| **Groq** (default) | `https://api.groq.com/openai/v1` | `openai/gpt-oss-20b` |
| OpenAI | `https://api.openai.com/v1` | `gpt-4o-mini` |
| xAI Grok | `https://api.x.ai/v1` | `grok-beta` |

---

## 📁 Project Structure

```
raze-assistant/
├── src/
│   ├── index.js
│   ├── commands/     # Slash commands
│   ├── events/       # Discord events
│   └── utils/
├── .env.example
├── package.json
└── README.md
```

---

## 🛡️ Permissions Needed
- Manage Channels
- Manage Messages
- Ban Members / Kick Members
- Moderate Members (timeout)
- Send Messages + Embed Links

---

## 📝 License
MIT

Made with ❤️ for the community.
