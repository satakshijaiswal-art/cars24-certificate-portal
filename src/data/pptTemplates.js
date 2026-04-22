export const pptSlideTemplates = [
  {
    id: 'bar-raiser',
    name: 'Bar Raiser',
    bgColor: '#4736FE',
    titleColor: '#FFFFFF',
    textColor: '#FFFFFF',
    accentColor: '#00FFAA',
  },
  {
    id: 'action-hero',
    name: 'Action Hero',
    bgColor: '#FF6B35',
    titleColor: '#FFFFFF',
    textColor: '#FFFFFF',
    accentColor: '#FFD700',
  },
  {
    id: 'phoenix-award',
    name: 'The Phoenix Award',
    bgColor: '#E63946',
    titleColor: '#FFFFFF',
    textColor: '#FFFFFF',
    accentColor: '#FFB703',
  },
  {
    id: 'glue-award',
    name: 'The Glue Award',
    bgColor: '#2A9D8F',
    titleColor: '#FFFFFF',
    textColor: '#FFFFFF',
    accentColor: '#E9C46A',
  },
  {
    id: 'culture-champion',
    name: 'Culture Champion',
    bgColor: '#7B2CBF',
    titleColor: '#FFFFFF',
    textColor: '#FFFFFF',
    accentColor: '#C77DFF',
  },
  {
    id: 'rock-award',
    name: 'The Rock Award',
    bgColor: '#264653',
    titleColor: '#FFFFFF',
    textColor: '#FFFFFF',
    accentColor: '#E76F51',
  },
  {
    id: 'dream-builder',
    name: 'Dream Builder Award',
    bgColor: '#023E8A',
    titleColor: '#FFFFFF',
    textColor: '#FFFFFF',
    accentColor: '#48CAE4',
  },
];

export const getSlideTemplateByCategory = (awardCategory) => {
  if (!awardCategory) return null;
  const category = awardCategory.toLowerCase().trim();
  
  if (category.includes('bar raiser')) {
    return pptSlideTemplates.find(t => t.id === 'bar-raiser');
  } else if (category.includes('action hero')) {
    return pptSlideTemplates.find(t => t.id === 'action-hero');
  } else if (category.includes('phoenix')) {
    return pptSlideTemplates.find(t => t.id === 'phoenix-award');
  } else if (category.includes('glue')) {
    return pptSlideTemplates.find(t => t.id === 'glue-award');
  } else if (category.includes('culture champion')) {
    return pptSlideTemplates.find(t => t.id === 'culture-champion');
  } else if (category.includes('rock') || category.includes('accountable')) {
    return pptSlideTemplates.find(t => t.id === 'rock-award');
  } else if (category.includes('dream builder') || category.includes('ambitious')) {
    return pptSlideTemplates.find(t => t.id === 'dream-builder');
  }
  return pptSlideTemplates[0]; // Default to first template
};
