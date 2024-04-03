function calculateRatio(numerator, denominator, digits = 2) {
    return checkAndFormat((numerator) / ((denominator) == 0 ? 1 : (denominator)), digits);
}

function checkAndFormat(number, digits = 0) {
    return locale(und(number), digits);
}

function und(text) {
    if (text === null || text === undefined || Number.isNaN(text)) return 0;
    return text;
}

function locale(number, digits = 2) {
    return number.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits});
}

function generateBedWars() {
    var bedWarsStats = playerData["stats"]["Bedwars"]; // add check if undefined

    var modes = ["eight_one", "eight_two", "four_three", "four_four", "two_four"];
    var modeNames = ["Solos", "Doubles", "Threes", "Fours", "4v4"];
    var dreamModes = ["idk i don't play dreams"];
    var easyStats = ["wins", "losses", "kills", "deaths", "final_kills", "final_deaths", "beds_broken", "beds_lost"];

    bedWarsChips = [];

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

    for(a = 0; a < modes.length; a++) {
        console.log(modes.length);
        console.log(a + "!");
        console.log(modes[a]);
        bedWarsChip = [modeNames[a], "", ("/img/games/bedwars/" + (modeNames[a]).toLowerCase() + ".png"), 
        [
            [modeNames[a], [
                [true, ["Winstreak", checkAndFormat(bedWarsStats[modes[a] + "_winstreak"])]],
                [false, ["Wins", checkAndFormat(bedWarsStats[modes[a] + "_wins_bedwars"])],
                    ["Losses", checkAndFormat(bedWarsStats[modes[a] + "_losses_bedwars"])],
                    ["W L/R", (calculateRatio(bedWarsStats[modes[a] + "_wins_bedwars"], bedWarsStats[modes[a] + "_losses_bedwars"]), 2)]
                ],
                [false, ["Kills", checkAndFormat(bedWarsStats[modes[a] + "_kills_bedwars"])],
                    ["Deaths", checkAndFormat(bedWarsStats[modes[a] + "_deaths_bedwars"])],
                    ["K D/R", (calculateRatio(bedWarsStats[modes[a] + "_kills_bedwars"], bedWarsStats[modes[a] + "_deaths_bedwars"]),2)]
                ],
                [false, ["Final Kills", checkAndFormat(bedWarsStats[modes[a] + "_final_kills_bedwars"])],
                    ["Final Deaths", checkAndFormat(bedWarsStats[modes[a] + "_final_deaths_bedwars"])],
                    ["FK/D R", (calculateRatio(bedWarsStats[modes[a] + "_final_kills_bedwars"], bedWarsStats[modes[a] + "_final_deaths_bedwars"]),2)]
                ],
                [false, ["Bed Breaks", checkAndFormat(bedWarsStats[modes[a] + "_beds_broken_bedwars"])],
                    ["Bed Losses", checkAndFormat(bedWarsStats[modes[a] + "_beds_lost_bedwars"])],
                    ["BB/L R", (calculateRatio(bedWarsStats[modes[a] + "_beds_broken_bedwars"], bedWarsStats[modes[a] + "_beds_lost_bedwars"]),2)]
                ]
                ]],
            ]];
        console.log(JSON.stringify(bedWarsChip));
        bedWarsChips.push(bedWarsChip);
    }
    console.log(bedWarsChips);
    for(d = 0; d < bedWarsChips.length; d++) {
        generateChip(bedWarsChips[d], "bed-wars-chips");
    }


}