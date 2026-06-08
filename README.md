<img width="780" height="496" alt="image" src="https://github.com/user-attachments/assets/71abb73a-2658-4039-94ae-eee6c03338af" />


# SpamShield

A lightweight Discord anti-spambot protection system built with Discord.js v14.

When a user sends a message, image, sticker, or attachment inside the protected channel, the bot will:

* Instantly ban the user
* Delete the user's last 1 hour of messages using Discord's native cleanup system
* Automatically restore protected channels after restarts

---

# Requirements

* Node.js 18+
* Discord Bot Token
* Discord.js v14

---

# Installation

## 1. Clone the repository

```bash
git clone https://github.com/Utkanowski/Discord-Spam-Shield.git
cd Discord-Spam-Shield
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure the bot

Open `index.js` and replace:

```js
const TOKEN = 'BOT_TOKEN';
const CLIENT_ID = 'CLIENT_ID';
const GUILD_ID = 'GUILD_ID';
```

with your actual values.

---

# Creating the Discord Bot

1. Open the Discord Developer Portal

2. Create a new application

3. Go to the "Bot" section

4. Click "Add Bot"

5. Enable:

   * MESSAGE CONTENT INTENT

6. Copy the bot token

---

# Inviting the Bot

In OAuth2 -> URL Generator:

Scopes:

* bot
* applications.commands

Bot Permissions:

* Ban Members
* Manage Channels
* Read Messages/View Channels

Open the generated URL and invite the bot.

---

# Commands

## `/startup`

Creates the protected anti-spambot channel.

Only administrators can use this command.

After running the command, the bot creates a channel named:

```text
# anti-spambot
```

The bot will send the following warning message:

```text
# DO NOT SEND ANY MESSAGES HERE

Sending a message will BAN you

This is for automatically blocking spambots
```

If any user sends a message, image, sticker, GIF, or attachment inside that channel, the bot will instantly ban them and delete their last 1 hour of messages.

---
