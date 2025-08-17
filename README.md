---
title: "Sitewave Project Overview"
description: "AI-powered assistant for discovering, organizing, and saving website resources"
---

# 🌊 Sitewave

**Sitewave** is a smart assistant for discovering useful websites, saving them to folders, and revisiting them through persistent chat history. It brings together AI-powered suggestions, engaging UI, and a full bookmarking experience with video context.

---

## 🚀 Vision

Make web discovery and organization effortless, delightful, and deeply personalized — driven by natural language and enhanced by smart metadata, folders, and visual context.

---

## 🧠 Core Flow

1. **User prompts AI** with a topic or request
2. AI responds with **animated, streamed website suggestions**
3. Each suggestion includes:
   - ✅ Title, URL, description, favicon
   - 🔍 Suggested folder path (for organizing)
   - 💬 Reason for suggestion
   - 🎞️ First matching video (YouTube or other source)
   - 📌 Bookmark/save button
4. User can:
   - Copy URL
   - Save suggestion to a folder
   - View video preview
   - Search saved bookmarks in a **folder tree**
   - Revisit past suggestions from **chat history**

---

## 💬 Chat System

- Users can start **multiple chats** per topic
- Each chat has its own stream of AI suggestions
- Full **chat history** is saved and queryable
- Great for going back to suggestions that weren’t bookmarked

---

## 💡 Features

| Feature                        | Description |
|-------------------------------|-------------|
| 🌐 Website Suggestion         | AI recommends websites based on prompt |
| ⏳ Streaming Animation        | Suggestions appear one-by-one with animation |
| 🧠 Zod Schema Validation      | Ensures typed, structured suggestions |
| 🎞️ Video Preview             | Embedded preview of first matched video |
| 📁 Folder Path Suggestion     | AI recommends a path like `Tools > AI > Research` |
| 🌳 Folder Tree Navigation     | Users can search/bookmark in a hierarchical structure |
| 💬 Persistent Chats           | Each chat session retains its own suggestion history |
| 🔖 Bookmarks                  | Save suggestions and manage them in folders |
| 🔄 Revisit Suggestions        | View past unbookmarked suggestions |

---

## 📦 Tech Stack

- **Next.js 15** w/ App Router
- **Tailwind CSS** + **shadcn/ui**
- **Lucide-react** icons
- **@ai-sdk/react** – streaming object AI responses
- **Zod** – schema validation
- **Convex** – persistent storage for chats, suggestions, bookmarks
- **Framer Motion** – UI animations

---
