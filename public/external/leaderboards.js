let leaderboards = [
  {
    translation: "games.network",
    type: "b",
    icon: "logo/hypixel_logo",
    leaderboards: [
      { translation: "statistics.level", id: "NETWORK_NETWORK_LEVEL", format: "decimal_2" },
      { translation: "statistics.achievement_points", id: "NETWORK_ACHIEVEMENT_POINTS", format: "number" },
      { translation: "statistics.karma", id: "NETWORK_KARMA", format: "number" },
      { translation: "statistics.quests_completed", id: "NETWORK_QUESTS_COMPLETED", format: "number" },
      { translation: "statistics.ranks_gifted", id: "NETWORK_RANKS_GIFTED", format: "number" },
      { translation: "statistics.first_login", id: "NETWORK_FIRST_LOGIN", format: "date_and_time" },
    ],
  },
  {
    translation: "games.bedwars",
    type: "a",
    icon: "icon/minecraft/red_bed",
    modes: [
      {
        translation: "games.overall",
        type: "b",
        leaderboards: [
          { translation: "statistics.level", id: "BEDWARS_EXP", format: "bedwars_experience" },
          { translation: "statistics.wins", id: "BEDWARS_WINS", format: "number" },
          { translation: "statistics.wlr", id: "BEDWARS_WLR", format: "decimal_2" },
          { translation: "statistics.final_kills", id: "BEDWARS_FINALS", format: "number" },
          { translation: "statistics.fkdr", id: "BEDWARS_FKDR", format: "decimal_2" },
          { translation: "statistics.kills", id: "BEDWARS_KILLS", format: "number" },
          { translation: "statistics.kdr", id: "BEDWARS_KDR", format: "decimal_2" },
          { translation: "statistics.beds_broken", id: "BEDWARS_BEDS", format: "number" },
          { translation: "statistics.bblr", id: "BEDWARS_BBLR", format: "decimal_2" },
          { translation: "statistics.winstreak", id: "BEDWARS_WINSTREAK", format: "number" },
          { translation: "statistics.slumber_tickets_earned", id: "BEDWARS_TICKETS_EARNED", format: "number" },
        ],
      },
      {
        translation: "games.modes.bedwars.eight_one",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "BEDWARS_SOLO_WINS", format: "number" },
          { translation: "statistics.wlr", id: "BEDWARS_SOLO_WLR", format: "decimal_2" },
          { translation: "statistics.final_kills", id: "BEDWARS_SOLO_FINALS", format: "number" },
          { translation: "statistics.fkdr", id: "BEDWARS_SOLO_FKDR", format: "decimal_2" },
          { translation: "statistics.winstreak", id: "BEDWARS_SOLO_WINSTREAK", format: "number" },
        ],
      },
      {
        translation: "games.modes.bedwars.eight_two",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "BEDWARS_DOUBLES_WINS", format: "number" },
          { translation: "statistics.wlr", id: "BEDWARS_DOUBLES_WLR", format: "decimal_2" },
          { translation: "statistics.final_kills", id: "BEDWARS_DOUBLES_FINALS", format: "number" },
          { translation: "statistics.fkdr", id: "BEDWARS_DOUBLES_FKDR", format: "decimal_2" },
          { translation: "statistics.winstreak", id: "BEDWARS_DOUBLES_WINSTREAK", format: "number" },
        ],
      },
      {
        translation: "games.modes.bedwars.four_three",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "BEDWARS_THREES_WINS", format: "number" },
          { translation: "statistics.wlr", id: "BEDWARS_THREES_WLR", format: "decimal_2" },
          { translation: "statistics.final_kills", id: "BEDWARS_THREES_FINALS", format: "number" },
          { translation: "statistics.fkdr", id: "BEDWARS_THREES_FKDR", format: "decimal_2" },
          { translation: "statistics.winstreak", id: "BEDWARS_THREES_WINSTREAK", format: "number" },
        ],
      },
      {
        translation: "games.modes.bedwars.four_four",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "BEDWARS_FOURS_WINS", format: "number" },
          { translation: "statistics.wlr", id: "BEDWARS_FOURS_WLR", format: "decimal_2" },
          { translation: "statistics.final_kills", id: "BEDWARS_FOURS_FINALS", format: "number" },
          { translation: "statistics.fkdr", id: "BEDWARS_FOURS_FKDR", format: "decimal_2" },
          { translation: "statistics.winstreak", id: "BEDWARS_FOURS_WINSTREAK", format: "number" },
        ],
      },
      {
        translation: "games.modes.bedwars.two_four",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "BEDWARS_FOURVFOUR_WINS", format: "number" },
          { translation: "statistics.wlr", id: "BEDWARS_FOURVFOUR_WLR", format: "decimal_2" },
          { translation: "statistics.final_kills", id: "BEDWARS_FOURVFOUR_FINALS", format: "number" },
          { translation: "statistics.fkdr", id: "BEDWARS_FOURVFOUR_FKDR", format: "decimal_2" },
          { translation: "statistics.winstreak", id: "BEDWARS_FOURVFOUR_WINSTREAK", format: "number" },
        ],
      },
    ],
  },
  {
    translation: "games.arcade",
    type: "a",
    icon: "icon/minecraft/slime_ball",
    modes: [
      {
        translation: "games.modes.arcade.dropper",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "ARCADE_DROPPER_WINS", format: "number" },
          { translation: "statistics.best_time", id: "ARCADE_DROPPER_BEST_TIME", format: "duration_milliseconds" },
        ],
      },
      {
        translation: "games.modes.arcade.hypixelsays",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "ARCADE_HYPIXEL_SAYS_WINS", format: "number" }],
      },
      {
        translation: "games.modes.arcade.miniwalls",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "ARCADE_MINI_WALLS_WINS", format: "number" },
          { translation: "statistics.kills", id: "ARCADE_MINI_WALLS_KILLS", format: "number" },
        ],
      },
      {
        translation: "games.modes.arcade.partygames",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "ARCADE_PARTY_WINS", format: "number" }],
      },
      {
        translation: "games.modes.arcade.pixelparty",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "ARCADE_PIXEL_PARTY_WINS", format: "number" }],
      },
      {
        translation: "games.modes.arcade.throwout",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "ARCADE_THROW_OUT_WINS", format: "number" },
          { translation: "statistics.kills", id: "ARCADE_THROW_OUT_KILLS", format: "number" },
        ],
      },
      {
        translation: "games.modes.arcade.zombies.category",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "ARCADE_ZOMBIES_WINS", format: "number" },
          { translation: "statistics.kills", id: "ARCADE_ZOMBIES_KILLS", format: "number" },
          { translation: "statistics.windows_repaired", id: "ARCADE_ZOMBIES_WINDOWS_REPAIRED", format: "number" },
          { translation: "statistics.revives", id: "ARCADE_ZOMBIES_PLAYERS_REVIVED", format: "number" },
          { translation: "statistics.doors_opened", id: "ARCADE_ZOMBIES_DOORS_OPENED", format: "number" },
        ],
      },
    ],
  },
  {
    translation: "games.buildbattle",
    type: "a",
    icon: "icon/minecraft/crafting_table",
    modes: [
      {
        translation: "games.overall",
        type: "b",
        leaderboards: [
          { translation: "statistics.score", id: "BUILD_BATTLE_SCORE", format: "buildbattle_experience" },
          { translation: "statistics.wins", id: "BUILD_BATTLE_WINS", format: "number" },
          { translation: "statistics.correct_guesses", id: "BUILD_BATTLE_GTB_CORRECT_GUESSES", format: "number" },
          { translation: "statistics.votes", id: "BUILD_BATTLE_VOTES", format: "number" },
        ],
      },
      {
        translation: "games.modes.buildbattle.guess_the_build",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "BUILD_BATTLE_GTB_WINS", format: "number" }],
      },
    ],
  },
  {
    translation: "games.duels",
    type: "a",
    icon: "icon/minecraft/fishing_rod",
    modes: [
      {
        translation: "games.overall",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "DUELS_WINS", format: "number" },
          { translation: "statistics.wlr", id: "DUELS_WLR", format: "decimal_2" },
          { translation: "statistics.kills", id: "DUELS_KILLS", format: "number" },
          { translation: "statistics.damage_dealt", id: "DUELS_DAMAGE_DEALT", format: "large_number" },
          { translation: "statistics.health_regenerated", id: "DUELS_HEALTH_REGENERATED", format: "large_number" },
          { translation: "statistics.winstreak", id: "DUELS_WINSTREAK", format: "number" },
          { translation: "statistics.best_winstreak", id: "DUELS_BEST_WINSTREAK", format: "number" },
          { translation: "statistics.clicks", id: "DUELS_CLICKS", format: "number" },
        ],
      },
      {
        translation: "games.modes.duels.bridge.category",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "DUELS_BRIDGE_WINS", format: "number" },
          { translation: "statistics.goals", id: "DUELS_BRIDGE_GOALS", format: "number" },
        ],
      },
      {
        translation: "games.modes.duels.sw.category",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "DUELS_SW_WINS", format: "number" }],
      },
      {
        translation: "games.modes.duels.classic.category",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "DUELS_CLASSIC_WINS", format: "number" }],
      },
      {
        translation: "games.modes.duels.uhc.category",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "DUELS_UHC_WINS", format: "number" }],
      },
      {
        translation: "games.modes.duels.sumo.category",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "DUELS_SUMO_WINS", format: "number" }],
      },
      {
        translation: "games.modes.duels.parkour.category",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "DUELS_PARKOUR_WINS", format: "number" }],
      },
      {
        translation: "games.modes.duels.blitz.category",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "DUELS_BLITZ_WINS", format: "number" }],
      },
      {
        translation: "games.modes.duels.bow.category",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "DUELS_BOW_WINS", format: "number" }],
      },
      {
        translation: "games.modes.duels.mw.category",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "DUELS_MW_WINS", format: "number" }],
      },
      {
        translation: "games.modes.duels.bowspleef.category",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "DUELS_BOWSPLEEF_WINS", format: "number" }],
      },
      {
        translation: "games.modes.duels.op.category",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "DUELS_OP_WINS", format: "number" }],
      },
      {
        translation: "games.modes.duels.combo.category",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "DUELS_COMBO_WINS", format: "number" }],
      },
      {
        translation: "games.modes.duels.boxing.category",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "DUELS_BOXING_WINS", format: "number" }],
      },
      {
        translation: "games.modes.duels.potion.category",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "DUELS_NODEBUFF_WINS", format: "number" }],
      },
      {
        translation: "games.modes.duels.arena.category",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "DUELS_ARENA_WINS", format: "number" }],
      },
    ],
  },
  {
    translation: "games.murdermystery",
    type: "a",
    icon: "icon/minecraft/bow",
    modes: [
      {
        translation: "games.overall",
        type: "b",
        leaderboards: [
          { translation: "statistics.kills", id: "MURDER_MYSTERY_KILLS", format: "number" },
          { translation: "statistics.wins", id: "MURDER_MYSTERY_WINS", format: "number" },
          { translation: "statistics.wins_murderer", id: "MURDER_MYSTERY_MURDERER_WINS", format: "number" },
          { translation: "statistics.wins_detective", id: "MURDER_MYSTERY_DETECTIVE_WINS", format: "number" },
        ],
      },
      {
        translation: "games.modes.murdermystery.MURDER_CLASSIC",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "MURDER_MYSTERY_CLASSIC_WINS", format: "number" }],
      },
      {
        translation: "games.modes.murdermystery.MURDER_DOUBLE_UP",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "MURDER_MYSTERY_DOUBLE_UP_WINS", format: "number" }],
      },
      {
        translation: "games.modes.murdermystery.MURDER_ASSASSINS",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "MURDER_MYSTERY_ASSASSINS_WINS", format: "number" }],
      },
      {
        translation: "games.modes.murdermystery.MURDER_INFECTION",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "MURDER_MYSTERY_INFECTION_WINS", format: "number" }],
      },
    ],
  },
  {
    translation: "games.skywars",
    type: "a",
    icon: "icon/minecraft/ender_eye",
    modes: [
      {
        translation: "games.overall",
        type: "b",
        leaderboards: [
          { translation: "statistics.level", id: "SKYWARS_EXP", format: "skywars_experience" },
          { translation: "statistics.wins", id: "SKYWARS_WINS", format: "number" },
          { translation: "statistics.wlr", id: "SKYWARS_WLR", format: "decimal_2" },
          { translation: "statistics.kills", id: "SKYWARS_KILLS", format: "number" },
          { translation: "statistics.kdr", id: "SKYWARS_KDR", format: "decimal_2" },
        ],
      },
      {
        translation: "multi",
        translations: ["games.modes.skywars.solo", "games.modes.skywars.normal"],
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "SKYWARS_SOLO_NORMAL_WINS", format: "number" },
          { translation: "statistics.wlr", id: "SKYWARS_SOLO_NORMAL_WLR", format: "decimal_2" },
          { translation: "statistics.kills", id: "SKYWARS_SOLO_NORMAL_KILLS", format: "number" },
          { translation: "statistics.kdr", id: "SKYWARS_SOLO_NORMAL_KDR", format: "decimal_2" },
        ],
      },
      {
        translation: "multi",
        translations: ["games.modes.skywars.solo", "games.modes.skywars.insane"],
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "SKYWARS_SOLO_INSANE_WINS", format: "number" },
          { translation: "statistics.wlr", id: "SKYWARS_SOLO_INSANE_WLR", format: "decimal_2" },
          { translation: "statistics.kills", id: "SKYWARS_SOLO_INSANE_KILLS", format: "number" },
          { translation: "statistics.kdr", id: "SKYWARS_SOLO_INSANE_KDR", format: "decimal_2" },
        ],
      },
      {
        translation: "multi",
        translations: ["games.modes.skywars.team", "games.modes.skywars.normal"],
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "SKYWARS_TEAM_NORMAL_WINS", format: "number" },
          { translation: "statistics.wlr", id: "SKYWARS_TEAM_NORMAL_WLR", format: "decimal_2" },
          { translation: "statistics.kills", id: "SKYWARS_TEAM_NORMAL_KILLS", format: "number" },
          { translation: "statistics.kdr", id: "SKYWARS_TEAM_NORMAL_KDR", format: "decimal_2" },
        ],
      },
      {
        translation: "multi",
        translations: ["games.modes.skywars.team", "games.modes.skywars.insane"],
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "SKYWARS_TEAM_INSANE_WINS", format: "number" },
          { translation: "statistics.wlr", id: "SKYWARS_TEAM_INSANE_WLR", format: "decimal_2" },
          { translation: "statistics.kills", id: "SKYWARS_TEAM_INSANE_KILLS", format: "number" },
          { translation: "statistics.kdr", id: "SKYWARS_TEAM_INSANE_KDR", format: "decimal_2" },
        ],
      },
    ],
  },
  {
    translation: "games.pit",
    type: "b",
    icon: "icon/minecraft/dirt",
    leaderboards: [
      { translation: "statistics.level", id: "PIT_EXP", format: "pit_experience" },
      { translation: "statistics.kills", id: "PIT_KILLS", format: "number" },
      { translation: "statistics.gold", id: "PIT_GOLD", format: "large_number" },
      { translation: "statistics.kdr", id: "PIT_KDR", format: "decimal_2" },
      { translation: "statistics.damage_dealt", id: "PIT_DAMAGE_DEALT", format: "large_number" },
      { translation: "statistics.joins", id: "PIT_JOINS", format: "number" },
      { translation: "statistics.playtime", id: "PIT_PLAYTIME", format: "duration_minutes" },
      { translation: "statistics.chat_messages", id: "PIT_CHAT_MESSAGES", format: "number" },
      { translation: "statistics.clicks", id: "PIT_CLICKS", format: "number" },
      { translation: "statistics.wheat_farmed", id: "PIT_WHEAT_FARMED", format: "large_number" },
    ],
  },

  {
    translation: "games.tntgames",
    type: "a",
    icon: "icon/minecraft/tnt",
    modes: [
      {
        translation: "games.overall",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "TNT_GAMES_WINS", format: "number" }],
      },
      {
        translation: "games.modes.tntgames.tntrun.category",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "TNT_GAMES_TNTRUN_WINS", format: "number" },
          { translation: "statistics.best_time", id: "TNT_GAMES_TNTRUN_LONGEST", format: "duration_seconds" },
        ],
      },
      {
        translation: "games.modes.tntgames.pvprun.category",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "TNT_GAMES_PVPRUN_WINS", format: "number" },
          { translation: "statistics.kills", id: "TNT_GAMES_PVPRUN_KILLS", format: "number" },
          { translation: "statistics.best_time", id: "TNT_GAMES_PVPRUN_LONGEST", format: "duration_seconds" },
        ],
      },
      {
        translation: "games.modes.tntgames.bowspleef.category",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "TNT_GAMES_BOWSPLEEF_WINS", format: "number" }],
      },
      {
        translation: "games.modes.tntgames.tntag.category",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "TNT_GAMES_TNTTAG_WINS", format: "number" },
          { translation: "statistics.kills", id: "TNT_GAMES_TNTTAG_KILLS", format: "number" },
        ],
      },
      {
        translation: "games.modes.tntgames.wizards.category",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "TNT_GAMES_WIZARDS_WINS", format: "number" },
          { translation: "statistics.kills", id: "TNT_GAMES_WIZARDS_KILLS", format: "number" },
        ],
      },
    ],
  },
];

const PLAYERS_PER_PAGE = 100;

function getLeaderboardGames() {
  generateGameSelectorChildren(leaderboards, 0, false);
}

function generateGameSelectorChildren(leaderboardObject = {}, layer, event) {
  const MAX_LAYER = 2;

  for (let b = layer; b <= MAX_LAYER; b++) {
    console.log("Clearing layer " + b);
    document.getElementById(`selector-layer-${b}`).innerHTML = "";
  }

  if (event) {
    highlightButton(event.target);
  }

  for (let a in leaderboardObject) {
    let game = leaderboardObject[a];

    let gameButton = document.createElement("span");
    gameButton.classList.add("leaderboard-selector-button");
    gameButton.classList.add("maxed-game");

    let gameTranslation = "";
    if (game["translation"] == "multi") {
      gameTranslations = [];
      for (let translation of game["translations"]) {
        gameTranslations.push(getTranslation(translation));
      }
      gameTranslation = gameTranslations.join(" – ");
    } else {
      gameTranslation = getTranslation(game["translation"]);
    }

    gameButton.innerText = gameTranslation;
    gameButton.setAttribute("data-i", game["id"]);

    if (game["type"] == "a") {
      gameButton.addEventListener("click", function (event) {
        generateGameSelectorChildren(game["modes"], layer + 1, event);
      });
    } else if (game["type"] == "b") {
      gameButton.addEventListener("click", function (event) {
        generateGameSelectorChildren(game["leaderboards"], layer + 1, event);
      });
    } else {
      gameButton.addEventListener("click", function (event) {
        selectLeaderboard(game, event);
      });
    }

    if (game["icon"]) {
      let gameImage = document.createElement("img");
      gameImage.src = `img/${game["icon"]}.png`;
      gameImage.classList.add("leaderboard-icon");
      gameImage.classList.add("icon");

      gameButton.prepend(gameImage);
    }

    document.getElementById(`selector-layer-${layer}`).appendChild(gameButton);
  }
}

function highlightButton(button) {
  let eventSiblings = button.parentElement.children;
  for (let a of eventSiblings) {
    a.classList.remove("selected");
  }

  button.classList.add("selected");
}

function selectLeaderboard(leaderboardObject, event) {
  highlightButton(event.target);
  currentLeaderboardInformation["leaderboard"] = leaderboardObject["id"];
  currentLeaderboardInformation["format"] = leaderboardObject["format"];
  getLeaderboardData(leaderboardObject["id"]);
}

let leaderboardRowTemplate = `
    <div class="flex-two-item-basic">
      <span data-i="ranking" class="leaderboard-rank"></span>
      <img class="leaderboard-head" data-i="head">
      <a data-i="rank-name" target="_blank">
        <span data-i="rank"></span>
        <span data-i="name"></span>
      </a>
    </div>
    <div data-i="quantity" class="tabular" style="text-align: right"></div>
`;

async function getLeaderboardData(leaderboard, page = 1) {
  // connect to leaderboard at /leaderboard?leaderboard=LEADERBOARD_NAME&page=1
  // fetch json data

  let leaderboardPromise = await fetch(`/leaderboard?leaderboard=${leaderboard}&page=${page}`);
  let leaderboardData = await leaderboardPromise.json();

  let leaderboardTable = document.getElementById("leaderboard");
  leaderboardTable.innerHTML = "";
  currentLeaderboardInformation["total_players"] = leaderboardData["count"];
  currentLeaderboardInformation["total_pages"] = Math.ceil(leaderboardData["count"] / PLAYERS_PER_PAGE);
  currentLeaderboardInformation["page"] = page;

  for (let a of leaderboardData["data"]) {
    let row = document.createElement("div");
    row.innerHTML = leaderboardRowTemplate;
    row.classList.add("flex-two-item");
    row.classList.add("row-header");
    row.classList.add("leaderboard-row");
    row.classList.add("no-column-header");

    row.querySelector("[data-i='ranking']").innerText = checkAndFormat(a["ranking"]);

    let playerName = a["tagged_name"];
    /* rank: (\[.*\] ) */
    let playerRankColor;
    if (playerName.substring(0, 1) == "§") {
      playerRankColor = playerName.substring(0, 2);
    } else {
      playerRankColor = "§7";
    }

    let playerRank = "";

    let playerNameWithoutRank = playerName.replace(/(\[.*\] )/, (substring) => {
      playerRank = substring.trim();
      return "";
    });

    playerRank = playerRankColor + playerRank;

    console.log([playerNameWithoutRank, playerRank]);

    updateTag(row, "rank", generateMinecraftText(playerRank), true);
    updateTag(row, "name", generateMinecraftText(playerNameWithoutRank), true);

    let playerBadge = a["badge"] || "NONE";
    checkBadgeInList(playerBadge, row);

    row.querySelector(`[data-i="head"]`).src = `https://minotar.net/helm/${a["uuid"]}/8.png`;
    row.querySelector("[data-i='rank-name']").href = `/player/${a["uuid"]}`;
    updateTag(row, "quantity", formatLeaderboardStatistic(currentLeaderboardInformation["format"], a["value"]), true);

    leaderboardTable.appendChild(row);
  }

  if (currentLeaderboardInformation["page"] == 1) {
    document.getElementById("pagination-previous").classList.add("disabled");
  } else {
    document.getElementById("pagination-previous").classList.remove("disabled");
  }

  if (currentLeaderboardInformation["page"] == currentLeaderboardInformation["total_pages"]) {
    document.getElementById("pagination-next").classList.add("disabled");
  } else {
    document.getElementById("pagination-next").classList.remove("disabled");
  }

  document.getElementById("pagination").style.display = "flex";
  document.getElementById("page-number").innerText = insertPlaceholders(getTranslation(["leaderboards", "page_number"]), { page: page, total: Math.ceil(leaderboardData["count"] / PLAYERS_PER_PAGE) });
}

const icons = {
  network: "logo/hypixel_logo",
  arcade: "icon/minecraft/slime_ball",
  bedwars: "icon/minecraft/red_bed",
  blitz: "icon/minecraft/diamond_sword",
  buildbattle: "icon/minecraft/crafting_table",
  copsandcrims: "icon/minecraft/iron_bars",
  duels: "icon/minecraft/fishing_rod",
  megawalls: "icon/minecraft/soul_sand",
  murdermystery: "icon/minecraft/bow",
  pit: "icon/minecraft/dirt",
  skywars: "icon/minecraft/ender_eye",
  smashheroes: "icon/minecraft/head_smashheroes",
  tntgames: "icon/minecraft/tnt",
  uhc: "icon/minecraft/golden_apple",
  warlords: "icon/minecraft/stone_axe",
  woolgames: "icon/minecraft/white_wool",

  arena: "icon/minecraft/blaze_powder",
  vampirez: "icon/minecraft/wither_skeleton_skull",
  walls: "icon/minecraft/sand",
  paintball: "icon/minecraft/snowball",
  quakecraft: "icon/minecraft/firework_rocket",
  tkr: "icon/minecraft/minecart",
};

function formatLeaderboardStatistic(leaderboard, value) {
  let leaderboardType = currentLeaderboardInformation["format"];
  switch (leaderboardType) {
    case "decimal_2":
      return checkAndFormat(Number(value), 2);
    case "bedwars_experience":
      return generateMinecraftText(formatBedWarsLevel(getBedWarsLevel(value)), true);
    case "pit_experience":
      return generateMinecraftText(pitXpToLevel(value));
    case "buildbattle_experience":
      return generateMinecraftText(getBuildBattleTitle(value)["title"], true) + " / " + checkAndFormat(Number(value));
    case "skywars_experience":
      return generateMinecraftText(formatSkyWarsLevel(getSkyWarsLevel(value)), true);
    case "large_number":
      return veryLargeNumber(Number(value));
    case "duration_minutes":
      return smallDuration(Number(value) * 60);
    case "duration_seconds":
      return smallDuration(Number(value));
    case "duration_seconds_ms":
      return smallDuration(Number(value), true);
    case "duration_milliseconds":
      return smallDuration(Number(value / 1000), true);
    case "date_and_time":
      return mediumDateFormat(Number(value));
    case "number":
      return checkAndFormat(Number(value));
    case "string":
      return value;
    default:
      if (!isNaN(value)) {
        return checkAndFormat(Number(value));
      } else {
        return value;
      }
  }
}

function showNewPage(jump) {
  let currentPage = currentLeaderboardInformation["page"];
  let totalPages = currentLeaderboardInformation["total_pages"];
  let currentLeaderboard = currentLeaderboardInformation["leaderboard"];

  if (jump == "next") {
    if (currentPage < totalPages) {
      getLeaderboardData(currentLeaderboard, currentPage + 1);
    } else {
      console.log("Can't go to next page");
    }
  } else if (jump == "previous") {
    if (currentPage > 1) {
      getLeaderboardData(currentLeaderboard, currentPage - 1);
    } else {
      console.log("Can't go to previous page");
    }
  }
}
