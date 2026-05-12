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
13. [Criteria Checklist (Scoring Map)](#13-criteria-checklist-scoring-map)
14. [Demo Scenarios (Copy-Paste)](#14-demo-scenarios-copy-paste)

---

## 1. What it does
Strata AI Triage is an AI-powered prototype designed for property management companies to automate the high-volume task of processing client enquiries. It allows an operator to:
*   **Paste live enquiries:** Input raw text from any email or web form.
*   **Enhance input with AI:** Use the "✨ Enhance with AI" button to automatically clean up and professionalize rough, messy input notes before they are even triaged.
*   **Analyse live:** Instantly classify the category, detect priority, and summarise intent.
*   **Interactive Action Items:** The AI reads the enquiry and extracts a precise, contextual "To-Do" list (e.g., "Dispatch plumber", "Check warranty"). These are presented as interactive checkboxes so the operator can track their progress before finalizing the ticket.
*   **Review AI responses:** Generate dynamic drafts that respect operator-defined tones (Professional, Brief, etc.).

## 2. Tech stack
*   **Frontend:** React 19 + Vite (Modern SPA architecture).
*   **Styling:** Native CSS Variables & Flexbox (No heavy frameworks for a "surgical" feel).
*   **Icons:** Lucide React.
*   **Backend:** Spring Boot 3.5 (Java 17).
*   **AI Model:** `inclusionai/ring-2.6-1t:free` via OpenRouter.

## 3. Folder structure
*   `Frontend/` - React application source, assets, and development config.
*   `Backend/triage-backend/` - Java Spring Boot source code and API logic.
*   `docs/` - Original project documentation and agent profiles.

## 4. Architecture & data flow
1.  **Input:** User pastes text into the "+ New Enquiry" modal.
2.  **Context Injection:** Frontend retrieves the active "Tone" and "Signature" from global state.
3.  **API Call:** A POST request is sent to the Spring Boot `/api/triage` endpoint.
4.  **Backend Processing:** The backend constructs a multi-layered prompt (System + User context).
5.  **AI Analysis:** OpenRouter processes the text and returns a structured JSON payload.
6.  **UI Update:** The frontend populates the "AI Insights" panel with live data, actions, and a draft.

## 5. Setup & run

### Prerequisites
*   Java 17+
*   Node.js 18+
*   OpenRouter API Key

### A. Backend Setup
1.  `cd Backend/triage-backend`
2.  Create a file named `.env-secret-local`.
3.  Add your key exactly like this:
    ```properties
    OPENROUTER_API_KEY=your_key_here
    ```
4.  Run the server: `./mvnw spring-boot:run` (Server runs on port 8080).
    *   *Note: If you modify Java files, restart this process.*

### B. Frontend Setup
1.  `cd Frontend`
2.  Install: `npm install`
3.  Start: `npm run dev`
4.  Open: `http://localhost:5173`

## 6. The four classifications
*   **Support (Amber):** Existing owners needing technical or portal help.
*   **New Client (Green):** Developers/Prospects requesting management proposals.
*   **Complaint (Red):** Formal grievances (Noise, Water Ingress, Safety).
*   **General (Grey):** Routine admin, document requests, or fob replacements.

## 7. Prompt engineering
The backend utilizes **Strict Schema Constraints**. We force the LLM to output valid JSON.
*   **Dynamic Tone:** The prompt is modified live: *"Draft the response using a [SelectedTone] tone."*
*   **Signature Injection:** The AI is instructed to use the specific name/role from your Settings.

## 8. Confidence scoring
The AI provides a numeric certainty value.
*   **> 70%:** Normal display.
*   **< 70%:** UI displays a red "Low confidence" warning and suggests manual review.

## 9. Manual Override — why and how
**Why:** AI is a "co-pilot," not the pilot. Human accountability is mandatory in strata law.
**How:** Clicking "Manual Override" lets the operator fix a category. This action is logged in the "Audit Trail" for transparency.

## 10. Error handling
*   **Network Resilience:** If the backend or API is unreachable, the UI displays an "API call failed" warning without crashing.
*   **Processing State:** While the AI is thinking, the UI shows "Processing..." to prevent operator confusion.

## 11. Automation potential
High-confidence "General" enquiries (like fob requests) could be set to "Auto-Send" in a future production version, allowing staff to focus exclusively on "Complaints" and "New Clients."

## 12. Design decisions
*   **No Chat Bubbles:** Designed as a professional productivity tool (B2B), not a consumer chat app.
*   **Zinc-900 Dark Mode:** Optimized for long-shift operators to reduce eye strain.
*   **Lifted Global Settings:** Settings are applied at the root, ensuring the AI and UI stay in sync globally.
*   **Live Simulation:** The "+ New Enquiry" button was added specifically to meet the "Accept client enquiry as input" requirement.

## 13. Criteria Checklist (Scoring Map)
| Criteria | Implementation in this App |
| :--- | :--- |
| **AI Integration** | OpenRouter integration via Spring Boot REST Client. |
| **Useful Output** | Structured JSON mapping to checkboxes, drafts, and intent. |
| **Code Quality** | Clean separation of React components and Java Services. |
| **Practical Thinking** | Manual override, Audit trails, and Archive-on-Send workflow. |
| **Prompt Design** | Context-aware prompts including Tone and Operator Identity. |
| **Bonus Features** | Confidence bar, Real-time timestamps, and Fallback handling. |

## 14. Demo Scenarios (Copy-Paste)

### Scenario A: Urgent Complaint
**Subject:** STUCK DOOR!
**Body:**
> Hi team, the visitor gate is broken again. Someone is going to get hurt if this isn't fixed today. Marcus, Lot 12.

### Scenario B: General Enquiry
**Subject:** New Keys
**Body:**
> Hello, can I get a quote for a new set of common property keys? I lost my gym fob. Thanks, Sarah.
