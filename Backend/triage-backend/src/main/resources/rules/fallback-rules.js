var rules = [
  {
    pattern: "urgent|water ingress|leak|flood|damage|complaint|noise|escalate",
    classification: "Complaint",
    priority: "High",
    confidence: 86,
    intent: "Escalating complaint requiring urgent attention.",
    actions: [
      "Dispatch inspection within 48 hours",
      "Notify building manager and insurer",
      "Log in compliance register"
    ],
    draft: "Hi there,\n\nThanks for flagging this. We have logged the complaint as high priority and will arrange an inspection within the next 48 hours. We will confirm a time shortly and keep you updated as the assessment progresses.\n\nRegards,\nJessie Noel D. Lapure"
  },
  {
    pattern: "proposal|quote|tender|new development|services|management proposal",
    classification: "New Client",
    priority: "Medium",
    confidence: 83,
    intent: "Prospective client requesting service proposal.",
    actions: [
      "Route to business development",
      "Send fee schedule and capability statement"
    ],
    draft: "Hi there,\n\nThanks for reaching out. We would be happy to provide a proposal and outline our service scope. I will share our fee schedule and arrange a time to discuss your requirements.\n\nRegards,\nJessie Noel D. Lapure"
  },
  {
    pattern: "login|portal|password|reset|maintenance|repair|support",
    classification: "Support",
    priority: "Low",
    confidence: 80,
    intent: "Resident requesting assistance with support issue.",
    actions: [
      "Verify account and resolve access issue",
      "Confirm resolution with resident"
    ],
    draft: "Hi there,\n\nThanks for letting us know. We will look into this support issue and confirm the next steps shortly. If any additional details are needed, we will reach out.\n\nRegards,\nJessie Noel D. Lapure"
  },
  {
    pattern: "minutes|agm|records|ledger|pet|by-law|certificate",
    classification: "General",
    priority: "Medium",
    confidence: 75,
    intent: "General admin or records request.",
    actions: [
      "Acknowledge request and outline next steps",
      "Prepare requested documents"
    ],
    draft: "Hi there,\n\nThanks for your enquiry. We have logged your request and will prepare the required documents. We will confirm timelines and any fees shortly.\n\nRegards,\nJessie Noel D. Lapure"
  }
];
