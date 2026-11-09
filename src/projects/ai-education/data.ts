import { Blocks, BookOpenCheck, BriefcaseBusiness, Hammer, Layers, Wrench, type LucideIcon } from 'lucide-react'

export type ProgrammeId = 'genai' | 'automation' | 'data' | 'product'

export interface Module {
  title: string
  weeks: string
  topics: string[]
  outcome: string
}

export interface Programme {
  id: ProgrammeId
  name: string
  tagline: string
  level: 'Beginner' | 'Intermediate'
  duration: string
  format: string
  tools: string[]
  forWho: string
  capstone: string
  gradient: string
  modules: Module[]
}

/**
 * Programme design for the prototype. Durations and formats are proposed structure,
 * not claims about an existing course.
 */
export const PROGRAMMES: Programme[] = [
  {
    id: 'genai',
    name: 'Generative AI & Prompt Engineering',
    tagline: 'Turn AI chat tools into a reliable way of working.',
    level: 'Beginner',
    duration: '8 weeks',
    format: 'Live cohort · weekend labs',
    tools: ['Claude', 'ChatGPT', 'Gemini', 'NotebookLM', 'Image generation'],
    forWho: 'Students and professionals who use AI casually and want consistent, high-quality results.',
    capstone: 'A personal prompt library and an AI-assisted research report on a topic you choose.',
    gradient: 'from-electric to-ion',
    modules: [
      { title: 'How large language models work', weeks: 'Week 1', topics: ['Tokens, context and probabilities', 'Strengths and failure modes', 'Choosing the right model'], outcome: 'Explain what an LLM can and can’t be trusted to do.' },
      { title: 'Prompt patterns that work', weeks: 'Weeks 2–3', topics: ['Role, task, context, format', 'Few-shot examples', 'Chain-of-thought and self-critique'], outcome: 'Write structured prompts that give repeatable outputs.' },
      { title: 'Research and writing with AI', weeks: 'Weeks 4–5', topics: ['Source-grounded research', 'Fact-checking and citations', 'Editing for voice and clarity'], outcome: 'Produce a well-sourced report with AI as a collaborator.' },
      { title: 'Multimodal creation', weeks: 'Week 6', topics: ['Image generation and editing', 'Presentations and visuals', 'Responsible use and copyright'], outcome: 'Create visual assets for a real brief.' },
      { title: 'Capstone and portfolio', weeks: 'Weeks 7–8', topics: ['Prompt library design', 'Documenting your process', 'Peer review'], outcome: 'Publish a portfolio-ready case study.' },
    ],
  },
  {
    id: 'automation',
    name: 'AI Automation & Agents',
    tagline: 'Build workflows and agents that do real work.',
    level: 'Intermediate',
    duration: '10 weeks',
    format: 'Live cohort · project sprints',
    tools: ['n8n', 'Zapier', 'Claude API', 'OpenAI API', 'Google Sheets', 'Webhooks'],
    forWho: 'Learners comfortable with spreadsheets and logic who want to automate business processes.',
    capstone: 'A working AI agent that automates one process end to end, with human approval steps.',
    gradient: 'from-plasma to-electric',
    modules: [
      { title: 'Automation foundations', weeks: 'Weeks 1–2', topics: ['Triggers, actions and data mapping', 'APIs and webhooks in plain language', 'n8n vs Zapier vs code'], outcome: 'Automate a multi-step workflow without writing code.' },
      { title: 'LLMs inside workflows', weeks: 'Weeks 3–4', topics: ['Calling model APIs', 'Structured JSON output', 'Validation and retries'], outcome: 'Add reliable AI steps to an automation.' },
      { title: 'Agents and tool use', weeks: 'Weeks 5–7', topics: ['Tool calling and memory', 'Retrieval over your own documents', 'Guardrails and human-in-the-loop'], outcome: 'Build an agent that uses tools safely.' },
      { title: 'Operating automations', weeks: 'Week 8', topics: ['Logging and monitoring', 'Cost control', 'Handling failures'], outcome: 'Run an automation others can depend on.' },
      { title: 'Capstone', weeks: 'Weeks 9–10', topics: ['Process discovery with a real user', 'Build, test, demo', 'Write-up and handover'], outcome: 'Ship an agent and present it to a reviewer panel.' },
    ],
  },
  {
    id: 'data',
    name: 'Data Analytics & Digital Skills',
    tagline: 'Make sense of data, with AI as your analyst.',
    level: 'Beginner',
    duration: '8 weeks',
    format: 'Live cohort · weekday evenings',
    tools: ['Google Sheets', 'Excel', 'SQL', 'Looker Studio', 'Python basics', 'AI copilots'],
    forWho: 'Freshers and early-career professionals who want job-ready analytics and digital skills.',
    capstone: 'An interactive dashboard and insight memo built on a public dataset.',
    gradient: 'from-ion to-emerald-400',
    modules: [
      { title: 'Spreadsheet fluency', weeks: 'Weeks 1–2', topics: ['Cleaning and structuring data', 'Lookups, pivots and formulas', 'AI-assisted formulas'], outcome: 'Clean and analyse a messy dataset in Sheets.' },
      { title: 'SQL for analysis', weeks: 'Weeks 3–4', topics: ['SELECT, JOIN, GROUP BY', 'Writing queries with AI help', 'Checking AI-written SQL'], outcome: 'Answer business questions with SQL.' },
      { title: 'Visualisation and storytelling', weeks: 'Weeks 5–6', topics: ['Choosing the right chart', 'Dashboards in Looker Studio', 'Writing an insight memo'], outcome: 'Present findings decision-makers can act on.' },
      { title: 'Capstone', weeks: 'Weeks 7–8', topics: ['Pick a dataset and question', 'Analysis and dashboard', 'Presentation'], outcome: 'Publish a dashboard and insight memo.' },
    ],
  },
  {
    id: 'product',
    name: 'AI-Powered Product Development',
    tagline: 'Go from idea to a shipped AI product.',
    level: 'Intermediate',
    duration: '12 weeks',
    format: 'Live cohort · build studio',
    tools: ['Figma', 'Cursor', 'Claude Code', 'React', 'Supabase', 'Vercel'],
    forWho: 'Builders, aspiring PMs and developers who want to design and ship AI-native products.',
    capstone: 'A deployed AI product with real users, a product brief and a demo video.',
    gradient: 'from-fuchsia-500 to-plasma',
    modules: [
      { title: 'Product thinking for AI', weeks: 'Weeks 1–2', topics: ['Finding problems worth solving', 'Where AI actually helps', 'Writing a product brief'], outcome: 'Define a focused, testable product idea.' },
      { title: 'Design and prototyping', weeks: 'Weeks 3–4', topics: ['UX for AI features', 'Figma prototyping', 'Usability testing'], outcome: 'Validate a clickable prototype with users.' },
      { title: 'Building with AI coding tools', weeks: 'Weeks 5–8', topics: ['React and APIs basics', 'AI pair-programming workflows', 'Data, auth and storage'], outcome: 'Build a working MVP.' },
      { title: 'Evaluation and launch', weeks: 'Weeks 9–10', topics: ['Evaluating AI output quality', 'Deployment', 'Analytics and feedback'], outcome: 'Launch to first users and measure.' },
      { title: 'Demo day', weeks: 'Weeks 11–12', topics: ['Iterate on feedback', 'Case study writing', 'Demo presentation'], outcome: 'Present a shipped product and case study.' },
    ],
  },
]

export const programmeById = (id: string) => PROGRAMMES.find((p) => p.id === id)

export const WHY: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Wrench, title: 'Practical AI skills', text: 'Every session ends with something you’ve made, not just notes.' },
  { icon: Hammer, title: 'Real-world projects', text: 'Briefs modelled on real business problems: support, research, operations and growth.' },
  { icon: Layers, title: 'Industry-relevant curriculum', text: 'Reviewed every cohort so you learn the tools and practices teams use today.' },
  { icon: Blocks, title: 'Hands-on tool experience', text: 'Work directly in Claude, n8n, SQL, Figma and modern AI coding tools.' },
  { icon: BriefcaseBusiness, title: 'Portfolio development', text: 'Leave with documented case studies you can show employers or clients.' },
]

export const SHOWCASE = [
  { title: 'Customer-support triage agent', programme: 'automation' as ProgrammeId, desc: 'Reads incoming emails, classifies urgency, drafts replies and sends the complex ones to a human for review.', stack: ['n8n', 'Claude API', 'Gmail', 'Sheets'] },
  { title: 'AI research assistant for a niche', programme: 'genai' as ProgrammeId, desc: 'A prompt system that summarises sources, cites them and produces weekly briefings on a topic.', stack: ['Claude', 'NotebookLM', 'Prompt library'] },
  { title: 'Sales performance dashboard', programme: 'data' as ProgrammeId, desc: 'Cleans raw sales exports, models them in SQL and visualises trends for a weekly review.', stack: ['SQL', 'Sheets', 'Looker Studio'] },
  { title: 'Resume-to-role matcher', programme: 'product' as ProgrammeId, desc: 'A web app that compares a resume against a job description and suggests specific improvements.', stack: ['React', 'Claude API', 'Supabase'] },
  { title: 'Social content generator', programme: 'automation' as ProgrammeId, desc: 'Turns one long-form idea into platform-ready posts and carousels, with an approval step before publishing.', stack: ['n8n', 'LLM', 'Canva'] },
  { title: 'Campus event finder', programme: 'product' as ProgrammeId, desc: 'A mobile-first app with natural-language search across college clubs and events.', stack: ['Figma', 'React', 'Embeddings'] },
]

export const JOURNEY = [
  { step: 'Discover', icon: BookOpenCheck, text: 'Book a counselling call, take a short skills check and choose the right programme.' },
  { step: 'Learn', icon: Layers, text: 'Live, hands-on sessions in small cohorts, with mentors reviewing your work every week.' },
  { step: 'Build', icon: Hammer, text: 'Weekly projects that build up to a capstone on a real brief.' },
  { step: 'Showcase', icon: BriefcaseBusiness, text: 'Publish your portfolio, present on demo day and get structured feedback.' },
]

export const FAQS = [
  { q: 'Do I need a technical background or coding experience?', a: 'No. Generative AI & Prompt Engineering and Data Analytics & Digital Skills start from the basics. AI Automation & Agents and AI-Powered Product Development assume basic computer fluency and logical thinking, and we teach the rest.' },
  { q: 'How are the programmes delivered?', a: 'Live online cohorts with hands-on labs, recorded sessions for revision and weekly mentor reviews. Each programme lists its format and schedule.' },
  { q: 'What will I have at the end?', a: 'A portfolio of projects, including a capstone, documented as case studies. You’ll also get a certificate of completion when you finish the required projects.' },
  { q: 'Do you guarantee a job or placement?', a: 'No. We don’t make placement guarantees. We focus on building real skills and a strong portfolio, and we help with interview and portfolio preparation.' },
  { q: 'Which AI tools will I need to pay for?', a: 'Most labs use free tiers. Where a paid API is needed for a project, we provide shared credits during the programme or show you low-cost alternatives.' },
  { q: 'What happens after I register?', a: 'Our admissions team will contact you within two working days to schedule a counselling call, answer questions and share fees and cohort dates.' },
]
