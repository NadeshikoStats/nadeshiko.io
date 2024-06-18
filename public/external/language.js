localStorageSettings = localStorage.getItem("settings");
if (localStorageSettings === null) {
  settings = { };
} else {
  settings = JSON.parse(localStorageSettings);
}

let userLanguage = settings["language"] || 'en-CA';

/* 
 * Fetches the language file from the server
 * @param {string} language - The name of the language file
 */
async function fetchLanguageFile(language) {
  try {
    let url = `/translation/${language}.json`;
    let response = await fetch(url);

    let translationJSON = await response.json();
    languageJSON = translationJSON;
    beginGeneration("fetchLanguageFile");

  } catch (error) {
    console.warn(`Error loading translation file ${language} (${error.message})`);

    let fallbackResponse = await fetch(`/translation/en-CA.json`);
    if (!fallbackResponse.ok) {
      console.error('Fallback language file not found! Is the /translation folder missing?');
    }
    let translationJSON = await fallbackResponse.json();
    languageJSON = translationJSON;
    beginGeneration("fetchLanguageFile");
  }
}

function getTranslation(key) {
  let keys;
  // If the key is a string, split it into an array
  if (typeof key === 'string') {
    keys = key.split('.');
  } else {
    keys = key;
  }
  
  let languageJSONSubset = languageJSON;
  
  for (const k of keys) {
    if (languageJSONSubset === undefined) {
      console.warn("Unable to find key " + key + " in translation file");
      return "ERROR";
    }

    languageJSONSubset = languageJSONSubset[k];
  }

  if(languageJSONSubset !== undefined) {
    return languageJSONSubset;
  } else {
    console.warn("Unable to find key " + key + " in translation file");
    return "ERROR";
  }
}

function updateTranslations() {
  document.querySelectorAll('[data-t]').forEach(element => {
    const key = element.getAttribute('data-t');
    const translation = getTranslation(key);
    if (element.placeholder) {
      element.placeholder = translation;
    } else {
      element.textContent = translation;
    }
  });
}

fetchLanguageFile(userLanguage);