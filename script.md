# Professional Video Demo Script: Strata AI Triage

"Hi, my name is Jessie, and in this video I'm going to walk you through a project I built called **Strata AI Triage** — a full-stack application designed for a Strata Management company to automate the high-volume task of processing client enquiries.

I'll show you what problem it solves, how it works end-to-end, and take you through the technical decisions behind every panel on screen.

Whether you're looking at this from a technical or business perspective, I'll make sure the value is clear — so let's jump straight in."

---

## 🖥️ PART 1 — The Problem It Solves
**(Switch to screen share — app is open on the Inbox view)**

"Before I touch anything on screen, let me give you a bit of context. Strata management companies receive dozens of emails every single day — from owners reporting water damage to residents complaining about noise.

Right now, a human operator has to manually read every one of those emails, figure out what type of enquiry it is, decide who should handle it, and write a professional reply from scratch. It is repetitive and slow.

This system uses an AI co-pilot — specifically the **Ring-2.6** model via OpenRouter — to automate that entire triage step. The operator's job becomes review, adjust if needed, and send. That's it. Let me walk you through the interface."

---

## 🖥️ PART 2 — The Layout
**(Hover cursor slowly across the four zones: Sidebar → Inbox → Source → AI Panel)**

"The screen is divided into four focused zones.

1. On the far left — the **Navigation Rail**. This is where you switch views and filter enquiries.
2. Next to it — the **Enquiry List**. This is your live triage queue.
3. In the middle — the **Source View**. This shows the original raw email exactly as it was received.
4. And on the far right — the **AI Insights Panel**. This is the 'brain' of the system where the intelligence lives — the classification, priority, suggested actions, and the AI-written draft."

---

## 🖥️ PART 3 — The Left Navigation Rail
**(Click through Inbox → Archive → back to Inbox slowly)**

"Starting on the left — the navigation rail.

At the top is our branding and the blue **'+ New Enquiry'** button. 

Below that is a live search bar. I can type anything — a sender's name or a subject — and the list filters instantly. You'll also notice the shortcut badge — **Ctrl+K**. If I press it now, the cursor jumps straight into the search.

At the bottom are the **Category Filters**. These represent the four buckets the AI classifies emails into: **Support, New Client, Complaint, and General**.

And down at the very bottom — the operator profile: **Jessie Noel D. Lapure**. This ensures every decision made is attributed and auditable."

---

## 🖥️ PART 4 — Live Demo: The "+ New Enquiry" Flow
**(Click the prominent blue "+ New Enquiry" button)**

"To show you this is a live system, I’ll use the **'+ New Enquiry'** feature. This simulates a brand new email hitting our system. 

I’m going to enter a name, a subject, and I'll just type a very rough, incomplete note in the body: 'gate is broken again fix it Marcus lot 12'."

**[Visual: Enter Name: 'Marcus', Subject: 'Gate Issue'. Type: 'gate is broken again fix it marcus lot 12']**

"Now, watch this. Before I even hit simulate, I can click **'✨ Enhance with AI'**. 

**[Visual: Click '✨ Enhance with AI' button. Wait for text to update.]**

"The AI has just taken that rough note and expanded it into a structured, professional strata enquiry automatically. This is a huge bonus for improving data quality from the very first step. Now I'll hit 'Simulate Enquiry'."

**[Visual: Click 'Simulate Enquiry']**

"Notice the top of the inbox. The enquiry appears instantly. On the right, look at the badge: **'Calling API'**. The Spring Boot backend is sending this live to the AI model right now."

---

## 🖥️ PART 5 — AI Insights & Manual Override
**(AI panel populates. Point to the results)**

"The results are back. The AI has:
1. **Classified** this as a 'Complaint' because it detected a safety hazard.
2. It's **94% Certain** — visualized here by the confidence bar.
3. It extracted a one-sentence **Intent Summary** so I don't have to read the whole email.

But what if I disagree? I can hit **'Manual Override'**.

**[Visual: Click Manual Override, select 'Support', type: 'Handled as maintenance', click Apply]**

"The system records my change. The confidence bar grays out, and a purple **'Operator Override'** badge appears. This keeps the human in control. Also, notice the **Audit Trail** at the bottom—it instantly updated from 'Awaiting operator review' to **'Routing updated'**, documenting my manual intervention."

---

## 🖥️ PART 6 — Actions & Drafts
**(Scroll down to Suggested Actions and Response Draft)**

"Below classification, we have **Suggested Actions**. These are contextual tasks the AI extracted, like 'Dispatch technician' or 'Verify lot ownership'. Every checkbox is interactive, allowing me to track my progress in real-time.

Finally, we have the **Response Draft**. This is a complete, professional email reply. But let's say I want a different tone.

**[Visual: Go to Settings, change Tone to 'Brief', click Save. Go back to Inbox and click 'Generate Draft']**

"Because I changed the global setting to 'Brief', the AI has re-written the response to be short and direct. This isn't just a template; it's a context-aware generation that respects my preferences."

---

## 🖥️ PART 7 — Closing the Loop
**(Click the 'Send' button. Watch it turn green and the enquiry disappear)**

"When I hit **'Send'**, the button confirms the action, and the enquiry is automatically moved to the **Archive**. 

This 'Archive-on-Send' flow ensures the operator stays focused only on what's left to do. 
Every step—from the initial AI classification to my manual override—is logged in the Audit Trail. In a regulated industry like Strata Management, this provides the legal auditability needed to prove how a decision was reached
In conclusion, **Strata AI Triage** is built on **Practical Reasoning**. I chose Java Spring Boot and React to build a resilient, enterprise-ready tool that is ready for Day 1 production.

Thank you for watching, and I look forward to your feedback!"
