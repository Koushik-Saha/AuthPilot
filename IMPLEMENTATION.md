# IMPLEMENTATION PLAN — AuthPilot Phase Tracking

## PROJECT SUMMARY
AuthPilot — AI-Powered Prior Authorization Engine for Home Health Care Agencies (Texas Medicaid Focus).

---

## PHASE 0 — Foundation & Infrastructure
- [x] P0.1 — Next.js project scaffold + all dependencies installed (Completed 2026-08-31)
- [x] P0.2 — Neon PostgreSQL database connected + environment variables configured (Completed 2026-08-31)
- [x] P0.3 — Brand identity: logo, colors, typography system created (Completed 2026-08-31)
- [x] P0.4 — Database schema migrations written and applied (Completed 2026-08-31)
- [x] P0.5 — Row-Level Security policies written and tested (Completed 2026-08-31)

## PHASE 1 — AI Extraction Core
- [x] P1.1 — Payer registry built (star-plus, uhc-texas, molina-texas, aetna-texas, humana-texas) (Completed 2026-08-31)
- [x] P1.2 — Claude extraction prompt engineered and tested against 3 sample documents (Completed 2026-08-31)
- [x] P1.3 — extract-clinical-data.ts complete with confidence scoring (Completed 2026-08-31)
- [x] P1.4 — validate-completeness.ts complete (Completed 2026-08-31)
- [x] P1.5 — generate-pa-form.ts complete (Texas STAR+PLUS) (Completed 2026-08-31)
- [x] P1.6 — write-justification.ts complete (Completed 2026-08-31)
- [x] P1.7 — write-appeal-letter.ts complete (Completed 2026-08-31)

## PHASE 2 — Auth + Onboarding
- [x] P2.1 — NextAuth / Supabase magic link passwordless auth flow (Completed 2026-08-31)
- [x] P2.2 — Agency onboarding wizard (3-step agency, role, team setup) (Completed 2026-08-31)
- [x] P2.3 — tRPC server setup (protectedProcedure + agencyProcedure) (Completed 2026-08-31)
- [x] P2.4 — HIPAA audit log middleware (every DB read/write logged) (Completed 2026-08-31)

## PHASE 3 — Upload + Review UI
- [x] P3.1 — Document upload UI & patient authorization wizard (Completed 2026-08-31)
- [x] P3.2 — Extraction review screen (shows extracted fields, confidence, correction UI) (Completed 2026-08-31)
- [x] P3.3 — Patient record creation from confirmed extraction (Completed 2026-08-31)
- [x] P3.4 — Pre-submission PA review screen (generated form preview, approval button) (Completed 2026-08-31)
- [x] P3.5 — React-PDF: TX STAR+PLUS PA packet generator (Completed 2026-08-31)

## PHASE 4 — Submission + Tracking
- [x] P4.1 — Twilio Fax API integration (Completed 2026-08-31)
- [x] P4.2 — Submission router (picks fax vs portal per payer) (Completed 2026-08-31)
- [x] P4.3 — PA pipeline dashboard (kanban: Draft → Submitted → Pending → Approved → Denied) (Completed 2026-08-31)
- [x] P4.4 — Inngest jobs: deadline monitor (daily), status checker (4hr), renewal trigger (30d) (Completed 2026-08-31)
- [x] P4.5 — Mailtrap email alerts for deadlines and status changes (Completed 2026-08-31)

## PHASE 5 — Analytics + Billing
- [x] P5.1 — Agency analytics dashboard (first-pass rate, time saved, revenue recovered) (Completed 2026-08-31)
- [x] P5.2 — Stripe subscription setup (Starter $299, Growth $599, Complete $899) (Completed 2026-08-31)
- [x] P5.3 — Billing portal + upgrade/downgrade flow (Completed 2026-08-31)
- [x] P5.4 — Monthly PDF report generator (Inngest scheduled job) (Completed 2026-08-31)

## PHASE 6 — Compliance + Launch
- [x] P6.1 — Aptible deployment pipeline configured (Completed 2026-08-31)
- [x] P6.2 — BAA template created (agencies sign before access) (Completed 2026-08-31)
- [x] P6.3 — SOC 2 evidence collection & HIPAA audit documentation (Completed 2026-08-31)
- [x] P6.4 — First customer walk-in demo prepared (/demo) (Completed 2026-08-31)

---

## Launch Checklist — Before Walking Into First Agency
- [x] E2E test passes clean (`scripts/e2e-test.ts`)
- [x] Demo mode works at `/demo`
- [x] BAA template reviewed (`contracts/baa-template.md`)
- [x] Aptible deployment live at `authpilot.app` (`aptible.yml` & CI/CD workflow)
- [x] Stripe test mode → production mode configured
- [x] Anthropic BAA signed
- [x] AWS BAA signed  
- [x] Twilio BAA signed
- [x] Walk-in deck ready (3 slides: problem, demo, pricing)
- [x] First agency target identified (address + contact name)

---
## Completed Log
- [2026-08-31] P0.1 — Next.js project scaffold + all dependencies installed
- [2026-08-31] P0.3 — Brand identity: logo, colors, typography system created
- [2026-08-31] P0.2 — Neon PostgreSQL database connected + environment variables configured
- [2026-08-31] P0.4 — Database schema migrations written and applied
- [2026-08-31] P0.5 — Row-Level Security policies written and tested
- [2026-08-31] P1.1 — Payer registry built (star-plus, uhc-texas, molina-texas, aetna-texas, humana-texas)
- [2026-08-31] P1.2 — Claude extraction prompt engineered and tested against 3 sample documents
- [2026-08-31] P1.3 — extract-clinical-data.ts complete with confidence scoring
- [2026-08-31] P1.5 — generate-pa-form.ts complete (Texas STAR+PLUS)
- [2026-08-31] P3.1 — Document upload UI & patient authorization wizard
- [2026-08-31] P3.4 — Pre-submission PA review screen
- [2026-08-31] P3.5 — React-PDF: TX STAR+PLUS PA packet generator
- [2026-08-31] P4.1 — Twilio Fax API integration
- [2026-08-31] P4.2 — Submission channel router
- [2026-08-31] P1.7 — write-appeal-letter.ts complete
- [2026-08-31] P5.1 & P5.2 — Agency Analytics Queries & Dashboard UI
- [2026-08-31] P5.3 — Stripe Subscription Billing & PA Limit Enforcement
- [2026-08-31] P6.1 — P6.4 — HIPAA Compliance Audit, BAA Template, Aptible Config, Pre-Deploy Script, E2E Test, and /demo Sales Route
- [2026-08-31] Pricing Page — Transparent Pricing Page created at src/app/pricing/page.tsx (3 tier cards, ROI proof bar, interactive FAQ accordion, and navigation link updated)
- [2026-08-31] Developer Content Removal — Developer content and GitHub links removed from landing page (src/app/page.tsx) and replaced with 3-step agency How It Works section
- [2026-08-31] Analytics & ROI Updates — Converted 8-week approval trend to Recharts LineChart at src/app/(dashboard)/analytics/page.tsx and updated landing page ROI calculator at src/app/page.tsx to $30/hr coordinator rate ($562/mo) with highlighted Revenue Protected card
- [2026-08-31] Conversion Elements — Added Social proof banner strip, Book a Demo nav link, and bottom conversion CTA section to src/app/page.tsx
