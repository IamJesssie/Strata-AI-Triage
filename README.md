# Strata AI Triage

## Table of contents

1. [What it does](#1-what-it-does)
2. [Tech stack](#2-tech-stack)
3. [Folder structure](#3-folder-structure)
4. [Architecture & data flow](#4-architecture--data-flow)
5. [Setup & run](#5-setup--run)
6. [The four classifications](#6-the-four-classifications)
7. [Prompt engineering](#7-prompt-engineering)
8. [Confidence scoring](#8-confidence-scoring)
9. [Manual Override — why and how](#9-manual-override--why-and-how)
10. [Error handling](#10-error-handling)
11. [Automation potential](#11-automation-potential)
12. [Design decisions](#12-design-decisions)
13. [Scoring map](#13-scoring-map)

---

## 1. What it does
Strata AI Triage is an AI-powered email triage application designed for property management companies. It automates the process of reading, categorizing, and drafting responses to incoming emails, shifting the human operator's role from "creator" to "reviewer and approver".

## 2. Tech stack
*   **Frontend:** React, Vite, Tailwind CSS, shadcn/ui components.
*   **Icons:** Lucide React.
*   **AI Model:** `inclusionai/ring-2.6-1t:free` (via OpenRouter).
*   **Language:** TypeScript.

## 3. Folder structure
*   `Frontend/`
    *   `src/app/` - Main application logic, layouts, and components.
        *   `components/` - UI elements (shadcn) and custom application components (NavRail, AIInsights, etc.).
    *   `src/styles/` - Tailwind configuration and CSS variables.
    *   `public/` - Static assets.
*   `Backend/` - (Placeholder for backend services).

## 4. Architecture & data flow
1.  **Ingestion:** Email arrives.
2.  **Processing:** The backend uses the OpenRouter API to analyze the email.
3.  **Classification:** The AI model assigns a category, priority, and confidence score.
4.  **Action & Drafting:** The AI suggests actions and drafts a response.
5.  **Review:** The operator reviews the AI's insights in the frontend.
6.  **Action:** The operator can override the classification or send the drafted response.

## 5. Setup & run
1. Navigate to the `Frontend` directory: `cd Frontend`
2. Install dependencies: `npm install`
3. Create a `.env.local` file in the `Frontend` directory and add your OpenRouter API key:
   ```
   VITE_OPENROUTER_API_KEY=your_api_key_here
   ```
4. Start the development server: `npm run dev`

## 6. The four classifications
*   **Support (Amber):** Existing owner/resident needing help.
*   **New Client (Green):** Developer or prospect asking about services.
*   **Complaint (Red):** Formal or escalating grievance.
*   **General (Grey):** Routine admin, document requests.

## 7. Prompt engineering
The application relies on carefully crafted prompts sent to the `inclusionai/ring-2.6-1t:free` model to ensure accurate categorization, entity extraction, and professional tone matching.

## 8. Confidence scoring
The AI assigns a confidence score (0-100%) to its classification. Scores below 70% trigger a visual warning in the UI, prompting the operator for manual review.

## 9. Manual Override — why and how
**Why:** To ensure human accountability and correct AI mistakes, acting as a feedback loop for future model training.
**How:** A dropdown in the AI Insights panel allows operators to change the category. This action is recorded in the Audit Trail and disables the AI confidence bar.

## 10. Error handling
The UI is designed to handle missing data gracefully (e.g., using `ImageWithFallback.tsx`) and clearly display AI uncertainty.

## 11. Automation potential
While currently a "Human-in-the-loop" system, high-confidence routines (e.g., general document requests) could eventually be fully automated.

## 12. Design decisions
*   **Dark Mode (`zinc-900`):** Reduces eye strain for operators.
*   **No Chat Bubbles:** Maintains a professional, B2B tool aesthetic.
*   **Visible Confidence:** Builds trust through transparency.
*   **Archive-on-Send:** Keeps the inbox clean and focused.

## 13. Scoring map
*   `90-100%`: High confidence, standard review.
*   `70-89%`: Medium confidence, careful review advised.
*   `<70%`: Low confidence, explicit warning displayed to operator.
