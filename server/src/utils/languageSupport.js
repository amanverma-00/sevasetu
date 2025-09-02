// utils/languageSupport.js
const translations = {
  en: {
    welcome: "Welcome",
    login: "Login",
    // Add more English translations
  },
  hi: {
    welcome: "स्वागत हे",
    login: "लॉग इन",
    // Add more Hindi translations
  },
  pa: {
    welcome: "ਜੀ ਆਇਆਂ ਨੂੰ",
    login: "ਲਾਗਿਨ",
    // Add more Punjabi translations
  }
};

const getTranslation = (key, language = 'en') => {
  return translations[language]?.[key] || translations['en'][key] || key;
};

module.exports = { getTranslation };