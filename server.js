const express = require('express');
const axios = require('axios');
const minify = require('express-minify');

const app = express();
const port = 8080;

app.set('view engine', 'ejs');
app.set('views', './views');
/*
app.use(minify({
  cache: false,
  js_match: /javascript/,
  css_match: /css/,
  ejs_match: /ejs/,
}));
console.log("Minify enabled!");
*/
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

let gameAliases = {
  network: ["hypixel", "overall"],
  arcade: ["a"],
  bedwars: ["b", "bw", "bed"],
  blitz: ["bsg", "sg", "hungergames"],
  buildbattle: ["bb", "build"],
  classic: ["legacy", "ab", "arena", "arenabrawl", "pb", "paint", "paintball", "q", "qc", "quake", "quakecraft", "tkr", "turbo", "gingerbread", "turbokartracers", "vz", "vampire", "vampirez", "vampz", "walls"],
  copsandcrims: ["cac", "cvc", "cops", "mcgo"],
  duels: ["d", "duel"],
  megawalls: ["mw", "megawall", "megawalls", "mega", "walls3"],
  murdermystery: ["mm", "murder"],
  pit: ["thepit"],
  smashheroes: ["smash", "supersmash"],
  skywars: ["s", "sw", "sky"],
  tntgames: ["tnt"],
  uhc: ["speeduhc", "suhc", "speed"],
  warlords: ["w", "war", "wl", "bg", "battleground"],
  woolwars: ["ww", "wool", "woolgames"],
}

let hypixelGames = ["network", "arcade", "bedwars", "blitz", "buildbattle", "classic", "copsandcrims", "duels", "megawalls", "murdermystery", "pit", "smashheroes", "skywars", "tntgames", "uhc", "warlords", "woolwars"];

let cardSupportedGames = ["network", "bedwars", "duels"];

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
      element.innerHTML = value;
    } else {
      element.textContent = value;
    }
  } else {
    console.warn(`Element with ID ${id} not found!`);
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

function stripFormatting(text) {
  return text.replace(/§./g, '');
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

function sumStatsBasic(statNames, statArray) {
  // Adds stats and returns a result
  let statSum = 0;
  for (a = 0; a < statNames.length; a++) {
    statSum += und(statArray[statNames[a]]);
  }
  return statSum;
}

// let hypixelGames = ["network", "arcade", "bedwars", "blitz", "buildbattle", "classic", "copsandcrims", "duels", "megawalls", "murdermystery", "pit", "smashheroes", "skywars", "tntgames", "uhc", "warlords", "woolwars"];

function getMetaDescription(game, playerData) {
  if(typeof playerData != "undefined") {
  switch(game) {
    default:
      let playerOnline;
      if(playerData["status"]["online"]) {
        playerOnline = "🟢 Online!";
      } else {
        playerOnline = "🔴 Offline";
      }

      return `${playerOnline}

• 🌐 Network Level: ${(playerData["profile"]["network_level"]).toFixed(2)}
• 📜 Quests Completed: ${(playerData["profile"]["quests_completed"]).toLocaleString()}
• ☮️ Karma: ${(playerData["profile"]["karma"]).toLocaleString()}
• 🏆 Achievement Points: ${(playerData["profile"]["achievement_points"]).toLocaleString()}
• 🎁 Ranks Gifted: ${(playerData["profile"]["ranks_gifted"]).toLocaleString()}`;
    case 'arcade':
      let arcadeStats = playerData["stats"]["Arcade"] || {};
      let dropperStats = arcadeStats["dropper"] || {};
      let pixelPartyStats = arcadeStats["pixel_party"] || {};
      
      let arcadeEasyWins = sumStatsBasic(
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
    
      let arcadeWins = (arcadeEasyWins + und(dropperStats["wins"]) + und(pixelPartyStats["wins"]));
      return `Arcade Stats

• 🏆 Wins: ${arcadeWins}
• 🪙 Coins: ${checkAndFormat(sumStatsBasic(["coins"], arcadeStats))}`
    case 'skywars':
      let skyWarsStats = playerData["stats"]["SkyWars"] || {};
      return `SkyWars Stats

• ⭐ Level: ${stripFormatting(und(skyWarsStats["levelFormatted"], "1⋆"))}      
• 🪙 Coins: ${checkAndFormat(skyWarsStats["coins"])}

• 🏆 Wins: ${checkAndFormat(skyWarsStats["wins"])}
• 💔 Losses: ${checkAndFormat(skyWarsStats["losses"])}
• 🏅 W/L R: ${calculateRatio(skyWarsStats["wins"], skyWarsStats["losses"])}

• 💀 Kills: ${checkAndFormat(skyWarsStats["kills"])}
• ⚰️ Deaths: ${checkAndFormat(skyWarsStats["deaths"])}
• ⚔️ K/D R: ${calculateRatio(skyWarsStats["kills"], skyWarsStats["deaths"])}

• ⏰ Playtime: ${smallDuration(und(skyWarsStats["time_played"]))}`;
  }
}
}

app.get('/player/:name/:game?', async (req, res) => {
  const name = req.params.name;
  
  var computationError = "";
  
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
        if (playerData && playerData["profile"]) { // If the player data is available

          metaDescription = getMetaDescription(game, playerData);

          if (cardSupportedGames.includes(game)) { // Check if the game is supported by the card generator

            metaImageURL = `https://nadeshiko.io/card/${Buffer.from(`{"name":"${playerData["name"]}","game":"${game.toUpperCase()}","size":"FULL"}`).toString('base64')}`;
          } else { // If there's no game is not valid or supported, default to NETWORK
            metaImageURL = `https://nadeshiko.io/card/${Buffer.from(`{"name":"${playerData["name"]}","game":"NETWORK","size":"FULL"}`).toString('base64')}`;
          }
        } else { // If the player data is not available, don't show a card and show a default description
          metaImageURL = ``;
          metaDescription = `🌸 View Hypixel stats and generate real-time stat cards – perfect for forum signatures or to show off to friends!`;
        }


       res.render('player', { name, playerData, game, metaImageURL, metaDescription });
   } catch(error) {
      if(error.response && error.response.status == 404) {
        computationError = `No player by the name of ${name} was found :(`;
      } else {
        computationError = `Could not find stats of player ${name} (${error})`;
      }
      console.error("Fetching player data failed! → ", error);
      res.render('index', { computationError });
   }
});

  app.get('/isnadeshikodown', (req, res) => {
    res.send('No (probably)');
  });

  app.get('/card/:base64', async (req, res) => {
    try {
      const { base64 } = req.params;
  
      const targetUrl = `http://localhost:2000/card/${encodeURIComponent(base64)}`;
  
      // Use axios to forward the request
      const response = await axios.get(targetUrl, {
        responseType: 'arraybuffer', // Important for images/binary content
      });
  
      // Forward the headers and status code from the response, and then...
      res.set(response.headers);
      res.status(response.status);
  
      // Send back the response data!
      res.send(response.data);
    } catch (error) {
      // Error handling
      console.error('Error forwarding the request:', error);
      res.status(500).send('Error forwarding request');
    }
});

  app.get('/:name/:game?', (req, res) => {
    const { name, game } = req.params;
    res.redirect(`/player/${name}/${game == undefined ? '' : game}`);
  });
  
  app.listen(port, () => {
    console.log(`Listening at https://localhost:${port}!`);
  });