function generateGeneralGuildStats() {
  updateElement("guild-name", guildStats["name"]);
  updateElement("guild-tag", generateMinecraftText(guildStats["tag"]), true);

  if (guildStats["description"] != "") {
    updateElement("guild-description", `"${guildStats["description"]}"`);
  }


  updateElement("guild-created-ago", shortDateFormat(guildStats["created"]));
  updateElement("guild-created-ago-full", longDateFormat(guildStats["created"]));

  updateElement("guild-level", checkAndFormat(Math.floor(guildStats["level"])));
}