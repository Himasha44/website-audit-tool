# Website Audit Tool

A lightweight AI-powered website audit tool built for the **AI-Native Software Engineer – 24 Hour Assignment**. It accepts a single URL, extracts factual webpage metrics, then generates structured AI insights and prioritized recommendations.

## Submission Links

- **GitHub Repository:** https://github.com/Himasha44/website-audit-tool
- **Deployed Tool:** https://weblens-ai-website-audit.vercel.app/

## What it does

- Accepts one webpage URL
- Extracts factual metrics from the HTML
- Separates hard metrics from AI-generated analysis
- Produces structured insights for:
  - SEO structure
  - Messaging clarity
  - CTA usage
  - Content depth
  - UX / structural concerns
- Returns 3–5 prioritized recommendations
- Exposes prompt logs:
  - system prompt
  - user prompt
  - raw model output

## Tech stack

### Frontend
- React
- Vite
- Plain CSS

### Backend
- Node.js
- Express
- Axios
- Cheerio
- OpenAI SDK

## Architecture overview

```text
React UI
  ↓
POST /api/analyze
  ↓
Scraper Service (Axios + Cheerio)
  ↓
Structured metrics + content snapshot
  ↓
AI Service (OpenAI)
  ↓
Structured insights + prioritized recommendations + prompt logs
```

## Folder structure

```text
website-audit-tool/
  client/
    src/
      components/
      services/
      App.jsx
      styles.css
  server/
    src/
      routes/
      services/
        scraper/
        ai/
      utils/
      app.js
  prompt-logs/
  README.md
```

## How to run locally

### 1. Clone or extract the project
Open two terminals: one for the backend and one for the frontend.

### 2. Start the backend
```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```env
PORT=4001
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini
```

Then run:

```bash
npm run dev
```

### 3. Start the frontend
In another terminal:

```bash
cd client
npm install
npm run dev
```

Open the local Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

## API response shape

```json
{
  "url": "https://example.com",
  "fetchedAt": "2026-03-25T00:00:00.000Z",
  "metrics": {},
  "contentSnapshot": {},
  "insights": {},
  "recommendations": [],
  "logs": {}
}
```

## AI design decisions

1. **Strict separation of scraping and AI analysis**  
   The scraper extracts deterministic metrics and content first. The AI layer only analyzes the structured input.

2. **Grounded prompt design**  
   The system prompt instructs the model to use only supplied facts and avoid invented claims.

3. **Structured output**  
   The AI is asked to return JSON with five insight categories and prioritized recommendations.

4. **Prompt transparency**  
   The API returns the system prompt, user prompt, and raw model output so the orchestration is visible.

## Trade-offs

- **CTA detection uses heuristics**  
  CTA count is based on buttons and anchor text patterns such as “contact”, “book”, “get started”, and similar phrases.

- **Static HTML parsing only**  
  This version uses Axios + Cheerio, so JavaScript-heavy pages may not render all dynamic content.

- **Single-page scope only**  
  The assignment explicitly focuses on one page. No site crawling is included.

- **No database or persistence**  
  Results are computed per request and returned directly.

## What I would improve with more time

- Add Playwright for pages that rely heavily on client-side rendering
- Improve CTA classification using DOM position and styling heuristics
- Add lightweight scoring summaries next to recommendations
- Add export to JSON / PDF
- Add snapshot diffing to compare two versions of the same page

## Prompt logs

Sample prompt logs are included in the `prompt-logs/` folder. The live UI also renders the prompt logs returned by the backend.

## Notes

- If no OpenAI API key is provided, the app still returns factual metrics and shows a clear fallback message for AI sections.
- This project is intentionally kept simple and practical to match the assignment scope.
