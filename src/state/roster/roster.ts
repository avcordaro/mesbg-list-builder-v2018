import { Roster } from "../../types/roster.ts";
import { ListBuilderStore } from "../store.ts";
import { calculateAllianceLevel, checkForSpecialCases } from "./alliance";
import { getFactionList, getFactionType } from "./faction.ts";
import { calculateModelCount, getUniqueModels } from "./models.ts";
import { getWarningsForCreatedRoster } from "./warnings.ts";

export function updateRoster(roster: Roster): Partial<ListBuilderStore> {
  const factionType = getFactionType(roster.warbands);
  const factionList = getFactionList(roster.warbands);
  const uniqueModels = getUniqueModels(roster.warbands);
  const factionMetaData = calculateModelCount(roster.warbands);

  const allianceLevel = calculateAllianceLevel(factionList, factionType);
  const [actualAllianceLevel, warnings] = checkForSpecialCases(
    allianceLevel,
    factionList,
    uniqueModels,
  );

  const armyBonusActive = ["Historical", "Legendary Legion"].includes(
    allianceLevel,
  );

  const {
    warnings: rosterBuildingWarnings,
    losesArmyBonus,
    becomesImpossibleAllies,
  } = getWarningsForCreatedRoster(
    factionList,
    actualAllianceLevel,
    factionMetaData,
    uniqueModels,
  );

  // Replace the empty string at the start of each array with a 0.
  // We do this cause the export will error out on empty strings at the start of an array.
  // Actual fix should be done in the data, but CBA.
  const updatedRoster = JSON.parse(
    JSON.stringify(roster).replaceAll('["",', "[0,"),
  );

  return {
    roster: updatedRoster,
    factions: factionList,
    factionType: factionType,
    factionMetaData: factionMetaData,
    uniqueModels: uniqueModels,
    allianceLevel: becomesImpossibleAllies ? "Impossible" : actualAllianceLevel,
    rosterBuildingWarnings: [...warnings, ...rosterBuildingWarnings],
    armyBonusActive: armyBonusActive && !losesArmyBonus,
  };
}