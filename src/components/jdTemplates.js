// ─── JD Template definitions ─────────────────────────────────────────────────
// All templates use Cars24 brand palette only.
// Font: Inter (body), Playfair Display or Fraunces (role title)

export const jdTemplates = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Purple header strip, clean white body, purple footer',
    layout: 'classic',
  },
  {
    id: 'bold-hero',
    name: 'Bold Hero',
    description: 'Large purple hero block with role title in display type, minimal body',
    layout: 'bold-hero',
  },
  {
    id: 'split',
    name: 'Split',
    description: 'Purple sidebar with role meta, white body with responsibilities',
    layout: 'split',
  },
  {
    id: 'modern-card',
    name: 'Modern Card',
    description: 'White background, three purple-bordered content cards',
    layout: 'modern-card',
  },
];

export const defaultJDForm = () => ({
  roleTitle: 'Senior Product Manager',
  department: 'Product',
  location: 'Gurgaon / Remote',
  experience: '5–8 years',
  employmentType: 'Full-time',
  aboutRole: 'We are looking for a talented and driven professional to join our growing team at Cars24. In this role, you will work closely with cross-functional teams to deliver outstanding results.',
  responsibilities: 'Lead product strategy and roadmap planning\nCollaborate with engineering, design, and data teams\nDrive user research and define product requirements\nMonitor KPIs and continuously iterate on product features\nCommunicate product vision to stakeholders',
  requirements: '5+ years of product management experience\nStrong analytical and problem-solving skills\nExcellent communication and leadership abilities\nExperience with agile development methodologies\nPassion for building products that delight users',
  perks: 'Competitive compensation and ESOPs\nFlexible working hours and hybrid work model\nHealth insurance for you and your family\nLearning and development budget\nFun, fast-paced work environment',
  applyLink: '',
  recruiterName: '',
  recruiterTitle: '',
});
