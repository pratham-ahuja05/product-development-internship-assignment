import type { Brief, Research, Slide, VisualDirection } from './types'

/** The required sample: “5 Ways AI Is Transforming Animal Healthcare” (7 slides). */
export const SAMPLE_BRIEF: Brief = {
  topic: '5 Ways AI Is Transforming Animal Healthcare',
  audience: 'Pet owners, veterinarians and animal-welfare founders',
  platform: 'linkedin',
  tone: 'Educational',
  slideCount: 7,
}

export const SAMPLE_RESEARCH: Research = {
  summary:
    'AI is moving into veterinary care at every stage: spotting disease in images, supporting diagnosis, predicting problems before they become emergencies, helping owners find the right care and taking admin load off clinics. The common thread is that AI supports, not replaces, the vet’s clinical judgement.',
  insights: [
    'Image-based tools are among the most mature uses, helping vets prioritise X-rays, skin and cytology images.',
    'Most of the value comes from time saved: less searching, less admin, faster triage.',
    'Wearables and digital health records make early-warning signals possible for the first time.',
    'Discovery is still a real problem: owners struggle to find verified, available care quickly, especially in emergencies.',
    'Trust is the adoption barrier, so messaging should stress the vet staying in control.',
  ],
  angle: 'Show the whole care journey, from detection to discovery, with one concrete example per slide, and position AI as a vet’s assistant rather than a replacement.',
  headline: '5 Ways AI Is Transforming Animal Healthcare',
  outline: [
    { title: 'Hook', point: 'AI is quietly changing how animals get care' },
    { title: 'AI-assisted disease detection', point: 'Computer vision flags patterns in medical images' },
    { title: 'Smarter diagnostics', point: 'Combining labs, symptoms and history into suggestions' },
    { title: 'Predictive & early intervention', point: 'Wearables and records surface warning signs early' },
    { title: 'AI-powered care discovery', point: 'Matching needs and location to verified providers' },
    { title: 'Automating vet operations', point: 'Reminders, records and follow-ups on autopilot' },
    { title: 'Conclusion + CTA', point: 'AI helps vets care for more animals, better' },
  ],
}

export const SAMPLE_SLIDES: Omit<Slide, 'id'>[] = [
  {
    kind: 'cover',
    eyebrow: 'AI × Animal Healthcare',
    title: '5 Ways AI Is Transforming Animal Healthcare',
    body: 'From faster diagnosis to finding the right vet in an emergency, here’s what’s changing for pets, owners and clinics.',
  },
  {
    kind: 'content',
    eyebrow: 'Detection',
    title: 'AI-assisted disease detection',
    body: 'Computer-vision models can flag patterns in X-rays, skin images and blood smears that are easy to miss in a busy clinic, so vets know what to look at first.',
    example: 'A model highlights a suspicious area on a dog’s chest X-ray. The vet reviews it and confirms.',
  },
  {
    kind: 'content',
    eyebrow: 'Diagnostics',
    title: 'Smarter veterinary diagnostics',
    body: 'AI tools combine lab values, symptoms and medical history to suggest possible diagnoses, so vets spend less time searching and more time deciding.',
    example: 'Bloodwork + symptoms → a ranked shortlist of likely conditions for the vet to evaluate.',
  },
  {
    kind: 'content',
    eyebrow: 'Prevention',
    title: 'Predictive care & early intervention',
    body: 'Wearables and health records can spot early warning signs, like changes in activity, appetite or vitals, before a condition becomes an emergency.',
    example: 'A collar tracker notices a senior dog has been less active all week and prompts a check-up.',
  },
  {
    kind: 'content',
    eyebrow: 'Access',
    title: 'AI-powered care discovery',
    body: 'Owners and rescuers shouldn’t have to dig through outdated listings in an emergency. Smart search matches the need, location and availability to the right verified provider.',
    example: '“24×7 hospital with X-ray near me” → verified, open providers in seconds.',
  },
  {
    kind: 'content',
    eyebrow: 'Operations',
    title: 'Automation in veterinary operations',
    body: 'Appointment reminders, records, follow-ups and inventory can run in the background, giving vet teams more time with the animals in front of them.',
    example: 'Vaccination reminders go out to owners automatically by WhatsApp or SMS.',
  },
  {
    kind: 'cta',
    eyebrow: 'The takeaway',
    title: 'AI won’t replace vets. It will help them care for more animals, better.',
    body: 'Which of these will matter most in the next five years? Share your view in the comments, and send this to someone who loves animals.',
    cta: 'Follow for more on AI in animal care →',
  },
]

export const SAMPLE_VISUAL: VisualDirection = {
  palette: [
    { role: 'Primary', hex: '#0b3a28' },
    { role: 'Accent', hex: '#2f9e6e' },
    { role: 'Background', hex: '#f6f1e7' },
    { role: 'Surface', hex: '#ebe3d3' },
    { role: 'Text', hex: '#0b2a1d' },
  ],
  typography: {
    heading: 'Fraunces SemiBold',
    body: 'DM Sans Regular / Medium',
    note: 'A serif headline feels clinical and credible, and a clean sans keeps body text readable at small sizes in the feed.',
  },
  layout: 'Editorial: dark cover and closing slides bookend light content slides. Large numbered headings, one idea per slide and an “In practice” example box.',
  elements: ['Oversized slide numbers', 'Thin rule dividers', '“In practice” example cards', 'Progress dots', 'Swipe cue on the cover'],
  variations: ['forest', 'ocean', 'paper'],
}
