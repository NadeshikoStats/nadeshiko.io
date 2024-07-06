var languageJSON;

function und(text, undefinedValue = 0) { // Returns a set value (typically 0) in the case of a missing value
  if (text === null || text === undefined || Number.isNaN(text)) return undefinedValue;
  else return text;
}

function calculateRatio(numerator, denominator, digits = 2) {
  // Calculates a ratio based on two stats
  return checkAndFormat(numerator / (und(denominator) == 0 ? 1 : denominator), digits);
}

function checkAndFormat(number, digits = 0) {
  // Ensures undefined values become zero and format to user's locale
  return locale(und(number), digits);
}

function updateElement(id, value, useInnerHTML = false) {
  const element = document.getElementById(id);
  if (element) {
    if (useInnerHTML) {
      element.innerHTML = DOMPurify.sanitize(value);
    } else {
      element.textContent = value;
    }
  } else {
    console.warn(`Element with ID ${id} not found!`);
  }
}

function locale(number, digits = 2) {
  return number.toLocaleString(userLanguage, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function rawLocale(number) {
  return number.toLocaleString(userLanguage);
}

function shortDateFormat(date) {
  return new Intl.DateTimeFormat(userLanguage, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    calendar: "gregory"
  }).format(date);
}

function longDateFormat(date) {
  return new Intl.DateTimeFormat(userLanguage, {
    dateStyle: "long",
    timeStyle: "long",
    calendar: "gregory",
  }).format(date);
}

function getValue(object, valueArray) {
  for (let i = 0; i < valueArray.length; i++) {
    if (object == undefined) {
      return undefined;
    }
    object = object[valueArray[i]];
  }
  return object;
}

function smallDuration(seconds, ms = false) {
  // Converts a number of seconds into a human-readable duration of time
  if (seconds == -1 || seconds == undefined || isNaN(seconds)) {
    return "N/A";
  }

  let dateNames = {
    year: getTranslation("times.year_short"),
    day: getTranslation("times.day_short"),
    hour: getTranslation("times.hour_short"),
    minute: getTranslation("times.minute_short"),
    second: getTranslation("times.second_short"),
  }

  const MINUTE = 60;
  const HOUR = 3600;
  const DAY = 86400;
  const YEAR = 31556952;

  const years = Math.floor(seconds / YEAR);
  const days = Math.floor((seconds % YEAR) / DAY);
  const hours = Math.floor((seconds % DAY) / HOUR);
  const minutes = Math.floor((seconds % HOUR) / MINUTE);
  const secondsMod = Math.floor(seconds % MINUTE);

  if (years > 0) {
    return `${years}${dateNames["year"]} ${days}${dateNames["day"]}`;
  } else if (days > 0) {
    return `${days}${dateNames["day"]} ${hours}${dateNames["hour"]}`;
  } else if (hours > 0) {
    return `${hours}${dateNames["hour"]} ${minutes}${dateNames["minute"]}`;
  } else if (minutes > 0) {
    return `${minutes}${dateNames["minute"]} ${secondsMod}${dateNames["second"]}`;
  } else {
    return `${ms ? checkAndFormat(seconds, 3) : secondsMod}${dateNames["second"]}`;
  }
}

function rainbowText(text, colorCodes = ["c", "6", "e", "a", "b", "d", "5"]) {
  // Returns a string with cycling colour codes after providing an array of colour codes
  let coloredText = "";

  for (let i = 0; i < text.length; i++) {
    let character = text.charAt(i);
    let colorCode = colorCodes[i % colorCodes.length];
    coloredText += `§${colorCode}${character}`;
  }

  return coloredText;
}

function veryLargeNumber(number) { // Changes number to compact notation if it's over a million
  number = und(number);
  if (number >= 1000000) {
    return new Intl.NumberFormat("default", { notation: "compact", compactDisplay: "short", maximumSignificantDigits: 4 }).format(number);
  } else {
    return locale(number, 0);
  }
}

function addPrefixZero(number, totalLength) { // Adds zeroes to the start of a number to make it a certain length
  let numberStr = number.toString();
  while (numberStr.length < totalLength) {
    numberStr = '0' + numberStr;
  }
  return numberStr;
}

function sortStrings(a, b) { // Sorts strings alphabetically based on locale
  return a.localeCompare(b, userLanguage, { sensitivity: "base" });
}

function relativeTime(timestamp, currentTime = Date.now()) { // Returns a timestamp showing how long ago a date was in the past
  let dateNew = new Date(currentTime);
  let dateOld = new Date(timestamp);

  let years = dateNew.getFullYear() - dateOld.getFullYear();
  let months = dateNew.getMonth() - dateOld.getMonth();
  let days = dateNew.getDate() - dateOld.getDate();
  let hours = dateNew.getHours() - dateOld.getHours();
  let minutes = dateNew.getMinutes() - dateOld.getMinutes();
  let seconds = dateNew.getSeconds() - dateOld.getSeconds();

  if (seconds < 0) {
    minutes--;
    seconds += 60;
  }

  if (minutes < 0) {
    hours--;
    minutes += 60;
  }

  if (hours < 0) {
    days--;
    hours += 24;
  }

  if (days < 0) {
    months--;
    days += new Date(dateOld.getFullYear(), dateOld.getMonth() + 1, 0).getDate(); // Ensures that a month has the correct number of days.
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  let timeValue;
  let dateIsInFuture = false;

  if (years > 0) timeValue = `${years}${getTranslation("times.year_short")}`;
  else if (months > 0) timeValue = `${months}${getTranslation("times.month_short")}`;
  else if (days > 0) timeValue = `${days}${getTranslation("times.day_short")}`;
  else if (hours > 0) timeValue = `${hours}${getTranslation("times.hour_short")}`;
  else if (minutes > 0) timeValue = `${minutes}${getTranslation("times.minute_short")}`;
  else if (seconds > 0) timeValue = `${seconds}${getTranslation("times.second_short")}`;
  else dateIsInFuture = true;

  if (dateIsInFuture) return getTranslation("times.now");
  else return insertPlaceholders(getTranslation("times.time_ago"), { time: timeValue });
}

function updateChipStats(name, chipId, gamemode) {
  // Updates what a chip does when a dropdown is clicked
  newValue = name;
  console.log([newValue, chipId, gamemode]);
  if (gamemode == "duels") {
    updateElement(chipId, generateChipStats(allDuelsStats[newValue][0]), true);
  } else if (gamemode == "bedwars") {
    if (newValue == "overall") {
      updateElement(chipId, generateChipStats(totalDreamModeStats), true);
    } else {
      console.log(newValue);
      updateElement(chipId, generateChipStats(getBedWarsModeStats(newValue)), true);
    }
  } else if (gamemode == "skywars") {
    updateElement(chipId, generateChipStats(getSkyWarsModeStats(newValue)), true);
  } else if (gamemode == "tntgames") {
    updateElement(chipId, generateChipStats(allTNTWizardStats[newValue]), true);
  } else if (gamemode == "arcade_zombies") {
    updateElement(chipId, generateChipStats(getZombiesStats(newValue)), true);
  } else if (gamemode == "arcade_seasonal") {
    updateElement(chipId, generateChipStats(getArcadeSeasonalStats(newValue)), true);
  } else if (gamemode == "arcade_hide_and_seek") {
    updateElement(chipId, generateChipStats(getArcadeHideAndSeekStats(newValue)), true);
  } else if (gamemode == "arena") {
    updateElement(chipId, generateChipStats(getArenaBrawlStats(newValue)), true);
  } else if (gamemode == "quake") {
    updateElement(chipId, generateChipStats(getQuakeStats(newValue)), true);
  } else if (gamemode == "vampirez") {
    updateElement(chipId, generateChipStats(getVampireZStats(newValue)), true);
  } else if (gamemode == "tkr") {
    updateElement(chipId, generateChipStats(getTKRStats(newValue)), true);
  } else if (gamemode == "copsandcrims_guns") {
    updateElement(chipId, generateChipStats(getCopsAndCrimsGunStats(newValue)), true);
  } else if (gamemode == "woolgames") {
    updateElement(chipId, generateChipStats(getWoolWarsStats(newValue)), true);
  } else if (gamemode == "blitz") {
    updateElement(chipId, generateChipStats(getBlitzKitsStats(newValue)), true);
  } else if (gamemode == "megawalls") {
    if (chipId == "megawalls-classes") {
      updateElement(chipId, generateChipStats(getMegaWallsClassStats(newValue)), true);
    } else if (chipId == "megawalls-standard") {
      updateElement(chipId, generateChipStats(getMegaWallsClassStats(newValue, "standard")), true);
    } else if (chipId == "megawalls-faceoff") {
      updateElement(chipId, generateChipStats(getMegaWallsClassStats(newValue, "face_off")), true);
    }
  } else if (gamemode == "warlords") {
    updateElement(chipId, generateChipStats(getWarlordsClassStats(newValue)), true);
  } else if (gamemode == "uhc") {
    updateElement(chipId, generateChipStats(getUHCModeStats(newValue)), true);
  } else if (gamemode == "speeduhc") {
    updateElement(chipId, generateChipStats(getSpeedUHCModeStats(newValue)), true);
  } else if (gamemode == "smashheroes") {
    if (chipId == "smashheroes-classes") {
      updateElement(chipId, generateChipStats(getSmashStats("class", newValue)), true);
    } else if (chipId == "smashheroes-solo") {
      updateElement(chipId, generateChipStats(getSmashStats("normal", newValue)), true);
    } else if (chipId == "smashheroes-team") {
      updateElement(chipId, generateChipStats(getSmashStats("teams", newValue)), true);
    } else if (chipId == "smashheroes-2v2") {
      updateElement(chipId, generateChipStats(getSmashStats("2v2", newValue)), true);
    } else if (chipId == "smashheroes-1v1") {
      updateElement(chipId, generateChipStats(getSmashStats("one_v_one", newValue)), true);
    } else if (chipId == "smashheroes-friend") {
      updateElement(chipId, generateChipStats(getSmashStats("friend", newValue)), true);
    }
  } else if (gamemode == "fishing") {
    if (chipId == "fishing-specialfish") {
      updateElement(chipId, generateChipStats(getSpecialFishStats(newValue)), true);
    } else if (chipId == "fishing-zones") {
      updateElement(chipId, generateChipStats(getFishingZoneStats(newValue)), true);
    } else if (chipId == "fishing-catches") {
      updateElement(chipId, generateChipStats(getFishingCatches(newValue)), true);
    } else if (chipId == "fishing-seasons") {
      const fishingSeason = fishingParticipatedSeasons.find(item => item.id === newValue);
      
      if (fishingSeason) {
        updateElement(chipId, generateChipStats(formatFishingParticipatedSeason(fishingSeason)), true);
      }
    }
  } else if (gamemode == "wizard") {
    cardWizardSettings[chipId] = newValue;
  } else if (gamemode == "settings") {
    settings[chipId] = newValue;
    updateSetting(chipId, newValue);
    if (chipId == "language") {
      document.getElementById("settings-language-reload").style.display = "block";
    }
  }
}

// TODO use swished statemetn