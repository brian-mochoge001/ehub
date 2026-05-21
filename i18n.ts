import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Translation dictionaries
const resources = {
  en: {
    translation: {
      home: "Home",
      search: "Search",
      cart: "Cart",
      wallet: "Wallet",
      profile: "Profile",
      mall: "Mall",
      services: "Services",
      store: "Store",
      checkout: "Checkout",
      settings: "Settings",
    }
  },
  sw: {
    translation: {
      home: "Nyumbani",
      search: "Tafuta",
      cart: "Kikapu",
      wallet: "Mkoba",
      profile: "Wasifu",
      mall: "Maduka",
      services: "Huduma",
      store: "Duka",
      checkout: "Lipa",
      settings: "Mipangilio",
    }
  },
  fr: {
    translation: {
      home: "Accueil",
      search: "Recherche",
      cart: "Panier",
      wallet: "Portefeuille",
      profile: "Profil",
      mall: "Centre Commercial",
      services: "Services",
      store: "Boutique",
      checkout: "Payer",
      settings: "Paramètres",
    }
  },
  es: {
    translation: {
      home: "Inicio",
      search: "Buscar",
      cart: "Carrito",
      wallet: "Billetera",
      profile: "Perfil",
      mall: "Centro Comercial",
      services: "Servicios",
      store: "Tienda",
      checkout: "Pagar",
      settings: "Ajustes",
    }
  },
  hi: {
    translation: {
      home: "होम",
      search: "खोजें",
      cart: "कार्ट",
      wallet: "बटुवा",
      profile: "प्रोफ़ाइल",
      mall: "मॉल",
      services: "सेवाएं",
      store: "दुकान",
      checkout: "चेकआउट",
      settings: "सेटिंग्स",
    }
  },
  ar: {
    translation: {
      home: "الرئيسية",
      search: "بحث",
      cart: "عربة التسوق",
      wallet: "محفظة",
      profile: "الملف الشخصي",
      mall: "مركز تسوق",
      services: "خدمات",
      store: "متجر",
      checkout: "الدفع",
      settings: "الإعدادات",
    }
  }
};

const initI18n = async () => {
  let locale = 'en';
  if (Localization.getLocales().length > 0) {
    locale = Localization.getLocales()[0].languageCode ?? 'en';
  }

  // Fallback if the language is not supported
  if (!Object.keys(resources).includes(locale)) {
    locale = 'en';
  }

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: locale,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    });
};

initI18n();

export default i18n;
