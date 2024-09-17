let leaderboards = {
  "NETWORK": [
      "NETWORK_FIRST_LOGIN",
      "NETWORK_NETWORK_LEVEL",
      "NETWORK_ACHIEVEMENT_POINTS",
      "NETWORK_KARMA",
      "NETWORK_RANKS_GIFTED",
      "NETWORK_QUESTS_COMPLETED"
  ],
  "BEDWARS": [
      "BEDWARS_EXP",
      "BEDWARS_TICKETS_EARNED",
      "BEDWARS_COMPLETED_CHALLENGES",
      "BEDWARS_COLLECTED_EMERALDS",
      "BEDWARS_COLLECTED_DIAMONDS",
      "BEDWARS_WINS",
      "BEDWARS_WLR",
      "BEDWARS_FINALS",
      "BEDWARS_FKDR",
      "BEDWARS_KILLS",
      "BEDWARS_KDR",
      "BEDWARS_BEDS",
      "BEDWARS_BBLR",
      "BEDWARS_SOLO_WINS",
      "BEDWARS_SOLO_WLR",
      "BEDWARS_SOLO_FINALS",
      "BEDWARS_SOLO_FKDR",
      "BEDWARS_DOUBLES_WINS",
      "BEDWARS_DOUBLES_WLR",
      "BEDWARS_DOUBLES_FINALS",
      "BEDWARS_DOUBLES_FKDR",
      "BEDWARS_THREES_WINS",
      "BEDWARS_THREES_WLR",
      "BEDWARS_THREES_FINALS",
      "BEDWARS_THREES_FKDR",
      "BEDWARS_FOURS_WINS",
      "BEDWARS_FOURS_WLR",
      "BEDWARS_FOURS_FINALS",
      "BEDWARS_FOURS_FKDR",
      "BEDWARS_FOURVFOUR_WINS",
      "BEDWARS_FOURVFOUR_WLR",
      "BEDWARS_FOURVFOUR_FINALS",
      "BEDWARS_FOURVFOUR_FKDR"
  ],
  "DUELS": [
      "DUELS_CLICKS",
      "DUELS_WINS",
      "DUELS_WLR",
      "DUELS_KILLS",
      "DUELS_DAMAGE_DEALT",
      "DUELS_HEALTH_REGENERATED",
      "DUELS_WINSTREAK",
      "DUELS_BEST_WINSTREAK",
      "DUELS_BRIDGE_WINS",
      "DUELS_BRIDGE_GOALS",
      "DUELS_SW_WINS",
      "DUELS_CLASSIC_WINS",
      "DUELS_UHC_WINS",
      "DUELS_SUMO_WINS",
      "DUELS_PARKOUR_WINS",
      "DUELS_BLITZ_WINS",
      "DUELS_BOW_WINS",
      "DUELS_MW_WINS",
      "DUELS_BOWSPLEEF_WINS",
      "DUELS_OP_WINS",
      "DUELS_COMBO_WINS",
      "DUELS_BOXING_WINS",
      "DUELS_NODEBUFF_WINS",
      "DUELS_ARENA_WINS"
  ],
  "SKYWARS": [
      "SKYWARS_EXP",
      "SKYWARS_LONGEST_BOW_KILL",
      "SKYWARS_WINSTREAK",
      "SKYWARS_WINS",
      "SKYWARS_WLR",
      "SKYWARS_KILLS",
      "SKYWARS_KDR",
      "SKYWARS_SOLO_NORMAL_WINS",
      "SKYWARS_SOLO_NORMAL_WLR",
      "SKYWARS_SOLO_NORMAL_KILLS",
      "SKYWARS_SOLO_NORMAL_KDR",
      "SKYWARS_SOLO_INSANE_WINS",
      "SKYWARS_SOLO_INSANE_WLR",
      "SKYWARS_SOLO_INSANE_KILLS",
      "SKYWARS_SOLO_INSANE_KDR",
      "SKYWARS_TEAM_NORMAL_WINS",
      "SKYWARS_TEAM_NORMAL_WLR",
      "SKYWARS_TEAM_NORMAL_KILLS",
      "SKYWARS_TEAM_NORMAL_KDR",
      "SKYWARS_TEAM_INSANE_WINS",
      "SKYWARS_TEAM_INSANE_WLR",
      "SKYWARS_TEAM_INSANE_KILLS",
      "SKYWARS_TEAM_INSANE_KDR"
  ],
  "PIT": [
      "PIT_JOINS",
      "PIT_PLAYTIME",
      "PIT_CHAT_MESSAGES",
      "PIT_CLICKS",
      "PIT_KILLS",
      "PIT_KDR",
      "PIT_WHEAT_FARMED"
  ],
  "BUILD_BATTLE": [
      "BUILD_BATTLE_WINS",
      "BUILD_BATTLE_GTB_WINS",
      "BUILD_BATTLE_GTB_CORRECT_GUESSES",
      "BUILD_BATTLE_SCORE",
      "BUILD_BATTLE_VOTES"
  ],
  "MURDER_MYSTERY": [
      "MURDER_MYSTERY_KILLS",
      "MURDER_MYSTERY_WINS",
      "MURDER_MYSTERY_MURDERER_WINS",
      "MURDER_MYSTERY_DETECTIVE_WINS",
      "MURDER_MYSTERY_CLASSIC_WINS",
      "MURDER_MYSTERY_DOUBLE_UP_WINS",
      "MURDER_MYSTERY_ASSASSINS_WINS",
      "MURDER_MYSTERY_INFECTION_WINS"
  ],
  "TNT_GAMES": [
      "TNT_GAMES_WINS",
      "TNT_GAMES_WIZARDS_WINS",
      "TNT_GAMES_TNTRUN_WINS",
      "TNT_GAMES_BOWSPLEEF_WINS",
      "TNT_GAMES_PVPRUN_WINS",
      "TNT_GAMES_TNTTAG_WINS",
      "TNT_GAMES_WIZARDS_KILLS",
      "TNT_GAMES_PVPRUN_KILLS",
      "TNT_GAMES_TNTTAG_KILLS",
      "TNT_GAMES_TNTRUN_LONGEST",
      "TNT_GAMES_PVPRUN_LONGEST"
  ],
  "ARCADE": [
      "ARCADE_DROPPER_BEST_TIME",
      "ARCADE_DROPPER_WINS",
      "ARCADE_HYPIXEL_SAYS_WINS",
      "ARCADE_MINI_WALLS_WINS",
      "ARCADE_MINI_WALLS_KILLS",
      "ARCADE_PARTY_WINS",
      "ARCADE_PIXEL_PARTY_WINS",
      "ARCADE_THROW_OUT_WINS",
      "ARCADE_THROW_OUT_KILLS",
      "ARCADE_ZOMBIES_WINS",
      "ARCADE_ZOMBIES_KILLS",
      "ARCADE_ZOMBIES_WINDOWS_REPAIRED",
      "ARCADE_ZOMBIES_PLAYERS_REVIVED",
      "ARCADE_ZOMBIES_DOORS_OPENED"
  ]
}

function getGameId(game) {
  let specialGameIds = {
  };

  if (specialGameIds[game]) {
    return specialGameIds[game];
  }

  return game.toLowerCase().replaceAll("_", "");
}

/* <span class="maxed-game leaderboard-selector-button"><img>Housing</span>*/
function getLeaderboardGames() {
  for (let a in leaderboards) {
    console.log(a);
    let game = a;
    let gameId = getGameId(game);

    let gameButton = document.createElement("span");
    gameButton.classList.add("leaderboard-selector-button");
    gameButton.classList.add("maxed-game");
    gameButton.innerText = getTranslation(["games", gameId]);
    gameButton.setAttribute("data-i", gameId);
    gameButton.addEventListener("click", () => {
      selectGame(game);
    });

    let gameImage = document.createElement("img");
    gameImage.src = `/img/${icons[gameId]}.${imageFileType}`;
    gameImage.classList.add("leaderboard-icon");
    gameImage.classList.add("icon");

    gameButton.prepend(gameImage);

    document.getElementById("game-selector").appendChild(gameButton);
  }
}

function selectGame(game) {
  let gameId = getGameId(game);

  document.querySelectorAll(".leaderboard-selector-button").forEach((button) => {
    button.classList.remove("selected");
  });

  document.getElementById("game-selector").querySelector(`[data-i="${gameId}"]`).classList.add("selected");

  let gameLeaderboards = leaderboards[game];
  let leaderboardSelector = document.getElementById("leaderboard-selector");

  leaderboardSelector.innerHTML = "";
  for (let a of gameLeaderboards) {
    let leaderboard = document.createElement("span");
    leaderboard.classList.add("leaderboard-selector-button");
    leaderboard.classList.add("maxed-game");
    leaderboard.setAttribute("data-i", a);
    leaderboard.innerText = englishTranslations[a] || "???" /*getTranslation(["leaderboards", a]);*/
    leaderboard.addEventListener("click", () => {
      selectLeaderboard(a);
    });

    leaderboardSelector.appendChild(leaderboard);
  }
}

function selectLeaderboard(leaderboard) {
  document.querySelectorAll("#leaderboard-selector .leaderboard-selector-button").forEach((button) => {
    button.classList.remove("selected");
  });

  document.getElementById("leaderboard-selector").querySelector(`[data-i="${leaderboard}"]`).classList.add("selected");

  getLeaderboardData(leaderboard);
}

let leaderboardRowTemplate = `
    <div class="flex-two-item-basic">
      <span data-i="rank" class="leaderboard-rank"></span>
      <img class="leaderboard-head" data-i="head">
      <a data-i="name" target="_blank"></a>
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
  currentLeaderboardInformation["leaderboard"] = leaderboard;
  currentLeaderboardInformation["page"] = page;

  for (let a of leaderboardData["data"]) {
    console.log(a);
    let row = document.createElement("div");
    row.innerHTML = leaderboardRowTemplate;
    console.log(row.innerHTML);
    row.classList.add("flex-two-item");
    row.classList.add("row-header");
    row.classList.add("leaderboard-row");
    row.classList.add("no-column-header");

    row.querySelector("[data-i='rank']").innerText = checkAndFormat(a["ranking"]);
    updateTag(row, "name", generateMinecraftText(a["tagged_name"]), true);
    
    let playerBadge = a["badge"] || "NONE";
    checkBadgeInList(playerBadge, row);

    row.querySelector(`[data-i="head"]`).src = `https://minotar.net/helm/${a["uuid"]}/8.png`;
    row.querySelector("[data-i='name']").href = `/player/${a["uuid"]}`;
    updateTag(row, "quantity", formatLeaderboardStatistic(leaderboard, a["value"]), true);

    leaderboardTable.appendChild(row);
  }

  document.getElementById("pagination").style.display = "flex";
  document.getElementById("page-number").innerText = insertPlaceholders(getTranslation(["leaderboards", "page_number"]), {page: page, total: Math.ceil(leaderboardData["count"] / 100)});
}

const icons = {
  network: "logo/hypixel_logo",
  arcade: "icon/minecraft/slime_ball",
  bedwars: "icon/minecraft/red_bed",
  blitz: "icon/minecraft/diamond_sword",
  buildbattle: "icon/minecraft/crafting_table",
  classic: "icon/minecraft/jukebox",
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
};

function formatLeaderboardStatistic(leaderboard, value) {
  let leaderboardType = getLeaderboardType(leaderboard);
  switch (leaderboardType) {
    case "decimal_2":
      return checkAndFormat(Number(value), 2);
    case "bedwars_experience":
      return generateMinecraftText(formatBedWarsLevel(getBedWarsLevel(value)));
    case "large_number":
      return veryLargeNumber(Number(value));
    case "duration_minutes":
      return smallDuration(Number(value) * 60);
    case "duration_seconds":
      return smallDuration(Number(value));
    case "duration_seconds_ms":
      return smallDuration(Number(value), true);
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
  let totalPlayers = currentLeaderboardInformation["total_players"];
  let currentLeaderboard = currentLeaderboardInformation["leaderboard"];

  if (jump == "next") {
    if (currentPage * 100 < totalPlayers) {
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

function getLeaderboardType(leaderboardName) {

  if (leaderboardName.endsWith("_WLR") || leaderboardName.endsWith("_FKDR") || leaderboardName.endsWith("_KDR") || leaderboardName.endsWith("_BBLR") || leaderboardName.endsWith("_WLR") || leaderboardName.endsWith("_WLR")) {
    return "decimal_2";
  }

  let specialLeaderboardTypes = {
    NETWORK_FIRST_LOGIN: "date_and_time",
    NETWORK_NETWORK_LEVEL: "decimal_2",
    BEDWARS_EXP: "bedwars_experience",
    DUELS_DAMAGE_DEALT: "large_number",
    DUELS_HEALTH_REGENERATED: "large_number",
    DUELS_CLICKS: "large_number",
    SKYWARS_EXP: "skywars_experience",
    PIT_PLAYTIME: "duration_minutes",
    PIT_CLICKS: "large_number",
    DROPPER_BEST_TIME: "duration_seconds_ms",
    TNT_GAMES_PVPRUN_LONGEST: "duration_seconds",
    TNT_GAMES_TNTRUN_LONGEST: "duration_seconds",
  };

  if (specialLeaderboardTypes[leaderboardName]) {
    return specialLeaderboardTypes[leaderboardName];
  }

  return "number";
}

let englishTranslations = {  
  "NETWORK_FIRST_LOGIN": "First Login",
  "NETWORK_NETWORK_LEVEL": "Network Level",
  "NETWORK_ACHIEVEMENT_POINTS": "Achievement Points",
  "NETWORK_KARMA": "Karma",
  "NETWORK_RANKS_GIFTED": "Ranks Gifted",
  "NETWORK_QUESTS_COMPLETED": "Quests Completed",
  "BEDWARS_EXP": "Level",
  "BEDWARS_TICKETS_EARNED": "Tickets Earned",
  "BEDWARS_COMPLETED_CHALLENGES": "Completed Challenges",
  "BEDWARS_COLLECTED_EMERALDS": "Collected Emeralds",
  "BEDWARS_COLLECTED_DIAMONDS": "Collected Diamonds",
  "BEDWARS_WINS": "Overall: Wins",
  "BEDWARS_WLR": "Overall: W/L R",
  "BEDWARS_FINALS": "Overall: Final Kills",
  "BEDWARS_FKDR": "Overall: FK/D R",
  "BEDWARS_KILLS": "Overall: Kills",
  "BEDWARS_KDR": "Overall: K/D R",
  "BEDWARS_BEDS": "Overall: Beds Broken",
  "BEDWARS_BBLR": "Overall: BB/L R",
  "BEDWARS_SOLO_WINS": "Solo: Wins",
  "BEDWARS_SOLO_WLR": "Solo: W/L R",
  "BEDWARS_SOLO_FINALS": "Solo: Final Kills",
  "BEDWARS_SOLO_FKDR": "Solo: FK/D R",
  "BEDWARS_DOUBLES_WINS": "Doubles: Wins",
  "BEDWARS_DOUBLES_WLR": "Doubles: W/L R",
  "BEDWARS_DOUBLES_FINALS": "Doubles: Final Kills",
  "BEDWARS_DOUBLES_FKDR": "Doubles: FK/D R",
  "BEDWARS_THREES_WINS": "3v3v3v3: Wins",
  "BEDWARS_THREES_WLR": "3v3v3v3: W/L R",
  "BEDWARS_THREES_FINALS": "3v3v3v3: Final Kills",
  "BEDWARS_THREES_FKDR": "3v3v3v3: FK/D R",
  "BEDWARS_FOURS_WINS": "4v4v4v4: Wins",
  "BEDWARS_FOURS_WLR": "4v4v4v4: W/L R",
  "BEDWARS_FOURS_FINALS": "4v4v4v4: Final Kills",
  "BEDWARS_FOURS_FKDR": "4v4v4v4: FK/D R",
  "BEDWARS_FOURVFOUR_WINS": "4v4: Wins",
  "BEDWARS_FOURVFOUR_WLR": "4v4: W/L R",
  "BEDWARS_FOURVFOUR_FINALS": "4v4: Final Kills",
  "BEDWARS_FOURVFOUR_FKDR": "4v4: FK/D R",
  "DUELS_CLICKS": "Clicks",
  "DUELS_DAMAGE_DEALT": "Damage Dealt",
  "DUELS_HEALTH_REGENERATED": "Health Regenerated",
  "DUELS_WINS": "Overall Wins",
  "DUELS_WLR": "Overall W/L R",
  "DUELS_KILLS": "Overall Kills",
  "DUELS_WINSTREAK": "Overall: Winstreak",
  "DUELS_BEST_WINSTREAK": "Overall: Best Winstreak",
  "DUELS_BRIDGE_WINS": "Bridge: Wins",
  "DUELS_BRIDGE_GOALS": "Bridge: Goals",
  "DUELS_SW_WINS": "SkyWars: Wins",
  "DUELS_CLASSIC_WINS": "Classic: Wins",
  "DUELS_UHC_WINS": "UHC: Wins",
  "DUELS_SUMO_WINS": "Sumo: Wins",
  "DUELS_PARKOUR_WINS": "Parkour: Wins",
  "DUELS_BLITZ_WINS": "Blitz: Wins",
  "DUELS_BOW_WINS": "Bow: Wins",
  "DUELS_MW_WINS": "MW: Wins",
  "DUELS_BOWSPLEEF_WINS": "Bowspleef: Wins",
  "DUELS_OP_WINS": "OP: Wins",
  "DUELS_COMBO_WINS": "Combo: Wins",
  "DUELS_BOXING_WINS": "Boxing: Wins",
  "DUELS_NODEBUFF_WINS": "Nodebuff: Wins",
  "DUELS_ARENA_WINS": "Arena: Wins",
  "SKYWARS_EXP": "Level",
  "SKYWARS_WINS": "Overall: Wins",
  "SKYWARS_WLR": "Overall: W/L R",
  "SKYWARS_KILLS": "Overall: Kills",
  "SKYWARS_KDR": "Overall: K/D R",
  "SKYWARS_SOLO_NORMAL_WINS": "Solo Normal: Wins",
  "SKYWARS_SOLO_NORMAL_WLR": "Solo Normal: W/L R",
  "SKYWARS_SOLO_NORMAL_KILLS": "Solo Normal: Kills",
  "SKYWARS_SOLO_NORMAL_KDR": "Solo Normal: K/D R",
  "SKYWARS_SOLO_INSANE_WINS": "Solo Insane: Wins",
  "SKYWARS_SOLO_INSANE_WLR": "Solo Insane: W/L R",
  "SKYWARS_SOLO_INSANE_KILLS": "Solo Insane: Kills",
  "SKYWARS_SOLO_INSANE_KDR": "Solo Insane: K/D R",
  "SKYWARS_TEAM_NORMAL_WINS": "Team Normal: Wins",
  "SKYWARS_TEAM_NORMAL_WLR": "Team Normal: W/L R",
  "SKYWARS_TEAM_NORMAL_KILLS": "Team Normal: Kills",
  "SKYWARS_TEAM_NORMAL_KDR": "Team Normal: K/D R",
  "SKYWARS_TEAM_INSANE_WINS": "Team Insane: Wins",
  "SKYWARS_TEAM_INSANE_WLR": "Team Insane: W/L R",
  "SKYWARS_TEAM_INSANE_KILLS": "Team Insane: Kills",
  "SKYWARS_TEAM_INSANE_KDR": "Team Insane: K/D R",
  "PIT_JOINS": "Joins",
  "PIT_PLAYTIME": "Playtime",
  "PIT_CHAT_MESSAGES": "Chat Messages",
  "PIT_CLICKS": "Clicks",
  "PIT_KILLS": "Kills",
  "PIT_KDR": "K/D R",
  "PIT_WHEAT_FARMED": "Wheat Farmed",
  "BUILD_BATTLE_WINS": "Overall: Wins",
  "BUILD_BATTLE_SCORE": "Score",
  "BUILD_BATTLE_VOTES": "Votes",
  "BUILD_BATTLE_GTB_WINS": "Guess The Build: Wins",
  "BUILD_BATTLE_GTB_CORRECT_GUESSES": "Guess The Build: Correct Guesses",
  "MURDER_MYSTERY_KILLS": "Overall: Kills",
  "MURDER_MYSTERY_WINS": "Overall: Wins",
  "MURDER_MYSTERY_MURDERER_WINS": "Overall: Murderer Wins",
  "MURDER_MYSTERY_DETECTIVE_WINS": "Overall: Detective Wins",
  "MURDER_MYSTERY_CLASSIC_WINS": "Classic: Wins",
  "MURDER_MYSTERY_DOUBLE_UP_WINS": "Double Up: Wins",
  "MURDER_MYSTERY_ASSASSINS_WINS": "Assassins: Wins",
  "MURDER_MYSTERY_INFECTION_WINS": "Infection: Wins",
  "TNT_GAMES_WINS": "Overall: Wins",
  "TNT_GAMES_BOWSPLEEF_WINS": "Bowspleef: Wins",
  "TNT_GAMES_PVPRUN_WINS": "PVP Run: Wins",
  "TNT_GAMES_PVPRUN_KILLS": "PVP Run: Kills",
  "TNT_GAMES_PVPRUN_LONGEST": "PVP Run: Longest Game",
  "TNT_GAMES_TNTRUN_WINS": "TNT Run: Wins",
  "TNT_GAMES_TNTRUN_LONGEST": "TNT Run: Longest Game",
  "TNT_GAMES_TNTTAG_WINS": "TNT Tag: Wins",
  "TNT_GAMES_TNTTAG_KILLS": "TNT Tag: Kills",
  "TNT_GAMES_WIZARDS_WINS": "Wizards: Wins",
  "TNT_GAMES_WIZARDS_KILLS": "Wizards: Kills",
  "ARCADE_DROPPER_BEST_TIME": "Dropper: Best Time",
  "ARCADE_DROPPER_WINS": "Dropper: Wins",
  "ARCADE_HYPIXEL_SAYS_WINS": "Hypixel Says: Wins",
  "ARCADE_MINI_WALLS_WINS": "Mini Walls: Wins",
  "ARCADE_MINI_WALLS_KILLS": "Mini Walls: Kills",
  "ARCADE_PARTY_WINS": "Party Games: Wins",
  "ARCADE_PIXEL_PARTY_WINS": "Pixel Party: Wins",
  "ARCADE_THROW_OUT_WINS": "Throw Out: Wins",
  "ARCADE_THROW_OUT_KILLS": "Throw Out: Kills",
  "ARCADE_ZOMBIES_WINS": "Zombies: Wins",
  "ARCADE_ZOMBIES_KILLS": "Zombies: Kills",
  "ARCADE_ZOMBIES_WINDOWS_REPAIRED": "Zombies: Windows Repaired",
  "ARCADE_ZOMBIES_PLAYERS_REVIVED": "Zombies: Players Revived",
  "ARCADE_ZOMBIES_DOORS_OPENED": "Zombies: Doors Opened"
};