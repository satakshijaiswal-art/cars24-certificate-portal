// RnR PPT Slide Templates - Editable JSON format
// Based on the original RnR PPT slides from Cars24

export const rnrSlideConfig = {
  // Slide dimensions (16:9 aspect ratio)
  width: 1920,
  height: 1080,
  
  // Background configuration
  background: {
    svgPath: '/assets/rnr-bg.svg',
    fallbackColor: '#4736FE',
    gradientColors: ['#5168FF', '#4837FF', '#2B2199']
  },
  
  // Brand colors
  colors: {
    primary: '#4736FE',
    secondary: '#63FFB1', // Green accent (star)
    text: '#FFFFFF',
    textMuted: '#B8B8B8',
    cardBg: '#F7F5F2',
    cardBgAlt: '#F3F3F3'
  },
  
  // Typography
  fonts: {
    heading: 'Arial Black, sans-serif',
    subheading: 'Arial, sans-serif',
    body: 'Arial, sans-serif'
  },
  
  // Logo configuration
  logo: {
    position: { x: 799, y: 269 },
    size: { width: 66, height: 68 }
  }
};

// Slide type definitions
export const slideTypes = {
  TITLE: 'title',
  CATEGORY_TITLE: 'category_title',
  AWARDEES: 'awardees',
  SINGLE_AWARDEE: 'single_awardee',
  THANK_YOU: 'thank_you'
};

// Title Slide Template (Slide 1)
export const titleSlideTemplate = {
  type: slideTypes.TITLE,
  elements: [
    {
      id: 'star',
      type: 'shape',
      shape: 'star',
      position: { x: 406, y: 305 },
      size: { width: 100, height: 100 },
      fill: '#63FFB1'
    },
    {
      id: 'mainTitle',
      type: 'text',
      content: 'RnR',
      position: { x: 428, y: 461 },
      fontSize: 120,
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontFamily: 'Arial Black'
    },
    {
      id: 'subtitle',
      type: 'text',
      content: 'Celebration 2024',
      position: { x: 359, y: 604 },
      fontSize: 48,
      fontWeight: 'normal',
      color: '#B8B8B8',
      fontFamily: 'Arial'
    },
    {
      id: 'logo',
      type: 'logo',
      position: { x: 799, y: 269 },
      size: { width: 321, height: 68 }
    }
  ]
};

// Category Title Slide Template (for award category headers)
export const categoryTitleSlideTemplate = {
  type: slideTypes.CATEGORY_TITLE,
  elements: [
    {
      id: 'star',
      type: 'shape',
      shape: 'star',
      position: { x: 406, y: 305 },
      size: { width: 100, height: 100 },
      fill: '#63FFB1'
    },
    {
      id: 'categoryName',
      type: 'text',
      content: '{{CATEGORY_NAME}}', // Placeholder
      position: { x: 428, y: 461 },
      fontSize: 96,
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontFamily: 'Arial Black'
    },
    {
      id: 'awardLabel',
      type: 'text',
      content: 'Award Category',
      position: { x: 428, y: 580 },
      fontSize: 36,
      fontWeight: 'normal',
      color: '#B8B8B8',
      fontFamily: 'Arial'
    },
    {
      id: 'logo',
      type: 'logo',
      position: { x: 799, y: 269 },
      size: { width: 321, height: 68 }
    }
  ]
};

// Awardees Slide Template (Multiple awardees - up to 4 per slide)
export const awardeesSlideTemplate = {
  type: slideTypes.AWARDEES,
  maxAwardees: 4,
  layout: {
    columns: 4,
    rows: 1,
    cardWidth: 460,
    cardHeight: 340,
    cardRadius: 80,
    startX: 177,
    startY: 246,
    gapX: 553, // Distance between card starts
    gapY: 0
  },
  elements: [
    {
      id: 'categoryTitle',
      type: 'text',
      content: '{{CATEGORY_NAME}}',
      position: { x: 656, y: 110 },
      fontSize: 64,
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontFamily: 'Arial Black'
    },
    {
      id: 'functionLabel',
      type: 'text',
      content: 'For the team',
      position: { x: 497, y: 172 },
      fontSize: 24,
      fontWeight: 'normal',
      color: '#B8B8B8',
      fontFamily: 'Arial'
    },
    {
      id: 'logo',
      type: 'logo',
      position: { x: 799, y: 269 },
      size: { width: 321, height: 68 }
    }
  ],
  awardeeCard: {
    background: {
      fill: '#F7F5F2',
      radius: 80
    },
    photo: {
      position: { x: 42, y: 0 }, // Relative to card
      size: { width: 375, height: 400 }
    },
    name: {
      position: { x: 0, y: 413 }, // Relative to card, centered
      fontSize: 28,
      fontWeight: 'bold',
      color: '#1A1A1A',
      fontFamily: 'Arial'
    },
    department: {
      position: { x: 0, y: 450 }, // Relative to card, centered
      fontSize: 18,
      fontWeight: 'normal',
      color: '#666666',
      fontFamily: 'Arial'
    },
    designation: {
      position: { x: 0, y: 475 }, // Relative to card, centered
      fontSize: 16,
      fontWeight: 'normal',
      color: '#888888',
      fontFamily: 'Arial'
    }
  }
};

// Single Awardee Slide Template (Featured awardee with larger card)
export const singleAwardeeSlideTemplate = {
  type: slideTypes.SINGLE_AWARDEE,
  elements: [
    {
      id: 'categoryTitle',
      type: 'text',
      content: '{{CATEGORY_NAME}}',
      position: { x: 656, y: 110 },
      fontSize: 64,
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontFamily: 'Arial Black'
    },
    {
      id: 'functionLabel',
      type: 'text',
      content: 'For the team',
      position: { x: 730, y: 172 },
      fontSize: 24,
      fontWeight: 'normal',
      color: '#B8B8B8',
      fontFamily: 'Arial'
    },
    {
      id: 'logo',
      type: 'logo',
      position: { x: 799, y: 269 },
      size: { width: 321, height: 68 }
    }
  ],
  awardeeCard: {
    position: { x: 730, y: 247 },
    size: { width: 460, height: 340 },
    background: {
      fill: '#F7F5F2',
      radius: 80
    },
    photo: {
      position: { x: -11, y: -65 }, // Relative to card
      size: { width: 484, height: 592 }
    },
    name: {
      position: { x: 730, y: 640 },
      fontSize: 36,
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontFamily: 'Arial'
    },
    department: {
      position: { x: 730, y: 690 },
      fontSize: 24,
      fontWeight: 'normal',
      color: '#B8B8B8',
      fontFamily: 'Arial'
    },
    designation: {
      position: { x: 730, y: 730 },
      fontSize: 20,
      fontWeight: 'normal',
      color: '#888888',
      fontFamily: 'Arial'
    }
  }
};

// Thank You Slide Template (Slide 17)
export const thankYouSlideTemplate = {
  type: slideTypes.THANK_YOU,
  elements: [
    {
      id: 'star',
      type: 'shape',
      shape: 'star',
      position: { x: 406, y: 305 },
      size: { width: 100, height: 100 },
      fill: '#63FFB1'
    },
    {
      id: 'mainText',
      type: 'text',
      content: 'Every role matters.',
      position: { x: 471, y: 450 },
      fontSize: 64,
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontFamily: 'Arial Black'
    },
    {
      id: 'subText',
      type: 'text',
      content: "Let's celebrate yours.",
      position: { x: 669, y: 580 },
      fontSize: 36,
      fontWeight: 'normal',
      color: '#B8B8B8',
      fontFamily: 'Arial'
    },
    {
      id: 'logo',
      type: 'logo',
      position: { x: 799, y: 269 },
      size: { width: 321, height: 68 }
    }
  ]
};

// Award categories with their display names
export const awardCategories = {
  'Bar Raiser': {
    displayName: 'Bar Raiser',
    color: '#8B5CF6' // Purple
  },
  'Action Hero': {
    displayName: 'Action Hero',
    color: '#F97316' // Orange
  },
  'Dream Team': {
    displayName: 'Dream Team',
    color: '#3B82F6' // Blue
  },
  'Emerging Star': {
    displayName: 'Emerging Star',
    color: '#10B981' // Green
  },
  'Customer Champion': {
    displayName: 'Customer Champion',
    color: '#EC4899' // Pink
  },
  'Innovation Catalyst': {
    displayName: 'Innovation Catalyst',
    color: '#6366F1' // Indigo
  },
  'Leadership Excellence': {
    displayName: 'Leadership Excellence',
    color: '#F59E0B' // Amber
  },
  'Team Player': {
    displayName: 'Team Player',
    color: '#14B8A6' // Teal
  }
};

// Helper function to get slide template by type
export const getSlideTemplate = (type) => {
  switch (type) {
    case slideTypes.TITLE:
      return titleSlideTemplate;
    case slideTypes.CATEGORY_TITLE:
      return categoryTitleSlideTemplate;
    case slideTypes.AWARDEES:
      return awardeesSlideTemplate;
    case slideTypes.SINGLE_AWARDEE:
      return singleAwardeeSlideTemplate;
    case slideTypes.THANK_YOU:
      return thankYouSlideTemplate;
    default:
      return null;
  }
};

// Helper function to calculate awardee card positions
export const calculateAwardeePositions = (awardeeCount, template = awardeesSlideTemplate) => {
  const positions = [];
  const { layout } = template;
  
  for (let i = 0; i < Math.min(awardeeCount, layout.columns * (layout.rows || 1)); i++) {
    const col = i % layout.columns;
    const row = Math.floor(i / layout.columns);
    
    positions.push({
      x: layout.startX + (col * layout.gapX),
      y: layout.startY + (row * (layout.cardHeight + (layout.gapY || 100))),
      width: layout.cardWidth,
      height: layout.cardHeight
    });
  }
  
  return positions;
};

// Export all templates as a collection
export const allSlideTemplates = {
  title: titleSlideTemplate,
  categoryTitle: categoryTitleSlideTemplate,
  awardees: awardeesSlideTemplate,
  singleAwardee: singleAwardeeSlideTemplate,
  thankYou: thankYouSlideTemplate
};

export default {
  rnrSlideConfig,
  slideTypes,
  titleSlideTemplate,
  categoryTitleSlideTemplate,
  awardeesSlideTemplate,
  singleAwardeeSlideTemplate,
  thankYouSlideTemplate,
  awardCategories,
  getSlideTemplate,
  calculateAwardeePositions,
  allSlideTemplates
};
