// Exam blueprint structure condensed from the official public exam guide.
// Field notes and self-test questions are original study material.

export const architectFoundations = {
  id:"arch-f", code:"CCAR-F", track:"Architect", level:"Foundations",
  name:"Architect — Foundations", fee:"$125", items:60, minutes:120, passScore:720, validity:12,
  examNote:"Scenario-based: 4 of 6 production scenarios are drawn per sitting — <b>Customer Support Resolution Agent</b>, <b>Code Generation with Claude Code</b>, <b>Multi-Agent Research System</b>, <b>Developer Productivity with Claude</b>, <b>Claude Code for Continuous Integration</b>, and <b>Structured Data Extraction</b> — each framing a set of questions around a realistic production context.",
  domains:[
    { id:"d1", n:"01", weight:"27%", weightNum:27, title:"Agentic Architecture & Orchestration",
      objectives:["Design agentic loops and control flow around stop_reason","Orchestrate coordinator/subagent hierarchies","Configure subagent invocation and explicit context passing","Implement enforcement and handoff patterns for multi-step workflows","Apply hooks for tool-call interception and data normalization","Design task decomposition strategies","Manage session state, resumption, and forking"],
      notes:[
        "An agentic loop keeps running while the model calls tools (stop_reason 'tool_use') and stops once it produces a final answer ('end_turn') — loop control should key off this signal, not off parsing the model's natural-language text or an arbitrary iteration cap.",
        "Coordinator/subagent (hub-and-spoke) orchestration: the coordinator owns decomposition, delegation, and result aggregation; subagents don't automatically inherit the coordinator's conversation — context has to be passed to them explicitly.",
        "Narrow, over-specific task decomposition by the coordinator is a real failure mode: a broad topic split into too-narrow subtasks silently loses coverage of whatever wasn't explicitly assigned.",
        "For workflows with hard compliance requirements (e.g., verify identity before a financial action), use programmatic prerequisites/hooks rather than prompt instructions alone — prompt-only compliance has a non-zero failure rate.",
        "Hooks are the deterministic layer: normalize inconsistent data formats coming back from different tools, or block a policy-violating action outright, rather than hoping the model remembers the rule.",
        "Parallel subagent work (multiple delegated calls issued together) beats sequential delegation when subtasks are independent — a straightforward latency win."
      ],
      highYield:"When a coordinator's decomposition silently misses part of a broad topic, the fix is broadening/adjusting the decomposition itself — not the subagents, which executed their (too-narrow) assignments correctly.",
      qs:[
        {stem:"A coordinator agent is asked to research 'trends in remote work' and splits the task into 'remote work software tools,' 'remote work real estate impact,' and 'remote hiring platforms.' The final report never covers employee wellbeing or productivity research, even though every subagent completed its assigned subtask correctly. Most likely root cause?",
         opts:["The synthesis step failed to combine subagent outputs correctly","The coordinator's initial decomposition was too narrow and omitted a major facet of the topic","The subagents used low-quality sources","The context window was too small for the task"],
         answer:1, rationale:"Subagents executed correctly within their assigned scope — the gap traces back to what the coordinator assigned them in the first place."},
        {stem:"A multi-step approval workflow must always verify a manager's sign-off before an agent can issue a large payment, with zero tolerance for skipping this step. Which design guarantees this?",
         opts:["A clear instruction in the system prompt stating sign-off is required first","A programmatic hook or prerequisite gate that blocks the payment tool until sign-off is confirmed","A few-shot example showing the correct order","Relying on the model's general reasoning to sequence it correctly"],
         answer:1, rationale:"Zero-tolerance compliance requirements need deterministic, programmatic enforcement — prompt-based approaches have a non-zero failure rate."}
      ]
    },
    { id:"d2", n:"02", weight:"18%", weightNum:18, title:"Tool Design & MCP Integration",
      objectives:["Design tool interfaces with clear descriptions and boundaries","Implement structured, categorized error responses","Distribute tools across agents and configure tool choice","Integrate MCP servers into Claude Code and agent workflows","Select and apply built-in tools effectively"],
      notes:[
        "Tool descriptions are the model's primary basis for choosing between tools — thin or overlapping descriptions reliably cause misrouting; the fix is sharper, more specific descriptions or splitting/renaming tools, not piling on more examples.",
        "Structured tool errors should distinguish failure types (transient/timeout, invalid input, policy/business rule, permission) and flag whether a retry is worth attempting — a generic 'failed' response gives the agent nothing to act on.",
        "Giving one agent too many tools measurably hurts its tool-selection reliability; scope each agent's toolset tightly to its actual role, with only narrow, high-frequency exceptions crossing role boundaries.",
        "MCP server scope: project-level config for tooling the whole team shares (checked into version control, using env-var references for secrets), user-level config for personal/experimental servers.",
        "MCP resources let an agent see what data/catalogs are available without exploratory tool calls first — reduces wasted round-trips."
      ],
      highYield:"Two similarly-named tools with thin, near-identical descriptions getting confused by the agent is this domain's signature failure — the fix is always sharper/differentiated descriptions, not more examples layered on vague ones.",
      qs:[
        {stem:"An agent has both get_order_status and get_order_details, each described only as 'Gets order information.' It frequently calls the wrong one. Most effective first fix?",
         opts:["Add ten few-shot examples showing correct usage","Rewrite both descriptions to clearly state distinct purposes, inputs, and when to use each versus the other","Delete one of the two tools with no replacement","Increase the model's context window"],
         answer:1, rationale:"Tool descriptions are the model's primary selection signal; sharpening them addresses the root cause directly."},
        {stem:"A tool call fails, and the agent receives only a generic {\"error\":\"failed\"} with no other detail. What does this prevent the agent from doing?",
         opts:["Nothing — the agent can recover fine either way","Making an appropriate recovery decision, since it can't tell if the failure is retryable, a bad input, or a permissions issue","Calling any other tool afterward","Continuing the conversation at all"],
         answer:1, rationale:"Structured error categorization is what enables intelligent recovery decisions; a generic status hides that information."}
      ]
    },
    { id:"d3", n:"03", weight:"20%", weightNum:20, title:"Claude Code Configuration & Workflows",
      objectives:["Configure CLAUDE.md hierarchy, scoping, and modular organization","Create custom slash commands and Skills","Apply path-specific rules for conditional convention loading","Determine when to use plan mode vs. direct execution","Apply iterative refinement techniques","Integrate Claude Code into CI/CD pipelines"],
      notes:[
        "CLAUDE.md hierarchy: user-level config is personal and not shared via version control; project-level config is what the whole team gets. A common failure is putting shared instructions at user-level by mistake, so teammates never receive them.",
        "Splitting a large CLAUDE.md into topic-focused rule files (with path-based scoping) keeps context lean — rules load only for matching files rather than always being present.",
        "Plan mode earns its cost on complex, architecturally significant, or multi-file changes where exploring and designing before committing prevents costly rework; direct execution suits small, well-scoped, well-understood changes.",
        "CI/CD integration needs non-interactive invocation (so the pipeline doesn't hang waiting for input) and structured/machine-parseable output so results can be posted automatically, plus enough project context that automated reviews reflect real team standards.",
        "Iterative refinement works best with concrete examples and, for well-specified transformations, a test-first approach — sharing test failures directly is often more effective than long prose re-explanations."
      ],
      highYield:"A 'new team member isn't getting the shared conventions everyone else has' scenario is a configuration-hierarchy diagnosis question — check project scope vs. user scope, not a model or tooling problem.",
      qs:[
        {stem:"A new engineer joins the team and their Claude Code sessions don't follow the team's established conventions, even though everyone else's do. Most likely cause?",
         opts:["The conventions are defined in a personal, user-scoped configuration file rather than the project-scoped one","The new engineer has a different operating system","The model has a different version for new accounts","Conventions can't be shared across a team at all"],
         answer:0, rationale:"Instructions living at user scope rather than project scope explain why only this one person is missing them."},
        {stem:"A team wants to restructure a monolithic service into modules, touching 30+ files with multiple valid approaches to weigh. Best approach?",
         opts:["Direct execution with a long upfront instruction covering every file","Plan mode first, to explore the codebase and settle on an approach before making changes","Random incremental changes, adjusting as issues appear","Skip planning since the task is well understood already"],
         answer:1, rationale:"Large-scale, architecturally significant, multi-file changes are exactly what plan mode is designed to de-risk before committing."}
      ]
    },
    { id:"d4", n:"04", weight:"20%", weightNum:20, title:"Prompt Engineering & Structured Output",
      objectives:["Design prompts with explicit criteria to reduce false positives","Apply few-shot prompting for consistency and edge-case handling","Enforce structured output via tool use and JSON schemas","Implement validation, retry, and feedback loops","Design efficient batch processing strategies","Design multi-instance and multi-pass review architectures"],
      notes:[
        "Explicit, categorical criteria beat vague guidance ('be conservative,' 'only high-confidence findings') for controlling false-positive rates — specificity about what counts is what actually changes behavior.",
        "Few-shot examples are the strongest lever for consistent formatting and for teaching the model to handle ambiguous edge cases it can then generalize from — stronger than more prose alone.",
        "Enforcing structured output via tool-use with a JSON schema eliminates syntax errors, but not semantic ones (numbers that don't add up, values in the wrong field) — schema compliance and correctness are separate concerns.",
        "Nullable/optional schema fields prevent the model from inventing a value just to satisfy a required field when the source document simply doesn't contain that information.",
        "The batch API trades a possibly long, non-guaranteed processing window for a real cost discount, and doesn't support live mid-request tool calls — fits latency-tolerant bulk work, not blocking or interactive paths."
      ],
      highYield:"'Schema-valid output that's still wrong' (numbers don't reconcile, data in the wrong field) is this domain's reminder that tool-use/JSON-schema enforcement only guarantees syntax, never semantic correctness.",
      qs:[
        {stem:"An extraction pipeline outputs syntactically valid JSON via tool use, but auditors find line items that don't sum to the stated total. What does this reveal?",
         opts:["Tool-use/JSON-schema enforcement failed","Schema enforcement prevents syntax errors but not semantic errors, which need separate validation logic","The model should be replaced with a bigger one","JSON schemas are unreliable and should not be used"],
         answer:1, rationale:"Semantic correctness (values reconciling) is a distinct concern from schema-syntax validity and needs its own check."},
        {stem:"A document extraction system sometimes needs a field the source document doesn't contain. Required fields with no way to indicate 'not present' lead to what problem?",
         opts:["No problem — the model always leaves it blank correctly","The model may fabricate a plausible-looking value to satisfy the required field","The pipeline will simply throw a clear error every time","The schema will fail to validate every time"],
         answer:1, rationale:"A required field with no null/optional escape hatch pressures the model to invent a value rather than say 'not present.'"}
      ]
    },
    { id:"d5", n:"05", weight:"15%", weightNum:15, title:"Context Management & Reliability",
      objectives:["Preserve critical information across long interactions","Design escalation and ambiguity-resolution patterns","Implement error propagation across multi-agent systems","Manage context in large codebase exploration","Design human review workflows and confidence calibration","Preserve information provenance in multi-source synthesis"],
      notes:[
        "Progressive summarization risk: compressing a conversation loses exact numbers, dates, and stated commitments unless those specific facts are pulled into a separate, always-included 'facts' block rather than trusted to survive summarization.",
        "Long inputs suffer a 'lost in the middle' effect — content at the very start and end gets attended to more reliably than content buried in the middle, which matters for how synthesized/aggregated input is ordered.",
        "Escalation should trigger on explicit customer request, a genuine policy gap, or real inability to progress — not on proxies like self-reported model confidence or detected sentiment, which don't reliably track actual case complexity.",
        "Structured, specific error context (what failed, what was tried, what partial results exist) lets a coordinator make a real recovery decision; a generic failure status or silently returning 'no results' as success both remove that ability.",
        "In long codebase-exploration or research sessions, scratchpad files / persisted state let an agent recover key findings instead of re-discovering everything or drifting into vaguer answers over time."
      ],
      highYield:"Miscalibrated escalation logic (escalating easy cases, missing hard ones) traces back to relying on self-reported confidence or sentiment as a complexity proxy — the fix is always explicit criteria with examples. This trap recurs across every certification that touches escalation.",
      qs:[
        {stem:"An agent has to synthesize a long list of tool results from earlier in a conversation. Where should the most critical facts be placed to minimize the risk they're overlooked?",
         opts:["Buried in the middle of the aggregated content","At the very beginning (and optionally repeated at the end), not just the middle","It doesn't matter where facts are placed","Only at the very end"],
         answer:1, rationale:"The 'lost in the middle' effect means content at the start and end is attended to most reliably."},
        {stem:"An agent's escalation logic uses a self-reported confidence score to decide when to hand off to a human, but it escalates easy cases while confidently mishandling hard ones. Correct diagnosis?",
         opts:["Self-reported model confidence is a poor proxy for actual case complexity; explicit escalation criteria with examples are needed instead","The confidence threshold just needs to be tuned slightly higher","This is expected and requires no change","Switch entirely to sentiment-based escalation instead"],
         answer:0, rationale:"Self-reported confidence and sentiment are both unreliable complexity proxies; explicit, example-anchored criteria is the fix this domain consistently rewards."}
      ]
    }
  ]
};
