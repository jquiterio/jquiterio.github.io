---
title: "Facilitate, don't decide: security's role in risk decisions"
summary: "A security function that makes business risk decisions ends up either blocking everything or approving everything. Its real job is to make sure the right people decide with the right information."
---

Security teams are often asked, or offer, to decide. Can we launch with this open finding? Can this supplier have access? Is this architecture acceptable? It is tempting to answer yes or no. Doing so is usually a mistake, and not out of modesty.

## Why security should not own the decision

A risk decision balances a possible loss against a business objective: revenue, a deadline, a customer commitment, a mission. The person accountable for that objective is the one who has to live with the trade-off. When the security function decides instead, one of two things happens.

- It becomes a **blocker**: every residual risk looks unacceptable to someone who does not own the upside, and the business learns to route around security.
- It becomes a **rubber stamp**: under pressure to enable the business, it approves risks it has no authority to accept, and carries the blame when they materialise.

Both outcomes weaken security. The alternative is well established in the standards. ISO/IEC 27001 requires that **risk owners** approve the treatment plan and accept the residual risk (clause 6.1.3). NIST's Cybersecurity Framework 2.0 added a Govern function precisely to place risk strategy and accountability with leadership. The information security manager's role is to make those decisions possible and well informed.

## What facilitation looks like

Facilitation is not neutrality. It means doing the analysis thoroughly and presenting it in terms the decision-maker can act on. A short decision record works well:

| Field | Content |
|---|---|
| Objective | The business outcome at stake, in the owner's words |
| Scenario | What could go wrong, how, and to what |
| Assessment | Likelihood and impact, stated in business terms |
| Options | Mitigate, transfer, avoid, or accept, each with cost and residual risk |
| Recommendation | Security's view, clearly labelled as a recommendation |
| Decision | The option chosen, by whom, and until when |

Two details matter. First, **impact in business terms**: a CVSS score means little to a programme manager; three days of service unavailability during a customer migration means a lot. Second, **a review date**: accepted risks are decisions for a period, not forever.

## When to escalate instead

Facilitation has limits. If a proposed acceptance exceeds the organisation's stated risk appetite, or conflicts with a legal or contractual obligation, the risk owner does not have the authority to accept it alone. The right response is not a veto but escalation to the level that does have that authority, with the same decision record.

That requires a defined risk appetite in the first place. Where none exists, writing one down with senior leadership is often the most valuable thing a security manager can do in their first months.

## The result

When security facilitates rather than decides, three things improve. Decisions are made by people who can be held accountable for them. Security's advice becomes more credible, because it is no longer confused with self-interest. And the organisation builds a written record of what it chose and why, which is exactly what an auditor, an accreditor or a new team member needs.

## Further reading

<ol class="refs">
  <li>ISO/IEC 27001:2022, clause 6.1.3, <em>Information security risk treatment</em>.</li>
  <li>ISO/IEC 27005:2022, <em>Guidance on managing information security risks</em>.</li>
  <li>NIST, <em>The NIST Cybersecurity Framework (CSF) 2.0</em>, 2024.</li>
</ol>
