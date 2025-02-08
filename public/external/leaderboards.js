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
    translation: "games.arcade",
    type: "a",
    icon: "icon/minecraft/slime_ball",
    leaderboards: [
      {
        translation: "games.overall",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "ARCADE_WINS", format: "number" },
          { translation: "statistics.coins", id: "ARCADE_COINS", format: "number" },
        ],
      },
      {
        translation: "games.modes.arcade.blockingdead",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "ARCADE_BLOCKING_DEAD_WINS", format: "number" },
          { translation: "statistics.kills", id: "ARCADE_BLOCKING_DEAD_KILLS", format: "number" },
        ],
      },
      {
        translation: "games.modes.arcade.bountyhunters",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "ARCADE_BOUNTY_HUNTERS_WINS", format: "number" },
          { translation: "statistics.kills", id: "ARCADE_BOUNTY_HUNTERS_KILLS", format: "number" },
        ],
      },
      {
        translation: "games.modes.arcade.creeperattack",
        type: "b",
        leaderboards: [{ translation: "statistics.max_wave", id: "ARCADE_CREEPER_ATTACK_MAX_WAVE", format: "number" }],
      },
      {
        translation: "games.modes.arcade.dragonwars",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "ARCADE_DRAGON_WARS_WINS", format: "number" },
          { translation: "statistics.kills", id: "ARCADE_DRAGON_WARS_KILLS", format: "number" },
        ],
      },
      {
        translation: "games.modes.arcade.dropper",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "ARCADE_DROPPER_WINS", format: "number" },
          { translation: "statistics.best_time", id: "ARCADE_DROPPER_BEST_TIME", format: "duration_milliseconds" },
        ],
      },
      {
        translation: "games.modes.arcade.enderspleef",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "ARCADE_ENDER_SPLEEF_WINS", format: "number" },
          { translation: "statistics.blocks_destroyed", id: "ARCADE_ENDER_SPLEEF_BLOCKS_DESTROYED", format: "number" },
        ],
      },
      {
        translation: "games.modes.arcade.farmhunt",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "ARCADE_FARM_HUNT_WINS", format: "number" },
          { translation: "statistics.wins_hunter", id: "FARM_HUNT_HUNTER_WINS", format: "number" },
          { translation: "statistics.wins_animal", id: "FARM_HUNT_ANIMAL_WINS", format: "number" },
          { translation: "statistics.kills", id: "ARCADE_FARM_HUNT_KILLS", format: "number" },
          { translation: "statistics.taunts", id: "FARM_HUNT_TAUNTS_USED", format: "number" },
          { translation: "statistics.poop_collected", id: "FARM_HUNT_POOP_COLLECTED", format: "number" },
        ],
      },
      {
        translation: "games.modes.arcade.football",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "ARCADE_FOOTBALL_WINS", format: "number" },
          { translation: "statistics.goals", id: "ARCADE_FOOTBALL_GOALS", format: "number" },
          { translation: "statistics.kicks", id: "ARCADE_FOOTBALL_KICKS", format: "number" },
        ],
      },
      {
        translation: "games.modes.arcade.galaxywars",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "ARCADE_GALAXY_WARS_WINS", format: "number" },
          { translation: "statistics.kills", id: "ARCADE_GALAXY_WARS_KILLS", format: "number" },
          { translation: "statistics.kdr", id: "ARCADE_GALAXY_WARS_KDR", format: "decimal_2" },
        ],
      },
      {
        translation: "games.modes.arcade.hideandseek.category",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "ARCADE_HIDE_AND_SEEK_WINS", format: "number" },
          { translation: "multi", translations: ["statistics.wins", "games.modes.arcade.hideandseek.party_pooper"], id: "ARCADE_HIDE_AND_SEEK_PARTY_POOPER_WINS", format: "number" },
          { translation: "multi", translations: ["statistics.wins", "games.modes.arcade.hideandseek.prop_hunt"], id: "ARCADE_HIDE_AND_SEEK_PROP_HUNT_WINS", format: "number" },
        ],
      },
      {
        translation: "games.modes.arcade.holeinthewall",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "ARCADE_HOLE_IN_THE_WALL_WINS", format: "number" },
          { translation: "statistics.record_qualifications", id: "ARCADE_HOLE_IN_THE_WALL_QUALIFICATIONS_RECORD", format: "number" },
          { translation: "statistics.record_finals", id: "ARCADE_HOLE_IN_THE_WALL_FINALS_RECORD", format: "number" },
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
          { translation: "statistics.final_kills", id: "ARCADE_MINI_WALLS_FINAL_KILLS", format: "number" },
          { translation: "statistics.kills", id: "ARCADE_MINI_WALLS_KILLS", format: "number" },
        ],
      },
      {
        translation: "games.modes.arcade.partygames",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "ARCADE_PARTY_WINS", format: "number" }],
      },
      {
        translation: "games.modes.arcade.pixelparty.category",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "ARCADE_PIXEL_PARTY_WINS", format: "number" },
          { translation: "multi", translations: ["statistics.wins", "games.modes.arcade.pixelparty.normal"], id: "ARCADE_PIXEL_PARTY_NORMAL_WINS", format: "number" },
          { translation: "multi", translations: ["statistics.wins", "games.modes.arcade.pixelparty.hyper"], id: "ARCADE_PIXEL_PARTY_HYPER_WINS", format: "number" },
          { translation: "statistics.powerups", id: "ARCADE_PIXEL_PARTY_POWERUPS_COLLECTED", format: "number" },
        ],
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
      {
        translation: "games.modes.arcade.seasonal.category",
        type: "b",
        leaderboards: [
          { translation: "multi", translations: ["statistics.wins", "games.modes.arcade.seasonal.grinch_simulator_v2"], id: "ARCADE_GRINCH_SIMULATOR_WINS", format: "number" },
          { translation: "multi", translations: ["statistics.gifts_stolen", "games.modes.arcade.seasonal.grinch_simulator_v2"], id: "ARCADE_GRINCH_SIMULATOR_GIFTS_STOLEN", format: "number" },
          { translation: "multi", translations: ["statistics.wins", "games.modes.arcade.seasonal.halloween_simulator"], id: "ARCADE_HALLOWEEN_SIMULATOR_WINS", format: "number" },
          { translation: "multi", translations: ["statistics.wins", "games.modes.arcade.seasonal.easter_simulator"], id: "ARCADE_EASTER_SIMULATOR_WINS", format: "number" },
          { translation: "multi", translations: ["statistics.wins", "games.modes.arcade.seasonal.santa_simulator"], id: "ARCADE_SANTA_SIMULATOR_WINS", format: "number" },

          { translation: "multi", translations: ["statistics.wins", "games.modes.arcade.seasonal.scuba_simulator"], id: "ARCADE_SCUBA_SIMULATOR_WINS", format: "number" },
        ],
      },
    ],
  },
  {
    translation: "games.arena",
    type: "b",
    icon: "icon/minecraft/blaze_powder",
    leaderboards: [
      { translation: "statistics.wins", id: "ARENA_BRAWL_WINS", format: "arena_wins" },
      { translation: "statistics.kills", id: "ARENA_BRAWL_KILLS", format: "number" },
      { translation: "statistics.kdr", id: "ARENA_BRAWL_KDR", format: "decimal_2" },
      { translation: "statistics.coins", id: "ARENA_BRAWL_COINS", format: "number" },
      { translation: "statistics.magical_chests", id: "ARENA_BRAWL_MAGICAL_CHESTS", format: "number" },
    ],
  },
  {
    translation: "games.bedwars",
    type: "a",
    icon: "icon/minecraft/red_bed",
    leaderboards: [
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
          { translation: "statistics.challenges_completed", id: "BEDWARS_COMPLETED_CHALLENGES", format: "number" },
          { translation: "statistics.tokens", id: "BEDWARS_TOKENS", format: "number" },
          { translation: "statistics.slumber_tickets_earned", id: "BEDWARS_TICKETS_EARNED", format: "number" },
          { translation: "statistics.iron_collected", id: "BEDWARS_COLLECTED_IRON", format: "number" },
          { translation: "statistics.gold_collected", id: "BEDWARS_COLLECTED_GOLD", format: "number" },
          { translation: "statistics.diamonds_collected", id: "BEDWARS_COLLECTED_DIAMONDS", format: "number" },
          { translation: "statistics.emeralds_collected", id: "BEDWARS_COLLECTED_EMERALDS", format: "number" },
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
    translation: "games.blitz",
    type: "a",
    icon: "icon/minecraft/diamond_sword",
    leaderboards: [
      {
        translation: "games.overall",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "BLITZ_WINS", format: "number" },
          { translation: "statistics.kills", id: "BLITZ_KILLS", format: "number" },
          { translation: "statistics.kdr", id: "BLITZ_KDR", format: "decimal_2" },
          { translation: "statistics.coins", id: "BLITZ_COINS", format: "number" },
          { translation: "statistics.damage_dealt", id: "BLITZ_DAMAGE_DEALT", format: "large_number" },
        ],
      },
      {
        translation: "games.modes.classic.quakecraft.solo",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "BLITZ_SOLO_WINS", format: "number" },
          { translation: "statistics.kills", id: "BLITZ_SOLO_KILLS", format: "number" },
        ],
      },
      {
        translation: "games.modes.classic.quakecraft.teams",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "BLITZ_TEAM_WINS", format: "number" },
          { translation: "statistics.kills", id: "BLITZ_TEAM_KILLS", format: "number" },
        ],
      },
    ],
  },
  {
    translation: "games.buildbattle",
    type: "a",
    icon: "icon/minecraft/crafting_table",
    leaderboards: [
      {
        translation: "games.overall",
        type: "b",
        leaderboards: [
          { translation: "statistics.score", id: "BUILD_BATTLE_SCORE", format: "buildbattle_experience" },
          { translation: "statistics.wins", id: "BUILD_BATTLE_WINS", format: "number" },
          { translation: "statistics.votes", id: "BUILD_BATTLE_VOTES", format: "number" },
          { translation: "statistics.tokens", id: "BUILD_BATTLE_TOKENS", format: "number" },
        ],
      },
      {
        translation: "games.modes.buildbattle.solo_normal",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "BUILD_BATTLE_SOLO_WINS", format: "number" }],
      },
      {
        translation: "games.modes.buildbattle.teams_normal",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "BUILD_BATTLE_SOLO_WINS", format: "number" }],
      },
      {
        translation: "games.modes.buildbattle.solo_pro",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "BUILD_BATTLE_PRO_WINS", format: "number" }],
      },
      {
        translation: "games.modes.buildbattle.guess_the_build",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "BUILD_BATTLE_GTB_WINS", format: "number" },
          { translation: "statistics.correct_guesses", id: "BUILD_BATTLE_GTB_CORRECT_GUESSES", format: "number" },
        ],
      },
      {
        translation: "games.modes.buildbattle.speed_builders",
        type: "b",
        leaderboards: [{ translation: "statistics.wins", id: "BUILD_BATTLE_SPEED_BUILDERS_WINS", format: "number" }],
      },
    ],
  },

  {
    translation: "games.copsandcrims",
    type: "a",
    icon: "icon/minecraft/iron_bars",

    leaderboards: [
      {
        translation: "games.overall",
        type: "b",
        leaderboards: [
          { translation: "statistics.score", id: "COPS_AND_CRIMS_SCORE", format: "copsandcrims_score" },
          { translation: "statistics.coins", id: "COPS_AND_CRIMS_COINS", format: "number" },
          { translation: "statistics.wins", id: "COPS_AND_CRIMS_WINS", format: "number" },
          { translation: "statistics.kills", id: "COPS_AND_CRIMS_KILLS", format: "number" },
          { translation: "statistics.kdr", id: "COPS_AND_CRIMS_KDR", format: "decimal_2" },
        ],
      },
      {
        translation: "games.modes.copsandcrims.defusal",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "COPS_AND_CRIMS_DEFUSAL_WINS", format: "number" },
          { translation: "statistics.kills", id: "COPS_AND_CRIMS_DEFUSAL_KILLS", format: "number" },
          { translation: "statistics.bombs_planted", id: "COPS_AND_CRIMS_DEFUSAL_BOMBS_PLANTED", format: "number" },
          { translation: "statistics.bombs_defused", id: "COPS_AND_CRIMS_DEFUSAL_BOMBS_DEFUSED", format: "number" },
          { translation: "statistics.round_wins", id: "COPS_AND_CRIMS_DEFUSAL_ROUND_WINS", format: "number" },
          { translation: "statistics.kdr", id: "COPS_AND_CRIMS_DEFUSAL_KDR", format: "decimal_2" },
        ],
      },
      {
        translation: "games.modes.copsandcrims.deathmatch",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "COPS_AND_CRIMS_TEAM_DEATHMATCH_WINS", format: "number" },
          { translation: "statistics.kills", id: "COPS_AND_CRIMS_TEAM_DEATHMATCH_KILLS", format: "number" },
          { translation: "statistics.kdr", id: "COPS_AND_CRIMS_TEAM_DEATHMATCH_KDR", format: "decimal_2" },
        ],
      },
      {
        translation: "games.modes.copsandcrims.gungame",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "COPS_AND_CRIMS_GUN_GAME_WINS", format: "number" },
          { translation: "statistics.kills", id: "COPS_AND_CRIMS_GUN_GAME_KILLS", format: "number" },
          { translation: "statistics.kdr", id: "COPS_AND_CRIMS_GUN_GAME_KDR", format: "decimal_2" },
          { translation: "statistics.fastest_win", id: "COPS_AND_CRIMS_GUN_GAME_FASTEST_WIN", format: "duration_milliseconds" },
        ],
      },
    ],
  },

  {
    translation: "games.duels",
    type: "a",
    icon: "icon/minecraft/fishing_rod",
    leaderboards: [
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
          { translation: "statistics.tokens", id: "DUELS_TOKENS", format: "number" },
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
    translation: "games.megawalls",
    type: "a",
    icon: "icon/minecraft/soul_sand",
    leaderboards: [
      {
        translation: "games.overall",
        type: "b",
        leaderboards: [
          { translation: "statistics.class_points", id: "MEGA_WALLS_CLASS_POINTS", format: "number" },
          { translation: "statistics.wins", id: "MEGA_WALLS_WINS", format: "number" },
          { translation: "statistics.wlr", id: "MEGA_WALLS_WLR", format: "decimal_2" },
          { translation: "statistics.final_kills", id: "MEGA_WALLS_FINAL_KILLS", format: "number" },
          { translation: "statistics.fkdr", id: "MEGA_WALLS_FKDR", format: "decimal_2" },
          { translation: "statistics.kills", id: "MEGA_WALLS_KILLS", format: "number" },
          { translation: "statistics.kdr", id: "MEGA_WALLS_KDR", format: "decimal_2" },
          { translation: "statistics.wither_kills", id: "MEGA_WALLS_WITHER_KILLS", format: "number" },
          { translation: "statistics.coins", id: "MEGA_WALLS_COINS", format: "number" },
          { translation: "statistics.mythic_favor", id: "MEGA_WALLS_MYTHIC_FAVOR", format: "number" },
        ],
      },
      {
        translation: "games.modes.megawalls.standard",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "MEGA_WALLS_STANDARD_WINS", format: "number" },
          { translation: "statistics.wlr", id: "MEGA_WALLS_STANDARD_WLR", format: "decimal_2" },
          { translation: "statistics.final_kills", id: "MEGA_WALLS_STANDARD_FINAL_KILLS", format: "number" },
          { translation: "statistics.fkdr", id: "MEGA_WALLS_STANDARD_FKDR", format: "decimal_2" },
          { translation: "statistics.kills", id: "MEGA_WALLS_STANDARD_KILLS", format: "number" },
          { translation: "statistics.kdr", id: "MEGA_WALLS_STANDARD_KDR", format: "decimal_2" },
          { translation: "statistics.wither_kills", id: "MEGA_WALLS_STANDARD_WITHER_KILLS", format: "number" },
        ],
      },
      {
        translation: "games.modes.megawalls.faceoff",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "MEGA_WALLS_FACEOFF_WINS", format: "number" },
          { translation: "statistics.wlr", id: "MEGA_WALLS_FACEOFF_WLR", format: "decimal_2" },
          { translation: "statistics.final_kills", id: "MEGA_WALLS_FACEOFF_FINAL_KILLS", format: "number" },
          { translation: "statistics.fkdr", id: "MEGA_WALLS_FACEOFF_FKDR", format: "decimal_2" },
          { translation: "statistics.kills", id: "MEGA_WALLS_FACEOFF_KILLS", format: "number" },
          { translation: "statistics.kdr", id: "MEGA_WALLS_FACEOFF_KDR", format: "decimal_2" },
          { translation: "statistics.wither_kills", id: "MEGA_WALLS_FACEOFF_WITHER_KILLS", format: "number" },
        ],
      },
    ],
  },

  {
    translation: "games.murdermystery",
    type: "a",
    icon: "icon/minecraft/bow",
    leaderboards: [
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
    translation: "games.paintball",
    type: "b",
    icon: "icon/minecraft/snowball",
    leaderboards: [
      { translation: "statistics.wins", id: "PAINTBALL_WINS", format: "number" },
      { translation: "statistics.kills", id: "PAINTBALL_KILLS", format: "paintball_kills" },
      { translation: "statistics.killstreaks", id: "PAINTBALL_KILLSTREAKS", format: "number" },
      { translation: "statistics.shots", id: "PAINTBALL_SHOTS_FIRED", format: "number" },
      { translation: "statistics.coins", id: "PAINTBALL_COINS", format: "number" },
    ],
  },

  {
    translation: "games.pit",
    type: "b",
    icon: "icon/minecraft/dirt",
    leaderboards: [
      { translation: "statistics.level", id: "PIT_EXP", format: "pit_experience" },
      { translation: "statistics.kills", id: "PIT_KILLS", format: "number" },
      { translation: "statistics.kdr", id: "PIT_KDR", format: "decimal_2" },
      { translation: "statistics.gold", id: "PIT_GOLD", format: "large_number" },
      { translation: "statistics.damage_dealt", id: "PIT_DAMAGE_DEALT", format: "large_number" },
      { translation: "statistics.joins", id: "PIT_JOINS", format: "number" },
      { translation: "statistics.playtime", id: "PIT_PLAYTIME", format: "duration_minutes" },
      { translation: "statistics.chat_messages", id: "PIT_CHAT_MESSAGES", format: "number" },
      { translation: "statistics.clicks", id: "PIT_CLICKS", format: "number" },
      { translation: "statistics.wheat_farmed", id: "PIT_WHEAT_FARMED", format: "large_number" },
      { translation: "statistics.renown", id: "PIT_RENOWN", format: "number" },
      { translation: "statistics.mystics_enchanted", id: "PIT_ITEMS_ENCHANTED", format: "number" },
      { translation: "statistics.contracts_completed", id: "PIT_CONTRACTS_COMPLETED", format: "number" },
      { translation: "statistics.items_fished", id: "PIT_ITEMS_FISHED", format: "number" },
      { translation: "statistics.ingots_picked_up", id: "PIT_INGOTS_PICKED_UP", format: "number" },
      { translation: "statistics.highest_killstreak", id: "PIT_HIGHEST_KILLSTREAK", format: "number" },
    ],
  },

  {
    translation: "games.quakecraft",
    type: "b",
    icon: "icon/minecraft/firework_rocket",

    leaderboards: [
      { translation: "statistics.wins", id: "QUAKECRAFT_WINS", format: "number" },
      { translation: "statistics.kills", id: "QUAKECRAFT_KILLS", format: "quakecraft_kills" },
      { translation: "statistics.kdr", id: "QUAKECRAFT_KDR", format: "decimal_2" },
      { translation: "statistics.distance_travelled", id: "QUAKECRAFT_DISTANCE_TRAVELLED", format: "large_number" },
      { translation: "statistics.coins", id: "QUAKECRAFT_COINS", format: "number" },
    ],
  },

  {
    translation: "games.skywars",
    type: "a",
    icon: "icon/minecraft/ender_eye",
    leaderboards: [
      {
        translation: "games.overall",
        type: "b",
        leaderboards: [
          { translation: "statistics.level", id: "SKYWARS_EXP", format: "skywars_experience" },
          { translation: "statistics.wins", id: "SKYWARS_WINS", format: "number" },
          { translation: "statistics.wlr", id: "SKYWARS_WLR", format: "decimal_2" },
          { translation: "statistics.kills", id: "SKYWARS_KILLS", format: "number" },
          { translation: "statistics.kdr", id: "SKYWARS_KDR", format: "decimal_2" },
          { translation: "statistics.coins", id: "SKYWARS_COINS", format: "number" },
          { translation: "statistics.tokens", id: "SKYWARS_TOKENS", format: "number" },
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
      {
        translation: "games.modes.skywars.lab",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "SKYWARS_LAB_WINS", format: "number" },
          { translation: "statistics.wlr", id: "SKYWARS_LAB_WLR", format: "decimal_2" },
          { translation: "statistics.kills", id: "SKYWARS_LAB_KILLS", format: "number" },
          { translation: "statistics.kdr", id: "SKYWARS_LAB_KDR", format: "decimal_2" },
          { translation: "multi", translations: ["statistics.wins", "games.modes.skywars.lucky_blocks"], id: "SKYWARS_LUCKY_BLOCK_WINS", format: "number" },
        ],
      },
    ],
  },

  {
    translation: "games.smashheroes",
    type: "b",
    icon: "icon/minecraft/head_smashheroes",

    leaderboards: [
      { translation: "statistics.smash_level", id: "SMASH_HEROES_SMASH_LEVEL", format: "number" },
      { translation: "statistics.coins", id: "SMASH_HEROES_COINS", format: "number" },
      { translation: "statistics.wins", id: "SMASH_HEROES_WINS", format: "number" },
      { translation: "statistics.wlr", id: "SMASH_HEROES_WLR", format: "decimal_2" },
      { translation: "statistics.kills", id: "SMASH_HEROES_KILLS", format: "number" },
      { translation: "statistics.kdr", id: "SMASH_HEROES_KDR", format: "decimal_2" },
    ],
  },

  {
    translation: "games.speeduhc",
    type: "b",
    icon: "icon/minecraft/golden_carrot",

    leaderboards: [
      { translation: "statistics.score", id: "SPEED_UHC_SCORE", format: "speed_uhc_score" },
      { translation: "statistics.wins", id: "SPEED_UHC_WINS", format: "number" },
      { translation: "statistics.wlr", id: "SPEED_UHC_WLR", format: "decimal_2" },
      { translation: "statistics.kills", id: "SPEED_UHC_KILLS", format: "number" },
      { translation: "statistics.kdr", id: "SPEED_UHC_KDR", format: "decimal_2" },
    ],
  },

  {
    translation: "games.tntgames",
    type: "a",
    icon: "icon/minecraft/tnt",
    leaderboards: [
      {
        translation: "games.overall",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "TNT_GAMES_WINS", format: "number" },
          { translation: "statistics.tokens", id: "TNT_GAMES_TOKENS", format: "number" },
        ],
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
          { translation: "statistics.overall_captures", id: "TNT_GAMES_WIZARDS_POINTS_CAPTURED", format: "number" },
        ],
      },
    ],
  },

  {
    translation: "games.tkr",
    type: "b",
    icon: "icon/minecraft/minecart",

    leaderboards: [
      { translation: "statistics.golds", id: "TURBO_KART_RACERS_GOLD_TROPHIES", format: "tkr_trophies" },
      { translation: "statistics.trophies", id: "TURBO_KART_RACERS_TROPHIES", format: "number" },
      { translation: "statistics.laps", id: "TURBO_KART_RACERS_LAPS", format: "number" },
      { translation: "statistics.coins", id: "TURBO_KART_RACERS_COINS", format: "number" },
      { translation: "statistics.box_pickups", id: "TURBO_KART_RACERS_ITEM_BOX_PICKUPS", format: "number" },
    ],
  },

  {
    translation: "games.uhc",
    type: "a",
    icon: "icon/minecraft/golden_apple",

    leaderboards: [
      {
        translation: "games.overall",
        type: "b",
        leaderboards: [
          { translation: "statistics.score", id: "UHC_SCORE", format: "uhc_score" },
          { translation: "statistics.coins", id: "UHC_COINS", format: "number" },
          { translation: "statistics.wins", id: "UHC_WINS", format: "number" },
          { translation: "statistics.kills", id: "UHC_KILLS", format: "number" },
          { translation: "statistics.kdr", id: "UHC_KDR", format: "decimal_2" },
        ],
      },
      {
        translation: "games.modes.uhc.uhcchampions.solo",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "UHC_SOLO_WINS", format: "number" },
          { translation: "statistics.kills", id: "UHC_SOLO_KILLS", format: "number" },
        ],
      },
      {
        translation: "games.modes.uhc.uhcchampions.teams",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "UHC_TEAMS_WINS", format: "number" },
          { translation: "statistics.kills", id: "UHC_TEAMS_KILLS", format: "number" },
        ],
      },
    ],
  },

  {
    translation: "games.vampirez",
    type: "a",
    icon: "icon/minecraft/wither_skeleton_skull",

    leaderboards: [
      { translation: "games.overall", type: "b", leaderboards: [{ translation: "statistics.coins", id: "VAMPIREZ_COINS", format: "number" }] },
      {
        translation: "games.modes.classic.vampirez.human",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "VAMPIREZ_HUMAN_WINS", format: "number" },
          { translation: "statistics.vampire_kills", id: "VAMPIREZ_VAMPIRE_KILLS", format: "number" },
          { translation: "statistics.kills", id: "VAMPIREZ_ZOMBIE_KILLS", format: "number" },
        ],
      },
      {
        translation: "games.modes.classic.vampirez.vampire",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "VAMPIREZ_VAMPIRE_WINS", format: "number" },
          { translation: "statistics.human_kills", id: "VAMPIREZ_HUMAN_KILLS", format: "number" },
        ],
      },
    ],
  },

  {
    translation: "games.walls",
    type: "b",
    icon: "icon/minecraft/sand",
    leaderboards: [
      { translation: "statistics.wins", id: "WALLS_WINS", format: "number" },
      { translation: "statistics.kills", id: "WALLS_KILLS", format: "number" },
      { translation: "statistics.kdr", id: "WALLS_KDR", format: "decimal_2" },
      { translation: "statistics.assists", id: "WALLS_ASSISTS", format: "number" },
      { translation: "statistics.coins", id: "WALLS_COINS", format: "number" },
    ],
  },

  {
    translation: "games.warlords",
    type: "a",
    icon: "icon/minecraft/stone_axe",

    leaderboards: [
      {
        translation: "games.overall",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "WARLORDS_WINS", format: "warlords_wins" },
          { translation: "statistics.kills", id: "WARLORDS_KILLS", format: "number" },
          { translation: "statistics.wlr", id: "WARLORDS_WLR", format: "decimal_2" },
          { translation: "statistics.kdr", id: "WARLORDS_KDR", format: "decimal_2" },
          { translation: "statistics.coins", id: "WARLORDS_COINS", format: "number" },
        ],
      },
      {
        translation: "games.modes.warlords.capturetheflag",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "WARLORDS_CAPTURE_THE_FLAG_WINS", format: "number" },
          { translation: "statistics.kills", id: "WARLORDS_CAPTURE_THE_FLAG_KILLS", format: "number" },
        ],
      },
      {
        translation: "games.modes.warlords.domination",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "WARLORDS_DOMINATION_WINS", format: "number" },
          { translation: "statistics.kills", id: "WARLORDS_DOMINATION_KILLS", format: "number" },
        ],
      },
      {
        translation: "games.modes.warlords.teamdeathmatch",
        type: "b",
        leaderboards: [
          { translation: "statistics.wins", id: "WARLORDS_TEAM_DEATHMATCH_WINS", format: "number" },
          { translation: "statistics.kills", id: "WARLORDS_TEAM_DEATHMATCH_KILLS", format: "number" },
        ],
      },
    ],
  },

  {
    translation: "games.woolgames",
    type: "a",
    icon: "icon/minecraft/white_wool",

    leaderboards: [
      {
        translation: "games.overall",
        type: "b",

        leaderboards: [
          { translation: "statistics.level", id: "WOOL_GAMES_LEVEL", format: "woolgames_experience" },
          { translation: "statistics.wins", id: "WOOL_GAMES_WINS", format: "number" },
          { translation: "statistics.kills", id: "WOOL_GAMES_KILLS", format: "number" },
          { translation: "statistics.wlr", id: "WOOL_GAMES_WLR", format: "decimal_2" },
          { translation: "statistics.kdr", id: "WOOL_GAMES_KDR", format: "decimal_2" },
        ],
      },
      {
        translation: "games.modes.woolgames.sheepwars.category",
        type: "b",

        leaderboards: [
          { translation: "statistics.wins", id: "WOOL_GAMES_SHEEP_WARS_WINS", format: "number" },
          { translation: "statistics.kills", id: "WOOL_GAMES_SHEEP_WARS_KILLS", format: "number" },
          { translation: "statistics.wlr", id: "WOOL_GAMES_SHEEP_WARS_WLR", format: "decimal_2" },
          { translation: "statistics.kdr", id: "WOOL_GAMES_SHEEP_WARS_KDR", format: "decimal_2" },
        ],
      },
      {
        translation: "games.modes.woolgames.woolwars.category",
        type: "b",

        leaderboards: [
          { translation: "statistics.wins", id: "WOOL_GAMES_WOOL_WARS_WINS", format: "number" },
          { translation: "statistics.kills", id: "WOOL_GAMES_WOOL_WARS_KILLS", format: "number" },
          { translation: "statistics.wlr", id: "WOOL_GAMES_WOOL_WARS_WLR", format: "decimal_2" },
          { translation: "statistics.kdr", id: "WOOL_GAMES_WOOL_WARS_KDR", format: "decimal_2" },
        ],
      },
      {
        translation: "games.modes.arcade.capturethewool",
        type: "b",

        leaderboards: [
          { translation: "statistics.wins", id: "WOOL_GAMES_CAPTURE_THE_WOOL_WINS", format: "number" },
          { translation: "statistics.kills", id: "WOOL_GAMES_CAPTURE_THE_WOOL_KILLS", format: "number" },
          { translation: "statistics.wlr", id: "WOOL_GAMES_CAPTURE_THE_WOOL_WLR", format: "decimal_2" },
          { translation: "statistics.kdr", id: "WOOL_GAMES_CAPTURE_THE_WOOL_KDR", format: "decimal_2" },
        ],
      },
    ],
  },

  {
    translation: "games.fishing",
    type: "b",
    icon: "icon/minecraft/cod",

    leaderboards: [
      { translation: "statistics.items_caught", id: "FISHING_TOTAL_CAUGHT", format: "number" },
      { translation: "statistics.fish_caught", id: "FISHING_FISH_CAUGHT", format: "number" },
      { translation: "statistics.junk_caught", id: "FISHING_JUNK_CAUGHT", format: "number" },
      { translation: "statistics.treasure_caught", id: "FISHING_TREASURE_CAUGHT", format: "number" },
      { translation: "statistics.mythical_fish_caught", id: "FISHING_MYTHICAL_FISH_CAUGHT", format: "number" },
    ],
  },
];

const PLAYERS_PER_PAGE = 100;

function getLeaderboardGames() {
  generateGameSelectorChildren(leaderboards, 0, false);

  // Determine if there's a leaderboard/page num in the URL
  let queryParams = new URLSearchParams(window.location.search);
  let leaderboard = queryParams.get("leaderboard");
  let page = queryParams.get("page") || 1;

  page = parseInt(page);

  if (page < 1) {
    page = 1;
  }

  if (leaderboard) {
    getLeaderboardFromQuery(leaderboard, page);
  }
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

    if (game["type"] == "a" || game["type"] == "b") {
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
      gameImage.alt = "";

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

  // Update query params with leaderboard name and page number
  let queryParams = new URLSearchParams(window.location.search);
  queryParams.set("leaderboard", leaderboard);
  queryParams.set("page", page);
  window.history.replaceState({}, "", `${window.location.pathname}?${queryParams.toString()}`);

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

    updateTag(row, "rank", generateMinecraftText(playerRank), true);
    updateTag(row, "name", generateMinecraftText(playerNameWithoutRank), true);

    let playerBadge = a["badge"] || "NONE";
    checkBadgeInList(playerBadge, row);

    row.querySelector(`[data-i="head"]`).src = `https://h.matdoes.dev/2d/${a["uuid"].replaceAll("-", "")}`;
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
    case "woolgames_experience":
      return generateMinecraftText(formatWoolGamesLevel(getWoolGamesLevel(value)), true);
    case "warlords_wins":
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

      let warlordsTitleObject = getGenericWinsPrefix({
        wins: value,
        winsObject: warlordsTitles,
        useToGo: false,
        useBrackets: false,
        alternativeNaming: true,
      });

      return `${warlordsTitleObject["title"]} / ${checkAndFormat(Number(value))}`;
    case "copsandcrims_score":
      return `<span class="mf">Lv. ${Math.floor(getCopsAndCrimsLevel(value))}</span> / ${checkAndFormat(Number(value))}`;
    case "paintball_kills":
      return generateMinecraftText(getPaintballTitle(value), true);
    case "tkr_trophies":
      return generateMinecraftText(getTKRTitle(value), true);
    case "arena_wins":
      return generateMinecraftText(getArenaBrawlTitle(value), true);
    case "quakecraft_kills":
      return generateMinecraftText(getQuakecraftTitle(value), true);
    case "uhc_score":
      return `${generateMinecraftText(getUHCTitle(value, false), true)} / ${checkAndFormat(Number(value))}`;
    case "speed_uhc_score":
      return `${generateMinecraftText(getSpeedUHCTitle(value, false), true)} / ${checkAndFormat(Number(value))}`;
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
      currentPage += 1;
      getLeaderboardData(currentLeaderboard, currentPage);
    } else {
      console.log("Can't go to next page");
    }
  } else if (jump == "previous") {
    if (currentPage > 1) {
      currentPage -= 1;

      if (currentPage > totalPages) {
        currentPage = totalPages;
      }

      getLeaderboardData(currentLeaderboard, currentPage);
    } else {
      console.log("Can't go to previous page");
    }
  }
}

function getLeaderboardFromQuery(query, page = 1) {
  // Determine if leaderboard exists, i.e. it has an ID in the leaderboards variable
  let path = findPathById(leaderboards, query);
  let filteredLeaderboard = leaderboards;
  if (path) {
    for (let a = 0; a < path.length; a++) {
      let layer = a;
      let button = document.querySelector(`#selector-layer-${layer} span:nth-child(${path[a] + 1})`);
      if (button) {
        highlightButton(button);
      }

      filteredLeaderboard = filteredLeaderboard[path[a]];

      if (filteredLeaderboard["id"]) {
        break; // We've reached a leaderboard
      }

      if (filteredLeaderboard["leaderboards"]) {
        filteredLeaderboard = filteredLeaderboard["leaderboards"];
        generateGameSelectorChildren(filteredLeaderboard, layer + 1, false);
      } else {
        console.warn("No leaderboards found (how?)");
        break;
      }
    }

    currentLeaderboardInformation["leaderboard"] = query;
    currentLeaderboardInformation["format"] = filteredLeaderboard["format"];
    getLeaderboardData(query, page);
  } else {
    console.warn(`Leaderboard ${query} not found!`);
  }
}

/*
 * Simple recursive function to find the path to an object in the leaderboards object. Only shows the indexes of objects in arrays, so will return something like [5, 1, 0]. Returns null if not found
 * @param {Object} leaderboards The leaderboards object
 * @param {string} id The ID of the object to find
 * @returns {Array} The path to the object in the leaderboards object
 */
function findPathById(leaderboards, id) {
  function recursiveSearch(obj, id, path) {
    if (Array.isArray(obj)) {
      for (let a = 0; a < obj.length; a++) {
        let result = recursiveSearch(obj[a], id, path.concat(a));
        if (result) return result;
      }
    } else if (typeof obj === "object" && obj !== null) {
      if (obj["id"] === id) {
        return path;
      }
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          let result = recursiveSearch(obj[key], id, path);
          if (result) return result;
        }
      }
    }
    return null;
  }

  let result = recursiveSearch(leaderboards, id, []);
  return result;
}
