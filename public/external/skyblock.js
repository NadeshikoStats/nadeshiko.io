let allItems = [];
let tooltipState = {
  set_x: null,
  item: null,
  modal_active: false,
};

function skillXpToLevel(xp, skillName, skillCap) {
  let levelsObject = {
    normal: [0, 50.0, 175.0, 375.0, 675.0, 1175.0, 1925.0, 2925.0, 4425.0, 6425.0, 9925.0, 14925.0, 22425.0, 32425.0, 47425.0, 67425.0, 97425.0, 147425.0, 222425.0, 322425.0, 522425.0, 822425.0, 1222425.0, 1722425.0, 2322425.0, 3022425.0, 3822425.0, 4722425.0, 5722425.0, 6822425.0, 8022425.0, 9322425.0, 1.0722425e7, 1.2222425e7, 1.3822425e7, 1.5522425e7, 1.7322425e7, 1.9222425e7, 2.1222425e7, 2.3322425e7, 2.5522425e7, 2.7822425e7, 3.0222425e7, 3.2722425e7, 3.5322425e7, 3.8072425e7, 4.0972425e7, 4.4072425e7, 4.7472425e7, 5.1172425e7, 5.5172425e7, 5.9472425e7, 6.4072425e7, 6.8972425e7, 7.4172425e7, 7.9672425e7, 8.5472425e7, 9.1572425e7, 9.7972425e7, 1.04672425e8, 1.11672425e8],
    runecrafting: [0, 50.0, 150.0, 275.0, 435.0, 635.0, 885.0, 1200.0, 1600.0, 2100.0, 2725.0, 3510.0, 4510.0, 5760.0, 7325.0, 9325.0, 11825.0, 14950.0, 18950.0, 23950.0, 30200.0, 38050.0, 47850.0, 60100.0, 75400.0, 94450.0],
    social: [0, 50.0, 150.0, 300.0, 550.0, 1050.0, 1800.0, 2800.0, 4050.0, 5550.0, 7550.0, 10050.0, 13050.0, 16800.0, 21300.0, 27300.0, 35300.0, 45300.0, 57800.0, 72800.0, 92800.0, 117800.0, 147800.0, 182800.0, 222800.0, 272800.0],
    classes: [0, 50, 125, 235, 395, 625, 955, 1425, 2095, 3045, 4385, 6275, 8940, 12700, 17960, 25340, 35640, 50040, 70040, 97640, 135640, 188140, 259640, 356640, 488640, 668640, 911640, 1239640, 1684640, 2284640, 3084640, 4149640, 5559640, 7459640, 9959640, 13259640, 17559640, 23159640, 30359640, 39559640, 51559640, 66559640, 85559640, 109559640, 139559640, 177559640, 225559640, 285559640, 360559640, 453559640, 569809640],
  };

  let thisSkillLevels;

  switch (skillName) {
    case "runecrafting":
      thisSkillLevels = levelsObject.runecrafting;
      break;
    case "social":
      thisSkillLevels = levelsObject.social;
      break;
    case "classes":
      thisSkillLevels = levelsObject.classes;
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

      fractionalLevel = a - 1 + fractionalPart;

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

  let skillAverage = 0,
    skillAverageSum = 0,
    skillAveragePercentage = 0,
    skillAverageMax = 0;

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
    document.getElementById("skill-average").style.color = `var(--gold)`;
    document.getElementById("skill-average-progress-bar").style.backgroundColor = `var(--gold)`;
  }

  updateElement("skill-average-tooltip", `Skill Average: ${checkAndFormat(skillAverage, 2)}`, true);

  updateElement("purse", veryLargeNumber(getValue(skyblockProfile, ["currencies", "coin_purse"])));
  updateElement("bank", veryLargeNumber(getValue(skyblockProfile, ["banking", "balance"])));
  updateElement("net-worth", veryLargeNumber(getValue(skyblockProfile, ["networth", "total"])));
  updateElement("fairy-souls", und(getValue(skyblockProfile, ["fairy_soul", "total_collected"])) + "/247");

  let skyblockLevel = und(getValue(skyblockProfile, ["leveling", "experience"])) / 100;

  updateElement("skyblock-level-tooltip", `Level ${checkAndFormat(skyblockLevel, 2)}`, true);

  let skyblockLevelColors = [
    { req: 0, color: "§7", bracketColor: "§8" },
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

  let formattedSkyBlockLevel = getGenericWinsPrefix({
    wins: Math.floor(skyblockLevel),
    winsObject: skyblockLevelColors,
    useToGo: false,
    useDifferentBracketColors: true,
  });

  updateElement("skyblock-level", formattedSkyBlockLevel["title"], true);
  document.getElementById("skyblock-level-progress-bar").style.width = (skyblockLevel % 1) * 100 + "%";
}

function addToAllItems(itemObject) {
  return allItems.push(itemObject) - 1;
}

function updateArmorEquipment() {
  let armor = getValue(skyblockProfile, ["inventory", "inv_armor"]).reverse() || [{}, {}, {}, {}];
  let equipment = getValue(skyblockProfile, ["inventory", "equipment_contents"]).reverse() || [{}, {}, {}, {}];
  let armorTemplate = `<div class="ae-item"></div>`;
  for (let a in armor) {
    if (Object.keys(a).length == 0) {
      document.getElementById(`equipment-grid`).insertAdjacentHTML("beforeend", armorTemplate);
    } else {
      // Armor slot is empty
      let armorSlot = armor[a];
      let nadeshikoId = addToAllItems(armorSlot);

      let formattedArmorSlot = document.createElement("div");
      formattedArmorSlot.classList.add("ae-item");
      formattedArmorSlot.setAttribute("n-id", nadeshikoId);

      formattedArmorSlot.classList.add("rarity-epic");

      document.getElementById(`equipment-grid`).appendChild(formattedArmorSlot);
      addSkyBlockItemListener(nadeshikoId);
    }
  }

  for (let a in equipment) {
    if (Object.keys(a).length == 0) {
      document.getElementById(`equipment-grid`).insertAdjacentHTML("beforeend", armorTemplate);
    } else {
      // Armor slot is empty
      let equipmentSlot = equipment[a];
      let nadeshikoId = addToAllItems(equipmentSlot);

      let formattedEquipmentSlot = document.createElement("div");
      formattedEquipmentSlot.classList.add("ae-item");
      formattedEquipmentSlot.setAttribute("n-id", nadeshikoId);

      formattedEquipmentSlot.classList.add("rarity-rare");

      document.getElementById(`equipment-grid`).appendChild(formattedEquipmentSlot);
      addSkyBlockItemListener(nadeshikoId);
    }
  }
}

function updateWardrobe() {
  let wardrobeItemTemplate = `<div class="ae-item"></div>`;

  let wardrobe = getValue(skyblockProfile, ["inventory", "wardrobe_contents"]) || [];

  function getWardrobeIndex(slot, piece) {
    base = piece * 9 + (slot % 9);
    return slot > 8 ? base + 36 : base;
  }

  for (let a = 0; a < 18; a++) {
    let thisWardrobeSlot = [wardrobe[getWardrobeIndex(a, 0)], wardrobe[getWardrobeIndex(a, 1)], wardrobe[getWardrobeIndex(a, 2)], wardrobe[getWardrobeIndex(a, 3)]];
    console.log([getWardrobeIndex(a, 0), getWardrobeIndex(a, 1), getWardrobeIndex(a, 2), getWardrobeIndex(a, 3)]);
    console.log(thisWardrobeSlot);

    if (thisWardrobeSlot.every((x) => Object.keys(x).length == 0)) {
      continue;
    } else {
      for (let b in thisWardrobeSlot) {
        let thisWardrobeItem = und(thisWardrobeSlot[b], {});

        if (Object.keys(und(thisWardrobeSlot[b])).length > 0) {
          // If the wardrobe slot is not empty
          let nadeshikoId = addToAllItems(thisWardrobeItem);

          let formattedWardrobeSlot = document.createElement("div");
          formattedWardrobeSlot.classList.add("ae-item");
          formattedWardrobeSlot.setAttribute("n-id", nadeshikoId);
          formattedWardrobeSlot.classList.add("rarity-rare");

          document.getElementById(`wardrobe-grid`).appendChild(formattedWardrobeSlot);
          addSkyBlockItemListener(nadeshikoId);
        } else {
          document.getElementById(`wardrobe-grid`).insertAdjacentHTML("beforeend", wardrobeItemTemplate);
        }
      }
    }
  }
}

function updateDungeonClasses() {
  let dungeonsClasses = ["berserk", "archer", "mage", "healer", "tank"];
  let classAverageSum = 0;
  const CLASS_MAX_LEVEL = 50;

  for (let a of dungeonsClasses) {
    let xp = getValue(skyblockProfile, ["dungeons", "player_classes", a, "experience"]) || 0;
    let classXpToLevelResult = skillXpToLevel(xp, "classes", CLASS_MAX_LEVEL);
    let level = classXpToLevelResult["level"];

    let levelPercentage = (level % 1) * 100;

    updateElement(`class-${a}`, checkAndFormat(Math.floor(level)));

    if (level >= CLASS_MAX_LEVEL) {
      document.getElementById(`class-${a}`).style.color = `var(--gold)`;
      document.getElementById(`class-${a}-progress-bar`).style.width = "100%";
      document.getElementById(`class-${a}-progress-bar`).style.backgroundColor = `var(--gold)`;
      updateElement(`class-${a}-tooltip`, `${checkAndFormat(classXpToLevelResult["overflow"])} overflow XP`, true);
    } else {
      document.getElementById(`class-${a}-progress-bar`).style.width = levelPercentage + "%";
      updateElement(`class-${a}-tooltip`, `${checkAndFormat(classXpToLevelResult["thisLevelXpEarned"])} / ${simplifyNumber(classXpToLevelResult["thisLevelXpRequirement"], 4)} XP (${checkAndFormat(levelPercentage, 2)}%)`, true);
    }

    classAverageSum += level;
  }

  let classAverage = classAverageSum / dungeonsClasses.length;

  updateElement("class-average", checkAndFormat(Math.floor(classAverage)));
  document.getElementById("class-average-progress-bar").style.width = (classAverage % 1) * 100 + "%";
  updateElement("class-average-tooltip", `Class Average: ${checkAndFormat(classAverage, 2)}`, true);

  if (classAverage == CLASS_MAX_LEVEL) {
    document.getElementById("class-average").style.color = `var(--gold)`;
    document.getElementById("class-average-progress-bar").style.width = "100%";
    document.getElementById("class-average-progress-bar").style.backgroundColor = `var(--gold)`;
  }
}

function calculateRunsToClassLevel() {
  const BASE_DUNGEON_EXPERIENCE = {
    MASTER_7: 324000, // +8% from base?
    MASTER_6: 108000, // +8% from base?
    MASTER_5: 75600, // +8% from base?
    MASTER_4: 59400, // +8% from base?
    MASTER_3: 36800,
    MASTER_2: 21600,
    MASTER_1: 16200,
    FLOOR_7: 30240,
    FLOOR_6: 5270.4,
    FLOOR_5: 2592,
    FLOOR_4: 1533.6,
    FLOOR_3: 604.8,
    FLOOR_2: 237.6,
    FLOOR_1: 118.8,
    FLOOR_0: 59.4,
  };
}

function addSkyBlockItemListener(nadeshikoId) {
  let item = document.querySelector(`[n-id="${nadeshikoId}"]`);
  if (item) {
    item.addEventListener("mouseenter", function (e) {
      updateTooltip(nadeshikoId, "enter", item, e);
    });
    item.addEventListener("mouseleave", function () {
      updateTooltip(nadeshikoId, "leave", item);
    });
    item.addEventListener("mousemove", function (e) {
      updateTooltip(nadeshikoId, "move", item, e);
    });
    item.addEventListener("click", function () {
      updateTooltip(nadeshikoId, "click", item);
    });
  } else {
    console.warn(`Item with n-id ${nadeshikoId} not found`);
  }
}

function updateTooltip(nadeshikoId, action, item, e) {
  let tooltip = document.getElementById("item-tooltip");
  let tooltipLore = document.getElementById("item-tooltip-lore");

  if (action == "enter") {
    let itemData = allItems[nadeshikoId];

    updateElement("item-tooltip-name", generateMinecraftText(itemData["name"]), true);

    let lore = "";

    for (let a in itemData["lore"]) {
      lore += generateMinecraftText(itemData["lore"][a]) + "<br>";
    }
    updateElement("item-tooltip-lore", generateMinecraftText(lore), true);

    console.warn("new item");
    // Positioning
    tooltip.style.height = "unset";
    tooltip.style.overflow = "auto";

    let itemRect = item.getBoundingClientRect();
    let tooltipRect = tooltip.getBoundingClientRect();
    const ITEM_TOOLTIP_MARGIN = 10;

    let tooltipOffsetWidth = tooltip.offsetWidth;
    let tooltipOffsetHeight = tooltip.offsetHeight;

    if (itemRect.right + tooltipOffsetWidth + ITEM_TOOLTIP_MARGIN * 2 > window.innerWidth) {
      tooltipState.position = "left";
      tooltipState["set_x"] = itemRect.left - ITEM_TOOLTIP_MARGIN * 2 - tooltipRect.width;
      console.warn(`${itemRect.right} - ${tooltipRect.width}`);
    } else {
      tooltipState.position = "right";
      tooltipState["set_x"] = itemRect.left + itemRect.width;
    }

    tooltip.classList.remove("unloaded");
  } else if (action == "leave" && !tooltipState["modal_active"]) {
    tooltip.classList.add("unloaded");
  }

  if (action == "move" || action == "enter") {
    const HEADER_HEIGHT = 125;
    const FOOTER_HEIGHT = 80;
    const ITEM_TOOLTIP_MARGIN = 10;

    let outOfUpperBounds = false;
    let outOfLowerBounds = false;

    let tooltipRect = tooltip.getBoundingClientRect();

    if (tooltipRect.height > window.innerHeight - HEADER_HEIGHT - FOOTER_HEIGHT) {
      tooltip.style.height = window.innerHeight - HEADER_HEIGHT - FOOTER_HEIGHT + "px";
      tooltip.style.overflow = "scroll";

      outOfLowerBounds = true;
      outOfUpperBounds = true;
    }

    tooltip.style.top = e.clientY - tooltipRect.height / 2 + "px";

    tooltipRect = tooltip.getBoundingClientRect();

    //if (tooltipState["styleY"] != "scroll") {
    // prevents the tooltip from going off the screen
    if (tooltipRect.top - ITEM_TOOLTIP_MARGIN < HEADER_HEIGHT) {
      tooltip.style.top = HEADER_HEIGHT + "px";
      outOfUpperBounds = true;
      console.warn("out of upper bounds");
    } else {
      console.warn("not out of upper bounds because top is " + tooltipRect.top);
    }

    tooltipRect = tooltip.getBoundingClientRect();

    if (tooltipRect.bottom - ITEM_TOOLTIP_MARGIN > window.innerHeight - FOOTER_HEIGHT) {
      tooltip.style.top = window.innerHeight - tooltipRect.height - FOOTER_HEIGHT + "px";
      outOfLowerBounds = true;
      console.warn("out of lower bounds");
    }

    if (outOfUpperBounds && outOfLowerBounds) {
      tooltip.style.top = HEADER_HEIGHT + "px";
      tooltip.style.height = window.innerHeight - HEADER_HEIGHT - FOOTER_HEIGHT + "px";
      tooltipLore.style.overflow = "scroll";
      tooltipState["styleY"] = "scroll";
    } else if (tooltipState["styleY"] != "scroll") {
      tooltip.style.height = "unset";
      tooltip.style.overflow = "auto";
      tooltipState["styleY"] = "fixed";
    }
    //}

    if (tooltipState["position"] == "left") {
      tooltip.style.left = tooltipState["set_x"] + "px";
      tooltip.style.right = "unset";
    } else {
      tooltip.style.left = tooltipState["set_x"] + "px";
      tooltip.style.right = "unset";
    }

    console.log("top is " + tooltipRect.top);

    //console.log(tooltipState);
  } else if (action == "click") {
    if (tooltipState["modal_active"]) {
      tooltipState["modal_active"] = false;
      document.getElementById("item-tooltip-modal").classList.add("unloaded");
    } else {
      tooltipState["modal_active"] = true;
      document.getElementById("item-tooltip-modal").classList.remove("unloaded");
      document.getElementById("item-tooltip").classList.remove("unloaded");
    }
  }
}

function hideItemTooltipModal() {
  document.getElementById("item-tooltip-modal").classList.add("unloaded");
  document.getElementById("item-tooltip").classList.add("unloaded");
  tooltipState["modal_active"] = false;
}
