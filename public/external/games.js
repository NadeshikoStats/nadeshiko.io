var bedWarsStats, totalDreamModeStats; 

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

function locale(number, digits = 2) {
    return number.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits});
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
    bedWarsStats = playerData["stats"]["Bedwars"]; // add check if undefined
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

    document.getElementById("bed-wars-level").innerText = checkAndFormat(bedWarsLevel, 0);
    document.getElementById("bed-wars-level-container").style.background = linearGradient(bedWarsPrestigeColors[Math.floor(Math.max(bedWarsLevel / 100), 49)]);
   document.getElementById("bed-wars-xp-progress-bar").style.width = (bedWarsLevel % 1 * 100).toFixed(0) + "%";
   document.getElementById("bed-wars-xp-progress-number").innerText = (bedWarsLevel % 1 * 100).toFixed(0) + "%";

    var bedWarsChips = [];

    for(e = 0; e < easyStats.length; e++) {
        document.getElementById("bed-wars-overall-" + easyStats[e]).innerText = checkAndFormat(bedWarsStats[easyStats[e] + "_bedwars"]);
    }
    document.getElementById("bed-wars-overall-winstreak").innerText = checkAndFormat(bedWarsStats["winstreak"]);
    document.getElementById("bed-wars-overall-wlr").innerText = calculateRatio(bedWarsStats["wins_bedwars"], bedWarsStats["losses_bedwars"]);
    document.getElementById("bed-wars-overall-kdr").innerText = calculateRatio(bedWarsStats["kills_bedwars"], bedWarsStats["deaths_bedwars"]);
    document.getElementById("bed-wars-overall-fkdr").innerText = calculateRatio(bedWarsStats["final_kills_bedwars"], bedWarsStats["final_deaths_bedwars"]);
    document.getElementById("bed-wars-overall-bblr").innerText = calculateRatio(bedWarsStats["beds_broken_bedwars"], bedWarsStats["beds_lost_bedwars"]);
    document.getElementById("bed-wars-tokens").innerText = checkAndFormat(bedWarsStats["coins"]);
    document.getElementById("bed-wars-challenges-completed").innerText = checkAndFormat(bedWarsStats["total_challenges_completed"]);
    
    document.getElementById("bed-wars-unique-challenges-completed").innerText = `(` + checkAndFormat(bedWarsStats["bw_unique_challenges_completed"]) + `/30)`;
    
    if(bedWarsStats["bw_unique_challenges_completed"] == 30) {
        document.getElementById("bed-wars-unique-challenges-completed").style.color = `var(--gold)`;
    }

    if(bedWarsStats["slumber"] != undefined) {
        document.getElementById("bed-wars-slumber-tickets").innerText = checkAndFormat(bedWarsStats["slumber"]["tickets"]);
    }

    for(a = 0; a < modes.length; a++) { // Regular stats
        bedWarsChip = [
            ("bed-wars-stats-" + (modeNames[a]).toLowerCase()), // ID
            modeNames[a], // Title
            "", // Subtitle (none)
            ("/img/games/bedwars/" + (modeNames[a]).toLowerCase() + ".png"), // Image
            getBedWarsModeStats(modes[a]), // Displayed stats
            [] // Other stats (shown in drop-down menu) (none here)
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
    console.log("Dreams stats:")
    console.log(totalDreamModeStatsCounts);

    totalDreamModeStats = [
        [true, ["Winstreak", checkAndFormat(dreamModeWinstreak)]],
        [false, ["Wins", checkAndFormat(totalDreamModeStatsCounts[0])],
            ["Losses", checkAndFormat(totalDreamModeStatsCounts[1])],
            ["W L/R", (calculateRatio(totalDreamModeStatsCounts[0], totalDreamModeStatsCounts[1], 2))]
        ],
        [false, ["Kills", checkAndFormat(totalDreamModeStatsCounts[2])],
            ["Deaths", checkAndFormat(totalDreamModeStatsCounts[3])],
            ["K D/R", (calculateRatio(totalDreamModeStatsCounts[2], totalDreamModeStatsCounts[3], 2))]
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
        dreamModes
    ]);

    console.log(bedWarsChips);
        for(d = 0; d < bedWarsChips.length; d++) {
            generateChip(bedWarsChips[d], "bed-wars-chips");
        }
    }
}

function getBedWarsModeStats(mode) {
    return [
            [true, ["Winstreak", checkAndFormat(bedWarsStats[mode + "_winstreak"])]],
            [false, ["Wins", checkAndFormat(bedWarsStats[mode + "_wins_bedwars"])],
                ["Losses", checkAndFormat(bedWarsStats[mode + "_losses_bedwars"])],
                ["W L/R", (calculateRatio(bedWarsStats[mode + "_wins_bedwars"], bedWarsStats[mode + "_losses_bedwars"], 2))]
            ],
            [false, ["Kills", checkAndFormat(bedWarsStats[mode + "_kills_bedwars"])],
                ["Deaths", checkAndFormat(bedWarsStats[mode + "_deaths_bedwars"])],
                ["K D/R", (calculateRatio(bedWarsStats[mode + "_kills_bedwars"], bedWarsStats[mode + "_deaths_bedwars"], 2))]
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

function updateChipStats(event, chipId) { // Updates what a chip does when a dropdown is clicked
    newValue = event.target.value;
    console.log([chipId, newValue]);
    if(chipId = "bed-wars-stats-dreams") {
        if(newValue == "overall") {
            document.getElementById(chipId).innerHTML = generateChipStats(totalDreamModeStats);
        } else {
            console.log(newValue);
            document.getElementById(chipId).innerHTML = generateChipStats(getBedWarsModeStats(newValue));
        }
    }
}