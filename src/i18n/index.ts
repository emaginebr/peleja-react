import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ptBR from './pt-BR.json'
import en from './en.json'

const resources = {
  'pt-BR': { translation: ptBR },
  en: { translation: en },
}

export const initI18n = (language: string = 'pt-BR') => {
  if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
      resources,
      lng: language,
      fallbackLng: 'pt-BR',
      interpolation: { escapeValue: false },
    })
  } else {
    for (const [lng, res] of Object.entries(resources)) {
      const translations = (res as { translation: Record<string, string> }).translation
      for (const [key, value] of Object.entries(translations)) {
        if (!i18n.exists(key, { lng })) {
          i18n.addResource(lng, 'translation', key, value)
        }
      }
    }
    if (i18n.language !== language) {
      i18n.changeLanguage(language)
    }
  }
  return i18n
}

export default i18n
