const express = require("express");
const axios = require("axios");
const { minify } = require("terser");
const path = require("path");
const fs = require("fs");
const cleancss = require("clean-css");

const app = express();
const port = 8080;

const version = "1.4.17"; // Updating this will force the cache to clear for all users; doesn't have to be changed for every update

app.set("view engine", "ejs");
app.set("views", "./views");

const jsInput = path.join(__dirname, "public", "external");
const cssInput = path.join(__dirname, "public", "css");

async function minifyFiles() {
  await handleFileMinimization(jsInput, ".js", async (code) => {
    const result = await minify(code);
    return result.code;
  });

  await handleFileMinimization(cssInput, ".css", (code) => {
    return code; //new cleancss().minify(code).styles;
    // clean-css is currently broken and will mess up the stylesheet; see https://github.com/clean-css/clean-css/issues/1280
  });

  console.log("All files are minified!");
}

async function handleFileMinimization(directory, extension, minifyParser) {
  const outputFolder = path.join(directory, "min"); // Define outputFolder per directory
  if (!fs.existsSync(outputFolder)) {
    console.log(`Creating the output folder for the first time`);
    fs.mkdirSync(outputFolder);
  }
  const files = fs.readdirSync(directory);
  console.log(`Minifying ${files.length} file(s) in ${directory}...`);
  for (const file of files) {
    if (path.extname(file) === extension) {
      const filePath = path.join(directory, file);
      const destPath = path.join(outputFolder, file);
      const code = fs.readFileSync(filePath, "utf8");

      // skip minification if filename contains "min"
      let minifiedCode;
      if (!file.includes(".min.js") && !file.includes(".bundle.js")) {
        minifiedCode = await minifyParser(code);
      } else {
        minifiedCode = code;
      }
      console.log(`Writing file to ${destPath}`);
      fs.writeFileSync(destPath, minifiedCode); // write the file
    }
  }
}

app.use(express.static("public"));

minifyFiles()
  .then(() => {
    app.get("/", (req, res) => {
      computationError = {
        message: ``,
        player: ``,
        category: ``,
        page: ``,
      };
      res.render("index", { version });
    });

    let gameAliases = {
      network: ["hypixel", "overall"],
      arcade: ["a"],
      bedwars: ["b", "bw", "bed"],
      blitz: ["bsg", "sg", "hungergames"],
      buildbattle: ["bb", "build", "build_battle"],
      classic: ["legacy", "ab", "arena", "arenabrawl", "pb", "paint", "paintball", "q", "qc", "quake", "quakecraft", "tkr", "turbo", "gingerbread", "turbokartracers", "vz", "vampire", "vampirez", "vampz", "walls"],
      copsandcrims: ["cac", "cvc", "cops", "mcgo"],
      duels: ["d", "duel", "bridge"],
      megawalls: ["mw", "megawall", "megawalls", "mega", "walls3"],
      murdermystery: ["mm", "murder"],
      pit: ["thepit"],
      smashheroes: ["smash", "supersmash"],
      skywars: ["s", "sw", "sky"],
      tntgames: ["tnt", "bow"],
      uhc: ["speeduhc", "suhc", "speed"],
      warlords: ["w", "war", "wl", "bg", "battleground"],
      woolgames: ["ww", "wool", "woolwars"],

      fishing: ["fish", "lobbyfishing"],
    };

    let gameAliasesAchievements = {
      overall: ["hypixel", "network"],
      general: ["gen"],
      arcade: ["a"],
      bedwars: ["b", "bw", "bed"],
      blitz: ["bsg", "sg", "hungergames"],
      buildbattle: ["bb", "build"],
      copsandcrims: ["cac", "cvc", "cops", "mcgo"],
      duels: ["d", "duel", "bridge"],
      megawalls: ["mw", "megawall", "megawalls", "mega", "walls3"],
      murdermystery: ["mm", "murder"],
      pit: ["thepit"],
      smashheroes: ["smash", "supersmash"],
      skywars: ["s", "sw", "sky"],
      tntgames: ["tnt", "bow"],
      uhc: [],
      warlords: ["w", "war", "wl", "bg", "battleground"],
      woolgames: ["ww", "wool", "woolwars"],

      housing: [],
      arena: ["ab", "arenabrawl"],
      paintball: ["pb", "paint"],
      quakecraft: ["q", "qc", "quake"],
      tkr: ["turbokartracers", "turbo", "gingerbread"],
      vampirez: ["vz", "vampire", "vampz"],
      walls: [],
      speeduhc: ["speeduhc", "suhc", "speed"],

      holiday: ["christmas", "christmas2017"],
      halloween: ["halloween2017"],
      summer: [],
      easter: ["spring"],
      legacy: [],
    };

    let cardSupportedGames = ["network", "bedwars", "duels", "skywars", "buildbattle"];

    function und(text, undefinedValue = 0) {
      // Returns a set value (typically 0) in the case of a missing value
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
        return `${hours}h ${minutes}min`;
      } else if (minutes > 0) {
        return `${minutes}min ${secondsMod}s`;
      } else {
        return `${ms ? checkAndFormat(seconds, 3) : secondsMod}s`;
      }
    }

    function stripFormatting(text) {
      return text.replace(/§./g, "");
    }

    function veryLargeNumber(number) {
      // Changes number to compact notation if it's over a million
      number = und(number);
      if (number >= 1000000) {
        return new Intl.NumberFormat("default", { notation: "compact", compactDisplay: "short", maximumSignificantDigits: 4 }).format(number);
      } else {
        return locale(number, 0);
      }
    }

    function addPrefixZero(number, totalLength) {
      // Adds zeroes to the start of a number to make it a certain length
      let numberStr = number.toString();
      while (numberStr.length < totalLength) {
        numberStr = "0" + numberStr;
      }
      return numberStr;
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

    function shortDateFormat(date) {
      return new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        calendar: "gregory",
      }).format(date);
    }

    function relativeTime(timestamp, currentTime = Date.now()) {
      // Returns a timestamp showing how long ago a date was in the past
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

      if (years > 0) timeValue = `${years}y`;
      else if (months > 0) timeValue = `${months}mo}`;
      else if (days > 0) timeValue = `${days}day`;
      else if (hours > 0) timeValue = `${hours}h`;
      else if (minutes > 0) timeValue = `${minutes}min`;
      else if (seconds > 0) timeValue = `${seconds}s`;
      else dateIsInFuture = true;

      if (dateIsInFuture) return `(now!)`;
      else return `(${timeValue} ago)`;
    }

    function getMetaDescription(game, playerData) {
      if (typeof playerData != "undefined") {
        switch (game) {
          case "arcade":
            let arcadeStats = playerData["stats"]["Arcade"] || {};
            let dropperStats = arcadeStats["dropper"] || {};
            let pixelPartyStats = arcadeStats["pixel_party"] || {};

            let arcadeEasyWins = sumStatsBasic(["wins_dayone", "wins_oneinthequiver", "wins_dragonwars2", "wins_ender", "wins_farm_hunt", "wins_soccer", "sw_game_wins", "hider_wins_hide_and_seek", "seeker_wins_hide_and_seek", "wins_hole_in_the_wall", "wins_mini_walls", "wins_party", "wins_simon_says", "wins_draw_their_thing", "wins_throw_out", "wins_zombies", "wins_easter_simulator", "wins_halloween_simulator", "wins_santa_simulator", "wins_scuba_simulator", "wins_grinch_simulator_v2"], arcadeStats);

            let arcadeWins = arcadeEasyWins + und(dropperStats["wins"]) + und(pixelPartyStats["wins"]);
            return `Arcade Stats

• 🏆 Wins: ${arcadeWins}
• 🪙 Coins: ${checkAndFormat(arcadeStats["coins"])}`;

          case "bedwars":
            function getBedWarsLevel(exp) {
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

            let bedWarsStats = playerData["stats"]["Bedwars"] || {};

            let bedWarsLevel = Math.floor(getBedWarsLevel(und(bedWarsStats["Experience"])));

            let prefixIcon;
            if (bedWarsLevel < 1100) {
              prefixIcon = "✫";
            } else if (bedWarsLevel < 2100) {
              prefixIcon = "✪";
            } else if (bedWarsLevel < 3100) {
              prefixIcon = "⚝";
            } else {
              prefixIcon = "✥";
            }

            return `Bed Wars Stats

• ⭐ Level: [${bedWarsLevel}${prefixIcon}]
• 🔥 Winstreak: ${checkAndFormat(bedWarsStats["winstreak"])}

• 🏆 Wins: ${checkAndFormat(bedWarsStats["wins_bedwars"])}
• 💔 Losses: ${checkAndFormat(bedWarsStats["losses_bedwars"])}
• 🏅 W/L R: ${calculateRatio(bedWarsStats["wins_bedwars"], bedWarsStats["losses_bedwars"])}

• 💀 Final Kills: ${checkAndFormat(bedWarsStats["final_kills_bedwars"])}
• ⚰️ Final Deaths: ${checkAndFormat(bedWarsStats["final_deaths_bedwars"])}
• ⚔️ FK/D R: ${calculateRatio(bedWarsStats["final_kills_bedwars"], bedWarsStats["final_deaths_bedwars"])}

• 🟢 Tokens: ${checkAndFormat(bedWarsStats["coins"])}`;
          case "blitz":
            let blitzStats = playerData["stats"]["HungerGames"] || {};
            return `Blitz SG Stats

• 🏆 Wins: ${checkAndFormat(und(blitzStats["wins_solo_normal"]) + und(blitzStats["wins_teams_normal"]))}

• 💀 Kills: ${checkAndFormat(blitzStats["kills"])}
• ⚰️ Deaths: ${checkAndFormat(blitzStats["deaths"])}
• ⚔️ K/D R: ${calculateRatio(blitzStats["kills"], blitzStats["deaths"])}

• 🪙 Coins: ${checkAndFormat(blitzStats["coins"])}
• 📦 Chests Opened: ${checkAndFormat(blitzStats["chests_opened"])}`;
          case "buildbattle":
            let buildBattleTitles = [
              { minimumScore: 0, title: "Rookie" },
              { minimumScore: 100, title: "Untrained" },
              { minimumScore: 250, title: "Amateur" },
              { minimumScore: 500, title: "Prospect" },
              { minimumScore: 1000, title: "Apprentice" },
              { minimumScore: 2000, title: "Experienced" },
              { minimumScore: 3500, title: "Seasoned" },
              { minimumScore: 5000, title: "Trained" },
              { minimumScore: 7500, title: "Skilled" },
              { minimumScore: 10000, title: "Talented" },
              { minimumScore: 15000, title: "Professional" },
              { minimumScore: 20000, title: "Artisan" },
              { minimumScore: 30000, title: "Expert" },
              { minimumScore: 50000, title: "Master" },
              { minimumScore: 100000, title: "Legend" },
              { minimumScore: 200000, title: "Grandmaster" },
              { minimumScore: 300000, title: "Celestial" },
              { minimumScore: 400000, title: "Divine" },
              { minimumScore: 500000, title: "Ascended" },
            ];

            let buildBattleStats = playerData["stats"]["BuildBattle"] || {};

            let buildBattleTitle = "Rookie";
            for (let a = 0; a < buildBattleTitles.length; a++) {
              if (und(buildBattleStats["score"]) >= buildBattleTitles[a].minimumScore) {
                buildBattleTitle = buildBattleTitles[a]["title"];
              }
            }

            return `Build Battle Stats

• ⭐ Score: ${checkAndFormat(buildBattleStats["score"])} (${buildBattleTitle})

• 🏆 Wins: ${checkAndFormat(buildBattleStats["wins"])}
• 💔 Losses: ${locale(und(buildBattleStats["games_played"]) - und(buildBattleStats["wins"]), 0)}
• 🏅 W/L R: ${calculateRatio(buildBattleStats["wins"], und(buildBattleStats["games_played"]) - und(buildBattleStats["wins"]))}

• 🟢 Tokens: ${checkAndFormat(buildBattleStats["coins"])}
• 🗳️ Votes: ${checkAndFormat(buildBattleStats["total_votes"])}`;
          case "classic":
            let classicStats = playerData["stats"]["Legacy"] || {};
            let arenaStats = playerData["stats"]["Arena"] || {};
            let paintballStats = playerData["stats"]["Paintball"] || {};
            let quakeStats = playerData["stats"]["Quake"] || {};
            let vampireZStats = playerData["stats"]["VampireZ"] || {};
            let tkrStats = playerData["stats"]["GingerBread"] || {};
            let wallsStats = playerData["stats"]["Walls"] || {};

            let classicWins = und(arenaStats["wins"]) + und(paintballStats["wins"]) + und(quakeStats["wins"]) + und(vampireZStats["human_wins"]) + und(vampireZStats["vampire_wins"]) + und(tkrStats["wins"]) + und(wallsStats["wins"]);

            let classicKills = und(arenaStats["kills_1v1"]) + und(arenaStats["kills_2v2"]) + und(arenaStats["kills_4v4"]) + und(paintballStats["kills"]) + und(quakeStats["kills"]) + und(quakeStats["kills_teams"]) + und(vampireZStats["human_kills"]) + und(vampireZStats["vampire_kills"]) + und(wallsStats["kills"]);

            let quakeWins = und(quakeStats["wins"]) + und(quakeStats["wins_teams"]);

            return `Classic Games Stats

• 🏆 Wins: ${checkAndFormat(classicWins)}

• 💀 Kills: ${checkAndFormat(classicKills)}
• 🪙 Classic Tokens: ${checkAndFormat(classicStats["tokens"])}

• 🏟️ Arena Brawl Wins: ${checkAndFormat(arenaStats["wins"])}
• 🎨 Paintball Wins: ${checkAndFormat(paintballStats["wins"])}
• 🔫 Quakecraft Wins: ${locale(quakeWins, 0)}
• 🏎️ TKR Gold Trophies: ${checkAndFormat(tkrStats["gold_trophy"])}
• 🦇 VampireZ Wins: ${locale(und(vampireZStats["human_wins"]) + und(vampireZStats["vampire_wins"]), 0)}
• 🧱 Walls Wins: ${checkAndFormat(wallsStats["wins"])}`;
          case "copsandcrims":
            let copsAndCrimsStats = playerData["stats"]["MCGO"] || {};

            let copsAndCrimsWins = und(copsAndCrimsStats["game_wins"]) + und(copsAndCrimsStats["game_wins_gungame"]) + und(copsAndCrimsStats["game_wins_deathmatch"]);

            let copsAndCrimsKills = und(copsAndCrimsStats["kills"]) + und(copsAndCrimsStats["kills_gungame"]) + und(copsAndCrimsStats["kills_deathmatch"]);

            let copsAndKillsAssists = und(copsAndCrimsStats["assists"]) + und(copsAndCrimsStats["assists_gungame"]) + und(copsAndCrimsStats["assists_deathmatch"]);

            let copsAndKillsDeaths = und(copsAndCrimsStats["deaths"]) + und(copsAndCrimsStats["deaths_gungame"]) + und(copsAndCrimsStats["deaths_deathmatch"]);

            return `Cops and Crims Stats

• 🏆 Wins: ${locale(copsAndCrimsWins, 0)}

• 💀 Kills: ${locale(copsAndCrimsKills, 0)}
• 🤝 Assists: ${locale(copsAndKillsAssists, 0)}
• ⚰️ Deaths: ${locale(copsAndKillsDeaths, 0)}
• ⚔️ K/D R: ${calculateRatio(copsAndCrimsKills, copsAndKillsDeaths)}

• 💣 Defusal Wins: ${checkAndFormat(copsAndCrimsStats["game_wins"])}
• 🎯 Deathmatch Wins: ${checkAndFormat(copsAndCrimsStats["game_wins_deathmatch"])}
• 🔫 Gun Game Wins: ${checkAndFormat(copsAndCrimsStats["game_wins_gungame"])}

• 🪙 Coins: ${checkAndFormat(copsAndCrimsStats["coins"])}`;
          case "duels":
            let duelsStats = playerData["stats"]["Duels"] || {};

            function getDuelsTitle(wins) {
              // Generates a Duels title based on the number of wins a player has in a certain gamemode
              multiplier = 2; // Multiply required wins by 2 for general Duels titles

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

              let rawDuelsTitle = chosenTitle["title"] + romanSuffix;

              return rawDuelsTitle;
            }

            return `Duels Stats

• ⭐ Winstreak: ${checkAndFormat(duelsStats["current_winstreak"])}
• 🌟 Best Winstreak: ${checkAndFormat(duelsStats["best_overall_winstreak"])}

• 🏆 Wins: ${checkAndFormat(duelsStats["wins"])} (${getDuelsTitle(und(duelsStats["wins"]))})
• 💔 Losses: ${checkAndFormat(duelsStats["losses"])}
• 🏅 W/L R: ${calculateRatio(und(duelsStats["wins"]), und(duelsStats["losses"]))}

• 💀 Kills: ${checkAndFormat(duelsStats["kills"])}
• ⚰️ Deaths: ${checkAndFormat(duelsStats["deaths"])}
• ⚔️ K/D R: ${calculateRatio(und(duelsStats["kills"]), und(duelsStats["deaths"]))}

• 🟢 Tokens: ${checkAndFormat(duelsStats["coins"])}
• 🖱️ Clicks: ${checkAndFormat(duelsStats["melee_swings"])}`;

          case "megawalls":
            let megaWallsStats = playerData["stats"]["Walls3"] || {};

            let megaWallsFinalKills = sumStatsBasic(["final_kills", "finalKills"], megaWallsStats);
            let megaWallsFinalDeaths = sumStatsBasic(["final_deaths", "finalDeaths"], megaWallsStats);

            let megaWallsClassPoints = megaWallsStats["class_points"] || und(megaWallsStats["wins"]) * 10 + megaWallsFinalKills + und(megaWallsStats["final_assists"]);
            return `Mega Walls Stats

• 🏆 Wins: ${checkAndFormat(megaWallsStats["wins"])}
• 💔 Losses: ${checkAndFormat(megaWallsStats["losses"])}
• 🏅 W/L R: ${calculateRatio(megaWallsStats["wins"], megaWallsStats["losses"])}

• 💀 Final Kills: ${checkAndFormat(megaWallsFinalKills)}
• ⚰️ Final Deaths: ${checkAndFormat(megaWallsFinalDeaths)}
• ⚔️ FK/D R: ${calculateRatio(megaWallsFinalKills, megaWallsFinalDeaths)}

• 🪙 Coins: ${checkAndFormat(megaWallsStats["coins"])}
• ⭐ Points: ${locale(megaWallsClassPoints, 0)}`;

          case "murdermystery":
            let murderMysteryStats = playerData["stats"]["MurderMystery"];

            return `Murder Mystery Stats

• 🏆 Wins: ${checkAndFormat(murderMysteryStats["wins"])}
• 💔 Losses: ${checkAndFormat(und(murderMysteryStats["games"]) - und(murderMysteryStats["wins"]))}
• 🏅 W/L R: ${calculateRatio(murderMysteryStats["wins"], und(murderMysteryStats["games"]) - und(murderMysteryStats["wins"]))}

• 💀 Kills: ${checkAndFormat(murderMysteryStats["kills"])}
• ⚰️ Deaths: ${checkAndFormat(murderMysteryStats["deaths"])}
• ⚔️ K/D R: ${calculateRatio(murderMysteryStats["kills"], murderMysteryStats["deaths"])}

• 🟢 Tokens: ${checkAndFormat(murderMysteryStats["coins"])}`;

          case "pit":
            let pitStats = playerData["stats"]["Pit"] || {};
            let pitProfileStats = pitStats["profile"] || {};
            let pitPtlStats = pitStats["pit_stats_ptl"] || {};

            let pitXpMap = [15, 30, 50, 75, 125, 300, 600, 800, 900, 1000, 1200, 1500, 0];
            let pitPrestiges = [100, 110, 120, 130, 140, 150, 175, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1400, 1600, 1800, 2000, 2400, 2800, 3200, 3600, 4000, 4500, 5000, 7500, 10000, 10100, 10100, 10100, 10100, 10100, 20000, 30000, 40000, 50000, 75000, 100000, 125000, 150000, 175000, 200000, 300000, 500000, 1000000, 5000000, 10000000];
            let pitPrestigeXp = [65950, 138510, 217680, 303430, 395760, 494700, 610140, 742040, 906930, 1104780, 1368580, 1698330, 2094030, 2555680, 3083280, 3676830, 4336330, 5127730, 6051030, 7106230, 8293330, 9612330, 11195130, 13041730, 15152130, 17526330, 20164330, 23132080, 26429580, 31375830, 37970830, 44631780, 51292730, 57953680, 64614630, 71275580, 84465580, 104250580, 130630580, 163605580, 213068080, 279018080, 361455580, 460380580, 575793080, 707693080, 905543080, 1235293080, 1894793080, 5192293080, 11787293080];

            function pitXpToLevel(experience) {
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

              if (x_level == 0) {
                x_level = 1;
              }

              if (x_prestige == 0) {
                return "[" + x_level + "]";
              } else {
                return "[" + convertToRoman(x_prestige) + "-" + x_level + "]";
              }
            }

            return `Pit Stats

• ⭐ Level: ${pitXpToLevel(und(pitProfileStats["xp"]))}

• 💀 Kills: ${checkAndFormat(pitPtlStats["kills"])}
• ⚰️ Deaths: ${checkAndFormat(pitPtlStats["deaths"])}
• ⚔️ K/D R: ${calculateRatio(und(pitPtlStats["kills"]), und(pitPtlStats["deaths"]))}

• 🪙 Gold: ${checkAndFormat(pitProfileStats["cash"])}g
• 👑 Renown: ${checkAndFormat(pitProfileStats["renown"])}

• ⏰ Playtime: ${smallDuration(und(pitPtlStats["playtime_minutes"]) * 60)}
• 🔥 Highest Killstreak: ${checkAndFormat(pitPtlStats["max_streak"])}`;

          case "smashheroes":
            let smashStats = playerData["stats"]["SuperSmash"] || {};

            return `Smash Heroes Stats

• ⭐ Level: ${checkAndFormat(smashStats["smashLevel"])} ✶

• 🏆 Wins: ${checkAndFormat(smashStats["wins"])}
• 💔 Losses: ${checkAndFormat(smashStats["losses"])}
• 🏅 W/L R: ${calculateRatio(smashStats["wins"], smashStats["losses"])}

• 💀 Kills: ${checkAndFormat(smashStats["kills"])}
• ⚰️ Deaths: ${checkAndFormat(smashStats["deaths"])}
• ⚔️ K/D R: ${calculateRatio(smashStats["kills"], smashStats["deaths"])}

• 🪙 Coins: ${checkAndFormat(smashStats["coins"])}`;

          case "skywars":
            let skyWarsStats = playerData["stats"]["SkyWars"] || {};
            return `SkyWars Stats

• ⭐ Level: [${stripFormatting(und(skyWarsStats["levelFormatted"], "1⋆"))}]

• 🏆 Wins: ${checkAndFormat(skyWarsStats["wins"])}
• 💔 Losses: ${checkAndFormat(skyWarsStats["losses"])}
• 🏅 W/L R: ${calculateRatio(skyWarsStats["wins"], skyWarsStats["losses"])}

• 💀 Kills: ${checkAndFormat(skyWarsStats["kills"])}
• ⚰️ Deaths: ${checkAndFormat(skyWarsStats["deaths"])}
• ⚔️ K/D R: ${calculateRatio(skyWarsStats["kills"], skyWarsStats["deaths"])}

• 🪙 Coins: ${checkAndFormat(skyWarsStats["coins"])}
• ⏰ Playtime: ${smallDuration(und(skyWarsStats["time_played"]))}`;

          case "tntgames":
            let tntGamesStats = playerData["stats"]["TNTGames"] || {};
            let tntGamesKills = sumStats(["kills"], ["tntrun", "pvprun", "tntag", "capture", "bowspleef"], tntGamesStats, "_", true);
            let tntGamesDeaths = sumStats(["deaths"], ["tntrun", "pvprun", "tntag", "capture", "bowspleef"], tntGamesStats, "_", true);

            return `TNT Games Stats

• 🏆 Wins: ${checkAndFormat(tntGamesStats["wins"])}

• 💀 Kills: ${checkAndFormat(tntGamesKills)}
• ⚰️ Deaths: ${checkAndFormat(tntGamesDeaths)}
• ⚔️ K/D R: ${calculateRatio(tntGamesKills, tntGamesDeaths)}

• 🏹 Bow Spleef Wins: ${checkAndFormat(tntGamesStats["wins_bowspleef"])}
• 🗡️ PVP Run Wins: ${checkAndFormat(tntGamesStats["wins_pvprun"])}
• 👟 TNT Run Wins: ${checkAndFormat(tntGamesStats["wins_tntrun"])}
• 🧨 TNT Tag Wins: ${checkAndFormat(tntGamesStats["wins_tntag"])}
• 🏰 Wizards Wins: ${checkAndFormat(tntGamesStats["wins_capture"])}

• 🟢 Tokens: ${checkAndFormat(tntGamesStats["coins"])}`;

          case "uhc":
            let uhcStats = playerData["stats"]["UHC"] || {};
            let speedUHCStats = playerData["stats"]["SpeedUHC"] || {};

            let uhcPrefixes = [{ req: 0 }, { req: 10 }, { req: 60 }, { req: 210 }, { req: 460 }, { req: 960 }, { req: 1710 }, { req: 2710 }, { req: 5210 }, { req: 10210 }, { req: 13210 }, { req: 16210 }, { req: 19210 }, { req: 22210 }, { req: 25210 }];

            let speedUHCPrefixes = [{ req: 0 }, { req: 50 }, { req: 300 }, { req: 1050 }, { req: 2560 }, { req: 5550 }, { req: 15550 }, { req: 30550 }, { req: 55550 }, { req: 85550 }];

            let uhcLevel = 0;
            let speedUHCLevel = 0;

            for (let a = 0; a < uhcPrefixes.length; a++) {
              if (und(uhcStats["score"]) >= uhcPrefixes[a]["req"]) {
                uhcLevel = a + 1;
              } else {
                break;
              }
            }

            for (let a = 0; a < speedUHCPrefixes.length; a++) {
              if (und(speedUHCStats["score"]) >= speedUHCPrefixes[a]["req"]) {
                speedUHCLevel = a + 1;
              } else {
                break;
              }
            }

            uhcUnformattedStats = sumStats(["wins", "kills"], ["_solo", "", "_no_diamonds", "_brawl", "_solo_brawl", "_duo_brawl", "_vanilla_doubles"], uhcStats, "", true); // UHC overall stats (but not Speed UHC overall stats) require summation of multiple keys

            return `UHC Stats

• 🪙️ Coins: ${checkAndFormat(uhcStats["coins"])}

• 🍎 UHC Level: [${uhcLevel}✫]
• 🏆 UHC Wins: ${checkAndFormat(uhcUnformattedStats[0])}
• 💀 UHC Kills: ${checkAndFormat(uhcUnformattedStats[1])}

• 🥕 Speed UHC Level: [${speedUHCLevel}❋]
• 🏆 Speed UHC Wins: ${checkAndFormat(speedUHCStats["wins"])}
• 💀 Speed UHC Kills: ${checkAndFormat(speedUHCStats["kills"])}`;
          case "warlords":
            let warlordsStats = playerData["stats"]["Battleground"] || {};

            let warlordsGamesPlayed = sumStatsBasic(["mage_plays", "warrior_plays", "paladin_plays", "shaman_plays"], warlordsStats);

            return `Warlords Stats

• 🏆 Wins: ${checkAndFormat(warlordsStats["wins"])}
• 💔 Losses: ${checkAndFormat(warlordsGamesPlayed - und(warlordsStats["wins"]))}
• 🏅 W/L R: ${calculateRatio(warlordsStats["wins"], warlordsGamesPlayed - und(warlordsStats["wins"]))}

• 💀 Kills: ${checkAndFormat(warlordsStats["kills"])}
• ⚰️ Deaths: ${checkAndFormat(warlordsStats["deaths"])}
• ⚔️ K/D R: ${calculateRatio(warlordsStats["kills"], warlordsStats["deaths"])}

• 🏳️ Capture the Flag Wins: ${checkAndFormat(warlordsStats["wins_capturetheflag"])}
• 📍 Domination Wins: ${checkAndFormat(warlordsStats["wins_domination"])}
• 🛡️ Team Deathmatch Wins: ${checkAndFormat(warlordsStats["wins_teamdeathmatch"])}

• 🪙 Coins: ${checkAndFormat(warlordsStats["coins"])}`;
          case "woolgames": {
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

            let woolGamesStats = playerData["stats"]["WoolGames"] || {};
            let woolWarsStats = woolGamesStats["wool_wars"] || {};

            let woolGamesProgression = woolGamesStats["progression"] || {};
            woolWarsNumericalStats = woolWarsStats["stats"] || {};

            let captureTheWoolStats = woolGamesStats["capture_the_wool"] || {};
            let captureTheWoolNumericalStats = captureTheWoolStats["stats"] || {};

            let sheepWarsStats = woolGamesStats["sheep_wars"] || {};
            let sheepWarsNumericalStats = sheepWarsStats["stats"] || {};

            let captureTheWoolStatsObject = {};

            let arcadeStats = playerData["stats"]["Arcade"] || {};
            captureTheWoolStatsObject["wins"] = und(captureTheWoolNumericalStats["participated_wins"] || arcadeStats["woolhunt_participated_wins"]);
            captureTheWoolStatsObject["losses"] = und(captureTheWoolNumericalStats["participated_losses"] || arcadeStats["woolhunt_participated_losses"]);
            captureTheWoolStatsObject["kills"] = und(captureTheWoolNumericalStats["kills"] || arcadeStats["woolhunt_kills"]);
            captureTheWoolStatsObject["deaths"] = und(captureTheWoolNumericalStats["deaths"] || arcadeStats["woolhunt_deaths"]);

            let woolGamesOverallStats = {};
            woolGamesOverallStats["wins"] = captureTheWoolStatsObject["wins"] + und(woolWarsNumericalStats["wins"]) + und(sheepWarsNumericalStats["wins"]);
            woolGamesOverallStats["losses"] = captureTheWoolStatsObject["losses"] + und(woolWarsNumericalStats["games_played"]) - und(woolWarsNumericalStats["wins"]) + und(sheepWarsNumericalStats["losses"]);
            woolGamesOverallStats["kills"] = captureTheWoolStatsObject["kills"] + und(woolWarsNumericalStats["kills"]) + und(sheepWarsNumericalStats["kills"]);
            woolGamesOverallStats["deaths"] = captureTheWoolStatsObject["deaths"] + und(woolWarsNumericalStats["deaths"]) + und(sheepWarsNumericalStats["deaths"]);

            let woolGamesPrestigeIcons = {
              HEART: { icon: "❤\uFE0E", minStars: 0 },
              PLUS: { icon: "✙\uFE0E", minStars: 100 },
              STAR: { icon: "✫\uFE0E", minStars: 200 },
              PLANE: { icon: "✈\uFE0E", minStars: 300 },
              CROSS: { icon: "✠\uFE0E", minStars: 400 },
              CROWN: { icon: "♕\uFE0E", minStars: 500 },
              LIGHTNING: { icon: "⚡\uFE0E", minStars: 600 },
              NUKE: { icon: "☢\uFE0E", minStars: 700 },
              PENCIL: { icon: "✏\uFE0E", minStars: 900 },
              YIN_YANG: { icon: "☯\uFE0E", minStars: 1000 },
            };

            let woolGamesPrestigeIcon;
            let woolGamesLevel = getWoolGamesLevel(und(woolGamesProgression["experience"]));

            if (woolGamesStats["wool_wars_prestige_icon"] != undefined) {
              selectedWoolGamesPrestige = woolGamesPrestigeIcons[woolGamesStats["wool_wars_prestige_icon"]] || woolGamesPrestigeIcons["HEART"];
              woolGamesPrestigeIcon = selectedWoolGamesPrestige["icon"];
            } else {
              // Use the prestige icon based on the user's level (minStars)
              for (const [key, value] of Object.entries(woolGamesPrestigeIcons)) {
                if (woolGamesLevel >= value["minStars"]) {
                  woolGamesPrestigeIcon = value["icon"];
                }
              }
            }

            return `Wool Games Stats

• ⭐ Level: [${Math.floor(woolGamesLevel)}${woolGamesPrestigeIcon}]

• 🏆 Wins: ${checkAndFormat(woolGamesOverallStats["wins"])}
• 💔 Losses: ${checkAndFormat(woolGamesOverallStats["losses"])}
• 🏅 W/L R: ${calculateRatio(woolGamesOverallStats["wins"], woolGamesOverallStats["losses"])}

• 💀 Kills: ${checkAndFormat(woolGamesOverallStats["kills"])}
• ⚰️ Deaths: ${checkAndFormat(woolGamesOverallStats["deaths"])}
• ⚔️ K/D R: ${calculateRatio(woolGamesOverallStats["kills"], woolGamesOverallStats["deaths"])}

• 🟧 Capture the Wool Wins: ${checkAndFormat(captureTheWoolStatsObject["wins"])}
• 🐑 Sheep Wars Wins: ${checkAndFormat(sheepWarsNumericalStats["wins"])}
• 🥊 Wool Wars Wins: ${checkAndFormat(woolWarsNumericalStats["wins"])}

• 🧶 Wool: ${checkAndFormat(woolGamesStats["coins"])}`;
          }
          default:
            let playerOnline;
            let playerStatus = playerData["status"] || {};

            if (playerStatus["online"]) {
              playerOnline = "🟢 Online!";
            } else {
              playerOnline = "🔴 Offline";
            }

            return `${playerOnline}

• 🌐 Network Level: ${playerData["profile"]["network_level"].toFixed(2)}
• 📜 Quests Completed: ${checkAndFormat(playerData["profile"]["quests_completed"])}
• ☮️ Karma: ${checkAndFormat(playerData["profile"]["karma"])}
• 🏆 Achievement Points: ${checkAndFormat(playerData["profile"]["achievement_points"])}
• 🎁 Ranks Gifted: ${checkAndFormat(playerData["profile"]["ranks_gifted"])}`;

          case "fishing":
            let fishingStats = getValue(playerData, ["stats", "MainLobby", "fishing"]) || {};

            const getTotalCaught = (stats, category) => {
              const environments = ["water", "lava", "ice"];
              return environments.reduce((total, env) => {
                return total + und(getValue(stats, ["stats", "permanent", env, category]));
              }, 0);
            };

            const overallFishCaught = getTotalCaught(fishingStats, "fish");
            const overallJunkCaught = getTotalCaught(fishingStats, "junk");
            const overallTreasureCaught = getTotalCaught(fishingStats, "treasure");

            const orbs = ["helios", "selene", "nyx", "aphrodite", "zeus", "archimedes", "hades"];

            function getMythicalFishCount(orb) {
              const path = ["orbs", orb];
              const value = getValue(fishingStats, path);
              return und(value);
            }

            const mythicalFishCounts = orbs.map(getMythicalFishCount);
            const overallMythicalFishCaught = mythicalFishCounts.reduce((sum, count) => sum + count, 0);

            let playerSpecialFish = fishingStats["special_fish"] || [];

            let specialFishCount = 0;

            for (let key in playerSpecialFish) {
              if (playerSpecialFish[key] && key != "mahi-mahi") {
                // mahi-mahi is in the API two times (once as mahi-mahi and once as mahi_mahi)
                specialFishCount++;
              }
            }

            let maxSpecialFish = 44;

            return `Fishing Stats
• 📦 Items Caught: ${checkAndFormat(und(overallFishCaught) + und(overallJunkCaught) + und(overallTreasureCaught) + und(overallMythicalFishCaught) + specialFishCount)}

• 🐟 Fish Caught: ${checkAndFormat(overallFishCaught)}
• 🗑️ Junk Caught: ${checkAndFormat(overallJunkCaught)}
• 🎁 Treasure Caught: ${checkAndFormat(overallTreasureCaught)}
• 🐠 Mythical Fish Caught: ${checkAndFormat(overallMythicalFishCaught)}

• 🎣 Special Fish Caught: ${checkAndFormat(specialFishCount)}/${maxSpecialFish}`;

          case "guild": {
            let guildDescription = playerData["description"] || "No description";
            if (guildDescription != null) {
              guildDescription = `“${guildDescription}”`;
            }

            return `${guildDescription}

Guild Stats

• 🏅 Level: ${checkAndFormat(Math.floor(playerData["level"]))}
• 👥 Members: ${checkAndFormat(playerData["members"].length)}
• 📆 Created: ${shortDateFormat(playerData["created"])} ${relativeTime(playerData["created"])}
`;
          }
          case "achievements": {
            let playerTieredAchievements = getValue(playerData, ["player", "achievements"]) || {};
            let playerOneTimeAchievements = getValue(playerData, ["player", "achievements_one_time"]) || [];
            let globalAchievements = getValue(playerData, ["global", "achievements"]) || {};


            let achievementGames = ["arcade", "arena", "bedwars", "blitz", "buildbattle", "copsandcrims", "duels", "easter", "general", "christmas2017", "halloween2017", "housing", "walls3", "murdermystery", "paintball", "pit", "quake", "skyblock", /*"skyclash",*/ "skywars", "speeduhc", "summer", "supersmash", "tntgames", "gingerbread", /*"truecombat",*/ "uhc", "vampirez", "walls", "warlords", "woolgames"];

            let achievementNames = {
              arcade: "🕹️ Arcade",
              arena: "🏟️ Arena Brawl",
              bedwars: "🛏️ Bed Wars",
              blitz: "💫 Blitz",
              buildbattle: "🛠️ Build Battle",
              copsandcrims: "🚔 Cops and Crims",
              truecombat: "🪙 Crazy Walls",
              duels: "⚔️ Duels",
              easter: "🐰 Easter",
              general: "⭐ General",
              christmas2017: "🎁 Holiday",
              halloween2017: "🎃 Halloween",
              housing: "🏠 Housing",
              walls3: "💀 Mega Walls",
              murdermystery: "🔪 Murder Mystery",
              paintball: "🎨 Paintball",
              pit: "🕳️ Pit",
              quake: "💥 Quakecraft",
              skyblock: "🏝️ SkyBlock",
              skyclash: "☀️ SkyClash",
              skywars: "🌌 SkyWars",
              speeduhc: "🥕 Speed UHC",
              summer: "☀️ Summer",
              supersmash: "🥊 Smash Heroes",
              tntgames: "🧨 TNT Games",
              gingerbread: "🏎️ Turbo Kart Racers",
              uhc: "🍎 UHC",
              vampirez: "🧛 VampireZ",
              walls: "🏰 Walls",
              warlords: "⚔️ Warlords",
              woolgames: "🧶 Wool Games",
            };

            let maxedGames = [];

            let achievementStatistics = {
              points: 0,
              achievements: 0,
              global_points: 0,
              global_achievements: 0,
              legacy_points: 0,
              legacy_achievements: 0,

              games: {},
            };

            let achievementGamesArray = [];

            for (let a = 0; a < achievementGames.length; a++) {
              let achievementGame = achievementGames[a];
              let gameObject = {
                points: 0,
                achievements: 0,
                global_points: 0,
                global_achievements: 0,
                legacy_points: 0,
                legacy_achievements: 0,
                progress_achievements: 0,
              };

              achievementStatistics["games"][achievementGame] = {};

              let gameAchievements = getValue(globalAchievements, [achievementGame]);
              let gameOneTimeAchievements = getValue(gameAchievements, ["one_time"]);
              let gameTieredAchievements = getValue(gameAchievements, ["tiered"]);

              for (let key in gameOneTimeAchievements) {
                let achievement = gameOneTimeAchievements[key];

                key = key.toLowerCase();

                if (achievement["legacy"]) {
                  // TODO
                } else {
                  if (playerOneTimeAchievements.includes(`${achievementGame}_${key}`)) {
                    gameObject["achievements"]++;
                    gameObject["points"] += achievement["points"];
                    achievementStatistics["achievements"]++;
                    achievementStatistics["points"] += achievement["points"];
                  }
                  gameObject["global_achievements"]++;
                  gameObject["global_points"] += achievement["points"];
                  achievementStatistics["global_achievements"]++;
                  achievementStatistics["global_points"] += achievement["points"];
                }
              }

              for (let key in gameTieredAchievements) {
                let achievement = gameTieredAchievements[key];

                if (achievement["legacy"]) {
                  // TODO
                } else {
                  let playerAchievement = und(playerTieredAchievements[achievementGame + "_" + key.toLowerCase()]);

                  for (let a = 0; a < achievement["tiers"].length; a++) {
                    let tier = achievement["tiers"][a];
                    if (playerAchievement >= tier["amount"]) {
                      gameObject["achievements"]++;
                      gameObject["points"] += tier["points"];
                      achievementStatistics["achievements"]++;
                      achievementStatistics["points"] += tier["points"];
                    }

                    gameObject["global_achievements"]++;
                    gameObject["global_points"] += tier["points"];
                    achievementStatistics["global_achievements"]++;
                    achievementStatistics["global_points"] += tier["points"];
                  }
                }
              }

              gameObject["progress_achievements"] = und(gameObject["achievements"] / gameObject["global_achievements"]);
              gameObject["game"] = achievementGame;
              if (gameObject["progress_achievements"] == 1) {
                maxedGames.push(achievementNames[achievementGame]);
              } else {
                achievementGamesArray.push(gameObject);
              }

              achievementStatistics["games"][achievementGame] = gameObject;
            }

            // sort achievementGamesArray by points
            achievementGamesArray.sort((a, b) => b["progress_achievements"] - a["progress_achievements"]);

            let achievementGamesString = "";

            for (let a = 0; a < Math.min(achievementGamesArray.length, 5); a++) {
              let gameObject = achievementGamesArray[a];
              if (gameObject) {
                achievementGamesString += `• ${achievementNames[gameObject["game"]]}: ${gameObject["achievements"]} / ${gameObject["global_achievements"]} (${checkAndFormat(gameObject["progress_achievements"] * 100, 1)}%)\n`;
              }
            }

            return `Achievements Stats

• 🏆 Achievement Points: ${checkAndFormat(achievementStatistics["points"])} / ${checkAndFormat(achievementStatistics["global_points"])}
• 🌟 Achievements: ${checkAndFormat(achievementStatistics["achievements"])} / ${checkAndFormat(achievementStatistics["global_achievements"])}
• 🌠 Maxed Games: ${maxedGames.join(", ") || "None"}

${achievementGamesString}`;
          }
          case "quests": {
            return `View your quest stats on nadeshiko!`;
          }
          case "leaderboards": {
            return `🥇 Check out the top players in over one hundred categories using nadeshiko's leaderboards!`;
          }
          case "skyblock": {
            return `View your SkyBlock stats on nadeshiko!`;
          }
        }
      }
    }

    app.get("/player/:name/:game?", async (req, res) => {
      const name = req.params.name;

      computationError = {
        message: ``,
        player: ``,
        category: ``,
        page: ``,
      };

      try {
        let game = req.params.game;
        if (game) {
          game = game.toLowerCase();

          // Check if the specified game name is an alias
          for (let key in gameAliases) {
            if (gameAliases[key].includes(game)) {
              game = key;
              break;
            }
          }
        }

        const response = await axios.get(`http://localhost:2000/stats?name=${name}`);
        let playerData = response.data;

        let metaImageURL, metaDescription;
        if (playerData && playerData["profile"]) {
          // If the player data is available
          metaDescription = getMetaDescription(game, playerData);

          if (cardSupportedGames.includes(game)) {
            // Check if the game is supported by the card generator

            metaImageURL = `https://nadeshiko.io/card/${Buffer.from(`{"name":"${playerData["name"]}","game":"${game.toUpperCase()}","size":"FULL"}`).toString("base64")}`;
          } else {
            // If there's no game is not valid or supported, default to NETWORK
            metaImageURL = `https://nadeshiko.io/card/${Buffer.from(`{"name":"${playerData["name"]}","game":"NETWORK","size":"FULL"}`).toString("base64")}`;
          }
        } else {
          // If the player data is not available, don't show a card and show a default description
          metaImageURL = ``;
          metaDescription = `🌸 View Hypixel stats and generate real-time stat cards – perfect for forum signatures or to show off to friends!`;
        }

        res.render("player", { name, playerData, game, metaImageURL, metaDescription, version });
      } catch (error) {
        if (error.response && error.response.status == 404) {
          computationError = {
            message: `No player by the name of ${name} was found :(`,
            player: name,
            category: "404",
            page: "player",
          };
        } else {
          computationError = {
            message: `Could not find stats of player ${name} (${error})`,
            player: name,
            error: error["message"],
            category: "computation",
            page: "player",
          };
          console.error("Fetching player data failed! → ", error);
        }
        res.render("index", { computationError, version });
      }
    });

    app.use((req, res, next) => {
      const host = req.headers.host || '';
      const subdomain = host.split(".")[0];

      if (subdomain === "skyblock") {
        // Middleware handling for /skyblock subdomain. I'm not using express-subdomain because I couldn't get it to work (is she stupid??)
        let paths = req.path.split("/").filter((pathSegment) => pathSegment !== "");
        console.log(paths);
        let name = paths[0] || "";
        handleSkyBlockRoute(name, req, res);
      } else {
        next();
      }
    });

    const handleSkyBlockRoute = async (name, req, res) => {
      computationError = {
        message: ``,
        player: ``,
        category: ``,
        page: ``,
      };
      res.render("index", { computationError, version }); // no more skyblock

      try {
        const response = await axios.get(`http://localhost:2000/skyblock?name=${name}`);
        let skyblockData = response.data;

        let metaDescription;
        if (skyblockData && skyblockData["profile"]) {
          // If the player data is available
          metaDescription = getMetaDescription("skyblock");
        } else {
          // If the player data is not available, don't show a card and show a default description
          metaImageURL = ``;
          metaDescription = `🌸 View Hypixel stats and generate real-time stat cards – perfect for forum signatures or to show off to friends!`;
        }

        res.render("skyblock", { name, skyblockData, metaDescription, version });
      } catch (error) {
        if (error.response && error.response.status == 404) {
          computationError = {
            message: `No player by the name of ${name} was found :(`,
            player: name,
            category: "404",
            page: "skyblock",
          };
        } else {
          computationError = {
            message: `Could not find SkyBlock stats of player ${name} (${error})`,
            player: name,
            error: error["message"],
            category: "computation",
            page: "skyblock",
          };
          console.error("Fetching player data failed! → ", error);
        }
        res.render("index", { computationError, version });
      }
    };

    app.get("/skyblock/:name?", async (req, res) => {
      const name = req.params.name;
      handleSkyBlockRoute(name, req, res);
    });

    app.get("/isnadeshikodown", (req, res) => {
      res.send("No (probably)");
    });

    app.get("/card/:base64", async (req, res) => {
      try {
        const { base64 } = req.params;

        const targetUrl = `http://localhost:2000/card/${encodeURIComponent(base64)}`;

        // Use axios to forward the request
        const response = await axios.get(targetUrl, {
          responseType: "arraybuffer", // Important for images/binary content
        });

        // Forward the headers and status code from the response, and then...
        res.set(response.headers);
        res.status(response.status);

        // Send back the response data!
        res.send(response.data);
      } catch (error) {
        // Error handling
        if (error.response && error.response.status == 404) {
          console.error("404: Player not found");
        } else {
          console.error("Error forwarding the request:", error);
        }
        res.status(500).send("Error forwarding request: " + error);
      }
    });

    async function fetchGuildData(endpoint, name) {
      const response = await axios.get(`http://localhost:2000/guild?${endpoint}=${name}`);
      let guildData = response.data;

      let metaDescription;
      if (guildData) {
        metaDescription = getMetaDescription("guild", guildData);
      } else {
        metaDescription = `🌸 View Hypixel stats and generate real-time stat cards – perfect for forum signatures or to show off to friends!`;
      }

      return { guildData, metaDescription };
    }

    async function handleGuildRoute(name, res) {
      try {
        // Trying the ID first: probably the most efficient thing to do. You probably don't need the regex to search caps too but ¯\_(ツ)_/¯
        if (name && name.length === 24 && /^[0-9a-fA-F]+$/.test(name)) {
          try {
            const { guildData, metaDescription } = await fetchGuildData("id", name);
            return res.render("guild", { name, guildData, metaDescription, version });
          } catch {
            // ?
          }
        }

        try {
          const { guildData, metaDescription } = await fetchGuildData("name", name);
          return res.render("guild", { name, guildData, metaDescription, version });
        } catch {
          const { guildData, metaDescription } = await fetchGuildData("player", name);
          return res.render("guild", { name, guildData, metaDescription, version });
        }

      } catch (error) {
        computationError = {
          message: `Could not find guild with name ${name} (${error})`,
          player: name,
          error: error["message"],
          category: "computation",
          page: "guild",
        };
        console.error("Fetching guild data failed! → ", error);
        res.render("index", { computationError, version });
      }
    }

    app.get("/guild/:name?", async (req, res) => {
      const name = req.params.name;

      computationError = {
        message: ``,
        player: ``,
        category: ``,
        page: ``,
      };

      // if name is exactly 24 characters, all hexadecimal, it's a guild ID
      if (name && name.length == 24 && /^[0-9a-fA-F]+$/.test(name)) {
      }

      try {
        const response = await axios.get(`http://localhost:2000/guild?name=${name}`);
        let guildData = response.data;

        let metaDescription;
        if (guildData) {
          // If the guild data is available
          metaDescription = getMetaDescription("guild", guildData);
        } else {
          // If the player data is not available, don't show a card and show a default description
          metaDescription = `🌸 View Hypixel stats and generate real-time stat cards – perfect for forum signatures or to show off to friends!`;
        }

        res.render("guild", { name, guildData, metaDescription, version });
      } catch (error) {
        try {
          const response = await axios.get(`http://localhost:2000/guild?player=${name}`);
          let guildData = response.data;

          let metaDescription;
          if (guildData) {
            // If the guild data is available
            metaDescription = getMetaDescription("guild", guildData);
          } else {
            // If the player data is not available, don't show a card and show a default description
            metaDescription = `🌸 View Hypixel stats and generate real-time stat cards – perfect for forum signatures or to show off to friends!`;
          }

          res.render("guild", { name, guildData, metaDescription, version });
        } catch (error) {
          computationError = {
            message: `Could not find guild with name ${name} (${error})`,
            player: name,
            error: error["message"],
            category: "computation",
            page: "guild",
          };
          console.error("Fetching guild data failed! → ", error);
          res.render("index", { computationError, version });
        }
      }
    });

    app.get("/achievements/:name/:game?", async (req, res) => {
      const name = req.params.name;

      computationError = {
        message: ``,
        player: ``,
        category: ``,
        page: ``,
      };

      try {
        let game = req.params.game;
        if (game) {
          game = game.toLowerCase();

          // Check if the specified game name is an alias
          for (let key in gameAliasesAchievements) {
            if (gameAliasesAchievements[key].includes(game)) {
              game = key;
              break;
            }
          }
        }

        const response = await axios.get(`http://localhost:2000/achievements?name=${name}`);
        let achievementsData = response.data;

        if (achievementsData["player"]["profile"] == null) {
          throw new Error("Player has no Hypixel stats");
        }

        let metaDescription;
        if (achievementsData) {
          // If the guild data is available
          metaDescription = getMetaDescription("achievements", achievementsData);
        } else {
          // If the achievements data is not available, show a default description
          metaDescription = `🌸 View Hypixel stats and generate real-time stat cards – perfect for forum signatures or to show off to friends!`;
        }

        res.render("achievements", { name, achievementsData, game, metaDescription, version });
      } catch (error) {
        computationError = {
          message: `Could not find achievement stats of player ${name} (${error})`,
          player: name,
          error: error["message"],
          category: "computation",
          page: "achievements",
        };
        console.error("Fetching achievements data failed! → ", error);
        res.render("index", { computationError, version });
      }
    });

    app.get("/quests/:name?", async (req, res) => {
      const name = req.params.name;

      computationError = {
        message: ``,
        player: ``,
        category: ``,
        page: ``,
      };

      try {
        const response = await axios.get(`http://localhost:2000/quests?name=${name}`);
        let questsData = response.data;

        if (questsData["player"]["profile"] == null) {
          throw new Error("Player has no Hypixel stats");
        }

        let metaDescription;
        if (questsData) {
          // If the guild data is available
          metaDescription = getMetaDescription("quests", questsData);
        } else {
          // If the quests data is not available, show a default description
          metaDescription = `🌸 View Hypixel stats and generate real-time stat cards – perfect for forum signatures or to show off to friends!`;
        }

        res.render("quests", { name, questsData, metaDescription, version });
      } catch (error) {
        computationError = {
          message: `Could not find quests stats of player ${name} (${error})`,
          player: name,
          error: error["message"],
          category: "computation",
          page: "quests",
        };
        console.error("Fetching quests data failed! → ", error);
        res.render("index", { computationError, version });
      }
    });

    app.get("/leaderboard", async (req, res) => {
      const leaderboardType = req.query.leaderboard || "NETWORK_LEVEL";
      const page = req.query.page || 1;

      try {
        const backendUrl = `http://localhost:2000/leaderboard?leaderboard=${leaderboardType}&page=${page}`;
        const response = await axios.get(backendUrl);

        res.json(response.data);
      } catch (error) {
        console.error("Error fetching data from backend:", error);

        if (error.response) {
          const status = error.response.status;
          if (status === 400) {
            res.status(400).json(error.response.data);
          } else if (status === 404) {
            res.status(404).json({ success: false, cause: "Leaderboard not found" });
          } else {
            res.status(status).json({ success: false, cause: "Backend error occurred" });
          }
        } else {
          res.status(500).json({ success: false, cause: "Internal server error" });
        }
      }
    });

    app.get("/rankings", async (req, res) => {
      const uuid = req.query.uuid;

      try {
        const backendUrl = `http://localhost:2000/rankings?uuid=${uuid}`;
        const response = await axios.get(backendUrl);

        res.json(response.data);
      } catch (error) {
        console.error("Error fetching data from backend:", error);

        if (error.response) {
          const status = error.response.status;
          if (status === 400) {
            res.status(400).json(error.response.data);
          } else if (status === 404) {
            res.status(404).json({ success: false, cause: "Rankings not found" });
          } else {
            res.status(status).json({ success: false, cause: "Backend error occurred" });
          }
        } else {
          res.status(500).json({ success: false, cause: "Internal server error" });
        }
      }
    });

    app.get("/leaderboards", async (req, res) => {
      res.render("leaderboards", { version });
    });

    app.get("/:name/:game?", (req, res) => {
      const { name, game } = req.params;

      if (/[^A-Za-z0-9_-]/.test(name)) {
        computationError = {
          message: `No player by the name of ${name} was found :(`,
          player: name,
          category: "404",
          page: "player",
        };

        res.render("index", { computationError, version });
      } else {
        res.redirect(`/player/${name}/${game == undefined ? "" : game}`);
      }
    });

    app.listen(port, () => {
      console.log(`nadeshiko is listening at https://localhost:${port}!`);
    });
  })
  .catch((error) => {
    console.error("Error during minification:", error);
    process.exit(1); // this should never happen!
  });
