// ─── JD Template definitions ─────────────────────────────────────────────────
// All templates use Cars24 brand palette only.
// Font: Inter (body), Playfair Display (role title display)

export const jdTemplates = [
  {
    id: 'classic',
    name: 'Editorial',
    description: 'Purple header · display serif title · two-column numbered sections',
    layout: 'classic',
  },
  {
    id: 'bold-hero',
    name: 'Magazine',
    description: 'Giant hero title · full-bleed purple gradient · pill apply button',
    layout: 'bold-hero',
  },
  {
    id: 'split',
    name: 'Dossier',
    description: 'Deep purple sidebar · meta stack · pull-quote block',
    layout: 'split',
  },
  {
    id: 'modern-card',
    name: 'Tri-fold',
    description: 'Three content cards · circular numbered badges · centred logo',
    layout: 'modern-card',
  },
];

export const defaultJDForm = () => ({
  roleTitle: 'Senior Product Manager',
  department: 'Product',
  location: 'Gurgaon / Remote',
  experience: '5–8 years',
  employmentType: 'Full-time',
  // New editorial fields
  eyebrow: 'Cars24 · Hiring · 2026',
  hook: 'Build what moves millions.',
  pullQuote: 'Join 8,000+ Carters shaping the future of auto commerce.',
  // Content
  aboutRole: 'We are looking for a talented and driven professional to join our growing team at Cars24. In this role, you will work closely with cross-functional teams to deliver outstanding results.',
  responsibilities: 'Lead product strategy and roadmap planning\nCollaborate with engineering, design, and data teams\nDrive user research and define product requirements\nMonitor KPIs and continuously iterate on product features\nCommunicate product vision to stakeholders',
  requirements: '5+ years of product management experience\nStrong analytical and problem-solving skills\nExcellent communication and leadership abilities\nExperience with agile development methodologies\nPassion for building products that delight users',
  perks: 'Competitive compensation and ESOPs\nFlexible working hours and hybrid work model\nHealth insurance for you and your family\nLearning and development budget\nFun, fast-paced work environment',
  applyLink: '',
  recruiterName: '',
  recruiterTitle: '',
});
