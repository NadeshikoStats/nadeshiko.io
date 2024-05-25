var bedWarsStats, totalDreamModeStats, duelsStats, arcadeStats, arenaStats, paintballStats, quakeStats, vampireZStats, wallsStats, tkrStats, copsAndCrimsStats, blitzStats, megaWallsStats, warlordsStats, woolWarsNumericalStats;
var allDuelsStats = {};
var allTNTWizardStats = {};

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
      element.innerHTML = value;
    } else {
      element.textContent = value;
    }
  }
}

function locale(number, digits = 2) {
  return number.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function smallDuration(seconds, ms = false) {
  // Converts a number of seconds into a human-readable duration of time
  if (seconds == -1 || seconds == undefined || isNaN(seconds)) {
    return "N/A";
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
    return `${years}y ${days}d`;
  } else if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secondsMod}s`;
  } else {
    return `${ms ? checkAndFormat(seconds, 3) : secondsMod}s`;
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

function generateNetwork() {
  // Inserts general/network stats into the DOM
  var profileStats = playerData["profile"];
  var dateNow = new Date();

  if (profileStats != undefined) {
    var playerRank = profileStats["tag"];
    var playerRankCute = cuteRank(playerRank, 1);

    document.getElementById("card-rank").classList.add("rank-" + playerRankCute[0]); // Changes the rank to the player's rank colour
    document.getElementById("card-name").style.color = `var(--mc` + playerRankCute[0] + `)`; // Changes the player's name to the player's rank colour
    document.getElementById("quick-mode-username").style.color = `var(--mc` + playerRankCute[0] + `)`;

    updateElement("card-uuid", playerData["uuid"]);
    updateElement("card-ranktext", playerRankCute[1], true); // Adds player's rank

    if (playerRankCute[1] == "") {
      document.getElementById("card-rank").style.display = "none";
    }

    updateElement("card-name", playerData["name"]);
    updateElement("quick-mode-username", playerData["name"]);
    updateElement("header-name", cuteRank(profileStats["tagged_name"], 0), true);
    updateElement("achievement-points", profileStats["achievement_points"].toLocaleString());
    updateElement("karma", profileStats["karma"].toLocaleString());
    updateElement("quests-completed", profileStats["quests_completed"].toLocaleString());
    updateElement("ranks-gifted", und(profileStats["ranks_gifted"]).toLocaleString());
    updateElement("multiplier", profileStats["coin_multiplier"].toLocaleString());

    firstLoginDate = new Date(profileStats["first_login"]); // Used for birthday calculation
    updateElement("first-login", firstLoginDate.toLocaleDateString()); // Gets first login in Unix time and turns it into a date
    updateElement("first-login-ago", `(${relativeTime(firstLoginDate)})`, true);
    updateElement(
      "first-login-ago-full",
      new Intl.DateTimeFormat("default", {
        dateStyle: "long",
        timeStyle: "long",
      }).format(new Date(firstLoginDate))
    );

    if (firstLoginDate.getMonth() == dateNow.getMonth() && firstLoginDate.getDate() == dateNow.getDate() && firstLoginDate.getYear() != dateNow.getYear()) {
      document.getElementById("birthday").style.display = "initial"; // Makes the birthday cake visible if it's your Hypixel anniversary!
      updateElement("birthday-text", `Happy ${ordinal(dateNow.getYear() - firstLoginDate.getYear())} Hypixel anniversary!`);
      console.log("Happy anniversary!");
    }

    lastLogin = profileStats["last_login"];
    lastLoginDate = new Date(lastLogin);
    if (lastLogin == 0) document.getElementById("last-login-container").style.display = "none";
    else {
      updateElement("last-login", lastLoginDate.toLocaleDateString());
      updateElement("last-login-ago", `(${relativeTime(lastLoginDate)})`);
      updateElement(
        "last-login-ago-full",
        new Intl.DateTimeFormat("default", {
          dateStyle: "long",
          timeStyle: "long",
        }).format(lastLoginDate)
      );
    }

    if (playerData["status"]["online"]) {
      // Checks player's online status
      updateElement("online-status", "Currently Online!");
      document.getElementById("online-status").style.color = "var(--mca)";

      document.getElementById("online-status-wrapper").classList.add("tooltip");

      // If the player is online, show the game and mode

      let gameType = gameNames[playerData["status"]["game"]];
      let gameModes = gameType["modeNames"] || {};

      let gameMode = "";
      if (playerData["status"]["mode"] == "LOBBY") {
        gameMode = "Lobby";
      } else {
        gameMode = gameModes[playerData["status"]["mode"]] || "";
      }

      if (gameMode != "") {
        gameMode = " – " + gameMode;
      }

      updateElement("online-status-location", gameType["name"] + gameMode);
    } else updateElement("online-status", "Currently Offline");

    if (playerData["guild"] == undefined) {
      console.log(playerData);
      document.getElementById("guild-stats").style.display = "none";
      document.getElementById("card-guild").style.display = "none";
    } else {
      guildStats = playerData["guild"];
      updateElement("guild-name", guildStats["name"]);
      updateElement("guild-tag", generateMinecraftText(guildStats["tag"]), true);
      updateElement("card-guild", generateMinecraftText(guildStats["tag"]), true);
      updateElement("guild-level", Math.floor(guildStats["level"]).toLocaleString());
      updateElement("guild-members", guildStats["members"].toLocaleString());
      updateElement("guild-joined", new Date(guildStats["joined"]).toLocaleDateString());
      updateElement("guild-joined-ago", `(${relativeTime(new Date(guildStats["joined"]))})`);
      updateElement(
        "guild-joined-ago-full",
        new Intl.DateTimeFormat("default", {
          dateStyle: "long",
          timeStyle: "long",
        }).format(new Date(guildStats["joined"]))
      );
    }

    hypixelLevel = profileStats["network_level"];
    updateElement("level", Math.floor(hypixelLevel).toLocaleString());
    if (hypixelLevel >= 250) {
      document.getElementById("level-container").style.color = "var(--gold-transparent)";
      document.getElementById("level").style.color = "var(--gold)";
    }

    var xpProgress = ((hypixelLevel % 1) * 100).toFixed(0) + "%"; // Sets user's XP progress and progress bar
    document.getElementById("xp-progress-bar").style.width = xpProgress;
    updateElement("xp-progress-number", xpProgress);

    let socialMediaList = profileStats["social_media"] || {};
    if (Object.keys(socialMediaList).length != 0) {
      document.getElementById("social-media-button").classList.remove("unloaded");
      document.getElementById("social-media-dropdown-container").style.display = "flex";
    }
    var socials = ["HYPIXEL", "YOUTUBE", "TWITTER", "TIKTOK", "TWITCH", "DISCORD"];
    for (a = 0; a < socials.length; a++) {
      // Iterates through social media and hides icons that don't exist for the player
      if (socialMediaList[socials[a]] == undefined) {
        document.getElementById("social-" + socials[a].toLowerCase()).style.display = "none";
        document.getElementById("social-" + socials[a].toLowerCase() + "-alternative").style.display = "none";
      } else if (socials[a] != "DISCORD") {
        socialMediaNew = socialMediaList[socials[a]];
        socialMediaNewUrl = !/^https?:\/\//i.test(socialMediaNew) ? `https://${socialMediaNew}` : socialMediaNew; // Adds HTTPS to the URL if it doesn't have it already

        document.getElementById("sociallink-" + socials[a].toLowerCase()).href = socialMediaNewUrl;
        document.getElementById("social-" + socials[a].toLowerCase() + "-alternative").href = socialMediaNewUrl;
      } else {
        updateElement("social-discord-username", socialMediaList[socials[a]]);
        updateElement("social-discord-username-alternative", socialMediaList[socials[a]]);
      }
    }

    const quickModeGames = [
      { id: "network", name: "Network", minecraftId: "hypixel_logo" },
      { id: "arcade", name: "Arcade", minecraftId: "slime_ball" },
      { id: "bedwars", name: "Bed Wars", minecraftId: "red_bed" },
      { id: "blitz", name: "Blitz", minecraftId: "diamond_sword" },
      { id: "buildbattle", name: "Build Battle", minecraftId: "crafting_table" },
      { id: "classic", name: "Classic Games", minecraftId: "jukebox" },
      { id: "copsandcrims", name: "Cops and Crims", minecraftId: "iron_bars" },
      { id: "duels", name: "Duels", minecraftId: "fishing_rod" },
      { id: "megawalls", name: "Mega Walls", minecraftId: "soul_sand" },
      { id: "murdermystery", name: "Murder Mystery", minecraftId: "bow" },
      { id: "pit", name: "Pit", minecraftId: "dirt" },
      { id: "skywars", name: "SkyWars", minecraftId: "ender_eye" },
      { id: "smashheroes", name: "Smash Heroes", minecraftId: "head_smashheroes" },
      { id: "tntgames", name: "TNT Games", minecraftId: "tnt" },
      { id: "uhc", name: "UHC", minecraftId: "golden_apple" },
      { id: "warlords", name: "Warlords", minecraftId: "stone_axe" },
      { id: "woolwars", name: "Wool Wars", minecraftId: "white_wool" },
    ];

    const quickModeGameContainer = document.getElementById("quick-mode-games");
    const gameSwitchMobileContainer = document.getElementById("game-switch-mobile");
    const gameSwitchContainer = document.getElementById("game-switch");

    quickModeGames.forEach((game) => {
      if (game.id != "network") {
        const spanTooltip = document.createElement("span");
        spanTooltip.className = "tooltip";

        const img = document.createElement("img");
        img.src = `/img/icon/hypixel/${game.id}.webp`;
        img.alt = "";
        img.className = "quick-mode-game";
        img.onclick = function () {
          switchStats(game.id);
        };

        const spanText = document.createElement("span");
        spanText.className = "tooltiptext";
        spanText.textContent = game.name;

        spanTooltip.appendChild(img);
        spanTooltip.appendChild(spanText);
        quickModeGameContainer.appendChild(spanTooltip);
      }
    });

    let headerGames = ["network", "bedwars", "duels", "skywars"];
    quickModeGames.forEach((game, index) => {
      let container = document.createElement("div");
      container.setAttribute("onclick", `switchStats('${game.id}')`);
      container.setAttribute("aria-label", `View ${game.name} stats`);

      let span = document.createElement("span");
      span.className = "logo-container";

      let img = document.createElement("img");
      if (game.id == "network") {
        img.src = `/img/logo/hypixel_logo.${imageFileType}`;
      } else {
        img.src = `/img/icon/minecraft/${game.minecraftId}.${imageFileType}`;
      }
      img.alt = "";
      img.classList.add("social-media-dropdown", "icon");

      span.appendChild(img);
      container.appendChild(span);

      let text = document.createTextNode(game.name);
      container.appendChild(text);

      if (headerGames.includes(game.id)) {
        gameSwitchMobileContainer.appendChild(container);
      } else {
        gameSwitchContainer.appendChild(container);
      }
    });

    generateBedWars();
    generateDuels();
    generateSkyWars();
    generateBuildBattle();
    generateMurderMystery();
    generateTNTGames();
    generateArcade();
    generatePit();
    generateClassic();
    generateCopsAndCrims();
    generateBlitz();
    generateMegaWalls();
    generateWarlords();
    generateWoolGames();

    addRecentPlayer(playerData["name"], playerRankCute[0]);
  } else {
    // If no Hypixel stats, hide most buttons and show a warning
    document.getElementById("general-bottom-bar").style.display = "none";
    updateElement("card-name", playerData["name"]);
    updateElement("header-name", playerData["name"]);
    document.getElementById("game-buttons").style.display = "none";
    document.getElementById("card-ranktext").style.display = "none";
    document.getElementById("card-guild").style.display = "none";
    document.getElementById("online-status").style.display = "none";
    document.getElementById("real-stats").style.display = "none";
    document.getElementById("network-error").style.display = "unset";

    document.getElementById("player-card").style.paddingLeft = "0px";
    document.getElementById("player-card").style.paddingRight = "0px";
    document.getElementById("player-card").style.paddingBottom = "0px";
    document.getElementById("extended-card").style.marginBottom = "0px";
    addRecentPlayer(playerData["name"]);
  }
}

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

function convertToRoman(num) {
  const romanNumerals = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  };

  let result = "";

  for (const numeral in romanNumerals) {
    const count = Math.floor(num / romanNumerals[numeral]);
    num -= count * romanNumerals[numeral];
    result += numeral.repeat(count);
  }

  return result;
}

function linearGradient(colors) {
  // Generates a linear gradient based on an array of hex colour or Minecraft colour code inputs
  var gradient = "linear-gradient(90deg";
  var colorsLength = colors.length;
  if (colorsLength == 1) {
    if (colors[0].length == 1) {
      gradient += `, var(--mc${colors[0]}) 0%, var(--mc${colors[0]}) 100%`;
    } else {
      gradient += `, ${colors[0]} 0%, ${colors[0]} 100%`;
    }
  } else {
    colors.forEach((color, index) => {
      const position = (index / (colorsLength - 1)) * 100;
      if (color.length == 1) {
        gradient += `, var(--mc${color}) ${position}%`;
      } else {
        gradient += `, ${color} ${position}%`;
      }
    });
  }
  gradient += ")";
  return gradient;
}

function generateBedWars() {
  // Generates stats and chips for Bed Wars
  bedWarsStats = playerData["stats"]["Bedwars"] || {};
  if (bedWarsStats != undefined) {
    var modes = ["eight_one", "eight_two", "four_three", "four_four", "two_four"];
    var modeNames = ["Solos", "Doubles", "Threes", "Fours", "4v4"];
    var dreamModes = [
      ["Overall", "overall"],
      ["Armed Doubles", "eight_two_armed"],
      ["Armed Fours", "four_four_armed"],
      ["Lucky Doubles", "eight_two_lucky"],
      ["Lucky Fours", "four_four_lucky"],
      ["Rush Doubles", "eight_two_rush"],
      ["Rush Fours", "four_four_rush"],
      ["Swap Doubles", "eight_two_swap"],
      ["Swap Fours", "four_four_swap"],
      ["Ultimate Doubles", "eight_two_ultimate"],
      ["Ultimate Fours", "four_four_ultimate"],
      ["Underworld Doubles", "eight_two_underworld"],
      ["Underworld Fours", "four_four_underworld"],
      ["Voidless Doubles", "eight_two_voidless"],
      ["Voidless Fours", "four_four_voidless"],
    ];
    var easyStats = ["wins", "losses", "kills", "deaths", "final_kills", "final_deaths", "beds_broken", "beds_lost"];

    var bedWarsPrestigeColors = [
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
      ["6", "6", "f", "f", "b", "5", "5"],
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

    let bedWarsLevel = getBedWarsLevel(und(bedWarsStats["Experience"]));

    let prefixIcon;
    if (bedWarsLevel < 1100) {
      prefixIcon = '✫';
    } else if (bedWarsLevel < 2100) {
      prefixIcon = '✪';
    } else if (bedWarsLevel < 3100) {
      prefixIcon = '⚝';
    } else {
      prefixIcon = '✥';
    }

    updateElement("bed-wars-level", checkAndFormat(Math.floor(bedWarsLevel)) + prefixIcon);
    document.getElementById("bed-wars-level").style.background = linearGradient(bedWarsPrestigeColors[Math.floor(Math.max(bedWarsLevel / 100), 49)]);
    document.getElementById("bed-wars-xp-progress-bar").style.width = ((bedWarsLevel % 1) * 100).toFixed(0) + "%";
    updateElement("bed-wars-xp-progress-number", ((bedWarsLevel % 1) * 100).toFixed(0) + "%");

    var bedWarsChips = [];

    for (e = 0; e < easyStats.length; e++) {
      updateElement("bed-wars-overall-" + easyStats[e], checkAndFormat(bedWarsStats[easyStats[e] + "_bedwars"]));
    }
    updateElement("bed-wars-overall-winstreak", checkAndFormat(bedWarsStats["winstreak"]));
    updateElement("bed-wars-overall-wlr", calculateRatio(bedWarsStats["wins_bedwars"], bedWarsStats["losses_bedwars"]));
    updateElement("bed-wars-overall-kdr", calculateRatio(bedWarsStats["kills_bedwars"], bedWarsStats["deaths_bedwars"]));
    updateElement("bed-wars-overall-fkdr", calculateRatio(bedWarsStats["final_kills_bedwars"], bedWarsStats["final_deaths_bedwars"]));
    updateElement("bed-wars-overall-bblr", calculateRatio(bedWarsStats["beds_broken_bedwars"], bedWarsStats["beds_lost_bedwars"]));
    updateElement("bed-wars-tokens", checkAndFormat(bedWarsStats["coins"]));
    updateElement("bed-wars-challenges-completed", checkAndFormat(bedWarsStats["total_challenges_completed"]));

    updateElement("bed-wars-unique-challenges-completed", `(` + checkAndFormat(bedWarsStats["bw_unique_challenges_completed"]) + `/30 unique)`);

    if (bedWarsStats["bw_unique_challenges_completed"] == 30) {
      document.getElementById("bed-wars-unique-challenges-completed").style.color = `var(--gold)`;
    }

    if (bedWarsStats["slumber"] != undefined) {
      updateElement("bed-wars-slumber-tickets", checkAndFormat(bedWarsStats["slumber"]["tickets"]));
    }

    for (a = 0; a < modes.length; a++) {
      // Regular stats
      let bedWarsChip = [
        "bed-wars-stats-" + modeNames[a].toLowerCase(), // ID
        modeNames[a], // Title
        "", // Subtitle (none)
        `/img/games/bedwars/${modeNames[a].toLowerCase()}.${imageFileType}`, // Image
        getBedWarsModeStats(modes[a]), // Displayed stats
        [], // Other stats (shown in drop-down menu) (none here)
        "", // Icon
        "bedwars", // Gamemode (used for dropdowns)
      ];
      bedWarsChips.push(bedWarsChip);
    }

    var totalDreamModeStatsCounts = [0, 0, 0, 0, 0, 0, 0, 0]; // Loops through all the Dreams mode stats to get overall Dreams stats
    var dreamModeWinstreak = 0;
    for (f = 0; f < dreamModes.length; f++) {
      for (g = 0; g < easyStats.length; g++) {
        totalDreamModeStatsCounts[g] += und(bedWarsStats[dreamModes[f][1] + "_" + easyStats[g] + "_bedwars"]);
      }
      winstreakTest = und(bedWarsStats[dreamModes[f][1] + "_" + easyStats[g]]);
      if (winstreakTest > dreamModeWinstreak) {
        dreamModeWinstreak = winstreakTest;
      }
    }

    totalDreamModeStats = [
      [true, ["Winstreak", checkAndFormat(dreamModeWinstreak)]],
      [false, ["Wins", checkAndFormat(totalDreamModeStatsCounts[0])], ["Losses", checkAndFormat(totalDreamModeStatsCounts[1])], ["W/L R", calculateRatio(totalDreamModeStatsCounts[0], totalDreamModeStatsCounts[1], 2)]],
      [false, ["Kills", checkAndFormat(totalDreamModeStatsCounts[2])], ["Deaths", checkAndFormat(totalDreamModeStatsCounts[3])], ["K/D R", calculateRatio(totalDreamModeStatsCounts[2], totalDreamModeStatsCounts[3], 2)]],
      [false, ["Final Kills", checkAndFormat(totalDreamModeStatsCounts[4])], ["Final Deaths", checkAndFormat(totalDreamModeStatsCounts[5])], ["FK/D R", calculateRatio(totalDreamModeStatsCounts[4], totalDreamModeStatsCounts[5], 2)]],
      [false, ["Bed Breaks", checkAndFormat(totalDreamModeStatsCounts[6])], ["Bed Losses", checkAndFormat(totalDreamModeStatsCounts[7])], ["BB/L R", calculateRatio(totalDreamModeStatsCounts[6], totalDreamModeStatsCounts[7], 2)]],
    ];

    bedWarsChips.push([
      // Generates the Dreams mode chip
      "bed-wars-stats-dreams",
      "Dreams",
      "",
      `/img/games/404.${imageFileType}`,
      totalDreamModeStats,
      dreamModes,
      "",
      "bedwars",
    ]);

    generateChips(bedWarsChips, "bed-wars-chips");
  }
}

function generateSkyWars() {
  skyWarsStats = playerData["stats"]["SkyWars"] || {};
  if (skyWarsStats != undefined) {
    if (skyWarsStats["levelFormatted"] != undefined) {
      updateElement("skywars-level", generateMinecraftText(skyWarsStats["levelFormatted"]), true);
    } else {
      let skyWarsLevels = [
        { req: 0, color: "§7" },
        { req: 5, color: "§f" },
        { req: 10, color: "§6" },
        { req: 15, color: "§b" },
        { req: 20, color: "§2" },
        { req: 25, color: "§3" },
        { req: 30, color: "§4" },
        { req: 35, color: "§d" },
        { req: 40, color: "§9" },
        { req: 45, color: "§5" },
        { req: 50, color: "rainbow" },
      ]

      let skywarsEstimatedExperience = und(skyWarsStats["wins"]) * 10 + und(skyWarsStats["kills"]);
      let skyWarsEstimatedLevel = Math.floor(getSkyWarsLevel(skywarsEstimatedExperience));

      updateElement("skywars-level", getGenericWinsPrefix(skyWarsEstimatedLevel, skyWarsLevels, undefined, false, "⋆", false, false), true);

    }

    easyStats = ["kills", "deaths", "wins", "losses", "coins", "cosmetic_tokens", "chests_opened", "heads"];
    for (e = 0; e < easyStats.length; e++) {
      updateElement("skywars-overall-" + easyStats[e], checkAndFormat(skyWarsStats[easyStats[e]]));
    }

    skyWarsLevel = getSkyWarsLevel(und(skyWarsStats["skywars_experience"]));
    document.getElementById("skywars-xp-progress-bar").style.width = (skyWarsLevel % 1) * 100 + "%";
    updateElement("skywars-xp-progress-number", ((skyWarsLevel % 1) * 100).toFixed(0) + "%");

    updateElement("skywars-overall-kdr", calculateRatio(skyWarsStats["kills"], skyWarsStats["deaths"]));
    updateElement("skywars-overall-wlr", calculateRatio(skyWarsStats["wins"], skyWarsStats["losses"]));
    updateElement("skywars-overall-playtime", smallDuration(und(skyWarsStats["time_played"])));

    updateElement(
      "skywars-overall-corruption-chance",
      und(skyWarsStats["angel_of_death_level"]) + und(skyWarsStats["angels_offering"]) + (skyWarsStats["packages"] != undefined ? skyWarsStats["packages"].includes("favor_of_the_angel") : 0) + "%"
    );

    skyWarsChips = [];
    skyWarsStatsToShow = [
      [
        "Solo",
        "solo",
        [
          ["Overall", "solo"],
          ["Normal", "solo_normal"],
          ["Insane", "solo_insane"],
        ],
      ],
      [
        "Team",
        "team",
        [
          ["Overall", "team"],
          ["Normal", "team_normal"],
          ["Insane", "team_insane"],
        ],
      ],
      ["Mega", "mega", []],
      ["Lab", "lab", []],
    ];

    for (a = 0; a < skyWarsStatsToShow.length; a++) {
      // Regular stats
      let skyWarsChip = [
        "skywars-stats-" + skyWarsStatsToShow[a][1], // ID
        skyWarsStatsToShow[a][0], // Title
        "", // Subtitle (none)
        `/img/games/404.${imageFileType}`, // Image
        getSkyWarsModeStats(skyWarsStatsToShow[a][1]), // Displayed stats
        skyWarsStatsToShow[a][2], // Other stats (shown in drop-down menu)
        "", // Icon
        "skywars", // Gamemode (used for dropdowns)
      ];
      skyWarsChips.push(skyWarsChip);
    }

    for (d = 0; d < skyWarsChips.length; d++) {
      generateChip(skyWarsChips[d], d % 2 == 0 ? "skywars-chips-1" : "skywars-chips-2");
    }
  }
}

function getBedWarsModeStats(mode) {
  return [
    [true, ["Winstreak", checkAndFormat(bedWarsStats[mode + "_winstreak"])]],
    [
      false,
      ["Wins", checkAndFormat(bedWarsStats[mode + "_wins_bedwars"])],
      ["Losses", checkAndFormat(bedWarsStats[mode + "_losses_bedwars"])],
      ["W/L R", calculateRatio(bedWarsStats[mode + "_wins_bedwars"], bedWarsStats[mode + "_losses_bedwars"], 2)],
    ],
    [
      false,
      ["Kills", checkAndFormat(bedWarsStats[mode + "_kills_bedwars"])],
      ["Deaths", checkAndFormat(bedWarsStats[mode + "_deaths_bedwars"])],
      ["K/D R", calculateRatio(bedWarsStats[mode + "_kills_bedwars"], bedWarsStats[mode + "_deaths_bedwars"], 2)],
    ],
    [
      false,
      ["Final Kills", checkAndFormat(bedWarsStats[mode + "_final_kills_bedwars"])],
      ["Final Deaths", checkAndFormat(bedWarsStats[mode + "_final_deaths_bedwars"])],
      ["FK/D R", calculateRatio(bedWarsStats[mode + "_final_kills_bedwars"], bedWarsStats[mode + "_final_deaths_bedwars"], 2)],
    ],
    [
      false,
      ["Bed Breaks", checkAndFormat(bedWarsStats[mode + "_beds_broken_bedwars"])],
      ["Bed Losses", checkAndFormat(bedWarsStats[mode + "_beds_lost_bedwars"])],
      ["BB/L R", calculateRatio(bedWarsStats[mode + "_beds_broken_bedwars"], bedWarsStats[mode + "_beds_lost_bedwars"], 2)],
    ],
  ];
}

function getSkyWarsModeStats(mode) {
  return [
    [false, ["Wins", checkAndFormat(skyWarsStats["wins_" + mode])], ["Losses", checkAndFormat(skyWarsStats["losses_" + mode])], ["W/L R", calculateRatio(skyWarsStats["wins_" + mode], skyWarsStats["losses_" + mode], 2)]],
    [false, ["Kills", checkAndFormat(skyWarsStats["kills_" + mode])], ["Deaths", checkAndFormat(skyWarsStats["deaths_" + mode])], ["K/D R", calculateRatio(skyWarsStats["kills_" + mode], skyWarsStats["deaths_" + mode], 2)]],
  ];
}

function getZombiesStats(map) {
  if (map == "overall") {
    map = "";
  } else {
    map = "_" + map;
  }

  return [
    [false, ["Wins", checkAndFormat(arcadeStats["wins_zombies" + map])]],
    [
      false,
      ["Kills", checkAndFormat(arcadeStats["zombie_kills_zombies" + map])],
      ["Deaths", checkAndFormat(arcadeStats["deaths_zombies" + map])],
      ["K/D R", calculateRatio(arcadeStats["zombie_kills_zombies" + map], arcadeStats["deaths_zombies" + map])],
    ],
    [
      false,
      ["Downs", checkAndFormat(arcadeStats["times_knocked_down_zombies" + map])],
      ["Revives", checkAndFormat(arcadeStats["players_revived_zombies" + map])],
      ["Rounds Survived", checkAndFormat(arcadeStats["total_rounds_survived_zombies" + map])],
    ],
    [false, ["Doors Opened", checkAndFormat(arcadeStats["doors_opened_zombies" + map])], ["Windows Repaired", checkAndFormat(arcadeStats["windows_repaired_zombies" + map])]],
  ];
}

function getArcadeHideAndSeekStats(mode) {
  if (mode == "overall") {
    mode = "";
  } else {
    mode = mode + "_";
  }

  return [
    [false, ["Wins", sumStatsBasic([mode + "hider_wins_hide_and_seek", mode + "seeker_wins_hide_and_seek"], arcadeStats)]],
    [false, ["Wins (Hider)", checkAndFormat(arcadeStats[mode + "hider_wins_hide_and_seek"])], ["Wins (Seeker)", checkAndFormat(arcadeStats[mode + "seeker_wins_hide_and_seek"])]],
    // party_pooper_seeker_wins_hide_and_seek
  ];
}

function getArenaBrawlStats(mode) {
  let arenaWinPrefixes = [
    { req: 0, internalId: "dark_gray", color: "§8" },
    { req: 500, internalId: "gray", color: "§7" },
    { req: 1000, internalId: "green", color: "§a" },
    { req: 2000, internalId: "dark_green", color: "§2" },
    { req: 3000, internalId: "pink", color: "§d" },
    { req: 4000, internalId: "purple", color: "§5" },
    { req: 5000, internalId: "red", color: "§c" },
    { req: 7500, internalId: "dark_red", color: "§4" },
    { req: 10000, internalId: "gold", color: "§6" },
    { req: 15000, internalId: "rainbow", color: "rainbow" },
  ];

  let arenaModeStats = [];
  let formattedArenaModeStats = [];
  if (mode == "overall") {
    arenaModeStats = sumStats(["wins", "losses", "kills", "deaths", "damage", "healed"], ["1v1", "2v2", "4v4"], arenaStats, "_", true);
  } else {
    arenaModeStats = [und(arenaStats["wins_" + mode]), und(arenaStats["losses_" + mode]), und(arenaStats["kills_" + mode]), und(arenaStats["deaths_" + mode]), und(arenaStats["damage_" + mode]), und(arenaStats["healed_" + mode])];
    console.log(arenaModeStats);
  }

  for (let a = 0; a < arenaModeStats.length; a++) {
    formattedArenaModeStats[a] = checkAndFormat(arenaModeStats[a]);
  }

  if (mode == "overall") {
    formattedArenaModeStats[0] = getGenericWinsPrefix(arenaModeStats[0], arenaWinPrefixes, arenaStats["prefix_color"], false);
  }

  return [
    [false, ["Coins", checkAndFormat(arenaStats["coins"])]],
    [false, ["Wins", formattedArenaModeStats[0]], ["Losses", formattedArenaModeStats[1]], ["W/L R", calculateRatio(arenaModeStats[0], arenaModeStats[1])]],
    [false, ["Kills", formattedArenaModeStats[2]], ["Deaths", formattedArenaModeStats[3]], ["K/D R", calculateRatio(arenaModeStats[2], arenaModeStats[3])]],
    [false, ["Damage Dealt", formattedArenaModeStats[4] + " HP"], ["Damage Healed", formattedArenaModeStats[5] + " HP"]],
    [false, ["Magical Keys", checkAndFormat(arenaStats["keys"])], ["Magical Chests", checkAndFormat(arenaStats["magical_chest"])]],
  ];
}

function getTKRStats(mode) {
  let tkrTitles = [
    { req: 0, color: "§8", internalId: "dark_gray" },
    { req: 5, color: "§7", internalId: "gray" },
    { req: 25, color: "§f", internalId: "white" },
    { req: 50, color: "§b", internalId: "aqua" },
    { req: 100, color: "§a", internalId: "green" },
    { req: 200, color: "§e", internalId: "yellow" },
    { req: 300, color: "§9", internalId: "blue" },
    { req: 400, color: "§d", internalId: "pink" },
    { req: 500, color: "§6", internalId: "gold" },
    { req: 750, color: "§2", internalId: "dark_green" },
    { req: 1000, color: "§1", internalId: "dark_blue" },
    { req: 2500, color: "§5", internalId: "purple" },
    { req: 5000, color: "§4", internalId: "dark_red" },
    { req: 10000, color: "§0", internalId: "black" },
  ];

  if (mode == "overall") {
    let tkrGamesPlayed = sumStatsBasic(["retro_plays", "canyon_plays", "junglerush_plays", "hypixelgp_plays", "olympus_plays"], tkrStats);

    return [
      [false, ["Coins", checkAndFormat(tkrStats["coins"])]],
      [false, ["Trophies", checkAndFormat(sumStatsBasic(["gold_trophy", "silver_trophy", "bronze_trophy"], tkrStats))], ["Laps", checkAndFormat(tkrStats["laps_completed"])]],
      [false, ["Golds", getGenericWinsPrefix(tkrStats["gold_trophy"], tkrTitles, tkrStats["prefix_color"], false, "✪")], ["Silvers", checkAndFormat(tkrStats["silver_trophy"])], ["Bronzes", checkAndFormat(tkrStats["bronze_trophy"])]],
      [false, ["Games Played", locale(tkrGamesPlayed, 0)], ["Trophy Rate", checkAndFormat((sumStatsBasic(["gold_trophy", "silver_trophy", "bronze_trophy"], tkrStats) / tkrGamesPlayed) * 100, 1) + "%"]],
      [false, ["Box Pickups", checkAndFormat(tkrStats["box_pickups"])], ["Coins Picked Up", checkAndFormat(tkrStats["coins_picked_up"])]],
    ];
  } else {
    let tkrGamesPlayed = und(tkrStats[mode + "_plays"]);
    mode = "_" + mode;

    return [
      [false, ["Coins", checkAndFormat(tkrStats["coins"])]],
      [false, ["Trophies", checkAndFormat(sumStatsBasic(["gold_trophy" + mode, "silver_trophy" + mode, "bronze_trophy" + mode], tkrStats))]],
      [false, ["Golds", checkAndFormat(tkrStats["gold_trophy" + mode])], ["Silvers", checkAndFormat(tkrStats["silver_trophy" + mode])], ["Bronzes", checkAndFormat(tkrStats["bronze_trophy" + mode])]],
      [false, ["Games Played", locale(tkrGamesPlayed, 0)], ["Trophy Rate", checkAndFormat((sumStatsBasic(["gold_trophy" + mode, "silver_trophy" + mode, "bronze_trophy" + mode], tkrStats) / tkrGamesPlayed) * 100, 1) + "%"]],
      [false, ["Box Pickups", checkAndFormat(tkrStats["box_pickups" + mode])]],
    ];
  }
}

function getVampireZStats(mode) {
  if (mode == "human") {
    let vampireZWinPrefixes = [
      { req: 0, color: "§8" },
      { req: 20, color: "§7" },
      { req: 50, color: "§f" },
      { req: 100, color: "§6" },
      { req: 150, color: "§e" },
      { req: 200, color: "§2" },
      { req: 250, color: "§a" },
      { req: 300, color: "§5" },
      { req: 500, color: "§d" },
      { req: 750, color: "§1" },
      { req: 1000, color: "§1§l" },
      { req: 1500, color: "§9§l" },
      { req: 2000, color: "§3§l" },
      { req: 2500, color: "§b§l" },
      { req: 3000, color: "§c§l" },
      { req: 5000, color: "§4§l" },
      { req: 10000, color: "§0§l" },
      { req: 15000, color: "rainbow" },
    ];

    return [
      [false, ["Coins", checkAndFormat(vampireZStats["coins"])]],
      [false, ["Wins", getGenericWinsPrefix(und(vampireZStats["human_wins"]), vampireZWinPrefixes, undefined, false)]],
      [false, ["Vampire Kills", checkAndFormat(vampireZStats["vampire_kills"])], ["Deaths", checkAndFormat(vampireZStats["human_deaths"])], ["K/D R", calculateRatio(vampireZStats["vampire_kills"], vampireZStats["human_deaths"])]],
      [false, ["Zombie Kills", checkAndFormat(vampireZStats["zombie_kills"])], ["Most Vampire Kills", checkAndFormat(vampireZStats["most_vampire_kills_new"])]],
    ];
  } else {
    let vampireZWinPrefixes = [
      { req: 0, color: "§8" },
      { req: 50, color: "§f" },
      { req: 100, color: "§e" },
      { req: 250, color: "§a" },
      { req: 500, color: "§d" },
      { req: 750, color: "§b" },
      { req: 1000, color: "§c" },
      { req: 1500, color: "§6" },
      { req: 2000, color: "§3" },
      { req: 2500, color: "§a" },
      { req: 3000, color: "§2" },
      { req: 5000, color: "§9" },
      { req: 7500, color: "§1" },
      { req: 10000, color: "§1§l" },
      { req: 20000, color: "§4" },
      { req: 30000, color: "§4§l" },
      { req: 40000, color: "§5§l" },
      { req: 50000, color: "§0§l" },
      { req: 100000, color: "rainbow", bold: true },
    ];

    return [
      [false, ["Coins", checkAndFormat(vampireZStats["coins"])]],
      [false, ["Wins", checkAndFormat(vampireZStats["vampire_wins"])]],
      [
        false,
        ["Human Kills", getGenericWinsPrefix(und(vampireZStats["human_kills"]), vampireZWinPrefixes, undefined, false)],
        ["Deaths", checkAndFormat(vampireZStats["vampire_deaths"])],
        ["K/D R", calculateRatio(vampireZStats["human_kills"], vampireZStats["vampire_deaths"])],
      ],
    ];
  }
}

function getQuakeStats(mode) {
  let quakeTitles = [
    { req: 0, color: "§8" },
    { req: 25000, color: "§7" },
    { req: 50000, color: "§f" },
    { req: 75000, color: "§2" },
    { req: 100000, color: "§e" },
    { req: 200000, color: "§a" },
    { req: 300000, color: "§9" },
    { req: 400000, color: "§3" },
    { req: 500000, color: "§d" },
    { req: 600000, color: "§5" },
    { req: 750000, color: "§c" },
    { req: 1000000, color: "§6" },
    { req: 2000000, color: "§0" },
  ];

  let quakeModeStats = [];
  if (mode == "overall") {
    quakeModeStats = sumStats(["kills", "deaths", "wins", "headshots", "killstreaks", "shots_fired", "distance_travelled"], ["", "_teams"], quakeStats, "", true);
    return [
      [false, ["Coins", checkAndFormat(quakeStats["coins"])]],
      [false, ["Wins", checkAndFormat(quakeModeStats[2])]],
      [false, ["Kills", getGenericWinsPrefix(quakeModeStats[0], quakeTitles, undefined, false)], ["Deaths", checkAndFormat(quakeModeStats[1]), ["K/D R", calculateRatio(quakeModeStats[0], quakeModeStats[1])]]],
      [false, ["Headshots", checkAndFormat(quakeModeStats[3])], ["Killstreaks", checkAndFormat(quakeModeStats[4])]],
      [false, ["Shots", checkAndFormat(quakeModeStats[5])], ["Distance Travelled", checkAndFormat(quakeModeStats[6]) + "m"]],
      [false, ["Godlikes", checkAndFormat(playerAchievements["quake_godlikes"])]],
    ];
  } else {
    return [
      [false, ["Coins", checkAndFormat(quakeStats["coins"])]],
      [false, ["Wins", checkAndFormat(quakeStats["wins" + mode])]],
      [false, ["Kills", checkAndFormat(quakeStats["kills" + mode])], ["Deaths", checkAndFormat(quakeStats["deaths" + mode]), ["K/D R", calculateRatio(quakeStats["kills" + mode], quakeStats["deaths" + mode])]]],
      [false, ["Headshots", checkAndFormat(quakeStats["headshots" + mode])], ["Killstreaks", checkAndFormat(quakeStats["killstreaks" + mode])]],
      [false, ["Shots", checkAndFormat(quakeStats["shots_fired" + mode])], ["Distance Travelled", checkAndFormat(quakeStats["distance_travelled" + mode]) + "m"]],
      [false, ["Godlikes", checkAndFormat(playerAchievements["quake_godlikes"])]],
    ];
  }
}

function getArcadeSeasonalStats(game) {
  if (game == "overall") {
    return [
      [false, ["Wins", checkAndFormat(sumStats(["wins"], ["santa_simulator", "scuba_simulator", "halloween_simulator", "grinch_simulator_v2", "easter_simulator"], arcadeStats, "_", true))]],
      [false, ["Items Found", checkAndFormat(sumStatsBasic(["delivered_santa_simulator", "items_found_scuba_simulator", "candy_found_halloween_simulator", "gifts_grinch_simulator_v2", "eggs_found_easter_simulator"], arcadeStats))]],
    ];
  } else {
    if (game == "grinch_simulator_v2") {
      return [
        [false, ["Wins", checkAndFormat(arcadeStats["wins_grinch_simulator_v2"])]],
        [false, ["Gifts Stolen", checkAndFormat(arcadeStats["gifts_grinch_simulator_v2"])]],
      ];
    } else if (game == "scuba_simulator") {
      return [
        [false, ["Wins", checkAndFormat(arcadeStats["wins_scuba_simulator"])]],
        [false, ["Items Found", checkAndFormat(arcadeStats["items_found_scuba_simulator"])], ["Total Points", checkAndFormat(arcadeStats["total_points_scuba_simulator"])]],
      ];
    } else if (game == "santa_simulator") {
      return [
        [false, ["Wins", checkAndFormat(arcadeStats["wins_santa_simulator"])]],
        [false, ["Gifts Delivered", checkAndFormat(arcadeStats["delivered_santa_simulator"])], ["Times Spotted", checkAndFormat(arcadeStats["spotted_santa_simulator"])]],
      ];
    } else if (game == "halloween_simulator") {
      return [
        [false, ["Wins", checkAndFormat(arcadeStats["wins_halloween_simulator"])]],
        [false, ["Candy Found", checkAndFormat(arcadeStats["candy_found_halloween_simulator"])]],
      ];
    } else if (game == "easter_simulator") {
      return [
        [false, ["Wins", checkAndFormat(arcadeStats["wins_easter_simulator"])]],
        [false, ["Eggs Found", checkAndFormat(arcadeStats["eggs_found_easter_simulator"])]],
      ];
    }
  }
}

function getDuelsStats(mode, is_bridge = false, cuteName) {
  importedDuelsStats = [
    checkAndFormat(duelsStats["current_winstreak_mode_" + mode]),
    checkAndFormat(duelsStats["best_winstreak_mode_" + mode]),
    checkAndFormat(duelsStats[mode + "_wins"]),
    checkAndFormat(duelsStats[mode + "_losses"]),
    calculateRatio(duelsStats[mode + "_wins"], duelsStats[mode + "_losses"]),
  ];

  if (is_bridge) {
    // Bridge uses a different wins counter
    importedDuelsStats.push(checkAndFormat(duelsStats[mode + "_bridge_kills"]), checkAndFormat(duelsStats[mode + "_bridge_deaths"]), calculateRatio(duelsStats[mode + "_bridge_kills"], duelsStats[mode + "_bridge_deaths"]));
  } else {
    importedDuelsStats.push(checkAndFormat(duelsStats[mode + "_kills"]), checkAndFormat(duelsStats[mode + "_deaths"]), calculateRatio(duelsStats[mode + "_kills"], duelsStats[mode + "_deaths"]));
  }

  return [
    [
      [true, ["Winstreak", importedDuelsStats[0]], ["Best Winstreak", importedDuelsStats[1]]],
      [false, ["Wins", importedDuelsStats[2]], ["Losses", importedDuelsStats[3]], ["W/L R", importedDuelsStats[4]]],
      [false, ["Kills", importedDuelsStats[5]], ["Deaths", importedDuelsStats[6]], ["K/D R", importedDuelsStats[7]]],
    ],
    getDuelsTitle(und(duelsStats[mode + "_wins"]), cuteName),
  ];
}

function getDuelsOverallModeStats(modeArray, is_bridge = false, cuteName) {
  if (is_bridge) {
    roundRobinDuelsStatNames = ["wins", "losses", "bridge_kills", "bridge_deaths"];
  } else {
    roundRobinDuelsStatNames = ["wins", "losses", "kills", "deaths"];
  }

  roundRobinDuelsStatReverseNames = ["current_winstreak_mode", "best_winstreak_mode"];

  roundRobinDuelsStats = sumStats(roundRobinDuelsStatNames, modeArray, duelsStats);
  roundRobinDuelsStats2 = maxStats(roundRobinDuelsStatReverseNames, modeArray, duelsStats, "_", true);

  importedDuelsStats = [];

  return [
    [
      [true, ["Winstreak", checkAndFormat(roundRobinDuelsStats2[0])], ["Best Winstreak", checkAndFormat(roundRobinDuelsStats2[1])]],
      [false, ["Wins", checkAndFormat(roundRobinDuelsStats[0])], ["Losses", checkAndFormat(roundRobinDuelsStats[1])], ["W/L R", calculateRatio(roundRobinDuelsStats[0], roundRobinDuelsStats[1])]],
      [false, ["Kills", checkAndFormat(roundRobinDuelsStats[2])], ["Deaths", checkAndFormat(roundRobinDuelsStats[3])], ["K/D R", calculateRatio(roundRobinDuelsStats[2], roundRobinDuelsStats[3])]],
    ],
    getDuelsTitle(und(roundRobinDuelsStats[0]), cuteName),
  ];
}

function sumStats(statNames, modeNames, statArray, separator = "_", statNamesFirst = false) {
  // Checks and adds stats, round-robin style
  // Usage example: sumStats(["wins", "losses"], ["uhc_duel", "uhc_doubles", "uhc_four"], duelsStats, "_", false)
  statSum = Array(statNames.length).fill(0);
  for (aRow = 0; aRow < statNames.length; aRow++) {
    for (aCol = 0; aCol < modeNames.length; aCol++) {
      if (statNamesFirst) {
        statSum[aRow] += und(statArray[statNames[aRow] + separator + modeNames[aCol]]);
      } else {
        statSum[aRow] += und(statArray[modeNames[aCol] + separator + statNames[aRow]]);
      }
    }
  }
  return statSum;
}

function sumStatsBasic(statNames, statArray) {
  // Adds stats and returns a result
  let statSum = 0;
  for (a = 0; a < statNames.length; a++) {
    statSum += und(statArray[statNames[a]]);
  }
  return statSum;
}

function maxStats(statNames, modeNames, statArray, separator = "_", reverse = false) {
  // Determines the maximum value of a stat, round-robin style
  statMax = Array(statNames.length).fill(0);
  for (aRow = 0; aRow < statNames.length; aRow++) {
    for (aCol = 0; aCol < modeNames.length; aCol++) {
      var testStat;
      if (reverse) {
        testStat = und(statArray[statNames[aRow] + separator + modeNames[aCol]]);
      } else {
        testStat = und(modeNames[aCol] + separator + statArray[statNames[aRow]]);
      }
      if (testStat > statMax[aRow]) {
        statMax[aRow] = testStat;
      }
    }
  }
  return statMax;
}

function generateDuels() {
  // Generates stats and chips for Duels
  duelsStats = playerData["stats"]["Duels"] || {};
  if (duelsStats != undefined) {
    duelsChips = [];

    let easyStats = ["wins", "losses", "kills", "deaths", "current_winstreak", "best_overall_winstreak", "coins", "melee_swings"];
    for (e = 0; e < easyStats.length; e++) {
      updateElement("duels-overall-" + easyStats[e], checkAndFormat(duelsStats[easyStats[e]]));
    }

    updateElement("duels-overall-kdr", calculateRatio(duelsStats["kills"], duelsStats["deaths"]));
    updateElement("duels-overall-wlr", calculateRatio(duelsStats["wins"], duelsStats["losses"]));
    updateElement("duels-overall-damage-dealt", checkAndFormat(duelsStats["damage_dealt"] / 2) + ` ♥&#xFE0E;`, true);

    overallDuelsTitle = getDuelsTitle(und(duelsStats["wins"]));

    let winsToGo = overallDuelsTitle[1];
    let formattedWinsToGo;

    if (winsToGo == -1) {
      formattedWinsToGo = ``;
    } else if (winsToGo == -2) {
      formattedWinsToGo = `(MAXED!!!)`;
    } else {
      formattedWinsToGo = `(${checkAndFormat(winsToGo)} to go` + (winsToGo == 1 ? `!)` : `)`);
    }

    updateElement("duels-overall-title", overallDuelsTitle[0], true);
    updateElement("duels-overall-to-go", formattedWinsToGo);
    duelsProgress = (overallDuelsTitle[2] - overallDuelsTitle[1]) / overallDuelsTitle[2];
    updateElement("duels-overall-progress-number", Math.floor(duelsProgress * 100) + "%");
    document.getElementById("duels-overall-progress-bar").style.width = Math.floor(duelsProgress * 100) + "%";

    var duelsModes = [
      ["UHC 1v1", "uhc_duel", "uhc", false],
      ["UHC 2v2", "uhc_doubles", "uhc", false],
      ["UHC 4v4", "uhc_four", "uhc", false],
      ["UHC Deathmatch", "uhc_meetup", "uhc", false],
      ["OP 1v1", "op_duel", "op", false],
      ["OP 2v2", "op_doubles", "op", false],
      ["SkyWars 1v1", "sw_duel", "sw", false],
      ["SkyWars 2v2", "sw_doubles", "sw", false],
      ["Bow", "bow_duel", "bow", false],
      ["Blitz", "blitz_duel", "blitz", false],
      ["Mega Walls", "mw_duel", "mw", false],
      ["Mega Walls Doubles", "mw_doubles", "mw", false],
      ["Sumo", "sumo_duel", "sumo", false],
      ["Bow Spleef", "bowspleef_duel", "bowspleef", false],
      ["Parkour", "parkour_eight", "parkour", false],
      ["Boxing", "boxing_duel", "boxing", false],
      ["Classic", "classic_duel", "classic", false],
      ["NoDebuff", "potion_duel", "nodebuff", false],
      ["Combo", "combo_duel", "combo", false],
      ["Bridge 1v1", "bridge_duel", "bridge", true],
      ["Bridge 2v2", "bridge_doubles", "bridge", true],
      ["Bridge 3v3", "bridge_threes", "bridge", true],
      ["Bridge 4v4", "bridge_four", "bridge", true],
      ["Bridge 2v2v2v2", "bridge_2v2v2v2", "bridge", true],
      ["Bridge 3v3v3v3", "bridge_3v3v3v3", "bridge", true],
      ["Bridge CTF 3v3", "capture_threes", "bridge", true],
      ["Duel Arena", "duel_arena", "arena", false],
    ];

    var duelsWithMultipleModes = [
      ["bridge", "Bridge", ["bridge_duel", "bridge_doubles", "bridge_threes", "bridge_four", "bridge_2v2v2v2", "bridge_3v3v3v3", "capture_threes"]],
      ["mw", "Mega Walls", ["mw_duel", "mw_doubles"]],
      ["sw", "SkyWars", ["sw_duel", "sw_doubles"]],
      ["op", "OP", ["op_duel", "op_doubles"]],
      ["uhc", "UHC", ["uhc_duel", "uhc_doubles"]],
    ];

    var duelsStatsToShow = [
      [
        "bridge",
        "Bridge",
        [
          ["Overall", "bridge"],
          ["1v1", "bridge_duel"],
          ["2v2", "bridge_doubles"],
          ["3v3", "bridge_threes"],
          ["4v4", "bridge_four"],
          ["2v2v2v2", "bridge_2v2v2v2"],
          ["3v3v3v3", "bridge_3v3v3v3"],
          ["CTF 3v3", "capture_threes"],
        ],
        "blue_terracotta",
      ],
      [
        "sw",
        "SkyWars",
        [
          ["Overall", "sw"],
          ["1v1", "sw_duel"],
          ["2v2", "sw_doubles"],
        ],
        "ender_eye",
      ],
      ["classic_duel", "Classic", [], "fishing_rod"],
      [
        "uhc",
        "UHC",
        [
          ["Overall", "uhc"],
          ["1v1", "uhc_duel"],
          ["2v2", "uhc_doubles"],
          ["4v4", "uhc_four"],
          ["Deathmatch", "uhc_meetup"],
        ],
        "head_uhc",
      ],
      ["sumo_duel", "Sumo", [], "slime_ball"],
      ["parkour_eight", "Parkour", [], "feather"],
      ["blitz_duel", "Blitz", [], "diamond_sword"],
      ["bow_duel", "Bow", [], "bow"],
      [
        "mw",
        "Mega Walls",
        [
          ["Overall", "mw"],
          ["1v1", "mw_duel"],
          ["2v2", "mw_doubles"],
        ],
        "soul_sand",
      ],
      ["bowspleef_duel", "Bow Spleef", [], "tnt"],
      [
        "op",
        "OP",
        [
          ["Overall", "op"],
          ["1v1", "op_duel"],
          ["2v2", "op_doubles"],
        ],
        "diamond_chestplate",
      ],
      ["combo_duel", "Combo", [], "potion_weakness"],
      ["boxing_duel", "Boxing", [], "head_boxing"],
      ["potion_duel", "Nodebuff", [], "potion_fire_resistance"],
      ["duel_arena", "Arena", [], "beacon"],
    ];

    for (a = 0; a < duelsModes.length; a++) {
      allDuelsStats[duelsModes[a][1]] = getDuelsStats(duelsModes[a][1], duelsModes[a][3], duelsModes[a][0]);
    }
    for (a = 0; a < duelsWithMultipleModes.length; a++) {
      allDuelsStats[duelsWithMultipleModes[a][0]] = getDuelsOverallModeStats(duelsWithMultipleModes[a][2], duelsWithMultipleModes[a][0] === "bridge", duelsWithMultipleModes[a][1]);
    }

    for (a = 0; a < duelsStatsToShow.length; a++) {
      // Regular stats
      currentDuel = duelsStatsToShow[a];
      currentDuelPrefix = allDuelsStats[currentDuel[0]][1];

      winsToGo = currentDuelPrefix[1];
      let formattedWinsToGo;

      if (winsToGo == -1) {
        formattedWinsToGo = ``;
      } else if (winsToGo == -2) {
        formattedWinsToGo = `(MAXED!!!)`;
      } else {
        formattedWinsToGo = `(${checkAndFormat(winsToGo)} to go` + (winsToGo == 1 ? `!)` : `)`);
      }

      duelsChip = [
        "duels-stats-" + currentDuel[0], // ID
        currentDuel[1], // Title
        `${currentDuelPrefix[0]} ${formattedWinsToGo}`, // Subtitle (none)
        `/img/games/404.${imageFileType}`, // Background image
        allDuelsStats[currentDuel[0]][0], // Displayed stats
        currentDuel[2], // Other stats (shown in drop-down menu)
        `/img/icon/minecraft/${currentDuel[3]}.${imageFileType}`, // Chip image
        "duels", // gamemode
      ];
      duelsChips.push(duelsChip);
    }

    for (d = 0; d < duelsChips.length; d++) {
      generateChip(duelsChips[d], d % 2 == 0 ? "duels-chips-1" : "duels-chips-2");
    }
  }
}

function generateBuildBattle() {
  // Generates stats and chips for Build Battle

  let buildBattleStats = playerData["stats"]["BuildBattle"] || {};
  if (buildBattleStats != undefined) {
    buildBattleTitle = getBuildBattleTitle(und(buildBattleStats["score"]));
    updateElement("buildbattle-overall-title", buildBattleTitle[0], true);
    updateElement("buildbattle-overall-to-go", buildBattleTitle[1] == -1 ? `(Max title!)` : `(${checkAndFormat(buildBattleTitle[1])} to go)`);
    updateElement("buildbattle-overall-progress-number", Math.floor(buildBattleTitle[2] * 100) + "%");
    document.getElementById("buildbattle-overall-progress-bar").style.width = buildBattleTitle[2] * 100 + "%";

    updateElement("buildbattle-overall-losses", locale(und(buildBattleStats["games_played"]) - und(buildBattleStats["wins"]), 0));
    updateElement("buildbattle-overall-wlr", calculateRatio(buildBattleStats["wins"], und(buildBattleStats["games_played"]) - und(buildBattleStats["wins"])));
    updateElement("buildbattle-overall-highest-score", checkAndFormat(playerAchievements["buildbattle_build_battle_points"]));

    let easyStats = ["score", "wins", "total_votes", "coins"];
    for (e = 0; e < easyStats.length; e++) {
      updateElement("buildbattle-overall-" + easyStats[e], checkAndFormat(buildBattleStats[easyStats[e]]));
    }

    let buildBattleModes = [
      ["Solo", "solo_normal", []],
      ["Teams", "teams_normal", []],
      ["Pro", "solo_pro", []],
      ["Guess The Build", "guess_the_build", []],
    ];

    buildBattleChips = [];
    for (a = 0; a < buildBattleModes.length; a++) {
      currentBuildBattleMode = buildBattleModes[a];

      buildBattleModeStats = [[false, ["Wins", checkAndFormat(buildBattleStats[`wins_${currentBuildBattleMode[1]}`])]]];

      if (currentBuildBattleMode[1] == "guess_the_build") {
        buildBattleModeStats[0].push(["Correct Guesses", checkAndFormat(buildBattleStats[`correct_guesses`])]);
      }

      buildBattleChip = [
        "buildbattle-stats-" + buildBattleModes[a][1], // ID
        buildBattleModes[a][0], // Title
        ``, // Subtitle (none)
        `/img/games/404.${imageFileType}`, // Background image
        buildBattleModeStats, // Displayed stats
        [], // Other stats (shown in drop-down menu)
        ``, // Chip image
        "buildbattle", // gamemode
      ];
      buildBattleChips.push(buildBattleChip);
    }

    for (d = 0; d < buildBattleChips.length; d++) {
      generateChip(buildBattleChips[d], d % 2 == 0 ? "buildbattle-chips-1" : "buildbattle-chips-2");
    }
  }
}

function generateMurderMystery() {
  // Generates stats and chips for Murder Mystery
  let murderMysteryStats = playerData["stats"]["MurderMystery"] || {};
  if (murderMysteryStats != undefined) {
    let easyStats = ["kills", "deaths", "wins", "coins", "coins_pickedup", "murderer_wins", "detective_wins", "kills_as_murderer", "was_hero"];

    for (e = 0; e < easyStats.length; e++) {
      updateElement("murdermystery-overall-" + easyStats[e], checkAndFormat(murderMysteryStats[easyStats[e]]));
    }

    updateElement("murdermystery-overall-losses", checkAndFormat(murderMysteryStats["games"] - murderMysteryStats["wins"]));
    updateElement("murdermystery-overall-wlr", calculateRatio(murderMysteryStats["wins"], murderMysteryStats["games"] - murderMysteryStats["wins"]));
    updateElement("murdermystery-overall-kdr", checkAndFormat(murderMysteryStats["games"] - murderMysteryStats["wins"]));

    updateElement("murdermystery-overall-quickest_murderer_win_time_seconds", smallDuration(und(murderMysteryStats["quickest_murderer_win_time_seconds"])));
    updateElement("murdermystery-overall-quickest_detective_win_time_seconds", smallDuration(und(murderMysteryStats["quickest_detective_win_time_seconds"])));

    murderMysteryModes = [
      ["Classic", "MURDER_CLASSIC", []],
      ["Double Up!", "MURDER_DOUBLE_UP", []],
      ["Assassins", "MURDER_ASSASSINS", []],
      ["Infection", "MURDER_INFECTION", []],
    ];
    murderMysteryChips = [];

    for (a = 0; a < murderMysteryModes.length; a++) {
      currentMurderMysteryMode = murderMysteryModes[a];

      let murderMysteryModeStats;

      murderMysteryModeStats = [
        [
          false,
          ["Wins", checkAndFormat(murderMysteryStats[`wins_${currentMurderMysteryMode[1]}`])],
          ["Losses", checkAndFormat(murderMysteryStats[`games_${currentMurderMysteryMode[1]}`] - murderMysteryStats[`wins_${currentMurderMysteryMode[1]}`])],
          ["W/L R", calculateRatio(murderMysteryStats[`wins_${currentMurderMysteryMode[1]}`], murderMysteryStats[`games_${currentMurderMysteryMode[1]}`] - murderMysteryStats[`wins_${currentMurderMysteryMode[1]}`])],
        ],
        [
          false,
          ["Kills", checkAndFormat(murderMysteryStats[`wins_${currentMurderMysteryMode[1]}`])],
          ["Deaths", checkAndFormat(murderMysteryStats[`deaths_${currentMurderMysteryMode[1]}`])],
          ["K/D R", calculateRatio(checkAndFormat(murderMysteryStats[`kills_${currentMurderMysteryMode[1]}`]), checkAndFormat(murderMysteryStats[`deaths_${currentMurderMysteryMode[1]}`]))],
        ],
      ];

      if (currentMurderMysteryMode[1] == "MURDER_CLASSIC" || currentMurderMysteryMode[1] == "MURDER_DOUBLE_UP") {
        murderMysteryModeStats.push(
          [false, ["Wins (Murderer)", checkAndFormat(murderMysteryStats[`murderer_wins_${currentMurderMysteryMode[1]}`])], ["Wins (Detective)", checkAndFormat(murderMysteryStats[`detective_wins_${currentMurderMysteryMode[1]}`])]],
          [false, ["Kills (Murderer)", checkAndFormat(murderMysteryStats[`kills_as_murderer_${currentMurderMysteryMode[1]}`])], ["Wins (Hero)", checkAndFormat(murderMysteryStats[`was_hero_${currentMurderMysteryMode[1]}`])]]
        );
      } else if (currentMurderMysteryMode[1] == "MURDER_ASSASSINS") {
        // idk
      } else if (currentMurderMysteryMode[1] == "MURDER_INFECTION") {
        murderMysteryModeStats.push(
          [
            false,
            ["Wins (Survivor)", checkAndFormat(murderMysteryStats[`survivor_wins_${currentMurderMysteryMode[1]}`])],
            ["Total Time Survived", smallDuration(und(murderMysteryStats[`total_time_survived_seconds_${currentMurderMysteryMode[1]}`]))],
          ],
          [false, ["Kills (Infected)", checkAndFormat(murderMysteryStats[`kills_as_infected_${currentMurderMysteryMode[1]}`])], ["Kills (Survivor)", checkAndFormat(murderMysteryStats[`kills_as_survivor_${currentMurderMysteryMode[1]}`])]]
        );
      }

      murderMysteryModeStats.push([false, ["Gold Picked Up", checkAndFormat(murderMysteryStats[`coins_pickedup_${currentMurderMysteryMode[1]}`])]]);

      murderMysteryChip = [
        "murdermystery-stats-" + currentMurderMysteryMode[1], // ID
        currentMurderMysteryMode[0], // Title
        ``, // Subtitle (none)
        `/img/games/404.${imageFileType}`, // Background image
        murderMysteryModeStats, // Displayed stats
        [], // Other stats (shown in drop-down menu)
        ``, // Chip image
        "murdermystery", // gamemode
      ];
      murderMysteryChips.push(murderMysteryChip);
    }

    for (d = 0; d < murderMysteryChips.length; d++) {
      generateChip(murderMysteryChips[d], d % 2 == 0 ? "murdermystery-chips-1" : "murdermystery-chips-2");
    }
  }
}

function generateTNTGames() {
  // Generates stats and chips for TNT Games
  let tntGamesStats = playerData["stats"]["TNTGames"] || {};
  if (tntGamesStats != undefined) {
    let easyStats = ["wins", "coins"];

    for (e = 0; e < easyStats.length; e++) {
      updateElement("tntgames-overall-" + easyStats[e], checkAndFormat(tntGamesStats[easyStats[e]]));
    }

    // Get kills, deaths with sumStats
    let tntGamesKills = sumStats(["kills"], ["tntrun", "pvprun", "tntag", "capture", "bowspleef"], tntGamesStats, "_", true);
    let tntGamesDeaths = sumStats(["deaths"], ["tntrun", "pvprun", "tntag", "capture", "bowspleef"], tntGamesStats, "_", true);

    updateElement("tntgames-overall-kills", checkAndFormat(tntGamesKills));
    updateElement("tntgames-overall-deaths", checkAndFormat(tntGamesDeaths));
    updateElement("tntgames-overall-kdr", calculateRatio(tntGamesKills, tntGamesDeaths));
    updateElement("tntgames-overall-playtime", smallDuration(playerAchievements["tntgames_tnt_triathlon"] * 60));
  }

  const tntGamesLowPrefixes = [
    { req: 0, internalId: "dark_gray", color: "§8" },
    { req: 15, internalId: "gray", color: "§7" },
    { req: 50, internalId: "white", color: "§f" },
    { req: 100, internalId: "dark_green", color: "§2" },
    { req: 250, internalId: "green", color: "§a" },
    { req: 500, internalId: "blue", color: "§9" },
    { req: 1000, internalId: "dark_purple", color: "§5" },
    { req: 1500, internalId: "gold", color: "§6" },
    { req: 2000, internalId: "red", color: "§c" },
    { req: 5000, internalId: "black", color: "§0" },
    { req: 10000, internalId: "rainbow", color: "rainbow" },
  ];

  const tntGamesHighPrefixes = [
    { req: 0, internalId: "dark_gray", color: "§8" },
    { req: 25, internalId: "gray", color: "§7" },
    { req: 100, internalId: "white", color: "§f" },
    { req: 250, internalId: "dark_green", color: "§2" },
    { req: 500, internalId: "green", color: "§a" },
    { req: 1000, internalId: "blue", color: "§9" },
    { req: 2500, internalId: "dark_purple", color: "§5" },
    { req: 5000, internalId: "gold", color: "§6" },
    { req: 7500, internalId: "red", color: "§c" },
    { req: 10000, internalId: "black", color: "§0" },
    { req: 15000, internalId: "rainbow", color: "rainbow" },
  ];

  let tntRunCard = [
    "tntgames-stats-tntrun", // ID
    "TNT Run", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    [
      [
        false,
        ["Wins", getGenericWinsPrefix(tntGamesStats["wins_tntrun"], tntGamesHighPrefixes, tntGamesStats["prefix_tntrun"], false, "")],
        ["Losses", checkAndFormat(tntGamesStats["deaths_tntrun"])],
        ["W/L R", calculateRatio(tntGamesStats["wins_tntrun"], tntGamesStats["deaths_tntrun"])],
      ],
      [false, ["Blocks Ran", checkAndFormat(playerAchievements["tntgames_block_runner"])], ["Best Time", smallDuration(und(tntGamesStats["record_tntrun"]))]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    "/img/icon/minecraft/diamond_boots.png", // Chip image
    "tntgames", // gamemode
  ];

  let pvpRunCard = [
    "tntgames-stats-pvprun", // ID
    "PvP Run", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    [
      [
        false,
        ["Wins", getGenericWinsPrefix(tntGamesStats["wins_pvprun"], tntGamesHighPrefixes, tntGamesStats["prefix_pvprun"], false, "")],
        ["Losses", checkAndFormat(tntGamesStats["deaths_pvprun"])],
        ["W/L R", calculateRatio(tntGamesStats["wins_pvprun"], tntGamesStats["deaths_pvprun"])],
      ],
      [false, ["Kills", checkAndFormat(tntGamesStats["kills_pvprun"])], ["Deaths", checkAndFormat(tntGamesStats["deaths_pvprun"])], ["K/D R", calculateRatio(tntGamesStats["kills_pvprun"], tntGamesStats["deaths_pvprun"])]],
      [false, ["Best Time", smallDuration(und(tntGamesStats["record_pvprun"]))]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    "/img/icon/minecraft/iron_sword.png", // Chip image
    "tntgames", // gamemode
  ];

  let tntTagCard = [
    "tntgames-stats-tntag", // ID
    "TNT Tag", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    [
      [
        false,
        ["Wins", getGenericWinsPrefix(tntGamesStats["wins_tntag"], tntGamesLowPrefixes, tntGamesStats["prefix_tntag"], false, "")],
        ["Losses", checkAndFormat(tntGamesStats["deaths_tntag"])],
        ["W/L R", calculateRatio(tntGamesStats["wins_tntag"], tntGamesStats["deaths_tntag"])],
      ],
      [false, ["Kills", checkAndFormat(tntGamesStats["kills_tntag"])], ["Deaths", checkAndFormat(tntGamesStats["deaths_tntag"])], ["K/D R", calculateRatio(tntGamesStats["kills_tntag"], tntGamesStats["deaths_tntag"])]],
      [false, ["Tags", checkAndFormat(playerAchievements["tntgames_clinic"])], ["Powerups", checkAndFormat(playerAchievements["tntgames_the_upper_hand"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    "/img/icon/minecraft/tnt.png", // Chip image
    "tntgames", // gamemode
  ];

  let bowSpleefCard = [
    "tntgames-stats-bowspleef", // ID
    "Bow Spleef", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    [
      [
        false,
        ["Wins", getGenericWinsPrefix(tntGamesStats["wins_bowspleef"], tntGamesHighPrefixes, tntGamesStats["prefix_bowspleef"], false, "")],
        ["Losses", checkAndFormat(tntGamesStats["deaths_bowspleef"])],
        ["W/L R", calculateRatio(tntGamesStats["wins_bowspleef"], tntGamesStats["deaths_bowspleef"])],
      ],
      [false, ["Arrows Shot", checkAndFormat(tntGamesStats["tags_bowspleef"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    "/img/icon/minecraft/bow.png", // Chip image
    "tntgames", // gamemode
  ];

  let wizardsList = [
    ["Overall", "overall", `/img/icon/minecraft/tnt.${imageFileType}`],
    ["Ancient", "new_ancientwizard", `/img/icon/minecraft/magma_cream.${imageFileType}`],
    ["Arcane", "arcane_wizard", `/img/icon/minecraft/disc_11.${imageFileType}`],
    ["Blood", "new_bloodwizard", `/img/icon/minecraft/bone.${imageFileType}`],
    ["Fire", "new_firewizard", `/img/icon/minecraft/blaze_rod.${imageFileType}`],
    ["Hydro", "new_hydrowizard", `/img/icon/minecraft/lapis_lazuli.${imageFileType}`],
    ["Ice", "new_icewizard", `/img/icon/minecraft/diamond_hoe.${imageFileType}`],
    ["Kinetic", "new_kineticwizard", `/img/icon/minecraft/iron_hoe.${imageFileType}`],
    ["Storm", "new_stormwizard", `/img/icon/minecraft/gold_sword.${imageFileType}`],
    ["Toxic", "new_toxicwizard", `/img/icon/minecraft/ghast_tear.${imageFileType}`],
    ["Wither", "new_witherwizard", `/img/icon/minecraft/gold_axe.${imageFileType}`],
  ];

  let totalWizardStats = sumStats(
    ["kills", "deaths", "healing", "damage_taken", "assists"],
    wizardsList.map((x) => x[1]),
    tntGamesStats,
    "_",
    false
  );

  allTNTWizardStats["overall"] = [
    [false, ["Overall Wins", getGenericWinsPrefix(tntGamesStats["wins_capture"], tntGamesHighPrefixes, tntGamesStats["prefix_capture"], false, "")], ["Overall Captures", checkAndFormat(tntGamesStats["points_capture"])]],
    [false, ["Kills", checkAndFormat(totalWizardStats[0])], ["Deaths", checkAndFormat(totalWizardStats[1])], ["K/D R", calculateRatio(totalWizardStats[0], totalWizardStats[1])]],
    [false, ["Healing", checkAndFormat(totalWizardStats[2] / 2) + ` ♥&#xFE0E;`], ["Damage Taken", checkAndFormat(totalWizardStats[3] / 2) + ` ♥&#xFE0E;`], ["Assists", checkAndFormat(tntGamesStats["assists_capture"])]],
  ];

  for (let a = 1; a < wizardsList.length; a++) {
    thisWizard = wizardsList[a][1];

    allTNTWizardStats[thisWizard] = [
      [false, ["Overall Wins", getGenericWinsPrefix(tntGamesStats["wins_capture"], tntGamesHighPrefixes, tntGamesStats["prefix_capture"], false, "")], ["Overall Captures", checkAndFormat(tntGamesStats["points_capture"])]],
      [
        false,
        ["Kills", checkAndFormat(tntGamesStats[thisWizard + "_kills"])],
        ["Deaths", checkAndFormat(tntGamesStats[thisWizard + "_deaths"])],
        ["K/D R", calculateRatio(tntGamesStats[thisWizard + "_kills"], tntGamesStats[thisWizard + "_deaths"])],
      ],
      [
        false,
        ["Healing", checkAndFormat(tntGamesStats[thisWizard + "_healing"] / 2) + ` ♥&#xFE0E;`],
        ["Damage Taken", checkAndFormat(tntGamesStats[thisWizard + "_damage_taken"] / 2) + ` ♥&#xFE0E;`],
        ["Assists", checkAndFormat(tntGamesStats[thisWizard + "_assists"])],
      ],
    ];
  }

  let wizardsCard = [
    "tntgames-stats-wizards", // ID
    "Wizards", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    allTNTWizardStats["overall"], // Displayed stats
    wizardsList, // Other stats (shown in drop-down menu)
    "/img/icon/minecraft/blaze_rod.png", // Chip image
    "tntgames", // gamemode
  ];

  // Generate cards
  tntGamesCards = [tntRunCard, pvpRunCard, tntTagCard, bowSpleefCard, wizardsCard];
  for (d = 0; d < tntGamesCards.length; d++) {
    generateChip(tntGamesCards[d], d % 2 == 0 ? "tntgames-chips-1" : "tntgames-chips-2");
  }
}

function generateArcade() {
  arcadeStats = playerData["stats"]["Arcade"] || {};
  let dropperStats = arcadeStats["dropper"] || {};
  let pixelPartyStats = arcadeStats["pixel_party"] || {};

  let easyWins = sumStatsBasic(
    [
      "wins_dayone",
      "wins_oneinthequiver",
      "woolhunt_participated_wins",
      "wins_dragonwars2",
      "wins_ender",
      "wins_farm_hunt",
      "wins_soccer",
      "sw_game_wins",
      "hider_wins_hide_and_seek",
      "seeker_wins_hide_and_seek",
      "wins_hole_in_the_wall",
      "wins_mini_walls",
      "wins_party",
      "wins_simon_says",
      "wins_draw_their_thing",
      "wins_throw_out",
      "wins_zombies",
      "wins_easter_simulator",
      "wins_halloween_simulator",
      "wins_santa_simulator",
      "wins_scuba_simulator",
      "wins_grinch_simulator_v2",
    ],
    arcadeStats
  );

  updateElement("arcade-overall-wins", checkAndFormat(easyWins + und(dropperStats["wins"]) + und(pixelPartyStats["wins"])), arcadeStats);
  updateElement("arcade-overall-coins", checkAndFormat(arcadeStats["coins"]));

  // Blocking Dead
  let blockingDeadCard = [
    "arcade-stats-blockingdead", // ID
    "Blocking Dead", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    [
      [false, ["Wins", checkAndFormat(arcadeStats["wins_dayone"])]],
      [false, ["Kills", checkAndFormat(arcadeStats["kills_dayone"])], ["Headshots", checkAndFormat(arcadeStats["headshots_dayone"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    `/img/icon/minecraft/rotten_flesh.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  // Bounty Hunters
  let bountyHuntersCard = [
    "arcade-stats-bountyhunters", // ID
    "Bounty Hunters", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    [
      [false, ["Wins", checkAndFormat(arcadeStats["wins_oneinthequiver"])]],
      [
        false,
        ["Kills", checkAndFormat(arcadeStats["kills_oneinthequiver"])],
        ["Deaths", checkAndFormat(arcadeStats["deaths_oneinthequiver"])],
        ["K/D R", calculateRatio(arcadeStats["kills_oneinthequiver"], arcadeStats["deaths_oneinthequiver"])],
      ],
      [false, ["Bounty Kills", checkAndFormat(arcadeStats["bounty_kills_oneinthequiver"])], ["Bow Kills", checkAndFormat(arcadeStats["bow_kills_oneinthequiver"])], ["Sword Kills", checkAndFormat(arcadeStats["sword_kills_oneinthequiver"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    `/img/icon/minecraft/bow.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  // Capture The Wool
  let captureTheWoolCard = [
    "arcade-stats-capturethewool", // ID
    "Capture The Wool", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    [
      [
        false,
        ["Wins", checkAndFormat(arcadeStats["woolhunt_participated_wins"])],
        ["Losses", checkAndFormat(arcadeStats["woolhunt_participated_losses"])],
        ["W/L R", calculateRatio(arcadeStats["woolhunt_participated_wins"], arcadeStats["woolhunt_participated_losses"])],
      ],
      [false, ["Kills", checkAndFormat(arcadeStats["woolhunt_kills"])], ["Deaths", checkAndFormat(arcadeStats["woolhunt_deaths"])], ["K/D R", calculateRatio(arcadeStats["woolhunt_kills"], arcadeStats["woolhunt_deaths"])]],
      [false, ["Draws", checkAndFormat(arcadeStats["woolhunt_experienced_draws"])], ["Assists", checkAndFormat(arcadeStats["woolhunt_assists"])]],
      [false, ["Wool Picked Up", checkAndFormat(arcadeStats["woolhunt_wools_stolen"])], ["Wool Captured", checkAndFormat(arcadeStats["woolhunt_wools_captured"])]],
      [false, ["Fastest Win", smallDuration(und(arcadeStats["woolhunt_fastest_win"]))], ["Fastest Capture", smallDuration(und(arcadeStats["woolhunt_fastest_capture"], -1))]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    `/img/icon/minecraft/orange_wool.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  // Creeper Attack
  let creeperAttackCard = [
    "arcade-stats-creeperattack", // ID
    "Creeper Attack", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    [[false, ["Max Wave", checkAndFormat(arcadeStats["max_wave"])]]], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    `/img/icon/minecraft/creeper_head.${imageFileType}`, // Chip image
  ];

  let dragonWarsCard = [
    "arcade-stats-dragonwars", // ID
    "Dragon Wars", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    [
      [false, ["Wins", checkAndFormat(arcadeStats["wins_dragonwars2"])]],
      [false, ["Kills", checkAndFormat(arcadeStats["kills_dragonwars2"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    `/img/icon/minecraft/dragon_egg.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let dropperCard = [
    "arcade-stats-dropper", // ID
    "Dropper", // Title
    "", // Subtitle
    `/img/games/arcade/dropper.${imageFileType}`, // Background image
    [
      [
        false,
        ["Wins", checkAndFormat(dropperStats["wins"])],
        ["Losses", locale(und(dropperStats["games_played"]) - und(dropperStats["wins"]), 0)],
        ["W/L R", calculateRatio(dropperStats["wins"], und(dropperStats["games_played"]) - und(dropperStats["wins"]))],
      ],
      [false, ["Maps Completed", checkAndFormat(dropperStats["maps_completed"])], ["Fails", checkAndFormat(dropperStats["fails"])]],
      [false, ["Best Time", smallDuration(dropperStats["fastest_game"] / 1000, true)], ["Flawless Games", checkAndFormat(dropperStats["flawless_games"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    `/img/icon/minecraft/hopper.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let enderSpleefCard = [
    "arcade-stats-enderspleef", // ID
    "Ender Spleef", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    [
      [false, ["Wins", checkAndFormat(arcadeStats["wins_ender"])]],
      [false, ["Blocks Destroyed", checkAndFormat(arcadeStats["blocks_destroyed_ender"])], ["Powerups", checkAndFormat(arcadeStats["powerup_activations_ender"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    `/img/icon/minecraft/ender_pearl.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let farmHuntCard = [
    "arcade-stats-farmhunt", // ID
    "Farm Hunt", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    [
      [false, ["Wins", checkAndFormat(arcadeStats["wins_farm_hunt"])]],
      [false, ["Kills", checkAndFormat(arcadeStats["kills_farm_hunt"])]],

      [false, ["Wins (Animal)", checkAndFormat(arcadeStats["animal_wins_farm_hunt"])], ["Wins (Hunter)", checkAndFormat(arcadeStats["hunter_wins_farm_hunt"])]],
      [false, ["Kills (Animal)", checkAndFormat(arcadeStats["hunter_kills_farm_hunt"])], ["Kills (Hunter)", checkAndFormat(arcadeStats["animal_kills_farm_hunt"])]],
      [false, ["Taunts", checkAndFormat(arcadeStats["taunts_used_farm_hunt"])], ["Poop Collected", checkAndFormat(arcadeStats["poop_collected_farm_hunt"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    `/img/icon/minecraft/sheep_spawn_egg.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let footballCard = [
    "arcade-stats-football", // ID
    "Football", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    [
      [false, ["Wins", checkAndFormat(arcadeStats["wins_soccer"])]],
      [false, ["Goals", checkAndFormat(arcadeStats["goals_soccer"])], ["Kicks", checkAndFormat(arcadeStats["kicks_soccer"])], ["Power Kicks", checkAndFormat(arcadeStats["powerkicks_soccer"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    `/img/icon/minecraft/head_football.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let galaxyWarsCard = [
    "arcade-stats-galaxywars", // ID
    "Galaxy Wars", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    [
      [false, ["Wins", checkAndFormat(arcadeStats["sw_game_wins"])]],
      [false, ["Kills", checkAndFormat(arcadeStats["sw_kills"])], ["Deaths", checkAndFormat(arcadeStats["sw_deaths"])], ["K/D R", calculateRatio(arcadeStats["sw_kills"], arcadeStats["sw_deaths"])]],
      [false, ["Kills (Empire)", checkAndFormat(arcadeStats["sw_empire_kills"])], ["Kills (Rebel)", checkAndFormat(arcadeStats["sw_rebel_kills"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu]
    `/img/icon/minecraft/firework_rocket.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let hideAndSeekCard = [
    "arcade-stats-hideandseek", // ID
    "Hide and Seek", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    getArcadeHideAndSeekStats("overall"), // Displayed stats
    [
      ["Overall", "overall", `/img/icon/minecraft/blaze_rod.${imageFileType}`],
      ["Party Pooper", "party_pooper", `/img/icon/minecraft/tnt.${imageFileType}`],
      ["Prop Hunt", "prop_hunt", `/img/icon/minecraft/blaze_rod.${imageFileType}`],
    ], // Other stats (shown in drop-down menu]
    `/img/icon/minecraft/blaze_rod.${imageFileType}`, // Chip image
    "arcade_hide_and_seek", // gamemode
  ];

  let holeInTheWallCard = [
    "arcade-stats-holeinthewall", // ID
    "Hole in the Wall", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    [
      [false, ["Wins", checkAndFormat(arcadeStats["wins_hole_in_the_wall"])]],
      [false, ["Walls", checkAndFormat(arcadeStats["rounds_hole_in_the_wall"])]],
      [false, ["Record (Qualifiers)", checkAndFormat(arcadeStats["hitw_record_q"])], ["Record (Finals)", checkAndFormat(arcadeStats["hitw_record_f"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu]
    `/img/icon/minecraft/bricks.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let hypixelSaysCard = [
    "arcade-stats-hypixelsays", // ID
    "Hypixel Says", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    [
      [false, ["Wins", locale(und(arcadeStats["wins_simon_says"]) + und(arcadeStats["wins_santa_says"]), 0)]],
      [
        false,
        ["Points", locale(und(arcadeStats["rounds_simon_says"]) + und(arcadeStats["rounds_santa_says"]), 0)],
        ["Round Wins", locale(und(arcadeStats["round_wins_simon_says"]) + und(arcadeStats["round_wins_santa_says"]), 0)],
        ["High Score", locale(Math.max(und(arcadeStats["top_score_simon_says"]), und(arcadeStats["top_score_santa_says"])), 0)],
      ],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu]
    `/img/icon/minecraft/cookie.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let miniWallsCard = [
    "arcade-stats-miniwalls", // ID
    "Mini Walls", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    [
      [false, ["Wins", checkAndFormat(arcadeStats["wins_mini_walls"])]],
      [false, ["Kills", checkAndFormat(arcadeStats["kills_mini_walls"])], ["Deaths", checkAndFormat(arcadeStats["deaths_mini_walls"])], ["K/D R", calculateRatio(arcadeStats["kills_mini_walls"], arcadeStats["deaths_mini_walls"])]],
      [
        false,
        ["Final Kills", checkAndFormat(arcadeStats["final_kills_mini_walls"])],
        ["Wither Kills", checkAndFormat(arcadeStats["wither_kills_mini_walls"])],
        ["Wither Damage", checkAndFormat(arcadeStats["wither_damage_mini_walls"] / 2) + ` ♥&#xFE0E;`],
      ],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu]
    `/img/icon/minecraft/head_miniwalls.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let partyGamesCard = [
    "arcade-stats-partygames", // ID
    "Party Games", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    [
      [false, ["Wins", checkAndFormat(arcadeStats["wins_party"])]],
      [false, ["Round Wins", checkAndFormat(arcadeStats["round_wins_party"])], ["Stars Earned", checkAndFormat(arcadeStats["total_stars_party"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu]
    `/img/icon/minecraft/cake.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let pixelPaintersCard = [
    "arcade-stats-pixelpainters", // ID
    "Pixel Painters", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    [[false, ["Wins", checkAndFormat(arcadeStats["wins_draw_their_thing"])]]],
    [], // Other stats (shown in drop-down menu]
    `/img/icon/minecraft/pink_dye.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let pixelPartyCard = [
    "arcade-stats-pixelparty", // ID
    "Pixel Party", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    [
      [
        false,
        ["Wins", checkAndFormat(pixelPartyStats["wins"])],
        ["Losses", locale(und(pixelPartyStats["games_played"]) - und(pixelPartyStats["wins"]), 0)],
        ["W/L R", calculateRatio(pixelPartyStats["wins"], und(pixelPartyStats["games_played"]) - und(pixelPartyStats["wins"]))],
      ],
      [false, ["Rounds Completed", checkAndFormat(pixelPartyStats["rounds_completed"])], ["Powerups", checkAndFormat(pixelPartyStats["power_ups_collected"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu]
    `/img/icon/minecraft/disc_13.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let throwOutCard = [
    "arcade-stats-throwout", // ID
    "Throw Out", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    [
      [false, ["Wins", checkAndFormat(arcadeStats["wins_throw_out"])]],
      [false, ["Kills", checkAndFormat(arcadeStats["kills_throw_out"])], ["Deaths", checkAndFormat(arcadeStats["deaths_throw_out"])], ["K/D R", calculateRatio(arcadeStats["kills_throw_out"], arcadeStats["deaths_throw_out"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu]
    `/img/icon/minecraft/snowball.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let zombiesCard = [
    "arcade-stats-zombies", // ID
    "Zombies", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    getZombiesStats("overall"), // Displayed stats
    [
      ["Overall", "overall"],
      ["Dead End", "deadend"],
      ["Bad Blood", "badblood"],
      ["Alien Arcadium", "alienarcadium"],
    ], // Other stats (shown in drop-down menu]
    `/img/icon/minecraft/zombie_head.${imageFileType}`, // Chip image
    "arcade_zombies", // gamemode
  ];

  let seasonalCard = [
    "arcade-stats-seasonal", // ID
    "Seasonal Games", // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    getArcadeSeasonalStats("overall"), // Displayed stats
    [
      ["Overall", "overall"],
      ["Grinch Simulator", "grinch_simulator_v2", `/img/icon/minecraft/head_grinchsimulator.${imageFileType}`],
      ["Easter Simulator", "easter_simulator", `/img/icon/minecraft/head_eastersimulator.${imageFileType}`],
      ["Halloween Simulator", "halloween_simulator", `/img/icon/minecraft/head_halloweensimulator.${imageFileType}`],
      ["Scuba Simulator", "scuba_simulator", `/img/icon/minecraft/head_scubasimulator.${imageFileType}`],
      ["Santa Simulator", "santa_simulator", `/img/icon/minecraft/head_santasimulator.${imageFileType}`],
    ], // Other stats (shown in drop-down menu]
    `/img/icon/minecraft/head_seasonal.${imageFileType}`, // Chip image
    "arcade_seasonal", // gamemode
  ];

  arcadeCards = [
    blockingDeadCard,
    bountyHuntersCard,
    captureTheWoolCard,
    creeperAttackCard,
    dragonWarsCard,
    dropperCard,
    enderSpleefCard,
    farmHuntCard,
    footballCard,
    galaxyWarsCard,
    hideAndSeekCard,
    holeInTheWallCard,
    hypixelSaysCard,
    miniWallsCard,
    partyGamesCard,
    pixelPaintersCard,
    pixelPartyCard,
    throwOutCard,
    zombiesCard,
    seasonalCard,
  ];
  for (d = 0; d < arcadeCards.length; d++) {
    generateChip(arcadeCards[d], d % 2 == 0 ? "arcade-chips-1" : "arcade-chips-2");
  }
}

function generatePit() {
  pitStats = playerData["stats"]["Pit"] || {};
  pitProfileStats = pitStats["profile"] || {};
  pitPtlStats = pitStats["pit_stats_ptl"] || {};

  let pitXpMap = [15, 30, 50, 75, 125, 300, 600, 800, 900, 1000, 1200, 1500, 0];
  let pitPrestiges = [
    100,
    110,
    120,
    130,
    140,
    150,
    175,
    200,
    250,
    300,
    400,
    500,
    600,
    700,
    800,
    900,
    1000,
    1200,
    1400,
    1600,
    1800,
    2000,
    2400,
    2800,
    3200,
    3600,
    4000,
    4500,
    5000,
    7500,
    10000,
    10100,
    10100,
    10100,
    10100,
    10100,
    20000,
    30000,
    40000,
    50000,
    75000,
    100000,
    125000,
    150000,
    175000,
    200000,
    300000,
    500000,
    1000000,
    5000000,
    10000000,
  ];
  let pitPrestigeXp = [
    65950,
    138510,
    217680,
    303430,
    395760,
    494700,
    610140,
    742040,
    906930,
    1104780,
    1368580,
    1698330,
    2094030,
    2555680,
    3083280,
    3676830,
    4336330,
    5127730,
    6051030,
    7106230,
    8293330,
    9612330,
    11195130,
    13041730,
    15152130,
    17526330,
    20164330,
    23132080,
    26429580,
    31375830,
    37970830,
    44631780,
    51292730,
    57953680,
    64614630,
    71275580,
    84465580,
    104250580,
    130630580,
    163605580,
    213068080,
    279018080,
    361455580,
    460380580,
    575793080,
    707693080,
    905543080,
    1235293080,
    1894793080,
    5192293080,
    11787293080,
  ];
  let pitPrestigeGold = [
    10000,
    20000,
    20000,
    20000,
    30000,
    35000,
    40000,
    45000,
    50000,
    60000,
    70000,
    80000,
    90000,
    100000,
    125000,
    150000,
    175000,
    200000,
    250000,
    300000,
    350000,
    400000,
    500000,
    600000,
    700000,
    800000,
    900000,
    1000000,
    1000000,
    1000000,
    1000000,
    1000000,
    1000000,
    1000000,
    1000000,
    2000000,
    2000000,
    2000000,
    2000000,
    2000000,
    2000000,
    2000000,
    2000000,
    2000000,
    2000000,
    2000000,
    2000000,
    2000000,
    2000000,
    2000000,
  ];
  let pitPrestigeColors = ["§7", "§9", "§e", "§6", "§c", "§5", "§d", "§f", "§b", "§1", "§0", "§4", "§8"];
  let pitLevelColors = ["§7", "§9", "§3", "§2", "§a", "§e", "§6", "§c", "§4", "§5", "§d", "§f", "§b"];

  function pitXpToLevel(experience, data_type) {
    x_prestige = 0;
    x_level = 120;
    x_120level = 0;

    /* Data Types:
        0: Unformatted      - "[I-26]"
        1: Formatting codes - "§9[§eI§9-..."
        2: Just prestige    - 1
        3: Just level       - 26
        4: [120] of pres XP - 138510
    */

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
  /* 
// Decode NBT function
async function decodeNBT(raw) {
  return new Promise((resolve, reject) => {
    nbt.parse(raw, function (error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

const kvl = pitStats["profile"]["inv_enderchest"]["data"];
const newKvl = kvl.map(x => x < 0 ? x + 256 : x);

const compressedByteArray = new Uint8Array(newKvl);
const decompressedData = pako.inflate(compressedByteArray);

decodeNBT(decompressedData.buffer)
.then(decodedData => console.warn(decodedData))
.catch(error => console.error('Error decoding NBT data:', error));

    console.warn(pitStats["profile"]["inv_enderchest"]["data"]);
  console.log(pitStats);*/
  let pitXp = und(pitProfileStats["xp"]);
  let pitPrestige = pitXpToLevel(pitXp, 2);

  let pitXpProgress;
  if (pitPrestige == 0) {
    pitXpProgress = (pitXp / pitPrestigeXp[pitPrestige]) * 100;
  } else {
    pitXpProgress = ((pitXp - pitPrestigeXp[pitPrestige - 1]) / (pitPrestigeXp[pitPrestige] - pitPrestigeXp[pitPrestige - 1])) * 100;
  }

  updateElement("pit-prestige", generateMinecraftText(pitXpToLevel(pitXp, 1)), true);
  updateElement("pit-progress-number", `${Math.floor(pitXpProgress)}%`, true);
  document.getElementById("pit-progress-bar").style.width = `${pitXpProgress}%`;

  updateElement("pit-overall-gold", checkAndFormat(pitProfileStats["cash"]) + "g");
  updateElement("pit-overall-kills", checkAndFormat(pitPtlStats["kills"]));
  updateElement("pit-overall-assists", checkAndFormat(pitPtlStats["assists"]));
  updateElement("pit-overall-deaths", checkAndFormat(pitPtlStats["deaths"]));
  updateElement("pit-overall-kdr", calculateRatio(und(pitPtlStats["kills"]), und(pitPtlStats["deaths"])));
  updateElement("pit-overall-playtime", smallDuration(und(pitPtlStats["playtime_minutes"]) * 60));
  updateElement("pit-overall-joins", checkAndFormat(pitPtlStats["joins"]));
  updateElement("pit-overall-renown", checkAndFormat(pitProfileStats["renown"]));
  updateElement("pit-overall-clicks", checkAndFormat(pitPtlStats["left_clicks"]));
  updateElement("pit-overall-highest-killstreak", checkAndFormat(pitPtlStats["max_streak"]));

  updateElement("pit-overall-damage-dealt", checkAndFormat(pitPtlStats["damage_dealt"] / 2) + " ♥\uFE0E");
  updateElement("pit-overall-damage-taken", checkAndFormat(pitPtlStats["damage_received"] / 2) + " ♥\uFE0E");

  let combatChip = [
    "pit-combat",
    "Combat",
    "",
    `/img/games/pit/combat.${imageFileType}`,
    [
      [false, ["Sword Hits", checkAndFormat(pitPtlStats["sword_hits"])]],
      [false, ["Arrows Shot", checkAndFormat(pitPtlStats["arrows_fired"])], ["Arrows Hit", checkAndFormat(pitPtlStats["arrow_hits"])]],
      [false, ["Night Quests", checkAndFormat(pitPtlStats["night_quests_completed"])]],
    ],
    [],
    ``,
  ];

  let performanceChip = [
    "pit-performance",
    "Performance",
    "",
    `/img/games/pit/perfomance.${imageFileType}`,
    [
      [false, ["XP", checkAndFormat(pitProfileStats["xp"])], ["Lifetime Gold", checkAndFormat(pitPtlStats["cash_earned"]) + "g"]],
      [false, ["Contracts Started", checkAndFormat(pitPtlStats["contracts_started"])], ["Contracts Completed", checkAndFormat(pitPtlStats["contracts_completed"])]],
    ],
    [],
    ``,
  ];

  let perkChip = [
    "pit-perks",
    "Perks",
    "",
    `/img/games/pit/perks.${imageFileType}`,
    [
      [false, ["Golden Apples Eaten", checkAndFormat(pitPtlStats["gapple_eaten"])], ["Golden Heads Eaten", checkAndFormat(pitPtlStats["ghead_eaten"])]],
      [false, ["Blocks Placed", checkAndFormat(pitPtlStats["blocks_placed"])], ["Blocks Broken", checkAndFormat(pitPtlStats["blocks_broken"])]],
      [false, ["Fishing Rod Launches", checkAndFormat(pitPtlStats["fishing_rod_launched"])], ["Lava Bucket Empties", checkAndFormat(pitPtlStats["lava_bucket_emptied"])]],
      [false, ["Soups Drank", checkAndFormat(pitPtlStats["soups_drank"])]],
    ],
    [],
    ``,
  ];

  let mysticsChip = [
    "pit-mystics",
    "Mystics",
    "",
    `/img/games/pit/mystics.${imageFileType}`,
    [
      [false, ["Mystics Enchanted", locale(sumStatsBasic(["enchanted_tier1", "enchanted_tier2", "enchanted_tier3"], pitPtlStats), 0)], ["Dark Pants Created", checkAndFormat(pitPtlStats["dark_pants_crated"])]],
      [false, ["Tier 1s", checkAndFormat(pitPtlStats["enchanted_tier1"])], ["Tier 2s", checkAndFormat(pitPtlStats["enchanted_tier2"])], ["Tier 3s", checkAndFormat(pitPtlStats["enchanted_tier3"])]],
    ],
    [],
    ``,
  ];

  let farmingChip = [
    "pit-farming",
    "Farming",
    "",
    `/img/games/pit/farming.${imageFileType}`,
    [
      [false, ["Wheat Farmed", checkAndFormat(pitPtlStats["wheat_farmed"])]],
      [false, ["Items Fished", checkAndFormat(pitPtlStats["fished_anything"])], ["Fish Fished", checkAndFormat(pitPtlStats["fishes_fished"])]],
    ],
    [],
    ``,
  ];

  let miscChip = [
    "pit-misc",
    "Miscellaneous",
    "",
    `/img/games/pit/miscellaneous.${imageFileType}`,
    [
      [false, ["Chat Messages", checkAndFormat(pitPtlStats["chat_messages"])], ["Ingots Picked Up", checkAndFormat(pitPtlStats["ingots_picked_up"])]],
      [false, ["Pit Jumps", checkAndFormat(pitPtlStats["jumped_into_pit"])], ["Launcher Launches", locale(sumStatsBasic(["launched_by_launchers", "launched_by_angel_spawn", "launched_by_demon_spawn"], pitPtlStats), 0)]],
      [false, ["Sewer Treasures", checkAndFormat(pitPtlStats["sewer_treasures_found"])], ["King's Quest Completions", checkAndFormat(pitPtlStats["king_quest_completion"])]],
    ],
    [],
    ``,
  ];

  let pitChips = [combatChip, performanceChip, perkChip, mysticsChip, farmingChip, miscChip];
  for (d = 0; d < pitChips.length; d++) {
    generateChip(pitChips[d], d % 2 == 0 ? "pit-chips-1" : "pit-chips-2");
  }
}

function generateClassic() {
  classicStats = playerData["stats"]["Legacy"] || {};
  arenaStats = playerData["stats"]["Arena"] || {};
  paintballStats = playerData["stats"]["Paintball"] || {};
  quakeStats = playerData["stats"]["Quake"] || {};
  vampireZStats = playerData["stats"]["VampireZ"] || {};
  tkrStats = playerData["stats"]["GingerBread"] || {};
  wallsStats = playerData["stats"]["Walls"] || {};

  updateElement(
    "classic-overall-wins",
    checkAndFormat(und(arenaStats["wins"]) + und(paintballStats["wins"]) + und(quakeStats["wins"]) + und(vampireZStats["wins_human"]) + und(vampireZStats["wins_vampire"]) + und(tkrStats["wins"]) + und(wallsStats["wins"]))
  );
  updateElement(
    "classic-overall-kills",
    checkAndFormat(
      und(arenaStats["kills_1v1"]) +
        und(arenaStats["kills_2v2"]) +
        und(arenaStats["kills_4v4"]) +
        und(paintballStats["kills"]) +
        und(quakeStats["kills"]) +
        und(quakeStats["kills_teams"]) +
        und(vampireZStats["human_kills"]) +
        und(vampireZStats["vampire_kills"]) +
        und(wallsStats["kills"])
    )
  );
  updateElement("classic-overall-tokens", checkAndFormat(classicStats["tokens"]));
  updateElement("classic-overall-total_tokens", checkAndFormat(classicStats["total_tokens"]));
  updateElement("classic-overall-playtime", smallDuration(sumStatsBasic(["arena_tokens", "gingerbread_tokens", "walls_tokens", "quakecraft_tokens", "paintball_tokens", "vampirez_tokens"], classicStats) * 120));

  let arenaChip = [
    "classic-arena",
    "Arena Brawl",
    ``,
    `/img/games/404.${imageFileType}`,
    getArenaBrawlStats("overall"),
    [
      ["Overall", "overall"],
      ["1v1", "1v1"],
      ["2v2", "2v2"],
      ["4v4", "4v4"],
    ],
    `/img/icon/minecraft/blaze_powder.${imageFileType}`,
    "arena",
  ];

  let paintballTitles = [
    { req: 0, internalId: "DARK_GRAY", color: "§8" },
    { req: 1000, internalId: "GRAY", color: "§7" },
    { req: 2500, internalId: "WHITE", color: "§f" },
    { req: 5000, internalId: "DARK_GREEN", color: "§2" },
    { req: 10000, internalId: "YELLOW", color: "§e" },
    { req: 20000, internalId: "GREEN", color: "§a" },
    { req: 50000, internalId: "BLUE", color: "§9" },
    { req: 75000, internalId: "AQUA", color: "§b" },
    { req: 100000, internalId: "PINK", color: "§d" },
    { req: 200000, internalId: "PURPLE", color: "§5" },
    { req: 500000, internalId: "RED", color: "§c" },
    { req: 1000000, internalId: "GOLD", color: "§6" },
  ];

  let paintballChip = [
    "classic-paintball",
    "Paintball",
    ``,
    `/img/games/404.${imageFileType}`,
    [
      [false, ["Coins", checkAndFormat(paintballStats["coins"])]],
      [false, ["Wins", checkAndFormat(paintballStats["wins"])]],
      [
        false,
        ["Kills", getGenericWinsPrefix(und(paintballStats["kills"]), paintballTitles, paintballStats["prefix_color"], false)],
        ["Deaths", checkAndFormat(paintballStats["deaths"])],
        ["K/D R", calculateRatio(paintballStats["kills"], paintballStats["deaths"])],
      ],
      [false, ["Shots", checkAndFormat(paintballStats["shots_fired"])], ["Killstreaks", checkAndFormat(paintballStats["killstreaks"])]],
    ],
    [],
    `/img/icon/minecraft/snowball.${imageFileType}`,
    "paintball",
  ];

  let tkrChip = [
    "classic-tkr",
    "Turbo Kart Racers",
    "",
    `/img/games/404.${imageFileType}`,
    getTKRStats("overall"),
    [
      ["Overall", "overall"],
      ["Canyon", "canyon"],
      ["Hypixel GP", "hypixelgp"],
      ["Jungle Rush", "junglerush"],
      ["Olympus", "olympus"],
      ["Retro", "retro"],
    ],
    `/img/icon/minecraft/minecart.${imageFileType}`,
    "tkr",
  ];

  let quakecraftChip = [
    "classic-quakecraft",
    "Quakecraft",
    "",
    `/img/games/404.${imageFileType}`,
    getQuakeStats("overall"),
    [
      ["Overall", "overall"],
      ["Solo", ""],
      ["Teams", "_teams"],
    ],
    `/img/icon/minecraft/firework_rocket.${imageFileType}`,
    "quake",
  ];

  let vampireZChip = [
    "classic-vampirez",
    "VampireZ",
    ``,
    `/img/games/404.${imageFileType}`,
    getVampireZStats("human"),
    [
      ["Human", "human"],
      ["Vampire", "vampire"],
    ],
    `/img/icon/minecraft/wither_skeleton_skull.${imageFileType}`,
    "vampirez",
  ];

  let wallsTitles = [
    { req: 0, color: "§8" },
    { req: 20, color: "§7" },
    { req: 50, color: "§e" },
    { req: 100, color: "§a" },
    { req: 200, color: "§2" },
    { req: 300, color: "§9" },
    { req: 400, color: "§1" },
    { req: 500, color: "§d" },
    { req: 750, color: "§4" },
    { req: 1000, color: "§6" },
    { req: 2000, color: "§0§l" },
    { req: 2001, color: "rainbow" },
  ];

  let wallsChip = [
    "classic-walls",
    "The Walls",
    "",
    `/img/games/404.${imageFileType}`,
    [
      [false, ["Coins", checkAndFormat(wallsStats["coins"])]],
      [false, ["Wins", getGenericWinsPrefix(wallsStats["wins"], wallsTitles, undefined, false)], ["Losses", checkAndFormat(wallsStats["losses"])], ["W/L R", calculateRatio(wallsStats["wins"], wallsStats["losses"])]],
      [false, ["Kills", checkAndFormat(wallsStats["kills"])], ["Deaths", checkAndFormat(wallsStats["deaths"])], ["K/D R", calculateRatio(wallsStats["kills"], wallsStats["deaths"])]],
      [false, ["Assists", checkAndFormat(wallsStats["assists"])]],
    ],
    [],
    `/img/icon/minecraft/sand.${imageFileType}`,
    "walls",
  ];

  let classicChips = [arenaChip, paintballChip, quakecraftChip, tkrChip, vampireZChip, wallsChip];
  for (d = 0; d < classicChips.length; d++) {
    generateChip(classicChips[d], d % 2 == 0 ? "classic-chips-1" : "classic-chips-2");
  }
}

function generateCopsAndCrims() {
  copsAndCrimsStats = playerData["stats"]["MCGO"] || {};

  let easyStats = ["game_wins", "kills", "deaths", "round_wins", "bombs_planted", "bombs_defused", "assists"];

  let copsAndCrimsBasicStats = sumStats(easyStats, ["", "_gungame", "_deathmatch"], copsAndCrimsStats, "", true);

  for (let e = 0; e < easyStats.length; e++) {
    updateElement(`copsandcrims-overall-${easyStats[e]}`, checkAndFormat(copsAndCrimsBasicStats[e]));
  }

  updateElement("copsandcrims-overall-kdr", calculateRatio(copsAndCrimsBasicStats[1], copsAndCrimsBasicStats[2]));
  updateElement("copsandcrims-overall-coins", checkAndFormat(copsAndCrimsStats["coins"]));

  let defusalChip = [
    "copsandcrims-defusal",
    "Defusal",
    "",
    `/img/games/404.${imageFileType}`,
    [
      [false, ["Wins", checkAndFormat(copsAndCrimsStats["game_wins"])]],
      [false, ["Kills", checkAndFormat(copsAndCrimsStats["kills"])], ["Deaths", checkAndFormat(copsAndCrimsStats["deaths"])], ["K/D R", calculateRatio(copsAndCrimsStats["kills"], copsAndCrimsStats["deaths"])]],
      [false, ["Assists", checkAndFormat(copsAndCrimsStats["assists"])], ["Headshot Kills", checkAndFormat(copsAndCrimsStats["headshot_kills"])], ["Shots", checkAndFormat(copsAndCrimsStats["shots_fired"])]],
      [false, ["Bombs Defused", checkAndFormat(copsAndCrimsStats["bombs_defused"])], ["Bombs Planted", checkAndFormat(copsAndCrimsStats["bombs_planted"])], ["Round Wins", checkAndFormat(copsAndCrimsStats["round_wins"])]],
    ],
    [],
    ``,
    "copsandcrims",
  ];

  let deathmatchChip = [
    "copsandcrims-deathmatch",
    "Deathmatch",
    "",
    `/img/games/404.${imageFileType}`,
    [
      [false, ["Wins", checkAndFormat(copsAndCrimsStats["game_wins_deathmatch"])]],
      [false, ["Kills", checkAndFormat(copsAndCrimsStats["kills_deathmatch"])], ["Deaths", checkAndFormat(copsAndCrimsStats["deaths_deathmatch"])], ["K/D R", calculateRatio(copsAndCrimsStats["kills_deathmatch"], copsAndCrimsStats["deaths_deathmatch"])]],
      [false, ["Assists", checkAndFormat(copsAndCrimsStats["assists_deathmatch"])]],
    ],
    [],
    ``,
    "copsandcrims",
  ]

  let gunGameChip = [
    "copsandcrims-gungame",
    "Gun Game",
    "",
    `/img/games/404.${imageFileType}`,
    [
      [false, ["Wins", checkAndFormat(copsAndCrimsStats["game_wins_gungame"])]],
      [false, ["Kills", checkAndFormat(copsAndCrimsStats["kills_gungame"])], ["Deaths", checkAndFormat(copsAndCrimsStats["deaths_gungame"])], ["K/D R", calculateRatio(copsAndCrimsStats["kills_gungame"], copsAndCrimsStats["deaths_gungame"])]],
      [false, ["Assists", checkAndFormat(copsAndCrimsStats["assists_gungame"])], ["Fastest Win", smallDuration(copsAndCrimsStats["fastest_win_gungame"] / 1000, true)]]
    ],
    [],
    ``,
    "copsandcrims",
  ];

  let gunsChip = [
    "copsandcrims-guns",
    "Guns",
    "",
    `/img/games/404.${imageFileType}`,
    getCopsAndCrimsGunStats("autoShotgun"),
    [
      ["Auto Shotgun", "autoShotgun"],
      ["Bullpup", "bullpup"],
      ["Carbine", "carbine"],
      ["Handgun", "handgun"],
      ["Magnum", "magnum"],
      ["Pistol", "pistol"],
      ["Rifle", "rifle"],
      ["Scoped Rifle", "scopedRifle"],
      ["Shotgun", "shotgun"],
      ["SMG", "smg"],
      ["Sniper", "sniper"],
    ],
    ``,
    "copsandcrims_guns",
  ];

  let copsAndCrimsChips = [defusalChip, deathmatchChip, gunGameChip, gunsChip];
  for (d = 0; d < copsAndCrimsChips.length; d++) {
    generateChip(copsAndCrimsChips[d], d % 2 == 0 ? "copsandcrims-chips-1" : "copsandcrims-chips-2");
  }
}

function getCopsAndCrimsGunStats(gun) {
  return [
    [false, ["Kills", checkAndFormat(copsAndCrimsStats[`${gun}Kills`])], ["Headshots", checkAndFormat(copsAndCrimsStats[`${gun}Headshots`])]],
  ];
}  

function generateBlitz() {
  blitzStats = playerData["stats"]["HungerGames"] || {};

  let easyStats = ["deaths", "wins_solo_normal", "wins_teams_normal", "kills_teams_normal", "taunt_kills", "coins", "arrows_hit", "potions_thrown", "mobs_spawned", "chests_opened"];

  for(let e = 0; e < easyStats.length; e++) {
    updateElement(`blitz-overall-${easyStats[e]}`, checkAndFormat(blitzStats[easyStats[e]]));
  }
  updateElement("blitz-overall-wins", checkAndFormat(blitzStats["wins_solo_normal"] + blitzStats["wins_teams_normal"]));
  updateElement("blitz-overall-kdr", calculateRatio(blitzStats["kills"], blitzStats["deaths"]));
  updateElement("blitz-overall-kills_solo_normal", checkAndFormat(blitzStats["kills"] - blitzStats["kills_teams_normal"]));

  updateElement("blitz-overall-playtime", smallDuration(blitzStats["time_played"]));
  updateElement("blitz-overall-damage_dealt", checkAndFormat(blitzStats["damage"] / 2) + " ♥\uFE0E");

  let blitzPrefixes = [
    { req: 0, color: "§e", internalId: 1 },
    { req: 0, color: "§7", bracketColor: "§f", internalId: 2 },
    { req: 25000, color: "§a", internalId: 3 },
    { req: 50000, color: "§c", internalId: 4 },
    { req: 75000, color: "§b", internalId: 5 },
    { req: 100000, color: "§6§l", internalId: 6 },
    { req: 150000, color: "§5§l", internalId: 7 },
    { req: 200000, color: "§4§l", internalId: 8 },
    { req: 250000, color: "§9§l", internalId: 9 },
    { req: 300000, color: "§2§l", internalId: 10 },
  ];

  updateElement("blitz-overall-kills", getGenericWinsPrefix(blitzStats["kills"], blitzPrefixes, blitzStats["togglekillcounter"], false, "", true), true);

  let blitzKits = [ ["Arachnologist", "arachnologist"], ["Archer", "archer"], ["Armorer", "armorer"], ["Astronaut", "astronaut"], ["Baker", "baker"], ["Blaze", "blaze"], ["Creepertamer", "creepertamer"], ["Diver", "diver"], ["Donkeytamer", "donkeytamer"], ["Farmer", "farmer"], ["Fisherman", "fisherman"], ["Florist", "florist"], ["Golem", "golem"], ["Guardian", "guardian"], ["Horsetamer", "horsetamer"], ["Hunter", "hunter"], ["Hype Train", "hype train"], ["Jockey", "jockey"], ["Knight", "knight"], ["Meatmaster", "meatmaster"], ["Milkman", "milkman"], ["Necromancer", "necromancer"], ["Paladin", "paladin"], ["Phoenix", "phoenix"], ["Pigman", "pigman"], ["Ranger", "ranger"], ["Reaper", "reaper"], ["Reddragon", "reddragon"], ["Rogue", "rogue"], ["Scout", "scout"], ["Shadow Knight", "shadow knight"], ["Shark", "shark"], ["SlimeySlime", "slimeyslime"], ["Snowman", "snowman"], ["Speleologist", "speleologist"], ["Tim", "tim"], ["Toxicologist", "toxicologist"], ["Troll", "troll"], ["Viking", "viking"], ["Warlock", "warlock"], ["Warrior", "warrior"], ["Wolftamer", "wolftamer"], ["Rambo", "rambo"], ["Random", "random"], ];

  // Add kit level to each kit name
  for(let k = 0; k < blitzKits.length; k++) {
    if(blitzKits[k][1] != "random" && blitzKits[k][1] != "rambo") {
      blitzKits[k][0] = blitzKits[k][0] + ` <span class="ignore">${getBlitzKitLevel(blitzKits[k][1])}</span>`;
    }
  }

  let blitzKitsChip = [
    "blitz-kits",
    "Kits",
    "",
    `/img/games/404.${imageFileType}`,
    getBlitzKitsStats("arachnologist"),
    blitzKits,
    ``,
    "blitz",
  ]

  generateChip(blitzKitsChip, "blitz-chips-1");
}

function getBlitzKitLevel(kit) {
  let kitLevel = und(blitzStats[kit]) + 1;
  let kitPrestige = und(blitzStats[`p${kit}`]);
  if(kitPrestige > 0) {
    // return 1 ✫ for each prestige
    return generateMinecraftText("§6✫".repeat(kitPrestige));
  } else {
    return convertToRoman(kitLevel);
  }
}

function getBlitzKitsStats(kit) {
  let topRowChipStats;
  if(kit == "random" || kit == "rambo") { // Random and Rambo kits don't have levels
    topRowChipStats = [false, ["EXP", checkAndFormat(blitzStats["exp_" + kit])]];
  } else {
    topRowChipStats = [false, ["Level", getBlitzKitLevel(kit)], ["EXP", checkAndFormat(blitzStats["exp_" + kit])]];
  }

  let blitzKitStats = [
    topRowChipStats,
    [false, ["Wins", checkAndFormat(sumStatsBasic(["wins_" + kit, "wins_teams_" + kit], blitzStats))], ["Losses", checkAndFormat(und(blitzStats["games_played_" + kit]) - sumStatsBasic(["wins_" + kit, "wins_teams_" + kit], blitzStats))], ["W/L R", calculateRatio(sumStatsBasic(["wins_" + kit, "wins_teams_" + kit], blitzStats), und(blitzStats["games_played_" + kit]) - sumStatsBasic(["wins_" + kit, "wins_teams_" + kit], blitzStats))]],
    [false, ["Kills", checkAndFormat(blitzStats["kills_" + kit])], ["Taunt Kills", checkAndFormat(blitzStats["taunt_kills_" + kit])]],
    [false, ["Arrows Hit", checkAndFormat(blitzStats["arrows_hit_" + kit])], ["Damage Dealt", checkAndFormat(blitzStats["damage_" + kit] / 2) + " ♥\uFE0E"]],
    [false, ["Potions Thrown", checkAndFormat(blitzStats["potions_thrown_" + kit])], ["Mobs Spawned", checkAndFormat(blitzStats["mobs_spawned_" + kit])]],
    [false, ["Chests Opened", checkAndFormat(blitzStats["chests_opened_" + kit])], ["Playtime", smallDuration(und(blitzStats["time_played_" + kit]))]],
  ];

  if(kit != "rambo") { // Rambo kit doesn't have a team mode
    blitzKitStats.splice(2, 0, [false, ["Wins (Solo)", checkAndFormat(blitzStats["wins_" + kit])], ["Wins (Teams)", checkAndFormat(blitzStats["wins_teams_" + kit])]]);
  }

  return blitzKitStats;
}

function generateMegaWalls() {
  megaWallsStats = playerData["stats"]["Walls3"] || {};

  let easyStats = ["kills", "deaths", "wins", "losses", "final_assists", "mythic_favor", "wither_kills", "assists", "coins"];

  for(let e = 0; e < easyStats.length; e++) {
    updateElement(`megawalls-overall-${easyStats[e]}`, checkAndFormat(megaWallsStats[easyStats[e]]));
  }

  updateElement("megawalls-overall-wlr", calculateRatio(megaWallsStats["wins"], megaWallsStats["losses"]));

  let megaWallsFinalKills = sumStatsBasic(["final_kills", "finalKills"], megaWallsStats);
  let megaWallsFinalDeaths = sumStatsBasic(["final_deaths", "finalDeaths"], megaWallsStats);

  updateElement("megawalls-overall-final_kills", checkAndFormat(megaWallsFinalKills));
  updateElement("megawalls-overall-final_deaths", checkAndFormat(megaWallsFinalDeaths));

  updateElement("megawalls-overall-fkdr", calculateRatio(megaWallsFinalKills, megaWallsFinalDeaths));
  updateElement("megawalls-overall-kdr", calculateRatio(megaWallsStats["kills"], megaWallsStats["deaths"]));
  updateElement("megawalls-overall-points", checkAndFormat(und(megaWallsStats["wins"]) * 10 + megaWallsFinalKills));
  updateElement("megawalls-selected_class", und(megaWallsStats["chosen_class"], "None"));

  updateElement("megawalls-overall-playtime", smallDuration(megaWallsStats["time_played"] * 60));
  updateElement("megawalls-overall-damage_dealt", checkAndFormat(megaWallsStats["damage_dealt"] / 2) + " ♥\uFE0E");


  let megaWallsClasses = {
    arcanist: {name: "Arcanist", abilities: [] },
    assassin: {name: "Assassin", abilities: [] },
    automaton: {name: "Automaton", abilities: [] },
    blaze: {name: "Blaze", abilities: [] },
    cow: {name: "Cow", abilities: [] },
    creeper: {name: "Creeper", abilities: [] },
    dreadlord: {name: "Dreadlord", abilities: [] },
    enderman: {name: "Enderman", abilities: [] },
    golem: {name: "Golem", abilities: [] },
    herobrine: {name: "Herobrine", abilities: [] },
    hunter: {name: "Hunter", abilities: [] },
    moleman: {name: "Moleman", abilities: [] },
    phoenix: {name: "Phoenix", abilities: [] },
    pigman: {name: "Pigman", abilities: [] },
    pirate: {name: "Pirate", abilities: [] },
    renegade: {name: "Renegade", abilities: [] },
    shaman: {name: "Shaman", abilities: [] },
    shark: {name: "Shark", abilities: [] },
    skeleton: {name: "Skeleton", abilities: [] },
    snowman: {name: "Snowman", abilities: [] },
    spider: {name: "Spider", abilities: [] },
    squid: {name: "Squid", abilities: [] },
    werewolf: {name: "Werewolf", abilities: [] },
    zombie: {name: "Zombie", abilities: [] },
  }

  // Iterate through megaWallsClasses
  for (let key in megaWallsClasses) {
    let megaWallsPrestige = getMegaWallsPrestige(key);
    if(megaWallsPrestige[0]) {
      megaWallsClasses[key]["name"] = megaWallsClasses[key]["name"] + `<span class="ignore">${megaWallsPrestige[1]}</span>`;
    }
  }


  let megaWallsClassesFormatted = Object.entries(megaWallsClasses).map(([key, value]) => [value["name"], key]);
  let megaWallsClassesFormattedWithOverall = [["Overall", ""]].concat(megaWallsClassesFormatted);

  let megaWallsClassChip = [
    "megawalls-classes",
    "Classes",
    "",
    `/img/games/404.${imageFileType}`,
    getMegaWallsClassStats("arcanist"),
    megaWallsClassesFormatted,
    ``,
    "megawalls",
  ]

  let megaWallsStandardChip = [
    "megawalls-standard",
    "Standard",
    "",
    `/img/games/404.${imageFileType}`,
    getMegaWallsClassStats("", "standard"),
    megaWallsClassesFormattedWithOverall,
    ``,
    "megawalls",
  ]

  let megaWallsFaceOffChip = [
    "megawalls-faceoff",
    "Face Off",
    "",
    `/img/games/404.${imageFileType}`,
    getMegaWallsClassStats("", "face_off"),
    megaWallsClassesFormattedWithOverall,
    ``,
    "megawalls",
  ]

  generateChip(megaWallsClassChip, "megawalls-chips");

  let megaWallsChips = [megaWallsStandardChip, megaWallsFaceOffChip];
  for (let d = 0; d < megaWallsChips.length; d++) {
    generateChip(megaWallsChips[d], d % 2 == 0 ? "megawalls-chips-1" : "megawalls-chips-2");
  }
}

function getMegaWallsPrestige(className) {
  let megaWallsClassStats = megaWallsStats["classes"] || {};
  let megaWallsChosenClassStats = megaWallsClassStats[className] || {};

  if (megaWallsChosenClassStats["prestige"] > 0) {

    // Make first item of array
    return [true, generateMinecraftText("§6✫".repeat(megaWallsChosenClassStats["prestige"])), und(megaWallsChosenClassStats["enderchest_rows"], 3)];
  } else {
    return [false, `${und(megaWallsChosenClassStats["skill_level_d"], 1)} &ndash; ${und(megaWallsChosenClassStats["skill_level_a"], 1)} &ndash; ${und(megaWallsChosenClassStats["skill_level_b"], 1)} &ndash; ${und(megaWallsChosenClassStats["skill_level_c"], 1)} &ndash; ${und(megaWallsChosenClassStats["skill_level_g"], 1)}`, und(megaWallsChosenClassStats["enderchest_rows"], 3)];
  }
}

function getMegaWallsClassStats(className = "", modeName = "") {

  let trueClassName = className;
  if(className != "") {
    className = `${className}_`;
  }

  if(modeName != "") {
    modeName = `_${modeName}`;
  }


  megaWallsClassChipStats = [
    [false, ["Wins", checkAndFormat(megaWallsStats[`${className}wins${modeName}`])], ["Losses", checkAndFormat(megaWallsStats[`${className}losses${modeName}`])], ["W/L R", calculateRatio(megaWallsStats[`${className}wins${modeName}`], megaWallsStats[`${className}losses${modeName}`])]],
    [false, ["Final Kills", checkAndFormat(megaWallsStats[`${className}final_kills${modeName}`])], ["Final Deaths", checkAndFormat(megaWallsStats[`${className}final_deaths${modeName}`])], ["FK/D R", calculateRatio(megaWallsStats[`${className}final_kills${modeName}`], megaWallsStats[`${className}final_deaths${modeName}`])]],
    [false, ["Kills", checkAndFormat(megaWallsStats[`${className}kills${modeName}`])], ["Deaths", checkAndFormat(megaWallsStats[`${className}deaths${modeName}`])], ["K/D R", calculateRatio(megaWallsStats[`${className}kills${modeName}`], megaWallsStats[`${className}deaths${modeName}`])]],
    [false, ["Final Assists", checkAndFormat(megaWallsStats[`${className}final_assists${modeName}`])], ["Assists", checkAndFormat(megaWallsStats[`${className}assists${modeName}`])]],
    [false, ["Class Points", checkAndFormat(megaWallsStats[`${className}wins${modeName}`] * 10 + megaWallsStats[`${className}final_kills${modeName}`])], ["Playtime", smallDuration(megaWallsStats[`${className}time_played${modeName}`] * 60)]],
    [false, ["Wither Kills", checkAndFormat(megaWallsStats[`${className}wither_kills${modeName}`])], ["Damage Dealt", checkAndFormat(megaWallsStats[`${className}damage_dealt${modeName}`] / 2) + " ♥\uFE0E"]],
  ];

  if(modeName == "" && className != "") {
    let megaWallsPrestige = getMegaWallsPrestige(trueClassName);
    if(megaWallsPrestige[0]) {
      megaWallsClassChipStats.unshift([true, ["Prestige", megaWallsPrestige[1]], ["Ender Chest Rows", megaWallsPrestige[2]]]);
    } else {
      megaWallsClassChipStats.unshift([false, ["Upgrades", megaWallsPrestige[1]], ["Ender Chest Rows", megaWallsPrestige[2]]]);
    }
  }
  
  return megaWallsClassChipStats;

}

function generateWarlords() {
  warlordsStats = playerData["stats"]["Battleground"] || {};

  let easyStats = ["kills", "deaths", "wins", "assists", "coins", "void_shards", "magic_dust", "repaired", "powerups_collected"];

  for(let e = 0; e < easyStats.length; e++) {
    updateElement(`warlords-overall-${easyStats[e]}`, checkAndFormat(warlordsStats[easyStats[e]]));
  }

  let warlordsGamesPlayed = sumStatsBasic(["mage_plays", "warrior_plays", "paladin_plays", "shaman_plays"], warlordsStats);
  updateElement("warlords-overall-losses", checkAndFormat(warlordsGamesPlayed - warlordsStats["wins"]));
  updateElement("warlords-overall-wlr", calculateRatio(warlordsStats["wins"], warlordsGamesPlayed - warlordsStats["wins"]));
  updateElement("warlords-overall-kdr", calculateRatio(warlordsStats["kills"], warlordsStats["deaths"]));
  updateElement("warlords-overall-damage", veryLargeNumber(warlordsStats["damage"]) + " HP");
  updateElement("warlords-overall-heal", veryLargeNumber(warlordsStats["heal"]) + " HP");

  let warlordsClassesChip = [
    "warlords-classes",
    "Classes",
    "",
    `/img/games/404.${imageFileType}`,
    getWarlordsClassStats("mage"),
    [
      ["Mage", "mage"],
        ["Pyromancer", "pyromancer"],
        ["Cryomancer", "cryomancer"],
        ["Aquamancer", "aquamancer"],
      ["Warrior", "warrior"],
        ["Berserker", "berserker"],
        ["Defender", "defender"],
        ["Revenant", "revenant"],
      ["Paladin", "paladin"],
        ["Avenger", "avenger"],
        ["Crusader", "crusader"],
        ["Protector", "protector"],
      ["Shaman", "shaman"],
        ["Thunderlord", "thunderlord"],
        ["Spiritguard", "spiritguard"],
        ["Earthwarden", "earthwarden"],
    ],
    ``,
    "warlords",
  ]

  let warlordsCaptureTheFlagChip = [
    "warlords-capturetheflag",
    "Capture the Flag",
    "",
    `/img/games/404.${imageFileType}`,
    [
      [false, ["Wins", checkAndFormat(warlordsStats["wins_capturetheflag"])]],
      [false, ["Kills", checkAndFormat(warlordsStats["kills_capturetheflag"])]],
      [false, ["Flags Returned", checkAndFormat(warlordsStats["flag_returns"])]]
    ],
    [],
    ``,
    "warlords",
  ];

  let warlordsTeamDeathmatchChip = [
    "warlords-teamdeathmatch",
    "Team Deathmatch",
    "",
    `/img/games/404.${imageFileType}`,
    [
      [false, ["Wins", checkAndFormat(warlordsStats["wins_teamdeathmatch"])]],
      [false, ["Kills", checkAndFormat(warlordsStats["kills_teamdeathmatch"])]],
    ],
    [],
    ``,
    "warlords",
  ];

  let warlordsDominationChip = [
    "warlords-domination",
    "Domination",
    "",
    `/img/games/404.${imageFileType}`,
    [
      [false, ["Wins", checkAndFormat(warlordsStats["wins_domination"])]],
      [false, ["Kills", checkAndFormat(warlordsStats["kills_domination"])]],
      [false, ["Total Score", checkAndFormat(warlordsStats["total_domination_score"])], ["Captures", checkAndFormat(warlordsStats["dom_point_captures"])]],
    ],
    [],
    ``,
    "warlords",
  ];

  generateChip(warlordsClassesChip, "warlords-chips");

  let warlordsChips = [warlordsCaptureTheFlagChip, warlordsDominationChip, warlordsTeamDeathmatchChip];
  for (let d = 0; d < warlordsChips.length; d++) {
    generateChip(warlordsChips[d], d % 2 == 0 ? "warlords-chips-1" : "warlords-chips-2");
  }

}

function getWarlordsClassStats(specName) {
  let lookupName = specName;

  let warlordsClasses = {
    mage: ["pyromancer", "cryomancer", "aquamancer"],
    paladin: ["protector", "crusader", "avenger"],
    shaman: ["spiritguard", "earthwarden", "thunderlord"],
    warrior: ["berserker", "defender", "revenant"],
  }
  let className;

  for (let [key, value] of Object.entries(warlordsClasses)) {
    // If the "specName" was actually a class name
    if (value.includes(specName)) {
      className = key;
    }
    if (key == specName) {
      className = key;
      lookupName = key;
    }
  }

  let warlordsClassLevel = sumStatsBasic([`${className}_skill1`, `${className}_skill2`, `${className}_skill3`, `${className}_skill4`, `${className}_skill5`, `${className}_health`, `${className}_energy`, `${className}_cooldown`, `${className}_critchance`, `${className}_critmultiplier`, ], warlordsStats);
  let formattedWarlordsClassLevel;


  let warlordsPrestigedClasses = warlordsStats["prestiged"] || [];
  // check if the array contains the class
  if(warlordsPrestigedClasses.includes(lookupName)) {
    formattedWarlordsClassLevel = generateMinecraftText(`§8[§6${addPrefixZero(warlordsClassLevel, 2)}§8]`);
  } else {
    formattedWarlordsClassLevel = generateMinecraftText(`§8[§7${addPrefixZero(warlordsClassLevel, 2)}§8]`);
  }

  let warlordsClassStats = [
    [false, ["Level", formattedWarlordsClassLevel]],
    [false, ["Wins", checkAndFormat(warlordsStats[`wins_${lookupName}`])], ["Losses", checkAndFormat(warlordsStats[`${lookupName}_plays`] - warlordsStats[`wins_${lookupName}`])], ["W/L R", calculateRatio(warlordsStats[`wins_${lookupName}`], warlordsStats[`${lookupName}_plays`] - warlordsStats[`wins_${lookupName}`])]],
    [false, ["Damage Dealt", veryLargeNumber(warlordsStats[`damage_${lookupName}`]) + " HP"], ["Healing Done", veryLargeNumber(warlordsStats[`heal_${lookupName}`]) + " HP"]],
  ]

  if(className == "mage") {
    warlordsClassStats[2].push(["Damage Prevented", veryLargeNumber(warlordsStats[`damage_prevented_${lookupName}`]) + " HP"]);
  }

  return warlordsClassStats;
}

function generateWoolGames() {

  function getWoolWarsLevel(exp) {
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

  let woolWarsPrestigeIcons = {
    HEART: {icon: "❤\uFE0E", minStars: 0 },
    PLUS: {icon: "✙\uFE0E", minStars: 100 },
    STAR: {icon: "✫\uFE0E", minStars: 200 },
    PLANE: {icon: "✈\uFE0E", minStars: 300 },
    CROSS: {icon: "✠\uFE0E", minStars: 400 },
    CROWN: {icon: "♕\uFE0E", minStars: 500 },
    LIGHTNING: {icon: "⚡\uFE0E", minStars: 600 },
    NUKE: {icon: "☢\uFE0E", minStars: 700 },
    PENCIL: {icon: "✏\uFE0E", minStars: 900 },
    YIN_YANG: {icon: "☯\uFE0E", minStars: 1000 },
  }
  
  let woolGamesStats = playerData["stats"]["WoolGames"] || {};
  let woolWarsStats = woolGamesStats["wool_wars"] || {};
  let woolGamesProgression = woolGamesStats["progression"] || {};
  woolWarsNumericalStats = woolWarsStats["stats"] || {};

  updateElement("woolwars-overall-wins", checkAndFormat(woolWarsNumericalStats["wins"]));
  updateElement("woolwars-overall-losses", checkAndFormat(woolWarsNumericalStats["games_played"] - woolWarsNumericalStats["wins"]));
  updateElement("woolwars-overall-kills", checkAndFormat(woolWarsNumericalStats["kills"]));
  updateElement("woolwars-overall-deaths", checkAndFormat(woolWarsNumericalStats["deaths"]));
  updateElement("woolwars-overall-kdr", calculateRatio(woolWarsNumericalStats["kills"], woolWarsNumericalStats["deaths"]));
  updateElement("woolwars-overall-wlr", calculateRatio(woolWarsNumericalStats["wins"], woolWarsNumericalStats["games_played"] - woolWarsNumericalStats["wins"]));

  updateElement("woolwars-overall-coins", checkAndFormat(woolGamesStats["coins"]));
  updateElement("woolwars-overall-available_layers", checkAndFormat(woolGamesProgression["available_layers"]));

  let woolGamesLevel = getWoolWarsLevel(und(woolGamesProgression["experience"]));
  updateElement("woolwars-progress-number", `${Math.floor(woolGamesLevel % 1 * 100)}%`, true);
  document.getElementById("woolwars-progress-bar").style.width = `${woolGamesLevel % 1 * 100}%`;

  let woolGamesPrestigeIcon;

  if(woolGamesStats["wool_wars_prestige_icon"] != undefined) {
    selectedWoolGamesPrestige = woolWarsPrestigeIcons[woolGamesStats["wool_wars_prestige_icon"]] || woolWarsPrestigeIcons["HEART"];
    woolGamesPrestigeIcon = selectedWoolGamesPrestige["icon"];
  } else {
    // Use the prestige icon based on the user's level (minStars)
    for (const [key, value] of Object.entries(woolWarsPrestigeIcons)) {
      if(woolGamesLevel >= value["minStars"]) {
        woolGamesPrestigeIcon = value["icon"];
      }
    }
  }

  let woolWarsLevels = [
    { req: 0, color: "§7" },
    { req: 100, color: "§f" },
    { req: 200, color: "§c" },
    { req: 300, color: "§6" },
    { req: 400, color: "§e" },
    { req: 500, color: "§a" },
    { req: 600, color: "§3" },
    { req: 700, color: "§5" },
    { req: 800, color: "§d" },
    { req: 900, color: "rainbow" },
    { req: 1000, color: "§f", bracketColor: "§0" },
  ]

  let formattedWoolWarsLevel = getGenericWinsPrefix(Math.floor(woolGamesLevel), woolWarsLevels, undefined, false, woolGamesPrestigeIcon, true);

  updateElement("woolwars-level", formattedWoolWarsLevel, true);

  let woolWarsChip = [
    "woolwars",
    "Wool Wars",
    "",
    `/img/games/404.${imageFileType}`,
    getWoolWarsStats("overall"),
    [
      ["Overall", "overall"],
      ["Archer", "archer"],
      ["Assault", "assault"],
      ["Engineer", "engineer"],
      ["Golem", "golem"],
      ["Swordsman", "swordsman"],
      ["Tank", "tank"],
    ],
    `/img/icon/minecraft/white_wool.${imageFileType}`,
    "woolwars",
  ];

  let woolGamesChips = [woolWarsChip];
  for (d = 0; d < woolGamesChips.length; d++) {
    generateChip(woolGamesChips[d], d % 2 == 0 ? "woolwars-chips-1" : "woolwars-chips-2");
  }
}

function getWoolWarsStats(mode) {
  let woolWarsModeStats, woolWarsWinStats;
  if(mode == "overall") {
    woolWarsModeStats = woolWarsNumericalStats;
    woolWarsWinStats = [false, ["Wins", checkAndFormat(woolWarsModeStats["wins"])], ["Losses", checkAndFormat(woolWarsModeStats["games_played"] - woolWarsModeStats["wins"])], ["W/L R", calculateRatio(woolWarsModeStats["wins"], woolWarsModeStats["games_played"] - woolWarsModeStats["wins"])]];
  } else {
    woolWarsClassStats = woolWarsNumericalStats["classes"] || {};
    woolWarsModeStats = woolWarsClassStats[mode] || {};
    woolWarsWinStats = []
  }

  return [
    woolWarsWinStats,
    [false, ["Kills", checkAndFormat(woolWarsModeStats["kills"])], ["Deaths", checkAndFormat(woolWarsModeStats["deaths"])],  ["K/D R", calculateRatio(woolWarsModeStats["kills"], woolWarsModeStats["deaths"])]],
    [false, ["Assists", checkAndFormat(woolWarsModeStats["assists"])], ["Powerups", checkAndFormat(woolWarsModeStats["powerups_gotten"])]],
    [false, ["Wool Placed", checkAndFormat(woolWarsModeStats["wool_placed"])], ["Blocks Broken", checkAndFormat(woolWarsModeStats["blocks_broken"])]],
  ]
}

function getGenericWinsPrefix(wins, winsObject, definedColor = undefined, useToGo = true, suffix = "", useDifferentBracketColors = false, useBrackets = true) {
  // Generates a title based on the number of wins (or kills, depending on the gamemode) a player has
  let chosenTitle = winsObject[0];
  wins = und(wins);
  let chosenBracketColor;
  let nextTitleWins = ``; // number of wins to next title
  let brackets = ["[", "]"];

  if (!useBrackets) {
    brackets = ["", ""];
  }

  for (let i = 0; i < winsObject.length; i++) {
    if (wins >= winsObject[i]["req"]) {
      chosenTitle = winsObject[i];
    }
  }

  if (useToGo) {
    if (wins >= winsObject[winsObject.length - 1]["req"]) {
      nextTitleWins = " (Max title!)";
    } else {
      nextTitleWins = ` (${checkAndFormat(winsObject[winsObject.indexOf(chosenTitle) + 1]["req"] - wins)} to go)`;
      console.log(winsObject[winsObject.indexOf(chosenTitle) + 1]["req"]);
    }
  }

  if (definedColor != undefined) {
    chosenTitle = winsObject.find((x) => x.internalId == definedColor) || { color: "§f" };
  }

  if(useDifferentBracketColors) {
    chosenBracketColor = chosenTitle["bracketColor"] || chosenTitle["color"];
  } else {
    chosenBracketColor = chosenTitle["color"];
  }

  if (chosenTitle["color"] != "rainbow") {
    return `${generateMinecraftText(`${chosenBracketColor}${brackets[0]}${chosenTitle["color"]}${wins.toString()}${suffix}${chosenBracketColor}${brackets[1]}`, true)}${nextTitleWins}`;
  } else {
    return `${generateMinecraftText(rainbowText(brackets[0] + wins.toString() + suffix + brackets[1]), true)}${nextTitleWins}`;
  }
}

function getBuildBattleTitle(score) {
  // Gets player's Build Battle title based on an amount of score
  let buildBattleTitles = [
    { minimumScore: 0, difference: 100, title: "Rookie", color: "f" },
    { minimumScore: 100, difference: 150, title: "Untrained", color: "8" },
    { minimumScore: 250, difference: 250, title: "Amateur", color: "e" },
    { minimumScore: 500, difference: 500, title: "Apprentice", color: "a" },
    { minimumScore: 1000, difference: 1000, title: "Experienced", color: "d" },
    { minimumScore: 2000, difference: 1500, title: "Seasoned", color: "9" },
    { minimumScore: 3500, difference: 4000, title: "Skilled", color: "3" },
    { minimumScore: 7500, difference: 2500, title: "Talented", color: "c" },
    { minimumScore: 10000, difference: 5000, title: "Professional", color: "5" },
    { minimumScore: 15000, difference: 5000, title: "Expert", color: "1" },
    { minimumScore: 20000, difference: -1, title: "Master", color: "4" },
  ];

  let scoreToGo;
  let chosenTitle = buildBattleTitles[0];
  for (a = 0; a < buildBattleTitles.length; a++) {
    if (score >= buildBattleTitles[a]["minimumScore"]) {
      if (a === buildBattleTitles.length - 1) {
        scoreToGo = -1;
      } else {
        scoreToGo = buildBattleTitles[a + 1]["minimumScore"] - score;
      }
      chosenTitle = buildBattleTitles[a];
    }
  }

  let nextTitlePercentage;
  if (chosenTitle["difference"] == -1) {
    nextTitlePercentage = 1;
  } else {
    nextTitlePercentage = (score - chosenTitle["minimumScore"]) / chosenTitle["difference"];
  }

  return [`<span class="m${chosenTitle["color"]}">${chosenTitle["title"]}</span>`, scoreToGo, nextTitlePercentage];
}

function getDuelsTitle(wins, name = "") {
  // Generates a Duels title based on the number of wins a player has in a certain gamemode
  multiplier = name == "" ? 2 : 1; // Multiply required wins by 2 for general Duels titles

  const duelsTitles = [
    { minimumWins: 0, increment: 50, title: "No Title", color: "8" },
    { minimumWins: 50, increment: 10, title: "Rookie", color: "8" },
    { minimumWins: 100, increment: 30, title: "Iron", color: "f" },
    { minimumWins: 250, increment: 50, title: "Gold", color: "6" },
    { minimumWins: 500, increment: 100, title: "Diamond", color: "3" },
    { minimumWins: 1000, increment: 200, title: "Master", color: "2" },
    { minimumWins: 2000, increment: 600, title: "Legend", color: "4", bold: true },
    { minimumWins: 5000, increment: 1000, title: "Grandmaster", color: "e", bold: true },
    { minimumWins: 10000, increment: 3000, title: "Godlike", color: "5", bold: true },
    { minimumWins: 25000, increment: 5000, title: "CELESTIAL", color: "b", bold: true },
    { minimumWins: 50000, increment: 10000, title: "DIVINE", color: "d", bold: true },
    { minimumWins: 100000, increment: 10000, max: 50, title: "ASCENDED", color: "c", bold: true },
  ];

  let chosenTitle = duelsTitles[0];

  for (let i = 0; i < duelsTitles.length; i++) {
    if (wins >= duelsTitles[i]["minimumWins"] * multiplier) {
      chosenTitle = duelsTitles[i];
    } else {
      break;
    }
  }

  let winsToGo = -1;
  let level = 0;
  if (chosenTitle["title"] != "No Title") {
    level = Math.floor((wins - chosenTitle["minimumWins"] * multiplier) / (chosenTitle["increment"] * multiplier)) + 1;
    winsToGo = chosenTitle["minimumWins"] * multiplier + chosenTitle["increment"] * level * multiplier - wins;

    if ("max" in chosenTitle && level > chosenTitle["max"]) {
      level = chosenTitle["max"];
      winsToGo = -2;
    }
  } else {
    winsToGo = 50 * multiplier - wins;
  }

  let romanSuffix = "";
  if (level > 1) {
    romanSuffix = " " + convertToRoman(level);
  }

  if (name != "") {
    // Adds a space to the name if it's not empty
    name = `${name} `;
  }

  if (chosenTitle["title"] == "No Title") {
    // Remove name with no title so it just says "No Title"
    name = "";
  }

  let rawDuelsTitle = name + chosenTitle["title"] + romanSuffix;

  return [`<span class="m${chosenTitle["color"]}">` + (chosenTitle["bold"] ? `<strong>${rawDuelsTitle}</strong>` : rawDuelsTitle) + `</span>`, winsToGo, chosenTitle["increment"] * multiplier];
}

function generateChips(chipArray, prefix) {
  // Generates all chips from an array
  for (d = 0; d < chipArray.length; d++) {
    generateChip(chipArray[d], d % 2 == 0 ? prefix + "-1" : prefix + "-2");
  }
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
  } else if (gamemode == "wizard") {
    cardWizardSettings[chipId] = newValue;
  } else if (gamemode == "copsandcrims_guns") {
    updateElement(chipId, generateChipStats(getCopsAndCrimsGunStats(newValue)), true);
  } else if (gamemode == "woolwars") {
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
  }
}

function addRecentPlayer(player, colorCode = 7) {
  recentPlayers = JSON.parse(localStorage.getItem(`recent-searches`));
  newRecentPlayer = [player, colorCode];

  if (recentPlayers == null) {
    console.log("Creating new array");
    recentPlayers = [newRecentPlayer];
  } else {
    foundDuplicate = -1;
    for (let a = 0; a < recentPlayers.length; a++) {
      if (recentPlayers[a][0] == newRecentPlayer[0]) {
        foundDuplicate = a;
        break;
      }
    }

    if (foundDuplicate != -1) {
      console.log("Removing duplicate player");
      recentPlayers.splice(foundDuplicate, 1);
    }
    console.log("Adding new player");
    recentPlayers.unshift(newRecentPlayer);
    if (recentPlayers.length > 5) {
      recentPlayers.pop();
    }
  }

  localStorage.setItem(`recent-searches`, JSON.stringify(recentPlayers));
}
