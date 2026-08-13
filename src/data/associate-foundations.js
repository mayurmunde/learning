// Exam blueprint structure condensed from the official public exam guide.
// Field notes and self-test questions are original study material.

export const associateFoundations = {
  id:"assoc-f", code:"CCAO-F", track:"Associate", level:"Foundations",
  name:"Associate — Foundations", fee:"$99", items:60, minutes:120, passScore:720, validity:12,
  domains:[
    { id:"d1", n:"01", weight:"14%", weightNum:14, title:"Prompting and Task Execution",
      objectives:["Create effective prompts for business and technical tasks","Decompose complex requests into structured steps","Iterate prompts to improve output quality","Adapt prompting strategy to the task type (analysis, research, drafting, brainstorming)"],
      notes:[
        "Treat a first draft prompt as a draft, not a final answer — plan to iterate based on what comes back.",
        "Break a big ask into smaller, ordered sub-asks Claude can act on one at a time; vague mega-prompts tend to produce generic output.",
        "Match approach to task type: analysis/research benefits from asking for structured reasoning; drafting benefits from voice/format examples; brainstorming benefits from volume-then-narrow.",
        "Give the <b>why</b> behind a task (audience, purpose, constraints), not just the what — this alone noticeably improves usability.",
        "Iterate with specifics: 'too formal' or 'missing the Q3 numbers' targets the next pass far better than starting over."
      ],
      highYield:"When a vague ask produces a vague result, the fix is decomposition or added specifics — not switching tools or repeating the same prompt.",
      qs:[
        {stem:"An associate asks Claude to 'write a project update' and gets a generic, unusable draft. Most effective next step?",
         opts:["Ask Claude to try again with the exact same prompt","Provide specifics: audience, key milestones, tone, and length","Switch to a different AI tool","Write the update manually instead"],
         answer:1, rationale:"The gap is missing specificity, not a tool or repetition problem — audience/content/tone constraints directly address why the draft was generic."},
        {stem:"A marketing associate asks Claude to research a competitor, analyze pricing, and draft a comparison one-pager all in one request. All three come back shallow. Best fix?",
         opts:["Ask for all three in an even longer single prompt","Split into sequential steps — research, then analysis, then drafting — reviewing each before the next","Only ask for the one-pager and skip the rest","Repeat the same request three times"],
         answer:1, rationale:"Decomposing into ordered steps, each checked before the next, produces more depth than cramming three distinct task types into one shot."}
      ]
    },
    { id:"d2", n:"02", weight:"21%", weightNum:21, title:"Output Evaluation and Validation",
      objectives:["Evaluate outputs for accuracy and completeness","Spot hallucinations, inconsistencies, and bias","Apply fact-checking and validation techniques","Know when human review or extra verification is required","Edit and adapt outputs for the intended audience","Choose the right output format (artifact, inline, structured data)"],
      notes:[
        "Confident phrasing is not evidence of accuracy — a fabricated citation can read exactly as polished as a correct one. Specific-looking details (exact section numbers, precise stats) are a common hallucination pattern worth double-checking.",
        "Validate most rigorously when the audience is compliance/legal/finance or the decision is consequential — that's where an unverified error costs the most.",
        "'Edit for audience' means more than tone: an executive summary needs different information density than a technical brief, even from the same source facts.",
        "Self-reported model confidence is not a reliable accuracy signal — checking the source is not optional just because Claude 'sounds sure.'",
        "Choosing output format (artifact vs. inline vs. structured data) should match how the result will actually be used downstream."
      ],
      highYield:"Whenever Claude produces a specific-sounding fact (citation, statistic, quote) headed for an important audience, the correct action is independent verification — never 'trust because it's confident' and never 'ask the model to self-rate.'",
      qs:[
        {stem:"Claude drafts a client-facing proposal citing '73% of customers in our March survey.' The associate doesn't recall a March survey. Best action?",
         opts:["Keep the stat since it sounds plausible","Verify the figure against actual survey data before sending","Change the number to a rounder figure","Remove the sentence but send the rest unchecked"],
         answer:1, rationale:"A specific-looking, unverifiable statistic is a classic hallucination pattern — verify against the source before it reaches a client."},
        {stem:"A draft needs to go to two very different audiences: engineers and executives. Correct approach?",
         opts:["Send the same draft to both","Produce two adapted versions tailored to each audience's needed depth and framing","Ask executives to read the engineering version","Shorten the draft randomly for whichever audience asks first"],
         answer:1, rationale:"Audience adaptation changes information density and framing, not just length — one draft rarely serves both well."}
      ]
    },
    { id:"d3", n:"03", weight:"12%", weightNum:12, title:"Product and Model Selection",
      objectives:["Select the right product feature for the task (Projects, research mode, chat, artifacts)","Differentiate Claude model tiers (Haiku/Sonnet/Opus)","Align model choice with cost, speed, and quality needs","Manage context limitations (when to restart, summarize, or persist)"],
      notes:[
        "Match model tier to task weight: fast/light models for high-volume simple tasks, the most capable tier for complex reasoning or high-stakes analysis.",
        "Projects suit ongoing, knowledge-backed work (a recurring client, a standing body of documents); a one-off chat is fine for a single unrelated question.",
        "Artifacts suit content meant to be iterated on as a distinct object (a document, code, a design) rather than read once inline.",
        "When a conversation gets long and unfocused, a fresh, well-scoped restart often beats pushing through cluttered context."
      ],
      highYield:"'High volume + low complexity + cost/speed matter most' signals the fastest/cheapest model tier — reflexively picking the most capable model for everything is the trap answer.",
      qs:[
        {stem:"An associate needs to draft 200 similar short social captions today. Best fit?",
         opts:["The most capable, slowest model for every caption","A faster, lower-cost model suited to short, high-volume tasks","A single Project with no drafting at all","Manually writing all 200"],
         answer:1, rationale:"High-volume, low-complexity work is exactly what a faster/cheaper model tier is for."},
        {stem:"A consultant works with the same client's documents daily over several months. What best supports this?",
         opts:["Re-uploading documents in a fresh chat every day","A Claude Project configured with the client's standing knowledge and instructions","Emailing documents back and forth instead","Starting over from scratch each session with no configuration"],
         answer:1, rationale:"Ongoing, knowledge-backed work is the core use case for a configured Project."}
      ]
    },
    { id:"d4", n:"04", weight:"16%", weightNum:16, title:"Workflow Integration and Solution Design",
      objectives:["Analyze requirements and use cases","Use Claude for research, planning, and process optimization","Support solution design, development, and iteration","Integrate Claude into existing workflows to augment or redesign them","Communicate Claude's value and limitations to stakeholders"],
      notes:[
        "Before automating a workflow, map the current process and find where Claude adds real leverage (repetitive drafting, synthesis, first-pass analysis) vs. where human judgment must stay.",
        "'Augment' and 'redesign' are different moves: sometimes Claude slots into an existing step, other times the workflow itself should change shape.",
        "When pitching a Claude-based workflow change, be explicit about limitations alongside the value — undersold limitations erode trust later."
      ],
      highYield:"'Bolt Claude onto the existing process or redesign it' questions reward evaluating what actually changes about the work, not defaulting to either option.",
      qs:[
        {stem:"A team spends hours manually summarizing weekly support tickets into a report. Which best describes applying Claude here?",
         opts:["Redesign the whole support workflow immediately","Use Claude to draft the summary as an augmentation to the existing process, with human review","Skip human review entirely to save time","Avoid using Claude since the task is manual"],
         answer:1, rationale:"A drafting/summarizing task is a natural augmentation point with a review step — no need to redesign the whole workflow."},
        {stem:"When pitching a new Claude-assisted workflow to stakeholders, what should accompany the benefits?",
         opts:["Nothing beyond the benefits — limitations undermine the pitch","Known limitations and where human review or escalation is still needed","A guarantee of zero errors","Technical implementation details only"],
         answer:1, rationale:"Explicit, honest limitations build durable trust; omitting them creates problems once reality doesn't match an oversold pitch."}
      ]
    },
    { id:"d5", n:"05", weight:"12%", weightNum:12, title:"Configuration and Knowledge Management",
      objectives:["Configure Projects with instructions and knowledge sources","Manage uploaded knowledge and connectors (e.g., Drive, Gmail)","Write effective system-level instructions","Maintain and update configurations and knowledge sources over time"],
      notes:[
        "Project instructions should state role, scope, and format expectations up front — this is what keeps every conversation in that Project consistent.",
        "Knowledge sources and connectors need to be kept current — stale uploaded knowledge produces confidently wrong answers based on outdated info.",
        "Revisit and update instructions/knowledge as the underlying process changes, not just at initial setup."
      ],
      highYield:"A Project giving inconsistent or outdated answers is usually a configuration-maintenance problem (stale knowledge, vague instructions), not a model-quality problem.",
      qs:[
        {stem:"A Project's outputs recently started referencing a discontinued product. Most likely cause and fix?",
         opts:["The model is malfunctioning; wait for it to self-correct","The Project's uploaded knowledge is stale and needs updating","Switch to a different Project entirely","Ignore it since it will resolve itself"],
         answer:1, rationale:"Outdated uploaded knowledge is the far more common and directly fixable cause than a model malfunction."},
        {stem:"A new teammate joins a shared Project and gets inconsistent answers versus the rest of the team. What should be checked first?",
         opts:["Whether the Project's instructions and knowledge sources are clear and complete","Whether they are using a different device","Whether they typed their prompt in a different font","Nothing — this is expected and unfixable"],
         answer:0, rationale:"Inconsistent results across teammates on the same Project points at incomplete or ambiguous configuration, not device quirks."}
      ]
    },
    { id:"d6", n:"06", weight:"15%", weightNum:15, title:"Governance, Risk, and Responsible Use",
      objectives:["Identify appropriate vs. inappropriate use cases","Apply data-sensitivity, regulatory, and privacy considerations","Follow organizational AI policy and governance standards","Understand the ethical implications of AI use"],
      notes:[
        "Regulated or sensitive personal data should be minimized or anonymized before it goes into a prompt or upload, regardless of whether the analysis is 'internal only.'",
        "'Can Claude technically do this' and 'should this go through Claude without further review' are different questions — some use cases need escalation regardless of capability.",
        "Org AI policy exists to operationalize responsible use consistently — individual judgment should defer to documented policy, not override it."
      ],
      highYield:"When an easy technical path would violate a stated data or policy constraint, the correct answer is always the compliant option (redact/anonymize/escalate) — never 'just this once' or 'tell the model not to retain it.'",
      qs:[
        {stem:"An HR associate wants Claude to analyze performance-review text with sensitive personal details, unredacted, because 'it's internal only.' Correct action?",
         opts:["Proceed as-is since it's internal","Anonymize or minimize identifying personal details first, per policy","Ask Claude not to remember the details","Skip the analysis and do nothing"],
         answer:1, rationale:"Internal-only framing doesn't override a data-minimization policy; redact/anonymize before proceeding."},
        {stem:"An associate is unsure whether a new use case (auto-drafting customer-facing legal notices) needs review before implementation. Best action?",
         opts:["Proceed since Claude is technically capable of the task","Escalate to check against organizational AI governance/policy first","Implement it quietly to save time","Ask a coworker informally instead of consulting policy"],
         answer:1, rationale:"Technical capability doesn't settle whether a use case is appropriate without review — escalate to policy first."}
      ]
    },
    { id:"d7", n:"07", weight:"10%", weightNum:10, title:"Troubleshooting and Optimization",
      objectives:["Diagnose underperforming prompts or outputs","Adjust approach based on feedback and results","Optimize workflows for efficiency and effectiveness"],
      notes:[
        "When output quality is poor, diagnose before rewriting from scratch: missing context, ambiguous instructions, wrong format, or a task better suited to decomposition?",
        "Treat each round of feedback as data — track recurring fixes and adjust the standing prompt so the same issue doesn't need re-explaining every time.",
        "Efficiency optimization includes front-loading the context and format Claude needs the first time, cutting redundant back-and-forth."
      ],
      highYield:"Recurring, predictable feedback ('always too long,' 'always missing X') signals fixing the standing prompt/instructions — not correcting each output individually.",
      qs:[
        {stem:"Every week, an associate asks Claude to shorten its report drafts. Most efficient long-term fix?",
         opts:["Keep manually shortening each week","Update the standing prompt/instructions to specify the desired length upfront","Stop using Claude for reports","Ask a coworker to shorten it instead"],
         answer:1, rationale:"A recurring, predictable correction belongs in the standing instructions, not repeated manually."}
      ]
    }
  ]
};
