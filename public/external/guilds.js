let guildRanks = {};

function getRankPriorities() {
  let guildRankObject = guildStats["ranks"] || [];

  for (let a = 0; a < guildRankObject.length; a++) {
    let rank = guildRankObject[a];
    guildRanks[rank["name"]] = rank["priority"];
  }
}

function shortDate(date) {
  let [year, month, day] = und(date.split('-'));

  let dateObject = new Date(year, month - 1, day)

  let formattedDate = new Intl.DateTimeFormat(userLanguage, { day: 'numeric', month: 'short' }).format(dateObject);

  return(formattedDate);
}

function generateGeneralGuildStats() {
  updateElement("guild-name", guildStats["name"]);
  updateElement("guild-tag", generateMinecraftText(guildStats["tag"]), true);

  if (guildStats["description"] != "") {
    updateElement("guild-description", `"${guildStats["description"]}"`);
  }

  updateElement("guild-created-ago", shortDateFormat(guildStats["created"]));
  updateElement("guild-created-ago-full", longDateFormat(guildStats["created"]));

  updateElement("guild-members", checkAndFormat(guildStats["members"].length));
  updateElement("guild-level", checkAndFormat(Math.floor(guildStats["level"])));
}

function guildPlayerObjectToRow(guildObj) {  

  let guildRowTemplate = `
  <div class="row-header">

  <div class="column"><img class="head" data-i="head"></div>
  <div class="column nowrap">
    <a data-i="name" target="_blank"></a>
  </div>
  <div class="column" data-i="rank"></div>

  <div class="column date">
    <span class="tooltip">
      <span data-i="joined"></span>
      <span class="tooltiptext" data-i="joined-ago-full"></span>
    </span>

    <span class="tooltiptext" data-i="joined-ago"></span>
  </div>

  <div class="column" data-i="expandable"><img class="arrow-icon" src="/img/svg/bigarrow.svg" /></div>
</div>
<div class="row-content">
  
<div class="login-info flex-two-item">
  <p class="flex-item margin10">
    <span><span>${getTranslation("statistics.level")}</span> <span data-i="level" class="statistic"></span></span>
    <span class="tooltip">
      <span class="m8">(<span data-i="multiplier"></span>×)</span><span class="tooltiptext">${getTranslation("player.coin_multiplier")}</span>
    </span>
  </p>

  <p class="flex-item margin10 content-joined-header">
    <span>${getTranslation("statistics.joined")}</span> <span class="tooltip"><span class="statistic" data-i="content-joined"></span><span class="tooltiptext" data-i="content-joined-ago-full"></span></span>
        <span data-i="content-joined-ago"></span>
  </p>
</div>

  <div class="stats">
    <div class="login-info flex-two-item">
      <p class="flex-item margin10">
        <span>${getTranslation("statistics.first_login")}</span> <span class="tooltip"><span class="statistic" data-i="first-login"></span><span class="tooltiptext" data-i="first-login-ago-full"></span></span>
        <span data-i="first-login-ago"></span> <span class="tooltip"><img data-i="birthday" class="icon tinyicon birthday" src="/img/special/cake.png" /><span class="tooltiptext" data-i="birthday-text"></span></span>
      </p>

      <p data-i="last-login-container" class="flex-item login-duo">
        <span>${getTranslation("statistics.last_login")}</span> <span class="tooltip"><span class="statistic" data-i="last-login"></span><span class="tooltiptext" data-i="last-login-ago-full"></span></span>
        <span data-i="last-login-ago"></span>
      </p>
    </div>
    <div class="flex-two-item general-guild" style="align-items: start;">
      <div class="general-stats flex-item">
        <p class="stat-title super-subtitle">${getTranslation("games.modes.network.general")}</p>
        <p><span>${getTranslation("statistics.achievement_points")}</span> <span class="statistic" data-i="achievement-points"></span></p>
        <p><span>${getTranslation("statistics.karma")}</span> <span class="statistic" data-i="karma"></span></p>
        <p><span>${getTranslation("statistics.quests_completed")}</span> <span class="statistic" data-i="quests-completed"></span></p>
        <p><span>${getTranslation("statistics.ranks_gifted")}</span> <span class="statistic" data-i="ranks-gifted"></span></p>
      </div>

      <div class="general-stats flex-item" data-i="guild-stats">
        <p class="stat-title super-subtitle">${getTranslation("statistics.guild_experience")}</p>
        <div class="chart-container">
          <canvas class="chart" style="max-height: 100%"></canvas>
        </div>
      </div>
    </div>
  </div>
</div>
`;


  let newRow = document.createElement("div");
  newRow.classList.add("row");
  newRow.innerHTML = guildRowTemplate;

  let playerProfile = guildObj["profile"] || {};

  //console.warn("uuid: " + guildObj["uuid"]);
  //console.log(playerProfile);
  guildUUIDs.push(guildObj["uuid"]);

  const myChartCanvas = newRow.querySelector('.chart');
  myChartCanvas.id = "chart-" + guildObj["uuid"];
  console.warn(myChartCanvas.id);

  if(playerProfile["tagged_name"] == undefined || playerProfile["tagged_name"] == null) {
    updateTag(newRow, "name", `<i class="m4">${guildObj["uuid"]}</i>`, true);
  } else {
    updateTag(newRow, "name", generateMinecraftText(playerProfile["tagged_name"]), true);
  }
  newRow.querySelector(`[data-i="name"]`).href = `/player/${guildObj["uuid"]}`;
  
  newRow.querySelector(`[data-i="head"]`).src = `https://minotar.net/helm/${guildObj["uuid"]}/8.png`;

  updateTag(newRow, "rank", guildObj["rank"]);
  
  let joined = guildObj["joined"];
  updateTag(newRow, "joined", shortDateFormat(joined));
  updateTag(newRow, "joined-ago", relativeTime(joined));
  updateTag(newRow, "joined-ago-full", longDateFormat(joined));

  updateTag(newRow, "content-joined", shortDateFormat(joined));
  updateTag(newRow, "content-joined-ago", relativeTime(joined));
  updateTag(newRow, "content-joined-ago-full", longDateFormat(joined));

  let firstLoginDate = new Date(und(playerProfile["first_login"]))
  updateTag(newRow, "first-login", shortDateFormat(firstLoginDate));
  updateTag(newRow, "first-login-ago", relativeTime(firstLoginDate));
  updateTag(newRow, "first-login-ago-full", longDateFormat(firstLoginDate));
  
  let dateNow = new Date();

  if (firstLoginDate.getMonth() == dateNow.getMonth() && firstLoginDate.getDate() == dateNow.getDate() && firstLoginDate.getYear() != dateNow.getYear()) {
    newRow.querySelector(`[data-i="birthday"]`).style.display = "initial"; // Makes the birthday cake visible if it's your Hypixel anniversary!
    newRow.querySelector(`[data-i="birthday-text"]`).innerText = insertPlaceholders(getTranslation("player.birthday"), {num: dateNow.getYear() - firstLoginDate.getYear()});
    console.log("Birthday cake visible");
  }

  newRow.setAttribute('data-joined', joined); 

  console.log(playerProfile["tagged_name"]);
  console.log(guildObj["uuid"]);
  newRow.setAttribute('data-name', deformatName(playerProfile["tagged_name"]));

  if (guildRanks[guildObj["rank"]] == undefined) {
    newRow.setAttribute('data-priority', Number.MAX_SAFE_INTEGER);
  } else {
    newRow.setAttribute('data-priority', guildRanks[guildObj["rank"]]);
  }
  

  let lastLogin = und(playerProfile["last_login"]);

  lastLoginDate = new Date(lastLogin);
  if (lastLogin == 0) newRow.querySelector(`[data-i="last-login-container"]`).style.display = "none";
  else {
    updateTag(newRow, "last-login", shortDateFormat(lastLoginDate));
    updateTag(newRow, "last-login-ago", `${relativeTime(lastLoginDate)}`);
    updateTag(newRow, "last-login-ago-full", longDateFormat(lastLoginDate));
  }

  updateTag(newRow, "level", locale(Math.floor(und(playerProfile["network_level"])), 0));
  updateTag(newRow, "achievement-points", checkAndFormat(playerProfile["achievement_points"]));
  updateTag(newRow, "karma", checkAndFormat(playerProfile["karma"]));
  updateTag(newRow, "quests-completed", checkAndFormat(playerProfile["quests_completed"]));
  updateTag(newRow, "ranks-gifted", checkAndFormat(playerProfile["ranks_gifted"]));
  updateTag(newRow, "multiplier", rawLocale(und(playerProfile["coin_multiplier"]), null));

  let playerBadge = guildObj["badge"] || "NONE";

  if (playerBadge != "NONE") {
    let badgeElement = document.createElement("img");
    badgeElement.src = `/img/special/${playerBadge}.png`;
    
    badgeElement.classList.add("tinybadge");
    badgeElement.classList.add("icon");
    badgeElement.classList.add("special");
    badgeElement.style.display = "inline-block";

    let badgeGradient = document.createElement("p");
    badgeGradient.classList.add("badge-gradient");

    let badgeColor = badgeColors[playerBadge] || "#f6acd6";
    badgeGradient.style.background = `linear-gradient(90deg, ${badgeColor} 0%, ${badgeColor} 20%, ${badgeColor}80 20%, transparent 100%)`;

    newRow.style.backgroundColor = `${badgeColor}30`;

    newRow.classList.add("has-badge");
    newRow.querySelector(`[data-i="name"]`).appendChild(badgeElement);

    newRow.appendChild(badgeGradient);
    console.warn(badgeElement);
  }

  return newRow;
}

function compareAttributes(attribute, reverse = false) { 

  let reverseMultiplier = reverse ? -1 : 1;

  let attributeClassifications = {
    "priority": {
      type: "number",
      reverse: false
    },
    "joined": {
      type: "number",
      reverse: true
    },
    "name": {
      type: "string",
      reverse: true
    }
  };

  let attributeClassification = attributeClassifications[attribute];
  
  if (attributeClassification["reverse"] == true) {
    reverseMultiplier *= -1; // This is here because certain attributes should have their sorting reversed, such as name where lower values should be at the top (A-Z)
  }

  return function(a, b) {

    let aValue, bValue;
    if (attributeClassification["type"] == "string") {
      aValue = und(a.dataset[attribute]);
      bValue = und(b.dataset[attribute]);

      console.warn([aValue, bValue]);

      return aValue.localeCompare(bValue, userLanguage, { sensitivity: "base" }) * reverseMultiplier;
    } else if (attributeClassification["type"] == "number") {
      aValue = und(Number(a.dataset[attribute]));
      bValue = und(Number(b.dataset[attribute]));

      if (aValue < bValue) {
        return 1 * reverseMultiplier;
      } else if (aValue > bValue) {
        return -1 * reverseMultiplier;
      }
    }

    return 0;
  };
}


let currentSort;
let currentReverse = false;
let guildUUIDs = [];

 /* 
  * Sorts the guild data by a certain attribute
  * @param {string} attribute - The attribute to sort by (like "priority" or "joined")
  * @param {boolean} reverse - Whether to reverse the sorting
  */
function sortData(attribute = "priority", reverse = false) {
  if (currentSort == attribute) {
    reverse = !currentReverse;
    currentReverse = reverse;
  } else {
    reverse = false;
    currentReverse = false;
  }

  let guildHeaderElements = ["header-priority", "header-joined", "header-name"];
  guildHeaderElements.forEach((id) => {
    const iconId = id + "-icon";
    document.getElementById(id).classList.add("deactivated");
    document.getElementById(iconId).classList.add("deactivated");
    document.getElementById(iconId).classList.remove("flipped");
  });

  console.warn(attribute);
  document.getElementById("header-" + attribute).classList.remove("deactivated");
  document.getElementById("header-" + attribute + "-icon").classList.remove("deactivated");

  if (reverse) {
    document.getElementById("header-" + attribute + "-icon").classList.add("flipped");
  }

  currentSort = attribute;

  let guildPlayers = document.getElementById("guild-players");
  let guildPlayerRows = guildPlayers.querySelectorAll(".row:not(.header-row)");
  let guildPlayerRowsArray = Array.from(guildPlayerRows);

  guildPlayerRowsArray.sort(compareAttributes(attribute, reverse));

  guildPlayerRowsArray.forEach((element) => {
    guildPlayers.appendChild(element);
  });
}


Chart.defaults.font.family = "Inter, sans-serif";

function generateChart(uuid) {
  let memberExpHistory = guildStats["members"].find(member => member["uuid"] == uuid)["expHistory"];

  let memberExpDates = Object.keys(memberExpHistory);
  let memberExpValues = Object.values(memberExpHistory);

  memberExpDates = memberExpDates.reverse();

  for (let a = 0; a < memberExpDates.length; a++) {
    memberExpDates[a] = shortDate(memberExpDates[a]);
  }

  memberExpValues = memberExpValues.reverse();

  new Chart(("chart-" + uuid), {
    type: "bar",
    data: {
      labels: memberExpDates,
      datasets: [{
        backgroundColor: "#f6acd6",
        data: memberExpValues
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false
        },
      }
    }
  });
}

function generateCharts() {
  guildUUIDs.forEach((uuid) => {
    generateChart(uuid);
  });
}