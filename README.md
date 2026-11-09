# Product Development, Design & AI Systems: Assignment

Three working product prototypes in one React app. They share a project switcher and a design system, and each has its own brand.

| # | Product | Route | What it shows |
|---|---------|-------|---------------|
| 01 | **Practo for Animals** | `/practo` | Animal-care discovery marketplace: search, results page with filters and sorting, provider details, booking request, business listing and correction forms |
| 02 | **Arcline: AI Education** | `/education` | Landing page for an AI education programme with a validated registration form and a lead pipeline that can be swapped for another backend |
| 03 | **AI Content Studio** | `/studio` | SaaS dashboard that turns a raw idea into an editable carousel and exports PDF/PNG. Includes the finished 7-slide sample and the automation architecture page |

`/` is an overview page linking to all three.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
npm run preview    # serve the production build
```

Requires Node 20+. No environment variables are needed; see `.env.example` for the two optional integrations.

## Stack

React 19 · TypeScript (strict) · Tailwind CSS v4 · React Router 7 · Lucide icons · html-to-image + jsPDF (export). There is no backend. State is local, and drafts, leads and listings persist in `localStorage`.

## Folder structure

```
src/
├─ main.tsx, App.tsx          # router, lazy-loaded project bundles, page titles
├─ index.css                  # Tailwind v4 theme tokens (forest/mint, night/electric, fonts, motion)
├─ components/                # shared UI: ProjectBar, Modal, Field, Toast, SmartImage, BrandIcons
├─ lib/                       # cn/uid helpers, useLocalStorage
├─ pages/                     # HubPage (overview), NotFoundPage
└─ projects/
   ├─ practo-animals/         # index (routes), PractoLayout, HomePage, SearchPage, SearchBar,
   │                          # ProviderCard, ProviderModal, forms, data
   ├─ ai-education/           # EducationPage, HeroVisual, RegistrationForm, leadService, data
   └─ ai-content-studio/
      ├─ ai/                  # provider interface, mockProvider, n8nProvider (future), schema validation
      ├─ pages/               # Dashboard, Create, Editor, Projects, Templates, BrandSettings, Workflow
      ├─ SlideCanvas.tsx      # renders a slide at 1080px; the same component is used for preview and export
      ├─ exporter.ts          # PNG / PDF export
      ├─ store.tsx            # projects + brand settings (localStorage)
      └─ themes.ts, templates.ts, sampleCarousel.ts, types.ts, ui.tsx
```

Each project folder is self-contained and loaded as its own chunk. Shared code lives only in `components/` and `lib/`.

## Design system

One set of foundations (spacing, radius, motion, accessible form fields, modal and toast) with a separate identity per product:

- **Practo for Animals:** off-white `cream`, deep `forest` green, soft `mint` accents, Plus Jakarta Sans, rounded cards with soft shadows, real animal photography (Unsplash).
- **Arcline:** `night` navy/black, `electric` blue → `plasma` violet gradients, Space Grotesk, a grid backdrop and an animated "learning by building" console instead of stock images.
- **Content Studio:** neutral zinc surfaces, violet/indigo accents, Inter, sidebar SaaS layout.

## Product notes

### 1. Practo for Animals
- The hero search sends location, service and free text to `/practo/search` through URL parameters, so results are shareable and survive a refresh.
- The results page filters by city, service type, availability (24×7, emergency, verified), rating and species, and sorts by relevance, rating, distance, review count, newest or fee. There are active-filter chips, a grid/list toggle, a mobile filter drawer and an empty state.
- The provider modal has services, species, hours, call and directions links, a demo booking request and "Suggest a correction" pre-filled with the listing.
- The List Your Business and Submit a Correction forms validate input, return a reference ID and queue submissions in `localStorage`. Sign-in is a demo OTP flow (code `1234`).
- All providers, addresses and phone numbers are fictional sample data.

### 2. Arcline (AI Education)
- **Lead capture journey:** Visitor → Form → Validation → Submission → Lead stored, shown step by step next to the form as the user fills it in.
- `leadService.ts` separates pure validation (`validateLead`) from storage *sinks*. `LocalSink` is active. `WebhookSink` POSTs the lead JSON to `VITE_LEAD_WEBHOOK_URL`, for example a Google Apps Script that appends to Google Sheets, so the UI doesn't change when a backend is connected.
- "Admin preview: view captured leads" shows stored leads and exports them as CSV.
- Choosing a programme on a card pre-fills the form. Curriculum tabs, accordions, showcase filters and the FAQ all work.
- There are no testimonials, placement figures, partnerships or credentials. Programme durations are proposed structure.

### 3. AI Content Studio
- **Create flow (6 steps):** 1 Idea → 2 Research (summary, insights, angle, editable headline, outline) → 3 Content (editable slide copy) → 4 Visual design (palette, typography, layout, elements, three rendered variations) → 5 Editor → 6 Export.
- **Editor:** select, add, duplicate, reorder and delete slides; edit eyebrow, heading, body, example and CTA with length guidance; switch between 5 themes and 4:5 or 1:1 format; live preview; save draft (Ctrl+S); unsaved-changes guard; full-screen platform preview.
- **Export (real):** a multi-page PDF (LinkedIn) and PNGs at 1080×1350 or 1080×1080 (Instagram), rendered in the browser.
- **Sample carousel:** "5 Ways AI Is Transforming Animal Healthcare" (7 slides, Forest Clinic theme) is seeded as a project. Open it from the dashboard, or choose **Use sample** in the create flow.
- **Mock vs real AI:** all generation goes through `CarouselAIProvider` (`ai/types.ts`).
  - `mockProvider.ts` is **active**. It uses predefined, structured content with simulated latency and makes no API calls. The UI labels it "Mock AI".
  - `n8nProvider.ts` is a future integration, used only if `VITE_N8N_WEBHOOK_URL` is set. Its output passes through the same validator (`schema.ts`).
- **AI Workflow page** (`/studio/workflow`): the proposed pipeline (Founder idea → n8n trigger → LLM → structured JSON → validation → template selection → Canva or in-app rendering → editable output → founder approval → PDF/PNG export). It explains why each tool was chosen (Claude/OpenAI, n8n, Canva, Google Sheets, Google Drive), how data moves between them, what is automated versus approved by the founder, how the system scales, and the actual status of each step in this prototype.

## Prototype status

| Capability | Status |
|---|---|
| Search, filters, sorting, modals, forms, validation | Working |
| Lead capture to `localStorage`, CSV export | Working |
| Carousel editor, themes, PDF/PNG export | Working |
| Schema validation of generated content (`ai/schema.ts`) | Working (runs on every generation) |
| AI research and content generation | **Mocked** (template engine, same JSON contract) |
| n8n, Claude/OpenAI, Canva, Google Sheets/Drive | **Not connected**; interfaces and contracts are ready |
| Booking, sign-in OTP, SMS | Demo only |

## Deploying

This is a static SPA (build command `npm run build`, output `dist`). `vercel.json` and `netlify.toml` already include the rewrite to `/index.html`, so deep links like `/studio/editor/...` resolve.
