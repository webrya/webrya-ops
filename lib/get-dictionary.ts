const dictionaries = {
  GR: () => import('./dictionaries/el.json').then((module) => module.default),
  EN: () => import('./dictionaries/en.json').then((module) => module.default),
}

export const getDictionary = async (locale: 'GR' | 'EN') => 
  dictionaries[locale] ? dictionaries[locale]() : dictionaries.GR()