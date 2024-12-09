localStorageSettings = localStorage.getItem("settings");
if (localStorageSettings === null) {
  settings = { };
} else {
  settings = JSON.parse(localStorageSettings);
}

// Find the best match for the user's language
function getBestLanguage() {
  let translatedLanguages = ["en-CA", "ar-SA", "cs-CZ", "da-DK", "de-DE", "el-GR", "es-ES", "fr-FR", "it-IT", "ja-JP", "ko-KR", "hu-HU", "nl-NL", "no-NO", "pl-PL", "pt-PT", "pt-BR", "ro-RO", "ru-RU", "fi-FI", "sv-SE", "tr-TR", "uk-UA", "zh-CN", "zh-TW", "en-PT"];


  let userLang = navigator.language || navigator.userLanguage;

  if (translatedLanguages.includes(userLang)) {
      return userLang;
  }

  // Partial match based on primary language
  let primaryLang = userLang.split('-')[0];
  let matchedLang =  translatedLanguages.find(lang => lang.startsWith(primaryLang));
  
  return matchedLang || "en-CA";
}

let userLanguage = settings["language"] || getBestLanguage() || 'en-CA';

/* 
 * Fetches the language file from the server
 * @param {string} language - The name of the language file
 */

async function fetchLanguageFile(language) {

  let validLanguages = ["en-CA", "ar-SA", "cs-CZ", "da-DK", "de-DE", "el-GR", "es-ES", "fr-FR", "it-IT", "ja-JP", "ko-KR", "hu-HU", "nl-NL", "no-NO", "pl-PL", "pt-PT", "pt-BR", "ro-RO", "ru-RU", "fi-FI", "sv-SE", "tr-TR", "uk-UA", "zh-CN", "zh-TW", "en-PT", "empty"];
  let rtlLanguages = ["ar-SA"]; // Right-to-left languages

  try {
    language = language.replace("_", "-"); // Replace underscores with hyphens in case something goes wrong
    let url = `/translation/${language}.json`;

    if(!validLanguages.includes(language)) {
      console.warn(`Language ${language} is not a valid language`);
    }

    let response = await fetch(url); // Attempt to fetch the language file

    let translationJSON = await response.json();
    languageJSON = translationJSON;

    if (rtlLanguages.includes(language)) {
      document.documentElement.dir = 'rtl';
      var textDirection = "rtl";
    }
  } catch (error) {
    console.error(`Error loading translation file ${language} (${error.message})`);

    let fallbackResponse = await fetch(`/translation/en-CA.json`);
    if (!fallbackResponse.ok) {
      console.error('Fallback language file not found! Is the /translation folder missing?');
    }
    let translationJSON = await fallbackResponse.json();
    languageJSON = translationJSON;
  }
  beginGeneration("fetchLanguageFile");
}

function getTranslation(key) {
  let keys;
  // If the key is a string, split it into an array
  if (typeof key === 'string') {
    keys = key.split('.');
  } else {
    keys = key;
  }

  rawKey = keys.join('.');
  
  let languageJSONSubset = languageJSON;
  
  for (const k of keys) {
    if (languageJSONSubset === undefined) {
      console.warn("Unable to find key " + key + " in translation file");
      return "⛔" + rawKey;
    }

    languageJSONSubset = languageJSONSubset[k];
  }

  if(languageJSONSubset !== undefined) {
    return languageJSONSubset;
  } else {
    console.warn("Unable to find key " + key + " in translation file");
    return "⚠️" + rawKey;
  }
}

function containsHTMLTags(str) {
  const pattern = /<\/?[a-z][\s\S]*>/i;
  return pattern.test(str);
}

function updateTranslations() {
  document.querySelectorAll('[data-t]').forEach(element => {
    const key = element.getAttribute('data-t');
    const translation = getTranslation(key);
    if (element.placeholder) {
      element.placeholder = translation;
    } else if (element.value) {
      element.value = translation;
    } else {
      if (containsHTMLTags(translation)) {
        element.innerHTML = DOMPurify.sanitize(translation);
      } else {
        element.textContent = translation;
      }
    }
  });
}

 /*
  * Replaces placeholders in a string with the values in the placeholders object
  * @param {string} str - The string to replace placeholders in
  * @param {object} placeholders - An object containing the placeholders and their values
  * @returns {string} - The string with the placeholders replaced 
  */
function insertPlaceholders(str, placeholders) {
  if (!placeholders) {
    return str;
  }

  return str.replace(/%%(.*?)%%/g, (_, key) => {
    return key in placeholders ? placeholders[key] : '';
  });
}

fetchLanguageFile(userLanguage);