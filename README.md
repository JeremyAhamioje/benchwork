# Benchwork

A studio site for an engineering and fabrication practice, built around one thing a brochure site cannot do: give a visitor a real cost estimate from the brief they already have.

**Live:** https://benchwork-ten.vercel.app · Next.js · TypeScript · Google Gemini

---

## The idea

Most studio sites end at a contact form, which asks the visitor to do the work of describing their project a second time. Benchwork takes the document they already wrote — a brief, a spec, a scope of work — and returns an estimate from it.

Upload a PDF or Word document, and the estimator extracts the text, sends it to Gemini for analysis against the studio's disciplines and capabilities, and returns a structured estimate the visitor can carry into a booking.

## What is interesting in the build

- **Document extraction happens server-side and format-agnostically.** `unpdf` for PDFs, `mammoth` for Word, behind one `extractDocumentText` interface with a typed `DocumentError`, so the route handles "this file is corrupt" and "this file is 90MB" as different, explainable outcomes rather than a 500.
- **Rate limiting without accounts.** An estimate costs a model call, so it has to be metered — but putting a login in front of a lead-generation tool defeats the tool. The limiter combines a session cookie with a client fingerprint and tracks allowance per visitor, so a first estimate is free and abuse is still bounded.
- **The model is optional, not assumed.** `isGeminiConfigured` gates the feature, so the site deploys and runs correctly with no API key — the estimator simply does not offer itself rather than erroring at the visitor.
- **Uploads are capped and sanitised** (`MAX_UPLOAD_BYTES`, `sanitiseText`) before any text reaches the model.
- Input is validated with **Zod** at the boundary, so malformed requests fail with a message instead of propagating.

## Stack

Next.js (App Router) · TypeScript · `@google/genai` · `unpdf` + `mammoth` for document parsing · Zod · Motion · Tailwind

## Running locally

```bash
cp .env.example .env.local   # add your Gemini API key
npm install
npm run dev
```

The site runs without a key — the estimator is simply hidden.

---

Built by [Jeremy Ahamioje](https://github.com/JeremyAhamioje).
