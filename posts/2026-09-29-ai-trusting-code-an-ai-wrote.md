---
title: "Trusting code an AI wrote"
summary: "AI assistants change how much code a team produces, not what makes code trustworthy. The controls are familiar; what changes is how consistently they must be applied."
---

AI coding assistants now write a large share of new code in many teams. The quality debate tends to swing between two poles: the code is excellent, or the code is dangerous. Both miss the practical point. Code from an assistant should be treated like any contribution from a fast, confident colleague who has read a great deal of public code and carries no accountability for the result.

That framing is useful because the controls already exist. Secure development practice has always assumed that code can be wrong. What changes with AI is volume and speed, so controls that were applied occasionally now have to be applied every time.

## Six controls that carry the weight

**1. Own the tests.** Tests are the specification. When the same assistant writes both the code and its tests, the tests tend to share the code's blind spots. Humans should write or at least define the tests for behaviour that matters, and property-based tests are especially effective at catching the plausible-looking edge-case failures that generated code produces.

**2. Review for intent, not syntax.** Generated code is usually well formatted and idiomatic, which makes superficial review easy and misleading. The reviewer's question is whether the change does what was intended and nothing else. Small, focused changes make that question answerable.

**3. Verify every dependency.** Assistants sometimes suggest packages that do not exist, or that exist under a name close to a popular one. Attackers register such names to catch installations. Every new dependency should be checked against the registry, pinned, and covered by software composition analysis.

**4. Keep secrets and sensitive data out of prompts.** What goes into an assistant may leave the organisation, depending on the product and its configuration. Use the enterprise terms and settings that exclude training on your data, and make the rule explicit for code, credentials and customer information.

**5. Record provenance.** Mark AI-assisted changes, for example with a commit trailer, and keep the software bill of materials current. When a flaw is found later, knowing how code was produced helps to find similar flaws elsewhere.

**6. Keep a human accountable.** The person who merges the change owns it. An assistant cannot be responsible for a production incident; its user can.

## Mapping to the frameworks

None of this requires a new framework. The existing ones already cover it:

| Risk | Control | Reference |
|---|---|---|
| Incorrect or insecure logic | Human-owned tests, review for intent, static analysis | NIST SSDF PW.7, PW.8 · ISO/IEC 27001 A.8.28 |
| Malicious or non-existent dependencies | Registry verification, pinning, composition analysis | NIST SSDF PW.4 · ISO/IEC 27001 A.5.21 |
| Leakage of code or credentials | Approved tools, data rules, secret scanning | ISO/IEC 27001 A.5.14, A.8.12 |
| Unclear origin of code | Commit trailers, SBOM, signed commits | NIST SSDF PS.3 |
| Diffuse accountability | Named owner for every merge | NIST SSDF PO.2 |

## What actually changes

The main change is economic. When writing code becomes cheap, reviewing and verifying it becomes the constraint. Teams that invest in fast test suites, clear ownership and small changes will get the benefit of AI assistance. Teams that relied on the slowness of writing code as an implicit quality gate will lose that gate without noticing.

The goal is not to trust AI-generated code less than human code. It is to stop trusting any code more than the evidence supports.

## Further reading

<ol class="refs">
  <li>NIST SP 800-218, <em>Secure Software Development Framework (SSDF) Version 1.1</em>, 2022.</li>
  <li>ISO/IEC 27001:2022, <em>Information security management systems — Requirements</em>, Annex A.</li>
</ol>
