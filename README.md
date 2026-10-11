# 🔥 Raze Assistant

A powerful Discord bot built with **Node.js** + **discord.js v14** featuring:

- 📬 **Modmail** – Users DM the bot to open private support tickets
- 🛡️ **Moderation** – Ban, kick, timeout, warn, purge & more
- 🤖 **AI** – Chat with AI using `/ask` (OpenAI / xAI Grok compatible)

---

## ✨ Features

### Modmail
- Users DM the bot → creates a private ticket channel
- Staff reply in the ticket channel → message is relayed to the user
- Close tickets with `/close`
- Transcripts & logging support

### Moderation
| Command | Description |
|---------|-------------|
| `/ban` | Ban a member |
| `/kick` | Kick a member |
| `/timeout` | Timeout (mute) a member |
| `/warn` | Warn a member |
| `/warnings` | View a user's warnings |
| `/purge` | Bulk delete messages |
| `/modmail` | Setup / info about modmail |

### AI
- `/ask <question>` – Ask the AI anything (uses your configured model)

---

## 🚀 Setup

### 1. Prerequisites
- Node.js 18+ 
- A Discord Bot (create one at [Discord Developer Portal](https://discord.com/developers/applications))

### 2. Enable Intents
In the Discord Developer Portal → your bot → **Privileged Gateway Intents**:
- ✅ Message Content Intent
- ✅ Server Members Intent
- ✅ Presence Intent (optional)

### 3. Invite the Bot
Use this invite link (replace `CLIENT_ID`):
```
https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=8&scope=bot%20applications.commands
```
(Or generate one with Administrator + applications.commands)

### 4. Install & Configure
```bash
git clone https://github.com/yoshi507/raze-assistant.git
cd raze-assistant
npm install
cp .env.example .env
```

Edit `.env` with your values:
- `DISCORD_TOKEN`
- `GUILD_ID`
- `MODMAIL_CATEGORY_ID` (create a category called "Modmail" and copy its ID)
- `STAFF_ROLE_ID`
- `AI_API_KEY` (OpenAI or xAI key)
- Optional: change `AI_BASE_URL` and `AI_MODEL` for xAI Grok:
  ```
  AI_BASE_URL=https://api.x.ai/v1
  AI_MODEL=grok-beta
  ```

### 5. Run
```bash
npm start
# or for development with auto-reload:
npm run dev
```

---

## 📁 Project Structure

```
raze-assistant/
├── src/
│   ├── index.js          # Main entry point
│   ├── commands/         # Slash commands
│   ├── events/           # Discord events
│   └── utils/            # Helpers
├── .env.example
├── package.json
└── README.md
```

---

## 🔧 Commands Overview

### Slash Commands (recommended)
All commands are registered as slash commands automatically on startup.

### Modmail Flow
1. User DMs the bot any message
2. Bot creates a channel under the modmail category named `ticket-username`
3. Staff reply normally in that channel
4. Bot relays the reply to the user via DM
5. Use `/close` inside the ticket to close it

---

## 🛡️ Permissions Needed
The bot needs:
- Manage Channels
- Manage Messages
- Ban Members
- Kick Members
- Moderate Members (for timeout)
- Send Messages / Embed Links
- View Channels

---

## 📝 License
MIT

Made with ❤️ for the community.
