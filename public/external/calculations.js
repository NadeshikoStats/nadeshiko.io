function getBedWarsLevel(exp) {
  // Calculates a player's Bed Wars level based on their experience stat
  let level = 100 * Math.floor(exp / 487000);
  exp = exp % 487000;
  if (exp < 500) return level + exp / 500;
  level++;
  if (exp < 1500) return level + (exp - 500) / 1000;
  level++;
  if (exp < 3500) return level + (exp - 1500) / 2000;
  level++;
  if (exp < 7000) return level + (exp - 3500) / 3500;
  level++;
  exp -= 7000;
  return level + exp / 5000;
}


/* Determines the Cops and Crims level based on the amount of score. This doesn't use the "level" key because we need to determine the fractional amount of the level.
 * @param {number} score - The amount of score to determine the level from
 * @returns {number} The Cops and Crims level, including the fractional amount
 */
function getCopsAndCrimsLevel(score) {
  let copsAndCrimsLevels = [0, 0, 25, 75, 175, 325, 525, 775, 1075, 1425, 1825, 2325, 2925, 3625, 4425, 5325, 6325, 7575, 9075, 10825, 12825, 15025, 17425, 20025, 22825, 25825, 28825, 31825, 34825, 37825, 40825, 43825, 46825, 49825, 52825, 55825, 58825, 61825, 64825, 67825, 70825, 73825, 76825, 79825, 82825, 85825, 88825, 91825, 94825, 97825, 100825];
  let level = 0;
  for (let a = 0; a < copsAndCrimsLevels.length; a++) {
    if (score < copsAndCrimsLevels[a]) {
      break;
    }
    level = a;
  }

  // determine fractional amount of level
  let levelFraction = 0;
  if (level < copsAndCrimsLevels.length - 1) {
    levelFraction = (score - copsAndCrimsLevels[level]) / (copsAndCrimsLevels[level + 1] - copsAndCrimsLevels[level]);
  }

  return level + levelFraction;
}

function formatBedWarsLevel(level) {
  let bedWarsPrestigeColors = [
    ["7"],
    ["f"],
    ["6"],
    ["b"],
    ["2"],
    ["3"],
    ["4"],
    ["d"],
    ["9"],
    ["5"],
    ["c", "6", "e", "a", "b", "d", "5"],
    ["7", "f", "f", "f", "f", "7", "7"],
    ["7", "e", "e", "e", "e", "6", "7"],
    ["7", "b", "b", "b", "b", "5", "7"],
    ["7", "a", "a", "a", "a", "2", "7"],
    ["7", "5", "5", "5", "5", "9", "7"],
    ["7", "c", "c", "c", "c", "4", "7"],
    ["7", "d", "d", "d", "d", "5", "7"],
    ["7", "9", "9", "9", "9", "1", "7"],
    ["7", "5", "5", "5", "5", "8", "7"],
    ["8", "7", "f", "f", "7", "7", "8"],
    ["f", "f", "e", "e", "6", "6", "6"],
    ["6", "6", "f", "f", "b", "3", "3"],
    ["5", "5", "d", "d", "6", "f", "f"],
    ["b", "b", "f", "f", "7", "7", "8"],
    ["f", "f", "a", "a", "2", "2", "2"],
    ["4", "4", "c", "c", "d", "d", "5"],
    ["e", "e", "f", "f", "8", "8", "8"],
    ["a", "a", "2", "2", "6", "6", "e"],
    ["b", "b", "5", "5", "9", "9", "1"],
    ["f", "f", "6", "6", "c", "c", "4"],
    ["9", "9", "5", "5", "6", "6", "e"],
    ["c", "4", "7", "7", "4", "c", "c"],
    ["9", "9", "9", "d", "c", "c", "4"],
    ["2", "a", "d", "d", "5", "5", "2"],
    ["c", "c", "4", "4", "2", "a", "a"],
    ["a", "a", "a", "b", "9", "9", "1"],
    ["4", "4", "c", "c", "b", "3", "3"],
    ["1", "1", "b", "5", "5", "d", "1"],
    ["c", "c", "a", "a", "3", "9", "9"],
    ["5", "5", "c", "c", "6", "6", "e"],
    ["e", "e", "6", "c", "d", "d", "5"],
    ["1", "9", "3", "b", "f", "7", "7"],
    ["0", "5", "8", "8", "5", "5", "0"],
    ["2", "2", "a", "e", "6", "5", "d"],
    ["f", "f", "b", "b", "3", "3", "3"],
    ["3", "b", "e", "e", "6", "d", "5"],
    ["f", "4", "c", "c", "9", "1", "9"],
    ["5", "5", "c", "6", "f", "b", "5"],
    ["2", "a", "f", "f", "a", "a", "2"],
    ["c", "c", "5", "9", "9", "1", "0"],
  ];

  level = Math.floor(level);

  let prefixIcon;
  if (level < 1100) {
    prefixIcon = '✫';
  } else if (level < 2100) {
    prefixIcon = '✪';
  } else if (level < 3100) {
    prefixIcon = '⚝';
  } else {
    prefixIcon = '✥';
  }

  let prestige = Math.min(Math.floor(level / 100), 50);
  let levelWithIcon = "[" + level.toString() + prefixIcon + "]";
  let formattedLevel = cycleArrayBeforeChars(bedWarsPrestigeColors[prestige], levelWithIcon, "§");
  return formattedLevel;
}


/*
 * cycleArrayBeforeChars: Cycles through an array and adds items of an array before each character of a string. Useful for adding formatting codes in Bed Wars and SkyWars levels
  * @param {Array} arr - The array containing the formatting codes to cycle through
  * @param {string} str - The string (usually a level)
  * @param {string} addBefore - The string to add before each array item and character
  * @param {string} addAfter - The string to add after the array item, but before the string character (useful for bolding)
 */

function cycleArrayBeforeChars(arr, str, addBefore = "", addAfter = "") {
  let result = '';
  let arrIndex = 0;

  for (let i = 0; i < str.length; i++) {
    result += addBefore;
    result += arr[arrIndex] + addAfter + str[i];
    arrIndex = (arrIndex + 1) % arr.length;
  }

  return result;
}

function formatSkyWarsLevel(level) {
  let skyWarsPrestiges = [{ "colors": ["7"], "icon": "⋆" },{ "colors": ["f"], "icon": "✙" },{ "colors": ["6"], "icon": "❤" },{ "colors": ["b"], "icon": "☠" },{ "colors": ["2"], "icon": "✦" },{ "colors": ["5"], "icon": "✌" },{ "colors": ["c"], "icon": "❦" },{ "colors": ["d"], "icon": "✵" },{ "colors": ["9"], "icon": "❣" },{ "colors": ["5"], "icon": "☯" },{ "colors": ["c","6","e","a","b","d","5"], "icon": "✺" },{ "colors": ["7","f","f","f","7"], "icon": "✈" },{ "colors": ["4","c","c","c","4"], "icon": "⚰" },{ "colors": ["c","f","f","f","c"], "icon": "✠" },{ "colors": ["e","6","6","6","e"], "icon": "♕" },{ "colors": ["f","9","9","9","f"], "icon": "⚡︎" },{ "colors": ["f","b","b","b","f"], "icon": "⁂" },{ "colors": ["f","3","3","3","f"], "icon": "✰" },{ "colors": ["a","3","3","3","a"], "icon": "⁑" },{ "colors": ["c","e","e","e","c"], "icon": "☢" },{ "colors": ["9","1","1","1","1","9"], "icon": "✥" },{ "colors": ["6","4","4","4","4","6"], "icon": "♝" },{ "colors": ["1","b","b","b","b","1"], "icon": "♆" },{ "colors": ["8","7","7","7","7","8"], "icon": "☁" },{ "colors": ["d","5","5","5","5","d"], "icon": "⍟" },{ "colors": ["f","e","e","e","e","f"], "icon": "♗" },{ "colors": ["c","e","e","e","e","c"], "icon": "♔" },{ "colors": ["6","c","c","c","c","6"], "icon": "♞" },{ "colors": ["a","c","c","c","c","a"], "icon": "✏" },{ "colors": ["a","b","b","b","b","a"], "icon": "❈" },{ "colors": ["c","6","e","a","b","d","5"], "icon": "ಠ_ಠ" }];

  level = Math.floor(level);

  let prestige = Math.min(Math.floor(level / 5), 30);
  let levelWithIcon = "[" + level.toString() + skyWarsPrestiges[prestige]["icon"] + "]";
  let formattedLevel;

  if (level >= 150) {
    formattedLevel = cycleArrayBeforeChars(skyWarsPrestiges[prestige]["colors"], levelWithIcon, "§", "§l");
  } else {
    formattedLevel = cycleArrayBeforeChars(skyWarsPrestiges[prestige]["colors"], levelWithIcon, "§");
  }

  console.warn(formattedLevel);
  return formattedLevel;
}

function getSkyWarsLevel(exp) {
  // Calculates a player's SkyWars level based on their experience stat
  const skyWarsXp = [0, 20, 70, 150, 250, 500, 1000, 2000, 3500, 6000, 10000, 15000];
  if (exp >= 15000) {
    return (exp - 15000) / 10000 + 12;
  }
  for (a = 0; a < skyWarsXp.length; a++) {
    if (exp < skyWarsXp[a]) {
      return a + (exp - skyWarsXp[a - 1]) / (skyWarsXp[a] - skyWarsXp[a - 1]);
    }
  }
}

function getWoolGamesLevel(exp) {
  // Calculates a player's Wool Wars level based on their experience stat
  let level = 100 * Math.floor(exp / 490000) + 1;
  exp = exp % 490000;
  if (exp < 1000) return level + exp / 500;
  level++;
  if (exp < 3000) return level + (exp - 500) / 1000;
  level++;
  if (exp < 6000) return level + (exp - 1500) / 2000;
  level++;
  if (exp < 10000) return level + (exp - 3500) / 3500;
  level++;
  exp -= 10000;
  return level + exp / 5000;
}

function getBuildBattleTitle(score, includeToGo = false) {
  // Gets player's Build Battle title based on an amount of score

  let buildBattleTitles = [
    { req: 0, color: "§f", altName: getTranslation("games.modes.buildbattle.titles.rookie") },
    { req: 100, color: "§7", altName: getTranslation("games.modes.buildbattle.titles.untrained") },
    { req: 250, color: "§8", altName: getTranslation("games.modes.buildbattle.titles.amateur") },
    { req: 500, color: "§a", altName: getTranslation("games.modes.buildbattle.titles.prospect") },
    { req: 1000, color: "§2", altName: getTranslation("games.modes.buildbattle.titles.apprentice") },
    { req: 2000, color: "§b", altName: getTranslation("games.modes.buildbattle.titles.experienced") },
    { req: 3500, color: "§3", altName: getTranslation("games.modes.buildbattle.titles.seasoned") },
    { req: 5000, color: "§9", altName: getTranslation("games.modes.buildbattle.titles.trained") },
    { req: 7500, color: "§1", altName: getTranslation("games.modes.buildbattle.titles.skilled") },
    { req: 10000, color: "§5", altName: getTranslation("games.modes.buildbattle.titles.talented") },
    { req: 15000, color: "§2", altName: getTranslation("games.modes.buildbattle.titles.professional") },
    { req: 20000, color: "§c", altName: getTranslation("games.modes.buildbattle.titles.artisan") },
    { req: 30000, color: "§4", altName: getTranslation("games.modes.buildbattle.titles.expert") },
    { req: 50000, color: "§6", altName: getTranslation("games.modes.buildbattle.titles.master") },
    { req: 100000, color: "§a§l", altName: getTranslation("games.modes.buildbattle.titles.legend") },
    { req: 200000, color: "§b§l", altName: getTranslation("games.modes.buildbattle.titles.grandmaster") },
    { req: 300000, color: "§d§l", altName: getTranslation("games.modes.buildbattle.titles.celestial") },
    { req: 400000, color: "§c§l", altName: getTranslation("games.modes.buildbattle.titles.divine") },
    { req: 500000, color: "§6§l", altName: getTranslation("games.modes.buildbattle.titles.ascended") },
  ];

  let titleObject = getGenericWinsPrefix({
    wins: score,
    winsObject: buildBattleTitles,
    useToGo: includeToGo,
    useBrackets: false,
    alternativeNaming: true,
  });
  return titleObject;
}

let pitXpMap = [15, 30, 50, 75, 125, 300, 600, 800, 900, 1000, 1200, 1500, 0];
  let pitPrestiges = [100,110,120,130,140,150,175,200,250,300,400,500,600,700,800,900,1000,1200,1400,1600,1800,2000,2400,2800,3200,3600,4000,4500,5000,7500,10000,10100,10100,10100,10100,10100,20000,30000,40000,50000,75000,100000,125000,150000,175000,200000,300000,500000,1000000,5000000,10000000,];
  let pitPrestigeXp = [65950,138510,217680,303430,395760,494700,610140,742040,906930,1104780,1368580,1698330,2094030,2555680,3083280,3676830,4336330,5127730,6051030,7106230,8293330,9612330,11195130,13041730,15152130,17526330,20164330,23132080,26429580,31375830,37970830,44631780,51292730,57953680,64614630,71275580,84465580,104250580,130630580,163605580,213068080,279018080,361455580,460380580,575793080,707693080,905543080,1235293080,1894793080,5192293080,11787293080,];

  let pitPrestigeColors = ["§7", "§9", "§e", "§6", "§c", "§5", "§d", "§f", "§b", "§1", "§0", "§4", "§8"];
  let pitLevelColors = ["§7", "§9", "§3", "§2", "§a", "§e", "§6", "§c", "§4", "§5", "§d", "§f", "§b"];

  /*
   * Converts an amount of XP to a level in The Pit
  * @param {number} experience - The amount of XP to convert
  * @param {number} dataType - The type of data to return
  *   Data Types:
  *    0: Unformatted      - "[I-26]"
  *    1: Formatting codes - "§9[§eI§9-..."
  *    2: Just prestige    - 1
  *    3: Just level       - 26
  *    4: [120] of pres XP - 138510
  */
  function pitXpToLevel(experience, dataType = 1) {
    thisPrestige = 0;
    thisLevel = 120;
    xpAtLevel120 = 0;

    for (; thisPrestige < 50; thisPrestige++) {
      if (experience <= pitPrestigeXp[thisPrestige]) {
        break;
      }
    }

    xpAtLevel120 = pitPrestigeXp[thisPrestige];

    while (xpAtLevel120 > experience) {
      thisLevel = thisLevel - 1;
      xpAtLevel120 = xpAtLevel120 - Math.ceil((pitXpMap[Math.floor(thisLevel / 10)] * pitPrestiges[thisPrestige]) / 100);
    }

    thisLevelColor = pitLevelColors[Math.floor(thisLevel / 10)];
    if (thisLevel >= 60) {
      thisLevelColor += "§l";
    }

    if (thisPrestige === 0) {
      thisPrestigeColor = pitPrestigeColors[0];
    } else if (thisPrestige === 48 || thisPrestige === 49) {
      thisPrestigeColor = pitPrestigeColors[11];
    } else if (thisPrestige === 50) {
      thisPrestigeColor = pitPrestigeColors[12];
    } else {
      thisPrestigeColor = pitPrestigeColors[Math.floor(thisPrestige / 5) + 1];
    }

    if (thisLevel == 0) {
      thisLevel = 1;
    }

    if (dataType == 2) {
      return thisPrestige;
    } else if (dataType == 3) {
      return thisLevel;
    } else if (thisPrestige == 0) {
      if (dataType == 0) {
        return "[" + thisLevel + "]";
      } else if (dataType == 1) {
        return `§7[${thisLevelColor}${thisLevel}§7]`;
      }
    } else {
      if (dataType == 0) {
        return "[" + convertToRoman(thisPrestige) + "-" + thisLevel + "]";
      } else {
        return `${thisPrestigeColor}[§e${convertToRoman(thisPrestige)}-${thisLevelColor}${thisLevel}${thisPrestigeColor}]`;
      }
    }
  }