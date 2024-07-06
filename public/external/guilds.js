function getRankPriorities() {
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

  let fake = ``

  let guildRowTemplate = `
  <div class="row-header">
  <div class="column" data-i="name"></div>
  <div class="column" data-i="rank"></div>

  <div class="column">
    <span class="tooltip">
      <span data-i="joined"></span>
      <span class="tooltiptext" data-i="joined-ago-full"></span>
    </span>

    <span class="tooltiptext" data-i="joined-ago"></span>
  </div>

  <div class="column" data-i="expandable"><img class="arrow-icon" src="/img/svg/bigarrow.svg" /></div>
</div>
<div class="row-content">
  <p id="level-container-container">
    <span id="level-container"><span>${getTranslation("statistics.level")}</span> <span data-i="level" class="statistic">60</span></span>
    <span class="tooltip">
      <span class="m8">(<span data-i="multiplier">5</span>×)</span><span class="tooltiptext">${getTranslation("player.coin_multiplier")}</span>
    </span>
  </p>

  <div class="stats">
    <div class="login-info flex-two-item">
      <p class="flex-item margin10">
        <span>${getTranslation("statistics.first_login")}</span> <span class="tooltip"><span class="statistic" data-i="first-login"></span><span class="tooltiptext" data-i="first-login-ago-full"></span></span>
        <span data-i="first-login-ago">(hace 9a)</span> <span class="tooltip"><img data-i="birthday" class="icon tinyicon birthday" src="/img/special/cake.png" /><span class="tooltiptext" data-i="birthday-text"></span></span>
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

      <div class="general-stats flex-item" data-i="guild-stats"></div>
    </div>
  </div>
</div>
  `;

  let newRow = document.createElement("div");
  newRow.classList.add("row");
  newRow.innerHTML = guildRowTemplate;

  let playerProfile = guildObj["profile"] || {};

  function updateTag(dataI, value, useHTML = false) {
    let element = newRow.querySelector(`[data-i=${dataI}]`);
    element.innerText = value;
    if (useHTML) {
      element.innerHTML = value;
    }
  }


  console.warn("uuid: " + guildObj["uuid"]);
  console.log(playerProfile);

  if(playerProfile["tagged_name"] == undefined || playerProfile["tagged_name"] == null) {
    updateTag("name", `<i class="m4">${guildObj["uuid"]}</i>`, true);
  } else {
    updateTag("name", generateMinecraftText(playerProfile["tagged_name"]), true);
  }
  
  updateTag("rank", guildObj["rank"]);

  updateTag("joined", shortDateFormat(guildObj["joined"]));
  updateTag("joined-ago", relativeTime(guildObj["joined"]));
  updateTag("joined-ago-full", longDateFormat(guildObj["joined"]));

  let firstLoginDate = new Date(und(playerProfile["first_login"]))
  updateTag("first-login", shortDateFormat(firstLoginDate));
  updateTag("first-login-ago", relativeTime(firstLoginDate));
  updateTag("first-login-ago-full", longDateFormat(firstLoginDate));
  
  let dateNow = new Date();

  if (firstLoginDate.getMonth() == dateNow.getMonth() && firstLoginDate.getDate() == dateNow.getDate() && firstLoginDate.getYear() != dateNow.getYear()) {
    newRow.querySelector(`[data-i="birthday"]`).style.display = "initial"; // Makes the birthday cake visible if it's your Hypixel anniversary!
    newRow.querySelector(`[data-i="birthday-text"]`).innerText = insertPlaceholders(getTranslation("player.birthday"), {num: dateNow.getYear() - firstLoginDate.getYear()});
    console.log("Birthday cake visible");
  }

  let lastLogin = und(playerProfile["last_login"]);

    lastLoginDate = new Date(lastLogin);
    if (lastLogin == 0) newRow.querySelector(`[data-i="last-login-container"]`).style.display = "none";
    else {
      updateTag("last-login", shortDateFormat(lastLoginDate));
      updateTag("last-login-ago", `${relativeTime(lastLoginDate)}`);
      updateTag("last-login-ago-full", longDateFormat(lastLoginDate));
    }

    updateTag("achievement-points", checkAndFormat(playerProfile["achievement_points"]));
    updateTag("karma", checkAndFormat(playerProfile["karma"]));
    updateTag("quests-completed", checkAndFormat(playerProfile["quests_completed"]));
    updateTag("ranks-gifted", checkAndFormat(playerProfile["ranks_gifted"]));
    updateTag("multiplier", rawLocale(und(playerProfile["coin_multiplier"]), null));

  return newRow;

}