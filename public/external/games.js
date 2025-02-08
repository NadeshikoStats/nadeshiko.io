var bedWarsStats, totalDreamModeStats, duelsStats, arcadeStats, arenaStats, paintballStats, quakeStats, vampireZStats, wallsStats, tkrStats, copsAndCrimsStats, blitzStats, megaWallsStats, warlordsStats, warlordsFormattedWeapons, uhcStats, speedUHCStats, woolWarsNumericalStats, smashStats, fishingStats, fishingParticipatedSeasons;
var allDuelsStats = {};
var allTNTWizardStats = {};

function updateScopedElement(id, value, useInnerHTML = false) {
  updateElement(id, value, useInnerHTML, activeScope);
}

function setupMinigameContainer(id, innerHTML) {
  let minigameFragment = document.createDocumentFragment();
  let minigameContainer = document.createElement("div");

  minigameContainer.className = "flex-container unloaded minigame-flex-container";
  minigameContainer.id = id;
  minigameContainer.innerHTML = innerHTML;

  minigameFragment.appendChild(minigameContainer);
  activeScope = minigameFragment;

  updateTranslations(minigameFragment);

  return minigameContainer;
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

    updateElement("card-uuid", playerData["uuid"]);
    updateElement("card-ranktext", playerRankCute[1], true); // Adds player's rank

    if (playerRankCute[1] == "") {
      document.getElementById("card-rank").style.display = "none";
    }

    updateElement("card-name", playerData["name"]);
    updateElement("quick-mode-text", insertPlaceholders(getTranslation("player.quick_mode.description"), { player: playerData["name"] }), true);
    if (document.getElementById("quick-mode-username") != null) {
      document.getElementById("quick-mode-username").style.color = `var(--mc` + playerRankCute[0] + `)`;
    }

    updateElement("header-name", cuteRank(profileStats["tagged_name"], 0), true);
    updateElement("achievement-points", checkAndFormat(profileStats["achievement_points"]));
    document.getElementById("achievement-points-text").href = `/achievements/${playerData["uuid"]}`;
    updateElement("karma", checkAndFormat(profileStats["karma"]));
    updateElement("quests-completed", checkAndFormat(profileStats["quests_completed"]));
    document.getElementById("quests-completed-text").href = `/quests/${playerData["uuid"]}`;
    updateElement("ranks-gifted", checkAndFormat(profileStats["ranks_gifted"]));
    updateElement("multiplier", rawLocale(profileStats["coin_multiplier"], null));

    firstLogin = und(profileStats["first_login"]);
    firstLoginDate = new Date(firstLogin); // Used for birthday calculation
    if (firstLogin == 0) {
      document.getElementById("first-login-container").style.display = "none";
    } else {
      updateElement("first-login", shortDateFormat(firstLoginDate)); // Gets first login in Unix time and turns it into a date
      updateElement("first-login-ago", `${relativeTime(firstLoginDate)}`, true);
      updateElement("first-login-ago-full", longDateFormat(firstLoginDate));

      if (firstLoginDate.getMonth() == dateNow.getMonth() && firstLoginDate.getDate() == dateNow.getDate() && firstLoginDate.getYear() != dateNow.getYear()) {
        document.getElementById("birthday").style.display = "initial"; // Makes the birthday cake visible if it's your Hypixel anniversary!
        updateElement("birthday-text", `Happy ${dateNow.getYear() - firstLoginDate.getYear()} years of Hypixel!`);
        console.log("Happy anniversary!");
      }
    }

    lastLogin = und(profileStats["last_login"]);
    lastLoginDate = new Date(lastLogin);
    if (lastLogin == 0) {
      document.getElementById("last-login-container").style.display = "none";
    } else {
      updateElement("last-login", shortDateFormat(lastLoginDate));
      updateElement("last-login-ago", `${relativeTime(lastLoginDate)}`);
      updateElement("last-login-ago-full", longDateFormat(lastLoginDate));
    }

    let playerStatus = playerData["status"] || {};

    if (playerStatus["online"]) {
      // Checks player's online status
      updateElement("online-status", getTranslation("player.currently_online"));
      document.getElementById("online-status").style.color = "var(--mca)";

      document.getElementById("online-status-wrapper").classList.add("tooltip");

      // If the player is online, show the game and mode

      let gameType = gameNames[getValue(playerData, ["status", "game"])] || {};
      let gameModes = gameType["modeNames"] || {};
      let playerGameMode = playerData["status"]["mode"] || "";

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

    let guildName;

    if (playerData["guild"] == undefined) {
      console.log(playerData);
      document.getElementById("guild-stats").style.display = "none";
      document.getElementById("card-guild").style.display = "none";

      guildName = null;
    } else {
      guildStats = playerData["guild"];

      guildName = guildStats["name"];
      document.getElementById("guild-stats-header").href = `/guild/${guildName}`;
      updateElement("guild-name", guildName);
      updateElement("guild-tag", generateMinecraftText(guildStats["tag"]), true);
      updateElement("card-guild", generateMinecraftText(guildStats["tag"]), true);
      updateElement("guild-level", checkAndFormat(Math.floor(guildStats["level"])));
      updateElement("guild-members", checkAndFormat(guildStats["members"]));
      updateElement("guild-joined", shortDateFormat(new Date(guildStats["joined"])));
      updateElement("guild-joined-ago", `${relativeTime(new Date(guildStats["joined"]))}`);
      updateElement("guild-joined-ago-full", longDateFormat(new Date(guildStats["joined"])));
    }

    hypixelLevel = und(profileStats["network_level"]);
    updateElement("level", checkAndFormat(Math.floor(hypixelLevel)));
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

    let playerBadge = playerData["badge"] || "NONE";
    checkBadge(playerBadge);

    var socials = ["HYPIXEL", "YOUTUBE", "TWITTER", "TIKTOK", "TWITCH", "DISCORD"];
    for (a = 0; a < socials.length; a++) {
      // Iterates through social media and hides icons that don't exist for the player
      if (socialMediaList[socials[a]] == undefined) {
        document.getElementById("social-" + socials[a].toLowerCase()).style.display = "none";
        document.getElementById("social-" + socials[a].toLowerCase() + "-alternative").style.display = "none";
        document.getElementById("sociallink-" + socials[a].toLowerCase()).style.display = "none";
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
      { id: "network", name: getTranslation(["games", "network"]), minecraftId: "hypixel_logo" },
      { id: "arcade", name: getTranslation(["games", "arcade"]), minecraftId: "slime_ball" },
      { id: "bedwars", name: getTranslation(["games", "bedwars"]), minecraftId: "red_bed" },
      { id: "blitz", name: getTranslation(["games", "blitz"]), minecraftId: "diamond_sword" },
      { id: "buildbattle", name: getTranslation(["games", "buildbattle"]), minecraftId: "crafting_table" },
      { id: "classic", name: getTranslation(["games", "classic"]), minecraftId: "jukebox" },
      { id: "copsandcrims", name: getTranslation(["games", "copsandcrims"]), minecraftId: "iron_bars" },
      { id: "duels", name: getTranslation(["games", "duels"]), minecraftId: "fishing_rod" },
      { id: "megawalls", name: getTranslation(["games", "megawalls"]), minecraftId: "soul_sand" },
      { id: "murdermystery", name: getTranslation(["games", "murdermystery"]), minecraftId: "bow" },
      { id: "pit", name: getTranslation(["games", "pit"]), minecraftId: "dirt" },
      { id: "skywars", name: getTranslation(["games", "skywars"]), minecraftId: "ender_eye" },
      { id: "smashheroes", name: getTranslation(["games", "smashheroes"]), minecraftId: "head_smashheroes" },
      { id: "tntgames", name: getTranslation(["games", "tntgames"]), minecraftId: "tnt" },
      { id: "uhc", name: getTranslation(["games", "uhc"]), minecraftId: "golden_apple" },
      { id: "warlords", name: getTranslation(["games", "warlords"]), minecraftId: "stone_axe" },
      { id: "woolgames", name: getTranslation(["games", "woolgames"]), minecraftId: "white_wool" },

      { id: "fishing", name: getTranslation(["games", "fishing"]), minecraftId: "cod" },
      { id: "achievements", name: getTranslation(["achievements", "achievements"]), minecraftId: "diamond" },
      { id: "quests", name: getTranslation(["quests", "quests"]), minecraftId: "writable_book" },
      { id: "guild", name: getTranslation(["games", "modes", "network", "guild"]), minecraftId: "head_guild" },
    ];

    const quickModeGameContainer = document.getElementById("quick-mode-games");
    const gameSwitchMobileContainer = document.getElementById("game-switch-mobile");
    const gameSwitchContainer = document.getElementById("game-switch");
    const otherSwitchContainer = document.getElementById("other-switch");

    let headerObjectTypes = {
      games: ["network", "bedwars", "duels", "skywars"],
      other: ["fishing", "achievements", "quests", "guild"],
      special: ["achievements", "quests", "guild"],
    };

    quickModeGames.forEach((game) => {
      if (headerObjectTypes["special"].includes(game.id)) {
        // TODO
      } else {
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
      }
    });

    quickModeGames.forEach((game, index) => {
      let container;

      if (headerObjectTypes["special"].includes(game.id)) {
        container = document.createElement("a");
        container.setAttribute("target", "_blank");

        if (game.id == "guild") {
          if (guildName == null) {
            return;
          } else {
            container.setAttribute("href", `/guild/${guildName}`);
          }
        } else if (game.id == "achievements") {
          container.setAttribute("href", `/achievements/${playerData["uuid"]}`);
        } else if (game.id == "quests") {
          container.setAttribute("href", `/quests/${playerData["uuid"]}`);
        }
      } else {
        container = document.createElement("div");
        container.setAttribute("onclick", `switchStats('${game.id}')`);
      }

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

      if (headerObjectTypes["special"].includes(game.id)) {
        let externalIcon = document.createElement("img");
        externalIcon.src = "/img/svg/external.svg";
        externalIcon.alt = "";
        externalIcon.classList.add("verytinyicon");
        externalIcon.classList.add("mleft-5");
        container.appendChild(externalIcon);
      }

      if (headerObjectTypes["games"].includes(game.id)) {
        gameSwitchMobileContainer.appendChild(container);
      } else if (headerObjectTypes["other"].includes(game.id)) {
        otherSwitchContainer.appendChild(container);
      } else {
        gameSwitchContainer.appendChild(container);
      }
    });

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

    document.getElementById("player-card").style.paddingInlineStart = "0px";
    document.getElementById("player-card").style.paddingInlineEnd = "0px";
    document.getElementById("player-card").style.paddingBottom = "0px";
    document.getElementById("extended-card").style.marginBottom = "0px";
    addRecentPlayer(playerData["name"]);
  }
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
  let minigameTemplate = `
        <!-- bed wars stats -->
        <div class="chip-container">
          <div class="chip-small but-big">
            <div class="chip-small-background-filter"></div>
            <p class="chip-small-title" data-t="games.bedwars">Bed Wars</p>
            <div class="chip-small-container">
              <p class="margin10">
                <span id="bedwars-level-container"><span data-t="statistics.level">Level</span> <span class="statistic linear-gradient" id="bedwars-level"></span></span>
              </p>
              <div class="progress-bar">
                <span class="progress-number" id="bedwars-xp-progress-number"><span class="mc">Unknown</span></span>
                <div class="progress" style="width: 0%;" id="bedwars-xp-progress-bar"></div>
              </div>
              <div class="flex-two-item align-top flippable margin10">
                <div class="card-big-stats">
                  <p class="super-subtitle" data-t="games.modes.all.stats">Stats</p>
                  <div class="chip-small-statistic-row">
                      <p><span data-t="statistics.winstreak">Winstreak</span> <span class="statistic" id="bedwars-overall-winstreak"></span></p>
                  </div>
                  <div class="chip-small-statistic-row">
                      <p><span data-t="statistics.wins">Wins</span> <span class="statistic" id="bedwars-overall-wins"><span class="mc">Unknown</span></span></p>
                      <p><span data-t="statistics.losses">Losses</span> <span class="statistic" id="bedwars-overall-losses"><span class="mc">Unknown</span></span></p>
                      <p><span data-t="statistics.wlr">W/L R</span> <span class="statistic" id="bedwars-overall-wlr"><span class="mc">Unknown</span></span></p>
                  </div>
                  <div class="chip-small-statistic-row">
                      <p><span data-t="statistics.kills">Kills</span> <span class="statistic" id="bedwars-overall-kills"><span class="mc">Unknown</span></span></p>
                      <p><span data-t="statistics.deaths">Deaths</span> <span class="statistic" id="bedwars-overall-deaths"><span class="mc">Unknown</span></span></p>
                      <p><span data-t="statistics.kdr">K/D R</span> <span class="statistic" id="bedwars-overall-kdr"><span class="mc">Unknown</span></span></p>
                  </div>
                  <div class="chip-small-statistic-row">
                      <p><span data-t="statistics.final_kills">Final Kills</span> <span class="statistic" id="bedwars-overall-final_kills"><span class="mc">Unknown</span></span></p>
                      <p><span data-t="statistics.final_deaths">Final Deaths</span> <span class="statistic" id="bedwars-overall-final_deaths"><span class="mc">Unknown</span></span></p>
                      <p><span data-t="statistics.fkdr">FK/D R</span> <span class="statistic" id="bedwars-overall-fkdr"><span class="mc">Unknown</span></span></p>
                  </div>
                  <div class="chip-small-statistic-row">
                      <p><span data-t="statistics.beds_broken">Beds Broken</span> <span class="statistic" id="bedwars-overall-beds_broken"><span class="mc">Unknown</span></span></p>
                      <p><span data-t="statistics.beds_lost">Beds Lost</span> <span class="statistic" id="bedwars-overall-beds_lost"><span class="mc">Unknown</span></span></p>
                      <p><span data-t="statistics.bblr">BB/L R</span> <span class="statistic" id="bedwars-overall-bblr"><span class="mc">Unknown</span></span></p>
                  </div>
                </div>
                <div class="card-big-misc">
                  <p class="super-subtitle" data-t="games.modes.all.misc">Misc</p>
                  <div class="chip-small-statistic-row">
                      <p><span data-t="statistics.tokens">Tokens</span> <span class="statistic" id="bedwars-tokens"><span class="mc">Unknown</span></span></p>
                  </div>
                  <div class="chip-small-statistic-row">
                    <p><span data-t="statistics.slumber_tickets">Slumber Tickets</span> <span class="statistic" id="bedwars-slumber-tickets">0</span></p>
                  </div>
                  <div class="chip-small-statistic-row">
                    <p><span data-t="statistics.challenges_completed">Challenges Completed</span> <span class="statistic" id="bedwars-challenges-completed"><span class="mc">Unknown</span></span> <span class="m8" id="bedwars-unique-challenges-completed">(0/30 unique)</span></p>
                  </div>
                </div>
              </div>
            </div>
            <span class="general-button mright mtop" onclick="showCardWizard('BEDWARS')" data-t="player.generate_card">Generate Card</span>
          </div>
          <div class="flex-two-item chip-container-duo-parent" id="bedwars-chips">
            <div id="bedwars-chips-1" class="chip-container-duo">
            </div>
            <div id="bedwars-chips-2" class="chip-container-duo">
            </div>
          </div>
        </div>`;

  let minigameFragment = setupMinigameContainer("flex-container-bedwars", minigameTemplate);

  // Generates stats and chips for Bed Wars
  bedWarsStats = playerData["stats"]["Bedwars"] || {};
  if (bedWarsStats != undefined) {
    var modeNames = [
      [getTranslation("games.modes.bedwars.eight_one"), "eight_one"],
      [getTranslation("games.modes.bedwars.eight_two"), "eight_two"],
      [getTranslation("games.modes.bedwars.four_three"), "four_three"],
      [getTranslation("games.modes.bedwars.four_four"), "four_four"],
      [getTranslation("games.modes.bedwars.two_four"), "two_four"],
    ];

    var dreamModes = [
      [getTranslation("games.modes.all.overall"), "overall"],
      [getTranslation("games.modes.bedwars.eight_two_armed"), "eight_two_armed"],
      [getTranslation("games.modes.bedwars.four_four_armed"), "four_four_armed"],
      [getTranslation("games.modes.bedwars.eight_two_lucky"), "eight_two_lucky"],
      [getTranslation("games.modes.bedwars.four_four_lucky"), "four_four_lucky"],
      [getTranslation("games.modes.bedwars.eight_two_rush"), "eight_two_rush"],
      [getTranslation("games.modes.bedwars.four_four_rush"), "four_four_rush"],
      [getTranslation("games.modes.bedwars.eight_two_swap"), "eight_two_swap"],
      [getTranslation("games.modes.bedwars.four_four_swap"), "four_four_swap"],
      [getTranslation("games.modes.bedwars.eight_two_ultimate"), "eight_two_ultimate"],
      [getTranslation("games.modes.bedwars.four_four_ultimate"), "four_four_ultimate"],
      [getTranslation("games.modes.bedwars.eight_two_underworld"), "eight_two_underworld"],
      [getTranslation("games.modes.bedwars.four_four_underworld"), "four_four_underworld"],
      [getTranslation("games.modes.bedwars.eight_two_voidless"), "eight_two_voidless"],
      [getTranslation("games.modes.bedwars.four_four_voidless"), "four_four_voidless"],
    ];
    var easyStats = ["wins", "losses", "kills", "deaths", "final_kills", "final_deaths", "beds_broken", "beds_lost"];

    var bedWarsPrestigeColors = [["7"], ["f"], ["6"], ["b"], ["2"], ["3"], ["4"], ["d"], ["9"], ["5"], ["c", "6", "e", "a", "b", "d", "5"], ["7", "f", "f", "f", "f", "7", "7"], ["7", "e", "e", "e", "e", "6", "7"], ["7", "b", "b", "b", "b", "5", "7"], ["7", "a", "a", "a", "a", "2", "7"], ["7", "5", "5", "5", "5", "9", "7"], ["7", "c", "c", "c", "c", "4", "7"], ["7", "d", "d", "d", "d", "5", "7"], ["7", "9", "9", "9", "9", "1", "7"], ["7", "5", "5", "5", "5", "8", "7"], ["8", "7", "f", "f", "7", "7", "8"], ["f", "f", "e", "e", "6", "6", "6"], ["6", "6", "f", "f", "b", "3", "3"], ["5", "5", "d", "d", "6", "f", "f"], ["b", "b", "f", "f", "7", "7", "8"], ["f", "f", "a", "a", "2", "2", "2"], ["4", "4", "c", "c", "d", "d", "5"], ["e", "e", "f", "f", "8", "8", "8"], ["a", "a", "2", "2", "6", "6", "e"], ["b", "b", "5", "5", "9", "9", "1"], ["f", "f", "6", "6", "c", "c", "4"], ["9", "9", "5", "5", "6", "6", "e"], ["c", "4", "7", "7", "4", "c", "c"], ["9", "9", "9", "d", "c", "c", "4"], ["2", "a", "d", "d", "5", "5", "2"], ["c", "c", "4", "4", "2", "a", "a"], ["a", "a", "a", "b", "9", "9", "1"], ["4", "4", "c", "c", "b", "3", "3"], ["1", "1", "b", "5", "5", "d", "1"], ["c", "c", "a", "a", "3", "9", "9"], ["5", "5", "c", "c", "6", "6", "e"], ["e", "e", "6", "c", "d", "d", "5"], ["1", "9", "3", "b", "f", "7", "7"], ["0", "5", "8", "8", "5", "5", "0"], ["2", "2", "a", "e", "6", "5", "d"], ["f", "f", "b", "b", "3", "3", "3"], ["3", "b", "e", "e", "6", "d", "5"], ["f", "4", "c", "c", "9", "1", "9"], ["5", "5", "c", "6", "f", "b", "5"], ["2", "a", "f", "f", "a", "a", "2"], ["c", "c", "5", "9", "9", "1", "0"]];

    let bedWarsLevel = getBedWarsLevel(und(bedWarsStats["Experience"]));

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

    updateScopedElement("bedwars-level", checkAndFormat(Math.floor(bedWarsLevel)) + prefixIcon);
    activeScope.getElementById("bedwars-level").style.background = linearGradient(bedWarsPrestigeColors[Math.min(Math.floor(bedWarsLevel / 100), 50)]);
    activeScope.getElementById("bedwars-xp-progress-bar").style.width = ((bedWarsLevel % 1) * 100).toFixed(0) + "%";
    updateScopedElement("bedwars-xp-progress-number", ((bedWarsLevel % 1) * 100).toFixed(0) + "%");

    var bedWarsChips = [];

    for (e = 0; e < easyStats.length; e++) {
      updateScopedElement("bedwars-overall-" + easyStats[e], checkAndFormat(bedWarsStats[easyStats[e] + "_bedwars"]));
    }

    updateScopedElement("bedwars-overall-winstreak", checkAndFormat(bedWarsStats["winstreak"]));
    updateScopedElement("bedwars-overall-wlr", calculateRatio(bedWarsStats["wins_bedwars"], bedWarsStats["losses_bedwars"]));
    updateScopedElement("bedwars-overall-kdr", calculateRatio(bedWarsStats["kills_bedwars"], bedWarsStats["deaths_bedwars"]));
    updateScopedElement("bedwars-overall-fkdr", calculateRatio(bedWarsStats["final_kills_bedwars"], bedWarsStats["final_deaths_bedwars"]));
    updateScopedElement("bedwars-overall-bblr", calculateRatio(bedWarsStats["beds_broken_bedwars"], bedWarsStats["beds_lost_bedwars"]));
    updateScopedElement("bedwars-tokens", checkAndFormat(bedWarsStats["coins"]));
    updateScopedElement("bedwars-challenges-completed", checkAndFormat(bedWarsStats["total_challenges_completed"]));

    updateScopedElement("bedwars-unique-challenges-completed", insertPlaceholders(getTranslation("statistics.unique_challenges_completed"), { num: checkAndFormat(bedWarsStats["bw_unique_challenges_completed"]), total: checkAndFormat(30) }));

    if (bedWarsStats["bw_unique_challenges_completed"] == 30) {
      activeScope.getElementById("bedwars-unique-challenges-completed").style.color = `var(--gold)`;
    }

    if (bedWarsStats["slumber"] != undefined) {
      updateScopedElement("bedwars-slumber-tickets", checkAndFormat(bedWarsStats["slumber"]["tickets"]));
    }

    for (a = 0; a < modeNames.length; a++) {
      // Regular stats
      let bedWarsChip = [
        "bedwars-stats-" + modeNames[a][1].toLowerCase(), // ID
        modeNames[a][0], // Title
        "", // Subtitle (none)
        `/img/games/bedwars/${modeNames[a][1].toLowerCase()}.${imageFileType}`, // Image
        getBedWarsModeStats(modeNames[a][1]), // Displayed stats
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
      [true, [getTranslation("statistics.winstreak"), checkAndFormat(dreamModeWinstreak)]],
      [false, [getTranslation("statistics.wins"), checkAndFormat(totalDreamModeStatsCounts[0])], [getTranslation("statistics.losses"), checkAndFormat(totalDreamModeStatsCounts[1])], [getTranslation("statistics.wlr"), calculateRatio(totalDreamModeStatsCounts[0], totalDreamModeStatsCounts[1])]],
      [false, [getTranslation("statistics.kills"), checkAndFormat(totalDreamModeStatsCounts[2])], [getTranslation("statistics.deaths"), checkAndFormat(totalDreamModeStatsCounts[3])], [getTranslation("statistics.kdr"), calculateRatio(totalDreamModeStatsCounts[2], totalDreamModeStatsCounts[3])]],
      [false, [getTranslation("statistics.final_kills"), checkAndFormat(totalDreamModeStatsCounts[4])], [getTranslation("statistics.final_deaths"), checkAndFormat(totalDreamModeStatsCounts[5])], [getTranslation("statistics.fkdr"), calculateRatio(totalDreamModeStatsCounts[4], totalDreamModeStatsCounts[5])]],
      [false, [getTranslation("statistics.beds_broken"), checkAndFormat(totalDreamModeStatsCounts[6])], [getTranslation("statistics.beds_lost"), checkAndFormat(totalDreamModeStatsCounts[7])], [getTranslation("statistics.bblr"), calculateRatio(totalDreamModeStatsCounts[6], totalDreamModeStatsCounts[7])]],
    ];

    bedWarsChips.push([
      // Generates the Dreams mode chip
      "bedwars-stats-dreams",
      getTranslation("games.modes.bedwars.dreams"),
      "",
      `/img/games/bedwars/dreams.${imageFileType}`,
      totalDreamModeStats,
      dreamModes,
      "",
      "bedwars",
    ]);

    generateChips(bedWarsChips, "bedwars-chips");
  }

  minigameFragments["bedwars"] = minigameFragment;
  document.getElementById("games").appendChild(minigameFragment);
}

function generateSkyWars() {
  let minigameTemplate = `
      <!-- skywars stats -->
      <div class="chip-container">
        <div class="chip-small but-big">
          <div class="chip-small-background-filter"></div>
          <p class="chip-small-title" data-t="games.skywars">SkyWars</p>
          <div class="chip-small-container">
            <p class="margin10">
              <span data-t="statistics.level">Level</span> <span class="statistic" id="skywars-level"><span class="m7">1⋆</span></span>
            </p>
            <div class="progress-bar">
              <span class="progress-number" id="skywars-xp-progress-number"><span class="mc">Unknown</span></span>
              <div class="progress" style="width: 0%;" id="skywars-xp-progress-bar"></div>
            </div>
            <div class="flex-two-item align-top flippable margin10">
              <div class="card-big-stats">
                <p class="super-subtitle" data-t="games.modes.all.stats">Stats</p>
                <div class="chip-small-statistic-row">
                    <p><span data-t="statistics.wins">Wins</span> <span class="statistic" id="skywars-overall-wins"><span class="mc">Unknown</span></span></p>
                    <p><span data-t="statistics.losses">Losses</span> <span class="statistic" id="skywars-overall-losses"><span class="mc">Unknown</span></span></p>
                    <p><span data-t="statistics.wlr">W/L R</span> <span class="statistic" id="skywars-overall-wlr"><span class="mc">Unknown</span></span></p>
                </div>
                <div class="chip-small-statistic-row">
                    <p><span data-t="statistics.kills">Kills</span> <span class="statistic" id="skywars-overall-kills"><span class="mc">Unknown</span></span></p>
                    <p><span data-t="statistics.deaths">Deaths</span> <span class="statistic" id="skywars-overall-deaths"><span class="mc">Unknown</span></span></p>
                    <p><span data-t="statistics.kdr">K/D R</span> <span class="statistic" id="skywars-overall-kdr"><span class="mc">Unknown</span></span></p>
                </div>
              </div>
              <div class="card-big-misc">
                <p class="super-subtitle" data-t="games.modes.all.misc">Misc</p>
                <div class="chip-small-statistic-row">
                    <p><span data-t="statistics.coins">Coins</span> <span class="statistic" id="skywars-overall-coins"><span class="mc">Unknown</span></span></p>
                    <p><span data-t="statistics.tokens">Tokens</span> <span class="statistic" id="skywars-overall-cosmetic_tokens"><span class="mc">Unknown</span></span></p>
                </div>
                <div class="chip-small-statistic-row">
                    <p><span data-t="statistics.heads">Heads</span> <span class="statistic" id="skywars-overall-heads"><span class="mc">Unknown</span></span></p>
                    <p><span data-t="statistics.corruption">Corruption</span> <span class="statistic" id="skywars-overall-corruption-chance"><span class="mc">Unknown</span></span></p>
                </div>
                <div class="chip-small-statistic-row">
                  <p><span data-t="statistics.chests_opened">Chests Opened</span> <span class="statistic" id="skywars-overall-chests_opened"><span class="mc">Unknown</span></span></p>
                  <p><span data-t="statistics.playtime">Playtime</span> <span class="statistic" id="skywars-overall-playtime"><span class="mc">Unknown</span></span></p>
                </div>
              </div>
            </div>
          </div>
          <span class="general-button mright mtop" onclick="showCardWizard('SKYWARS')" data-t="player.generate_card">Generate Card</span>
        </div>
        <div class="flex-two-item chip-container-duo-parent">
          <div id="skywars-chips-1" class="chip-container-duo">
          </div>
          <div id="skywars-chips-2" class="chip-container-duo">
          </div>
        </div>
      </div>`;

  let minigameFragment = setupMinigameContainer("flex-container-skywars", minigameTemplate);

  skyWarsStats = playerData["stats"]["SkyWars"] || {};
  if (skyWarsStats != undefined) {
    if (skyWarsStats["levelFormatted"] != undefined) {
      updateScopedElement("skywars-level", generateMinecraftText(skyWarsStats["levelFormatted"], true), true);
    } else {
      // only runs if the player hasn't logged in since 2021(?)
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
      ];

      let skywarsEstimatedExperience = und(skyWarsStats["wins"]) * 10 + und(skyWarsStats["kills"]);
      let skyWarsEstimatedLevel = Math.floor(getSkyWarsLevel(skywarsEstimatedExperience));

      updateScopedElement(
        "skywars-level",
        getGenericWinsPrefix({
          wins: skyWarsEstimatedLevel,
          winsObject: skyWarsLevels,
          useToGo: false,
          suffix: "⋆",
          useBrackets: false,
        })["title"],
        true
      );
    }

    easyStats = ["kills", "deaths", "wins", "losses", "coins", "cosmetic_tokens", "chests_opened", "heads"];
    for (e = 0; e < easyStats.length; e++) {
      updateScopedElement("skywars-overall-" + easyStats[e], checkAndFormat(skyWarsStats[easyStats[e]]));
    }

    skyWarsLevel = getSkyWarsLevel(und(skyWarsStats["skywars_experience"]));
    activeScope.getElementById("skywars-xp-progress-bar").style.width = (skyWarsLevel % 1) * 100 + "%";
    updateScopedElement("skywars-xp-progress-number", ((skyWarsLevel % 1) * 100).toFixed(0) + "%");

    updateScopedElement("skywars-overall-kdr", calculateRatio(skyWarsStats["kills"], skyWarsStats["deaths"]));
    updateScopedElement("skywars-overall-wlr", calculateRatio(skyWarsStats["wins"], skyWarsStats["losses"]));
    updateScopedElement("skywars-overall-playtime", smallDuration(und(skyWarsStats["time_played"])));

    updateScopedElement("skywars-overall-corruption-chance", und(skyWarsStats["angel_of_death_level"]) + und(skyWarsStats["angels_offering"]) + (skyWarsStats["packages"] != undefined ? skyWarsStats["packages"].includes("favor_of_the_angel") : 0) + "%");

    skyWarsChips = [];
    skyWarsStatsToShow = [
      [
        getTranslation("games.modes.skywars.solo"),
        "solo",
        [
          [getTranslation("games.modes.all.overall"), "solo"],
          [getTranslation("games.modes.skywars.normal"), "solo_normal"],
          [getTranslation("games.modes.skywars.insane"), "solo_insane"],
        ],
      ],
      [
        getTranslation("games.modes.skywars.team"),
        "team",
        [
          [getTranslation("games.modes.all.overall"), "team"],
          [getTranslation("games.modes.skywars.normal"), "team_normal"],
          [getTranslation("games.modes.skywars.insane"), "team_insane"],
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
        `/img/games/skywars/${skyWarsStatsToShow[a][1]}.${imageFileType}`, // Image
        getSkyWarsModeStats(skyWarsStatsToShow[a][1]), // Displayed stats
        skyWarsStatsToShow[a][2], // Other stats (shown in drop-down menu)
        "", // Icon
        "skywars", // Gamemode (used for dropdowns)
      ];
      skyWarsChips.push(skyWarsChip);
    }

    generateChips(skyWarsChips, "skywars-chips");
  }

  minigameFragments["skywars"] = minigameFragment;
  document.getElementById("games").appendChild(minigameFragment);
}

function getBedWarsModeStats(mode) {
  return [
    [true, [getTranslation("statistics.winstreak"), checkAndFormat(bedWarsStats[mode + "_winstreak"])]],
    [false, [getTranslation("statistics.wins"), checkAndFormat(bedWarsStats[mode + "_wins_bedwars"])], [getTranslation("statistics.losses"), checkAndFormat(bedWarsStats[mode + "_losses_bedwars"])], [getTranslation("statistics.wlr"), calculateRatio(bedWarsStats[mode + "_wins_bedwars"], bedWarsStats[mode + "_losses_bedwars"])]],
    [false, [getTranslation("statistics.kills"), checkAndFormat(bedWarsStats[mode + "_kills_bedwars"])], [getTranslation("statistics.deaths"), checkAndFormat(bedWarsStats[mode + "_deaths_bedwars"])], [getTranslation("statistics.kdr"), calculateRatio(bedWarsStats[mode + "_kills_bedwars"], bedWarsStats[mode + "_deaths_bedwars"])]],
    [false, [getTranslation("statistics.final_kills"), checkAndFormat(bedWarsStats[mode + "_final_kills_bedwars"])], [getTranslation("statistics.final_deaths"), checkAndFormat(bedWarsStats[mode + "_final_deaths_bedwars"])], [getTranslation("statistics.fkdr"), calculateRatio(bedWarsStats[mode + "_final_kills_bedwars"], bedWarsStats[mode + "_final_deaths_bedwars"])]],
    [false, [getTranslation("statistics.beds_broken"), checkAndFormat(bedWarsStats[mode + "_beds_broken_bedwars"])], [getTranslation("statistics.beds_lost"), checkAndFormat(bedWarsStats[mode + "_beds_lost_bedwars"])], [getTranslation("statistics.bblr"), calculateRatio(bedWarsStats[mode + "_beds_broken_bedwars"], bedWarsStats[mode + "_beds_lost_bedwars"])]],
  ];
}

function getSkyWarsModeStats(mode) {
  return [
    [false, [getTranslation("statistics.wins"), checkAndFormat(skyWarsStats["wins_" + mode])], [getTranslation("statistics.losses"), checkAndFormat(skyWarsStats["losses_" + mode])], [getTranslation("statistics.wlr"), calculateRatio(skyWarsStats["wins_" + mode], skyWarsStats["losses_" + mode])]],
    [false, [getTranslation("statistics.kills"), checkAndFormat(skyWarsStats["kills_" + mode])], [getTranslation("statistics.deaths"), checkAndFormat(skyWarsStats["deaths_" + mode])], [getTranslation("statistics.kdr"), calculateRatio(skyWarsStats["kills_" + mode], skyWarsStats["deaths_" + mode])]],
  ];
}

function getZombiesStats(map) {
  if (map == "overall") {
    map = "";
  } else {
    map = "_" + map;
  }

  return [
    [false, [getTranslation("statistics.wins"), checkAndFormat(arcadeStats["wins_zombies" + map])]],
    [false, [getTranslation("statistics.kills"), checkAndFormat(arcadeStats["zombie_kills_zombies" + map])], [getTranslation("statistics.deaths"), checkAndFormat(arcadeStats["deaths_zombies" + map])], [getTranslation("statistics.kdr"), calculateRatio(arcadeStats["zombie_kills_zombies" + map], arcadeStats["deaths_zombies" + map])]],
    [false, [getTranslation("statistics.downs"), checkAndFormat(arcadeStats["times_knocked_down_zombies" + map])], [getTranslation("statistics.revives"), checkAndFormat(arcadeStats["players_revived_zombies" + map])], [getTranslation("statistics.rounds_survived"), checkAndFormat(arcadeStats["total_rounds_survived_zombies" + map])]],
    [false, [getTranslation("statistics.doors_opened"), checkAndFormat(arcadeStats["doors_opened_zombies" + map])], [getTranslation("statistics.windows_repaired"), checkAndFormat(arcadeStats["windows_repaired_zombies" + map])]],
  ];
}

function getArcadeHideAndSeekStats(mode) {
  if (mode == "overall") {
    mode = "";
  } else {
    mode = mode + "_";
  }

  return [
    [false, [getTranslation("statistics.wins"), sumStatsBasic([mode + "hider_wins_hide_and_seek", mode + "seeker_wins_hide_and_seek"], arcadeStats)]],
    [false, [getTranslation("statistics.wins_hider"), checkAndFormat(arcadeStats[mode + "hider_wins_hide_and_seek"])], [getTranslation("statistics.wins_seeker"), checkAndFormat(arcadeStats[mode + "seeker_wins_hide_and_seek"])]],
    // party_pooper_seeker_wins_hide_and_seek
  ];
}

function getArenaBrawlStats(mode) {
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
    formattedArenaModeStats[0] = getArenaBrawlTitle(arenaModeStats[0], arenaStats["prefix_color"]);
  }

  return [
    [false, [getTranslation("statistics.coins"), checkAndFormat(arenaStats["coins"])]],
    [false, [getTranslation("statistics.wins"), formattedArenaModeStats[0]], [getTranslation("statistics.losses"), formattedArenaModeStats[1]], [getTranslation("statistics.wlr"), calculateRatio(arenaModeStats[0], arenaModeStats[1])]],
    [false, [getTranslation("statistics.kills"), formattedArenaModeStats[2]], [getTranslation("statistics.deaths"), formattedArenaModeStats[3]], [getTranslation("statistics.kdr"), calculateRatio(arenaModeStats[2], arenaModeStats[3])]],
    [false, [getTranslation("statistics.damage_dealt"), formattedArenaModeStats[4] + " HP"], [getTranslation("statistics.damage_healed"), formattedArenaModeStats[5] + " HP"]],
    [false, [getTranslation("statistics.magical_keys"), checkAndFormat(arenaStats["keys"])], [getTranslation("statistics.magical_chests"), checkAndFormat(arenaStats["magical_chest"])]],
  ];
}

function getArcadePartyGamesStats(mode) {}

function getTKRStats(mode) {
  if (mode == "overall") {
    let tkrGamesPlayed = sumStatsBasic(["retro_plays", "canyon_plays", "junglerush_plays", "hypixelgp_plays", "olympus_plays"], tkrStats);

    return [
      [false, [getTranslation("statistics.coins"), checkAndFormat(tkrStats["coins"])]],
      [false, [getTranslation("statistics.trophies"), checkAndFormat(sumStatsBasic(["gold_trophy", "silver_trophy", "bronze_trophy"], tkrStats))], [getTranslation("statistics.laps"), checkAndFormat(tkrStats["laps_completed"])]],
      [false, [getTranslation("statistics.golds"), getTKRTitle(tkrStats["gold_trophy"], tkrStats["prefix_color"])], [getTranslation("statistics.silvers"), checkAndFormat(tkrStats["silver_trophy"])], [getTranslation("statistics.bronzes"), checkAndFormat(tkrStats["bronze_trophy"])]],
      [false, [getTranslation("statistics.games_played"), locale(tkrGamesPlayed, 0)], [getTranslation("statistics.trophy_rate"), checkAndFormat((sumStatsBasic(["gold_trophy", "silver_trophy", "bronze_trophy"], tkrStats) / tkrGamesPlayed) * 100, 1) + "%"]],
      [false, [getTranslation("statistics.box_pickups"), checkAndFormat(tkrStats["box_pickups"])], [getTranslation("statistics.coin_pickups"), checkAndFormat(tkrStats["coins_picked_up"])]],
    ];
  } else {
    let tkrGamesPlayed = und(tkrStats[mode + "_plays"]);
    mode = "_" + mode;

    return [
      [false, [getTranslation("statistics.coins"), checkAndFormat(tkrStats["coins"])]],
      [false, [getTranslation("statistics.trophies"), checkAndFormat(sumStatsBasic(["gold_trophy" + mode, "silver_trophy" + mode, "bronze_trophy" + mode], tkrStats))]],
      [false, [getTranslation("statistics.golds"), checkAndFormat(tkrStats["gold_trophy" + mode])], [getTranslation("statistics.silvers"), checkAndFormat(tkrStats["silver_trophy" + mode])], [getTranslation("statistics.bronzes"), checkAndFormat(tkrStats["bronze_trophy" + mode])]],
      [false, [getTranslation("statistics.games_played"), locale(tkrGamesPlayed, 0)], [getTranslation("statistics.trophy_rate"), checkAndFormat((sumStatsBasic(["gold_trophy" + mode, "silver_trophy" + mode, "bronze_trophy" + mode], tkrStats) / tkrGamesPlayed) * 100, 1) + "%"]],
      [false, [getTranslation("statistics.box_pickups"), checkAndFormat(tkrStats["box_pickups" + mode])]],
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
      [false, [getTranslation("statistics.coins"), checkAndFormat(vampireZStats["coins"])]],
      [
        false,
        [
          getTranslation("statistics.wins"),
          getGenericWinsPrefix({
            wins: und(vampireZStats["human_wins"]),
            winsObject: vampireZWinPrefixes,
            useToGo: false,
          })["title"],
        ],
      ],
      [false, [getTranslation("statistics.vampire_kills"), checkAndFormat(vampireZStats["vampire_kills"])], [getTranslation("statistics.deaths"), checkAndFormat(vampireZStats["human_deaths"])], [getTranslation("statistics.kdr"), calculateRatio(vampireZStats["vampire_kills"], vampireZStats["human_deaths"])]],
      [false, [getTranslation("statistics.zombie_kills"), checkAndFormat(vampireZStats["zombie_kills"])], [getTranslation("statistics.most_vampire_kills"), checkAndFormat(vampireZStats["most_vampire_kills_new"])]],
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
      [false, [getTranslation("statistics.coins"), checkAndFormat(vampireZStats["coins"])]],
      [false, [getTranslation("statistics.wins"), checkAndFormat(vampireZStats["vampire_wins"])]],
      [
        false,
        [
          getTranslation("statistics.human_kills"),
          getGenericWinsPrefix({
            wins: und(vampireZStats["human_kills"]),
            winsObject: vampireZWinPrefixes,
            useToGo: false,
          })["title"],
        ],
        [getTranslation("statistics.deaths"), checkAndFormat(vampireZStats["vampire_deaths"])],
        [getTranslation("statistics.kdr"), calculateRatio(vampireZStats["human_kills"], vampireZStats["vampire_deaths"])],
      ],
    ];
  }
}

function getQuakeStats(mode) {
  let quakeModeStats = [];
  if (mode == "overall") {
    quakeModeStats = sumStats(["kills", "deaths", "wins", "headshots", "killstreaks", "shots_fired", "distance_travelled"], ["", "_teams"], quakeStats, "", true);
    return [
      [false, [getTranslation("statistics.coins"), checkAndFormat(quakeStats["coins"])]],
      [false, [getTranslation("statistics.wins"), checkAndFormat(quakeModeStats[2])]],
      [false, [getTranslation("statistics.kills"), getQuakecraftTitle(quakeModeStats[0], quakeStats["selectedKillPrefix"])], [getTranslation("statistics.deaths"), checkAndFormat(quakeModeStats[1]), [getTranslation("statistics.kdr"), calculateRatio(quakeModeStats[0], quakeModeStats[1])]]],
      [false, [getTranslation("statistics.headshots"), checkAndFormat(quakeModeStats[3])], [getTranslation("statistics.killstreaks"), checkAndFormat(quakeModeStats[4])]],
      [false, [getTranslation("statistics.shots"), checkAndFormat(quakeModeStats[5])], [getTranslation("statistics.distance_travelled"), checkAndFormat(quakeModeStats[6]) + "m"]],
      [false, [getTranslation("statistics.godlikes"), checkAndFormat(playerAchievements["quake_godlikes"])]],
    ];
  } else {
    return [
      [false, [getTranslation("statistics.coins"), checkAndFormat(quakeStats["coins"])]],
      [false, [getTranslation("statistics.wins"), checkAndFormat(quakeStats["wins" + mode])]],
      [false, [getTranslation("statistics.kills"), checkAndFormat(quakeStats["kills" + mode])], [getTranslation("statistics.deaths"), checkAndFormat(quakeStats["deaths" + mode]), [getTranslation("statistics.kdr"), calculateRatio(quakeStats["kills" + mode], quakeStats["deaths" + mode])]]],
      [false, [getTranslation("statistics.headshots"), checkAndFormat(quakeStats["headshots" + mode])], [getTranslation("statistics.killstreaks"), checkAndFormat(quakeStats["killstreaks" + mode])]],
      [false, [getTranslation("statistics.shots"), checkAndFormat(quakeStats["shots_fired" + mode])], [getTranslation("statistics.distance_travelled"), checkAndFormat(quakeStats["distance_travelled" + mode]) + "m"]],
      [false, [getTranslation("statistics.godlikes"), checkAndFormat(playerAchievements["quake_godlikes"])]],
    ];
  }
}

function getArcadeSeasonalStats(game) {
  if (game == "overall") {
    return [
      [false, [getTranslation("statistics.wins"), checkAndFormat(sumStats(["wins"], ["santa_simulator", "scuba_simulator", "halloween_simulator", "grinch_simulator_v2", "easter_simulator"], arcadeStats, "_", true))]],
      [false, [getTranslation("statistics.items_found"), checkAndFormat(sumStatsBasic(["delivered_santa_simulator", "items_found_scuba_simulator", "candy_found_halloween_simulator", "gifts_grinch_simulator_v2", "eggs_found_easter_simulator"], arcadeStats))]],
    ];
  } else {
    if (game == "grinch_simulator_v2") {
      return [
        [false, [getTranslation("statistics.wins"), checkAndFormat(arcadeStats["wins_grinch_simulator_v2"])]],
        [false, [getTranslation("statistics.gifts_stolen"), checkAndFormat(arcadeStats["gifts_grinch_simulator_v2"])]],
      ];
    } else if (game == "scuba_simulator") {
      return [
        [false, [getTranslation("statistics.wins"), checkAndFormat(arcadeStats["wins_scuba_simulator"])]],
        [false, [getTranslation("statistics.items_found"), checkAndFormat(arcadeStats["items_found_scuba_simulator"])], [getTranslation("statistics.total_points"), checkAndFormat(arcadeStats["total_points_scuba_simulator"])]],
      ];
    } else if (game == "santa_simulator") {
      return [
        [false, [getTranslation("statistics.wins"), checkAndFormat(arcadeStats["wins_santa_simulator"])]],
        [false, [getTranslation("statistics.gifts_delivered"), checkAndFormat(arcadeStats["delivered_santa_simulator"])], [getTranslation("statistics.times_spotted"), checkAndFormat(arcadeStats["spotted_santa_simulator"])]],
      ];
    } else if (game == "halloween_simulator") {
      return [
        [false, [getTranslation("statistics.wins"), checkAndFormat(arcadeStats["wins_halloween_simulator"])]],
        [false, [getTranslation("statistics.candy_found"), checkAndFormat(arcadeStats["candy_found_halloween_simulator"])]],
      ];
    } else if (game == "easter_simulator") {
      return [
        [false, [getTranslation("statistics.wins"), checkAndFormat(arcadeStats["wins_easter_simulator"])]],
        [false, [getTranslation("statistics.eggs_found"), checkAndFormat(arcadeStats["eggs_found_easter_simulator"])]],
      ];
    }
  }
}

function getDuelsStats(mode, is_bridge = false, cuteName) {
  importedDuelsStats = [checkAndFormat(duelsStats["current_winstreak_mode_" + mode]), checkAndFormat(duelsStats["best_winstreak_mode_" + mode]), checkAndFormat(duelsStats[mode + "_wins"]), checkAndFormat(duelsStats[mode + "_losses"]), calculateRatio(duelsStats[mode + "_wins"], duelsStats[mode + "_losses"])];

  if (is_bridge) {
    // Bridge uses a different wins counter
    importedDuelsStats.push(checkAndFormat(duelsStats[mode + "_bridge_kills"]), checkAndFormat(duelsStats[mode + "_bridge_deaths"]), calculateRatio(duelsStats[mode + "_bridge_kills"], duelsStats[mode + "_bridge_deaths"]));
  } else {
    importedDuelsStats.push(checkAndFormat(duelsStats[mode + "_kills"]), checkAndFormat(duelsStats[mode + "_deaths"]), calculateRatio(duelsStats[mode + "_kills"], duelsStats[mode + "_deaths"]));
  }

  return [
    [
      [true, [getTranslation("statistics.winstreak"), importedDuelsStats[0]], [getTranslation("statistics.best_winstreak"), importedDuelsStats[1]]],
      [false, [getTranslation("statistics.wins"), importedDuelsStats[2]], [getTranslation("statistics.losses"), importedDuelsStats[3]], [getTranslation("statistics.wlr"), importedDuelsStats[4]]],
      [false, [getTranslation("statistics.kills"), importedDuelsStats[5]], [getTranslation("statistics.deaths"), importedDuelsStats[6]], [getTranslation("statistics.kdr"), importedDuelsStats[7]]],
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
      [true, [getTranslation("statistics.winstreak"), checkAndFormat(roundRobinDuelsStats2[0])], [getTranslation("statistics.best_winstreak"), checkAndFormat(roundRobinDuelsStats2[1])]],
      [false, [getTranslation("statistics.wins"), checkAndFormat(roundRobinDuelsStats[0])], [getTranslation("statistics.losses"), checkAndFormat(roundRobinDuelsStats[1])], [getTranslation("statistics.wlr"), calculateRatio(roundRobinDuelsStats[0], roundRobinDuelsStats[1])]],
      [false, [getTranslation("statistics.kills"), checkAndFormat(roundRobinDuelsStats[2])], [getTranslation("statistics.deaths"), checkAndFormat(roundRobinDuelsStats[3])], [getTranslation("statistics.kdr"), calculateRatio(roundRobinDuelsStats[2], roundRobinDuelsStats[3])]],
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
  let minigameTemplate = `
        <!-- duels stats -->
        <div class="chip-container">
          <div class="chip-small but-big">
            <div class="chip-small-background-filter"></div>
            <p class="chip-small-title" data-t="games.duels">Duels</p>
            <div class="chip-small-container">
              <p class="margin10">
                <span id="duels-overall-title"></span> <span id="duels-overall-to-go"></span>
              </p>
              <div class="progress-bar">
                <span class="progress-number" id="duels-overall-progress-number"><span class="mc">Unknown</span></span>
                <div class="progress" style="width: 0%;" id="duels-overall-progress-bar"></div>
              </div>
              <div class="flex-two-item align-top flippable margin10">
                <div class="card-big-stats">
                  <p class="super-subtitle" data-t="games.modes.all.stats">Stats</p>
                  <div class="chip-small-statistic-row">
                      <p><span data-t="statistics.winstreak">Winstreak</span> <span class="statistic" id="duels-overall-current_winstreak"></span></p>
                      <p><span data-t="statistics.best_winstreak">Best Winstreak</span> <span class="statistic" id="duels-overall-best_overall_winstreak"></span></p>
                  </div>
                  <div class="chip-small-statistic-row">
                      <p><span data-t="statistics.wins">Wins</span> <span class="statistic" id="duels-overall-wins"><span class="mc">Unknown</span></span></p>
                      <p><span data-t="statistics.losses">Losses</span> <span class="statistic" id="duels-overall-losses"><span class="mc">Unknown</span></span></p>
                      <p><span data-t="statistics.wlr">W/L R</span> <span class="statistic" id="duels-overall-wlr"><span class="mc">Unknown</span></span></p>
                  </div>
                  <div class="chip-small-statistic-row">
                      <p><span data-t="statistics.kills">Kills</span> <span class="statistic" id="duels-overall-kills"><span class="mc">Unknown</span></span></p>
                      <p><span data-t="statistics.deaths">Deaths</span> <span class="statistic" id="duels-overall-deaths"><span class="mc">Unknown</span></span></p>
                      <p><span data-t="statistics.kdr">K/D R</span> <span class="statistic" id="duels-overall-kdr"><span class="mc">Unknown</span></span></p>
                  </div>
                </div>
                <div class="card-big-misc">
                  <p class="super-subtitle" data-t="games.modes.all.misc">Misc</p>
                  <div class="chip-small-statistic-row">
                      <p><span data-t="statistics.tokens">Tokens</span> <span class="statistic" id="duels-overall-coins"><span class="mc">Unknown</span></span></p>
                  </div>
                  <div class="chip-small-statistic-row">
                    <p><span data-t="statistics.damage_dealt">Damage Dealt</span> <span class="statistic" id="duels-overall-damage-dealt"><span class="mc">Unknown</span></span></p>
                  </div>
                  <div class="chip-small-statistic-row">
                    <p><span data-t="statistics.clicks">Clicks</span> <span class="statistic" id="duels-overall-melee_swings"><span class="mc">Unknown</span></span></p>
                  </div>
                </div>
              </div>
            </div>
            <span class="general-button mright mtop" onclick="showCardWizard('DUELS')" data-t="player.generate_card">Generate Card</span>
          </div>
          <div class="flex-two-item chip-container-duo-parent" id="duels-chips">
            <div id="duels-chips-1" class="chip-container-duo">
            </div>
            <div id="duels-chips-2" class="chip-container-duo">
            </div>
          </div>
      </div>
    </div>`;

  let minigameFragment = setupMinigameContainer("flex-container-duels", minigameTemplate);

  // Generates stats and chips for Duels
  duelsStats = playerData["stats"]["Duels"] || {};
  if (duelsStats != undefined) {
    duelsChips = [];

    let easyStats = ["wins", "losses", "kills", "deaths", "current_winstreak", "best_overall_winstreak", "coins", "melee_swings"];
    for (e = 0; e < easyStats.length; e++) {
      updateScopedElement("duels-overall-" + easyStats[e], checkAndFormat(duelsStats[easyStats[e]]));
    }

    updateScopedElement("duels-overall-kdr", calculateRatio(duelsStats["kills"], duelsStats["deaths"]));
    updateScopedElement("duels-overall-wlr", calculateRatio(duelsStats["wins"], duelsStats["losses"]));
    updateScopedElement("duels-overall-damage-dealt", checkAndFormat(duelsStats["damage_dealt"] / 2) + ` ♥&#xFE0E;`, true);

    overallDuelsTitle = getDuelsTitle(und(duelsStats["wins"]));

    let winsToGo = overallDuelsTitle[1];
    let formattedWinsToGo;

    if (winsToGo == -1) {
      formattedWinsToGo = ``;
    } else if (winsToGo == -2) {
      formattedWinsToGo = getTranslation("statistics.max_title");
    } else {
      if (winsToGo == 1) {
        formattedWinsToGo = insertPlaceholders(getTranslation("statistics.wins_to_go_emphasis"), { num: checkAndFormat(winsToGo) });
      } else {
        formattedWinsToGo = insertPlaceholders(getTranslation("statistics.wins_to_go"), { num: checkAndFormat(winsToGo) });
      }
    }

    updateScopedElement("duels-overall-title", overallDuelsTitle[0], true);
    updateScopedElement("duels-overall-to-go", formattedWinsToGo);
    duelsProgress = (overallDuelsTitle[2] - overallDuelsTitle[1]) / overallDuelsTitle[2];
    updateScopedElement("duels-overall-progress-number", Math.floor(duelsProgress * 100) + "%");
    activeScope.getElementById("duels-overall-progress-bar").style.width = Math.floor(duelsProgress * 100) + "%";

    var duelsModes = [
      ["UHC 1v1", "uhc_duel", "uhc", false],
      ["UHC 2v2", "uhc_doubles", "uhc", false],
      ["UHC 4v4", "uhc_four", "uhc", false],
      ["UHC Deathmatch", "uhc_meetup", "uhc", false],
      ["OP 1v1", "op_duel", "op", false],
      ["OP 2v2", "op_doubles", "op", false],
      ["SkyWars 1v1", "sw_duel", "sw", false],
      ["SkyWars 2v2", "sw_doubles", "sw", false],
      [getTranslation("games.modes.duels.bow.category"), "bow_duel", "bow", false],
      [getTranslation("games.modes.duels.blitz.category"), "blitz_duel", "blitz", false],
      ["Mega Walls", "mw_duel", "mw", false],
      ["Mega Walls Doubles", "mw_doubles", "mw", false],
      [getTranslation("games.modes.duels.sumo.category"), "sumo_duel", "sumo", false],
      [getTranslation("games.modes.duels.bowspleef.category"), "bowspleef_duel", "bowspleef", false],
      [getTranslation("games.modes.duels.parkour.category"), "parkour_eight", "parkour", false],
      [getTranslation("games.modes.duels.boxing.category"), "boxing_duel", "boxing", false],
      [getTranslation("games.modes.duels.classic.category"), "classic_duel", "classic", false],
      [getTranslation("games.modes.duels.potion.category"), "potion_duel", "nodebuff", false],
      [getTranslation("games.modes.duels.combo.category"), "combo_duel", "combo", false],
      ["Bridge 1v1", "bridge_duel", "bridge", true],
      ["Bridge 2v2", "bridge_doubles", "bridge", true],
      ["Bridge 3v3", "bridge_threes", "bridge", true],
      ["Bridge 4v4", "bridge_four", "bridge", true],
      ["Bridge 2v2v2v2", "bridge_2v2v2v2", "bridge", true],
      ["Bridge 3v3v3v3", "bridge_3v3v3v3", "bridge", true],
      ["Bridge CTF 3v3", "capture_threes", "bridge", true],
      [getTranslation("games.modes.duels.arena.category"), "duel_arena", "arena", false],
    ];

    var duelsWithMultipleModes = [
      ["bridge", getTranslation("games.modes.duels.bridge.category"), ["bridge_duel", "bridge_doubles", "bridge_threes", "bridge_four", "bridge_2v2v2v2", "bridge_3v3v3v3", "capture_threes"]],
      ["mw", getTranslation("games.modes.duels.mw.category"), ["mw_duel", "mw_doubles"]],
      ["sw", getTranslation("games.modes.duels.sw.category"), ["sw_duel", "sw_doubles"]],
      ["op", getTranslation("games.modes.duels.op.category"), ["op_duel", "op_doubles"]],
      ["uhc", getTranslation("games.modes.duels.uhc.category"), ["uhc_duel", "uhc_doubles"]],
    ];

    var duelsStatsToShow = [
      [
        "bridge",
        getTranslation("games.modes.duels.bridge.category"),
        [
          [getTranslation("games.modes.all.overall"), "bridge"],
          [getTranslation("games.modes.duels.bridge.bridge_duel"), "bridge_duel"],
          [getTranslation("games.modes.duels.bridge.bridge_doubles"), "bridge_doubles"],
          [getTranslation("games.modes.duels.bridge.bridge_threes"), "bridge_threes"],
          [getTranslation("games.modes.duels.bridge.bridge_four"), "bridge_four"],
          [getTranslation("games.modes.duels.bridge.bridge_2v2v2v2"), "bridge_2v2v2v2"],
          [getTranslation("games.modes.duels.bridge.bridge_3v3v3v3"), "bridge_3v3v3v3"],
          [getTranslation("games.modes.duels.bridge.capture_threes"), "capture_threes"],
        ],
        "blue_terracotta",
      ],
      [
        "sw",
        getTranslation("games.modes.duels.sw.category"),
        [
          [getTranslation("games.modes.all.overall"), "sw"],
          [getTranslation("games.modes.duels.sw.sw_duel"), "sw_duel"],
          [getTranslation("games.modes.duels.sw.sw_doubles"), "sw_doubles"],
        ],
        "ender_eye",
      ],
      ["classic_duel", getTranslation("games.modes.duels.classic.category"), [], "fishing_rod"],
      [
        "uhc",
        getTranslation("games.modes.duels.uhc.category"),
        [
          [getTranslation("games.modes.all.overall"), "uhc"],
          [getTranslation("games.modes.duels.uhc.uhc_duel"), "uhc_duel"],
          [getTranslation("games.modes.duels.uhc.uhc_doubles"), "uhc_doubles"],
          [getTranslation("games.modes.duels.uhc.uhc_four"), "uhc_four"],
          [getTranslation("games.modes.duels.uhc.uhc_meetup"), "uhc_meetup"],
        ],
        "head_uhc",
      ],
      ["sumo_duel", getTranslation("games.modes.duels.sumo.category"), [], "slime_ball"],
      ["parkour_eight", getTranslation("games.modes.duels.parkour.category"), [], "feather"],
      ["blitz_duel", getTranslation("games.modes.duels.blitz.category"), [], "diamond_sword"],
      ["bow_duel", getTranslation("games.modes.duels.bow.category"), [], "bow"],
      [
        "mw",
        getTranslation("games.modes.duels.mw.category"),
        [
          [getTranslation("games.modes.all.overall"), "mw"],
          [getTranslation("games.modes.duels.mw.mw_duel"), "mw_duel"],
          [getTranslation("games.modes.duels.mw.mw_doubles"), "mw_doubles"],
        ],
        "soul_sand",
      ],
      ["bowspleef_duel", getTranslation("games.modes.duels.bowspleef.category"), [], "tnt"],
      [
        "op",
        getTranslation("games.modes.duels.op.category"),
        [
          [getTranslation("games.modes.all.overall"), "op"],
          [getTranslation("games.modes.duels.op.op_duel"), "op_duel"],
          [getTranslation("games.modes.duels.op.op_doubles"), "op_doubles"],
        ],
        "diamond_chestplate",
      ],
      ["combo_duel", getTranslation("games.modes.duels.combo.category"), [], "potion_weakness"],
      ["boxing_duel", getTranslation("games.modes.duels.boxing.category"), [], "head_boxing"],
      ["potion_duel", getTranslation("games.modes.duels.potion.category"), [], "potion_fire_resistance"],
      ["duel_arena", getTranslation("games.modes.duels.arena.category"), [], "beacon"],
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
        formattedWinsToGo = getTranslation("statistics.max_title");
      } else {
        if (winsToGo == 1) {
          formattedWinsToGo = insertPlaceholders(getTranslation("statistics.wins_to_go_emphasis"), { num: checkAndFormat(winsToGo) });
        } else {
          formattedWinsToGo = insertPlaceholders(getTranslation("statistics.wins_to_go"), { num: checkAndFormat(winsToGo) });
        }
      }

      duelsChip = [
        "duels-stats-" + currentDuel[0], // ID
        currentDuel[1], // Title
        `${currentDuelPrefix[0]} ${formattedWinsToGo}`, // Subtitle (none)
        `/img/games/duels/${currentDuel[0]}.${imageFileType}`, // Background image
        allDuelsStats[currentDuel[0]][0], // Displayed stats
        currentDuel[2], // Other stats (shown in drop-down menu)
        `/img/icon/minecraft/${currentDuel[3]}.${imageFileType}`, // Chip image
        "duels", // gamemode
      ];
      duelsChips.push(duelsChip);
    }

    generateChips(duelsChips, "duels-chips");
  }

  minigameFragments["duels"] = minigameFragment;
  document.getElementById("games").appendChild(minigameFragment);
}

function generateBuildBattle() {
  let minigameTemplate = `<div class="chip-container" id="buildbattle-chips">
        <div class="chip-small but-big">
          <div class="chip-small-background-filter"></div>
          <p class="chip-small-title" data-t="games.buildbattle">Build Battle</p>
          <div class="chip-small-container">
            <p class="margin10">
              <span id="buildbattle-overall-emblem"></span> <span id="buildbattle-overall-title"><span class="mc">Unknown</span></span>
            </p>
            <div class="progress-bar" id="buildbattle-overall-progress-bar-container" style="display: none">
              <span class="progress-number" id="buildbattle-overall-progress-number"><span class="mc">Unknown</span></span>
              <div class="progress" style="width: 0%;" id="buildbattle-overall-progress-bar"></div>
            </div>
            <div class="flex-two-item align-top flippable margin10">
              <div class="card-big-stats">
                <p class="super-subtitle" data-t="games.modes.all.stats">Stats</p>
                <div class="chip-small-statistic-row">
                    <p><span data-t="statistics.score">Score</span> <span class="statistic" id="buildbattle-overall-score"><span class="mc">Unknown</span></span></p>
                </div>
                <div class="chip-small-statistic-row">
                    <p><span data-t="statistics.wins">Wins</span> <span class="statistic" id="buildbattle-overall-wins"><span class="mc">Unknown</span></span></p>
                    <p><span data-t="statistics.losses">Losses</span> <span class="statistic" id="buildbattle-overall-losses"><span class="mc">Unknown</span></span></p>
                    <p><span data-t="statistics.wlr">W/L R</span> <span class="statistic" id="buildbattle-overall-wlr"><span class="mc">Unknown</span></span></p>
                </div>
              </div>
              <div class="card-big-misc">
                <p class="super-subtitle" data-t="games.modes.all.misc">Misc</p>
                <div class="chip-small-statistic-row">
                    <p><span data-t="statistics.tokens">Tokens</span> <span class="statistic" id="buildbattle-overall-tokens"><span class="mc">Unknown</span></span></p>
                </div>
                <div class="chip-small-statistic-row">
                  <p><span data-t="statistics.votes">Votes</span> <span class="statistic" id="buildbattle-overall-total_votes"><span class="mc">Unknown</span></span></p>
                  <p><span data-t="statistics.highest_score">Highest Score</span> <span class="statistic" id="buildbattle-overall-highest-score"><span class="mc">Unknown</span></span></p>
                </div>
              </div>
            </div>
          </div>
          <span class="general-button mright mtop" onclick="showCardWizard('BUILD_BATTLE')" data-t="player.generate_card">Generate Card</span>
        </div>
        <div class="flex-two-item chip-container-duo-parent">
          <div id="buildbattle-chips-1" class="chip-container-duo">
          </div>
          <div id="buildbattle-chips-2" class="chip-container-duo">
          </div>
        </div>
    </div>`;

  let minigameFragment = setupMinigameContainer("flex-container-buildbattle", minigameTemplate);
  // Generates stats and chips for Build Battle

  let buildBattleStats = playerData["stats"]["BuildBattle"] || {};
  if (buildBattleStats != undefined) {
    let buildBattleScore = und(buildBattleStats["score"]);
    updateScopedElement("buildbattle-overall-score", checkAndFormat(buildBattleScore));

    let buildBattleTitle = getBuildBattleTitle(buildBattleScore, true);

    if (buildBattleTitle["winsToGo"] > 0) {
      let buildBattleProgressToNextTitle = und((buildBattleScore - buildBattleTitle["currentTitleRequirement"]) / (buildBattleScore - buildBattleTitle["currentTitleRequirement"] + buildBattleTitle["winsToGo"]));

      updateScopedElement("buildbattle-overall-progress-number", Math.floor(buildBattleProgressToNextTitle * 100) + "%");
      activeScope.getElementById("buildbattle-overall-progress-bar").style.width = buildBattleProgressToNextTitle * 100 + "%";

      activeScope.getElementById("buildbattle-overall-progress-bar-container").style.display = "block";
    }

    updateScopedElement("buildbattle-overall-title", buildBattleTitle["title"], true);

    updateScopedElement("buildbattle-overall-losses", locale(und(buildBattleStats["games_played"]) - und(buildBattleStats["wins"]), 0));
    updateScopedElement("buildbattle-overall-wlr", calculateRatio(buildBattleStats["wins"], und(buildBattleStats["games_played"]) - und(buildBattleStats["wins"])));
    updateScopedElement("buildbattle-overall-highest-score", checkAndFormat(playerAchievements["buildbattle_build_battle_points"]));
    updateScopedElement("buildbattle-overall-tokens", checkAndFormat(buildBattleStats["coins"]));

    let easyStats = ["wins", "total_votes"];
    for (e = 0; e < easyStats.length; e++) {
      updateScopedElement("buildbattle-overall-" + easyStats[e], checkAndFormat(buildBattleStats[easyStats[e]]));
    }

    let buildBattleEmblems = {
      ALPHA: "α",
      OMEGA: "Ω",
      REMINISCENCE: "≈",
      RICH: "$",
      PODIUM: "π",
      FLORIN: "ƒ",
    };

    let buildBattleEmblem = buildBattleStats["emblem"] || {};

    if (Object.keys(buildBattleEmblem).length > 0 && buildBattleEmblem["selected_icon"] && buildBattleEmblem["selected_color"]) {
      updateScopedElement("buildbattle-overall-emblem", generateMinecraftText(minecraftColorCodes[buildBattleEmblem["selected_color"]] + buildBattleEmblems[buildBattleEmblem["selected_icon"]], true), true);
    }

    let buildBattleModes = [
      [getTranslation("games.modes.buildbattle.solo_normal"), "solo_normal", []],
      [getTranslation("games.modes.buildbattle.teams_normal"), "teams_normal", []],
      [getTranslation("games.modes.buildbattle.solo_pro"), "solo_pro", []],
      [getTranslation("games.modes.buildbattle.guess_the_build"), "guess_the_build", []],
      [getTranslation("games.modes.buildbattle.speed_builders"), "speed_builders", []],
    ];

    buildBattleChips = [];
    for (a = 0; a < buildBattleModes.length; a++) {
      currentBuildBattleMode = buildBattleModes[a];

      buildBattleModeStats = [[false, [getTranslation("statistics.wins"), checkAndFormat(buildBattleStats[`wins_${currentBuildBattleMode[1]}`])]]];

      if (currentBuildBattleMode[1] == "guess_the_build") {
        buildBattleModeStats[0].push([getTranslation("statistics.correct_guesses"), checkAndFormat(buildBattleStats[`correct_guesses`])]);
      }

      if (currentBuildBattleMode[1] == "speed_builders") {
        buildBattleModeStats[0].push([getTranslation("statistics.perfect_builds"), checkAndFormat(playerAchievements["buildbattle_speed_builders_perfectionist"])]);
      }

      buildBattleChip = [
        "buildbattle-stats-" + buildBattleModes[a][1], // ID
        buildBattleModes[a][0], // Title
        ``, // Subtitle (none)
        `/img/games/buildbattle/${buildBattleModes[a][1]}.${imageFileType}`, // Background image
        buildBattleModeStats, // Displayed stats
        [], // Other stats (shown in drop-down menu)
        ``, // Chip image
        "buildbattle", // gamemode
      ];
      buildBattleChips.push(buildBattleChip);
    }

    generateChips(buildBattleChips, "buildbattle-chips");
  }

  minigameFragments["buildbattle"] = minigameFragment;
  document.getElementById("games").appendChild(minigameFragment);
}

function generateMurderMystery() {
  let minigameTemplate = ` <div class="chip-container">
      <div class="chip-small but-big">
        <div class="chip-small-background-filter"></div>
        <p class="chip-small-title" data-t="games.murdermystery">Murder Mystery</p>
        <div class="chip-small-container">
          <div class="flex-two-item align-top flippable margin10">
            <div class="card-big-stats">
              <p class="super-subtitle" data-t="games.modes.all.stats">Stats</p>
              <div class="chip-small-statistic-row">
                  <p><span data-t="statistics.wins">Wins</span> <span class="statistic" id="murdermystery-overall-wins"><span class="mc">Unknown</span></span></p>
                  <p><span data-t="statistics.losses">Losses</span> <span class="statistic" id="murdermystery-overall-losses"><span class="mc">Unknown</span></span></p>
                  <p><span data-t="statistics.wlr">W/L R</span> <span class="statistic" id="murdermystery-overall-wlr"><span class="mc">Unknown</span></span></p>
              </div>
              <div class="chip-small-statistic-row">
                <p><span data-t="statistics.kills">Kills</span> <span class="statistic" id="murdermystery-overall-kills"><span class="mc">Unknown</span></span></p>
                <p><span data-t="statistics.deaths">Deaths</span> <span class="statistic" id="murdermystery-overall-deaths"><span class="mc">Unknown</span></span></p>
                <p><span data-t="statistics.kdr">K/D R</span> <span class="statistic" id="murdermystery-overall-kdr"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.wins_murderer">Wins (Murderer)</span> <span class="statistic" id="murdermystery-overall-murderer_wins"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.wins_detective">Wins (Detective)</span> <span class="statistic" id="murdermystery-overall-detective_wins"><span class="mc">Unknown</span></span></p>
          </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.fastest_win_murderer">Fastest Win (Murderer)</span> <span class="statistic" id="murdermystery-overall-quickest_murderer_win_time_seconds"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.fastest_win_detective">Fastest Win (Detective)</span> <span class="statistic" id="murdermystery-overall-quickest_detective_win_time_seconds"><span class="mc">Unknown</span></span></p>
          </div>
            </div>
            <div class="card-big-misc">
              <p class="super-subtitle" data-t="games.modes.all.misc">Misc</p>
              <div class="chip-small-statistic-row">
                <p><span data-t="statistics.tokens">Tokens</span> <span class="statistic" id="murdermystery-overall-coins"><span class="mc">Unknown</span></span></p>
              </div>
              <div class="chip-small-statistic-row">
                <p><span data-t="statistics.gold_picked_up">Gold Picked Up</span> <span class="statistic" id="murdermystery-overall-coins_pickedup"><span class="mc">Unknown</span></span></p>
              </div>
              <div class="chip-small-statistic-row">
                <p><span data-t="statistics.kills_murderer">Kills (Murderer)</span> <span class="statistic" id="murdermystery-overall-kills_as_murderer"><span class="mc">Unknown</span></span></p>
                <p><span data-t="statistics.wins_hero">Wins (Hero)</span> <span class="statistic" id="murdermystery-overall-was_hero"><span class="mc">Unknown</span></span></p>
              </div>
            </div>
          </div>
        </div>
        <span class="general-button mright mtop" onclick="showCardWizard('MURDERMYSTERY')" data-t="player.generate_card">Generate Card</span>
      </div>
      <div class="flex-two-item chip-container-duo-parent">
        <div id="murdermystery-chips-1" class="chip-container-duo">
        </div>
        <div id="murdermystery-chips-2" class="chip-container-duo">
        </div>
      </div>
  </div>`;
  let minigameFragment = setupMinigameContainer("flex-container-murdermystery", minigameTemplate);

  // Generates stats and chips for Murder Mystery
  let murderMysteryStats = playerData["stats"]["MurderMystery"] || {};
  if (murderMysteryStats != undefined) {
    let easyStats = ["kills", "deaths", "wins", "coins", "coins_pickedup", "murderer_wins", "detective_wins", "kills_as_murderer", "was_hero"];

    for (e = 0; e < easyStats.length; e++) {
      updateScopedElement("murdermystery-overall-" + easyStats[e], checkAndFormat(murderMysteryStats[easyStats[e]]));
    }

    updateScopedElement("murdermystery-overall-losses", checkAndFormat(und(murderMysteryStats["games"]) - und(murderMysteryStats["wins"])));
    updateScopedElement("murdermystery-overall-wlr", calculateRatio(murderMysteryStats["wins"], und(murderMysteryStats["games"]) - und(murderMysteryStats["wins"])));
    updateScopedElement("murdermystery-overall-kdr", calculateRatio(murderMysteryStats["kills"], murderMysteryStats["deaths"]));

    updateScopedElement("murdermystery-overall-quickest_murderer_win_time_seconds", smallDuration(und(murderMysteryStats["quickest_murderer_win_time_seconds"])));
    updateScopedElement("murdermystery-overall-quickest_detective_win_time_seconds", smallDuration(und(murderMysteryStats["quickest_detective_win_time_seconds"])));

    murderMysteryModes = [
      [getTranslation("games.modes.murdermystery.MURDER_CLASSIC"), "MURDER_CLASSIC", []],
      [getTranslation("games.modes.murdermystery.MURDER_DOUBLE_UP"), "MURDER_DOUBLE_UP", []],
      [getTranslation("games.modes.murdermystery.MURDER_ASSASSINS"), "MURDER_ASSASSINS", []],
      [getTranslation("games.modes.murdermystery.MURDER_INFECTION"), "MURDER_INFECTION", []],
    ];
    murderMysteryChips = [];

    for (a = 0; a < murderMysteryModes.length; a++) {
      currentMurderMysteryMode = murderMysteryModes[a];

      let murderMysteryModeStats;

      murderMysteryModeStats = [
        [false, [getTranslation("statistics.wins"), checkAndFormat(murderMysteryStats[`wins_${currentMurderMysteryMode[1]}`])], [getTranslation("statistics.losses"), checkAndFormat(murderMysteryStats[`games_${currentMurderMysteryMode[1]}`] - murderMysteryStats[`wins_${currentMurderMysteryMode[1]}`])], [getTranslation("statistics.wlr"), calculateRatio(murderMysteryStats[`wins_${currentMurderMysteryMode[1]}`], murderMysteryStats[`games_${currentMurderMysteryMode[1]}`] - murderMysteryStats[`wins_${currentMurderMysteryMode[1]}`])]],
        [false, [getTranslation("statistics.kills"), checkAndFormat(murderMysteryStats[`kills_${currentMurderMysteryMode[1]}`])], [getTranslation("statistics.deaths"), checkAndFormat(murderMysteryStats[`deaths_${currentMurderMysteryMode[1]}`])], [getTranslation("statistics.kdr"), calculateRatio(murderMysteryStats[`kills_${currentMurderMysteryMode[1]}`], murderMysteryStats[`deaths_${currentMurderMysteryMode[1]}`])]],
      ];

      if (currentMurderMysteryMode[1] == "MURDER_CLASSIC" || currentMurderMysteryMode[1] == "MURDER_DOUBLE_UP") {
        murderMysteryModeStats.push([false, [getTranslation("statistics.wins_murderer"), checkAndFormat(murderMysteryStats[`murderer_wins_${currentMurderMysteryMode[1]}`])], [getTranslation("statistics.wins_detective"), checkAndFormat(murderMysteryStats[`detective_wins_${currentMurderMysteryMode[1]}`])]], [false, [getTranslation("statistics.kills_murderer"), checkAndFormat(murderMysteryStats[`kills_as_murderer_${currentMurderMysteryMode[1]}`])], [getTranslation("statistics.wins_hero"), checkAndFormat(murderMysteryStats[`was_hero_${currentMurderMysteryMode[1]}`])]]);
      } else if (currentMurderMysteryMode[1] == "MURDER_ASSASSINS") {
        // idk
      } else if (currentMurderMysteryMode[1] == "MURDER_INFECTION") {
        murderMysteryModeStats.push([false, [getTranslation("statistics.wins_survivor"), checkAndFormat(murderMysteryStats[`survivor_wins_${currentMurderMysteryMode[1]}`])], [getTranslation("statistics.total_time_survived"), smallDuration(und(murderMysteryStats[`total_time_survived_seconds_${currentMurderMysteryMode[1]}`]))]], [false, [getTranslation("statistics.kills_infected"), checkAndFormat(murderMysteryStats[`kills_as_infected_${currentMurderMysteryMode[1]}`])], [getTranslation("statistics.kills_survivor"), checkAndFormat(murderMysteryStats[`kills_as_survivor_${currentMurderMysteryMode[1]}`])]]);
      }

      murderMysteryModeStats.push([false, [getTranslation("statistics.gold_picked_up"), checkAndFormat(murderMysteryStats[`coins_pickedup_${currentMurderMysteryMode[1]}`])]]);

      murderMysteryChip = [
        "murdermystery-stats-" + currentMurderMysteryMode[1], // ID
        currentMurderMysteryMode[0], // Title
        ``, // Subtitle (none)
        `/img/games/murdermystery/${currentMurderMysteryMode[1]}.${imageFileType}`, // Background image
        murderMysteryModeStats, // Displayed stats
        [], // Other stats (shown in drop-down menu)
        ``, // Chip image
        "murdermystery", // gamemode
      ];
      murderMysteryChips.push(murderMysteryChip);
    }

    generateChips(murderMysteryChips, "murdermystery-chips");
  }

  minigameFragments["murdermystery"] = minigameFragment;
  document.getElementById("games").appendChild(minigameFragment);
}

function generateTNTGames() {
  let minigameTemplate = ` <div class="chip-container">
    <div class="chip-small but-big">
      <div class="chip-small-background-filter"></div>
      <p class="chip-small-title" data-t="games.tntgames">TNT Games</p>
      <div class="chip-small-container">
        <div class="flex-two-item align-top flippable margin10">
          <div class="card-big-stats">
            <p class="super-subtitle" data-t="games.modes.all.stats">Stats</p>
            <div class="chip-small-statistic-row">
                <p><span data-t="statistics.wins">Wins</span> <span class="statistic" id="tntgames-overall-wins"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
                <p><span data-t="statistics.kills">Kills</span> <span class="statistic" id="tntgames-overall-kills"><span class="mc">Unknown</span></span></p>
                <p><span data-t="statistics.deaths">Deaths</span> <span class="statistic" id="tntgames-overall-deaths"><span class="mc">Unknown</span></span></p>
                <p><span data-t="statistics.kdr">K/D R</span> <span class="statistic" id="tntgames-overall-kdr"><span class="mc">Unknown</span></span></p>
            </div>
          </div>
          <div class="card-big-misc">
            <p class="super-subtitle" data-t="games.modes.all.misc">Misc</p>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.tokens">Tokens</span> <span class="statistic" id="tntgames-overall-coins"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.playtime">Playtime</span> <span class="statistic" id="tntgames-overall-playtime"><span class="mc">Unknown</span></span></p>
            </div>
          </div>
        </div>
      </div>
      <span class="general-button mright mtop" onclick="showCardWizard('TNTGAMES')" data-t="player.generate_card">Generate Card</span>
    </div>
    <div class="flex-two-item chip-container-duo-parent">
      <div id="tntgames-chips-1" class="chip-container-duo">
      </div>
      <div id="tntgames-chips-2" class="chip-container-duo">
      </div>
    </div>
  </div>`;
  let minigameFragment = setupMinigameContainer("flex-container-tntgames", minigameTemplate);

  // Generates stats and chips for TNT Games
  let tntGamesStats = playerData["stats"]["TNTGames"] || {};
  if (tntGamesStats != undefined) {
    let easyStats = ["wins", "coins"];

    for (e = 0; e < easyStats.length; e++) {
      updateScopedElement("tntgames-overall-" + easyStats[e], checkAndFormat(tntGamesStats[easyStats[e]]));
    }

    // Get kills, deaths with sumStats
    let tntGamesKills = sumStats(["kills"], ["tntrun", "pvprun", "tntag", "capture", "bowspleef"], tntGamesStats, "_", true);
    let tntGamesDeaths = sumStats(["deaths"], ["tntrun", "pvprun", "tntag", "capture", "bowspleef"], tntGamesStats, "_", true);

    updateScopedElement("tntgames-overall-kills", checkAndFormat(tntGamesKills));
    updateScopedElement("tntgames-overall-deaths", checkAndFormat(tntGamesDeaths));
    updateScopedElement("tntgames-overall-kdr", calculateRatio(tntGamesKills, tntGamesDeaths));
    updateScopedElement("tntgames-overall-playtime", smallDuration(playerAchievements["tntgames_tnt_triathlon"] * 60));
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
    getTranslation("games.modes.tntgames.tntrun.category"), // Title
    "", // Subtitle
    `/img/games/tntgames/tntrun.${imageFileType}`, // Background image
    [
      [
        false,
        [
          getTranslation("statistics.wins"),
          getGenericWinsPrefix({
            wins: tntGamesStats["wins_tntrun"],
            winsObject: tntGamesHighPrefixes,
            definedColor: tntGamesStats["prefix_tntrun"],
            useToGo: false,
          })["title"],
        ],
        [getTranslation("statistics.losses"), checkAndFormat(tntGamesStats["deaths_tntrun"])],
        [getTranslation("statistics.wlr"), calculateRatio(tntGamesStats["wins_tntrun"], tntGamesStats["deaths_tntrun"])],
      ],
      [false, [getTranslation("statistics.blocks_ran"), checkAndFormat(playerAchievements["tntgames_block_runner"])], [getTranslation("statistics.best_time"), smallDuration(und(tntGamesStats["record_tntrun"]))]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    "/img/icon/minecraft/diamond_boots.png", // Chip image
    "tntgames", // gamemode
  ];

  let pvpRunCard = [
    "tntgames-stats-pvprun", // ID
    getTranslation("games.modes.tntgames.pvprun.category"), // Title
    "", // Subtitle
    `/img/games/tntgames/pvprun.${imageFileType}`, // Background image
    [
      [
        false,
        [
          getTranslation("statistics.wins"),
          getGenericWinsPrefix({
            wins: tntGamesStats["wins_pvprun"],
            winsObject: tntGamesHighPrefixes,
            definedColor: tntGamesStats["prefix_pvprun"],
            useToGo: false,
          })["title"],
        ],
        [getTranslation("statistics.losses"), checkAndFormat(tntGamesStats["deaths_pvprun"])],
        [getTranslation("statistics.wlr"), calculateRatio(tntGamesStats["wins_pvprun"], tntGamesStats["deaths_pvprun"])],
      ],
      [false, [getTranslation("statistics.kills"), checkAndFormat(tntGamesStats["kills_pvprun"])], [getTranslation("statistics.deaths"), checkAndFormat(tntGamesStats["deaths_pvprun"])], [getTranslation("statistics.kdr"), calculateRatio(tntGamesStats["kills_pvprun"], tntGamesStats["deaths_pvprun"])]],
      [false, [getTranslation("statistics.best_time"), smallDuration(und(tntGamesStats["record_pvprun"]))]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    "/img/icon/minecraft/iron_sword.png", // Chip image
    "tntgames", // gamemode
  ];

  let tntTagCard = [
    "tntgames-stats-tntag", // ID
    getTranslation("games.modes.tntgames.tntag.category"), // Title
    "", // Subtitle
    `/img/games/tntgames/tntag.${imageFileType}`, // Background image
    [
      [
        false,
        [
          getTranslation("statistics.wins"),
          getGenericWinsPrefix({
            wins: tntGamesStats["wins_tntag"],
            winsObject: tntGamesLowPrefixes,
            definedColor: tntGamesStats["prefix_tntag"],
            useToGo: false,
          })["title"],
        ],
        [getTranslation("statistics.losses"), checkAndFormat(tntGamesStats["deaths_tntag"])],
        [getTranslation("statistics.wlr"), calculateRatio(tntGamesStats["wins_tntag"], tntGamesStats["deaths_tntag"])],
      ],
      [false, [getTranslation("statistics.kills"), checkAndFormat(tntGamesStats["kills_tntag"])], [getTranslation("statistics.deaths"), checkAndFormat(tntGamesStats["deaths_tntag"])], [getTranslation("statistics.kdr"), calculateRatio(tntGamesStats["kills_tntag"], tntGamesStats["deaths_tntag"])]],
      [false, [getTranslation("statistics.tags"), checkAndFormat(playerAchievements["tntgames_clinic"])], [getTranslation("statistics.powerups"), checkAndFormat(playerAchievements["tntgames_the_upper_hand"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    "/img/icon/minecraft/tnt.png", // Chip image
    "tntgames", // gamemode
  ];

  let bowSpleefCard = [
    "tntgames-stats-bowspleef", // ID
    getTranslation("games.modes.tntgames.bowspleef.category"), // Title
    "", // Subtitle
    `/img/games/tntgames/bowspleef.${imageFileType}`, // Background image
    [
      [
        false,
        [
          getTranslation("statistics.wins"),
          getGenericWinsPrefix({
            wins: tntGamesStats["wins_bowspleef"],
            winsObject: tntGamesHighPrefixes,
            definedColor: tntGamesStats["prefix_bowspleef"],
            useToGo: false,
          })["title"],
        ],
        [getTranslation("statistics.losses"), checkAndFormat(tntGamesStats["deaths_bowspleef"])],
        [getTranslation("statistics.wlr"), calculateRatio(tntGamesStats["wins_bowspleef"], tntGamesStats["deaths_bowspleef"])],
      ],
      [false, [getTranslation("statistics.arrows_shot"), checkAndFormat(tntGamesStats["tags_bowspleef"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    "/img/icon/minecraft/bow.png", // Chip image
    "tntgames", // gamemode
  ];

  let wizardsList = [
    [getTranslation("games.modes.tntgames.wizards.new_ancientwizard"), "new_ancientwizard", `/img/icon/minecraft/magma_cream.${imageFileType}`],
    [getTranslation("games.modes.tntgames.wizards.arcane_wizard"), "arcane_wizard", `/img/icon/minecraft/disc_11.${imageFileType}`],
    [getTranslation("games.modes.tntgames.wizards.new_bloodwizard"), "new_bloodwizard", `/img/icon/minecraft/bone.${imageFileType}`],
    [getTranslation("games.modes.tntgames.wizards.new_firewizard"), "new_firewizard", `/img/icon/minecraft/blaze_rod.${imageFileType}`],
    [getTranslation("games.modes.tntgames.wizards.new_hydrowizard"), "new_hydrowizard", `/img/icon/minecraft/lapis_lazuli.${imageFileType}`],
    [getTranslation("games.modes.tntgames.wizards.new_icewizard"), "new_icewizard", `/img/icon/minecraft/diamond_hoe.${imageFileType}`],
    [getTranslation("games.modes.tntgames.wizards.new_kineticwizard"), "new_kineticwizard", `/img/icon/minecraft/iron_hoe.${imageFileType}`],
    [getTranslation("games.modes.tntgames.wizards.new_stormwizard"), "new_stormwizard", `/img/icon/minecraft/gold_sword.${imageFileType}`],
    [getTranslation("games.modes.tntgames.wizards.new_toxicwizard"), "new_toxicwizard", `/img/icon/minecraft/ghast_tear.${imageFileType}`],
    [getTranslation("games.modes.tntgames.wizards.new_witherwizard"), "new_witherwizard", `/img/icon/minecraft/gold_axe.${imageFileType}`],
  ];

  // Sort the list of wizards by item 0
  wizardsList.sort((a, b) => sortStrings(a[0], b[0]));

  wizardsList.unshift([getTranslation("games.modes.all.overall"), "overall", `/img/icon/minecraft/tnt.${imageFileType}`]); // Adds Overall to the front

  let totalWizardStats = sumStats(
    ["kills", "deaths", "healing", "damage_taken", "assists"],
    wizardsList.map((x) => x[1]),
    tntGamesStats,
    "_",
    false
  );

  allTNTWizardStats["overall"] = [
    [
      false,
      [
        getTranslation("statistics.overall_wins"),
        getGenericWinsPrefix({
          wins: tntGamesStats["wins_capture"],
          winsObject: tntGamesHighPrefixes,
          definedColor: tntGamesStats["prefix_capture"],
          useToGo: false,
        })["title"],
      ],
      [getTranslation("statistics.overall_captures"), checkAndFormat(tntGamesStats["points_capture"])],
    ],
    [false, [getTranslation("statistics.kills"), checkAndFormat(totalWizardStats[0])], [getTranslation("statistics.deaths"), checkAndFormat(totalWizardStats[1])], [getTranslation("statistics.kdr"), calculateRatio(totalWizardStats[0], totalWizardStats[1])]],
    [false, [getTranslation("statistics.damage_healed"), checkAndFormat(totalWizardStats[2] / 2) + ` ♥&#xFE0E;`], [getTranslation("statistics.damage_taken"), checkAndFormat(totalWizardStats[3] / 2) + ` ♥&#xFE0E;`], [getTranslation("statistics.assists"), checkAndFormat(tntGamesStats["assists_capture"])]],
  ];

  for (let a = 1; a < wizardsList.length; a++) {
    thisWizard = wizardsList[a][1];

    allTNTWizardStats[thisWizard] = [
      [
        false,
        [
          getTranslation("statistics.overall_wins"),
          getGenericWinsPrefix({
            wins: tntGamesStats["wins_capture"],
            winsObject: tntGamesHighPrefixes,
            definedColor: tntGamesStats["prefix_capture"],
            useToGo: false,
          })["title"],
        ],
        [getTranslation("statistics.overall_captures"), checkAndFormat(tntGamesStats["points_capture"])],
      ],
      [false, [getTranslation("statistics.kills"), checkAndFormat(tntGamesStats[thisWizard + "_kills"])], [getTranslation("statistics.deaths"), checkAndFormat(tntGamesStats[thisWizard + "_deaths"])], [getTranslation("statistics.kdr"), calculateRatio(tntGamesStats[thisWizard + "_kills"], tntGamesStats[thisWizard + "_deaths"])]],
      [false, [getTranslation("statistics.damage_healed"), checkAndFormat(tntGamesStats[thisWizard + "_healing"] / 2) + ` ♥&#xFE0E;`], [getTranslation("statistics.damage_taken"), checkAndFormat(tntGamesStats[thisWizard + "_damage_taken"] / 2) + ` ♥&#xFE0E;`], [getTranslation("statistics.assists"), checkAndFormat(tntGamesStats[thisWizard + "_assists"])]],
    ];
  }

  let wizardsCard = [
    "tntgames-stats-wizards", // ID
    "Wizards", // Title
    "", // Subtitle
    `/img/games/tntgames/wizards.${imageFileType}`, // Background image
    allTNTWizardStats["overall"], // Displayed stats
    wizardsList, // Other stats (shown in drop-down menu)
    "/img/icon/minecraft/blaze_rod.png", // Chip image
    "tntgames", // gamemode
  ];

  // Generate chips

  tntGamesChips = [tntRunCard, pvpRunCard, tntTagCard, bowSpleefCard, wizardsCard];
  generateChips(tntGamesChips, "tntgames-chips");

  minigameFragments["tntgames"] = minigameFragment;
  document.getElementById("games").appendChild(minigameFragment);
}

function generateArcade() {
  let minigameTemplate = `
      <!-- arcade stats -->
      <div class="chip-container" id="arcade-chips">
        <div class="chip-small but-big">
          <div class="chip-small-background-filter"></div>
          <p class="chip-small-title" data-t="games.arcade">Arcade</p>
          <div class="chip-small-container">
            <div class="flex-two-item align-top flippable margin10">
              <div class="card-big-stats">
                <p class="super-subtitle" data-t="games.modes.all.stats">Stats</p>
                <div class="chip-small-statistic-row">
                  <p><span data-t="statistics.wins">Wins</span> <span class="statistic" id="arcade-overall-wins"><span class="mc">Unknown</span></span></p>
                </div>
              </div>
              <div class="card-big-misc">
                <p class="super-subtitle" data-t="games.modes.all.misc">Misc</p>
                <div class="chip-small-statistic-row">
                  <p><span data-t="statistics.coins">Coins</span> <span class="statistic" id="arcade-overall-coins"><span class="mc">Unknown</span></span></p>
                </div>
              </div>
            </div>
          </div>
          <span class="general-button mright mtop" onclick="showCardWizard('ARCADE')" data-t="player.generate_card">Generate Card</span>
        </div>
        <div class="flex-two-item chip-container-duo-parent">
          <div id="arcade-chips-1" class="chip-container-duo">
          </div>
          <div id="arcade-chips-2" class="chip-container-duo">
          </div>
        </div>
    </div>`;

  let minigameFragment = setupMinigameContainer("flex-container-arcade", minigameTemplate);

  arcadeStats = playerData["stats"]["Arcade"] || {};
  let dropperStats = arcadeStats["dropper"] || {};
  let pixelPartyStats = arcadeStats["pixel_party"] || {};

  let easyWins = sumStatsBasic(["wins_dayone", "wins_oneinthequiver", "wins_dragonwars2", "wins_ender", "wins_farm_hunt", "wins_soccer", "sw_game_wins", "hider_wins_hide_and_seek", "seeker_wins_hide_and_seek", "wins_hole_in_the_wall", "wins_mini_walls", "wins_party", "wins_simon_says", "wins_draw_their_thing", "wins_throw_out", "wins_zombies", "wins_easter_simulator", "wins_halloween_simulator", "wins_santa_simulator", "wins_scuba_simulator", "wins_grinch_simulator_v2"], arcadeStats);

  updateScopedElement("arcade-overall-wins", checkAndFormat(easyWins + und(dropperStats["wins"]) + und(pixelPartyStats["wins"])), arcadeStats);
  updateScopedElement("arcade-overall-coins", checkAndFormat(arcadeStats["coins"]));

  // Blocking Dead
  let blockingDeadCard = [
    "arcade-stats-blockingdead", // ID
    getTranslation("games.modes.arcade.blockingdead"), // Title
    "", // Subtitle
    `/img/games/arcade/blockingdead.${imageFileType}`, // Background image
    [
      [false, [getTranslation("statistics.wins"), checkAndFormat(arcadeStats["wins_dayone"])]],
      [false, [getTranslation("statistics.kills"), checkAndFormat(arcadeStats["kills_dayone"])], [getTranslation("statistics.headshots"), checkAndFormat(arcadeStats["headshots_dayone"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    `/img/icon/minecraft/rotten_flesh.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  // Bounty Hunters
  let bountyHuntersCard = [
    "arcade-stats-bountyhunters", // ID
    getTranslation("games.modes.arcade.bountyhunters"), // Title
    "", // Subtitle
    `/img/games/arcade/bountyhunters.${imageFileType}`, // Background image
    [
      [false, [getTranslation("statistics.wins"), checkAndFormat(arcadeStats["wins_oneinthequiver"])]],
      [false, [getTranslation("statistics.kills"), checkAndFormat(arcadeStats["kills_oneinthequiver"])], [getTranslation("statistics.deaths"), checkAndFormat(arcadeStats["deaths_oneinthequiver"])], [getTranslation("statistics.kdr"), calculateRatio(arcadeStats["kills_oneinthequiver"], arcadeStats["deaths_oneinthequiver"])]],
      [false, [getTranslation("statistics.bounty_kills"), checkAndFormat(arcadeStats["bounty_kills_oneinthequiver"])], [getTranslation("statistics.bow_kills"), checkAndFormat(arcadeStats["bow_kills_oneinthequiver"])], [getTranslation("statistics.sword_kills"), checkAndFormat(arcadeStats["sword_kills_oneinthequiver"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    `/img/icon/minecraft/bow.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  // Creeper Attack
  let creeperAttackCard = [
    "arcade-stats-creeperattack", // ID
    getTranslation("games.modes.arcade.creeperattack"), // Title
    "", // Subtitle
    `/img/games/arcade/creeperattack.${imageFileType}`, // Background image
    [[false, [getTranslation("statistics.max_wave"), checkAndFormat(arcadeStats["max_wave"])]]], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    `/img/icon/minecraft/creeper_head.${imageFileType}`, // Chip image
  ];

  let dragonWarsCard = [
    "arcade-stats-dragonwars", // ID
    getTranslation("games.modes.arcade.dragonwars"), // Title
    "", // Subtitle
    `/img/games/arcade/dragonwars.${imageFileType}`, // Background image
    [
      [false, [getTranslation("statistics.wins"), checkAndFormat(arcadeStats["wins_dragonwars2"])]],
      [false, [getTranslation("statistics.kills"), checkAndFormat(arcadeStats["kills_dragonwars2"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    `/img/icon/minecraft/dragon_egg.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let dropperCard = [
    "arcade-stats-dropper", // ID
    getTranslation("games.modes.arcade.dropper"), // Title
    "", // Subtitle
    `/img/games/arcade/dropper.${imageFileType}`, // Background image
    [
      [false, [getTranslation("statistics.wins"), checkAndFormat(dropperStats["wins"])], [getTranslation("statistics.losses"), locale(und(dropperStats["games_played"]) - und(dropperStats["wins"]), 0)], [getTranslation("statistics.wlr"), calculateRatio(dropperStats["wins"], und(dropperStats["games_played"]) - und(dropperStats["wins"]))]],
      [false, [getTranslation("statistics.maps_completed"), checkAndFormat(dropperStats["maps_completed"])], [getTranslation("statistics.fails"), checkAndFormat(dropperStats["fails"])]],
      [false, [getTranslation("statistics.best_time"), smallDuration(dropperStats["fastest_game"] / 1000, true)], [getTranslation("statistics.flawless_games"), checkAndFormat(dropperStats["flawless_games"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    `/img/icon/minecraft/hopper.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let enderSpleefCard = [
    "arcade-stats-enderspleef", // ID
    getTranslation("games.modes.arcade.enderspleef"), // Title
    "", // Subtitle
    `/img/games/arcade/enderspleef.${imageFileType}`, // Background image
    [
      [false, [getTranslation("statistics.wins"), checkAndFormat(arcadeStats["wins_ender"])]],
      [false, [getTranslation("statistics.blocks_destroyed"), checkAndFormat(arcadeStats["blocks_destroyed_ender"])], [getTranslation("statistics.powerups"), checkAndFormat(arcadeStats["powerup_activations_ender"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    `/img/icon/minecraft/ender_pearl.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let farmHuntCard = [
    "arcade-stats-farmhunt", // ID
    getTranslation("games.modes.arcade.farmhunt"), // Title
    "", // Subtitle
    `/img/games/arcade/farmhunt.${imageFileType}`, // Background image
    [
      [false, [getTranslation("statistics.wins"), checkAndFormat(arcadeStats["wins_farm_hunt"])]],
      [false, [getTranslation("statistics.kills"), checkAndFormat(arcadeStats["kills_farm_hunt"])]],

      [false, [getTranslation("statistics.wins_animal"), checkAndFormat(arcadeStats["animal_wins_farm_hunt"])], [getTranslation("statistics.wins_hunter"), checkAndFormat(arcadeStats["hunter_wins_farm_hunt"])]],
      [false, [getTranslation("statistics.kills_animal"), checkAndFormat(arcadeStats["animal_kills_farm_hunt"])], [getTranslation("statistics.kills_hunter"), checkAndFormat(arcadeStats["hunter_kills_farm_hunt"])]],
      [false, [getTranslation("statistics.taunts"), checkAndFormat(arcadeStats["taunts_used_farm_hunt"])], [getTranslation("statistics.poop_collected"), checkAndFormat(arcadeStats["poop_collected_farm_hunt"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    `/img/icon/minecraft/sheep_spawn_egg.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let footballCard = [
    "arcade-stats-football", // ID
    getTranslation("games.modes.arcade.football"), // Title
    "", // Subtitle
    `/img/games/arcade/football.${imageFileType}`, // Background image
    [
      [false, [getTranslation("statistics.wins"), checkAndFormat(arcadeStats["wins_soccer"])]],
      [false, [getTranslation("statistics.goals"), checkAndFormat(arcadeStats["goals_soccer"])], [getTranslation("statistics.kicks"), checkAndFormat(arcadeStats["kicks_soccer"])], [getTranslation("statistics.power_kicks"), checkAndFormat(arcadeStats["powerkicks_soccer"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    `/img/icon/minecraft/head_football.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let galaxyWarsCard = [
    "arcade-stats-galaxywars", // ID
    getTranslation("games.modes.arcade.galaxywars"), // Title
    "", // Subtitle
    `/img/games/arcade/galaxywars.${imageFileType}`, // Background image
    [
      [false, [getTranslation("statistics.wins"), checkAndFormat(arcadeStats["sw_game_wins"])]],
      [false, [getTranslation("statistics.kills"), checkAndFormat(arcadeStats["sw_kills"])], [getTranslation("statistics.deaths"), checkAndFormat(arcadeStats["sw_deaths"])], [getTranslation("statistics.kdr"), calculateRatio(arcadeStats["sw_kills"], arcadeStats["sw_deaths"])]],
      [false, [getTranslation("statistics.kills_empire"), checkAndFormat(arcadeStats["sw_empire_kills"])], [getTranslation("statistics.kills_rebel"), checkAndFormat(arcadeStats["sw_rebel_kills"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu]
    `/img/icon/minecraft/firework_rocket.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let hideAndSeekCard = [
    "arcade-stats-hideandseek", // ID
    getTranslation("games.modes.arcade.hideandseek.category"), // Title
    "", // Subtitle
    `/img/games/arcade/hideandseek.${imageFileType}`, // Background image
    getArcadeHideAndSeekStats("overall"), // Displayed stats
    [
      [getTranslation("games.modes.all.overall"), "overall", `/img/icon/minecraft/blaze_rod.${imageFileType}`],
      [getTranslation("games.modes.arcade.hideandseek.party_pooper"), "party_pooper", `/img/icon/minecraft/tnt.${imageFileType}`],
      [getTranslation("games.modes.arcade.hideandseek.prop_hunt"), "prop_hunt", `/img/icon/minecraft/blaze_rod.${imageFileType}`],
    ], // Other stats (shown in drop-down menu]
    `/img/icon/minecraft/blaze_rod.${imageFileType}`, // Chip image
    "arcade_hide_and_seek", // gamemode
  ];

  let holeInTheWallCard = [
    "arcade-stats-holeinthewall", // ID
    getTranslation("games.modes.arcade.holeinthewall"), // Title
    "", // Subtitle
    `/img/games/arcade/holeinthewall.${imageFileType}`, // Background image
    [
      [false, [getTranslation("statistics.wins"), checkAndFormat(arcadeStats["wins_hole_in_the_wall"])]],
      [false, [getTranslation("statistics.walls"), checkAndFormat(arcadeStats["rounds_hole_in_the_wall"])]],
      [false, [getTranslation("statistics.record_qualifications"), checkAndFormat(arcadeStats["hitw_record_q"])], [getTranslation("statistics.record_finals"), checkAndFormat(arcadeStats["hitw_record_f"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu]
    `/img/icon/minecraft/bricks.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let hypixelSaysCard = [
    "arcade-stats-hypixelsays", // ID
    getTranslation("games.modes.arcade.hypixelsays"), // Title
    "", // Subtitle
    `/img/games/arcade/hypixelsays.${imageFileType}`, // Background image
    [
      [false, [getTranslation("statistics.wins"), locale(und(arcadeStats["wins_simon_says"]) + und(arcadeStats["wins_santa_says"]), 0)]],
      [false, [getTranslation("statistics.points"), locale(und(arcadeStats["rounds_simon_says"]) + und(arcadeStats["rounds_santa_says"]), 0)], [getTranslation("statistics.round_wins"), locale(und(arcadeStats["round_wins_simon_says"]) + und(arcadeStats["round_wins_santa_says"]), 0)], [getTranslation("statistics.highest_score"), locale(Math.max(und(arcadeStats["top_score_simon_says"]), und(arcadeStats["top_score_santa_says"])), 0)]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu]
    `/img/icon/minecraft/cookie.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let miniWallsCard = [
    "arcade-stats-miniwalls", // ID
    getTranslation("games.modes.arcade.miniwalls"), // Title
    "", // Subtitle
    `/img/games/arcade/miniwalls.${imageFileType}`, // Background image
    [
      [false, [getTranslation("statistics.wins"), checkAndFormat(arcadeStats["wins_mini_walls"])]],
      [false, [getTranslation("statistics.kills"), checkAndFormat(arcadeStats["kills_mini_walls"])], [getTranslation("statistics.deaths"), checkAndFormat(arcadeStats["deaths_mini_walls"])], [getTranslation("statistics.kdr"), calculateRatio(arcadeStats["kills_mini_walls"], arcadeStats["deaths_mini_walls"])]],
      [false, [getTranslation("statistics.final_kills"), checkAndFormat(arcadeStats["final_kills_mini_walls"])], [getTranslation("statistics.wither_kills"), checkAndFormat(arcadeStats["wither_kills_mini_walls"])], [getTranslation("statistics.wither_damage"), checkAndFormat(arcadeStats["wither_damage_mini_walls"] / 2) + ` ♥&#xFE0E;`]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu]
    `/img/icon/minecraft/head_miniwalls.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let partyGamesCard = [
    "arcade-stats-partygames", // ID
    getTranslation("games.modes.arcade.partygames"), // Title
    "", // Subtitle
    `/img/games/arcade/partygames.${imageFileType}`, // Background image
    [
      [false, [getTranslation("statistics.wins"), checkAndFormat(arcadeStats["wins_party"])]],
      [false, [getTranslation("statistics.round_wins"), checkAndFormat(arcadeStats["round_wins_party"])], [getTranslation("statistics.stars_earned"), checkAndFormat(arcadeStats["total_stars_party"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu]
    `/img/icon/minecraft/cake.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let pixelPaintersCard = [
    "arcade-stats-pixelpainters", // ID
    getTranslation("games.modes.arcade.pixelpainters"), // Title
    "", // Subtitle
    `/img/games/arcade/pixelpainters.${imageFileType}`, // Background image
    [[false, [getTranslation("statistics.wins"), checkAndFormat(arcadeStats["wins_draw_their_thing"])]]],
    [], // Other stats (shown in drop-down menu]
    `/img/icon/minecraft/pink_dye.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let pixelPartyCard = [
    "arcade-stats-pixelparty", // ID
    getTranslation("games.modes.arcade.pixelparty.category"), // Title
    "", // Subtitle
    `/img/games/arcade/pixelparty.${imageFileType}`, // Background image
    [
      [false, [getTranslation("statistics.wins"), checkAndFormat(pixelPartyStats["wins"])], [getTranslation("statistics.losses"), locale(und(pixelPartyStats["games_played"]) - und(pixelPartyStats["wins"]), 0)], [getTranslation("statistics.wlr"), calculateRatio(pixelPartyStats["wins"], und(pixelPartyStats["games_played"]) - und(pixelPartyStats["wins"]))]],
      [false, [getTranslation("statistics.rounds_completed"), checkAndFormat(pixelPartyStats["rounds_completed"])], [getTranslation("statistics.powerups"), checkAndFormat(pixelPartyStats["power_ups_collected"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu]
    `/img/icon/minecraft/disc_13.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let throwOutCard = [
    "arcade-stats-throwout", // ID
    getTranslation("games.modes.arcade.throwout"), // Title
    "", // Subtitle
    `/img/games/arcade/throwout.${imageFileType}`, // Background image
    [
      [false, [getTranslation("statistics.wins"), checkAndFormat(arcadeStats["wins_throw_out"])]],
      [false, [getTranslation("statistics.kills"), checkAndFormat(arcadeStats["kills_throw_out"])], [getTranslation("statistics.deaths"), checkAndFormat(arcadeStats["deaths_throw_out"])], [getTranslation("statistics.kdr"), calculateRatio(arcadeStats["kills_throw_out"], arcadeStats["deaths_throw_out"])]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu]
    `/img/icon/minecraft/snowball.${imageFileType}`, // Chip image
    "arcade", // gamemode
  ];

  let zombiesCard = [
    "arcade-stats-zombies", // ID
    getTranslation("games.modes.arcade.zombies.category"), // Title
    "", // Subtitle
    `/img/games/arcade/zombies.${imageFileType}`, // Background image
    getZombiesStats("overall"), // Displayed stats
    [
      [getTranslation("games.modes.all.overall"), "overall"],
      [getTranslation("games.modes.arcade.zombies.deadend"), "deadend"],
      [getTranslation("games.modes.arcade.zombies.badblood"), "badblood"],
      [getTranslation("games.modes.arcade.zombies.alienarcadium"), "alienarcadium"],
      [getTranslation("games.modes.arcade.zombies.prison"), "prison"],
    ], // Other stats (shown in drop-down menu]
    `/img/icon/minecraft/zombie_head.${imageFileType}`, // Chip image
    "arcade_zombies", // gamemode
  ];

  let seasonalCard = [
    "arcade-stats-seasonal", // ID
    getTranslation("games.modes.arcade.seasonal.category"), // Title
    "", // Subtitle
    `/img/games/404.${imageFileType}`, // Background image
    getArcadeSeasonalStats("overall"), // Displayed stats
    [
      [getTranslation("games.modes.all.overall"), "overall"],
      [getTranslation("games.modes.arcade.seasonal.grinch_simulator_v2"), "grinch_simulator_v2", `/img/icon/minecraft/head_grinchsimulator.${imageFileType}`],
      [getTranslation("games.modes.arcade.seasonal.easter_simulator"), "easter_simulator", `/img/icon/minecraft/head_easter.${imageFileType}`],
      [getTranslation("games.modes.arcade.seasonal.halloween_simulator"), "halloween_simulator", `/img/icon/minecraft/head_halloween.${imageFileType}`],
      [getTranslation("games.modes.arcade.seasonal.scuba_simulator"), "scuba_simulator", `/img/icon/minecraft/head_scubasimulator.${imageFileType}`],
      [getTranslation("games.modes.arcade.seasonal.santa_simulator"), "santa_simulator", `/img/icon/minecraft/head_santasimulator.${imageFileType}`],
    ], // Other stats (shown in drop-down menu]
    `/img/icon/minecraft/head_seasonal.${imageFileType}`, // Chip image
    "arcade_seasonal", // gamemode
  ];

  arcadeChips = [blockingDeadCard, bountyHuntersCard, creeperAttackCard, dragonWarsCard, dropperCard, enderSpleefCard, farmHuntCard, footballCard, galaxyWarsCard, hideAndSeekCard, holeInTheWallCard, hypixelSaysCard, miniWallsCard, partyGamesCard, pixelPaintersCard, pixelPartyCard, throwOutCard, zombiesCard, seasonalCard];

  generateChips(arcadeChips, "arcade-chips");

  minigameFragments["arcade"] = minigameFragment;
  document.getElementById("games").appendChild(minigameFragment);
}

function generatePit() {
  let minigameTemplate = `<div class="chip-container" id="pit-chips">
    <div class="chip-small but-big">
      <div class="chip-small-background-filter"></div>
      <p class="chip-small-title" data-t="games.pit">Pit</p>
      <div class="chip-small-container">
        <p class="margin10">
          <span data-t="statistics.level">Level</span> <span id="pit-prestige"><span class="mc">Unknown</span></span> <span id="pit-xp-to-go"></span>
        </p>
        <div class="progress-bar">
          <span class="progress-number" id="pit-progress-number"><span class="mc">Unknown</span></span>
          <div class="progress" style="width: 0%;" id="pit-progress-bar"></div>
        </div>
        <div class="flex-two-item align-top flippable margin10">
          <div class="card-big-stats">
            <p class="super-subtitle" data-t="games.modes.all.stats">Stats</p>
            <div class="chip-small-statistic-row">
                <p><span data-t="statistics.kills">Kills</span> <span class="statistic" id="pit-overall-kills"><span class="mc">Unknown</span></span></p>
                <p><span data-t="statistics.deaths">Deaths</span> <span class="statistic" id="pit-overall-deaths"><span class="mc">Unknown</span></span></p>
                <p><span data-t="statistics.kdr">K/D R</span> <span class="statistic" id="pit-overall-kdr"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.assists">Assists</span> <span class="statistic" id="pit-overall-assists"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.highest_killstreak">Highest Killstreak</span> <span class="statistic" id="pit-overall-highest-killstreak"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.damage_dealt">Damage Dealt</span> <span class="statistic" id="pit-overall-damage-dealt"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.damage_taken">Damage Taken</span> <span class="statistic" id="pit-overall-damage-taken"><span class="mc">Unknown</span></span></p>
            </div>
          </div>
          <div class="card-big-misc">
            <p class="super-subtitle" data-t="games.modes.all.misc">Misc</p>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.gold">Gold</span> <span class="statistic" id="pit-overall-gold"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.renown">Renown</span> <span class="statistic" id="pit-overall-renown"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.playtime">Playtime</span> <span class="statistic" id="pit-overall-playtime"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.joins">Joins</span> <span class="statistic" id="pit-overall-joins"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.left_clicks">Left Clicks</span> <span class="statistic" id="pit-overall-clicks"><span class="mc">Unknown</span></span></p>
              <p id="pit-overall-bounty-container" style="display: none">
                <span><span data-t="statistics.bounty">Bounty</span> <span class="statistic" id="pit-overall-bounty"><span class="mc">Unknown</span></span></span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <span class="general-button mright mtop" onclick="showCardWizard('PIT')" data-t="player.generate_card">Generate Card</span>
    </div>
    <div class="flex-two-item chip-container-duo-parent" id="buildbattle-chips">
      <div id="pit-chips-1" class="chip-container-duo">
      </div>
      <div id="pit-chips-2" class="chip-container-duo">
      </div>
    </div>
</div>`;
  let minigameFragment = setupMinigameContainer("flex-container-pit", minigameTemplate);

  pitStats = playerData["stats"]["Pit"] || {};
  pitProfileStats = pitStats["profile"] || {};
  pitPtlStats = pitStats["pit_stats_ptl"] || {};

  let pitPrestigeXp = [65950, 138510, 217680, 303430, 395760, 494700, 610140, 742040, 906930, 1104780, 1368580, 1698330, 2094030, 2555680, 3083280, 3676830, 4336330, 5127730, 6051030, 7106230, 8293330, 9612330, 11195130, 13041730, 15152130, 17526330, 20164330, 23132080, 26429580, 31375830, 37970830, 44631780, 51292730, 57953680, 64614630, 71275580, 84465580, 104250580, 130630580, 163605580, 213068080, 279018080, 361455580, 460380580, 575793080, 707693080, 905543080, 1235293080, 1894793080, 5192293080, 11787293080];

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

  updateScopedElement("pit-prestige", generateMinecraftText(pitXpToLevel(pitXp, 1)), true);
  updateScopedElement("pit-progress-number", `${Math.floor(pitXpProgress)}%`, true);
  activeScope.getElementById("pit-progress-bar").style.width = `${pitXpProgress}%`;

  updateScopedElement("pit-overall-gold", checkAndFormat(pitProfileStats["cash"]) + "g");
  updateScopedElement("pit-overall-kills", checkAndFormat(pitPtlStats["kills"]));
  updateScopedElement("pit-overall-assists", checkAndFormat(pitPtlStats["assists"]));
  updateScopedElement("pit-overall-deaths", checkAndFormat(pitPtlStats["deaths"]));
  updateScopedElement("pit-overall-kdr", calculateRatio(und(pitPtlStats["kills"]), und(pitPtlStats["deaths"])));
  updateScopedElement("pit-overall-playtime", smallDuration(und(pitPtlStats["playtime_minutes"]) * 60));
  updateScopedElement("pit-overall-joins", checkAndFormat(pitPtlStats["joins"]));
  updateScopedElement("pit-overall-renown", checkAndFormat(pitProfileStats["renown"]));
  updateScopedElement("pit-overall-clicks", checkAndFormat(pitPtlStats["left_clicks"]));
  updateScopedElement("pit-overall-highest-killstreak", checkAndFormat(pitPtlStats["max_streak"]));

  if (pitProfileStats["bounties"]) {
    bountySum = 0;
    for (let a = 0; a < pitProfileStats["bounties"].length; a++) {
      bountySum += pitProfileStats["bounties"][a]["amount"];
    }

    if (pitProfileStats["bounties"].length > 0) {
      // Only show bounty gold amount if the player has it
      updateScopedElement("pit-overall-bounty", checkAndFormat(bountySum) + "g");
      activeScope.getElementById("pit-overall-bounty-container").style.display = "block";
    }
  }

  updateScopedElement("pit-overall-damage-dealt", checkAndFormat(pitPtlStats["damage_dealt"] / 2) + " ♥\uFE0E");
  updateScopedElement("pit-overall-damage-taken", checkAndFormat(pitPtlStats["damage_received"] / 2) + " ♥\uFE0E");

  let combatChip = [
    "pit-combat",
    getTranslation("games.modes.pit.combat"),
    "",
    `/img/games/pit/combat.${imageFileType}`,
    [
      [false, [getTranslation("statistics.sword_hits"), checkAndFormat(pitPtlStats["sword_hits"])]],
      [false, [getTranslation("statistics.arrows_shot"), checkAndFormat(pitPtlStats["arrows_fired"])], [getTranslation("statistics.arrows_hit"), checkAndFormat(pitPtlStats["arrow_hits"])]],
      [false, [getTranslation("statistics.night_quests"), checkAndFormat(pitPtlStats["night_quests_completed"])]],
    ],
    [],
    ``,
  ];

  let performanceChip = [
    "pit-performance",
    getTranslation("games.modes.pit.performance"),
    "",
    `/img/games/pit/perfomance.${imageFileType}`,
    [
      [false, [getTranslation("statistics.xp"), checkAndFormat(pitProfileStats["xp"])], [getTranslation("statistics.lifetime_gold"), checkAndFormat(pitPtlStats["cash_earned"]) + "g"]],
      [false, [getTranslation("statistics.contracts_started"), checkAndFormat(pitPtlStats["contracts_started"])], [getTranslation("statistics.contracts_completed"), checkAndFormat(pitPtlStats["contracts_completed"])]],
    ],
    [],
    ``,
  ];

  let perkChip = [
    "pit-perks",
    getTranslation("games.modes.pit.perks"),
    "",
    `/img/games/pit/perks.${imageFileType}`,
    [
      [false, [getTranslation("statistics.golden_apples_eaten"), checkAndFormat(pitPtlStats["gapple_eaten"])], [getTranslation("statistics.golden_heads_eaten"), checkAndFormat(pitPtlStats["ghead_eaten"])]],
      [false, [getTranslation("statistics.blocks_placed"), checkAndFormat(pitPtlStats["blocks_placed"])], [getTranslation("statistics.blocks_broken"), checkAndFormat(pitPtlStats["blocks_broken"])]],
      [false, [getTranslation("statistics.fishing_rod_launches"), checkAndFormat(pitPtlStats["fishing_rod_launched"])], [getTranslation("statistics.lava_bucket_empties"), checkAndFormat(pitPtlStats["lava_bucket_emptied"])]],
      [false, [getTranslation("statistics.soups_drank"), checkAndFormat(pitPtlStats["soups_drank"])]],
    ],
    [],
    ``,
  ];

  let mysticsChip = [
    "pit-mystics",
    getTranslation("games.modes.pit.mystics"),
    "",
    `/img/games/pit/mystics.${imageFileType}`,
    [
      [false, [getTranslation("statistics.mystics_enchanted"), locale(sumStatsBasic(["enchanted_tier1", "enchanted_tier2", "enchanted_tier3"], pitPtlStats), 0)], [getTranslation("statistics.dark_pants_created"), checkAndFormat(pitPtlStats["dark_pants_crated"])]],
      [false, [getTranslation("statistics.tier_1s"), checkAndFormat(pitPtlStats["enchanted_tier1"])], [getTranslation("statistics.tier_2s"), checkAndFormat(pitPtlStats["enchanted_tier2"])], [getTranslation("statistics.tier_3s"), checkAndFormat(pitPtlStats["enchanted_tier3"])]],
    ],
    [],
    ``,
  ];

  let farmingChip = [
    "pit-farming",
    getTranslation("games.modes.pit.farming"),
    "",
    `/img/games/pit/farming.${imageFileType}`,
    [
      [false, [getTranslation("statistics.wheat_farmed"), checkAndFormat(pitPtlStats["wheat_farmed"])]],
      [false, [getTranslation("statistics.items_fished"), checkAndFormat(pitPtlStats["fished_anything"])], [getTranslation("statistics.fish_fished"), checkAndFormat(pitPtlStats["fishes_fished"])]],
    ],
    [],
    ``,
  ];

  let miscChip = [
    "pit-misc",
    getTranslation("games.modes.pit.misc"),
    "",
    `/img/games/pit/miscellaneous.${imageFileType}`,
    [
      [false, [getTranslation("statistics.chat_messages"), checkAndFormat(pitPtlStats["chat_messages"])], [getTranslation("statistics.ingots_picked_up"), checkAndFormat(pitPtlStats["ingots_picked_up"])]],
      [false, [getTranslation("statistics.jumps_into_pit"), checkAndFormat(pitPtlStats["jumped_into_pit"])], [getTranslation("statistics.launcher_launches"), locale(sumStatsBasic(["launched_by_launchers", "launched_by_angel_spawn", "launched_by_demon_spawn"], pitPtlStats), 0)]],
      [false, [getTranslation("statistics.sewer_treasures"), checkAndFormat(pitPtlStats["sewer_treasures_found"])], [getTranslation("statistics.kings_quest_completions"), checkAndFormat(pitPtlStats["king_quest_completion"])]],
    ],
    [],
    ``,
  ];

  let pitChips = [combatChip, performanceChip, perkChip, mysticsChip, farmingChip, miscChip];
  generateChips(pitChips, "pit-chips");

  minigameFragments["pit"] = minigameFragment;
  document.getElementById("games").appendChild(minigameFragment);
}

function generateClassic() {
  let minigameTemplate = `<div class="chip-container" id="classic-chips">
    <div class="chip-small but-big">
      <div class="chip-small-background-filter"></div>
      <p class="chip-small-title" data-t="games.classic">Classic Games</p>
      <div class="chip-small-container">
        <div class="flex-two-item align-top flippable margin10">
          <div class="card-big-stats">
            <p class="super-subtitle" data-t="games.modes.all.stats">Stats</p>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.wins">Wins</span> <span class="statistic" id="classic-overall-wins"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.kills">Kills</span> <span class="statistic" id="classic-overall-kills"><span class="mc">Unknown</span></span></p>
            </div>
          </div>
          <div class="card-big-misc">
            <p class="super-subtitle" data-t="games.modes.all.misc">Misc</p>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.classic_tokens">Classic Tokens</span> <span class="statistic" id="classic-overall-tokens"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.lifetime_tokens">Lifetime Tokens</span> <span class="statistic" id="classic-overall-total_tokens"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.playtime">Playtime</span> <span class="statistic" id="classic-overall-playtime"><span class="mc">Unknown</span></span></p>
            </div>
          </div>
        </div>
      </div>
      <span class="general-button mright mtop" onclick="showCardWizard('CLASSIC')" data-t="player.generate_card">Generate Card</span>
    </div>
    <div class="flex-two-item chip-container-duo-parent">
      <div id="classic-chips-1" class="chip-container-duo">
      </div>
      <div id="classic-chips-2" class="chip-container-duo">
      </div>
    </div>
</div>`;

  let minigameFragment = setupMinigameContainer("flex-container-classic", minigameTemplate);

  classicStats = playerData["stats"]["Legacy"] || {};
  arenaStats = playerData["stats"]["Arena"] || {};
  paintballStats = playerData["stats"]["Paintball"] || {};
  quakeStats = playerData["stats"]["Quake"] || {};
  vampireZStats = playerData["stats"]["VampireZ"] || {};
  tkrStats = playerData["stats"]["GingerBread"] || {};
  wallsStats = playerData["stats"]["Walls"] || {};

  updateScopedElement("classic-overall-wins", checkAndFormat(und(arenaStats["wins"]) + und(paintballStats["wins"]) + und(quakeStats["wins"]) + und(vampireZStats["wins_human"]) + und(vampireZStats["wins_vampire"]) + und(tkrStats["wins"]) + und(wallsStats["wins"])));
  updateScopedElement("classic-overall-kills", checkAndFormat(und(arenaStats["kills_1v1"]) + und(arenaStats["kills_2v2"]) + und(arenaStats["kills_4v4"]) + und(paintballStats["kills"]) + und(quakeStats["kills"]) + und(quakeStats["kills_teams"]) + und(vampireZStats["human_kills"]) + und(vampireZStats["vampire_kills"]) + und(wallsStats["kills"])));
  updateScopedElement("classic-overall-tokens", checkAndFormat(classicStats["tokens"]));
  updateScopedElement("classic-overall-total_tokens", checkAndFormat(classicStats["total_tokens"]));
  updateScopedElement("classic-overall-playtime", smallDuration(sumStatsBasic(["arena_tokens", "gingerbread_tokens", "walls_tokens", "quakecraft_tokens", "paintball_tokens", "vampirez_tokens"], classicStats) * 120));

  let arenaChip = [
    "classic-arena",
    getTranslation("games.arena"),
    ``,
    `/img/games/classic/arenabrawl.${imageFileType}`,
    getArenaBrawlStats("overall"),
    [
      [getTranslation("games.modes.all.overall"), "overall"],
      [getTranslation("games.modes.classic.arena.1v1"), "1v1"],
      [getTranslation("games.modes.classic.arena.2v2"), "2v2"],
      [getTranslation("games.modes.classic.arena.4v4"), "4v4"],
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
    getTranslation("games.paintball"),
    ``,
    `/img/games/classic/paintball.${imageFileType}`,
    [
      [false, [getTranslation("statistics.coins"), checkAndFormat(paintballStats["coins"])]],
      [false, [getTranslation("statistics.wins"), checkAndFormat(paintballStats["wins"])]],
      [false, [getTranslation("statistics.kills"), getPaintballTitle(paintballStats["kills"], paintballStats["prefix_color"])], [getTranslation("statistics.deaths"), checkAndFormat(paintballStats["deaths"])], [getTranslation("statistics.kdr"), calculateRatio(paintballStats["kills"], paintballStats["deaths"])]],
      [false, [getTranslation("statistics.shots"), checkAndFormat(paintballStats["shots_fired"])], [getTranslation("statistics.killstreaks"), checkAndFormat(paintballStats["killstreaks"])]],
    ],
    [],
    `/img/icon/minecraft/snowball.${imageFileType}`,
    "paintball",
  ];

  let tkrChip = [
    "classic-tkr",
    getTranslation("games.tkr"),
    "",
    `/img/games/classic/tkr.${imageFileType}`,
    getTKRStats("overall"),
    [
      [getTranslation("games.modes.all.overall"), "overall"],
      [getTranslation("games.modes.classic.tkr.canyon"), "canyon"],
      [getTranslation("games.modes.classic.tkr.hypixelgp"), "hypixelgp"],
      [getTranslation("games.modes.classic.tkr.junglerush"), "junglerush"],
      [getTranslation("games.modes.classic.tkr.olympus"), "olympus"],
      [getTranslation("games.modes.classic.tkr.retro"), "retro"],
    ],
    `/img/icon/minecraft/minecart.${imageFileType}`,
    "tkr",
  ];

  let quakecraftChip = [
    "classic-quakecraft",
    getTranslation("games.quakecraft"),
    "",
    `/img/games/classic/quakecraft.${imageFileType}`,
    getQuakeStats("overall"),
    [
      [getTranslation("games.modes.all.overall"), "overall"],
      [getTranslation("games.modes.classic.quakecraft.solo"), ""],
      [getTranslation("games.modes.classic.quakecraft.teams"), "_teams"],
    ],
    `/img/icon/minecraft/firework_rocket.${imageFileType}`,
    "quake",
  ];

  let vampireZChip = [
    "classic-vampirez",
    getTranslation("games.vampirez"),
    ``,
    `/img/games/classic/vampirez.${imageFileType}`,
    getVampireZStats("human"),
    [
      [getTranslation("games.modes.classic.vampirez.human"), "human"],
      [getTranslation("games.modes.classic.vampirez.vampire"), "vampire"],
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
    getTranslation("games.walls"),
    "",
    `/img/games/classic/walls.${imageFileType}`,
    [
      [false, [getTranslation("statistics.coins"), checkAndFormat(wallsStats["coins"])]],
      [
        false,
        [
          getTranslation("statistics.wins"),
          getGenericWinsPrefix({
            wins: wallsStats["wins"],
            winsObject: wallsTitles,
            useToGo: false,
          })["title"],
        ],
        [getTranslation("statistics.losses"), checkAndFormat(wallsStats["losses"])],
        [getTranslation("statistics.wlr"), calculateRatio(wallsStats["wins"], wallsStats["losses"])],
      ],
      [false, [getTranslation("statistics.kills"), checkAndFormat(wallsStats["kills"])], [getTranslation("statistics.deaths"), checkAndFormat(wallsStats["deaths"])], [getTranslation("statistics.kdr"), calculateRatio(wallsStats["kills"], wallsStats["deaths"])]],
      [false, [getTranslation("statistics.assists"), checkAndFormat(wallsStats["assists"])]],
    ],
    [],
    `/img/icon/minecraft/sand.${imageFileType}`,
    "walls",
  ];

  let classicChips = [arenaChip, paintballChip, quakecraftChip, tkrChip, vampireZChip, wallsChip];
  generateChips(classicChips, "classic-chips");

  minigameFragments["classic"] = minigameFragment;
  document.getElementById("games").appendChild(minigameFragment);
}

function generateCopsAndCrims() {
  let minigameTemplate = `<div class="chip-container" id="copsandcrims-chips">
    <div class="chip-small but-big">
      <div class="chip-small-background-filter"></div>
      <p class="chip-small-title" data-t="games.copsandcrims">Cops and Crims</p>
      <div class="chip-small-container">
        <p class="margin10" id="copsandcrims-level-container">
          <span data-t="statistics.level">Level</span> <span class="statistic" id="copsandcrims-level"><span class="mc">Unknown</span></span><span id="copsandcrims-emblem"></span>
        </p>
        <div class="progress-bar" id="copsandcrims-progress-bar-container">
          <span class="progress-number" id="copsandcrims-progress-number"><span class="mc">Unknown</span></span>
          <div class="progress" style="width: 0%;" id="copsandcrims-progress-bar"></div>
        </div>
        <div class="flex-two-item align-top flippable margin10">
          <div class="card-big-stats">
            <p class="super-subtitle" data-t="games.modes.all.stats">Stats</p>
            <div class="chip-small-statistic-row">
                <p><span data-t="statistics.wins">Wins</span> <span class="statistic" id="copsandcrims-overall-game_wins"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.kills">Kills</span> <span class="statistic" id="copsandcrims-overall-kills"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.deaths">Deaths</span> <span class="statistic" id="copsandcrims-overall-deaths"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.kdr">K/D R</span> <span class="statistic" id="copsandcrims-overall-kdr"><span class="mc">Unknown</span></span></p>
            </div>
          </div>
          <div class="card-big-misc">
            <p class="super-subtitle" data-t="games.modes.all.misc">Misc</p>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.coins">Coins</span> <span class="statistic" id="copsandcrims-overall-coins"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.assists">Assists</span> <span class="statistic" id="copsandcrims-overall-assists"><span class="mc">Unknown</span></span></p>
          </div>
        </div>
      </div>
    </div>
    <span class="general-button mright mtop" onclick="showCardWizard('COPSANDCRIMS')" data-t="player.generate_card">Generate Card</span>
  </div>
    <div class="flex-two-item chip-container-duo-parent">
      <div id="copsandcrims-chips-1" class="chip-container-duo">
      </div>
      <div id="copsandcrims-chips-2" class="chip-container-duo">
      </div>
    </div>
</div>`;
  let minigameFragment = setupMinigameContainer("flex-container-copsandcrims", minigameTemplate);

  copsAndCrimsStats = playerData["stats"]["MCGO"] || {};

  let easyStats = ["game_wins", "kills", "deaths", "assists"];

  let copsAndCrimsBasicStats = sumStats(easyStats, ["", "_gungame", "_deathmatch"], copsAndCrimsStats, "", true);

  for (let e = 0; e < easyStats.length; e++) {
    updateScopedElement(`copsandcrims-overall-${easyStats[e]}`, checkAndFormat(copsAndCrimsBasicStats[e]));
  }

  let copsAndCrimsEmblems = {
    emblem_rookie: {
      source: "unicode",
      character: "▶",
    },
    emblem_incomplete: {
      source: "resourcepack",
      positions: [[4, 1]],
    },
    emblem_complete: {
      source: "resourcepack",
      positions: [[5, 1]],
    },
    emblem_decoy: {
      source: "resourcepack",
      positions: [[10, 1]],
    },
    emblem_frown: {
      source: "unicode",
      character: "☹",
    },
    emblem_gem: {
      source: "unicode",
      character: "♦",
    },
    emblem_spaceship: {
      source: "unicode",
      character: "⥈",
    },
    emblem_target: {
      source: "unicode",
      character: "⦾",
    },
    emblem_biohazard: {
      source: "unicode",
      character: "☣",
    },
    emblem_infinite: {
      source: "unicode",
      character: "∞",
    },
    emblem_lucky: {
      source: "unicode",
      character: "☘",
    },
    emblem_warning: {
      source: "unicode",
      character: "\u26a0\ufe0e",
    },
    emblem_trident: {
      source: "unicode",
      character: "♆",
    },
    emblem_star: {
      source: "unicode",
      character: "✰",
    },
    emblem_right_angle: {
      source: "unicode",
      character: "⧉",
    },
    emblem_balance: {
      source: "unicode",
      character: "☯",
    },
    emblem_ballista: {
      source: "unicode",
      character: "\u269c\ufe0e",
    },
    emblem_broken_bones: {
      source: "resourcepack",
      positions: [
        [1, 1],
        [2, 1],
      ],
    },
    emblem_budding: {
      source: "unicode",
      character: "✿",
    },
    emblem_cheeky: {
      source: "unicode",
      character: "ツ",
    },
    emblem_ghoul: {
      source: "unicode",
      character: "ௐ",
    },
    emblem_phone: {
      source: "unicode",
      character: "✆",
    },
    emblem_surrender: {
      source: "unicode",
      character: "⚑",
    },
    emblem_serious: {
      source: "unicode",
      character: "ಠ_ಠ",
    },
    emblem_helmet: {
      source: "resourcepack",
      positions: [[13, 1]],
    },
    emblem_armor: {
      source: "resourcepack",
      positions: [[12, 1]],
    },
    emblem_knife: {
      source: "resourcepack",
      positions: [[15, 0]],
    },
    emblem_smg: {
      source: "resourcepack",
      positions: [[2, 0]],
    },
    emblem_pistol: {
      source: "resourcepack",
      positions: [[0, 0]],
    },
    emblem_bullpup: {
      source: "resourcepack",
      positions: [
        [2, 3],
        [3, 3],
      ],
    },
    emblem_scopedRifle: {
      source: "resourcepack",
      positions: [
        [6, 3],
        [7, 3],
      ],
    },
    emblem_augoShotgun: {
      source: "resourcepack",
      positions: [
        [10, 3],
        [11, 3],
      ],
    },
    emblem_handgun: {
      source: "resourcepack",
      positions: [[14, 3]],
    },
    emblem_sniper: {
      source: "resourcepack",
      positions: [
        [10, 0],
        [11, 0],
      ],
    },
    emblem_magnum: {
      source: "resourcepack",
      positions: [[1, 0]],
    },
    emblem_carbine: {
      source: "resourcepack",
      positions: [
        [6, 0],
        [7, 0],
      ],
    },
    emblem_rifle: {
      source: "resourcepack",
      positions: [
        [8, 0],
        [9, 0],
      ],
    },
    emblem_shotgun: {
      source: "resourcepack",
      positions: [
        [4, 0],
        [5, 0],
      ],
    },
    emblem_crims: {
      source: "resourcepack",
      positions: [[1, 3]],
    },
    emblem_cops: {
      source: "resourcepack",
      positions: [[0, 3]],
    },
    emblem_grenade: {
      source: "resourcepack",
      positions: [[12, 0]],
    },
    emblem_firebomb: {
      source: "resourcepack",
      positions: [[9, 1]],
    },
    emblem_hp: {
      source: "resourcepack",
      positions: [[0, 2]],
    },
    emblem_cargo: {
      source: "unicode",
      character: "⧈",
    },
    emblem_headshot: {
      source: "resourcepack",
      positions: [[0, 1]],
    },
    emblem_c4: {
      source: "resourcepack",
      positions: [[6, 1]],
    },
    emblem_fire: {
      source: "resourcepack",
      positions: [[3, 1]],
    },
    emblem_landing_pad: {
      source: "unicode",
      character: "✥",
    },
    emblem_double_star: {
      source: "unicode",
      character: "⁑",
    },
    emblem_wire_cutters: {
      source: "resourcepack",
      positions: [[11, 1]],
    },
    emblem_peace: {
      source: "unicode",
      character: "✌",
    },
    emblem_airstrike: {
      source: "unicode",
      character: "✈",
    },
    emblem_shield: {
      source: "unicode",
      character: "❂",
    },
    emblem_bullet: {
      source: "unicode",
      character: "✏",
    },
    emblem_raining_bullets: {
      source: "unicode",
      character: "☂",
    },
    emblem_radar: {
      source: "resourcepack",
      positions: [[13, 0]],
    },
    emblem_triple_star: {
      source: "unicode",
      character: "⁂",
    },
    emblem_smoke: {
      source: "resourcepack",
      positions: [[8, 1]],
    },
    emblem_flare: {
      source: "unicode",
      character: "҉",
    },
    emblem_death: {
      source: "unicode",
      character: "☠",
    },
    emblem_lightning: {
      source: "unicode",
      character: "\u26a1\ufe0e",
    },
    emblem_king: {
      source: "unicode",
      character: "♔",
    },
    emblem_num_one: {
      source: "unicode",
      character: "❶",
    },
    emblem_rage: {
      source: "unicode",
      character: "(╯°□°)╯",
    },
  };

  let copsAndCrimsEmblemName = copsAndCrimsStats["active_emblem"] || "emblem_rookie";
  let copsAndCrimsEmblemData = copsAndCrimsEmblems[copsAndCrimsEmblemName] || copsAndCrimsEmblems["emblem_rookie"];
  let copsAndCrimsEmblemScheme = copsAndCrimsStats["active_scheme"] || "scheme_gray";
  let copsAndCrimsEmblemColorName;

  if (copsAndCrimsEmblemScheme.indexOf("scheme_") == -1) {
    copsAndCrimsEmblemColorName = "GRAY";
  } else {
    copsAndCrimsEmblemColorName = copsAndCrimsEmblemScheme.replace("scheme_", "").toUpperCase();
  }

  let copsAndCrimsEmblemColorCode;

  if (copsAndCrimsEmblemColorName != "CHROMA") {
    copsAndCrimsEmblemColorCode = (minecraftColorCodes[copsAndCrimsEmblemColorName] || "§7").replace("§", "");
    activeScope.getElementById("copsandcrims-emblem").classList.add(`m${copsAndCrimsEmblemColorCode}`);

    if (copsAndCrimsEmblemColorCode == "0" || copsAndCrimsEmblemColorCode == "1") {
      activeScope.getElementById("copsandcrims-emblem").classList.add("drop-shadowf");
    }
  }

  function getEmblemColorCodeAtPosition(position) {
    if (copsAndCrimsEmblemColorName == "CHROMA") {
      let chromaRainbow = ["c", "e", "a", "b", "d"];

      return chromaRainbow[position % chromaRainbow.length];
    } else {
      return copsAndCrimsEmblemColorCode;
    }
  }

  if (copsAndCrimsEmblemData["source"] == "unicode") {
    let copsAndCrimsEmblemNameFormatted = "";
    for (let a = 0; a < copsAndCrimsEmblemData["character"].length; a++) {
      copsAndCrimsEmblemNameFormatted += `§${getEmblemColorCodeAtPosition(a + 2)}${copsAndCrimsEmblemData["character"][a]}`;
    }
    updateScopedElement("copsandcrims-emblem", generateMinecraftText(copsAndCrimsEmblemNameFormatted), true);
  } else if (copsAndCrimsEmblemData["source"] == "resourcepack") {
    for (let a = 0; a < copsAndCrimsEmblemData["positions"].length; a++) {
      let emblemCharacter = document.createElement("span");
      emblemCharacter.classList.add("copsandcrims-emblem-character");

      emblemCharacter.style.maskPositionX = `-${copsAndCrimsEmblemData["positions"][a][0] * 16}px`;
      emblemCharacter.style.maskPositionY = `-${copsAndCrimsEmblemData["positions"][a][1] * 16}px`;
      emblemCharacter.classList.add(`b-m${getEmblemColorCodeAtPosition(a + 2)}`);

      activeScope.getElementById("copsandcrims-emblem").appendChild(emblemCharacter);
    }
  }

  let copsAndCrimsScore = und(copsAndCrimsStats["score"] || copsAndCrimsBasicStats[1] / 2 + (und(copsAndCrimsStats["bombs_defused"]) + und(copsAndCrimsStats["bombs_planted"])) / 3 + copsAndCrimsBasicStats[0]); // Calculating the score based on the formula in-game. It's off by like 1%

  let copsAndCrimsLevel = getCopsAndCrimsLevel(copsAndCrimsScore);
  let copsAndCrimsLevelProgress = copsAndCrimsLevel % 1;

  if (copsAndCrimsEmblemColorName != "CHROMA") {
    updateScopedElement("copsandcrims-level", Math.floor(copsAndCrimsLevel));
  } else {
    let copsAndCrimsLevelString = Math.floor(copsAndCrimsLevel).toString();
    updateScopedElement("copsandcrims-level", generateMinecraftText(`§${getEmblemColorCodeAtPosition(0)}${copsAndCrimsLevelString[0]}§${getEmblemColorCodeAtPosition(1)}${copsAndCrimsLevelString[1]}`), true); // This will break if Cops and Crims ever introduces a level higher than 99. But that's unlikely, so I will not fix this
  }

  activeScope.getElementById("copsandcrims-level").classList.add(`m${copsAndCrimsEmblemColorCode}`);
  if (copsAndCrimsEmblemColorCode == "0" || copsAndCrimsEmblemColorCode == "1") {
    activeScope.getElementById("copsandcrims-level").classList.add("shadowf");
  }

  if (copsAndCrimsLevel >= 50) {
    activeScope.getElementById("copsandcrims-progress-bar-container").style.display = "none";
  }

  updateScopedElement("copsandcrims-progress-number", `${Math.floor(copsAndCrimsLevelProgress * 100)}%`, true);
  activeScope.getElementById("copsandcrims-progress-bar").style.width = `${copsAndCrimsLevelProgress * 100}%`;

  updateScopedElement("copsandcrims-overall-kdr", calculateRatio(copsAndCrimsBasicStats[1], copsAndCrimsBasicStats[2]));
  updateScopedElement("copsandcrims-overall-coins", checkAndFormat(copsAndCrimsStats["coins"]));

  let defusalChip = [
    "copsandcrims-defusal",
    getTranslation("games.modes.copsandcrims.defusal"),
    "",
    `/img/games/copsandcrims/defusal.${imageFileType}`,
    [
      [false, [getTranslation("statistics.wins"), checkAndFormat(copsAndCrimsStats["game_wins"])]],
      [false, [getTranslation("statistics.kills"), checkAndFormat(copsAndCrimsStats["kills"])], [getTranslation("statistics.deaths"), checkAndFormat(copsAndCrimsStats["deaths"])], [getTranslation("statistics.kdr"), calculateRatio(copsAndCrimsStats["kills"], copsAndCrimsStats["deaths"])]],
      [false, [getTranslation("statistics.assists"), checkAndFormat(copsAndCrimsStats["assists"])], [getTranslation("statistics.headshot_kills"), checkAndFormat(copsAndCrimsStats["headshot_kills"])], [getTranslation("statistics.shots"), checkAndFormat(copsAndCrimsStats["shots_fired"])]],
      [false, [getTranslation("statistics.bombs_defused"), checkAndFormat(copsAndCrimsStats["bombs_defused"])], [getTranslation("statistics.bombs_planted"), checkAndFormat(copsAndCrimsStats["bombs_planted"])], [getTranslation("statistics.round_wins"), checkAndFormat(copsAndCrimsStats["round_wins"])]],
    ],
    [],
    ``,
    "copsandcrims",
  ];

  let deathmatchChip = [
    "copsandcrims-deathmatch",
    getTranslation("games.modes.copsandcrims.deathmatch"),
    "",
    `/img/games/copsandcrims/teamdeathmatch.${imageFileType}`,
    [
      [false, [getTranslation("statistics.wins"), checkAndFormat(copsAndCrimsStats["game_wins_deathmatch"])]],
      [false, [getTranslation("statistics.kills"), checkAndFormat(copsAndCrimsStats["kills_deathmatch"])], [getTranslation("statistics.deaths"), checkAndFormat(copsAndCrimsStats["deaths_deathmatch"])], [getTranslation("statistics.kdr"), calculateRatio(copsAndCrimsStats["kills_deathmatch"], copsAndCrimsStats["deaths_deathmatch"])]],
      [false, [getTranslation("statistics.assists"), checkAndFormat(copsAndCrimsStats["assists_deathmatch"])]],
    ],
    [],
    ``,
    "copsandcrims",
  ];

  let gunGameChip = [
    "copsandcrims-gungame",
    getTranslation("games.modes.copsandcrims.gungame"),
    "",
    `/img/games/copsandcrims/gungame.${imageFileType}`,
    [
      [false, [getTranslation("statistics.wins"), checkAndFormat(copsAndCrimsStats["game_wins_gungame"])]],
      [false, [getTranslation("statistics.kills"), checkAndFormat(copsAndCrimsStats["kills_gungame"])], [getTranslation("statistics.deaths"), checkAndFormat(copsAndCrimsStats["deaths_gungame"])], [getTranslation("statistics.kdr"), calculateRatio(copsAndCrimsStats["kills_gungame"], copsAndCrimsStats["deaths_gungame"])]],
      [false, [getTranslation("statistics.assists"), checkAndFormat(copsAndCrimsStats["assists_gungame"])], [getTranslation("statistics.fastest_win"), smallDuration(copsAndCrimsStats["game_wins_gungame"] > 0 ? copsAndCrimsStats["fastest_win_gungame"] / 1000 : -1, true)]],
    ],
    [],
    ``,
    "copsandcrims",
  ];

  let gunsChip = [
    "copsandcrims-guns",
    getTranslation("games.modes.copsandcrims.guns.category"),
    "",
    `/img/games/404.${imageFileType}`,
    getCopsAndCrimsGunStats("autoShotgun"),
    [
      [getTranslation("games.modes.copsandcrims.guns.autoShotgun"), "autoShotgun"],
      [getTranslation("games.modes.copsandcrims.guns.bullpup"), "bullpup"],
      [getTranslation("games.modes.copsandcrims.guns.carbine"), "carbine"],
      [getTranslation("games.modes.copsandcrims.guns.handgun"), "handgun"],
      [getTranslation("games.modes.copsandcrims.guns.magnum"), "magnum"],
      [getTranslation("games.modes.copsandcrims.guns.pistol"), "pistol"],
      [getTranslation("games.modes.copsandcrims.guns.rifle"), "rifle"],
      [getTranslation("games.modes.copsandcrims.guns.scopedRifle"), "scopedRifle"],
      [getTranslation("games.modes.copsandcrims.guns.shotgun"), "shotgun"],
      [getTranslation("games.modes.copsandcrims.guns.smg"), "smg"],
      [getTranslation("games.modes.copsandcrims.guns.sniper"), "sniper"],
    ],
    ``,
    "copsandcrims_guns",
  ];

  let copsAndCrimsChips = [defusalChip, deathmatchChip, gunGameChip, gunsChip];
  generateChips(copsAndCrimsChips, "copsandcrims-chips");

  minigameFragments["copsandcrims"] = minigameFragment;
  document.getElementById("games").appendChild(minigameFragment);
}

function getCopsAndCrimsGunStats(gun) {
  return [[false, [getTranslation("statistics.kills"), checkAndFormat(copsAndCrimsStats[`${gun}Kills`])], [getTranslation("statistics.headshots"), checkAndFormat(copsAndCrimsStats[`${gun}Headshots`])]]];
}

function generateBlitz() {
  let minigameTemplate = `<div class="chip-container">
    <div class="chip-small but-big">
      <div class="chip-small-background-filter"></div>
      <p class="chip-small-title" data-t="games.blitz">Blitz SG</p>
      <div class="chip-small-container">
        <div class="flex-two-item align-top flippable margin10">
          <div class="card-big-stats">
            <p class="super-subtitle" data-t="games.modes.all.stats">Stats</p>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.wins">Wins</span> <span class="statistic" id="blitz-overall-wins"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.kills">Kills</span> <span class="statistic" id="blitz-overall-kills"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.deaths">Deaths</span> <span class="statistic" id="blitz-overall-deaths"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.kdr">K/D R</span> <span class="statistic" id="blitz-overall-kdr"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.wins_solo">Wins (Solo)</span> <span class="statistic" id="blitz-overall-wins_solo_normal"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.wins_teams">Wins (Teams)</span> <span class="statistic" id="blitz-overall-wins_teams_normal"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.kills_solo">Kills (Solo)</span> <span class="statistic" id="blitz-overall-kills_solo_normal"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.kills_teams">Kills (Teams)</span> <span class="statistic" id="blitz-overall-kills_teams_normal"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.taunt_kills">Taunt Kills</span> <span class="statistic" id="blitz-overall-taunt_kills"><span class="mc">Unknown</span></span></p>
            </div>
          </div>
          <div class="card-big-misc">
            <p class="super-subtitle" data-t="games.modes.all.misc">Misc</p>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.coins">Coins</span> <span class="statistic" id="blitz-overall-coins"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.arrows_hit">Arrows Hit</span> <span class="statistic" id="blitz-overall-arrows_hit"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.damage_dealt">Damage Dealt</span> <span class="statistic" id="blitz-overall-damage_dealt"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.potions_thrown">Potions Thrown</span> <span class="statistic" id="blitz-overall-potions_thrown"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.mobs_spawned">Mobs Spawned</span> <span class="statistic" id="blitz-overall-mobs_spawned"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.chests_opened">Chests Opened</span> <span class="statistic" id="blitz-overall-chests_opened"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.playtime">Playtime</span> <span class="statistic" id="blitz-overall-playtime"><span class="mc">Unknown</span></span></p>
            </div>
          </div>
        </div>
      </div>
      <span class="general-button mright mtop" onclick="showCardWizard('BLITZ')" data-t="player.generate_card">Generate Card</span>
    </div>
    <div id="blitz-chips" class="width-100"></div>
</div>`;

  let minigameFragment = setupMinigameContainer("flex-container-blitz", minigameTemplate);

  blitzStats = playerData["stats"]["HungerGames"] || {};

  let easyStats = ["deaths", "wins_solo_normal", "wins_teams_normal", "kills_teams_normal", "taunt_kills", "coins", "arrows_hit", "potions_thrown", "mobs_spawned", "chests_opened"];

  for (let e = 0; e < easyStats.length; e++) {
    updateScopedElement(`blitz-overall-${easyStats[e]}`, checkAndFormat(blitzStats[easyStats[e]]));
  }
  updateScopedElement("blitz-overall-wins", checkAndFormat(und(blitzStats["wins_solo_normal"]) + und(blitzStats["wins_teams_normal"])));
  updateScopedElement("blitz-overall-kdr", calculateRatio(blitzStats["kills"], blitzStats["deaths"]));
  updateScopedElement("blitz-overall-kills_solo_normal", checkAndFormat(blitzStats["kills"] - blitzStats["kills_teams_normal"]));

  updateScopedElement("blitz-overall-playtime", smallDuration(blitzStats["time_played"]));
  updateScopedElement("blitz-overall-damage_dealt", checkAndFormat(blitzStats["damage"] / 2) + " ♥\uFE0E");

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

  updateScopedElement(
    "blitz-overall-kills",
    getGenericWinsPrefix({
      wins: blitzStats["kills"],
      winsObject: blitzPrefixes,
      definedColor: blitzStats["togglekillcounter"],
      useToGo: false,
      useDifferentBracketColors: true,
    })["title"],
    true
  );

  let blitzKits = [
    [getTranslation("games.modes.blitz.kits.arachnologist"), "arachnologist"],
    [getTranslation("games.modes.blitz.kits.archer"), "archer"],
    [getTranslation("games.modes.blitz.kits.armorer"), "armorer"],
    [getTranslation("games.modes.blitz.kits.astronaut"), "astronaut"],
    [getTranslation("games.modes.blitz.kits.baker"), "baker"],
    [getTranslation("games.modes.blitz.kits.blaze"), "blaze"],
    [getTranslation("games.modes.blitz.kits.creepertamer"), "creepertamer"],
    [getTranslation("games.modes.blitz.kits.diver"), "diver"],
    [getTranslation("games.modes.blitz.kits.donkeytamer"), "donkeytamer"],
    [getTranslation("games.modes.blitz.kits.farmer"), "farmer"],
    [getTranslation("games.modes.blitz.kits.fisherman"), "fisherman"],
    [getTranslation("games.modes.blitz.kits.florist"), "florist"],
    [getTranslation("games.modes.blitz.kits.golem"), "golem"],
    [getTranslation("games.modes.blitz.kits.guardian"), "guardian"],
    [getTranslation("games.modes.blitz.kits.horsetamer"), "horsetamer"],
    [getTranslation("games.modes.blitz.kits.hunter"), "hunter"],
    [getTranslation("games.modes.blitz.kits.hype train"), "hype train"],
    [getTranslation("games.modes.blitz.kits.jockey"), "jockey"],
    [getTranslation("games.modes.blitz.kits.knight"), "knight"],
    [getTranslation("games.modes.blitz.kits.meatmaster"), "meatmaster"],
    [getTranslation("games.modes.blitz.kits.milkman"), "milkman"],
    [getTranslation("games.modes.blitz.kits.necromancer"), "necromancer"],
    [getTranslation("games.modes.blitz.kits.paladin"), "paladin"],
    [getTranslation("games.modes.blitz.kits.phoenix"), "phoenix"],
    [getTranslation("games.modes.blitz.kits.pigman"), "pigman"],
    [getTranslation("games.modes.blitz.kits.ranger"), "ranger"],
    [getTranslation("games.modes.blitz.kits.reaper"), "reaper"],
    [getTranslation("games.modes.blitz.kits.reddragon"), "reddragon"],
    [getTranslation("games.modes.blitz.kits.rogue"), "rogue"],
    [getTranslation("games.modes.blitz.kits.scout"), "scout"],
    [getTranslation("games.modes.blitz.kits.shadow knight"), "shadow knight"],
    [getTranslation("games.modes.blitz.kits.shark"), "shark"],
    [getTranslation("games.modes.blitz.kits.slimeyslime"), "slimeyslime"],
    [getTranslation("games.modes.blitz.kits.snowman"), "snowman"],
    [getTranslation("games.modes.blitz.kits.speleologist"), "speleologist"],
    [getTranslation("games.modes.blitz.kits.tim"), "tim"],
    [getTranslation("games.modes.blitz.kits.toxicologist"), "toxicologist"],
    [getTranslation("games.modes.blitz.kits.troll"), "troll"],
    [getTranslation("games.modes.blitz.kits.viking"), "viking"],
    [getTranslation("games.modes.blitz.kits.warlock"), "warlock"],
    [getTranslation("games.modes.blitz.kits.warrior"), "warrior"],
    [getTranslation("games.modes.blitz.kits.wolftamer"), "wolftamer"],
  ];

  // Sort the list of Blitz kits by item 0 (sortStrings)
  blitzKits.sort((a, b) => sortStrings(a[0], b[0]));

  blitzKits.push([getTranslation("games.modes.blitz.kits.rambo"), "rambo"]);
  blitzKits.push([getTranslation("games.modes.blitz.kits.random"), "random"]);

  // Add kit level to each kit name
  for (let k = 0; k < blitzKits.length; k++) {
    if (blitzKits[k][1] != "random" && blitzKits[k][1] != "rambo") {
      blitzKits[k][0] = blitzKits[k][0] + ` ${getBlitzKitLevel(blitzKits[k][1])}`;
    }
  }

  let blitzKitsChip = ["blitz-kits", getTranslation("games.modes.blitz.kits.category"), "", `/img/games/blitz/classes.${imageFileType}`, getBlitzKitsStats(blitzKits[0][1]), blitzKits, ``, "blitz"];

  generateChip(blitzKitsChip, "blitz-chips");

  minigameFragments["blitz"] = minigameFragment;
  document.getElementById("games").appendChild(minigameFragment);
}

function getBlitzKitLevel(kit) {
  let kitLevel = und(blitzStats[kit]) + 1;
  let kitPrestige = und(blitzStats[`p${kit}`]);
  if (kitPrestige > 0) {
    // return 1 ✫ for each prestige
    return generateMinecraftText("§6✫".repeat(kitPrestige));
  } else {
    return convertToRoman(kitLevel);
  }
}

function getBlitzKitsStats(kit) {
  let topRowChipStats;
  if (kit == "random" || kit == "rambo") {
    // Random and Rambo kits don't have levels
    topRowChipStats = [false, [getTranslation("statistics.exp"), checkAndFormat(blitzStats["exp_" + kit])]];
  } else {
    topRowChipStats = [false, [getTranslation("statistics.level"), getBlitzKitLevel(kit)], [getTranslation("statistics.exp"), checkAndFormat(blitzStats["exp_" + kit])]];
  }

  let blitzKitStats = [topRowChipStats, [false, [getTranslation("statistics.wins"), checkAndFormat(sumStatsBasic(["wins_" + kit, "wins_teams_" + kit], blitzStats))], [getTranslation("statistics.losses"), checkAndFormat(und(blitzStats["games_played_" + kit]) - sumStatsBasic(["wins_" + kit, "wins_teams_" + kit], blitzStats))], [getTranslation("statistics.wlr"), calculateRatio(sumStatsBasic(["wins_" + kit, "wins_teams_" + kit], blitzStats), und(blitzStats["games_played_" + kit]) - sumStatsBasic(["wins_" + kit, "wins_teams_" + kit], blitzStats))]], [false, [getTranslation("statistics.kills"), checkAndFormat(blitzStats["kills_" + kit])], [getTranslation("statistics.taunt_kills"), checkAndFormat(blitzStats["taunt_kills_" + kit])]], [false, [getTranslation("statistics.arrows_hit"), checkAndFormat(blitzStats["arrows_hit_" + kit])], [getTranslation("statistics.damage_dealt"), checkAndFormat(blitzStats["damage_" + kit] / 2) + " ♥\uFE0E"]], [false, [getTranslation("statistics.potions_thrown"), checkAndFormat(blitzStats["potions_thrown_" + kit])], [getTranslation("statistics.mobs_spawned"), checkAndFormat(blitzStats["mobs_spawned_" + kit])]], [false, [getTranslation("statistics.chests_opened"), checkAndFormat(blitzStats["chests_opened_" + kit])], [getTranslation("statistics.playtime"), smallDuration(und(blitzStats["time_played_" + kit]))]]];

  if (kit != "rambo") {
    // Rambo kit doesn't have a team mode
    blitzKitStats.splice(2, 0, [false, [getTranslation("statistics.wins_solo"), checkAndFormat(blitzStats["wins_" + kit])], [getTranslation("statistics.wins_teams"), checkAndFormat(blitzStats["wins_teams_" + kit])]]);
  }

  return blitzKitStats;
}

function generateMegaWalls() {
  let minigameTemplate = `<div class="chip-container">
    <div class="chip-small but-big">
      <div class="chip-small-background-filter"></div>
      <p class="chip-small-title" data-t="games.megawalls">Mega Walls</p>
      <div class="chip-small-container">
        <div class="flex-two-item align-top flippable margin10">
          <div class="card-big-stats">
            <p class="super-subtitle" data-t="games.modes.all.stats">Stats</p>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.wins">Wins</span> <span class="statistic" id="megawalls-overall-wins"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.losses">Losses</span> <span class="statistic" id="megawalls-overall-losses"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.wlr">W/L R</span> <span class="statistic" id="megawalls-overall-wlr"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.final_kills">Final Kills</span> <span class="statistic" id="megawalls-overall-final_kills"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.final_deaths">Final Deaths</span> <span class="statistic" id="megawalls-overall-final_deaths"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.fkdr">FK/D R</span> <span class="statistic" id="megawalls-overall-fkdr"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.kills">Kills</span> <span class="statistic" id="megawalls-overall-kills"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.deaths">Deaths</span> <span class="statistic" id="megawalls-overall-deaths"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.kdr">K/D R</span> <span class="statistic" id="megawalls-overall-kdr"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.final_assists">Final Assists</span> <span class="statistic" id="megawalls-overall-final_assists"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.assists">Assists</span> <span class="statistic" id="megawalls-overall-assists"><span class="mc">Unknown</span></span></p>
            </div>
          </div>
          <div class="card-big-misc">
            <p class="super-subtitle" data-t="games.modes.all.misc">Misc</p>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.selected_class">Selected Class</span> <span class="statistic" id="megawalls-selected_class"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.coins">Coins</span> <span class="statistic" id="megawalls-overall-coins"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.mythic_favor">Mythic Favor</span> <span class="statistic" id="megawalls-overall-mythic_favor"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.points">Points</span> <span class="statistic" id="megawalls-overall-points"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.playtime">Playtime</span> <span class="statistic" id="megawalls-overall-playtime"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p>Wither Kills <span class="statistic" id="megawalls-overall-wither_kills"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.damage_dealt">Damage Dealt</span> <span class="statistic" id="megawalls-overall-damage_dealt"><span class="mc">Unknown</span></span></p>
            </div>
          </div>
        </div>
      </div>
      <span class="general-button mright mtop" onclick="showCardWizard('MEGAWALLS')" data-t="player.generate_card">Generate Card</span>
    </div>
    <div id="megawalls-chips" class="width-100"></div>
    <div class="flex-two-item chip-container-duo-parent">
      <div id="megawalls-chips-1" class="chip-container-duo">
      </div>
      <div id="megawalls-chips-2" class="chip-container-duo">
      </div>
    </div>
</div>`;

  let minigameFragment = setupMinigameContainer("flex-container-megawalls", minigameTemplate);

  megaWallsStats = playerData["stats"]["Walls3"] || {};

  let easyStats = ["kills", "deaths", "wins", "losses", "final_assists", "mythic_favor", "wither_kills", "assists", "coins"];

  for (let e = 0; e < easyStats.length; e++) {
    updateScopedElement(`megawalls-overall-${easyStats[e]}`, checkAndFormat(megaWallsStats[easyStats[e]]));
  }

  updateScopedElement("megawalls-overall-wlr", calculateRatio(megaWallsStats["wins"], megaWallsStats["losses"]));

  let megaWallsFinalKills = sumStatsBasic(["final_kills", "finalKills"], megaWallsStats);
  let megaWallsFinalDeaths = sumStatsBasic(["final_deaths", "finalDeaths"], megaWallsStats);

  updateScopedElement("megawalls-overall-final_kills", checkAndFormat(megaWallsFinalKills));
  updateScopedElement("megawalls-overall-final_deaths", checkAndFormat(megaWallsFinalDeaths));

  updateScopedElement("megawalls-overall-fkdr", calculateRatio(megaWallsFinalKills, megaWallsFinalDeaths));
  updateScopedElement("megawalls-overall-kdr", calculateRatio(megaWallsStats["kills"], megaWallsStats["deaths"]));

  let megaWallsClassPoints = megaWallsStats["class_points"] || und(megaWallsStats["wins"]) * 10 + megaWallsFinalKills + und(megaWallsStats["final_assists"]); // Default to old calculation if the class points stat is not available

  updateScopedElement("megawalls-overall-points", checkAndFormat(megaWallsClassPoints));
  updateScopedElement("megawalls-selected_class", und(megaWallsStats["chosen_class"], "None"));

  updateScopedElement("megawalls-overall-playtime", smallDuration(megaWallsStats["time_played"] * 60));
  updateScopedElement("megawalls-overall-damage_dealt", checkAndFormat(megaWallsStats["damage_dealt"] / 2) + " ♥\uFE0E");

  let megaWallsClasses = {
    angel: { name: getTranslation("games.modes.megawalls.classes.angel"), abilities: [] },
    arcanist: { name: getTranslation("games.modes.megawalls.classes.arcanist"), abilities: [] },
    assassin: { name: getTranslation("games.modes.megawalls.classes.assassin"), abilities: [] },
    automaton: { name: getTranslation("games.modes.megawalls.classes.automaton"), abilities: [] },
    blaze: { name: getTranslation("games.modes.megawalls.classes.blaze"), abilities: [] },
    cow: { name: getTranslation("games.modes.megawalls.classes.cow"), abilities: [] },
    creeper: { name: getTranslation("games.modes.megawalls.classes.creeper"), abilities: [] },
    dreadlord: { name: getTranslation("games.modes.megawalls.classes.dreadlord"), abilities: [] },
    dragon: { name: getTranslation("games.modes.megawalls.classes.dragon"), abilities: [] },
    enderman: { name: getTranslation("games.modes.megawalls.classes.enderman"), abilities: [] },
    golem: { name: getTranslation("games.modes.megawalls.classes.golem"), abilities: [] },
    herobrine: { name: getTranslation("games.modes.megawalls.classes.herobrine"), abilities: [] },
    hunter: { name: getTranslation("games.modes.megawalls.classes.hunter"), abilities: [] },
    moleman: { name: getTranslation("games.modes.megawalls.classes.moleman"), abilities: [] },
    phoenix: { name: getTranslation("games.modes.megawalls.classes.phoenix"), abilities: [] },
    pigman: { name: getTranslation("games.modes.megawalls.classes.pigman"), abilities: [] },
    pirate: { name: getTranslation("games.modes.megawalls.classes.pirate"), abilities: [] },
    renegade: { name: getTranslation("games.modes.megawalls.classes.renegade"), abilities: [] },
    shaman: { name: getTranslation("games.modes.megawalls.classes.shaman"), abilities: [] },
    shark: { name: getTranslation("games.modes.megawalls.classes.shark"), abilities: [] },
    skeleton: { name: getTranslation("games.modes.megawalls.classes.skeleton"), abilities: [] },
    snowman: { name: getTranslation("games.modes.megawalls.classes.snowman"), abilities: [] },
    spider: { name: getTranslation("games.modes.megawalls.classes.spider"), abilities: [] },
    squid: { name: getTranslation("games.modes.megawalls.classes.squid"), abilities: [] },
    werewolf: { name: getTranslation("games.modes.megawalls.classes.werewolf"), abilities: [] },
    zombie: { name: getTranslation("games.modes.megawalls.classes.zombie"), abilities: [] },
  };

  // Iterate through megaWallsClasses, add prestige stars to name if applicable
  for (let key in megaWallsClasses) {
    let megaWallsPrestige = getMegaWallsPrestige(key);
    if (megaWallsPrestige[0]) {
      megaWallsClasses[key]["name"] = megaWallsClasses[key]["name"] + ` ${megaWallsPrestige[1]}`;
    }
  }

  let megaWallsClassesFormatted = Object.entries(megaWallsClasses).map(([key, value]) => [value["name"], key]);
  megaWallsClassesFormatted.sort((a, b) => sortStrings(a[0], b[0]));

  let megaWallsClassesFormattedWithOverall = [[getTranslation("games.modes.all.overall"), ""]].concat(megaWallsClassesFormatted);

  let megaWallsClassChip = ["megawalls-classes", getTranslation("games.modes.megawalls.classes.category"), "", `/img/games/megawalls/classes.${imageFileType}`, getMegaWallsClassStats(megaWallsClassesFormatted[0][1]), megaWallsClassesFormatted, ``, "megawalls"];

  let megaWallsStandardChip = ["megawalls-standard", getTranslation("games.modes.megawalls.standard"), "", `/img/games/megawalls/standard.${imageFileType}`, getMegaWallsClassStats("", "standard"), megaWallsClassesFormattedWithOverall, ``, "megawalls"];

  let megaWallsFaceOffChip = ["megawalls-faceoff", getTranslation("games.modes.megawalls.faceoff"), "", `/img/games/megawalls/faceoff.${imageFileType}`, getMegaWallsClassStats("", "face_off"), megaWallsClassesFormattedWithOverall, ``, "megawalls"];

  generateChip(megaWallsClassChip, "megawalls-chips");

  let megaWallsChips = [megaWallsStandardChip, megaWallsFaceOffChip];
  generateChips(megaWallsChips, "megawalls-chips");

  minigameFragments["megawalls"] = minigameFragment;
  document.getElementById("games").appendChild(minigameFragment);
}

/*
 * Returns an array with the following format:
 * [boolean, string, number]
 * - The boolean is true if the class has a prestige, false otherwise
 * - The string is the prestige stars if the class has a prestige, otherwise it's the player's kit/skill levels
 * - The number is the number of ender chest rows the class has
 *
 * @param {string} className The class name
 */
function getMegaWallsPrestige(className) {
  let megaWallsClassStats = megaWallsStats["classes"] || {};
  let megaWallsChosenClassStats = megaWallsClassStats[className] || {};

  if (megaWallsChosenClassStats["prestige"] > 0) {
    let megaWallsChosenClassPrestigeColor = `§7`;
    let megaWallsChosenClassPrestigeTag = megaWallsChosenClassStats["prestige_tag"] || {};

    if (megaWallsChosenClassStats["prestige"] >= 4) {
      megaWallsChosenClassPrestigeColor = `§6`;
    }

    if (megaWallsChosenClassPrestigeTag["type"]) {
      // If the prestige tag has a color, use it
      let megaWallsChosenClassPrestigeColorCode = megaWallsChosenClassPrestigeTag["type"];
      if (minecraftColorCodes[megaWallsChosenClassPrestigeColorCode] != undefined) {
        megaWallsChosenClassPrestigeColor = `§${minecraftColorCodes[megaWallsChosenClassPrestigeColorCode]}`;
      }
    }
    // NOTE: The above code does not work for rainbow prestige tags or the custom prestige tag
    // NOTE: It is likely that both Hypixel and nadeshiko will not last long enough for any player to have enough class points to reach either of these prestige tags

    // Make first item of array
    return [true, generateMinecraftText(`${megaWallsChosenClassPrestigeColor}✫`.repeat(megaWallsChosenClassStats["prestige"])), und(megaWallsChosenClassStats["enderchest_rows"], 3)];
  } else {
    return [false, `${und(megaWallsChosenClassStats["skill_level_d"], 1)} &ndash; ${und(megaWallsChosenClassStats["skill_level_a"], 1)} &ndash; ${und(megaWallsChosenClassStats["skill_level_b"], 1)} &ndash; ${und(megaWallsChosenClassStats["skill_level_c"], 1)} &ndash; ${und(megaWallsChosenClassStats["skill_level_g"], 1)}`, und(megaWallsChosenClassStats["enderchest_rows"], 3)];
  }
}

function getMegaWallsClassStats(className = "", modeName = "") {
  let trueClassName = className;
  if (className != "") {
    className = `${className}_`;
  }

  if (modeName != "") {
    modeName = `_${modeName}`;
  }

  megaWallsClassChipStats = [
    [false, [getTranslation("statistics.wins"), checkAndFormat(megaWallsStats[`${className}wins${modeName}`])], [getTranslation("statistics.losses"), checkAndFormat(megaWallsStats[`${className}losses${modeName}`])], [getTranslation("statistics.wlr"), calculateRatio(megaWallsStats[`${className}wins${modeName}`], megaWallsStats[`${className}losses${modeName}`])]],
    [false, [getTranslation("statistics.final_kills"), checkAndFormat(megaWallsStats[`${className}final_kills${modeName}`])], [getTranslation("statistics.final_deaths"), checkAndFormat(megaWallsStats[`${className}final_deaths${modeName}`])], [getTranslation("statistics.fkdr"), calculateRatio(megaWallsStats[`${className}final_kills${modeName}`], megaWallsStats[`${className}final_deaths${modeName}`])]],
    [false, [getTranslation("statistics.kills"), checkAndFormat(megaWallsStats[`${className}kills${modeName}`])], [getTranslation("statistics.deaths"), checkAndFormat(megaWallsStats[`${className}deaths${modeName}`])], [getTranslation("statistics.kdr"), calculateRatio(megaWallsStats[`${className}kills${modeName}`], megaWallsStats[`${className}deaths${modeName}`])]],
    [false, [getTranslation("statistics.wither_kills"), checkAndFormat(megaWallsStats[`${className}wither_kills${modeName}`])], [getTranslation("statistics.damage_dealt"), checkAndFormat(megaWallsStats[`${className}damage_dealt${modeName}`] / 2) + " ♥\uFE0E"]],
  ];

  if (className != "" && modeName == "") {
    // If a class is selected and the mode is overall (show class points)
    let megaWallsClassPoints = megaWallsStats[`${className}class_points`] || und(megaWallsStats[`${className}wins`]) * 10 + und(megaWallsStats[`${className}final_kills`]) + und(megaWallsStats[`${className}final_assists`]);

    megaWallsClassChipStats.splice(3, 0, [false, [getTranslation("statistics.final_assists"), checkAndFormat(megaWallsStats[`${className}final_assists${modeName}`])], [getTranslation("statistics.assists"), checkAndFormat(megaWallsStats[`${className}assists${modeName}`])]]);
    megaWallsClassChipStats.splice(4, 0, [false, [getTranslation("statistics.class_points"), checkAndFormat(megaWallsClassPoints)], [getTranslation("statistics.playtime"), smallDuration(megaWallsStats[`${className}time_played${modeName}`] * 60)]]);
  } else {
    // Otherwise, show final assists, assists, and playtime on the same line
    megaWallsClassChipStats.splice(3, 0, [false, [getTranslation("statistics.final_assists"), checkAndFormat(megaWallsStats[`${className}final_assists${modeName}`])], [getTranslation("statistics.assists"), checkAndFormat(megaWallsStats[`${className}assists${modeName}`])], [getTranslation("statistics.playtime"), smallDuration(megaWallsStats[`${className}time_played${modeName}`] * 60)]]);
  }

  if (modeName == "" && className != "") {
    let megaWallsPrestige = getMegaWallsPrestige(trueClassName);
    if (megaWallsPrestige[0]) {
      megaWallsClassChipStats.unshift([true, [getTranslation("statistics.prestige"), megaWallsPrestige[1]], [getTranslation("statistics.ender_chest_rows"), megaWallsPrestige[2]]]);
    } else {
      megaWallsClassChipStats.unshift([false, [getTranslation("statistics.upgrades"), megaWallsPrestige[1]], [getTranslation("statistics.ender_chest_rows"), megaWallsPrestige[2]]]);
    }
  }

  return megaWallsClassChipStats;
}

function generateWarlords() {
  let minigameTemplate = `<div class="chip-container">
      <div class="chip-small but-big">
        <div class="chip-small-background-filter"></div>
        <p class="chip-small-title" data-t="games.warlords">Warlords</p>
        <div class="chip-small-container">
          <p class="margin10">
            <span id="warlords-overall-title"><span class="mc">Unknown</span></span> <span id="warlords-overall-to-go"></span>
          </p>
          <div class="progress-bar" id="warlords-progress-bar-container" style="display: none">
            <span class="progress-number" id="warlords-overall-progress-number"><span class="mc">Unknown</span></span>
            <div class="progress" style="width: 0%;" id="warlords-overall-progress-bar"></div>
          </div>
          <div class="flex-two-item align-top flippable margin10">
            <div class="card-big-stats">
              <p class="super-subtitle" data-t="games.modes.all.stats">Stats</p>
              <div class="chip-small-statistic-row">
                <p><span data-t="statistics.wins">Wins</span> <span class="statistic" id="warlords-overall-wins"><span class="mc">Unknown</span></span></p>
                <p><span data-t="statistics.losses">Losses</span> <span class="statistic" id="warlords-overall-losses"><span class="mc">Unknown</span></span></p>
                <p><span data-t="statistics.wlr">W/L R</span> <span class="statistic" id="warlords-overall-wlr"><span class="mc">Unknown</span></span></p>
              </div>
              <div class="chip-small-statistic-row">
                <p><span data-t="statistics.kills">Kills</span> <span class="statistic" id="warlords-overall-kills"><span class="mc">Unknown</span></span></p>
                <p><span data-t="statistics.deaths">Deaths</span> <span class="statistic" id="warlords-overall-deaths"><span class="mc">Unknown</span></span></p>
                <p><span data-t="statistics.kdr">K/D R</span> <span class="statistic" id="warlords-overall-kdr"><span class="mc">Unknown</span></span></p>
              </div>
              <div class="chip-small-statistic-row">
                <p><span data-t="statistics.assists">Assists</span> <span class="statistic" id="warlords-overall-assists"><span class="mc">Unknown</span></span></p>
                <p><span data-t="statistics.powerups">Powerups</span> <span class="statistic" id="warlords-overall-powerups_collected"><span class="mc">Unknown</span></span></p>
              </div>
              <div class="chip-small-statistic-row">
                <p><span data-t="statistics.damage_dealt">Damage Dealt</span> <span class="statistic" id="warlords-overall-damage"><span class="mc">Unknown</span></span></p>
                <p><span data-t="statistics.damage_healed">Damage Healed</span> <span class="statistic" id="warlords-overall-heal"><span class="mc">Unknown</span></span></p>
              </div>
            </div>
            <div class="card-big-misc">
              <p class="super-subtitle" data-t="games.modes.all.misc">Misc</p>
              <div class="chip-small-statistic-row">
                <p><span data-t="statistics.specialization">Specialization</span> <span class="statistic" id="warlords-specialization"><span class="mc">Unknown</span></span></p>
              </div>
              <div class="chip-small-statistic-row">
                <p><span data-t="statistics.selected_weapon">Current Weapon</span> <span class="statistic" id="warlords-selected-weapon"><span class="mc">Unknown</span></span></p>
              </div>
              <div class="chip-small-statistic-row">
                <p><span data-t="statistics.coins">Coins</span> <span class="statistic" id="warlords-overall-coins"><span class="mc">Unknown</span></span></p>
              </div>
              <div class="chip-small-statistic-row">
                <p><span data-t="statistics.magic_dust">Magic Dust</span> <span class="statistic" id="warlords-overall-magic_dust"><span class="mc">Unknown</span></span></p>
                <p><span data-t="statistics.void_shards">Void Shards</span> <span class="statistic" id="warlords-overall-void_shards"><span class="mc">Unknown</span></span></p>
              </div>
              <div class="chip-small-statistic-row">
                <p><span data-t="statistics.weapons_repaired">Weapons Repaired</span> <span class="statistic" id="warlords-overall-repaired"><span class="mc">Unknown</span></span></p>
              </div>
            </div>
          </div>
        </div>
        <span class="general-button mright mtop" onclick="showCardWizard('WARLORDS')" data-t="player.generate_card">Generate Card</span>
      </div>
      <div class="flex-two-item chip-container-duo-parent">
        <div id="warlords-chips-1" class="chip-container-duo">
        </div>
        <div id="warlords-chips-2" class="chip-container-duo">
        </div>
      </div>
    </div>`;
  let minigameFragment = setupMinigameContainer("flex-container-warlords", minigameTemplate);

  warlordsStats = playerData["stats"]["Battleground"] || {};

  let warlordsTitles = [
    { req: 0, color: "§8", altName: getTranslation("games.modes.warlords.titles.rookie") },
    { req: 5, color: "§7", altName: getTranslation("games.modes.warlords.titles.recruit") },
    { req: 25, color: "§e", altName: getTranslation("games.modes.warlords.titles.novice") },
    { req: 50, color: "§a", altName: getTranslation("games.modes.warlords.titles.apprentice") },
    { req: 125, color: "§2", altName: getTranslation("games.modes.warlords.titles.soldier") },
    { req: 250, color: "§b", altName: getTranslation("games.modes.warlords.titles.captain") },
    { req: 500, color: "§9", altName: getTranslation("games.modes.warlords.titles.general") },
    { req: 1000, color: "§d", altName: getTranslation("games.modes.warlords.titles.vanquisher") },
    { req: 2500, color: "§5", altName: getTranslation("games.modes.warlords.titles.gladiator") },
    { req: 5000, color: "§c", altName: getTranslation("games.modes.warlords.titles.champion") },
    { req: 7500, color: "§6", altName: getTranslation("games.modes.warlords.titles.warlord") },
    { req: 10000, color: "rainbow", colorArray: ["§c§l", "§6§l", "§e§l", "§a§l", "§2§l", "§9§l", "§d§l", "§5§l"], altName: getTranslation("games.modes.warlords.titles.overlord") },
  ];

  let warlordsWins = warlordsStats["wins"] || 0;

  let warlordsTitleObject = getGenericWinsPrefix({
    wins: warlordsWins,
    winsObject: warlordsTitles,
    useToGo: true,
    useBrackets: false,
    alternativeNaming: true,
  });

  if (warlordsTitleObject["winsToGo"] >= 0) {
    winsPastTitleUnlock = warlordsWins - warlordsTitleObject["currentTitleRequirement"];
    winsToNextTitle = warlordsWins + warlordsTitleObject["winsToGo"] - warlordsTitleObject["currentTitleRequirement"];

    activeScope.getElementById("warlords-progress-bar-container").style.display = "block";

    warlordsWinProgress = winsPastTitleUnlock / winsToNextTitle;

    updateScopedElement("warlords-overall-progress-number", Math.floor(warlordsWinProgress * 100) + "%");
    activeScope.getElementById("warlords-overall-progress-bar").style.width = Math.floor(warlordsWinProgress * 100) + "%";
  }

  updateScopedElement("warlords-overall-title", warlordsTitleObject["title"], true);

  function getWarlordsWeaponName(weaponObject) {
    // Calculate weapon quality
    let weaponGrader = {
      COMMON: {
        damage: {
          min: 90,
          max: 100,
        },
        chance: {
          min: 10,
          max: 18,
        },
        multiplier: {
          min: 150,
          max: 170,
        },
        health: {
          min: 180,
          max: 220,
        },
        total_score: {
          min: 430 + 4, // Discrepancy for skill boosts
          max: 508 + 6, // Discrepancy for skill boosts
          divisions: ["crumbly", "flimsy", "rough", "honed", "refined", "balanced"],
        },
      },
      RARE: {
        damage: {
          min: 95,
          max: 105,
        },
        chance: {
          min: 12,
          max: 20,
        },
        multiplier: {
          min: 160,
          max: 180,
        },
        health: {
          min: 200,
          max: 250,
        },
        energy: {
          min: 10,
          max: 18,
        },
        total_score: {
          min: 477 + 6, // Discrepancy for skill boosts
          max: 573 + 8, // Discrepancy for skill boosts
          divisions: ["savage", "vicious", "deadly", "perfect"],
        },
      },
      EPIC: {
        damage: {
          min: 100,
          max: 110,
        },
        chance: {
          min: 15,
          max: 20,
        },
        multiplier: {
          min: 160,
          max: 190,
        },
        health: {
          min: 220,
          max: 275,
        },
        energy: {
          min: 15,
          max: 20,
        },
        cooldown: {
          min: 3,
          max: 5,
        },
        total_score: {
          min: 513 + 7, // Discrepancy for skill boosts
          max: 620 + 9, // Discrepancy for skill boosts
          divisions: ["fierce", "mighty", "brutal", "gladiators"],
        },
      },
      LEGENDARY: {
        damage: {
          min: 110,
          max: 120,
        },
        chance: {
          min: 15,
          max: 25,
        },
        multiplier: {
          min: 180,
          max: 200,
        },
        health: {
          min: 250,
          max: 400,
        },
        energy: {
          min: 20,
          max: 25,
        },
        cooldown: {
          min: 5,
          max: 10,
        },
        movement: {
          min: 5,
          max: 10,
        },
        total_score: {
          min: 585 + 10, // Discrepancy for skill boosts
          max: 790 + 15, // Discrepancy for skill boosts
          divisions: ["vanquishers", "champions", "warlords"],
        },
      },
    };

    let weaponSpecs = [
      ["pyromancer", "cryomancer", "aquamancer"],
      ["berserker", "defender", "revenant"],
      ["avenger", "crusader", "protector"],
      ["thunderlord", "earthwarden", "spiritguard"], // Shaman's last two specializations are swapped
    ];

    let weaponRarityColors = {
      COMMON: "§a",
      RARE: "§9",
      EPIC: "§5",
      LEGENDARY: "§6",
    };

    let weaponForgeIncreases = {
      damage: 0.075,
      health: 0.25,
      energy: 0.1,
      cooldown: 0.075,
      movement: 0.075,

      chance: 0,
      multiplier: 0,
    };

    let weaponStats = {
      // Base default stats
      damage: weaponObject["damage"],
      chance: weaponObject["chance"],
      multiplier: weaponObject["multiplier"],
      energy: weaponObject["energy"],
      health: weaponObject["health"],
      cooldown: weaponObject["cooldown"],
      movement: weaponObject["movement"],
    };

    let weaponPercentiles = {};
    let totalWeaponScore = 0;

    // determine ranked % of each item
    let weaponRarity = weaponObject["category"] || "COMMON";

    let weaponRarityGrading = weaponGrader[weaponRarity];

    let weaponUpgrades = und(weaponObject["upgradeTimes"]); // Number of upgrades the weapon has
    let weaponMaxUpgrades = und(weaponObject["upgradeMax"]); // Maximum number of upgrades (magic / void forging)

    if (weaponRarity == "COMMON" || weaponRarity == "RARE") {
      // The API says common and rare weapons can be upgraded 2 times, but they can't
      weaponUpgrades = 0;
      weaponMaxUpgrades = 0;
    }

    for (let comparator in weaponRarityGrading) {
      if (comparator != "total_score") {
        if (weaponForgeIncreases[comparator]) {
          weaponStats[comparator] = und(Math.ceil(weaponStats[comparator] * (1 + weaponForgeIncreases[comparator] * weaponUpgrades))); // Applies void forge stat increases to base stats
        }

        totalWeaponScore += weaponStats[comparator] || 0; // Weapon score is based on the upgraded stats

        weaponPercentiles[comparator] = (weaponObject[comparator] - weaponRarityGrading[comparator]["min"]) / (weaponRarityGrading[comparator]["max"] - weaponRarityGrading[comparator]["min"]); // Calculate the weapon quality, which is based on the **non-upgraded** stats
      }
    }

    let averagePercentile = 0;
    for (let percentile in weaponPercentiles) {
      averagePercentile += weaponPercentiles[percentile];
      //console.log(`Percentile for ${percentile}: ${checkAndFormat(weaponPercentiles[percentile]*100, 1)}% (value: ${weaponObject[percentile]}, min: ${weaponGrader[weaponRarity][percentile]["min"]}, max: ${weaponGrader[weaponRarity][percentile]["max"]})`);
    }

    //console.log(`Summing up percents and dividing by ${Object.keys(weaponPercentiles).length + 1} (currently bugged)`);
    averagePercentile /= Object.keys(weaponPercentiles).length + 1;
    averagePercentile *= 100;

    //console.log(`Average percentile: ${checkAndFormat(averagePercentile*100, 2)}%`);

    let weaponPossibleTitles = weaponRarityGrading["total_score"]["divisions"];
    let weaponMinimumScore = weaponRarityGrading["total_score"]["min"];
    let weaponMaximumScore = weaponRarityGrading["total_score"]["max"];

    let weaponTitlePosition = und(Math.floor((totalWeaponScore - weaponMinimumScore) / ((weaponMaximumScore - weaponMinimumScore) / weaponPossibleTitles.length)));

    if (weaponTitlePosition < 0) {
      weaponTitlePosition = 0;
    }

    if (weaponTitlePosition >= weaponPossibleTitles.length) {
      weaponTitlePosition = weaponPossibleTitles.length - 1;
    }

    let weaponTitleToUse = weaponPossibleTitles[weaponTitlePosition] || "Unknown"; // This line of code determines the weapon title (prefix) to use. It's based on the total score of the weapon, which is calculated by summing up the values of the weapon's stats. It then divides the total score by the number of possible titles to get the index of the title to use. e.g. if there were 3 titles, and the weapon's total score was >67% of the way to the maximum score, it would use the third title.

    let weaponSpecData = weaponObject["spec"] || {};
    let weaponSpec = weaponSpecs[und(weaponSpecData["playerClass"])][und(weaponSpecData["spec"])];

    let translatedWeaponTitle = getTranslation(`games.modes.warlords.weapons.titles.${weaponTitleToUse}`) || weaponTitleToUse;
    let translatedWeaponItem = getTranslation(`games.modes.warlords.weapons.items.${weaponObject["material"]}`) || weaponObject["item"];
    let translatedWeaponSpec = getTranslation(`games.modes.warlords.classes.${weaponSpec}`) || weaponSpec;
    let weaponRarityColor = weaponRarityColors[weaponRarity] || "§f";

    let fullName = insertPlaceholders(getTranslation(`games.modes.warlords.weapons.format`), {
      title: translatedWeaponTitle,
      item: translatedWeaponItem,
      spec: translatedWeaponSpec,
    });

    return {
      name: `${weaponRarityColor}${fullName}`,
      id: weaponObject["id"],
      damage: weaponStats["damage"],
      damage_min: Math.floor(weaponStats["damage"] * 0.85),
      damage_max: Math.floor(weaponStats["damage"] * 1.15),
      chance: weaponStats["chance"],
      multiplier: weaponStats["multiplier"],
      energy: weaponStats["energy"],
      health: weaponStats["health"],
      cooldown: weaponStats["cooldown"],
      movement: weaponStats["movement"],
      rarity: weaponRarity,

      total_score: totalWeaponScore,
      weapon_score: averagePercentile,
      upgrades: weaponUpgrades,
      max_upgrades: weaponMaxUpgrades,
    };
  }

  warlordsFormattedWeapons = [];

  for (let a in warlordsStats["weapon_inventory"]) {
    warlordsFormattedWeapons.push(getWarlordsWeaponName(warlordsStats["weapon_inventory"][a]));
  }

  let warlordsSelectedClass = warlordsStats["chosen_class"];
  let warlordsSelectedSpecialization;

  if (warlordsSelectedClass) {
    warlordsSelectedSpecialization = warlordsStats[warlordsSelectedClass + "_spec"];
  }

  if (warlordsSelectedSpecialization) {
    updateScopedElement("warlords-specialization", getTranslation(`games.modes.warlords.classes.${warlordsSelectedSpecialization}`));
  } else {
    updateScopedElement("warlords-specialization", getTranslation("player.errors.not_applicable"));
  }

  let warlordsSelectedWeaponId = warlordsStats["current_weapon"];

  let boundOverrideWeaponId = getValue(warlordsStats, ["bound_weapon", warlordsSelectedClass, warlordsSelectedSpecialization]); // If the user has a bound weapon, that's actually their weapon and not current_weapon

  let warlordsSelectedWeapon, warlordsWeaponToDisplayAsDefaultInWeaponsChip;

  if (boundOverrideWeaponId) {
    warlordsSelectedWeapon = warlordsFormattedWeapons.find((a) => a["id"] == boundOverrideWeaponId);
    if (warlordsSelectedWeapon) {
      // This check is needed because you can salvage your bound weapon, which would make it not exist in the weapon inventory
      console.warn("Bound weapon override");
      warlordsSelectedWeaponId = boundOverrideWeaponId;
    }
  }

  warlordsSelectedWeapon = warlordsFormattedWeapons.find((a) => a["id"] == warlordsSelectedWeaponId);

  warlordsWeaponToDisplayAsDefaultInWeaponsChip = warlordsFormattedWeapons.findIndex((a) => a["id"] == warlordsSelectedWeaponId);

  if (warlordsSelectedWeapon) {
    updateScopedElement("warlords-selected-weapon", generateMinecraftText(`${warlordsSelectedWeapon["name"]} §7(${checkAndFormat(warlordsSelectedWeapon["weapon_score"], 2)}%)`), true);
  } else {
    updateScopedElement("warlords-selected-weapon", getTranslation("player.errors.not_applicable"));

    if (warlordsFormattedWeapons.length > 0) {
      // No selected weapon, default to first weapon
      warlordsWeaponToDisplayAsDefaultInWeaponsChip = 0;
    } else {
      warlordsWeaponToDisplayAsDefaultInWeaponsChip = -1;
    }
  }

  // Move item in position warlordsWeaponToDisplayAsDefaultInWeaponsChip to position 0
  if (warlordsWeaponToDisplayAsDefaultInWeaponsChip != -1) {
    let temp = warlordsFormattedWeapons[0];
    warlordsFormattedWeapons[0] = warlordsFormattedWeapons[warlordsWeaponToDisplayAsDefaultInWeaponsChip];
    warlordsFormattedWeapons[warlordsWeaponToDisplayAsDefaultInWeaponsChip] = temp;
  }

  warlordsWeaponToDisplayAsDefaultInWeaponsChip = 0;

  let warlordsWeaponNames = warlordsFormattedWeapons.map((a, index) => [generateMinecraftText(a["name"]), index]);

  let easyStats = ["kills", "deaths", "wins", "assists", "coins", "void_shards", "magic_dust", "repaired", "powerups_collected"];

  for (let e = 0; e < easyStats.length; e++) {
    updateScopedElement(`warlords-overall-${easyStats[e]}`, checkAndFormat(warlordsStats[easyStats[e]]));
  }

  let warlordsGamesPlayed = sumStatsBasic(["mage_plays", "warrior_plays", "paladin_plays", "shaman_plays"], warlordsStats);
  updateScopedElement("warlords-overall-losses", checkAndFormat(warlordsGamesPlayed - warlordsStats["wins"]));
  updateScopedElement("warlords-overall-wlr", calculateRatio(warlordsStats["wins"], warlordsGamesPlayed - warlordsStats["wins"]));
  updateScopedElement("warlords-overall-kdr", calculateRatio(warlordsStats["kills"], warlordsStats["deaths"]));
  updateScopedElement("warlords-overall-damage", veryLargeNumber(warlordsStats["damage"]) + " HP");
  updateScopedElement("warlords-overall-heal", veryLargeNumber(warlordsStats["heal"]) + " HP");

  let warlordsClassesChip = [
    "warlords-classes",
    getTranslation("games.modes.warlords.classes.category"),
    "",
    `/img/games/warlords/classes.${imageFileType}`,
    getWarlordsClassStats("mage"),
    [
      [getTranslation("games.modes.warlords.classes.mage"), "mage"],
      [getTranslation("games.modes.warlords.classes.pyromancer"), "pyromancer"],
      [getTranslation("games.modes.warlords.classes.cryomancer"), "cryomancer"],
      [getTranslation("games.modes.warlords.classes.aquamancer"), "aquamancer"],
      [getTranslation("games.modes.warlords.classes.warrior"), "warrior"],
      [getTranslation("games.modes.warlords.classes.berserker"), "berserker"],
      [getTranslation("games.modes.warlords.classes.defender"), "defender"],
      [getTranslation("games.modes.warlords.classes.revenant"), "revenant"],
      [getTranslation("games.modes.warlords.classes.paladin"), "paladin"],
      [getTranslation("games.modes.warlords.classes.avenger"), "avenger"],
      [getTranslation("games.modes.warlords.classes.crusader"), "crusader"],
      [getTranslation("games.modes.warlords.classes.protector"), "protector"],
      [getTranslation("games.modes.warlords.classes.shaman"), "shaman"],
      [getTranslation("games.modes.warlords.classes.thunderlord"), "thunderlord"],
      [getTranslation("games.modes.warlords.classes.spiritguard"), "spiritguard"],
      [getTranslation("games.modes.warlords.classes.earthwarden"), "earthwarden"],
    ],
    ``,
    "warlords",
  ];

  let warlordsWeaponsChip = ["warlords-weapons", getTranslation("games.modes.warlords.weapons.category"), "", `/img/games/warlords/weapons.${imageFileType}`, formatWarlordsWeaponStats(warlordsWeaponToDisplayAsDefaultInWeaponsChip), warlordsWeaponNames, ``, "warlords"];

  let warlordsCaptureTheFlagChip = [
    "warlords-capturetheflag",
    getTranslation("games.modes.warlords.capturetheflag"),
    "",
    `/img/games/warlords/capturetheflag.${imageFileType}`,
    [
      [false, [getTranslation("statistics.wins"), checkAndFormat(warlordsStats["wins_capturetheflag"])]],
      [false, [getTranslation("statistics.kills"), checkAndFormat(warlordsStats["kills_capturetheflag"])]],
      [false, [getTranslation("statistics.flags_captured"), checkAndFormat(warlordsStats["flag_conquer_self"])], [getTranslation("statistics.flags_returned"), checkAndFormat(warlordsStats["flag_returns"])]],
    ],
    [],
    ``,
    "warlords",
  ];

  let warlordsTeamDeathmatchChip = [
    "warlords-teamdeathmatch",
    getTranslation("games.modes.warlords.teamdeathmatch"),
    "",
    `/img/games/warlords/teamdeathmatch.${imageFileType}`,
    [
      [false, [getTranslation("statistics.wins"), checkAndFormat(warlordsStats["wins_teamdeathmatch"])]],
      [false, [getTranslation("statistics.kills"), checkAndFormat(warlordsStats["kills_teamdeathmatch"])]],
    ],
    [],
    ``,
    "warlords",
  ];

  let warlordsDominationChip = [
    "warlords-domination",
    getTranslation("games.modes.warlords.domination"),
    "",
    `/img/games/warlords/domination.${imageFileType}`,
    [
      [false, [getTranslation("statistics.wins"), checkAndFormat(warlordsStats["wins_domination"])]],
      [false, [getTranslation("statistics.kills"), checkAndFormat(warlordsStats["kills_domination"])]],
      [false, [getTranslation("statistics.total_score"), checkAndFormat(warlordsStats["total_domination_score"])], [getTranslation("statistics.captures"), checkAndFormat(warlordsStats["dom_point_captures"])]],
    ],
    [],
    ``,
    "warlords",
  ];

  let warlordsChips = [warlordsClassesChip, warlordsWeaponsChip, warlordsCaptureTheFlagChip, warlordsDominationChip, warlordsTeamDeathmatchChip];
  generateChips(warlordsChips, "warlords-chips");

  minigameFragments["warlords"] = minigameFragment;
  document.getElementById("games").appendChild(minigameFragment);
}

function formatWarlordsWeaponStats(weaponObjectId) {
  if (weaponObjectId == -1) {
    return [[false, [getTranslation("games.modes.warlords.weapons.no_weapons"), ``]]];
  }

  let weaponObject = warlordsFormattedWeapons[weaponObjectId] || {};

  let formattedWeaponStats = [
    [false, [getTranslation("statistics.weapon_score"), `${checkAndFormat(weaponObject["weapon_score"], 2)}%`]],
    [false, [getTranslation("statistics.damage"), checkAndFormat(weaponObject["damage_min"]) + " – " + checkAndFormat(weaponObject["damage_max"])], [getTranslation("statistics.crit_chance"), checkAndFormat(weaponObject["chance"]) + "%"]],
    [false, [getTranslation("statistics.crit_multiplier"), checkAndFormat(weaponObject["multiplier"]) + "%"], [getTranslation("statistics.health"), `+${checkAndFormat(weaponObject["health"])}`]],
  ];

  if (weaponObject["rarity"] == "COMMON") {
    return formattedWeaponStats;
  } else {
    formattedWeaponStats.push([false, [getTranslation("statistics.max_energy"), `+${checkAndFormat(weaponObject["energy"])}`]]);

    if (weaponObject["rarity"] == "EPIC" || weaponObject["rarity"] == "LEGENDARY") {
      formattedWeaponStats[3].push([getTranslation("statistics.cooldown_reduction"), `+${checkAndFormat(weaponObject["cooldown"])}%`]);

      if (weaponObject["rarity"] == "LEGENDARY") {
        formattedWeaponStats.push([false, [getTranslation("statistics.movement_speed"), `+${checkAndFormat(weaponObject["movement"])}%`]]);
      }

      formattedWeaponStats.push([false, [getTranslation("statistics.forges"), `${checkAndFormat(weaponObject["upgrades"])}/${checkAndFormat(weaponObject["max_upgrades"])}`]]);
    }
  }

  return formattedWeaponStats;
}

function getWarlordsClassStats(specName) {
  let lookupName = specName;

  let warlordsClasses = {
    mage: ["pyromancer", "cryomancer", "aquamancer"],
    paladin: ["protector", "crusader", "avenger"],
    shaman: ["spiritguard", "earthwarden", "thunderlord"],
    warrior: ["berserker", "defender", "revenant"],
  };
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

  let warlordsClassLevel = sumStatsBasic([`${className}_skill1`, `${className}_skill2`, `${className}_skill3`, `${className}_skill4`, `${className}_skill5`, `${className}_health`, `${className}_energy`, `${className}_cooldown`, `${className}_critchance`, `${className}_critmultiplier`], warlordsStats);
  let formattedWarlordsClassLevel;

  let warlordsPrestigedClasses = warlordsStats["prestiged"] || [];
  // check if the array contains the class
  if (warlordsPrestigedClasses.includes(lookupName)) {
    formattedWarlordsClassLevel = generateMinecraftText(`§8[§6${addPrefixZero(warlordsClassLevel, 2)}§8]`);
  } else {
    formattedWarlordsClassLevel = generateMinecraftText(`§8[§7${addPrefixZero(warlordsClassLevel, 2)}§8]`);
  }

  let warlordsClassStats = [
    [false, [getTranslation("statistics.level"), formattedWarlordsClassLevel]],
    [false, [getTranslation("statistics.wins"), checkAndFormat(warlordsStats[`wins_${lookupName}`])], [getTranslation("statistics.losses"), checkAndFormat(warlordsStats[`${lookupName}_plays`] - warlordsStats[`wins_${lookupName}`])], [getTranslation("statistics.wlr"), calculateRatio(warlordsStats[`wins_${lookupName}`], warlordsStats[`${lookupName}_plays`] - warlordsStats[`wins_${lookupName}`])]],
    [false, [getTranslation("statistics.damage_dealt"), veryLargeNumber(warlordsStats[`damage_${lookupName}`]) + " HP"], [getTranslation("statistics.damage_healed"), veryLargeNumber(warlordsStats[`heal_${lookupName}`]) + " HP"]],
  ];

  if (className == "mage") {
    warlordsClassStats[2].push([getTranslation("statistics.damage_prevented"), veryLargeNumber(warlordsStats[`damage_prevented_${lookupName}`]) + " HP"]);
  }

  return warlordsClassStats;
}

function generateUHC() {
  let minigameTemplate = `<div class="chip-container">
    <div class="chip-small but-big">
      <div class="chip-small-background-filter"></div>
      <p class="chip-small-title" data-t="games.uhc">UHC</p>
      <div class="chip-small-container">
        <div class="flex-two-item align-top flippable margin10">
          <div class="card-big-stats">
            <p class="super-subtitle" data-t="games.modes.all.stats">Stats</p>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.wins">Wins</span> <span class="statistic" id="uhc-overall-wins"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.score">Score</span> <span class="statistic" id="uhc-overall-score"><span class="mc">Unknown</span></span></p>
            </div>
          </div>
          <div class="card-big-misc">
            <p class="super-subtitle" data-t="games.modes.all.misc">Misc</p>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.coins">Coins</span> <span class="statistic" id="uhc-overall-coins"><span class="mc">Unknown</span></span></p>
            </div>
          </div>
        </div>
      </div>
      <span class="general-button mright mtop" onclick="showCardWizard('UHC')" data-t="player.generate_card">Generate Card</span>
    </div>
    <div class="flex-two-item chip-container-duo-parent">
      <div id="uhc-chips-1" class="chip-container-duo">
      </div>
      <div id="uhc-chips-2" class="chip-container-duo">
      </div>
    </div>
</div>`;
  let minigameFragment = setupMinigameContainer("flex-container-uhc", minigameTemplate);

  uhcStats = playerData["stats"]["UHC"] || {};
  speedUHCStats = playerData["stats"]["SpeedUHC"] || {};

  let uhcTotalWins = und(speedUHCStats["wins"]) + sumStats(["wins"], ["_solo", "", "_no_diamonds", "_brawl", "_solo_brawl", "_duo_brawl", "_vanilla_doubles"], uhcStats, "", true)[0]; // Add all UHC wins together, including Speed UHC

  updateScopedElement("uhc-overall-wins", locale(uhcTotalWins, 0));
  updateScopedElement("uhc-overall-score", checkAndFormat(und(uhcStats["score"]) + und(speedUHCStats["score"])));
  updateScopedElement("uhc-overall-coins", checkAndFormat(und(uhcStats["coins"])));

  let uhcChip = [
    "uhc-uhcchampions",
    getTranslation("games.modes.uhc.uhcchampions.category"),
    getUHCTitle(uhcStats["score"]),
    `/img/games/uhc/uhcchampions.${imageFileType}`,
    getUHCModeStats("overall"),
    [
      [getTranslation("games.modes.all.overall"), "overall"],
      ["Solo", "solo"],
      ["Teams of 3", ""],
      ["nadeshiko-internal", "hr"],
      ["Red vs. Blue", "red_vs_blue"],
      ["No Diamonds", "no_diamonds"],
      ["Brawl", "brawl"],
      ["Solo Brawl", "solo_brawl"],
      ["Duo Brawl", "duo_brawl"],
      ["Vanilla Doubles", "vanilla_doubles"],
    ],
    `/img/icon/minecraft/golden_apple.png`,
    "uhc",
  ];

  let speedUHCChip = [
    "uhc-speeduhc",
    getTranslation("games.modes.uhc.speeduhc.category"),
    getSpeedUHCTitle(speedUHCStats["score"]),
    `/img/games/uhc/speeduhc.${imageFileType}`,
    getSpeedUHCModeStats("overall"),
    [
      [getTranslation("games.modes.all.overall"), "overall"],
      [getTranslation("games.modes.uhc.speeduhc.solo"), "solo"],
      [getTranslation("games.modes.uhc.speeduhc.team"), "team"],
      ["nadeshiko-internal", "hr"],
      [getTranslation("games.modes.uhc.speeduhc.mastery_berserk"), "mastery_berserk"],
      [getTranslation("games.modes.uhc.speeduhc.mastery_fortune"), "mastery_fortune"],
      [getTranslation("games.modes.uhc.speeduhc.mastery_guardian"), "mastery_guardian"],
      [getTranslation("games.modes.uhc.speeduhc.mastery_huntsman"), "mastery_huntsman"],
      [getTranslation("games.modes.uhc.speeduhc.mastery_invigorate"), "mastery_invigorate"],
      [getTranslation("games.modes.uhc.speeduhc.mastery_master_baker"), "mastery_master_baker"],
      [getTranslation("games.modes.uhc.speeduhc.mastery_sniper"), "mastery_sniper"],
      [getTranslation("games.modes.uhc.speeduhc.mastery_vampirism"), "mastery_vampirism"],
      [getTranslation("games.modes.uhc.speeduhc.mastery_wild_specialist"), "mastery_wild_specialist"],
    ],
    `/img/icon/minecraft/golden_carrot.png`,
    "speeduhc",
  ];

  let uhcChips = [uhcChip, speedUHCChip];
  generateChips(uhcChips, "uhc-chips");

  minigameFragments["uhc"] = minigameFragment;
  document.getElementById("games").appendChild(minigameFragment);
}

function getUHCModeStats(mode) {
  let uhcModeStats;

  if (mode == "overall") {
    uhcUnformattedModeStats = sumStats(["wins", "kills", "deaths", "heads_eaten", "ultimates_crafted"], ["_solo", "", "_no_diamonds", "_brawl", "_solo_brawl", "_duo_brawl", "_vanilla_doubles"], uhcStats, "", true); // red_vs_blue is not included in UHC's overall stats, so it's not included here.

    uhcModeStats = {
      wins: uhcUnformattedModeStats[0],
      kills: uhcUnformattedModeStats[1],
      deaths: uhcUnformattedModeStats[2],
      kdr: calculateRatio(uhcUnformattedModeStats[1], uhcUnformattedModeStats[2]),
      heads_eaten: uhcUnformattedModeStats[3],
      ultimates_crafted: uhcUnformattedModeStats[4],
    };
  } else {
    if (mode != "") {
      mode = `_${mode}`;
    }

    uhcModeStats = {
      wins: uhcStats[`wins${mode}`],
      kills: uhcStats[`kills${mode}`],
      deaths: uhcStats[`deaths${mode}`],
      kdr: calculateRatio(uhcStats[`kills${mode}`], uhcStats[`deaths${mode}`]),
      heads_eaten: uhcStats[`heads_eaten${mode}`],
      ultimates_crafted: uhcStats[`ultimates_crafted${mode}`],
    };
  }

  uhcModeStatsArray = [
    [false, [getTranslation("statistics.wins"), checkAndFormat(uhcModeStats["wins"])]],
    [false, [getTranslation("statistics.kills"), checkAndFormat(uhcModeStats["kills"])], [getTranslation("statistics.deaths"), checkAndFormat(uhcModeStats["deaths"])], [getTranslation("statistics.kdr"), uhcModeStats["kdr"]]],
    [false, [getTranslation("statistics.heads_eaten"), checkAndFormat(uhcModeStats["heads_eaten"])], [getTranslation("statistics.ultimates_crafted"), checkAndFormat(uhcModeStats["ultimates_crafted"])]],
  ];

  if (mode == "overall") {
    uhcModeStatsArray.unshift([false, [getTranslation("statistics.score"), checkAndFormat(uhcStats["score"])]]);
  }

  return uhcModeStatsArray;
}

function getSpeedUHCModeStats(mode) {
  if (mode == "overall") {
    mode = "";
  } else {
    mode = `_${mode}`;
  }

  speedUHCModeStatsArray = [
    [false, [getTranslation("statistics.wins"), checkAndFormat(speedUHCStats[`wins${mode}`])], [getTranslation("statistics.losses"), checkAndFormat(speedUHCStats[`losses${mode}`])], [getTranslation("statistics.wlr"), calculateRatio(speedUHCStats[`wins${mode}`], speedUHCStats[`losses${mode}`])]],
    [false, [getTranslation("statistics.kills"), checkAndFormat(speedUHCStats[`kills${mode}`])], [getTranslation("statistics.deaths"), checkAndFormat(speedUHCStats[`deaths${mode}`])], [getTranslation("statistics.kdr"), calculateRatio(speedUHCStats[`kills${mode}`], speedUHCStats[`deaths${mode}`])]],
  ];

  if (mode == "") {
    speedUHCModeStatsArray.unshift([false, [getTranslation("statistics.score"), checkAndFormat(speedUHCStats[`score`])]]);
  }

  return speedUHCModeStatsArray;
}

function generateSmash() {
  let minigameTemplate = `<div class="chip-container">
    <div class="chip-small but-big">
      <div class="chip-small-background-filter"></div>
      <p class="chip-small-title" data-t="games.smashheroes">Smash Heroes</p>
      <div class="chip-small-container">
        <div class="margin10" style="margin-bottom: 20px">
          <p><span data-t="statistics.smash_level">Smash Level</span> <span class="statistic" id="smashheroes-overall-smash_level"><span class="mc">Unknown</span></span> <span class="m6">✶</span></p>
        </div>
        <div class="flex-two-item align-top flippable margin10">
          <div class="card-big-stats">
            <p class="super-subtitle" data-t="games.modes.all.stats">Stats</p>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.wins">Wins</span> <span class="statistic" id="smashheroes-overall-wins"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.losses">Losses</span> <span class="statistic" id="smashheroes-overall-losses"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.wlr">W/L R</span> <span class="statistic" id="smashheroes-overall-wlr"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.kills">Kills</span> <span class="statistic" id="smashheroes-overall-kills"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.deaths">Deaths</span> <span class="statistic" id="smashheroes-overall-deaths"><span class="mc">Unknown</span></span></p>
              <p><span data-t="statistics.kdr">K/D R</span> <span class="statistic" id="smashheroes-overall-kdr"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.damage_dealt">Damage Dealt</span> <span class="statistic" id="smashheroes-overall-damage_dealt"><span class="mc">Unknown</span></span></p>
            </div>
          </div>
          <div class="card-big-misc">
            <p class="super-subtitle" data-t="games.modes.all.misc">Misc</p>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.selected_hero">Selected Hero</span> <span class="statistic" id="smashheroes-active_class"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.coins">Coins</span> <span class="statistic" id="smashheroes-overall-coins"><span class="mc">Unknown</span></span></p>
            </div>
            <div class="chip-small-statistic-row">
              <p><span data-t="statistics.total_xp">Total XP</span> <span class="statistic" id="smashheroes-overall-xp"><span class="mc">Unknown</span></span></p>
            </div>
          </div>
        </div>
      </div>
      <span class="general-button mright mtop" onclick="showCardWizard('SMASHHEROES')" data-t="player.generate_card">Generate Card</span>
    </div>
    <div id="smashheroes-chips" class="width-100"></div>
    <div class="flex-two-item chip-container-duo-parent">
      <div id="smashheroes-chips-1" class="chip-container-duo">
      </div>
      <div id="smashheroes-chips-2" class="chip-container-duo">
      </div>
    </div>
</div>`;
  let minigameFragment = setupMinigameContainer("flex-container-smashheroes", minigameTemplate);

  smashStats = playerData["stats"]["SuperSmash"] || {};

  let easyStats = ["kills", "deaths", "wins", "losses", "coins", "damage_dealt"];
  let smashClasses = {
    BOTMUN: { name: getTranslation("games.modes.smashheroes.classes.BOTMUN") },
    CAKE_MONSTER: { name: getTranslation("games.modes.smashheroes.classes.CAKE_MONSTER") },
    DUSK_CRAWLER: { name: getTranslation("games.modes.smashheroes.classes.DUSK_CRAWLER") },
    FROSTY: { name: getTranslation("games.modes.smashheroes.classes.FROSTY") },
    GENERAL_CLUCK: { name: getTranslation("games.modes.smashheroes.classes.GENERAL_CLUCK") },
    GOKU: { name: getTranslation("games.modes.smashheroes.classes.GOKU") },
    GREEN_HOOD: { name: getTranslation("games.modes.smashheroes.classes.GREEN_HOOD") },
    MARAUDER: { name: getTranslation("games.modes.smashheroes.classes.MARAUDER") },
    PUG: { name: getTranslation("games.modes.smashheroes.classes.PUG") },
    SANIC: { name: getTranslation("games.modes.smashheroes.classes.SANIC") },
    SERGEANT_SHIELD: { name: getTranslation("games.modes.smashheroes.classes.SERGEANT_SHIELD") },
    SHOOP_DA_WHOOP: { name: getTranslation("games.modes.smashheroes.classes.SHOOP_DA_WHOOP") },
    SKULLFIRE: { name: getTranslation("games.modes.smashheroes.classes.SKULLFIRE") },
    SPODERMAN: { name: getTranslation("games.modes.smashheroes.classes.SPODERMAN") },
    THE_BULK: { name: getTranslation("games.modes.smashheroes.classes.THE_BULK") },
    TINMAN: { name: getTranslation("games.modes.smashheroes.classes.TINMAN") },
  };

  let smashClassesArray = [];

  for (let key in smashClasses) {
    smashClassesArray.push([smashClasses[key]["name"], key]);
  }

  smashClassesArray.sort((a, b) => sortStrings(a[0], b[0]));

  smashClassesArray.unshift([getTranslation("games.modes.all.overall"), ""]);

  let smashFormattedClassesArray = [];
  for (let c = 1; c < smashClassesArray.length; c++) {
    // Adds the prestige to the class name using getSmashPrestige
    let smashPrestige = generateMinecraftText(getSmashPrestige(smashClassesArray[c][1]));
    smashFormattedClassesArray.push([`${smashClassesArray[c][0]}${smashPrestige}`, smashClassesArray[c][1]]);
  }

  for (let e = 0; e < easyStats.length; e++) {
    updateScopedElement(`smashheroes-overall-${easyStats[e]}`, checkAndFormat(smashStats[easyStats[e]]));
  }

  updateScopedElement("smashheroes-overall-wlr", calculateRatio(smashStats["wins"], smashStats["losses"]));
  updateScopedElement("smashheroes-overall-kdr", calculateRatio(smashStats["kills"], smashStats["deaths"]));
  updateScopedElement("smashheroes-overall-smash_level", checkAndFormat(smashStats["smashLevel"]));
  updateScopedElement("smashheroes-overall-damage_dealt", veryLargeNumber(smashStats["damage_dealt"]) + " HP");

  smashTotalXP = 0;
  for (let key in smashClasses) {
    smashTotalXP += smashStats[`xp_${key}`] || 0;
  }
  updateScopedElement("smashheroes-overall-xp", checkAndFormat(smashTotalXP));

  let smashActiveClass = smashStats["active_class"];
  if (smashActiveClass) {
    updateScopedElement("smashheroes-active_class", smashClasses[smashActiveClass]["name"]);
  } else {
    updateScopedElement("smashheroes-active_class", "N/A");
  }

  let smashClassesChip = ["smashheroes-classes", "Heroes", "", `/img/games/smashheroes/heroes.${imageFileType}`, getSmashStats("class", smashClassesArray[1][1]), smashFormattedClassesArray, ``, "smashheroes"];

  let smashSoloChip = ["smashheroes-solo", "Solo", "", `/img/games/smashheroes/solo.${imageFileType}`, getSmashStats("normal", "overall"), smashClassesArray, ``, "smashheroes"];

  let smashTeamChip = ["smashheroes-team", "Team", "", `/img/games/smashheroes/team.${imageFileType}`, getSmashStats("teams", "overall"), smashClassesArray, ``, "smashheroes"];

  let smash2v2Chip = ["smashheroes-2v2", "2v2", "", `/img/games/smashheroes/2v2.${imageFileType}`, getSmashStats("2v2", "overall"), smashClassesArray, ``, "smashheroes"];

  let smash1v1Chip = ["smashheroes-1v1", "1v1", "", `/img/games/smashheroes/1v1.${imageFileType}`, getSmashStats("one_v_one", "overall"), smashClassesArray, ``, "smashheroes"];

  let smashFriendChip = ["smashheroes-friend", "Friends", "", `/img/games/smashheroes/friend.${imageFileType}`, getSmashStats("friend", "overall"), smashClassesArray, ``, "smashheroes"];

  generateChip(smashClassesChip, "smashheroes-chips");

  let smashChips = [smashSoloChip, smashTeamChip, smash2v2Chip, smash1v1Chip, smashFriendChip];
  generateChips(smashChips, "smashheroes-chips");

  minigameFragments["smashheroes"] = minigameFragment;
  document.getElementById("games").appendChild(minigameFragment);
}

/**
 * Get the prestige of a class in Smash Heroes
 * @param {string} className The name of the class
 * @returns {string} The prestige of the class, formatted as Minecraft text
 */
function getSmashPrestige(className) {
  let smashPrestigeIcons = {
    0: "",
    1: " §f①",
    2: " §2②",
    3: " §9③",
    4: " §5④",
    5: " §6⑤",
  };

  return smashPrestigeIcons[smashStats[`pg_${className}`]] || "";
}

function getSmashStats(modeName = "", className = "") {
  if (modeName == "class") {
    let smashAllClassStats = smashStats["class_stats"] || {};
    let smashClassStats = smashAllClassStats[className] || {};

    let smashClassLevel = smashStats[`lastLevel_${className}`] || 0;
    let smashClassPrestige = smashStats[`pg_${className}`] || 0;

    let formattedSmashClassLevel = generateMinecraftText(`§b${addPrefixZero(smashClassLevel, 2)}${getSmashPrestige(className)}`);

    return [
      [false, [getTranslation("statistics.level"), formattedSmashClassLevel]],
      [false, [getTranslation("statistics.wins"), checkAndFormat(smashClassStats["wins"])], [getTranslation("statistics.losses"), checkAndFormat(smashClassStats["losses"])], [getTranslation("statistics.wlr"), calculateRatio(smashClassStats["wins"], smashClassStats["losses"])]],
      [false, [getTranslation("statistics.kills"), checkAndFormat(smashClassStats["kills"])], [getTranslation("statistics.deaths"), checkAndFormat(smashClassStats["deaths"])], [getTranslation("statistics.kdr"), calculateRatio(smashClassStats["kills"], smashClassStats["deaths"])]],
      [false, [getTranslation("statistics.damage_dealt"), veryLargeNumber(smashClassStats["damage_dealt"]) + " HP"]],
    ];
  } else if (className == "overall") {
    // Overall stats are stored in a different place than class stats
    if (modeName != "one_v_one" && modeName != "friend") {
      return [
        [false, [getTranslation("statistics.wins"), checkAndFormat(smashStats[`wins_${modeName}`])], [getTranslation("statistics.losses"), checkAndFormat(smashStats[`losses_${modeName}`])], [getTranslation("statistics.wlr"), calculateRatio(smashStats[`wins_${modeName}`], smashStats[`losses_${modeName}`])]],
        [false, [getTranslation("statistics.kills"), checkAndFormat(smashStats[`kills_${modeName}`])], [getTranslation("statistics.deaths"), checkAndFormat(smashStats[`deaths_${modeName}`])], [getTranslation("statistics.kdr"), calculateRatio(smashStats[`kills_${modeName}`], smashStats[`deaths_${modeName}`])]],
        [false, [getTranslation("statistics.damage_dealt"), veryLargeNumber(smashStats[`damage_dealt_${modeName}`]) + " HP"]],
      ];
    } else {
      // 1v1 and friend stats aren't correctly put in the API, so you have to sum the stats of all classes to get the overall stats
      let smashAllClassStats = smashStats["class_stats"] || {};

      let statWins = 0;
      let statLosses = 0;

      for (let [key, value] of Object.entries(smashAllClassStats)) {
        statWins += und(value[`${modeName}_wins`]);
        statLosses += und(value[`${modeName}_losses`]);
      }

      return [[false, [getTranslation("statistics.wins"), checkAndFormat(statWins)], [getTranslation("statistics.losses"), checkAndFormat(statLosses)], [getTranslation("statistics.wlr"), calculateRatio(statWins, statLosses)]]];
    }
  } else {
    // specified class and mode
    let smashAllClassStats = smashStats["class_stats"] || {};
    let smashClassStats = smashAllClassStats[className] || {};

    if (modeName != "one_v_one" && modeName != "friend") {
      // These modes are formatted differently :(
      return [
        [false, [getTranslation("statistics.wins"), checkAndFormat(smashClassStats[`wins_${modeName}`])], [getTranslation("statistics.losses"), checkAndFormat(smashClassStats[`losses_${modeName}`])], [getTranslation("statistics.wlr"), calculateRatio(smashClassStats[`wins_${modeName}`], smashClassStats[`losses_${modeName}`])]],
        [false, [getTranslation("statistics.kills"), checkAndFormat(smashClassStats[`kills_${modeName}`])], [getTranslation("statistics.deaths"), checkAndFormat(smashClassStats[`deaths_${modeName}`])], [getTranslation("statistics.kdr"), calculateRatio(smashClassStats[`kills_${modeName}`], smashClassStats[`deaths_${modeName}`])]],
        [false, [getTranslation("statistics.damage_dealt"), veryLargeNumber(smashClassStats[`damage_dealt_${modeName}`]) + " HP"]],
      ];
    } else {
      return [[false, [getTranslation("statistics.wins"), checkAndFormat(smashClassStats[`${modeName}_wins`])], [getTranslation("statistics.losses"), checkAndFormat(smashClassStats[`${modeName}_losses`])], [getTranslation("statistics.wlr"), calculateRatio(smashClassStats[`${modeName}_wins`], smashClassStats[`${modeName}_losses`])]]];
    }
  }
}

function generateWoolGames() {
  let minigameTemplate = ` <div class="chip-container" id="woolgames-chips">
        <div class="chip-small but-big">
          <div class="chip-small-background-filter"></div>
          <p class="chip-small-title" data-t="games.woolgames">Wool Games</p>
          <div class="chip-small-container">
            <p class="margin10">
              <span data-t="statistics.level">Level</span> <span id="woolgames-level"><span class="mc">Unknown</span></span>
            </p>
            <div class="progress-bar">
              <span class="progress-number" id="woolgames-progress-number"><span class="mc">Unknown</span></span>
              <div class="progress" style="width: 0%;" id="woolgames-progress-bar"></div>
            </div>
            <div class="flex-two-item align-top flippable margin10">
              <div class="card-big-stats">
                <p class="super-subtitle" data-t="games.modes.all.stats">Stats</p>
                <div class="chip-small-statistic-row">
                  <p><span data-t="statistics.wins">Wins</span> <span class="statistic" id="woolgames-overall-wins"><span class="mc">Unknown</span></span></p>
                  <p><span data-t="statistics.losses">Losses</span> <span class="statistic" id="woolgames-overall-losses"><span class="mc">Unknown</span></span></p>
                  <p><span data-t="statistics.wlr">W/L R</span> <span class="statistic" id="woolgames-overall-wlr"><span class="mc">Unknown</span></span></p>
                </div>
                <div class="chip-small-statistic-row">
                  <p><span data-t="statistics.kills">Kills</span> <span class="statistic" id="woolgames-overall-kills"><span class="mc">Unknown</span></span></p>
                  <p><span data-t="statistics.deaths">Deaths</span> <span class="statistic" id="woolgames-overall-deaths"><span class="mc">Unknown</span></span></p>
                  <p><span data-t="statistics.kdr">K/D R</span> <span class="statistic" id="woolgames-overall-kdr"><span class="mc">Unknown</span></span></p>
                </div>
              </div>
              <div class="card-big-misc">
                <p class="super-subtitle" data-t="games.modes.all.stats">Stats</p>
                <div class="chip-small-statistic-row">
                  <p><span data-t="statistics.wool">Wool</span> <span class="statistic" id="woolgames-overall-coins"><span class="mc">Unknown</span></span></p>
                  <p><span data-t="statistics.layers">Layers</span> <span class="statistic" id="woolgames-overall-available_layers"><span class="mc">Unknown</span></span></p>
                </div>
              </div>
            </div>
          </div>
          <span class="general-button mright mtop" onclick="showCardWizard('WOOLGAMES')" data-t="player.generate_card">Generate Card</span>
        </div>
        <div class="flex-two-item chip-container-duo-parent">
          <div id="woolgames-chips-1" class="chip-container-duo">
          </div>
          <div id="woolgames-chips-2" class="chip-container-duo">
          </div>
        </div>
    </div>`;
  let minigameFragment = setupMinigameContainer("flex-container-woolgames", minigameTemplate);

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

  let woolGamesStats = playerData["stats"]["WoolGames"] || {};
  let woolWarsStats = woolGamesStats["wool_wars"] || {};

  let woolGamesProgression = woolGamesStats["progression"] || {};
  woolWarsNumericalStats = woolWarsStats["stats"] || {};

  let captureTheWoolStats = woolGamesStats["capture_the_wool"] || {};
  let captureTheWoolNumericalStats = captureTheWoolStats["stats"] || {};

  let sheepWarsStats = woolGamesStats["sheep_wars"] || {};
  let sheepWarsNumericalStats = sheepWarsStats["stats"] || {};

  let captureTheWoolStatsObject = {};
  let captureTheWoolArcadeStats = playerData["stats"]["Arcade"] || {}; // For people who haven't logged in since 2024-08-14

  captureTheWoolStatsObject["wins"] = und(captureTheWoolNumericalStats["participated_wins"] || captureTheWoolArcadeStats["woolhunt_participated_wins"]);
  captureTheWoolStatsObject["losses"] = und(captureTheWoolNumericalStats["participated_losses"] || captureTheWoolArcadeStats["woolhunt_participated_losses"]);
  captureTheWoolStatsObject["kills"] = und(captureTheWoolNumericalStats["kills"] || captureTheWoolArcadeStats["woolhunt_kills"]);
  captureTheWoolStatsObject["deaths"] = und(captureTheWoolNumericalStats["deaths"] || captureTheWoolArcadeStats["woolhunt_deaths"]);
  captureTheWoolStatsObject["draws"] = und(captureTheWoolNumericalStats["participated_draws"] || captureTheWoolArcadeStats["participated_draws"]);
  captureTheWoolStatsObject["assists"] = und(captureTheWoolNumericalStats["assists"] || captureTheWoolArcadeStats["woolhunt_assists"]);
  captureTheWoolStatsObject["wools_stolen"] = und(captureTheWoolNumericalStats["wools_stolen"] || captureTheWoolArcadeStats["woolhunt_wools_stolen"]);
  captureTheWoolStatsObject["wools_captured"] = und(captureTheWoolNumericalStats["wools_captured"] || captureTheWoolArcadeStats["woolhunt_wools_captured"]);
  captureTheWoolStatsObject["fastest_win"] = und(captureTheWoolNumericalStats["fastest_win"] || captureTheWoolArcadeStats["woolhunt_fastest_win"], -1);
  captureTheWoolStatsObject["fastest_capture"] = und(captureTheWoolNumericalStats["fastest_wool_capture"] || captureTheWoolArcadeStats["woolhunt_fastest_capture"], -1);

  let woolGamesOverallStats = {};
  woolGamesOverallStats["wins"] = captureTheWoolStatsObject["wins"] + und(woolWarsNumericalStats["wins"]) + und(sheepWarsNumericalStats["wins"]);
  woolGamesOverallStats["losses"] = captureTheWoolStatsObject["losses"] + und(woolWarsNumericalStats["games_played"]) - und(woolWarsNumericalStats["wins"]) + und(sheepWarsNumericalStats["losses"]);
  woolGamesOverallStats["kills"] = captureTheWoolStatsObject["kills"] + und(woolWarsNumericalStats["kills"]) + und(sheepWarsNumericalStats["kills"]);
  woolGamesOverallStats["deaths"] = captureTheWoolStatsObject["deaths"] + und(woolWarsNumericalStats["deaths"]) + und(sheepWarsNumericalStats["deaths"]);

  updateScopedElement("woolgames-overall-wins", checkAndFormat(woolGamesOverallStats["wins"]));
  updateScopedElement("woolgames-overall-losses", checkAndFormat(woolGamesOverallStats["losses"]));
  updateScopedElement("woolgames-overall-kills", checkAndFormat(woolGamesOverallStats["kills"]));
  updateScopedElement("woolgames-overall-deaths", checkAndFormat(woolGamesOverallStats["deaths"]));

  updateScopedElement("woolgames-overall-wlr", calculateRatio(woolGamesOverallStats["wins"], woolGamesOverallStats["losses"]));
  updateScopedElement("woolgames-overall-kdr", calculateRatio(woolGamesOverallStats["kills"], woolGamesOverallStats["deaths"]));

  updateScopedElement("woolgames-overall-coins", checkAndFormat(woolGamesStats["coins"]));
  updateScopedElement("woolgames-overall-available_layers", checkAndFormat(woolGamesProgression["available_layers"]));

  let woolGamesLevel = getWoolGamesLevel(und(woolGamesProgression["experience"]));
  updateScopedElement("woolgames-progress-number", `${Math.floor((woolGamesLevel % 1) * 100)}%`, true);
  activeScope.getElementById("woolgames-progress-bar").style.width = `${(woolGamesLevel % 1) * 100}%`;

  let woolGamesPrestigeIcon;

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
  ];

  let formattedWoolWarsLevel = getGenericWinsPrefix({
    wins: Math.floor(woolGamesLevel),
    winsObject: woolWarsLevels,
    useToGo: false,
    suffix: woolGamesPrestigeIcon,
    useDifferentBracketColors: true,
  })["title"];

  updateScopedElement("woolgames-level", formattedWoolWarsLevel, true);

  let woolWarsChip = [
    "woolwars",
    getTranslation("games.modes.woolgames.woolwars.category"),
    "",
    `/img/games/woolgames/woolwars.${imageFileType}`,
    getWoolWarsStats("overall"),
    [
      [getTranslation("games.modes.all.overall"), "overall"],
      [getTranslation("games.modes.woolgames.woolwars.archer"), "archer"],
      [getTranslation("games.modes.woolgames.woolwars.assault"), "assault"],
      [getTranslation("games.modes.woolgames.woolwars.engineer"), "engineer"],
      [getTranslation("games.modes.woolgames.woolwars.golem"), "golem"],
      [getTranslation("games.modes.woolgames.woolwars.swordsman"), "swordsman"],
      [getTranslation("games.modes.woolgames.woolwars.tank"), "tank"],
    ],
    `/img/icon/minecraft/shears.${imageFileType}`,
    "woolgames",
  ];

  // Capture The Wool
  let captureTheWoolChip = [
    "arcade-stats-capturethewool", // ID
    getTranslation("games.modes.arcade.capturethewool"), // Title
    "", // Subtitle
    `/img/games/woolgames/capturethewool.${imageFileType}`, // Background image
    [
      [false, [getTranslation("statistics.wins"), checkAndFormat(captureTheWoolStatsObject["wins"])], [getTranslation("statistics.losses"), checkAndFormat(captureTheWoolStatsObject["losses"])], [getTranslation("statistics.wlr"), calculateRatio(captureTheWoolStatsObject["wins"], captureTheWoolStatsObject["losses"])]],
      [false, [getTranslation("statistics.kills"), checkAndFormat(captureTheWoolStatsObject["kills"])], [getTranslation("statistics.deaths"), checkAndFormat(captureTheWoolStatsObject["deaths"])], [getTranslation("statistics.kdr"), calculateRatio(captureTheWoolStatsObject["kills"], captureTheWoolStatsObject["deaths"])]],
      [false, [getTranslation("statistics.draws"), checkAndFormat(captureTheWoolStatsObject["draws"])], [getTranslation("statistics.assists"), checkAndFormat(captureTheWoolStatsObject["assists"])]],
      [false, [getTranslation("statistics.wool_picked_up"), checkAndFormat(captureTheWoolStatsObject["wools_stolen"])], [getTranslation("statistics.wool_captured"), checkAndFormat(captureTheWoolStatsObject["wools_captured"])]],
      [false, [getTranslation("statistics.fastest_win"), smallDuration(und(captureTheWoolStatsObject["fastest_win"], -1))], [getTranslation("statistics.fastest_capture"), smallDuration(und(captureTheWoolStatsObject["fastest_capture"], -1))]],
    ], // Displayed stats
    [], // Other stats (shown in drop-down menu)
    `/img/icon/minecraft/orange_wool.${imageFileType}`, // Chip image
    "woolgames", // gamemode
  ];

  let sheepWarsChip = [
    "sheepwars",
    getTranslation("games.modes.woolgames.sheepwars.category"),
    "",
    `/img/games/woolgames/sheepwars.${imageFileType}`,
    [
      [false, [getTranslation("statistics.wins"), checkAndFormat(sheepWarsNumericalStats["wins"])], [getTranslation("statistics.losses"), checkAndFormat(sheepWarsNumericalStats["losses"])], [getTranslation("statistics.wlr"), calculateRatio(sheepWarsNumericalStats["wins"], sheepWarsNumericalStats["losses"])]],
      [false, [getTranslation("statistics.kills"), checkAndFormat(sheepWarsNumericalStats["kills"])], [getTranslation("statistics.deaths"), checkAndFormat(sheepWarsNumericalStats["deaths"])], [getTranslation("statistics.kdr"), calculateRatio(sheepWarsNumericalStats["kills"], sheepWarsNumericalStats["deaths"])]],
      [false, [getTranslation("statistics.damage_dealt"), veryLargeNumber(sheepWarsNumericalStats["damage_dealt"] / 2) + ` ♥&#xFE0E;`], [getTranslation("statistics.magic_wool_hit"), checkAndFormat(sheepWarsNumericalStats["magic_wool_hit"])]],
      [false, [getTranslation("statistics.sheep_thrown"), checkAndFormat(sheepWarsNumericalStats["sheep_thrown"])], [getTranslation("statistics.sheep_killed"), checkAndFormat(playerAchievements["woolgames_sheep_wars_sheep_slayer"])]],
    ],
    [],
    `/img/icon/minecraft/sheep_spawn_egg.${imageFileType}`,
    "woolgames",
  ];

  let woolGamesChips = [captureTheWoolChip, sheepWarsChip, woolWarsChip];
  generateChips(woolGamesChips, "woolgames-chips");

  minigameFragments["woolgames"] = minigameFragment;
  document.getElementById("games").appendChild(minigameFragment);
}

function getWoolWarsStats(mode) {
  let woolWarsModeStats, woolWarsWinStats;

  if (mode == "overall") {
    woolWarsModeStats = woolWarsNumericalStats;
    woolWarsWinStats = [false, [getTranslation("statistics.wins"), checkAndFormat(woolWarsModeStats["wins"])], [getTranslation("statistics.losses"), checkAndFormat(und(woolWarsModeStats["games_played"]) - und(woolWarsModeStats["wins"]))], [getTranslation("statistics.wlr"), calculateRatio(woolWarsModeStats["wins"], und(woolWarsModeStats["games_played"]) - und(woolWarsModeStats["wins"]))]];
  } else {
    woolWarsClassStats = woolWarsNumericalStats["classes"] || {};
    woolWarsModeStats = woolWarsClassStats[mode] || {};
  }

  let woolWarsModeStatsObject = [
    [false, [getTranslation("statistics.kills"), checkAndFormat(woolWarsModeStats["kills"])], [getTranslation("statistics.deaths"), checkAndFormat(woolWarsModeStats["deaths"])], [getTranslation("statistics.kdr"), calculateRatio(woolWarsModeStats["kills"], woolWarsModeStats["deaths"])]],
    [false, [getTranslation("statistics.assists"), checkAndFormat(woolWarsModeStats["assists"])], [getTranslation("statistics.powerups"), checkAndFormat(woolWarsModeStats["powerups_gotten"])]],
    [false, [getTranslation("statistics.wool_placed"), checkAndFormat(woolWarsModeStats["wool_placed"])], [getTranslation("statistics.blocks_broken"), checkAndFormat(woolWarsModeStats["blocks_broken"])]],
  ];

  if (mode == "overall") {
    woolWarsModeStatsObject.unshift(woolWarsWinStats);
  }

  return woolWarsModeStatsObject;
}

function generateFishing() {
  let minigameTemplate = ` <div class="chip-container">
      <div class="chip-small but-big">
        <div class="chip-small-background-filter"></div>
        <p class="chip-small-title" data-t="games.fishing">Fishing</p>
        <div class="chip-small-container">
          <div class="flex-two-item align-top flippable margin10">
            <div class="card-big-stats">
              <p class="super-subtitle" data-t="games.modes.all.stats">Stats</p>
              <div class="chip-small-statistic-row">
                <p><span data-t="statistics.items_caught">Items Caught</span> <span class="statistic" id="fishing-items_caught"><span class="mc">Unknown</span></span></p>
              </div>
              <div class="chip-small-statistic-row">
                <p><span data-t="statistics.fish_caught">Fish Caught</span> <span class="statistic" id="fishing-fish_caught"><span class="mc">Unknown</span></span></p>
                <p><span data-t="statistics.junk_caught">Junk Caught</span> <span class="statistic" id="fishing-junk_caught"><span class="mc">Unknown</span></span></p>
              </div>
              <div class="chip-small-statistic-row">
                <p><span data-t="statistics.treasure_caught">Treasure Caught</span> <span class="statistic" id="fishing-treasure_caught"><span class="mc">Unknown</span></span></p>
                <p><span data-t="statistics.mythical_fish_caught">Mythical Fish Caught</span> <span class="statistic" id="fishing-mythical_fish_caught"><span class="mc">Unknown</span></span></p>
              </div>
            </div>
            <div class="card-big-misc">
              <p class="super-subtitle" data-t="games.modes.all.misc">Misc</p>
              <div class="chip-small-statistic-row">
                <p><span data-t="statistics.special_fish_caught">Special Fish Caught</span> <span class="statistic" id="fishing-special_fish_caught"><span class="mc">Unknown</span></span></p>
              </div>
            </div>
          </div>
        </div>
        <span class="general-button mright mtop" onclick="showCardWizard('FISHING')" data-t="player.generate_card">Generate Card</span>
      </div>
      <div class="flex-two-item chip-container-duo-parent">
        <div id="fishing-chips-1" class="chip-container-duo">
        </div>
        <div id="fishing-chips-2" class="chip-container-duo">
        </div>
      </div>
    </div>`;
  let minigameFragment = setupMinigameContainer("flex-container-fishing", minigameTemplate);

  let mainLobbyStats = playerData["stats"]["MainLobby"] || {};
  fishingStats = mainLobbyStats["fishing"] || {};

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

  updateScopedElement("fishing-items_caught", checkAndFormat(und(overallFishCaught) + und(overallJunkCaught) + und(overallTreasureCaught) + und(overallMythicalFishCaught) + specialFishCount));
  updateScopedElement("fishing-fish_caught", checkAndFormat(overallFishCaught));
  updateScopedElement("fishing-junk_caught", checkAndFormat(overallJunkCaught));
  updateScopedElement("fishing-treasure_caught", checkAndFormat(overallTreasureCaught));
  updateScopedElement("fishing-mythical_fish_caught", checkAndFormat(overallMythicalFishCaught));
  updateScopedElement("fishing-special_fish_caught", checkAndFormat(specialFishCount) + " / " + checkAndFormat(maxSpecialFish));

  if (specialFishCount >= maxSpecialFish) {
    activeScope.getElementById("fishing-special_fish_caught").style.color = "var(--gold)";
  }

  let zoneChip = [
    "fishing-zones",
    getTranslation("games.modes.fishing.zones.category"),
    "",
    `/img/games/fishing/zones.${imageFileType}`,
    getFishingZoneStats("water"),
    [
      [getTranslation("games.modes.fishing.zones.water"), "water"],
      [getTranslation("games.modes.fishing.zones.lava"), "lava"],
      [getTranslation("games.modes.fishing.zones.ice"), "ice"],
    ],
    ``,
    "fishing",
  ];

  let catchesChip = [
    "fishing-catches",
    getTranslation("games.modes.fishing.catches.category"),
    "",
    `/img/games/fishing/catches.${imageFileType}`,
    getFishingCatches("fish"),
    [
      [getTranslation("games.modes.fishing.catches.fish"), "fish"],
      [getTranslation("games.modes.fishing.catches.junk"), "junk"],
      [getTranslation("games.modes.fishing.catches.treasure"), "treasure"],
    ],
    ``,
    "fishing",
  ];

  function getMythicalFishStats() {
    let mythicalFishStats = fishingStats["orbs"] || {};
    let mythicalFishWeight = mythicalFishStats["weight"] || {};

    let mythicalFishArray = ["helios", "selene", "nyx", "aphrodite", "zeus", "archimedes", "hades"];

    let mythicalFishStatsArray = [];

    for (let i = 0; i < mythicalFishArray.length; i += 1) {
      let fish = mythicalFishArray[i];
      let fishWeight = und(mythicalFishWeight[fish]);

      mythicalFishStatsArray.push([false, [getTranslation(`games.modes.fishing.mythicalfish.${fish}`), insertPlaceholders(getTranslation("games.modes.fishing.mythicalfish.weight_formatted"), { caught: checkAndFormat(mythicalFishStats[fish]), weight: checkAndFormat(mythicalFishWeight[fish]) })]]);
    }
    return mythicalFishStatsArray;
  }

  let mythicalFishChip = ["fishing-mythicalfish", getTranslation("games.modes.fishing.mythicalfish.category"), "", `/img/games/fishing/mythicalfish.${imageFileType}`, getMythicalFishStats(), [], ``, "fishing"];

  let specialFishChip = [
    "fishing-specialfish",
    getTranslation("games.modes.fishing.specialfish.category"),
    "",
    `/img/games/fishing/specialfish.${imageFileType}`,
    getSpecialFishStats("permanent"),
    [
      [getTranslation("games.modes.fishing.seasons.permanent"), "permanent"],
      [getTranslation("games.modes.fishing.seasons.easter"), "easter"],
      [getTranslation("games.modes.fishing.seasons.summer"), "summer"],
      [getTranslation("games.modes.fishing.seasons.halloween"), "halloween"],
      [getTranslation("games.modes.fishing.seasons.christmas"), "christmas"],
    ],
    ``,
    "fishing",
  ];

  fishingParticipatedSeasons = getFishingParticipatedSeasons();

  let mostReasonFishingSeason;
  if (fishingParticipatedSeasons.length > 0) {
    mostReasonFishingSeason = formatFishingParticipatedSeason(fishingParticipatedSeasons[0]);
  } else {
    mostReasonFishingSeason = [[false, [getTranslation("games.modes.fishing.seasons.no_seasons"), ""]]];
  }

  let seasonsChip = ["fishing-seasons", getTranslation("games.modes.fishing.seasons.category"), "", `/img/games/fishing/seasons.${imageFileType}`, mostReasonFishingSeason, formatFishingParticipatedSeasonDropdown(fishingParticipatedSeasons), ``, "fishing"];

  let fishingChips = [zoneChip, catchesChip, mythicalFishChip, specialFishChip, seasonsChip];
  generateChips(fishingChips, "fishing-chips");

  minigameFragments["fishing"] = minigameFragment;
  document.getElementById("games").appendChild(minigameFragment);
}

function getFishingZoneStats(zone) {
  let fishingNumericalStats = fishingStats["stats"] || {};
  let zoneStats = getValue(fishingNumericalStats, ["permanent", zone]) || {};

  return [
    [true, [getTranslation("statistics.items_caught"), checkAndFormat(und(zoneStats["fish"]) + und(zoneStats["junk"]) + und(zoneStats["treasure"]))]],
    [false, [getTranslation("statistics.fish_caught"), checkAndFormat(zoneStats["fish"])], [getTranslation("statistics.junk_caught"), checkAndFormat(zoneStats["junk"])]],
    [false, [getTranslation("statistics.treasure_caught"), checkAndFormat(zoneStats["treasure"])]],
  ];
}

function getFishingParticipatedSeasons() {
  let fishingNumericalStats = fishingStats["stats"] || {};
  let years = Object.keys(fishingNumericalStats).filter((key) => !isNaN(key));

  let participatedSeasons = [];

  for (let a = 0; a < years.length; a++) {
    let year = years[a];
    let seasons = Object.keys(fishingNumericalStats[year]);

    for (let b = 0; b < seasons.length; b++) {
      let season = seasons[b];
      let zoneStats = getValue(fishingNumericalStats, [year, season]) || {};

      participatedSeasons.push({
        year: year,
        season: season,
        fish: und(getValue(zoneStats, ["water", "fish"])) + und(getValue(zoneStats, ["lava", "fish"])) + und(getValue(zoneStats, ["ice", "fish"])),
        junk: und(getValue(zoneStats, ["water", "junk"])) + und(getValue(zoneStats, ["lava", "junk"])) + und(getValue(zoneStats, ["ice", "junk"])),
        treasure: und(getValue(zoneStats, ["water", "treasure"])) + und(getValue(zoneStats, ["lava", "treasure"])) + und(getValue(zoneStats, ["ice", "treasure"])),
        orb: und(getValue(zoneStats, ["water", "orb"])) + und(getValue(zoneStats, ["lava", "orb"])) + und(getValue(zoneStats, ["ice", "orb"])),
        name: year + " – " + getTranslation(`games.modes.fishing.seasons.${season}`),
        id: year + "_" + season,
      });
    }
  }

  return participatedSeasons.reverse();
}

function formatFishingParticipatedSeason(season) {
  return [
    [true, [getTranslation("statistics.items_caught"), checkAndFormat(season["fish"] + season["junk"] + season["treasure"] + season["orb"])]],
    [false, [getTranslation("statistics.fish_caught"), checkAndFormat(season["fish"])], [getTranslation("statistics.junk_caught"), checkAndFormat(season["junk"])]],
    [false, [getTranslation("statistics.treasure_caught"), checkAndFormat(season["treasure"])], [getTranslation("statistics.mythical_fish_caught"), checkAndFormat(season["orb"])]],
  ];
}

function formatFishingParticipatedSeasonDropdown(seasonsObject) {
  let seasonsArray = [];

  for (let i = 0; i < seasonsObject.length; i++) {
    seasonsArray.push([seasonsObject[i]["name"], seasonsObject[i]["id"]]);
  }

  return seasonsArray;
}

function getSpecialFishStats(season) {
  let specialFish = {
    permanent: ["puffer_emoji", "nemo", "knockback_slimeball", "hot_potato", "fish_monger_suit_helmet", "fish_monger_suit_chestplate", "fish_monger_suit_leggings", "fish_monger_suit_boots", "barnacle", "leviathan", "star_eater_scales", "rubber_duck"],

    easter: ["egg_the_fish", "cracked_egg", "raw_ham", "carrot", "soggy_hot_cross_bun", "clay_ball", "rose", "cherry_blossom"],

    summer: ["oops_the_fish", "shark", "sea_bass", "sunscreen", "pile_of_sand", "mahi_mahi", "lucent_bee_hive"],

    halloween: ["spook_the_fish", "chocolate_bar", "pumpkin_spice_latte", "angler", "pumpkin_pie", "eyeball", "wayfinders_compass", "molten_iron", "regular_fish", "lava_shark"],

    christmas: ["chill_the_fish_3", "frozen_fish", "festival_pufferfish_hat", "eggnog", "dawning_snowball", "frozen_meal", "festive_lights"],
  };

  let specialFishArray = specialFish[season] || [];
  let formattedSpecialFishArray = [];

  let playerSpecialFish = fishingStats["special_fish"] || {};

  let specialFishStats = [];

  for (let a = 0; a < specialFishArray.length; a++) {
    // Alphabetize array using sortStrings (item 0)
    formattedSpecialFishArray.push([getTranslation(`games.modes.fishing.specialfish.${specialFishArray[a]}`), specialFishArray[a]]);
  }

  formattedSpecialFishArray.sort((a, b) => sortStrings(a[0], b[0]));

  for (let i = 0; i < specialFishArray.length; i += 2) {
    let specialFishRow = [false];

    for (let j = 0; j < 2; j++) {
      let fish = formattedSpecialFishArray[i + j];

      if (fish != undefined) {
        let hasFish = getValue(playerSpecialFish, [fish[1]]) || false;
        specialFishRow.push([fish[0], hasFish ? `<span class="ma">✓</span>` : `<span class="mf">✗</span>`]);
      }
    }

    specialFishStats.push(specialFishRow);
  }

  return specialFishStats;
}

function getFishingCatches(category) {
  let fishingItemCategories = {
    junk: ["leather", "leather_boots", "soggy_paper", "water_bottle", "lily_pad", "tripwire_hook", "ink_sac", "rotten_flesh", "bone", "bowl", "broken_fishing_rod", "stick", "rabbit_hide", "string", "nether_brick", "steak", "lava_bucket", "coal", "charcoal", "fermented_spider_eye", "burned_flesh", "clump_of_leaves", "ice_shard", "snowball", "frozen_flesh"],
    fish: ["clownfish", "salmon", "cod", "pufferfish", "cooked_cod", "charred_pufferfish", "cooked_salmon", "perch", "pike", "trout", "kelp", "dried_kelp"],
    treasure: ["enchanted_fishing_rod", "diamond_sword", "compass", "emerald", "gold_pickaxe", "saddle", "enchanted_bow", "diamond", "enchanted_book", "name_tag", "chainmail_chestplate", "blaze_rod", "eye_of_ender", "magma_cream", "blaze_powder", "molten_gold", "gold_sword", "iron_sword"],
  };

  let fishingItemsArray = fishingItemCategories[category] || [];
  let formattedFishingItemsArray = [];

  let playerFishingItems = getValue(fishingStats, ["stats", "permanent", "individual", category]) || {};

  for (let a = 0; a < fishingItemsArray.length; a++) {
    // Alphabetize array using sortStrings
    formattedFishingItemsArray.push([getTranslation(`games.modes.fishing.catches.${fishingItemsArray[a]}`), fishingItemsArray[a], und(playerFishingItems[fishingItemsArray[a]])]);
  }

  // sort by 2nd item in array, numerical value ascending to descending
  formattedFishingItemsArray.sort(function (a, b) {
    return b[2] - a[2];
  });

  let fishingItemsStats = [];

  for (let a = 0; a < formattedFishingItemsArray.length; a += 2) {
    let fishingItemsRow = [false];

    for (let b = 0; b < 2; b++) {
      let item = formattedFishingItemsArray[a + b];

      if (item != undefined) {
        let itemCount = und(playerFishingItems[item[1]]);
        fishingItemsRow.push([item[0], checkAndFormat(itemCount)]);
      }
    }

    fishingItemsStats.push(fishingItemsRow);
  }

  return fishingItemsStats;
}

function getDuelsTitle(wins, name = "") {
  // Generates a Duels title based on the number of wins a player has in a certain gamemode
  multiplier = name == "" ? 2 : 1; // Multiply required wins by 2 for general Duels titles

  const duelsTitles = [
    { minimumWins: 0, increment: 50, title: getTranslation("games.modes.duels.titles.title_0"), color: "8" },
    { minimumWins: 50, increment: 10, title: getTranslation("games.modes.duels.titles.title_50"), color: "8" },
    { minimumWins: 100, increment: 30, title: getTranslation("games.modes.duels.titles.title_100"), color: "f" },
    { minimumWins: 250, increment: 50, title: getTranslation("games.modes.duels.titles.title_250"), color: "6" },
    { minimumWins: 500, increment: 100, title: getTranslation("games.modes.duels.titles.title_500"), color: "3" },
    { minimumWins: 1000, increment: 200, title: getTranslation("games.modes.duels.titles.title_1000"), color: "2" },
    { minimumWins: 2000, increment: 600, title: getTranslation("games.modes.duels.titles.title_2000"), color: "4", bold: true },
    { minimumWins: 5000, increment: 1000, title: getTranslation("games.modes.duels.titles.title_5000"), color: "e", bold: true },
    { minimumWins: 10000, increment: 3000, title: getTranslation("games.modes.duels.titles.title_10000"), color: "5", bold: true },
    { minimumWins: 25000, increment: 5000, title: getTranslation("games.modes.duels.titles.title_25000"), color: "b", bold: true },
    { minimumWins: 50000, increment: 10000, title: getTranslation("games.modes.duels.titles.title_50000"), color: "d", bold: true },
    { minimumWins: 100000, increment: 10000, max: 50, title: getTranslation("games.modes.duels.titles.title_100000"), color: "c", bold: true },
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
  if (chosenTitle["title"] != getTranslation("games.modes.duels.titles.title_0")) {
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

  if (chosenTitle["title"] == getTranslation("games.modes.duels.titles.title_0")) {
    // Remove name with no title so it just says "No Title"
    name = "";
  }

  let rawDuelsTitle = name + chosenTitle["title"] + romanSuffix;

  return [`<span class="m${chosenTitle["color"]}">` + (chosenTitle["bold"] ? `<strong>${rawDuelsTitle}</strong>` : rawDuelsTitle) + `</span>`, winsToGo, chosenTitle["increment"] * multiplier];
}

function generateChips(chipArray, prefix) {
  // Generates all chips from an array
  for (d = 0; d < chipArray.length; d++) {
    if (!mobileMode) {
      generateChip(chipArray[d], d % 2 == 0 ? prefix + "-1" : prefix + "-2");
    } else {
      generateChip(chipArray[d], prefix + "-1");
    }
  }

  if (mobileMode) {
    activeScope.getElementById(prefix + "-2").style.display = "none";
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
      recentPlayers.splice(foundDuplicate, 1);
    }
    recentPlayers.unshift(newRecentPlayer);
    if (recentPlayers.length > 5) {
      recentPlayers.pop();
    }
  }

  localStorage.setItem(`recent-searches`, JSON.stringify(recentPlayers));
}
