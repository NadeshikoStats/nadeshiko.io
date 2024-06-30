var languageJSON;

function updateChipStats(name, chipId, gamemode) {
  // Updates what a chip does when a dropdown is clicked
  newValue = name;
  console.log([newValue, chipId, gamemode]);
  if (gamemode == "duels") {
    updateElement(chipId, generateChipStats(allDuelsStats[newValue][0]), true);
  } else if (gamemode == "bedwars") {
    if (newValue == "overall") {
      updateElement(chipId, generateChipStats(totalDreamModeStats), true);
    } else {
      console.log(newValue);
      updateElement(chipId, generateChipStats(getBedWarsModeStats(newValue)), true);
    }
  } else if (gamemode == "skywars") {
    updateElement(chipId, generateChipStats(getSkyWarsModeStats(newValue)), true);
  } else if (gamemode == "tntgames") {
    updateElement(chipId, generateChipStats(allTNTWizardStats[newValue]), true);
  } else if (gamemode == "arcade_zombies") {
    updateElement(chipId, generateChipStats(getZombiesStats(newValue)), true);
  } else if (gamemode == "arcade_seasonal") {
    updateElement(chipId, generateChipStats(getArcadeSeasonalStats(newValue)), true);
  } else if (gamemode == "arcade_hide_and_seek") {
    updateElement(chipId, generateChipStats(getArcadeHideAndSeekStats(newValue)), true);
  } else if (gamemode == "arena") {
    updateElement(chipId, generateChipStats(getArenaBrawlStats(newValue)), true);
  } else if (gamemode == "quake") {
    updateElement(chipId, generateChipStats(getQuakeStats(newValue)), true);
  } else if (gamemode == "vampirez") {
    updateElement(chipId, generateChipStats(getVampireZStats(newValue)), true);
  } else if (gamemode == "tkr") {
    updateElement(chipId, generateChipStats(getTKRStats(newValue)), true);
  } else if (gamemode == "copsandcrims_guns") {
    updateElement(chipId, generateChipStats(getCopsAndCrimsGunStats(newValue)), true);
  } else if (gamemode == "woolwars") {
    updateElement(chipId, generateChipStats(getWoolWarsStats(newValue)), true);
  } else if (gamemode == "blitz") {
    updateElement(chipId, generateChipStats(getBlitzKitsStats(newValue)), true);
  } else if (gamemode == "megawalls") {
    if (chipId == "megawalls-classes") {
      updateElement(chipId, generateChipStats(getMegaWallsClassStats(newValue)), true);
    } else if (chipId == "megawalls-standard") {
      updateElement(chipId, generateChipStats(getMegaWallsClassStats(newValue, "standard")), true);
    } else if (chipId == "megawalls-faceoff") {
      updateElement(chipId, generateChipStats(getMegaWallsClassStats(newValue, "face_off")), true);
    }
  } else if (gamemode == "warlords") {
    updateElement(chipId, generateChipStats(getWarlordsClassStats(newValue)), true);
  } else if (gamemode == "uhc") {
    updateElement(chipId, generateChipStats(getUHCModeStats(newValue)), true);
  } else if (gamemode == "speeduhc") {
    updateElement(chipId, generateChipStats(getSpeedUHCModeStats(newValue)), true);
  } else if (gamemode == "smashheroes") {
    if (chipId == "smashheroes-classes") {
      updateElement(chipId, generateChipStats(getSmashStats("class", newValue)), true);
    } else if (chipId == "smashheroes-solo") {
      updateElement(chipId, generateChipStats(getSmashStats("normal", newValue)), true);
    } else if (chipId == "smashheroes-team") {
      updateElement(chipId, generateChipStats(getSmashStats("teams", newValue)), true);
    } else if (chipId == "smashheroes-2v2") {
      updateElement(chipId, generateChipStats(getSmashStats("2v2", newValue)), true);
    } else if (chipId == "smashheroes-1v1") {
      updateElement(chipId, generateChipStats(getSmashStats("one_v_one", newValue)), true);
    } else if (chipId == "smashheroes-friend") {
      updateElement(chipId, generateChipStats(getSmashStats("friend", newValue)), true);
    }
  } else if (gamemode == "fishing") {
    if (chipId == "fishing-specialfish") {
      updateElement(chipId, generateChipStats(getSpecialFishStats(newValue)), true);
    } else if (chipId == "fishing-zones") {
      updateElement(chipId, generateChipStats(getFishingZoneStats(newValue)), true);
    } else if (chipId == "fishing-catches") {
      updateElement(chipId, generateChipStats(getFishingCatches(newValue)), true);
    } else if (chipId == "fishing-seasons") {
      const fishingSeason = fishingParticipatedSeasons.find(item => item.id === newValue);
      
      if (fishingSeason) {
        updateElement(chipId, generateChipStats(formatFishingParticipatedSeason(fishingSeason)), true);
      }
    }
  } else if (gamemode == "wizard") {
    cardWizardSettings[chipId] = newValue;
  } else if (gamemode == "settings") {
    settings[chipId] = newValue;
    updateSetting(chipId, newValue);
    if (chipId == "language") {
      document.getElementById("settings-language-reload").style.display = "block";
    }
  }
}

// TODO use swished statemetn