console.log("nadeshiko wooooo!")

function generateNetwork() {
  let playerProfileStats = achievementsStats["player"]["profile"] || {};

  var playerRank = playerProfileStats["tag"];
  var playerRankCute = cuteRank(playerRank, 1);

  document.getElementById("card-rank").classList.add("rank-" + playerRankCute[0]); // Changes the rank to the player's rank colour
  document.getElementById("card-name").style.color = `var(--mc` + playerRankCute[0] + `)`; // Changes the player's name to the player's rank colour
  
  updateElement("card-uuid", playerProfileStats["uuid"]);
  updateElement("card-ranktext", playerRankCute[1], true); // Adds player's rank

  if (playerRankCute[1] == "") {
    document.getElementById("card-rank").style.display = "none";
  }

  updateElement("card-name", deformatName(playerProfileStats["tagged_name"]));
}

function getOneTimeStats(fullName) {
  let underscoreIndex = fullName.indexOf('_');
  let gameName = fullName.substring(0, underscoreIndex);
  let achievementName = fullName.substring(underscoreIndex + 1).toUpperCase();

  let gameStats = globalAchievements[gameName] || {};
  let oneTimeAchievementStats = gameStats["one_time"] || {};
  let achievementStats = oneTimeAchievementStats[achievementName] || {};

  console.warn(gameName);
  console.warn(achievementName);

  console.warn(gameStats)
  console.warn(oneTimeAchievementStats);
  console.warn(achievementStats);

  let oneTimeAchievementObject = {
    "game": gameName,

    "name": achievementStats["name"] || "",
    "description": achievementStats["description"] || "",
    "points": achievementStats["points"] || 0,
    "gamePercentUnlocked": achievementStats["percentUnlocked"] || 0,
    "globalPercentUnlocked": achievementStats["globalPercentUnlocked"] || 0,
  };

  oneTimeAchievementObject["unlocked"] = playerOneTimeAchievements.includes(fullName) || false;

  return oneTimeAchievementObject;
}

function getTieredStats(fullName) {
  let underscoreIndex = fullName.indexOf('_');
  let gameName = fullName.substring(0, underscoreIndex);
  let achievementName = fullName.substring(underscoreIndex + 1).toUpperCase();

  let gameStats = globalAchievements[gameName] || {};
  let tieredAchievementStats = gameStats["tiered"] || {};
  let achievementStats = tieredAchievementStats[achievementName] || {};


  let tieredAchievementsObject = {
    "game": gameName,

    "name": achievementStats["name"] || "",
    "description": achievementStats["description"] || "",
    "tiers": achievementStats["tiers"] || {},
    "amount": getValue(achievementsStats, ["player", "achievements", fullName]) || 0
  };

  // determine highest unlocked tier based on amount
  let highestUnlockedTier = 0;
  for (let tier of tieredAchievementsObject["tiers"]) {
    if (tieredAchievementsObject["amount"] >= tier["amount"]) {
      highestUnlockedTier += 1;
    } else {
      break;
    }
  }

  tieredAchievementsObject["unlocked_tiers"] = highestUnlockedTier;

  // determine if highest unlocked tier is the last tier
  if (highestUnlockedTier == tieredAchievementsObject["tiers"].length) {
    tieredAchievementsObject["unlocked"] = true;
  } else {
    tieredAchievementsObject["unlocked"] = false;
  }

  return tieredAchievementsObject;
}

function getAllAchievements(game) {
  let gameStats = globalAchievements[game] || {};
  let oneTimeAchievementStats = gameStats["one_time"] || {};
  let tieredAchievementStats = gameStats["tiered"] || {};

  let allAchievements = {};
  allAchievements["tiered"] = {};
  allAchievements["one_time"] = {};

  for (let achievement in oneTimeAchievementStats) {
    allAchievements["one_time"][achievement.toLowerCase()] = getOneTimeStats(game + "_" + achievement.toLowerCase());
  }

  for (let achievement in tieredAchievementStats) {
    allAchievements["tiered"][achievement.toLowerCase()] = getTieredStats(game + "_" + achievement.toLowerCase());
  }

  return allAchievements;
}