let lastDailyQuestReset = 0;
let lastWeeklyQuestReset = 0;

function modernifyGameName(game) {
  let modernGameNames = {
    battleground: "warlords",
    gingerbread: "tkr",
    hungergames: "blitz",
    mcgo: "copsandcrims",
    gingerbread: "tkr",
    quake: "quakecraft",
    supersmash: "smashheroes",
    walls3: "megawalls",

    truecombat: "crazywalls",
  };

  if (modernGameNames[game]) {
    return modernGameNames[game];
  }

  return game;
}

function generateQuestsTable(game, timestamp = Date.now()) {
  lastDailyQuestReset = getLastMidnight(timestamp);
  lastWeeklyQuestReset = getLastFridayMidnight(timestamp);

  let questGameTemplate = DOMPurify.sanitize(`
  
    <div class="chip-container quest-game-container">

      <div class="chip-small but-big no-overflow">
        <div class="chip-small-top">
          <p class="chip-small-title">${getTranslation(`games.${modernifyGameName(game)}`)}<span style="margin-inline-start: 5px;" data-i="quest-game-check">${getTranslation("achievements.check")}</span></p>
          <p class="mright" data-i="quest-game-progress"></p>
        </div>
        <div class="list quest-list" data-i="quest-list">
        </div>
      </div>
  </div>`);

  let questTemplate = DOMPurify.sanitize(`
    <div class="flex-two-item row-header no-column-header">
      <span class="w600">
        <span class="quest-type" data-i="quest-type"></span>
        <span data-i="quest-name"></span>
        <span style="color: var(--accent); display: none;" data-i="quest-check">${getTranslation("achievements.check")}</span><span data-i="quest-check"></span>
      </span>
      <span data-i="quest-rewards" class="flex-two-item quest-rewards"></span>
    </div>
    <div class="flex-two-item-vertical" data-i="quest-objectives">
    </div>
  `);

  let questRewardsTemplate = DOMPurify.sanitize(`
    <span class="tooltip">
      <img data-i="quest-reward-icon" class="smallicon icon">
      <span class="tooltiptext" data-i="quest-reward-item"></span>
    </span>
    <span data-i="quest-reward-amount"></span>
  `);

  let questObjectiveTemplate = DOMPurify.sanitize(`
      <span class="w500">
        <span data-i="quest-objective-description"></span>
      </span>
      <span class="quest-reward">
        <span data-i="quest-objective-progress" class="w600"></span><span>&nbsp;/&nbsp;</span><span data-i="quest-objective-needed"></span>
      </span>
  `);

  let gameQuestsFormatted = [];
  let gameQuests = globalQuests[game] || [];

  let questGamesContainer = document.getElementById("quests-games");
  let questGameContainer = document.createElement("div");
  questGameContainer.innerHTML = questGameTemplate;

  let gameQuestCompletionStatus = {
    completed: 0,
    total: 0,
  }

  for (let a = 0; a < gameQuests.length; a++) {
    let thisQuest = gameQuests[a];
    let thisQuestId = thisQuest["id"];
    let questType = "daily";
  
    let thisQuestRequirements = thisQuest["requirements"] || []; // Determining whether the quest is daily or weekly
    let thisFirstQuestRequirement = thisQuestRequirements[0] || {};
    
    if (thisFirstQuestRequirement["type"] === "WeeklyResetQuestRequirement") {
      questType = "weekly";
    }

    let thisQuestDetails = getQuestDetails(thisQuestId, questType, thisQuest, game);

    let thisQuestRow = document.createElement("div");
    thisQuestRow.innerHTML = questTemplate;
    thisQuestRow.classList.add("row");
    thisQuestRow.querySelector("[data-i='quest-name']").innerText = thisQuest["name"].replace(getTranslation(["quests", "types", "daily_literal"]), "").replace(getTranslation(["quests", "types", "weekly_literal"]), "");

    gameQuestCompletionStatus["total"]++;
    questsCompletedByTime[questType]["total"]++;

    if (thisQuestDetails["completed"]) {
      thisQuestRow.classList.add("unlocked");
      thisQuestRow.querySelector("[data-i='quest-check']").style.display = "inline";
      gameQuestCompletionStatus["completed"]++;
      questsCompletedByTime[questType]["completed"]++;
    } else {
      questGameContainer.querySelector("[data-i='quest-game-check']").style.display = "none";
    }

    let thisQuestType = thisQuestRow.querySelector("[data-i='quest-type']");
    thisQuestType.innerText = getTranslation(["quests", "types", questType]);

    for (let b in thisQuestDetails["objectives"]) {
      let thisQuestObjective = thisQuestDetails["objectives"][b];
      let thisQuestObjectiveFormatted = document.createElement("div");
      thisQuestObjectiveFormatted.classList.add("flex-two-item");
      thisQuestObjectiveFormatted.classList.add("row-header");
      thisQuestObjectiveFormatted.classList.add("no-column-header");
      thisQuestObjectiveFormatted.innerHTML = questObjectiveTemplate;

      let thisQuestObjectiveDescription = thisQuestObjectiveFormatted.querySelector("[data-i='quest-objective-description']");
      let thisQuestObjectiveProgress = thisQuestObjectiveFormatted.querySelector("[data-i='quest-objective-progress']");
      let thisQuestObjectiveNeeded = thisQuestObjectiveFormatted.querySelector("[data-i='quest-objective-needed']");

      thisQuestObjectiveDescription.innerText = thisQuestObjective["description"];
      thisQuestObjectiveProgress.innerText = checkAndFormat(thisQuestObjective["progress"]);
      thisQuestObjectiveNeeded.innerText = simplifyNumber(thisQuestObjective["needed"]);

      thisQuestRow.querySelector("[data-i='quest-objectives']").appendChild(thisQuestObjectiveFormatted);
    }

    for (let b in thisQuestDetails["rewards"]) {
      let thisQuestRewards = document.createElement("div");
      thisQuestRewards.classList.add("quest-reward");
      thisQuestRewards.innerHTML = questRewardsTemplate;

      let thisQuestReward = thisQuestDetails["rewards"][b];

      let thisQuestRewardIcon = thisQuestRewards.querySelector("[data-i='quest-reward-icon']");
      let thisQuestRewardItem = thisQuestRewards.querySelector("[data-i='quest-reward-item']");
      let thisQuestRewardAmount = thisQuestRewards.querySelector("[data-i='quest-reward-amount']");

      thisQuestRewardIcon.src = `/img/icon/minecraft/${thisQuestReward["icon"]}.${imageFileType}`;
      thisQuestRewardItem.innerText = thisQuestReward["text"];
      thisQuestRewardAmount.innerText = checkAndFormat(thisQuestReward["amount"]);

      thisQuestRow.querySelector("[data-i='quest-rewards']").appendChild(thisQuestRewards);
      console.log(thisQuestRow.querySelector("[data-i='quest-rewards']"));
    }

    let thisQuestProgress = thisQuestDetails["objectives"];

    questGameContainer.querySelector("[data-i='quest-list']").appendChild(thisQuestRow);


    gameQuestsFormatted.push(thisQuestDetails);
  }

  questGamesContainer.appendChild(questGameContainer);

  
}

function getQuestDetails(questId, interval = "daily", thisQuestGlobalStats, game) {
  let thisQuestPlayerStats = playerQuests[questId] || {};
  console.log(thisQuestGlobalStats);

  let thisQuestDetailsFormatted = {
    objectives: {},
  };
  let thisQuestObjectives = thisQuestGlobalStats["objectives"] || [];
  let thisQuestRewards = thisQuestGlobalStats["rewards"] || [];
  let thisQuestRewardsFormatted = [];

  for (let a in thisQuestRewards) {
    let thisQuestReward = thisQuestRewards[a];

    let thisQuestRewardType = thisQuestReward["type"];
    let thisQuestRewardAmount = thisQuestReward["amount"] || 0;

    let thisQuestRewardFormatted = parseReward(game, thisQuestRewardType, thisQuestRewardAmount);
    thisQuestRewardsFormatted.push(thisQuestRewardFormatted);
  }

  thisQuestDetailsFormatted["rewards"] = thisQuestRewardsFormatted;
  thisQuestDetailsFormatted["interval"] = interval;

  let thisQuestSeparateDescription = separateDescription(questId, thisQuestGlobalStats["description"]);
  let thisQuestCompleted = true;

  for (let a in thisQuestObjectives) { /* { id: "win", type: "IntegerObjective", integer: 15 } */

    let thisQuestObjective = thisQuestObjectives[a];

    let thisQuestObjectiveType = thisQuestObjective["type"];
    let thisQuestObjectiveId = thisQuestObjective["id"];

    let thisQuestObjectiveNeeded;
    if (thisQuestObjectiveType === "BooleanObjective") {
      thisQuestObjectiveNeeded = 1;
    } else {
      thisQuestObjectiveNeeded = thisQuestObjective["integer"] || 1;
    }

    let thisQuestObjectiveProgress = 0;
    if (thisQuestPlayerStats["active"] && thisQuestPlayerStats["active"]["objectives"]) {
      thisQuestObjectiveProgress = thisQuestPlayerStats["active"]["objectives"][thisQuestObjectiveId] || 0;

      if (thisQuestObjectiveProgress < thisQuestObjectiveNeeded) {
        thisQuestCompleted = false;
      }
    } else {
      let thisQuestCompletions = thisQuestPlayerStats["completions"] || [];
      let thisQuestLastCompletion = thisQuestCompletions[thisQuestCompletions.length - 1] || {};
      let thisQuestLastCompletionTime = thisQuestLastCompletion["time"] || 0;

      if (thisQuestLastCompletionTime > (interval === "daily" ? lastDailyQuestReset : lastWeeklyQuestReset)) { // If the player completed the quest since the last reset
        thisQuestObjectiveProgress = thisQuestObjectiveNeeded;
      } else {
        thisQuestObjectiveProgress = 0; // Player has not started quest
        thisQuestCompleted = false;
      }
    }

    thisQuestDetailsFormatted["objectives"][thisQuestObjectiveId] = (
      {
        description: thisQuestSeparateDescription[a],
        progress: thisQuestObjectiveProgress,
        needed: thisQuestObjectiveNeeded,
      }
    );
  }

  thisQuestDetailsFormatted["completed"] = thisQuestCompleted;

  console.warn(thisQuestDetailsFormatted);
  return thisQuestDetailsFormatted;
}

/* 
 * Formats a quest description by separating the description by newline into an array.
 * @param {string} descriptionId - The quest ID of the description. This is used to identify if the description is a special case that doesn't use \n correctly.
 * @param {string} description - The description to format
 * @returns {Array} The formatted description
 */
function separateDescription(descriptionId, description) {
  if (descriptionId == "warlords_objectives") { // This one quest has newlines, but the newlines don't indicate objectives, they're just for formatting
    return [description.replaceAll("\n", ", ")];
  } else {
    return description.split("\n");
  }
}

 /*
  * Parses a reward from a quest to use human-readable text.
  * @param {string} game - The game the quest is for
  * @param {string} reward - The reward to parse
  * @param {number} amount - The amount of the reward
  * @returns {string} Object.icon - The icon (Minecraft) of the reward
  * @returns {string} Object.text - The internationalized name of the reward
  * @returns {number} Object.amount - How much reward
  */
function parseReward(game, reward, amount) {
  let formattedReward = {};

  switch (reward) {
    case "MultipliedExperienceReward":
      formattedReward = {
        icon: "cyan_dye",
        text: getTranslation(["quests", "rewards", "hypixel_experience"]),
      }
     break;
    case "FestivalExperienceReward":
      formattedReward = {
        icon: "experience_bottle",
        text: getTranslation(["quests", "rewards", "event_experience"])
      }
      break;
    case "WoolWarsWoolReward":
      formattedReward = {
        icon: "white_wool",
        text: getTranslation("statistics.wool")
      }
      break;
    case "WoolGamesExpReward":
    case "BedwarsExpReward":
      formattedReward = {
        icon: "nether_star",
        text: insertPlaceholders(getTranslation(["quests", "rewards", "game_experience"]), {
          "game": getTranslation(`games.${modernifyGameName(game)}`)
        })
      }
      break;
    case "MultipliedCoinReward":
    case "CoinReward":
      if (game == "bedwars" || game == "tnt" || game == "duels" || game == "murdermystery" || game == "buildbattle") { // These games say they use coins, but they actually use tokens.
        formattedReward = {
          icon: "emerald",
          text: insertPlaceholders(getTranslation(["quests", "rewards", "game_tokens"]), {
            "game": getTranslation(`games.${modernifyGameName(game)}`)
          })
        }
      } else {
        formattedReward = {
          icon: "gold_ingot",
          text: insertPlaceholders(getTranslation(["quests", "rewards", "game_coins"]), {
            "game": getTranslation(`games.${modernifyGameName(game)}`)
          })
        }
      }
      break;
    case "SkyWarsTokenReward":
      formattedReward = {
        icon: "emerald",
        text: insertPlaceholders(getTranslation(["quests", "rewards", "game_tokens"]), {
          "game": getTranslation(`games.${modernifyGameName(game)}`)
        })
      }
      break;
    case "SkyWarsSoulReward":
      formattedReward = {
        icon: "ghast_tear",
        text: getTranslation(["quests", "rewards", "souls"])
      }
      break;
    case "ArenaMagicKeyReward":
      formattedReward = {
        icon: "stone_shovel",
        text: getTranslation(["statistics", "magical_keys"])
      }
      break;
    case "WarlordsBrokenWeaponReward":
      formattedReward = {
        icon: "gunpowder",
        text: getTranslation(["quests", "rewards", "broken_weapons"])
      }
      break;
    case "WarlordsLegendaryBrokenWeaponReward":
      formattedReward = {
        icon: "cookie",
        text: getTranslation(["quests", "rewards", "legendary_broken_weapons"])
      }
      break;
    case "WarlordsMagicDustReward":
      formattedReward = {
        icon: "light_blue_dye",
        text: getTranslation(["statistics", "magic_dust"])
      }
      break;
    case "WarlordsVoidShardReward":
      formattedReward = {
        icon: "prismarine_shard",
        text: getTranslation(["statistics", "void_shards"])
      }
      break;
    case "MegawallsMythicFavorReward":
      formattedReward = {
        icon: "glowstone_dust",
        text: getTranslation(["statistics", "mythic_favor"])
      }
      break;
    case "PitGold":
      formattedReward = {
        icon: "gold_ingot",
        text: getTranslation(["quests", "rewards", "pit_gold"])
      }
      break;
    default: 
      formattedReward = {
          icon: "barrier",
          text: reward
      }
  }

  formattedReward["amount"] = amount || 0;
  return formattedReward;
}

function isQuestCompleted(quest, type = "daily") {

}

/*
 * Gets the datestamp of the most recent midnight. Daily quests reset at 00:00 Eastern Time.
 * @param {number} datestamp - The datestamp to use. Defaults to the current time
 * @returns {number} The datestamp of the most recent midnight in Eastern Time
 */
function getLastMidnight(datestamp = Date.now()) {
  const now = new Date(datestamp);
  const options = { timeZone: 'America/New_York', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };

  const formatter = new Intl.DateTimeFormat([], options);
  const dateParts = formatter.formatToParts(now);

  let hours, minutes, seconds;
  for (const part of dateParts) {
      if (part.type === 'hour') hours = part.value;
      if (part.type === 'minute') minutes = part.value;
      if (part.type === 'second') seconds = part.value;
  }

  // the difference from the current time to last midnight in new york
  const totalSecondsPassedToday = (parseInt(hours) * 3600) + (parseInt(minutes) * 60) + parseInt(seconds);
  const lastMidnightTimestampET = now.getTime() / 1000 - totalSecondsPassedToday;

  return Math.floor(lastMidnightTimestampET) * 1000;
}

/*
 * Gets the datestamp of the most recent Friday at midnight. Weekly quests reset at 00:00 Eastern Time every Friday.
 * @param {number} datestamp - The datestamp to use. Defaults to the current time
 * @returns {number} The datestamp of the most recent Friday midnight in Eastern Time
 */
function getLastFridayMidnight(datestamp = Date.now()) {
  const lastMidnightTimestamp = getLastMidnight(datestamp);
  const lastMidnightDate = new Date(lastMidnightTimestamp);
  
  let dayOfWeek = lastMidnightDate.getUTCDay();
  // Please note that this line will start returning the wrong date if New York becomes 24 hours or more behind UTC.
  // However, if that happens, there are bigger problems to worry about.

  const daysToSubtract = (dayOfWeek + 2) % 7; // Subtracting days to get to the most recent Friday

  const lastFridayMidnightTimestamp = lastMidnightDate.getTime() - (daysToSubtract * 86400000);

  return Math.floor(lastFridayMidnightTimestamp);
}

function generateNetwork() {
  let playerProfileStats = questsStats["player"]["profile"] || {};

  var playerRank = playerProfileStats["tag"];
  var playerRankCute = cuteRank(playerRank, 1);

  document.getElementById("card-rank").classList.add("rank-" + playerRankCute[0]); // Changes the rank to the player's rank colour
  document.getElementById("card-name").style.color = `var(--mc` + playerRankCute[0] + `)`; // Changes the player's name to the player's rank colour
  updateElement("header-name", cuteRank(playerProfileStats["tagged_name"], 0), true);

  updateElement("quests-completed", checkAndFormat(playerProfileStats["quests_completed"]));

  updateElement("card-uuid", playerProfileStats["uuid"]);
  updateElement("card-ranktext", playerRankCute[1], true); // Adds player's rank

  if (playerRankCute[1] == "") {
    document.getElementById("card-rank").style.display = "none";
  }

  updateElement("card-name", deformatName(playerProfileStats["tagged_name"]));

  let playerBadge = questsStats["player"]["badge"] || "NONE";
  checkBadge(playerBadge);

  updateElement("daily-quests-completed", checkAndFormat(questsCompletedByTime["daily"]["completed"]));
  updateElement("daily-quests-total", checkAndFormat(questsCompletedByTime["daily"]["total"]));
  updateElement("weekly-quests-completed", checkAndFormat(questsCompletedByTime["weekly"]["completed"]));
  updateElement("weekly-quests-total", checkAndFormat(questsCompletedByTime["weekly"]["total"]));

  let dailyQuestProgress = questsCompletedByTime["daily"]["completed"] / questsCompletedByTime["daily"]["total"] || 0;
  document.getElementById("daily-quests-completed-progress-bar").style.width = (dailyQuestProgress * 100) + "%";
  updateElement("daily-quests-completed-progress-number", Math.round(dailyQuestProgress * 100) + "%");

  let weeklyQuestProgress = questsCompletedByTime["weekly"]["completed"] / questsCompletedByTime["weekly"]["total"] || 0;
  document.getElementById("weekly-quests-completed-progress-bar").style.width = (weeklyQuestProgress * 100) + "%";
  updateElement("weekly-quests-completed-progress-number", Math.round(weeklyQuestProgress * 100) + "%");
}