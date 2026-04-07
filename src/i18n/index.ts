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
    i18n.changeLanguage(language)
  }
  return i18n
}

export default i18n
