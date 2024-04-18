var bedWarsStats, totalDreamModeStats, duelsStats; 
var allDuelsStats = { };

function calculateRatio(numerator, denominator, digits = 2) { // Calculates a ratio based on two stats
    return checkAndFormat((numerator) / (und(denominator) == 0 ? 1 : (denominator)), digits);
}

function checkAndFormat(number, digits = 0) { // Ensures undefined values become zero and format to user's locale
    return locale(und(number), digits);
}

function und(text) { // Checks if a number is zero
    if (text === null || text === undefined || Number.isNaN(text)) return 0;
    return text;
}

function updateElement(id, value, useInnerHTML = false) {
    const element = document.getElementById(id);
    if (element) {
        if (useInnerHTML) {
            element.innerHTML = value;
        } else {
            element.textContent = value;
        }
    }
}

function locale(number, digits = 2) {
    return number.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits});
} 

function smallDuration(seconds) { // Converts a number of seconds into a human-readable duration of time
    const MINUTE = 60;
    const HOUR = 3600;
    const DAY = 86400;
    const YEAR = 31556952;

    const years = Math.floor(seconds / YEAR);
    const days = Math.floor((seconds % YEAR) / DAY);
    const hours = Math.floor((seconds % DAY) / HOUR);
    const minutes = Math.floor((seconds % HOUR) / MINUTE);
    
    if(years > 0) {
        return `${years}y ${days}d`;
    } else if(days > 0) {
        return `${days}d ${hours}h`;
    } else if(hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if(minutes > 0) {
        return `${minutes}m ${seconds % MINUTE}s`;
    } else {
        return `${seconds}s`;
    }
}

function generateNetwork() { // Inserts general/network stats into the DOM
    var profileStats = playerData["profile"];
    var dateNow = new Date();

    if(profileStats != undefined) {
        var playerRank = profileStats["tag"];
        var playerRankCute = cuteRank(playerRank, 1);

        document.getElementById("card-rank").classList.add("rank-" + playerRankCute[0]); // Changes the rank to the player's rank colour
        document.getElementById("card-name").style.color = `var(--mc` + playerRankCute[0] + `)`; // Changes the player's name to the player's rank colour
        document.getElementById("quick-mode-username").style.color = `var(--mc` + playerRankCute[0] + `)`;

        updateElement("card-ranktext", playerRankCute[1], true); // Adds player's rank
        updateElement("card-name", playerData["name"]);
        updateElement("quick-mode-username", playerData["name"]);
        updateElement("header-name", cuteRank(profileStats["tagged_name"], 0), true);
        updateElement("achievement-points", profileStats["achievement_points"].toLocaleString());
        updateElement("karma", profileStats["karma"].toLocaleString());
        updateElement("quests-completed", profileStats["quests_completed"].toLocaleString());
        updateElement("ranks-gifted", und(profileStats["ranks_gifted"]).toLocaleString());
        updateElement("multiplier", profileStats["coin_multiplier"].toLocaleString());


        var firstLogin = new Date((profileStats["first_login"])); // Used for birthday calculation
        updateElement("first-login", (firstLogin).toLocaleDateString()); // Gets first login in Unix time and turns it into a date
        updateElement("first-login-ago", `(${relativeTime(firstLogin)})`, true);

        if((firstLogin.getMonth() == dateNow.getMonth()) && (firstLogin.getDate() == dateNow.getDate()) && (firstLogin.getYear() != dateNow.getYear())) {
          document.getElementById("birthday").style.display = "initial"; // Makes the birthday cake visible if it's your Hypixel anniversary!
          updateElement("birthday-text", `Happy ${ordinal(dateNow.getYear() - firstLogin.getYear())} Hypixel anniversary!`);
          console.log("Happy anniversary!");
        }
      
        if(profileStats["last_login"] == 0) document.getElementById("last-login-container").style.display = "none";
        else {
          updateElement("last-login", (new Date((profileStats["last_login"]))).toLocaleDateString());
          updateElement("last-login-ago", `(${relativeTime(new Date(profileStats["last_login"]))})`);
        }
        
        if(playerData["status"]["online"]) { // Checks player's online status
          updateElement("online-status", "Currently Online!");
          document.getElementById("online-status").style.color = "var(--mca)";
        }
        else updateElement("online-status", "Currently Offline");

        if(playerData["guild"] == undefined) {
          console.log(playerData);
          document.getElementById("guild-stats").style.display = "none";
          document.getElementById("card-guild").style.display = "none";
        } else {
          guildStats = playerData["guild"];
            updateElement("guild-name", guildStats["name"]);
            updateElement("guild-tag", generateMinecraftText(guildStats["tag"]), true);
            updateElement("card-guild", generateMinecraftText(guildStats["tag"]), true);
            updateElement("guild-level", Math.floor(guildStats["level"]).toLocaleString());
            updateElement("guild-members", guildStats["members"].toLocaleString());
            updateElement("guild-joined", new Date(guildStats["joined"]).toLocaleDateString());
            updateElement("guild-joined-ago", `(${relativeTime(new Date(guildStats["joined"]))})`);
        } 

        hypixelLevel = profileStats["network_level"];
        updateElement("level", Math.floor(hypixelLevel).toLocaleString());
        if(hypixelLevel >= 250) {
          document.getElementById("level-container").style.color = "var(--gold-transparent)";
          document.getElementById("level").style.color = "var(--gold)";
        }

        var xpProgress = ((hypixelLevel % 1) * 100).toFixed(0) + "%"; // Sets user's XP progress and progress bar
        document.getElementById("xp-progress-bar").style.width = xpProgress;
        updateElement("xp-progress-number", xpProgress);

        if(Object.keys(profileStats["social_media"]).length != 0) {
          document.getElementById("social-media-alternative").style.display = "";
        }
        var socials = ["HYPIXEL", "YOUTUBE", "TWITTER", "TIKTOK", "TWITCH", "DISCORD"];
        for(a = 0; a < socials.length; a++) { // Iterates through social media and hides icons that don't exist for the player
          if(profileStats["social_media"][socials[a]] == undefined) {
            document.getElementById("social-" + (socials[a]).toLowerCase()).style.display = "none";
            document.getElementById("social-" + (socials[a]).toLowerCase() + "-alternative").style.display = "none";
          } else if(socials[a] != "DISCORD") {
            socialMediaNew = profileStats["social_media"][socials[a]];
            socialMediaNewUrl = !/^https?:\/\//i.test(socialMediaNew) ? `https://${socialMediaNew}` : socialMediaNew; // Adds HTTPS to the URL if it doesn't have it already

            document.getElementById("sociallink-" + (socials[a]).toLowerCase()).href = socialMediaNewUrl;
            document.getElementById("social-" + (socials[a]).toLowerCase() + "-alternative").href = socialMediaNewUrl;
          } else {
            updateElement("social-discord-username", profileStats["social_media"][socials[a]]);
            updateElement("social-discord-username-alternative", profileStats["social_media"][socials[a]]);
          }
        }
        
        generateBedWars();
        generateDuels();
        generateSkyWars();
        generateBuildBattle();
        generateMurderMystery();

      } else { // If no Hypixel stats, hide most buttons and show a warning
        document.getElementById("general-bottom-bar").style.display = "none";
        updateElement("card-name", playerData["name"]);
        updateElement("header-name", playerData["name"]);
        document.getElementById("game-buttons").style.display = "none";
        document.getElementById("card-ranktext").style.display = "none";
        document.getElementById("card-guild").style.display = "none";
        document.getElementById("online-status").style.display = "none";
        document.getElementById("real-stats").style.display = "none";
        document.getElementById("network-error").style.display = "unset";
        
        document.getElementById("player-card").style.paddingLeft = "0px";
        document.getElementById("player-card").style.paddingRight = "0px";
        document.getElementById("player-card").style.paddingBottom = "0px";
        document.getElementById("extended-card").style.marginBottom = "0px";
      }   
}

function getBedWarsLevel(exp) { // Calculates a player's Bed Wars level based on their experience stat
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

function getSkyWarsLevel(exp) { // Calculates a player's SkyWars level based on their experience stat
    const skyWarsXp = [0, 20, 70, 150, 250, 500, 1000, 2000, 3500, 6000, 10000, 15000];
    if(exp >= 15000) {
        return (exp - 15000) / 10000 + 12;
    }
    for(a = 0; a < skyWarsXp.length; a++) {
        if(exp < skyWarsXp[a]) {
            return a + (exp - skyWarsXp[a - 1]) / (skyWarsXp[a] - skyWarsXp[a - 1]);
        }
    }
}


function convertToRoman(num) {
    const romanNumerals = {
        M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1
    };

    let result = '';
    
    for (const numeral in romanNumerals) {
        const count = Math.floor(num / romanNumerals[numeral]);
        num -= count * romanNumerals[numeral];
        result += numeral.repeat(count);
    }
    
    return result;
}

function linearGradient(colors) { // Generates a linear gradient based on an array of hex colour or Minecraft colour code inputs
    var gradient = 'linear-gradient(90deg';
    var colorsLength = colors.length;
    if (colorsLength == 1) {
        if(colors[0].length == 1) {
            gradient += `, var(--mc${colors[0]}) 0%, var(--mc${colors[0]}) 100%`;
        } else {
            gradient += `, ${colors[0]} 0%, ${colors[0]} 100%`;
        }
      } else {
        colors.forEach((color, index) => {
            const position = (index / (colorsLength - 1)) * 100;
            if(color.length == 1) {
                gradient += `, var(--mc${color}) ${position}%`;
            } else {
                gradient += `, ${color} ${position}%`;
            }
        });
    }
    gradient += ')';
    return gradient;
}

function generateBedWars() { // Generates stats and chips for Bed Wars
    bedWarsStats = playerData["stats"]["Bedwars"];
    if(bedWarsStats != undefined) {

    var modes = ["eight_one", "eight_two", "four_three", "four_four", "two_four"];
    var modeNames = ["Solos", "Doubles", "Threes", "Fours", "4v4"];
    var dreamModes = [
        ["Overall", "overall"],
        ["Armed Doubles", "eight_two_armed"],
        ["Armed Fours", "four_four_armed"],
        ["Lucky Doubles", "eight_two_lucky"],
        ["Lucky Fours", "four_four_lucky"],
        ["Rush Doubles", "eight_two_rush"],
        ["Rush Fours", "four_four_rush"],
        ["Swap Doubles", "eight_two_swap"],
        ["Swap Fours", "four_four_swap"],
        ["Ultimate Doubles", "eight_two_ultimate"],
        ["Ultimate Fours", "four_four_ultimate"],
        ["Underworld Doubles", "eight_two_underworld"],
        ["Underworld Fours", "four_four_underworld"],
        ["Voidless Doubles", "eight_two_voidless"],
        ["Voidless Fours", "four_four_voidless"],
      ];
    var easyStats = ["wins", "losses", "kills", "deaths", "final_kills", "final_deaths", "beds_broken", "beds_lost"];

    var bedWarsPrestigeColors = [["7"],["f"],["6"],["b"],["2"],["5"],["c"],["d"],["9"],["5"],["c","6","e","a","b","d","5"],["7","f","f","f","f","7","7"],["7","e","e","e","e","6","7"],["7","b","b","b","b","5","7"],["7","a","a","a","a","2","7"],["7","5","5","5","5","9","7"],["7","c","c","c","c","4","7"],["7","d","d","d","d","5","7"],["7","9","9","9","9","1","7"],["7","5","5","5","5","8","7"],["8","7","f","f","7","7","8"],["f","f","e","e","6","6","6"],["6","6","f","f","b","5","5"],["5","5","d","d","6","f","f"],["b","b","f","f","7","7","8"],["f","f","a","a","2","2","2"],["4","4","c","c","d","d","5"],["e","e","f","f","8","8","8"],["a","a","2","2","6","6","e"],["b","b","5","5","9","9","1"],["f","f","6","6","c","c","4"],["9","9","5","5","6","6","e"],["c","4","7","7","4","c","c"],["9","9","9","d","c","c","4"],["2","a","d","d","5","5","2"],["c","c","4","4","2","a","a"],["a","a","a","b","9","9","1"],["4","4","c","c","b","3","3"],["1","1","b","5","5","d","1"],["c","c","a","a","3","9","9"],["5","5","c","c","6","6","e"],["e","e","6","c","d","d","5"],["1","9","3","b","f","7","7"],["0","5","8","8","5","5","0"],["2","2","a","e","6","5","d"],["f","f","b","b","3","3","3"],["3","b","e","e","6","d","5"],["f","4","c","c","9","1","9"],["5","5","c","6","f","b","5"],["2","a","f","f","a","a","2"],["c","c","5","9","9","1","0"]];

    let bedWarsLevel = getBedWarsLevel(bedWarsStats["Experience"]);

    updateElement("bed-wars-level", checkAndFormat(bedWarsLevel, 0));
    document.getElementById("bed-wars-level-container").style.background = linearGradient(bedWarsPrestigeColors[Math.floor(Math.max(bedWarsLevel / 100), 49)]);
   document.getElementById("bed-wars-xp-progress-bar").style.width = (bedWarsLevel % 1 * 100).toFixed(0) + "%";
   updateElement("bed-wars-xp-progress-number", (bedWarsLevel % 1 * 100).toFixed(0) + "%");

    var bedWarsChips = [];

    for(e = 0; e < easyStats.length; e++) {
        updateElement("bed-wars-overall-" + easyStats[e], checkAndFormat(bedWarsStats[easyStats[e] + "_bedwars"]));
    }
    updateElement("bed-wars-overall-winstreak", checkAndFormat(bedWarsStats["winstreak"]));
    updateElement("bed-wars-overall-wlr", calculateRatio(bedWarsStats["wins_bedwars"], bedWarsStats["losses_bedwars"]));
    updateElement("bed-wars-overall-kdr", calculateRatio(bedWarsStats["kills_bedwars"], bedWarsStats["deaths_bedwars"]));
    updateElement("bed-wars-overall-fkdr", calculateRatio(bedWarsStats["final_kills_bedwars"], bedWarsStats["final_deaths_bedwars"]));
    updateElement("bed-wars-overall-bblr", calculateRatio(bedWarsStats["beds_broken_bedwars"], bedWarsStats["beds_lost_bedwars"]));
    updateElement("bed-wars-tokens", checkAndFormat(bedWarsStats["coins"]));
    updateElement("bed-wars-challenges-completed", checkAndFormat(bedWarsStats["total_challenges_completed"]));

    updateElement("bed-wars-unique-challenges-completed", `(` + checkAndFormat(bedWarsStats["bw_unique_challenges_completed"]) + `/30)`);
    
    if(bedWarsStats["bw_unique_challenges_completed"] == 30) {
        document.getElementById("bed-wars-unique-challenges-completed").style.color = `var(--gold)`;
    }

    if(bedWarsStats["slumber"] != undefined) {
        updateElement("bed-wars-slumber-tickets", checkAndFormat(bedWarsStats["slumber"]["tickets"]));
    }

    for(a = 0; a < modes.length; a++) { // Regular stats
        let bedWarsChip = [
            ("bed-wars-stats-" + (modeNames[a]).toLowerCase()), // ID
            modeNames[a], // Title
            "", // Subtitle (none)
            ("/img/games/bedwars/" + (modeNames[a]).toLowerCase() + ".png"), // Image
            getBedWarsModeStats(modes[a]), // Displayed stats
            [], // Other stats (shown in drop-down menu) (none here)
            "", // Icon
            "bedwars" // Gamemode (used for dropdowns)
        ];
        bedWarsChips.push(bedWarsChip);
    }

    var totalDreamModeStatsCounts = [0, 0, 0, 0, 0, 0, 0, 0]; // Loops through all the Dreams mode stats to get overall Dreams stats
    var dreamModeWinstreak = 0;
    for(f = 0; f < dreamModes.length; f++) {
        for(g = 0; g < easyStats.length; g++) {
            totalDreamModeStatsCounts[g] += und(bedWarsStats[dreamModes[f][1] + "_" + easyStats[g] + "_bedwars"]);
        }
        winstreakTest = und(bedWarsStats[dreamModes[f][1] + "_" + easyStats[g]]);
        if(winstreakTest > dreamModeWinstreak) {
            dreamModeWinstreak = winstreakTest;
        }
    }

    totalDreamModeStats = [
        [true, ["Winstreak", checkAndFormat(dreamModeWinstreak)]],
        [false, ["Wins", checkAndFormat(totalDreamModeStatsCounts[0])],
            ["Losses", checkAndFormat(totalDreamModeStatsCounts[1])],
            ["W/L R", (calculateRatio(totalDreamModeStatsCounts[0], totalDreamModeStatsCounts[1], 2))]
        ],
        [false, ["Kills", checkAndFormat(totalDreamModeStatsCounts[2])],
            ["Deaths", checkAndFormat(totalDreamModeStatsCounts[3])],
            ["K/D R", (calculateRatio(totalDreamModeStatsCounts[2], totalDreamModeStatsCounts[3], 2))]
        ],
        [false, ["Final Kills", checkAndFormat(totalDreamModeStatsCounts[4])],
            ["Final Deaths", checkAndFormat(totalDreamModeStatsCounts[5])],
            ["FK/D R", (calculateRatio(totalDreamModeStatsCounts[4], totalDreamModeStatsCounts[5], 2))]
        ],
        [false, ["Bed Breaks", checkAndFormat(totalDreamModeStatsCounts[6])],
            ["Bed Losses", checkAndFormat(totalDreamModeStatsCounts[7])],
            ["BB/L R", (calculateRatio(totalDreamModeStatsCounts[6], totalDreamModeStatsCounts[7], 2))]
        ]
    ];

    bedWarsChips.push([ // Generates the Dreams mode chip
        "bed-wars-stats-dreams",
        "Dreams",
        "",
        "/img/games/bedwars/4v4.png",
        totalDreamModeStats,
        dreamModes,
        "",
        "bedwars"
    ]);

    for(d = 0; d < bedWarsChips.length; d++) {
            generateChip(bedWarsChips[d], "bed-wars-chips");
        }
    }
}

function generateSkyWars() {
    skyWarsStats = playerData["stats"]["SkyWars"];
    if(skyWarsStats != undefined) {

    if(skyWarsStats["levelFormatted"] != undefined) {
        updateElement("skywars-level", generateMinecraftText(skyWarsStats["levelFormatted"]), true);
    }

    easyStats = ["kills", "deaths", "wins", "losses", "coins", "cosmetic_tokens", "chests_opened", "heads"];
    for(e = 0; e < easyStats.length; e++) {
        updateElement("skywars-overall-" + easyStats[e], checkAndFormat(skyWarsStats[easyStats[e]]));
    }

    skyWarsLevel = getSkyWarsLevel(und(skyWarsStats["skywars_experience"]));
    document.getElementById("skywars-xp-progress-bar").style.width = (skyWarsLevel % 1 * 100) + "%";
    updateElement("skywars-xp-progress-number", (skyWarsLevel % 1 * 100).toFixed(0) + "%");

    updateElement("skywars-overall-kdr", calculateRatio(skyWarsStats["kills"], skyWarsStats["deaths"]));
    updateElement("skywars-overall-wlr", calculateRatio(skyWarsStats["wins"], skyWarsStats["losses"]));
    updateElement("skywars-overall-playtime", smallDuration(skyWarsStats["time_played"]));

    updateElement("skywars-overall-corruption-chance", (und(skyWarsStats["angel_of_death_level"]) + und(skyWarsStats["angels_offering"]) + (skyWarsStats["packages"] != undefined ? skyWarsStats["packages"].includes("favor_of_the_angel") : 0)) + "%");

    skyWarsChips = [];
    skyWarsStatsToShow = [["Solo", "solo", [["Overall", "solo"],["Normal","solo_normal"],["Insane","solo_insane"]]], ["Team", "team", [["Overall", "team"],["Normal","team_normal"],["Insane","team_insane"]]], ["Mega", "mega", []], ["Lab", "lab", []]];

    for(a = 0; a < skyWarsStatsToShow.length; a++) { // Regular stats
        let skyWarsChip = [
            ("skywars-stats-" + skyWarsStatsToShow[a][1]), // ID
            skyWarsStatsToShow[a][0], // Title
            "", // Subtitle (none)
            ("/img/games/bedwars/threes.png"), // Image
            getSkyWarsModeStats(skyWarsStatsToShow[a][1]), // Displayed stats
            skyWarsStatsToShow[a][2], // Other stats (shown in drop-down menu)
            "", // Icon
            "skywars" // Gamemode (used for dropdowns)
        ];
        skyWarsChips.push(skyWarsChip);
    }

    for(d = 0; d < skyWarsChips.length; d++) {
        generateChip(skyWarsChips[d], "skywars-chips");
    }
    }
}

function getBedWarsModeStats(mode) {
    return [
            [true, ["Winstreak", checkAndFormat(bedWarsStats[mode + "_winstreak"])]],
            [false, ["Wins", checkAndFormat(bedWarsStats[mode + "_wins_bedwars"])],
                ["Losses", checkAndFormat(bedWarsStats[mode + "_losses_bedwars"])],
                ["W/L R", (calculateRatio(bedWarsStats[mode + "_wins_bedwars"], bedWarsStats[mode + "_losses_bedwars"], 2))]
            ],
            [false, ["Kills", checkAndFormat(bedWarsStats[mode + "_kills_bedwars"])],
                ["Deaths", checkAndFormat(bedWarsStats[mode + "_deaths_bedwars"])],
                ["K/D R", (calculateRatio(bedWarsStats[mode + "_kills_bedwars"], bedWarsStats[mode + "_deaths_bedwars"], 2))]
            ],
            [false, ["Final Kills", checkAndFormat(bedWarsStats[mode + "_final_kills_bedwars"])],
                ["Final Deaths", checkAndFormat(bedWarsStats[mode + "_final_deaths_bedwars"])],
                ["FK/D R", (calculateRatio(bedWarsStats[mode + "_final_kills_bedwars"], bedWarsStats[mode + "_final_deaths_bedwars"], 2))]
            ],
            [false, ["Bed Breaks", checkAndFormat(bedWarsStats[mode + "_beds_broken_bedwars"])],
                ["Bed Losses", checkAndFormat(bedWarsStats[mode + "_beds_lost_bedwars"])],
                ["BB/L R", (calculateRatio(bedWarsStats[mode + "_beds_broken_bedwars"], bedWarsStats[mode + "_beds_lost_bedwars"], 2))]
            ]
        ];
}

function getSkyWarsModeStats(mode) {
    return [
            [false, ["Wins", checkAndFormat(skyWarsStats["wins_" + mode])],
                ["Losses", checkAndFormat(skyWarsStats["losses_" + mode])],
                ["W/L R", (calculateRatio(skyWarsStats["wins_" + mode], skyWarsStats["losses_" + mode], 2))],
            ],
            [false, ["Kills", checkAndFormat(skyWarsStats["kills_" + mode])],
                ["Deaths", checkAndFormat(skyWarsStats["deaths_" + mode])],
                ["K/D R", (calculateRatio(skyWarsStats["kills_" + mode], skyWarsStats["deaths_" + mode], 2))]
            ],
        ];
}

function getDuelsStats(mode, is_bridge = false, cuteName) {
    importedDuelsStats = [
        checkAndFormat(duelsStats["current_winstreak_mode_" + mode]),
        checkAndFormat(duelsStats["best_winstreak_mode_" + mode]),
        checkAndFormat(duelsStats[mode + "_wins"]),
        checkAndFormat(duelsStats[mode + "_losses"]),
        calculateRatio(duelsStats[mode + "_wins"], duelsStats[mode + "_losses"]),
    ]

    if(is_bridge) { // Bridge uses a different wins counter
        importedDuelsStats.push(
            checkAndFormat(duelsStats[mode + "_bridge_kills"]),
            checkAndFormat(duelsStats[mode + "_bridge_deaths"]),
            calculateRatio(duelsStats[mode + "_bridge_kills"], duelsStats[mode + "_bridge_deaths"]),
        )
    } else {
        importedDuelsStats.push(
            checkAndFormat(duelsStats[mode + "_kills"]),
            checkAndFormat(duelsStats[mode + "_deaths"]),
            calculateRatio(duelsStats[mode + "_kills"], duelsStats[mode + "_deaths"]),
        )
    }

    return [[
            [true, ["Winstreak", importedDuelsStats[0]], ["Best Winstreak", importedDuelsStats[1]]],
            [false, ["Wins", importedDuelsStats[2]],
                ["Losses", importedDuelsStats[3]],
                ["W/L R", importedDuelsStats[4]]
            ],
            [false, ["Kills", importedDuelsStats[5]],
                ["Deaths", importedDuelsStats[6]],
                ["K/D R", importedDuelsStats[7]]
            ],
        ], getDuelsTitle(und(duelsStats[mode + "_wins"]), cuteName)];
}

function getDuelsOverallModeStats(modeArray, is_bridge = false, cuteName) {

    if(is_bridge) {
        roundRobinDuelsStatNames = ["wins", "losses", "bridge_kills", "bridge_deaths"];
    } else {
        roundRobinDuelsStatNames = ["wins", "losses", "kills", "deaths"];
    }

    roundRobinDuelsStatReverseNames = ["current_winstreak_mode", "best_winstreak_mode"]

    roundRobinDuelsStats = sumStats(roundRobinDuelsStatNames, modeArray, duelsStats);
    roundRobinDuelsStats2 = maxStats(roundRobinDuelsStatReverseNames, modeArray, duelsStats, "_", true);

    importedDuelsStats = []

    return [[
        [true, ["Winstreak", checkAndFormat(roundRobinDuelsStats2[0])], ["Best Winstreak", checkAndFormat(roundRobinDuelsStats2[1])]],
        [false, ["Wins", checkAndFormat(roundRobinDuelsStats[0])],
            ["Losses", checkAndFormat(roundRobinDuelsStats[1])],
            ["W/L R", calculateRatio(roundRobinDuelsStats[0], roundRobinDuelsStats[1])]
        ],
        [false, ["Kills", checkAndFormat(roundRobinDuelsStats[2])],
            ["Deaths", checkAndFormat(roundRobinDuelsStats[3])],
            ["K D/R", calculateRatio(roundRobinDuelsStats[2], roundRobinDuelsStats[3])]
        ],
    ], getDuelsTitle(und(roundRobinDuelsStats[0]), cuteName)];
}


function sumStats(statNames, modeNames, statArray, separator = "_", reverse = false) { // Checks and adds stats, round-robin style
    statSum = Array(statNames.length).fill(0);
    for(aRow = 0; aRow < statNames.length; aRow++) {
        for(aCol = 0; aCol < modeNames.length; aCol++) {
            if(reverse) {
                statSum[aRow] += und(statArray[statNames[aRow] + separator + modeNames[aCol]]);
            } else {
                statSum[aRow] += und(statArray[modeNames[aCol] + separator + statNames[aRow]]);
            }
        }
    }
    return statSum;
}

function maxStats(statNames, modeNames, statArray, separator = "_", reverse = false) { // Determines the maximum value of a stat, round-robin style
    statMax = Array(statNames.length).fill(0)
    for(aRow = 0; aRow < statNames.length; aRow++) {
        for(aCol = 0; aCol < modeNames.length; aCol++) {
            var testStat;
            if(reverse) {
                testStat = und(statArray[statNames[aRow] + separator + modeNames[aCol]])
            } else {
                testStat =  und(modeNames[aCol] + separator + statArray[statNames[aRow]])
            }
            if(testStat > statMax[aRow]) {
                statMax[aRow] = testStat;
            }
        }
    }
    return statMax;
}

function generateDuels() { // Generates stats and chips for Duels
    duelsStats = playerData["stats"]["Duels"];
    if(duelsStats != undefined) {
    duelsChips = [];

    let easyStats = ["wins", "losses", "kills", "deaths", "current_winstreak", "best_overall_winstreak", "coins", "melee_swings"]
    for(e = 0; e < easyStats.length; e++) {
        updateElement("duels-overall-" + easyStats[e], checkAndFormat(duelsStats[easyStats[e]]));
    }

    updateElement("duels-overall-kdr", calculateRatio(duelsStats["kills"], duelsStats["deaths"]));
    updateElement("duels-overall-wlr", calculateRatio(duelsStats["wins"], duelsStats["losses"]));
    document.getElementById("duels-overall-damage-dealt").innerText = checkAndFormat(duelsStats["damage_dealt"] / 2) + ` ♥&#xFE0E;`;

    overallDuelsTitle = getDuelsTitle(und(duelsStats["wins"]));

    let winsToGo = overallDuelsTitle[1];
    let formattedWinsToGo;

    if(winsToGo == -1) {
        formattedWinsToGo = ``;
    } else if(winsToGo == -2) {
        formattedWinsToGo = `(MAXED!!!)`
    } else {
        formattedWinsToGo = (`(${checkAndFormat(winsToGo)} to go` + (winsToGo == 1 ? `!)` : `)`));
    }

    updateElement("duels-overall-title", overallDuelsTitle[0], true);
    updateElement("duels-overall-to-go", formattedWinsToGo);
    duelsProgress = ((overallDuelsTitle[2] - overallDuelsTitle[1]) / overallDuelsTitle[2]);
    updateElement("duels-overall-progress-number", Math.floor(duelsProgress * 100) + "%");
    document.getElementById("duels-overall-progress-bar").style.width = (Math.floor(duelsProgress * 100) + "%");
    
    var duelsModes = [
        ["UHC 1v1", "uhc_duel", "uhc", false],
        ["UHC 2v2", "uhc_doubles", "uhc", false],
        ["UHC 4v4", "uhc_four", "uhc", false],
        ["UHC Deathmatch", "uhc_meetup", "uhc", false],
        ["OP 1v1", "op_duel", "op", false],
        ["OP 2v2", "op_doubles", "op", false],
        ["SkyWars 1v1", "sw_duel", "sw", false],
        ["SkyWars 2v2", "sw_doubles", "sw", false],
        ["Bow", "bow_duel", "bow", false],
        ["Blitz", "blitz_duel", "blitz", false],
        ["Mega Walls", "mw_duel", "mw", false],
        ["Mega Walls Doubles", "mw_doubles", "mw", false],
        ["Sumo", "sumo_duel", "sumo", false],
        ["Bow Spleef", "bowspleef_duel", "bowspleef", false],
        ["Parkour", "parkour_eight", "parkour", false],
        ["Boxing", "boxing_duel", "boxing", false],
        ["Classic", "classic_duel", "classic", false],
        ["NoDebuff", "potion_duel", "nodebuff", false],
        ["Combo", "combo_duel", "combo", false],
        ["Bridge 1v1", "bridge_duel", "bridge", true],
        ["Bridge 2v2", "bridge_doubles", "bridge", true],
        ["Bridge 3v3", "bridge_threes", "bridge", true],
        ["Bridge 4v4", "bridge_four", "bridge", true],
        ["Bridge 2v2v2v2", "bridge_2v2v2v2", "bridge", true],
        ["Bridge 3v3v3v3", "bridge_3v3v3v3", "bridge", true],
        ["Bridge CTF 3v3", "capture_threes", "bridge", true],
        ["Duel Arena", "duel_arena", "arena", false]
    ];

    var duelsWithMultipleModes = [
        ["bridge", "Bridge", ["bridge_duel", "bridge_doubles", "bridge_threes", "bridge_four", "bridge_2v2v2v2", "bridge_3v3v3v3", "capture_threes"]], ["mw", "Mega Walls", ["mw_duel", "mw_doubles"]], ["sw", "SkyWars", ["sw_duel", "sw_doubles"]], ["op", "OP", ["op_duel", "op_doubles"]], ["uhc", "UHC", ["uhc_duel", "uhc_doubles"]]]
    
        var duelsStatsToShow = [["bridge", "Bridge", [["Overall","bridge"],["1v1","bridge_duel"],["2v2","bridge_doubles"],["3v3","bridge_threes"],["4v4","bridge_four"],["2v2v2v2","bridge_2v2v2v2"],["3v3","bridge_3v3v3v3"],["CTF 3v3","capture_threes"]]], ["sw", "SkyWars", [["Overall","sw"],["1v1","sw_duel"],["2v2","sw_doubles"]]], ["classic_duel", "Classic", []], ["uhc", "UHC", [["Overall","uhc"],["1v1","uhc_duel"],["2v2","uhc_doubles"],["4v4","uhc_four"],["Deathmatch","uhc_meetup"]]], ["sumo_duel", "Sumo", []], ["parkour_eight", "Parkour", []], ["blitz_duel", "Blitz", []], ["bow_duel", "Bow", []], ["mw", "Mega Walls", [["Overall","mw"],["1v1","mw_duel"],["2v2","mw_doubles"]]], ["bowspleef_duel", "Bow Spleef", []], ["op", "OP", [["Overall","op"],["1v1","op_duel"],["2v2","op_doubles"]]], ["combo_duel", "Combo", []], ["boxing_duel", "Boxing", []], ["potion_duel", "Nodebuff", []], ["duel_arena", "Arena", []]];

    for(a = 0; a < duelsModes.length; a++) {
        allDuelsStats[duelsModes[a][1]] = getDuelsStats(duelsModes[a][1], duelsModes[a][3], duelsModes[a][0]);
    }
    for(a = 0; a < duelsWithMultipleModes.length; a++) {
        allDuelsStats[duelsWithMultipleModes[a][0]] = getDuelsOverallModeStats(duelsWithMultipleModes[a][2], (duelsWithMultipleModes[a][0] === "bridge"), duelsWithMultipleModes[a][1]);
    }


    for(a = 0; a < duelsStatsToShow.length; a++) { // Regular stats
        currentDuel = duelsStatsToShow[a];
        currentDuelPrefix = allDuelsStats[currentDuel[0]][1];

        winsToGo = currentDuelPrefix[1];
        let formattedWinsToGo;

        if(winsToGo == -1) {
            formattedWinsToGo = ``;
        } else if(winsToGo == -2) {
            formattedWinsToGo = `(MAXED!!!)`
        } else {
            formattedWinsToGo = (`(${checkAndFormat(winsToGo)} to go` + (winsToGo == 1 ? `!)` : `)`));
        }

        duelsChip = [
            ("duels-stats-" + currentDuel[0]), // ID
            currentDuel[1], // Title
            `${currentDuelPrefix[0]} ${formattedWinsToGo}`, // Subtitle (none)
            (`/img/games/home.png`), // Background image
            allDuelsStats[currentDuel[0]][0], // Displayed stats
            currentDuel[2], // Other stats (shown in drop-down menu)
            (`/img/icon/duels/${currentDuel[0]}.png`), // Chip image
            "duels", // gamemode
        ];
        duelsChips.push(duelsChip);
    }

    for(d = 0; d < duelsChips.length; d++) {
        generateChip(duelsChips[d], "duels-chips");
    }
    }
}

function generateBuildBattle() { // Generates stats and chips for Build Battle

    let buildBattleStats = playerData["stats"]["BuildBattle"];
    if(buildBattleStats != undefined) {

    buildBattleTitle = getBuildBattleTitle(und(buildBattleStats["score"]));
    updateElement("buildbattle-overall-title", buildBattleTitle[0], true);
    updateElement("buildbattle-overall-to-go", `(${checkAndFormat(buildBattleTitle[1])} to go)`);
    updateElement("buildbattle-overall-progress-number", Math.floor(buildBattleTitle[2] * 100) + "%");
    document.getElementById("buildbattle-overall-progress-bar").style.width = (buildBattleTitle[2] * 100) + "%";
    
    updateElement("buildbattle-overall-losses", checkAndFormat(buildBattleStats["games_played"] - buildBattleStats["wins"]));
    updateElement("buildbattle-overall-wlr", calculateRatio(buildBattleStats["wins"], buildBattleStats["games_played"] - buildBattleStats["wins"]));

    let easyStats = ["score", "wins", "total_votes", "coins"];
    for(e = 0; e < easyStats.length; e++) {
        updateElement("buildbattle-overall-" + easyStats[e], checkAndFormat(buildBattleStats[easyStats[e]]));
    }


    let buildBattleModes = [["Solo", "solo_normal", []], ["Teams", "teams_normal", []], ["Pro", "solo_pro", []], ["Guess The Build", "guess_the_build", []]];

    buildBattleChips = []
    for(a = 0; a < buildBattleModes.length; a++) {

        currentBuildBattleMode = buildBattleModes[a];

        buildBattleModeStats = [[false, ["Wins", checkAndFormat(buildBattleStats[`wins_${currentBuildBattleMode[1]}`])]]];

        if(currentBuildBattleMode[1] == "guess_the_build") {
            buildBattleModeStats[0].push(["Correct Guesses", checkAndFormat(buildBattleStats[`correct_guesses`])]);
        }

        console.log(buildBattleModeStats);

        buildBattleChip = [
            ("buildbattle-stats-" + (buildBattleModes[a][1])), // ID
            buildBattleModes[a][0], // Title
            ``, // Subtitle (none)
            (`/img/games/home.png`), // Background image
            buildBattleModeStats, // Displayed stats
            [], // Other stats (shown in drop-down menu)
            ``, // Chip image
            "buildbattle", // gamemode
        ];
        buildBattleChips.push(buildBattleChip);
    }

    for(d = 0; d < buildBattleChips.length; d++) {
        generateChip(buildBattleChips[d], "buildbattle-chips");
    }
    }   
}

function generateMurderMystery() { // Generates stats and chips for Murder Mystery
    let murderMysteryStats = playerData["stats"]["MurderMystery"];
    if(murderMysteryStats != undefined) {

    let easyStats = ["kills", "deaths", "wins", "coins", "coins_pickedup", "murderer_wins", "detective_wins", "kills_as_murderer", "was_hero"];

    for(e = 0; e < easyStats.length; e++) {
      updateElement("murdermystery-overall-" + easyStats[e], checkAndFormat(murderMysteryStats[easyStats[e]]));
    }

    updateElement("murdermystery-overall-losses", checkAndFormat(murderMysteryStats["games"] - murderMysteryStats["wins"]));
    updateElement("murdermystery-overall-wlr", calculateRatio(murderMysteryStats["wins"], murderMysteryStats["games"] - murderMysteryStats["wins"]));
    updateElement("murdermystery-overall-kdr", checkAndFormat(murderMysteryStats["games"] - murderMysteryStats["wins"]));

    updateElement("murdermystery-overall-quickest_murderer_win_time_seconds", smallDuration(und(murderMysteryStats["quickest_murderer_win_time_seconds"])));
    updateElement("murdermystery-overall-quickest_detective_win_time_seconds", smallDuration(und(murderMysteryStats["quickest_detective_win_time_seconds"])));

    murderMysteryModes = [["Classic","MURDER_CLASSIC",[]],["Double Up!","MURDER_DOUBLE_UP",[]],["Assassins","MURDER_ASSASSINS",[]],["Infection","MURDER_INFECTION",[]]];
    murderMysteryChips = [];

    for(a = 0; a < murderMysteryModes.length; a++) {

      currentMurderMysteryMode = murderMysteryModes[a];

      let murderMysteryModeStats;

      murderMysteryModeStats = [[false, ["Wins", checkAndFormat(murderMysteryStats[`wins_${currentMurderMysteryMode[1]}`])], ["Losses", checkAndFormat(murderMysteryStats[`games_${currentMurderMysteryMode[1]}`] - murderMysteryStats[`wins_${currentMurderMysteryMode[1]}`])], ["W/L R", calculateRatio(murderMysteryStats[`wins_${currentMurderMysteryMode[1]}`], murderMysteryStats[`games_${currentMurderMysteryMode[1]}`] - murderMysteryStats[`wins_${currentMurderMysteryMode[1]}`])]], [false, ["Kills", checkAndFormat(murderMysteryStats[`wins_${currentMurderMysteryMode[1]}`])], ["Deaths", checkAndFormat(murderMysteryStats[`deaths_${currentMurderMysteryMode[1]}`])], ["K/D R", calculateRatio(checkAndFormat(murderMysteryStats[`kills_${currentMurderMysteryMode[1]}`]), checkAndFormat(murderMysteryStats[`deaths_${currentMurderMysteryMode[1]}`]))]]];


      if(currentMurderMysteryMode[1] == "MURDER_CLASSIC" || currentMurderMysteryMode[1] == "MURDER_DOUBLE_UP") {

        murderMysteryModeStats.push([false, ["Wins (Murderer)", checkAndFormat(murderMysteryStats[`murderer_wins_${currentMurderMysteryMode[1]}`])], ["Wins (Detective)", checkAndFormat(murderMysteryStats[`detective_wins_${currentMurderMysteryMode[1]}`])]],[false, ["Kills (Murderer)", checkAndFormat(murderMysteryStats[`kills_as_murderer_${currentMurderMysteryMode[1]}`])], ["Wins (Hero)", checkAndFormat(murderMysteryStats[`was_hero_${currentMurderMysteryMode[1]}`])]]);

      } else if(currentMurderMysteryMode[1] == "MURDER_ASSASSINS") {
        
        // idk

      } else if(currentMurderMysteryMode[1] == "MURDER_INFECTION") {
        
        murderMysteryModeStats.push([false, ["Wins (Survivor)", checkAndFormat(murderMysteryStats[`survivor_wins_${currentMurderMysteryMode[1]}`])], ["Total Time Survived", smallDuration(und(murderMysteryStats[`total_time_survived_seconds_${currentMurderMysteryMode[1]}`]))]],[false, ["Kills (Infected)", checkAndFormat(murderMysteryStats[`kills_as_infected_${currentMurderMysteryMode[1]}`])], ["Kills (Survivor)", checkAndFormat(murderMysteryStats[`kills_as_survivor_${currentMurderMysteryMode[1]}`])]]);

      }

      murderMysteryModeStats.push([false, ["Gold Picked Up", checkAndFormat(murderMysteryStats[`coins_pickedup_${currentMurderMysteryMode[1]}`])]]);

      murderMysteryChip = [
          ("murdermystery-stats-" + (currentMurderMysteryMode[1])), // ID
          currentMurderMysteryMode[0], // Title
          ``, // Subtitle (none)
          (`/img/games/home.png`), // Background image
          murderMysteryModeStats, // Displayed stats
          [], // Other stats (shown in drop-down menu)
          ``, // Chip image
          "murdermystery", // gamemode
      ];
      murderMysteryChips.push(murderMysteryChip);
  }

  for(d = 0; d < murderMysteryChips.length; d++) {
    generateChip(murderMysteryChips[d], "murdermystery-chips");
  }

  }
}


function getBuildBattleTitle(score) { // Gets player's Build Battle title based on an amount of score
    let buildBattleTitles = [
        { minimumScore: 0, difference: 100, title: "Rookie", color: "f" },
        { minimumScore: 100, difference: 150, title: "Untrained", color: "8" },
        { minimumScore: 250, difference: 250, title: "Amateur", color: "e" },
        { minimumScore: 500, difference: 500, title: "Apprentice", color: "a" },
        { minimumScore: 1000, difference: 1000, title: "Experienced", color: "d" },
        { minimumScore: 2000, difference: 1500, title: "Seasoned", color: "9" },
        { minimumScore: 3500, difference: 4000, title: "Skilled", color: "3" },
        { minimumScore: 7500, difference: 2500, title: "Talented", color: "c" },
        { minimumScore: 10000, difference: 5000, title: "Professional", color: "5" },
        { minimumScore: 15000, difference: 5000, title: "Expert", color: "1" },
        { minimumScore: 20000, difference: -1, title: "Master", color: "4" },        
    ];
    
    let scoreToGo; 
    let chosenTitle = buildBattleTitles[0];
    for(a = 0; a < buildBattleTitles.length; a++) {
      if(score >= buildBattleTitles[a]["minimumScore"]) {
        if(a === buildBattleTitles.length - 1) {
          scoreToGo = -1;
        } else {
          scoreToGo = buildBattleTitles[a + 1]["minimumScore"] - score;
        }
        chosenTitle = buildBattleTitles[a];
      }
    }

    let nextTitlePercentage;
    if(chosenTitle["difference"] == -1) {
        nextTitlePercentage = 1;
    } else {
        nextTitlePercentage = ((score - chosenTitle["minimumScore"]) / chosenTitle["difference"]);
    }

    return [`<span class="m${chosenTitle["color"]}">${chosenTitle["title"]}</span>`, scoreToGo, nextTitlePercentage];
}

function getDuelsTitle(wins, name = "") { // Generates a Duels title based on the number of wins a player has in a certain gamemode
    multiplier = (name == "" ? 2 : 1); // Multiply required wins by 2 for general Duels titles

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
        { minimumWins: 100000, increment: 10000, max: 50, title: "ASCENDED", color: "c", bold: true }
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
    if (chosenTitle["title"] != "No Title") {
        level = Math.floor((wins - (chosenTitle["minimumWins"] * multiplier)) / (chosenTitle["increment"] * multiplier)) + 1;
        winsToGo = (chosenTitle["minimumWins"] * multiplier + chosenTitle["increment"] * level * multiplier) - wins;

        if ('max' in chosenTitle && level > chosenTitle["max"]) {
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

    if(name != "") { // Adds a space to the name if it's not empty
        name = `${name} `;
    }

    if(chosenTitle["title"] == "No Title") { // Remove name with no title so it just says "No Title"
        name = "";
    }

    let rawDuelsTitle = name + chosenTitle["title"] + romanSuffix;

    console.log([wins, name, `<span class="m${chosenTitle["color"]}">` + (chosenTitle["bold"] ? `<strong>${rawDuelsTitle}</strong>` : rawDuelsTitle) + `</span>`, winsToGo, chosenTitle["increment"] * multiplier])

    return [`<span class="m${chosenTitle["color"]}">` + (chosenTitle["bold"] ? `<strong>${rawDuelsTitle}</strong>` : rawDuelsTitle) + `</span>`, winsToGo, chosenTitle["increment"] * multiplier];
}

function updateChipStats(event, chipId, gamemode) { // Updates what a chip does when a dropdown is clicked
    newValue = event.target.value;
    console.log([chipId, newValue]);
    if(gamemode == "duels") {
        updateElement(chipId, generateChipStats(allDuelsStats[newValue][0]), true);
    } else if(gamemode == "bedwars") {
        if(newValue == "overall") {
            updateElement(chipId, generateChipStats(totalDreamModeStats), true);
        } else {
            console.log(newValue);
            updateElement(chipId, generateChipStats(getBedWarsModeStats(newValue)), true);
        }
    } else if(gamemode == "skywars") {
        updateElement(chipId, generateChipStats(getSkyWarsModeStats(newValue)), true);
    }
}