function skillXpToLevel(xp, skillName, skillCap) {

  let levelsObject = {
    normal: [0, 50.0,175.0,375.0,675.0,1175.0,1925.0,2925.0,4425.0,6425.0,9925.0,14925.0,22425.0,32425.0,47425.0,67425.0,97425.0,147425.0,222425.0,322425.0,522425.0,822425.0,1222425.0,1722425.0,2322425.0,3022425.0,3822425.0,4722425.0,5722425.0,6822425.0,8022425.0,9322425.0,1.0722425E7,1.2222425E7,1.3822425E7,1.5522425E7,1.7322425E7,1.9222425E7,2.1222425E7,2.3322425E7,2.5522425E7,2.7822425E7,3.0222425E7,3.2722425E7,3.5322425E7,3.8072425E7,4.0972425E7,4.4072425E7,4.7472425E7,5.1172425E7,5.5172425E7,5.9472425E7,6.4072425E7,6.8972425E7,7.4172425E7,7.9672425E7,8.5472425E7,9.1572425E7,9.7972425E7,1.04672425E8,1.11672425E8],
    runecrafting: [0, 50.0,150.0,275.0,435.0,635.0,885.0,1200.0,1600.0,2100.0,2725.0,3510.0,4510.0,5760.0,7325.0,9325.0,11825.0,14950.0,18950.0,23950.0,30200.0,38050.0,47850.0,60100.0,75400.0,94450.0],
    social: [0, 50.0,150.0,300.0,550.0,1050.0,1800.0,2800.0,4050.0,5550.0,7550.0,10050.0,13050.0,16800.0,21300.0,27300.0,35300.0,45300.0,57800.0,72800.0,92800.0,117800.0,147800.0,182800.0,222800.0,272800.0],
  }

  let thisSkillLevels;

  switch (skillName) {
    case "runecrafting":
      thisSkillLevels = levelsObject.runecrafting;
      break;
    case "social":
      thisSkillLevels = levelsObject.social;
      break;
    default:
      thisSkillLevels = levelsObject.normal;
      break;
  }

  let fractionalLevel = 0;
  let fractionalPart, xpToNextLevel, thisLevelXp, nextLevelXp, thisLevelXpRequirement, thisLevelXpEarned;

  for (let a = 0; a < thisSkillLevels.length; a++) {
    fractionalLevel = a;
    if (xp < thisSkillLevels[a]) {

      previousLevelXp = thisSkillLevels[a - 2] || 0;
      thisLevelXp = thisSkillLevels[a - 1] || 0;
      nextLevelXp = thisSkillLevels[a] || 0;
      fractionalPart = (xp - thisLevelXp) / (nextLevelXp - thisLevelXp);
      xpToNextLevel = nextLevelXp - xp;

      thisLevelXpRequirement = thisLevelXp - previousLevelXp;
      thisLevelXpEarned = xp - thisLevelXp;

      console.log(`(${xp} - ${thisLevelXp}) / (${nextLevelXp} - ${thisLevelXp} = ${fractionalPart})`);

      fractionalLevel = (a - 1) + fractionalPart;
      
      break;
    }
  }
  
  if (fractionalLevel >= skillCap) {
    return {
      level: skillCap,
      xpToNextLevel: 0,
      overflow: xp - thisSkillLevels[skillCap],
    };
  }

  return {
    level: fractionalLevel,
    xpToNextLevel: xpToNextLevel,
    thisLevelXp: thisLevelXp,
    nextLevelXp: nextLevelXp,
    thisLevelXpRequirement: thisLevelXpRequirement,
    thisLevelXpEarned: thisLevelXpEarned,
    overflow: 0,
  };
}

function getSkillCap(skillName) {
  let skillCap = 60;

  switch (skillName) {
    case "alchemy":
      skillCap = 50;
      break;
    case "foraging":
      skillCap = 50;
      break;
    case "fishing":
      skillCap = 50;
      break;
    case "carpentry":
      skillCap = 50;
      break;
    case "runecrafting":

      skillCap = 25;

      let playerTag = getValue(skyblockData, ["profile", "tag"]) || "§7"; // Checks if player is a non
      if (playerTag === "§7") {
        skillCap = 3;
      }

      break;
    case "farming":
      skillCap = 50;

      let farmingLevelsPurchased = getValue(skyblockData, ["skyblock_profile", "jacobs_contest", "perks", "farming_level_cap"]) || 0;
      skillCap += farmingLevelsPurchased;

      break;
    case "taming": 
      skillCap = 50;
      let georgePetsDonated = getValue(skyblockData, ["skyblock_profile", "pets_data", "pet_care", "pet_types_sacrificed"]) || [];

      skillCap += Math.min(georgePetsDonated.length, 10);
      break;
  }

  return skillCap;
}



function updateBasicStats() {

// Inserts general/network stats into the DOM
var profileStats = skyblockData["profile"];
var dateNow = new Date();

if (profileStats != undefined) {
  var playerRank = profileStats["tag"];
  var playerRankCute = cuteRank(playerRank, 1);

  document.getElementById("card-rank").classList.add("rank-" + playerRankCute[0]); // Changes the rank to the player's rank colour
  document.getElementById("card-name").style.color = `var(--mc` + playerRankCute[0] + `)`; // Changes the player's name to the player's rank colour
  
  updateElement("card-uuid", skyblockData["uuid"]);
  updateElement("card-ranktext", playerRankCute[1], true); // Adds player's rank

  if (playerRankCute[1] == "") {
    document.getElementById("card-rank").style.display = "none";
  }
  
  updateElement("card-name", skyblockData["name"]);
  updateElement("quick-mode-text", insertPlaceholders(getTranslation("player.quick_mode.description"), { player: skyblockData["name"] }), true);
  if (document.getElementById("quick-mode-username") != null) {
    document.getElementById("quick-mode-username").style.color = `var(--mc` + playerRankCute[0] + `)`;
  }

  updateElement("header-name", cuteRank(profileStats["tagged_name"], 0), true);

  let playerStatus = skyblockData["status"] || {};

  if (playerStatus["online"]) {
    // Checks player's online status
    updateElement("online-status", getTranslation("player.currently_online"));
    document.getElementById("online-status").style.color = "var(--mca)";

    document.getElementById("online-status-wrapper").classList.add("tooltip");

    // If the player is online, show the game and mode

    let gameType = gameNames[getValue(skyblockData, ["status", "game"])] || {};
    let gameModes = gameType["modeNames"] || {};
    let playerGameMode = skyblockData["status"]["mode"] || "";

    let gameMode = "";
    if (playerGameMode == "LOBBY") {
      gameMode = getTranslation(["games", "modes", "network", "lobby"]);
    } else {
      gameMode = gameModes[playerGameMode] || playerGameMode;
    }

    if (gameMode != "") {
      gameMode = " – " + gameMode;
    }

    updateElement("online-status-location", gameType["name"] + gameMode);
  } else {
    updateElement("online-status", getTranslation("player.currently_offline"));
  }

  let playerBadge = skyblockData["badge"] || "NONE";
  checkBadge(playerBadge);

  let guildName;

  if (skyblockData["guild"] == undefined) {
    document.getElementById("guild-stats").style.display = "none";
    document.getElementById("card-guild").style.display = "none";

    guildName = null;
  } else {
    guildStats = skyblockData["guild"];
    guildName = guildStats["name"];
    updateElement("card-guild", generateMinecraftText(guildStats["tag"]), true);

  }
}


  let skills = ["combat", "farming", "fishing", "mining", "foraging", "enchanting", "alchemy", "carpentry", "runecrafting", "social", "taming"];

  let skillCaps = {};
  for (let skill of skills) {
    skillCaps[skill] = getSkillCap(skill);
  }

  let skillAverage = 0, skillAverageSum = 0, skillAveragePercentage = 0, skillAverageMax = 0;

  console.log(skillCaps);

  for (let skill of skills) {
    let xp = getValue(skyblockProfile, ["player_data", "experience", `SKILL_${skill.toUpperCase()}`]) || 0;

    let skillXpToLevelResult = skillXpToLevel(xp, skill, skillCaps[skill] || 60);
    let level = und(skillXpToLevelResult["level"]);
    let levelPercentage = (level % 1) * 100;
    let levelCap = skillCaps[skill] || 60;
    
    updateElement(`skill-${skill}`, checkAndFormat(Math.floor(level)));
  

    if (level >= levelCap) {
      document.getElementById(`skill-${skill}`).style.color = `var(--gold)`;
      document.getElementById(`skill-${skill}-progress-bar`).style.width = "100%";
      document.getElementById(`skill-${skill}-progress-bar`).style.backgroundColor = `var(--gold)`;
      updateElement(`skill-${skill}-tooltip`, `${checkAndFormat(skillXpToLevelResult["overflow"])} overflow XP`, true);
    } else {
      document.getElementById(`skill-${skill}-progress-bar`).style.width = levelPercentage + "%";
      updateElement(`skill-${skill}-tooltip`, `${checkAndFormat(skillXpToLevelResult["thisLevelXpEarned"])} / ${simplifyNumber(skillXpToLevelResult["thisLevelXpRequirement"], 4)} XP (${checkAndFormat(levelPercentage, 2)}%)`, true);
    }

    if (skill != "runecrafting" && skill != "social") {
      skillAverageSum += level;
      skillAverageMax += levelCap;
    }
  }

  skillAverage = skillAverageSum / 9;
  skillAveragePercentage = (skillAverage % 1) * 100; 
  updateElement("skill-average", checkAndFormat(Math.floor(skillAverage)));
  document.getElementById("skill-average-progress-bar").style.width = skillAveragePercentage + "%";

  if (skillAverageSum == skillAverageMax) {
    document.getElementById("skill-average-progress-bar").style.backgroundColor = `var(--gold)`;
  }

  updateElement("skill-average-tooltip", `Skill Average: ${checkAndFormat(skillAverage, 2)}`, true);
  
  updateElement("purse", veryLargeNumber(getValue(skyblockProfile, ["currencies", "coin_purse"])));
  updateElement("bank", veryLargeNumber(getValue(skyblockProfile, ["banking", "balance"])));
  updateElement("fairy-souls", und(getValue(skyblockProfile, ["fairy_soul", "total_collected"])) + "/247");

  let skyblockLevel = und(getValue(skyblockProfile, ["leveling", "experience"])) / 100;

  updateElement("skyblock-level-tooltip", `Level ${checkAndFormat(skyblockLevel, 2)}`, true);

  let skyblockLevelColors = [
    { req: 0, color: "§7", bracketColor: "§8"},
    { req: 40, color: "§f", bracketColor: "§8" },
    { req: 80, color: "§e", bracketColor: "§8" },
    { req: 120, color: "§a", bracketColor: "§8" },
    { req: 160, color: "§2", bracketColor: "§8" },
    { req: 200, color: "§b", bracketColor: "§8" },
    { req: 240, color: "§3", bracketColor: "§8" },
    { req: 280, color: "§9", bracketColor: "§8" },
    { req: 320, color: "§d", bracketColor: "§8" },
    { req: 360, color: "§5", bracketColor: "§8" },
    { req: 400, color: "§6", bracketColor: "§8" },
    { req: 440, color: "§c", bracketColor: "§8" },
    { req: 480, color: "§4", bracketColor: "§8" },
  ];

  let formattedSkyBlockLevel = getGenericWinsPrefix(Math.floor(skyblockLevel), skyblockLevelColors, undefined, false, "", true, true, false, true);

  updateElement("skyblock-level", formattedSkyBlockLevel["title"], true);
  document.getElementById("skyblock-level-progress-bar").style.width = (skyblockLevel % 1) * 100 + "%";
}