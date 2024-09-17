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
  let formattedLevel = cycleArrayBeforeChars(bedWarsPrestigeColors[prestige], levelWithIcon, true);
  return formattedLevel;
}

function cycleArrayBeforeChars(arr, str, addSection = false) {
  let result = '';
  let arrIndex = 0;

  for (let i = 0; i < str.length; i++) {
    if (addSection) {
      result += '§';
    }
    result += arr[arrIndex] + str[i];
    arrIndex = (arrIndex + 1) % arr.length;
  }

  return result;
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

let pitXpMap = [15, 30, 50, 75, 125, 300, 600, 800, 900, 1000, 1200, 1500, 0];
  let pitPrestiges = [100,110,120,130,140,150,175,200,250,300,400,500,600,700,800,900,1000,1200,1400,1600,1800,2000,2400,2800,3200,3600,4000,4500,5000,7500,10000,10100,10100,10100,10100,10100,20000,30000,40000,50000,75000,100000,125000,150000,175000,200000,300000,500000,1000000,5000000,10000000,];
  let pitPrestigeXp = [65950,138510,217680,303430,395760,494700,610140,742040,906930,1104780,1368580,1698330,2094030,2555680,3083280,3676830,4336330,5127730,6051030,7106230,8293330,9612330,11195130,13041730,15152130,17526330,20164330,23132080,26429580,31375830,37970830,44631780,51292730,57953680,64614630,71275580,84465580,104250580,130630580,163605580,213068080,279018080,361455580,460380580,575793080,707693080,905543080,1235293080,1894793080,5192293080,11787293080,];

  let pitPrestigeColors = ["§7", "§9", "§e", "§6", "§c", "§5", "§d", "§f", "§b", "§1", "§0", "§4", "§8"];
  let pitLevelColors = ["§7", "§9", "§3", "§2", "§a", "§e", "§6", "§c", "§4", "§5", "§d", "§f", "§b"];

  /* 
   * Converts an amount of XP to a level in The Pit
  * @param {number} experience - The amount of XP to convert
  * @param {number} data_type - The type of data to return
  *   Data Types:
  *    0: Unformatted      - "[I-26]"
  *    1: Formatting codes - "§9[§eI§9-..."
  *    2: Just prestige    - 1
  *    3: Just level       - 26
  *    4: [120] of pres XP - 138510
  */
  function pitXpToLevel(experience, data_type) {
    x_prestige = 0;
    x_level = 120;
    x_120level = 0;

    for (; x_prestige < 50; x_prestige++) {
      if (experience <= pitPrestigeXp[x_prestige]) {
        break;
      }
    }

    x_120level = pitPrestigeXp[x_prestige];

    while (x_120level > experience) {
      x_level = x_level - 1;
      x_120level = x_120level - Math.ceil((pitXpMap[Math.floor(x_level / 10)] * pitPrestiges[x_prestige]) / 100);
    }

    x_levelcolor = pitLevelColors[Math.floor(x_level / 10)];
    if (x_level >= 60) {
      x_levelcolor += "§l";
    }

    if (x_prestige === 0) {
      x_prestigecolor = pitPrestigeColors[0];
    } else if (x_prestige === 48 || x_prestige === 49) {
      x_prestigecolor = pitPrestigeColors[11];
    } else if (x_prestige === 50) {
      x_prestigecolor = pitPrestigeColors[12];
    } else {
      x_prestigecolor = pitPrestigeColors[Math.floor(x_prestige / 5) + 1];
    }

    if (level == 0) {
      level = 1;
    }

    if (data_type == 2) {
      return x_prestige;
    } else if (data_type == 3) {
      return x_level;
    } else if (x_prestige == 0) {
      if (data_type == 0) {
        return "[" + x_level + "]";
      } else if (data_type == 1) {
        return `§7[${x_levelcolor}${x_level}§7]`;
      }
    } else {
      if (data_type == 0) {
        return "[" + convertToRoman(x_prestige) + "-" + x_level + "]";
      } else {
        return `${x_prestigecolor}[§e${convertToRoman(x_prestige)}-${x_levelcolor}${x_level}${x_prestigecolor}]`;
      }
    }
  }