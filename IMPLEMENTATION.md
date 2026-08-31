# AuthPilot — Master Implementation Tracker
**Product:** AI Prior Authorization Agent for Home Care Agencies (Texas STAR+PLUS focus)
**Stack:** Next.js 14 + TypeScript + Neon PostgreSQL + Claude API + Tailwind + shadcn/ui
**Goal:** First paying customer within 30 days

---

## PHASE 0 — Foundation
- [x] P0.1 — Next.js project scaffold + all dependencies installed (Completed 2026-08-31)
- [x] P0.2 — Neon PostgreSQL database connected + environment variables configured (Completed 2026-08-31)
- [x] P0.3 — Brand identity: logo, colors, typography system created (Completed 2026-08-31)
- [x] P0.4 — Database schema migrations written and applied (Completed 2026-08-31)
- [x] P0.5 — Row-Level Security policies written and tested (Completed 2026-08-31)
- [ ] P0.6 — S3 bucket configured with server-side AES-256 encryption
- [ ] P0.7 — Anthropic HIPAA BAA initiated (note: manual process, flag when done)

## PHASE 1 — AI Extraction Core
- [ ] P1.1 — Payer registry built (star-plus, uhc-texas, molina-texas)
- [ ] P1.2 — Claude extraction prompt engineered and tested against 3 sample documents
- [ ] P1.3 — extract-clinical-data.ts complete with confidence scoring
- [ ] P1.4 — validate-completeness.ts complete
- [ ] P1.5 — generate-pa-form.ts complete (Texas STAR+PLUS)
- [ ] P1.6 — write-justification.ts complete
- [ ] P1.7 — write-appeal-letter.ts complete

## PHASE 2 — Auth + Onboarding
- [ ] P2.1 — NextAuth magic link flow
- [ ] P2.2 — Agency onboarding (create agency, enter NPI, invite coordinators)
- [ ] P2.3 — tRPC router setup (agency, patient, authorization, document, analytics)
- [ ] P2.4 — HIPAA audit log middleware (every DB read/write logged)

## PHASE 3 — Upload + Review UI
- [ ] P3.1 — Document upload UI (drag-drop, S3, progress indicator)
- [ ] P3.2 — Extraction review screen (shows extracted fields, confidence, correction UI)
- [ ] P3.3 — Patient record creation from confirmed extraction
- [ ] P3.4 — Pre-submission PA review screen (generated form preview, approval button)
- [ ] P3.5 — React-PDF: TX STAR+PLUS PA packet generator

## PHASE 4 — Submission + Tracking
- [ ] P4.1 — Twilio Fax API integration
- [ ] P4.2 — Submission router (picks fax vs portal per payer)
- [ ] P4.3 — PA pipeline dashboard (kanban: Draft → Submitted → Pending → Approved → Denied)
- [ ] P4.4 — Inngest jobs: deadline monitor (daily), status checker (4hr), renewal trigger (30d)
- [ ] P4.5 — Mailtrap email alerts for deadlines and status changes

## PHASE 5 — Analytics + Billing
- [ ] P5.1 — Agency analytics dashboard (first-pass rate, time saved, revenue recovered)
- [ ] P5.2 — Stripe subscription setup (Starter $299, Growth $599, Complete $899)
- [ ] P5.3 — Billing portal + upgrade/downgrade flow
- [ ] P5.4 — Monthly PDF report generator (Inngest scheduled job)

## PHASE 6 — Compliance + Launch
- [ ] P6.1 — Aptible deployment pipeline configured
- [ ] P6.2 — BAA template created (agencies sign before access)
- [ ] P6.3 — SOC 2 evidence collection started (in progress, ongoing)
- [ ] P6.4 — First customer walk-in demo prepared

---
## Completed Log
- [2026-08-31] P0.1 — Next.js project scaffold + all dependencies installed (Scaffolded Next.js 14 app with TypeScript and Tailwind, installed all dependencies, created folder structure and TypeScript type definitions)
- [2026-08-31] P0.3 — Brand identity: logo, colors, typography system created (Programmatically generated brand assets with Sharp into public/brand/, built design-tokens.ts, updated tailwind & globals.css theme tokens, created Logo.tsx component, and configured layout.tsx)
- [2026-08-31] P0.2 — Neon PostgreSQL database connected + environment variables configured (Configured DATABASE_URL in .env.local and .env.example with Neon connection pooler, installed @neondatabase/serverless & pg, and built src/lib/db.ts pool)
- [2026-08-31] P0.4 — Database schema migrations written and applied (Created 8 SQL migrations for agencies, users, patients, documents, authorizations, submissions, audit_log, and indexes in database/migrations/, and executed all 8 migrations on live Neon PostgreSQL database)
- [2026-08-31] P0.5 — Row-Level Security policies written and tested (Implemented HIPAA-compliant RLS policies, immutable audit_log policies, document access audit trigger, and verification script in database/test-rls.sql)
