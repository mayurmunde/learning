// Exam blueprint structure condensed from the official public exam guide.
// Field notes and self-test questions are original study material.

export const architectProfessional = {
  id:"arch-p", code:"CCAR-P", track:"Architect", level:"Professional",
  name:"Architect — Professional", fee:"$175", items:63, minutes:120, passScore:720, validity:12,
  domains:[
    { id:"d1", n:"01", weight:"17%", weightNum:17, title:"Solution Design & Architecture",
      objectives:[
        "Turn an ambiguous business ask into a scoped Claude solution",
        "Design the end-to-end loop: input → processing → output → feedback",
        "Choose between workflow, agentic, and augmented-LLM patterns",
        "Design multi-agent orchestration where it's actually warranted",
        "Decompose complex problems before picking an architecture",
        "Tie every design choice to a business value pillar"
      ],
      notes:[
        "<b>Augmented LLM</b> — one call plus retrieval/tools/memory. Default starting point for bounded, mostly single-turn tasks.",
        "<b>Workflow</b> — fixed code paths chaining LLM calls (chaining, routing, parallelization, orchestrator–worker, evaluator–optimizer). Use when the steps and their order are knowable in advance.",
        "<b>Agentic</b> — Claude plans and sequences its own tool calls in a loop. Reach for this only when steps genuinely can't be predetermined; it costs more in latency, tokens, and control.",
        "<b>Escalation order matters</b>: start at the simplest pattern that solves the task, and only add complexity (workflow → agent, single agent → multi-agent) when the simpler version demonstrably fails.",
        "<b>Multi-agent orchestration</b> earns its cost on parallelizable, independent subtasks — coordination overhead and context-sharing between agents is real, so it isn't free scaling.",
        "<b>Decomposition</b> comes before pattern selection: split the ambiguous problem into bounded subtasks with clear inputs/outputs, and decide what stays deterministic code vs. what Claude should own.",
        "<b>Business value pillars</b> — efficiency, transformation, productivity, cost, performance SLAs. Exam scenarios often hinge on picking the *right* pillar to justify a decision, not just a plausible one."
      ],
      highYield:"When a scenario describes a task that could be solved with a fixed sequence of steps, the correct answer is almost never the fanciest architecture — it's the simplest one that still meets the requirement.",
      qs:[
        {stem:"A team wants Claude to run an onboarding process where the number and order of steps varies significantly case to case. Which pattern best fits?",
         opts:["A fixed prompt-chaining workflow with hardcoded steps","A single augmented-LLM call with a very large system prompt","An agentic loop where Claude plans and sequences its own tool calls","A rules engine with no LLM involvement"],
         answer:2, rationale:"Variable, unpredictable step count and order is the defining signal for an agentic pattern over a fixed workflow — the workflow (A) assumes known steps, and a single call (B) can't hold multi-step state."},
        {stem:"A proposed Claude system would fully automate a report an analyst currently builds by hand in 2 hours/week. Which value pillar anchors this pitch to stakeholders?",
         opts:["Transformation — a net-new capability","Efficiency — time and cost saved on an existing task","Performance SLA — latency and uptime targets","Productivity — augmenting judgment-heavy work"],
         answer:1, rationale:"Automating an existing repetitive task is squarely an efficiency gain, not a new capability (transformation) or augmentation of human judgment (productivity)."},
        {stem:"A fixed three-step workflow (extract → summarize → format) needs a variable number of extraction passes depending on unpredictable document length. What's the most appropriate change?",
         opts:["Keep the fixed workflow and just increase the context window","Replace the fixed chain with an agentic loop that decides how many extraction passes to run","Add a fourth hardcoded step for 'long documents'","Switch to a bigger model so one pass is always enough"],
         answer:1, rationale:"A data-dependent, unpredictable step count is the same agentic signal as before — this time framed as a workflow outgrowing its fixed shape as requirements evolve."},
        {stem:"While decomposing a claims-processing system, an architect finds a subtask that is deterministic, rule-based, and has zero tolerance for ambiguity: a payout calculation from a fixed formula. What should own this subtask?",
         opts:["Claude, using a very detailed system prompt","Claude, using chain-of-thought to show its work","Deterministic code outside the model, with Claude orchestrating around it","A human reviewer for every calculation"],
         answer:2, rationale:"Zero-ambiguity-tolerance, formula-based logic belongs in deterministic code, not the model — this is the core 'what should Claude own' judgment decomposition is meant to produce."}
      ]
    },
    { id:"d2", n:"02", weight:"13%", weightNum:13, title:"Claude Models, Prompting & Context Engineering",
      objectives:[
        "Pick a model based on real capability/cost/latency trade-offs, not habit",
        "Design system prompts, templates, and guardrails deliberately",
        "Apply zero-shot, few-shot, and chain-of-thought where each earns its cost",
        "Manage the context window and token budget on purpose",
        "Reuse prompts through caching, modular blocks, and Skills"
      ],
      notes:[
        "Match model size to task complexity — the biggest model is not the default answer; high-volume, low-complexity tasks usually want the fastest/cheapest model that clears the accuracy bar.",
        "System prompts carry the stable role, policy, and output-format instructions; structure them with clear sections so instructions, context, examples, and format don't blur together.",
        "<b>Zero-shot</b> for simple, well-specified tasks. <b>Few-shot</b> (2–5 examples) to anchor format or tone the model keeps missing. <b>Chain-of-thought</b> only for genuinely multi-step reasoning — it adds latency and tokens, so it's a cost, not a free upgrade.",
        "Context window strategy: put static, reusable content (system prompt, policy docs, tool definitions) <b>first</b>, and dynamic per-request content last — this is also what makes the prefix cacheable.",
        "<b>Prompt caching</b> reuses an unchanged prefix across calls to cut both latency and cost — it's the standard answer whenever a scenario has large static content plus small varying input.",
        "<b>Skills</b> and modular prompts let you load specialized instructions on demand instead of stuffing every possible instruction into every call."
      ],
      highYield:"Pattern to recognize instantly: 'same large static content every request + short varying user input + cost/latency concern' → the answer is order-stable-content-first and enable prompt caching. This exact shape repeats across exam scenarios.",
      qs:[
        {stem:"A support-ticket classifier must choose exactly one of 5 fixed categories under a strict low-latency budget. Best combination?",
         opts:["The most capable model with chain-of-thought enabled","A smaller/faster model with one few-shot example per category","The most capable model with zero-shot instructions only","A smaller/faster model with a very long explanatory system prompt and no examples"],
         answer:1, rationale:"Fixed, low-complexity classification under a latency budget favors a fast model anchored by a few-shot example per class; chain-of-thought adds latency the task doesn't need."},
        {stem:"An agent sends the same 15,000-token policy manual on every call, followed by a short varying question. Cost per request is the concern. First move?",
         opts:["Summarize the manual down to 500 tokens","Move the manual after the user's question","Keep the manual first, unchanged, and enable prompt caching","Switch every request to the smallest available model"],
         answer:2, rationale:"A stable prefix ahead of varying content is exactly what prompt caching is for — it cuts cost without discarding policy coverage, unlike summarizing or blind downsizing."},
        {stem:"A creative-writing assistant needs a consistent character voice across a long multi-turn conversation, and history is approaching the model's context limit. Best approach?",
         opts:["Let the conversation truncate from the oldest turns with no strategy","Periodically summarize earlier turns into a compact running summary and drop the raw turns","Switch to a bigger-context model and never manage the window","Restart the conversation from scratch every 10 turns"],
         answer:1, rationale:"Deliberate summarization/compaction preserves key facts under a token budget; unmanaged truncation and full resets both lose continuity, and a bigger context window just delays the same problem."},
        {stem:"A prompt template separates &lt;instructions&gt;, &lt;context&gt;, and &lt;examples&gt; with explicit tags. Why does this matter?",
         opts:["It looks more professional to stakeholders","It reduces token count significantly","It gives the model unambiguous structure to distinguish instructions from content, reducing the risk content is misread as an instruction","It's required by the Claude API"],
         answer:2, rationale:"Explicit structure disambiguates instructions from data for the model — the same underlying principle that defends against content being misread as commands."}
      ]
    },
    { id:"d3", n:"03", weight:"19%", weightNum:19, title:"Integration",
      objectives:[
        "Evaluate tool/agent configuration for unnecessary capability",
        "Analyze auth/authz setups for security gaps",
        "Weigh accuracy-latency trade-offs and justify the configuration",
        "Plan observability and monitoring that holds up at scale",
        "Design RAG pipelines: chunking, indexing, retrieval strategy",
        "Choose the right connection protocol (MCP, API/CLI, agent-to-agent)",
        "Decide progressive discovery vs. loading everything into context upfront"
      ],
      notes:[
        "<b>Least privilege on tools</b> — an agent should only hold the tools its role actually requires. The fix for a risky, unused, or overbroad tool is removing it, not logging or confirming it. This is the single most-repeated judgment pattern in the domain.",
        "Auth/authz review means checking who or what can call which tool at what scope — overly broad API keys and missing per-user scoping are the classic gaps.",
        "Accuracy-latency trade-offs must be justified against the task's real accuracy bar and SLA — more retrieval or more tool calls can buy accuracy, but only spend that cost where it's needed.",
        "Observability at scale means structured logging, tracing, sampling, and alerting on anomalies (e.g. a spike in tool errors) — not just being able to debug one request by hand.",
        "<b>RAG chunking</b> should follow document structure (by section/clause) rather than fixed token counts, especially for tasks that need to compare across sections. Retrieval strategy should match data shape: keyword/exact-match for IDs and codes, dense/semantic search for meaning-based queries, hybrid when both matter.",
        "A stale or broken index is the most common cause of a RAG system suddenly giving <i>confident but wrong</i> answers right after a data refresh — check retrieval before suspecting the model.",
        "<b>MCP</b> for standardized, reusable tool/data connections across agents; direct <b>API/CLI</b> for a one-off integration; <b>agent-to-agent</b> patterns for multi-agent coordination.",
        "<b>Progressive discovery</b> (load tool/resource definitions on demand) beats a monolithic context stuffed with every possible tool as the number of integrations grows — it keeps token usage and tool-selection error rate down."
      ],
      highYield:"'Capability bloat' — an agent holding more tools/permissions than its task needs — raises error rate and risk even if none of the extra tools are ever misused. The exam consistently rewards scoping down over adding monitoring on top.",
      qs:[
        {stem:"A document-QA agent has a 'send_email' tool that's never actually used, added 'in case it's needed later.' Security review flags it. Correct response?",
         opts:["Leave it — an unused tool carries no risk","Remove the tool until there is an actual use case","Add a confirmation step before any email send","Restrict the tool to admin users only"],
         answer:1, rationale:"Least privilege means not holding capability that isn't needed yet, regardless of whether it's ever misused — remove it, don't merely guard it."},
        {stem:"A RAG system over long legal contracts answers poorly when a question requires comparing clauses across different sections of the same document. Chunking is fixed-size (500 tokens, no overlap). Most likely fix?",
         opts:["Switch to a larger embedding model","Increase top-k retrieved chunks only","Use structure-aware chunking (by clause/section) with overlap","Lower the similarity threshold for retrieval"],
         answer:2, rationale:"Cross-section comparison needs chunks that preserve document structure and relationships; more of the same fragmented chunks (B) or a bigger embedding model (A) doesn't fix a structural chunking problem."},
        {stem:"Two teams both need the same internal ticketing tool available to their independent Claude agents. What minimizes duplicated work and drift between the two implementations?",
         opts:["Each team writes its own custom API wrapper independently","Expose the tool once via a standardized protocol (e.g., MCP) both agents can connect to","Give both teams direct database credentials","Have one team's agent call the other team's agent informally"],
         answer:1, rationale:"A standardized, reusable connection point is exactly what protocols like MCP are for when multiple independent agents need the same tool."},
        {stem:"A dashboard shows p50 latency is normal but p99 latency has spiked sharply this week with no code changes deployed. Most useful next diagnostic step?",
         opts:["Assume it's noise and ignore it","Roll back to last week's code even though nothing changed","Investigate what's different about the slow-tail requests specifically (input size, a specific tool call, a downstream dependency)","Switch to a faster model immediately"],
         answer:2, rationale:"A tail-only regression with no code change points to something specific to those requests, not a general model or code issue — the fix starts with characterizing the slow tail, not rolling back or swapping models blind."}
      ]
    },
    { id:"d4", n:"04", weight:"16%", weightNum:16, title:"Evaluation, Testing & Optimization",
      objectives:[
        "Define accuracy, latency, cost, safety, and security metrics upfront",
        "Design eval datasets using mixed grading methods",
        "Run A/B tests and iterate from measured deltas",
        "Diagnose failures to the right layer of the system",
        "Optimize token usage, latency, and cost-performance trade-offs",
        "Monitor for regressions after deploy, not just at launch"
      ],
      notes:[
        "Evals are acceptance criteria, defined <i>before</i> building — not a check performed after the fact. 'No eval set yet' is never the reason to skip evaluation; even a small one beats none.",
        "Mix grading methods to the metric: code-graded (exact match/regex) for structured output, human-graded rubrics for open-ended quality, model-graded (LLM-as-judge) to scale review — use the cheapest method that stays reliable for that metric.",
        "A/B test prompt, model, or architecture variants against the same fixed eval set so deltas are attributable to the change, not the test.",
        "Diagnosing a failure means tracing it to the right layer — prompt failure, hallucination, wrong-model-for-task, or a broken retrieval/context step — before 'fixing' something that wasn't actually broken.",
        "When something regresses right after a specific change (a doc refresh, a prompt edit, a model swap), check <i>that</i> change first — don't default to assuming the model itself silently changed.",
        "Aggregate accuracy can hide regressions in specific slices — check safety and edge-case subsets separately before a broad rollout, even when the headline number looks fine.",
        "Cost/latency levers, in rough order of blast radius: prompt caching, trimming unneeded context, batching, then — only if still needed — stepping down model size."
      ],
      highYield:"Symptom-to-cause discipline: match a regression to whatever changed most recently in the pipeline (data, prompt, model, retrieval index) rather than jumping to the most dramatic explanation. This exact reasoning appears repeatedly.",
      qs:[
        {stem:"A team wants to catch quality regressions before every deploy for a new open-ended summarization feature, but has no labeled dataset yet. Most defensible first step?",
         opts:["Ship without evals since none exist yet","Build a small rubric-graded eval set (human or LLM-judge) against defined criteria","Wait for enough production complaints to know what to test","Track only latency and cost, since quality is subjective"],
         answer:1, rationale:"Even a small, rubric-graded eval set beats shipping with none — 'subjective' quality can still be graded consistently against defined criteria."},
        {stem:"After a model version swap, aggregate eval accuracy stayed flat and cost dropped 40%. What should happen before a full rollout?",
         opts:["Roll out to 100% of traffic immediately","Reject the change since model behavior changed","Check safety and edge-case eval subsets specifically, not just the aggregate","Ignore evals since cost improved"],
         answer:2, rationale:"A flat aggregate can mask regressions concentrated in safety-sensitive or edge-case slices — check those before trusting the headline number."},
        {stem:"An LLM-judge eval scores a support agent on open-ended 'helpfulness' with no rubric, and scores swing between runs on the same output. Most likely fix?",
         opts:["Run the judge more times and average blindly","Give the judge a specific, structured rubric with clear criteria instead of an open-ended question","Replace the LLM judge with a human for every response","Drop the helpfulness metric as too subjective to measure"],
         answer:1, rationale:"Inconsistent LLM-judge scoring is usually a specification problem — a structured rubric fixes it far more directly than brute-force averaging or abandoning the metric."},
        {stem:"Cost per request needs to drop on a well-defined extraction task currently using a top-tier model, without hurting accuracy. Correct order of operations?",
         opts:["Jump straight to the smallest available model","Test whether a smaller/faster model meets the accuracy bar on the eval set; keep the top-tier model only where evals show it's needed","Shrink the eval set so results look better","Leave the model as-is since cost isn't worth the engineering time"],
         answer:1, rationale:"Evidence-based right-sizing against the existing eval set is the domain's standard move — a blind downgrade or shrinking the eval set to flatter the result both skip the actual measurement step."}
      ]
    },
    { id:"d5", n:"05", weight:"14%", weightNum:14, title:"Governance, Safety & Risk Management",
      objectives:[
        "Implement input/output guardrails and tool-use controls",
        "Identify risks and failure modes specific to LLM systems",
        "Apply human-in-the-loop validation where it earns its cost",
        "Map data types and sectors to the compliance regimes they trigger",
        "Address bias, fairness, and transparency in system design"
      ],
      notes:[
        "Layer guardrails at each boundary: input screening (block malicious/out-of-scope requests before the model sees them), output screening (check responses before they reach the user or a downstream system), and tool-use constraints (limit what actions an agent can actually take).",
        "Core LLM failure modes to keep distinct: hallucination (confidently asserting unsupported facts), <b>prompt injection</b> (instructions smuggled in through untrusted content the model reads, not from the user), jailbreaking (the user directly trying to bypass instructions), data leakage, and automation bias (a human reviewer rubber-stamping AI output).",
        "Treat all external or tool-sourced content as <i>data</i>, never as instructions — that's the standing defense against prompt injection.",
        "Human-in-the-loop should be calibrated to reversibility and confidence, not applied uniformly — gate irreversible or high-stakes actions (payments, deletions, external sends) behind confirmation; low-stakes, reversible actions don't need the same friction.",
        "Compliance is triggered by data type and sector, not bolted on generically: <b>GDPR</b> (data minimization, deletion rights, residency), <b>HIPAA</b> (protected health information, BAAs), <b>FedRAMP</b> (government cloud authorization).",
        "Ethical AI review means testing for bias/disparate impact across user segments and being transparent that a user is interacting with, or being decisioned by, an AI system."
      ],
      highYield:"When content originates from an external document, webpage, or tool result rather than the user directly, and it contains instruction-like text, that's prompt injection — the fix is architectural (never execute instructions found in data), not a stronger refusal prompt.",
      qs:[
        {stem:"An internal tool summarizes uploaded PDFs that may come from untrusted external senders. One PDF contains hidden text instructing the assistant to exfiltrate other users' data. How should this risk be framed?",
         opts:["A jailbreak attempt by the end user","A prompt injection via untrusted document content","A hallucination","A model weight issue"],
         answer:1, rationale:"Instructions embedded in content the system reads — not supplied by the user directly — is the defining shape of prompt injection; the correct control treats document content as data, never as commands."},
        {stem:"A healthcare intake assistant will process patient-submitted symptom descriptions. Which consideration is most directly triggered by this data type?",
         opts:["FedRAMP authorization","HIPAA safeguards for protected health information","GDPR right-to-be-forgotten only","No special compliance beyond standard security practices"],
         answer:1, rationale:"Patient health information triggers HIPAA specifically; FedRAMP applies to government cloud authorization, not the data type here."},
        {stem:"An agent can both browse the web and execute code. It's given a task requiring it to read an untrusted web page. What's the key safety consideration specific to this tool combination?",
         opts:["The agent might run out of context","Content from the page could contain instructions that get executed as code if not treated strictly as data","Web browsing is always safe once code execution is sandboxed","This combination needs no special handling beyond normal rate limiting"],
         answer:1, rationale:"Combining untrusted content ingestion with code execution is a high-risk injection-to-action chain; the content must stay data and never become an executed instruction, regardless of sandboxing elsewhere."},
        {stem:"A hiring-screening assistant shows a statistically significant pass-through disparity across demographic groups, even though no demographic field is used as direct input. What's most directly indicated?",
         opts:["Conclude there's no issue since demographic data isn't a direct input","Investigate for proxy bias — correlated features driving the disparity — and mitigate before further use","Add a disclaimer to the tool's output","Increase model size to improve overall accuracy"],
         answer:1, rationale:"Disparate impact can arise from features correlated with demographics even without a direct demographic input — fairness review has to look past 'not a direct input' to proxy effects."}
      ]
    },
    { id:"d6", n:"06", weight:"14%", weightNum:14, title:"Stakeholder Communication & Lifecycle Management",
      objectives:[
        "Run structured discovery before proposing architecture",
        "Communicate trade-offs in terms stakeholders actually care about",
        "Manage feedback loops and SLA alignment explicitly",
        "Document architecture and the reasoning behind it",
        "Support the full lifecycle: discovery, design, handoff, monitoring, iteration"
      ],
      notes:[
        "Structured discovery comes before design: current process, success metrics, constraints (budget, timeline, compliance), and failure tolerance. A vague ask ('make it fast') gets converted into a measurable SLA before anything is designed.",
        "Frame trade-offs in stakeholder language — cost, risk, time-to-value, SLA impact — not internal technical detail, and make the trade-off explicit rather than implied ('faster but less accurate' as a stated choice, not a hidden side effect).",
        "Agree on explicit, measurable SLAs (accuracy threshold, response time, uptime) with stakeholders up front, so 'done' isn't a matter of opinion later.",
        "Document not just the architecture but the <i>rationale</i> — why this pattern was chosen over the alternatives — so the design survives the original architect leaving the room.",
        "Lifecycle doesn't end at launch: discovery → design → build/handoff → monitoring → iteration. Plan for monitoring and iteration from the start, not as an afterthought once something breaks."
      ],
      highYield:"When a scenario describes a handoff or ownership transition failing, the gap is almost always undocumented decision rationale, not a technical shortfall — the fix is making decisions explicit and reviewable, not adding more tests.",
      qs:[
        {stem:"A stakeholder asks for 'the fastest possible response time' with no further detail. Correct next step before designing anything?",
         opts:["Assume they mean sub-second and design for that","Reuse a default SLA from a similar past project","Ask what response time the workflow actually needs, and convert it into an agreed, measurable SLA","Design for the fastest technically possible option regardless of cost"],
         answer:2, rationale:"Structured discovery turns a vague ask into a measurable, mutually agreed SLA before design starts — guessing or defaulting skips the discovery step the domain is built around."},
        {stem:"Six months after handoff, the original architect has left, and the team can't explain why a particular safety control exists. What was most likely missing?",
         opts:["A faster model","Documented rationale behind the architectural decisions, not just the decisions themselves","More unit tests","A larger context window"],
         answer:1, rationale:"A design 'only the architect understands' is a documentation failure — capturing the why, not just the what, is what lets a team operate the system independently."},
        {stem:"Midway through a project, a stakeholder requests a new capability that would significantly increase latency, conflicting with the SLA agreed at kickoff. Best next step?",
         opts:["Silently implement it and hope no one notices the SLA impact","Refuse the request outright with no discussion","Surface the trade-off explicitly — what the capability costs against the agreed SLA — and let the stakeholder make an informed call","Implement it in a way that hides the latency increase from monitoring"],
         answer:2, rationale:"Explicit trade-off communication that lets the stakeholder make an informed decision is the domain's core skill; hiding the impact is a integrity failure, not a valid option."},
        {stem:"A completed system is handed off with only a slide deck describing 'what' it does, not 'why' key decisions were made. Months later, an ops change reintroduces a safety issue the original design intentionally prevented. What lifecycle step failed?",
         opts:["Discovery","Documentation of decision rationale during handoff","Initial model selection","Developer productivity tooling"],
         answer:1, rationale:"This is the same 'why, not just what' documentation gap, now shown as the direct cause of a real regression during handoff — reinforcing that rationale, not just the diagram, has to transfer."}
      ]
    },
    { id:"d7", n:"07", weight:"7%", weightNum:7, title:"Developer Productivity & Operational Enablement",
      objectives:[
        "Configure Claude tools and environments consistently for a team",
        "Improve developer workflows with AI-assisted tooling",
        "Support debugging and operational issue resolution"
      ],
      notes:[
        "Shared, version-controlled configuration (project-level settings, shared prompts/Skills, consistent tool permissions) beats each engineer building their own ad hoc setup — consistency across the team is the point of this domain.",
        "AI-assisted developer workflows (e.g. Claude Code) should measurably speed up debugging and repetitive engineering work — but the goal is a team that can operate the system, not one person who can.",
        "Operational enablement means the team has enough visibility — logs, runbooks, shared context — to debug a live system without the original architect being in the room.",
        "Anything that increases dependence on a single person is the wrong answer in this domain, even if it's faster in the short term."
      ],
      highYield:"This is the smallest-weight domain (7%) but has a consistent tell: correct answers reduce single-person dependency and standardize team practice; answers that centralize expertise in one engineer are traps.",
      qs:[
        {stem:"Different engineers each configure their own ad hoc Claude Code settings and prompts, causing inconsistent output quality across the team. Best fix?",
         opts:["Let each engineer keep a personal setup since preferences differ","Establish shared, version-controlled configuration and prompts the whole team uses","Restrict the tool to one senior engineer only","Switch to a different tool entirely"],
         answer:1, rationale:"Standardizing shared, version-controlled configuration fixes the inconsistency directly; restricting to one person (C) increases single-person dependency, which this domain treats as the wrong direction."},
        {stem:"A team wants AI-assisted debugging but worries about engineers losing understanding of their own codebase. Most balanced operational practice?",
         opts:["Ban AI-assisted debugging entirely","Require engineers to review and understand suggested fixes before merging, with visibility via code review","Let AI commit fixes directly without review to save time","Only allow AI assistance for junior engineers"],
         answer:1, rationale:"Keeping a human review step preserves team understanding and operational independence while still capturing the productivity gain — the extremes (ban it / auto-merge it) both fail the domain's goal."},
        {stem:"Engineers' local Claude Code configurations silently diverge over months. Debugging a shared skill's behavior later is difficult because no one is sure which configuration produced a given result. What practice would have prevented this?",
         opts:["Banning all local customization","Version-controlling shared configuration/skills so changes are tracked and reproducible across the team","Relying on each engineer's memory of what they changed","Only allowing one engineer to ever touch configuration"],
         answer:1, rationale:"Tracked, reproducible shared configuration solves the drift directly; a total ban or single-owner model both trade the problem for the domain's other trap — over-centralization."},
        {stem:"A team wants to know whether AI-assisted tooling is actually improving developer productivity rather than assuming it does. Most appropriate approach?",
         opts:["Assume productivity gains and skip measurement to save time","Track concrete before/after metrics (e.g., cycle time, defect rate) for tasks using the tooling vs. not","Survey only the most enthusiastic early adopters","Judge success solely by how often the tooling is invoked"],
         answer:1, rationale:"Concrete before/after outcome metrics test the actual claim; assuming, surveying only enthusiasts, or counting invocations all substitute a proxy for the real measurement."}
      ]
    }
  ]
};
