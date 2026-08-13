// Exam blueprint structure condensed from the official public exam guide.
// Field notes and self-test questions are original study material.

export const developerFoundations = {
  id:"dev-f", code:"CCDV-F", track:"Developer", level:"Foundations",
  name:"Developer — Foundations", fee:"$125", items:53, minutes:120, passScore:720, validity:12,
  domains:[
    { id:"d1", n:"01", weight:"14.7%", weightNum:14.7, title:"Agents and Workflows",
      objectives:["Choose between workflow and agent architectures with clear decision criteria","Build agents with the Claude Agent SDK, custom loops, or managed deployment","Apply agent design patterns (tool-use loops, sub-agents, memory) and abstraction frameworks"],
      notes:[
        "Workflow vs. agent: fixed, predictable steps → a code-defined workflow; steps that must be determined dynamically from intermediate results → an agent.",
        "Manager/supervisor hierarchies let a top-level agent delegate to subagents for parallelizable or specialized work, instead of one agent doing everything serially.",
        "The Agent SDK provides the harness (loop, tool orchestration); hooks let you inject deterministic actions (logging, validation) at defined points without relying on the model to remember.",
        "Self-hosted vs. Anthropic-hosted deployment is a real tradeoff: infra control and customization vs. operational simplicity.",
        "Agentic frameworks package reusable patterns (tool-use loops, memory, context-window management) — useful, but understand the underlying pattern, not just one framework's API."
      ],
      highYield:"'Should this be a workflow or an agent' hinges on whether the step sequence is knowable in advance — the domain's core recurring test.",
      qs:[
        {stem:"A team processes invoices where the extraction steps are always the same three operations in the same order. Best fit?",
         opts:["A fully autonomous agent that decides its own steps","A fixed workflow with the three steps coded in order","A dozen independent agents each guessing the next step","No automation at all"],
         answer:1, rationale:"Known, fixed, ordered steps are exactly what a code-defined workflow is for — an agent adds unneeded unpredictability and cost."},
        {stem:"A support agent must sometimes look up an order, sometimes check a policy doc, sometimes both, depending on what's asked — the sequence isn't knowable in advance. Best fit?",
         opts:["A fixed three-step workflow","An agent loop that selects tools dynamically based on the conversation","A single hardcoded prompt with no tools","Manual escalation for every request"],
         answer:1, rationale:"Unpredictable, context-dependent step sequencing is the defining signal for an agentic loop over a fixed workflow."}
      ]
    },
    { id:"d2", n:"02", weight:"33.1%", weightNum:33.1, title:"Applications and Integration",
      objectives:["Translate business/infrastructure requirements into technical design","Apply systems life-cycle practices to Claude applications","Work with Claude API mechanics: messages, tools, streaming, caching, batch vs. realtime","Apply core software engineering practices (REST, JSON, async, version control, code review)","Design Claude applications across interfaces (Code, Desktop, claude.ai, API/SDKs)","Manage configuration: CLAUDE.md, settings.json, model/prompt versioning"],
      notes:[
        "Requirements-gathering means separating functional needs (what the app must do) from infrastructure needs (how it runs, scales, integrates) before writing code.",
        "API mechanics to know cold: messages format, tool-calling round-trips, streaming for responsiveness, prompt caching for repeated prefixes, and realtime-vs-batch tradeoffs.",
        "Claude behaves differently by interface (Claude Code vs. Desktop vs. claude.ai vs. raw API) — application design must account for interface-specific instruction interpretation.",
        "Configuration management applies like any software system: pin model versions deliberately, version prompts, track plugin/dependency versions — don't let 'whatever's current' silently change production behavior.",
        "Session hygiene (not letting conversations balloon indefinitely) is part of application design, not an afterthought."
      ],
      highYield:"The realtime-vs-batch tradeoff recurs constantly: latency-tolerant, high-volume, cost-sensitive work → batch; anything needing an immediate response or mid-request tool calls → realtime.",
      qs:[
        {stem:"An application must classify 50,000 support tickets by end of day tomorrow, cost-sensitive, with no live user waiting on results. Best API approach?",
         opts:["Synchronous Messages API called in a tight loop","The Message Batches API","No API call — manual classification","A single oversized request containing all 50,000 tickets"],
         answer:1, rationale:"Latency-tolerant, high-volume, cost-sensitive work is exactly what the batch API is for."},
        {stem:"A production app starts behaving unexpectedly after a routine deploy; the team suspects an unpinned model version silently changed behavior. What practice would have prevented this?",
         opts:["Explicit model version pinning in configuration","Deleting version control history","Avoiding all configuration files","Running the app without any monitoring"],
         answer:0, rationale:"Deliberate version pinning is the direct configuration-management fix for silent behavior drift across releases."}
      ]
    },
    { id:"d3", n:"03", weight:"3.1%", weightNum:3.1, title:"Claude Code",
      objectives:["Operate Claude Code's core components (Rules, Skills, Commands, Agents, Agent Memory)","Use session management, slash commands, headless/streaming/auto-modes","Configure the CLAUDE.md hierarchy and settings.json"],
      notes:[
        "Core building blocks: Rules (standing conventions), Skills (on-demand task workflows), Commands (slash-command shortcuts), Agents/Agent Memory (persistent working context).",
        "CLAUDE.md hierarchy scopes instructions broad-to-narrow; repository initialization and settings.json set the baseline environment for a project.",
        "Headless/streaming/auto-modes support different operational contexts (CI pipelines, live sessions, unattended runs) — pick the mode matching how the session is actually driven."
      ],
      highYield:"Smallest-weight domain (3.1%) — expect a small number of direct 'what does this component do' questions rather than deep scenario chains.",
      qs:[
        {stem:"Which Claude Code component is for standing, always-applicable project conventions rather than one-off invocable workflows?",
         opts:["Slash Commands","Rules / CLAUDE.md","Headless mode","Streaming mode"],
         answer:1, rationale:"Rules/CLAUDE.md are always-loaded standing conventions; Commands are invoked on demand."},
        {stem:"A team wants Claude Code to run unattended inside an automated script with no live terminal interaction. Which mode fits?",
         opts:["Interactive mode","Headless mode","Streaming-only chat mode","Auto-mode with manual confirmation prompts"],
         answer:1, rationale:"Headless mode is designed for non-interactive, unattended, automated invocation."}
      ]
    },
    { id:"d4", n:"04", weight:"2.6%", weightNum:2.6, title:"Eval, Testing, and Debugging",
      objectives:["Identify error types and select recovery strategies","Use trace analysis to find failure modes","Isolate whether a problem originates in the integration layer or model output"],
      notes:[
        "Debugging a Claude application means isolating where a failure originates: the integration layer (your code, API usage, data plumbing) vs. the model's output itself — don't assume it's always 'the model.'",
        "Trace analysis (the actual sequence of requests/tool calls/responses) finds the specific failure mode rather than guessing from symptoms alone.",
        "Recovery strategy should match error type: transient issues may warrant retry; structural/logic issues need a code or prompt fix, not a retry."
      ],
      highYield:"Smallest-weight domain (2.6%) — expect one or two direct 'where does this failure originate' questions.",
      qs:[
        {stem:"An application intermittently returns malformed output only under high load. Where should debugging start?",
         opts:["Assume the model architecture is broken","Trace analysis to isolate whether the issue is the integration layer (timeouts, partial responses) or the model's output","Rewrite the entire application from scratch","Ignore it since it's intermittent"],
         answer:1, rationale:"Load-correlated intermittent failures point to the integration layer first; trace analysis confirms where the failure actually originates."}
      ]
    },
    { id:"d5", n:"05", weight:"16.8%", weightNum:16.8, title:"Model Selection and Optimization",
      objectives:["Understand core LLM fundamentals (tokens, context windows, sampling)","Apply model options (fast mode, extended/adaptive thinking, effort levels)","Select models based on capability/latency/cost tradeoffs","Manage token budgets and cost via caching techniques"],
      notes:[
        "Core mechanics — tokens, context windows, sampling/non-determinism, next-token generation — underlie why outputs vary and why context budgets matter.",
        "Extended/adaptive thinking and effort levels trade latency/cost for deeper reasoning — reserve them for tasks that actually need multi-step reasoning.",
        "Model tier selection is a quality-latency-cost triangle; also watch for breaking behavior changes across releases — validate before rolling out broadly.",
        "Token/cost management: track usage, model cost realistically, and use prompt caching for repeated large prefixes to cut both cost and latency."
      ],
      highYield:"'Big static prefix + small varying input + cost matters' → prompt caching is the answer. This exact pattern recurs across every Claude certification.",
      qs:[
        {stem:"An application sends an unchanging 6,000-token tool-definition block on every request, with brief varying user turns. Direct fix for cost and latency?",
         opts:["Remove the tool definitions entirely","Enable prompt caching on the stable prefix","Switch to the least capable model regardless of task","Increase max_tokens"],
         answer:1, rationale:"A stable, repeated prefix ahead of small varying content is the standard prompt-caching pattern."},
        {stem:"A task requires multi-step arithmetic and logical reasoning before producing an answer. Most appropriate model configuration?",
         opts:["Disable reasoning entirely for speed","Enable extended/adaptive thinking appropriate to the reasoning depth needed","Always use the fastest, lightest model regardless of task","Increase temperature to improve reasoning"],
         answer:1, rationale:"Genuine multi-step reasoning is exactly what extended/adaptive thinking is designed to support."}
      ]
    },
    { id:"d6", n:"06", weight:"11.0%", weightNum:11, title:"Prompt and Context Engineering",
      objectives:["Manage context windows and prevent drift/bloat","Apply prompt engineering principles (clarity, few-shot, system/user placement, sanitization)","Handle output defensively: structured validation and skepticism toward confident output"],
      notes:[
        "Context drift/bloat prevention: prune verbose tool outputs, compact history periodically, isolate noisy sub-tasks in subagents so the main context stays focused.",
        "Prompt fundamentals: instruction clarity beats cleverness; few-shot examples anchor format; stable role/policy goes in system, variable content in user turns; sanitize untrusted input before it reaches the prompt.",
        "Output handling: validate structured output defensively — never trust it blindly, and apply skepticism to confident-sounding responses."
      ],
      highYield:"A long-running agent session degrading in quality points to pruning/compaction/isolation — not simply 'use a bigger context window.'",
      qs:[
        {stem:"A long-running agent session's tool outputs have accumulated to the point where the model gives inconsistent answers. Most direct fix?",
         opts:["Switch to a model with an even larger context window and change nothing else","Prune irrelevant tool-output fields and compact/summarize older history","Ignore it — this is expected and unfixable","Restart with zero context and no summary"],
         answer:1, rationale:"Active pruning and compaction address accumulated context bloat directly; a bigger window just delays the same problem."},
        {stem:"Detailed instructions alone produce inconsistent classification labels across similar tickets. Best fix?",
         opts:["Add few-shot examples showing correct classification for each category","Increase max_tokens","Remove all instructions","Switch to the batch API"],
         answer:0, rationale:"Few-shot examples are the standard fix for inconsistent formatting/classification when prose instructions alone aren't landing."}
      ]
    },
    { id:"d7", n:"07", weight:"8.1%", weightNum:8.1, title:"Security and Safety",
      objectives:["Apply AI application security practices (injection, jailbreak, PII, data leakage)","Layer guardrails and secure-by-design deployment practices","Use hooks for deterministic safety controls","Manage secrets, credentials, and access"],
      notes:[
        "Treat untrusted input (web content, uploaded documents, tool results) as data, never as instructions — the standing defense against prompt injection.",
        "Layer guardrails (content policy, hooks for deterministic blocking) rather than relying on one defense; apply least-privilege identity/access management to secrets and API keys.",
        "Hooks can hard-block destructive actions (e.g., refunds above a threshold) where prompt-only instructions have a non-zero failure rate."
      ],
      highYield:"Content from outside the direct user turn must be isolated as data, with guardrails/hooks enforcing what actions can follow — never rely on a polite instruction alone. This pattern recurs across every Claude certification.",
      qs:[
        {stem:"A Claude agent summarizes user-submitted web pages. One page contains hidden text instructing the agent to reveal internal system information. Most effective mitigation?",
         opts:["Raise the temperature setting","Treat page content as untrusted data, isolate it from trusted instructions, and enforce guardrails/hooks against sensitive actions","Add a polite note asking users not to submit malicious pages","Switch to a larger, more instruction-following model"],
         answer:1, rationale:"Isolating untrusted content as data plus enforced guardrails is the architectural defense against injection; a bigger model can be more susceptible, not less."},
        {stem:"A team wants to guarantee an agent can never execute a destructive database delete, regardless of prompt phrasing. Best mechanism?",
         opts:["A strongly worded system prompt instruction","A hook that programmatically intercepts and blocks the destructive tool call","Trusting the model's judgment alone","Increasing the model's context window"],
         answer:1, rationale:"Deterministic guarantees require programmatic enforcement (hooks), not probabilistic prompt compliance."}
      ]
    },
    { id:"d8", n:"08", weight:"10.6%", weightNum:10.6, title:"Tools and MCPs",
      objectives:["Implement reliable tool calling and function schemas","Build and integrate MCP servers","Weigh tradeoffs across built-in tools, custom tools, Skills, and MCPs"],
      notes:[
        "Tool descriptions are the primary signal the model uses to select the right tool — vague or overlapping descriptions cause misrouting between similar tools.",
        "MCP servers expose reusable tools/resources/prompts that multiple applications can share and maintain independently, vs. one-off custom tools embedded in a single app.",
        "Tradeoffs: built-in tools are fastest to use but fixed in scope; custom tools/MCPs give control and reuse at the cost of build/maintenance effort; Skills package reusable instructions for on-demand loading."
      ],
      highYield:"'Needs to be reusable and independently maintained across multiple apps' signals an MCP server, not a hard-coded custom tool inside one application.",
      qs:[
        {stem:"Multiple internal Claude applications all need the same access to a ticketing system, maintained independently of any single app. Best approach?",
         opts:["Hard-code ticketing logic into each application separately","Build an MCP server exposing ticketing operations as shared tools","Paste ticketing data into every prompt manually","Avoid tool use and rely on the model's general knowledge"],
         answer:1, rationale:"Shared, independently maintained reusability across multiple apps is exactly the MCP server use case."},
        {stem:"An agent frequently calls the wrong one of two similarly named tools. Most effective first fix?",
         opts:["Rename and rewrite both tools' descriptions to clearly differentiate purpose, inputs, and when to use each","Remove both tools entirely","Increase the model's temperature","Add a five-second delay before tool calls"],
         answer:0, rationale:"Tool descriptions are the model's primary selection signal — sharpening them fixes the root cause of misrouting."}
      ]
    }
  ]
};
