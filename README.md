# 🌊 Sitewave

**Sitewave** is a smart assistant that uses **Gemini AI** to help users discover useful websites, understand their purpose, and organize them into searchable folders. It offers a rich, animated UI and persistent chat memory to revisit suggestions later.

> 🔮 Everything is **AI-powered** — currently backed by the **Gemini API**, which provides typed, validated website suggestions in real-time.

---

## 🚀 Vision

Make web discovery and organization effortless, delightful, and deeply personalized — driven by natural language and enhanced by smart metadata, folders, and visual context.

---

## 🧠 Core Flow

1. **User prompts AI** with a topic or request
2. **Gemini API** responds with **animated, streamed website suggestions**
3. Each suggestion includes:
   - ✅ Title, URL, description, favicon
   - 🔍 Suggested folder path (for organizing)
   - 💬 Reason for suggestion
   - 🎞️ First matching video (automatically searched)
   - 📌 Bookmark/save button
4. User can:
   - Copy URL
   - Save suggestion to a folder
   - View video preview
   - Search saved bookmarks in a **folder tree**
   - Revisit past suggestions from **chat history**

---

## 💬 Chat System

- Users can start **multiple chats**, each saved in history
- Revisit past chats to recover suggestions not yet bookmarked
- Ideal for ongoing research, idea collection, or themed browsing

---

## 💡 AI-Powered Features

| Feature                        | Description |
|-------------------------------|-------------|
| 🌐 Website Suggestion         | **Gemini API** recommends websites based on prompt |
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
- **Gemini API** – powering all AI responses
