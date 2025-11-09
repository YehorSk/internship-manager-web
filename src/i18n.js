import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import uk from './locales/uk.json'
import sk from './locales/sk.json'
import ru from './locales/ru.json'
import be from './locales/be.json'
import {useStorage} from "@vueuse/core";

function loadLocaleMessages() {
  const locales = [{ sk: sk}, { en: en }, { uk: uk }, { ru: ru}, { be: be}]
  const messages = {}
  locales.forEach(lang => {
    const key = Object.keys(lang)
    messages[key] = lang[key]
  })
  return messages
}

const lang = useStorage('language','sk').value;


export default createI18n({
  locale: lang,
  legacy: false,
  fallbackLocale: 'sk',
  messages: loadLocaleMessages()
})
