const now = new Date();
const formatTime = (minutesAgo) => {
  const d = new Date(now.getTime() - minutesAgo * 60000);
  return `Today, ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
}

export const enquiries = [
  {
    id: 'ENQ-2041',
    sender: 'Margaret Whitfield',
    email: 'm.whitfield@harborview-strata.com',
    subject: 'Urgent: Water ingress in basement carpark -- Building 4B',
    preview: 'Following heavy rain last weekend we have significant water pooling near the lift well...',
    body: `Dear Strata Team,

Following the heavy rainfall last weekend, we have noticed significant water pooling near the lift well in the basement carpark of Building 4B (Lot 217, Harborview Residences). Several owners have raised concerns about the smell and the safety of the electrical conduits running along the affected wall.

The previous waterproofing membrane was installed in 2019, and I believe it may still be under warranty. Could you please:

1. Arrange an urgent site inspection within the next 48 hours.
2. Confirm whether this falls under common property repairs.
3. Advise on whether the original contractor (Atlas Waterproofing) should be contacted before we engage anyone else.

Several residents have asked me to escalate this. Please treat as time-sensitive.

Kind regards,
Margaret Whitfield
Chairperson, Owners Corporation SP 89421`,
    get receivedAt() { return formatTime(12) },
    timeAgo: '12m',
    unread: true,
    ai: {
      classification: 'Complaint',
      confidence: 94,
      priority: 'High',
      intent:
        'Owners corporation chair requesting urgent inspection of water ingress in basement carpark; possible warranty claim against original waterproofing contractor.',
      actions: [
        { id: 'a1', label: 'Dispatch site inspection within 48 hours', checked: true },
        { id: 'a2', label: 'Check warranty status with Atlas Waterproofing (2019 install)', checked: true },
        { id: 'a3', label: 'Notify building manager and insurer', checked: false },
        { id: 'a4', label: 'Log under common property -- repairs register', checked: false },
      ],
      draft: `Hi Margaret,

Thank you for flagging this -- I've logged the issue against SP 89421 and marked it as high priority.

We will arrange an inspection of the Building 4B basement within the next 48 hours and confirm a window with you by close of business today. In parallel, I will retrieve the original waterproofing certificate to confirm the warranty position with Atlas Waterproofing before any new contractor is engaged.

I'll keep you posted as the inspector reports back.

Kind regards,
Alex Morgan
Strata Management Consultants`,
    },
  },
  {
    id: 'ENQ-2040',
    sender: 'Daniel Cho',
    email: 'daniel.cho@northpoint.co',
    subject: 'Enquiry -- strata management proposal for new development',
    preview: 'We are finalising the handover of a 64-lot development in Northpoint and evaluating providers...',
    body: `Hello,

We are finalising the handover of a 64-lot mixed-use development in Northpoint (settlement scheduled for August). I'm reaching out to evaluate strata management providers and would like to request a proposal.

Could you share:
- Fee structure for a building of this size
- Sample reporting cadence and digital portal access
- References from comparable mixed-use schemes

Happy to take a call next week.

Best,
Daniel Cho
Development Manager, Northpoint Group`,
    get receivedAt() { return formatTime(60) },
    timeAgo: '1h',
    unread: true,
    ai: {
      classification: 'New Client',
      confidence: 97,
      priority: 'Medium',
      intent: 'Developer requesting strata management proposal for a 64-lot mixed-use scheme settling in August.',
      actions: [
        { id: 'a1', label: 'Route to Business Development -- Sarah Pillay', checked: true },
        { id: 'a2', label: 'Send fee schedule for 50-75 lot mixed-use', checked: true },
        { id: 'a3', label: 'Attach case studies (Quay West, Edgecliff)', checked: false },
      ],
      draft: `Hi Daniel,

Thanks for reaching out -- Northpoint sounds like an excellent fit for our mixed-use practice. I'll loop in Sarah Pillay (Head of Business Development), who looks after new developments of this scale.

She'll send through our standard fee schedule for 50-75 lot schemes, our reporting cadence with portal access, and two recent references that closely match Northpoint's profile.

We'll aim to have a call in your calendar next week.

Regards,
Alex Morgan`,
    },
  },
  {
    id: 'ENQ-2039',
    sender: 'Priya Raman',
    email: 'p.raman@gmail.com',
    subject: 'Question about levy payment portal login',
    preview: "I've tried resetting my password three times but the reset email never arrives...",
    body: `Hi there,

I've been trying to log into the owner portal to pay my quarterly levy but my password reset emails are not coming through. I've checked spam. My lot is 14 at Cedar Grove (SP 71203).

Could someone please reset it manually or let me know what's going on?

Thanks,
Priya`,
    get receivedAt() { return formatTime(130) },
    timeAgo: '2h',
    unread: false,
    ai: {
      classification: 'Support',
      confidence: 89,
      priority: 'Low',
      intent: 'Owner unable to receive password reset email for levy payment portal; requests manual reset.',
      actions: [
        { id: 'a1', label: 'Trigger manual portal password reset', checked: true },
        { id: 'a2', label: 'Verify owner identity against SP 71203 Lot 14', checked: true },
        { id: 'a3', label: 'Log ticket with IT -- investigate reset email deliverability', checked: false },
      ],
      draft: `Hi Priya,

Sorry for the trouble. I've verified your details against Cedar Grove (SP 71203, Lot 14) and triggered a manual reset -- you should receive a fresh activation link within the next few minutes (please check spam one more time as well).

I've also logged a ticket with our IT team to investigate why the automated reset emails are not reaching you.

Best,
Alex`,
    },
  },
  {
    id: 'ENQ-2038',
    sender: "James O'Connell",
    email: 'j.oconnell@oconnelllaw.com.au',
    subject: 'Request for minutes -- AGM 2024, SP 64218',
    preview: 'Acting on behalf of Lot 6. Please provide certified copies of the last AGM minutes and ledger...',
    body: `Dear Strata Manager,

I act on behalf of the owner of Lot 6, SP 64218. Please provide certified copies of the most recent AGM minutes and the lot ledger from 1 January 2024 to date.

Regards,
James O'Connell`,
    receivedAt: 'Yesterday, 4:31 PM',
    timeAgo: '18h',
    unread: false,
    ai: {
      classification: 'General',
      confidence: 91,
      priority: 'Medium',
      intent: 'Solicitor acting for Lot 6 requesting certified AGM minutes and ledger -- likely conveyancing.',
      actions: [
        { id: 'a1', label: 'Issue Section 184 certificate request form', checked: true },
        { id: 'a2', label: 'Prepare AGM minutes & ledger for SP 64218 Lot 6', checked: false },
        { id: 'a3', label: 'Apply standard records fee', checked: false },
      ],
      draft: `Dear Mr O'Connell,

Thank you for your enquiry. To release certified records for Lot 6, SP 64218, please complete the attached Section 184 records request form together with the standard fee schedule.

Once received we will issue the certified AGM minutes and lot ledger within five business days.

Regards,
Alex Morgan`,
    },
  },
  {
    id: 'ENQ-2037',
    sender: 'Helena Voss',
    email: 'h.voss@vossarchitects.com',
    subject: 'Approval request -- facade colour change, Lot 22',
    preview: 'Submitting on behalf of the owner. Drawings and colour swatches attached for committee review...',
    body: `Hello,

Submitting on behalf of the owner of Lot 22, SP 80014. We are seeking by-law approval for a facade colour change. Drawings and Dulux swatches are attached.

Helena Voss
Voss Architects`,
    receivedAt: 'Yesterday, 2:02 PM',
    timeAgo: '21h',
    unread: false,
    ai: {
      classification: 'General',
      confidence: 86,
      priority: 'Low',
      intent: 'Architect requesting committee review of a facade colour change by-law application.',
      actions: [
        { id: 'a1', label: 'Add to next committee meeting agenda', checked: true },
        { id: 'a2', label: 'Circulate drawings to executive committee', checked: false },
      ],
      draft: `Hi Helena,

Thanks for the submission. I've logged the request for Lot 22, SP 80014 and added it to the agenda for the next executive committee meeting (28 May). Drawings and swatches have been circulated to committee members for pre-review.

We'll be in touch following the meeting.

Regards,
Alex`,
    },
  },
  {
    id: 'ENQ-2036',
    sender: 'Tomas Bergstrom',
    email: 'tomas.b@meridianhomes.se',
    subject: 'Noise complaint -- recurring issue, Lot 11',
    preview: 'This is now the fourth incident in six weeks. Late-night gatherings continuing past 1am...',
    body: `Dear Strata,

This is now the fourth incident in six weeks. Late-night gatherings in Lot 11 continue past 1am with music audible through the party wall. Other owners on the floor are equally affected.

Please escalate formally.

Tomas Bergstrom, Lot 9`,
    receivedAt: 'Yesterday, 9:14 AM',
    timeAgo: '1d',
    unread: false,
    ai: {
      classification: 'Complaint',
      confidence: 92,
      priority: 'High',
      intent: 'Recurring noise complaint against Lot 11 -- fourth incident; owner requesting formal escalation.',
      actions: [
        { id: 'a1', label: 'Issue formal Notice to Comply under by-laws', checked: true },
        { id: 'a2', label: 'Log incident in compliance register', checked: true },
        { id: 'a3', label: 'Brief committee chair', checked: false },
      ],
      draft: `Hi Tomas,

I'm sorry this has continued. Given this is the fourth incident, I will issue a formal Notice to Comply to Lot 11 today under by-law 6 (Peace & Quiet) and log all four incidents in the compliance register. The committee chair will be briefed in tomorrow's standing call.

Regards,
Alex`,
    },
  },
  {
    id: 'ENQ-2035',
    sender: 'Yuki Tanaka',
    email: 'yuki.tanaka@brightside.co',
    subject: 'General question -- pet approval process',
    preview: 'Just exchanged contracts on Lot 4. Wanted to understand the process for registering our cat...',
    body: `Hi team,

We just exchanged contracts on Lot 4, SP 90112, and wanted to understand the process for registering our cat. Is there a form? Any restrictions to be aware of?

Thanks,
Yuki`,
    receivedAt: '2 days ago',
    timeAgo: '2d',
    unread: false,
    ai: {
      classification: 'General',
      confidence: 95,
      priority: 'Low',
      intent: 'Incoming owner asking about the pet registration process and by-law restrictions.',
      actions: [
        { id: 'a1', label: 'Send pet application form (PA-04)', checked: true },
        { id: 'a2', label: 'Attach pet by-law summary', checked: true },
      ],
      draft: `Hi Yuki,

Congratulations on the new home. Attached is the pet application form (PA-04) and a one-pager summarising the relevant by-laws for SP 90112 -- cats are permitted with prior written approval, which is typically granted within five business days of submission.

Reach out if anything is unclear.

Best,
Alex`,
    },
  },
];
