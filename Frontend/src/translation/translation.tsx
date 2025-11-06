// src/translation/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import settings from "./settings";
import chat from "./chat"
import Game from "./game"
import friend from "./friends"
import home from "./home"
import notifs from "./notif"
import validationErrors from './validitionerror'
import userauth from "./userauth";
import profile from "./profile";

const resources = {
  en: {
    translation: {
      ...settings.en,
      ...chat.en,
      ...Game.en,
      ...friend.en,
      ...home.en,
      ...notifs.en,
      ...validationErrors.en,
      ...userauth.en,
      ...profile.en
    },
  },
  fr: {
    translation: {
      ...settings.fr,
      ...chat.fr,
      ...Game.fr,
      ...friend.fr,
      ...home.fr,
      ...notifs.fr,
      ...validationErrors.fr,
      ...userauth.fr,
      ...profile.fr
    },
  },
  es: {
    translation: {
      ...settings.es,
      ...chat.es,
      ...Game.es,
      ...friend.es,
      ...home.es,
      ...notifs.es,
      ...validationErrors.es,
      ...userauth.es,
      ...profile.es
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
