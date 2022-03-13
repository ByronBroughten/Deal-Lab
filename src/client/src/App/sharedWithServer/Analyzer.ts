import { nanoid } from "nanoid";
import {
  displayName,
  displayNameInfo,
  displayNameOrNotFound,
} from "./Analyzer/methods/get/displayName";
import { variableOptions } from "./Analyzer/methods/variableOptions";
import {
  nestedFeInfos,
  nestedFeOutVarbInfos,
  nestedFeVarbInfos,
  nestedNumObjInfos,
  relativesToFeVarbInfos,
  relativeToFeVarbInfo,
} from "./Analyzer/methods/nestedInfos";
import {
  childFeIds,
  allChildFeIds,
  children,
  firstSection,
  hasSection,
  lastSection,
  parent,
  section,
  sectionByFocal,
  sectionNotFound,
  sectionOutFeVarbInfos,
  singleSection,
  sectionsByFocal,
  childFeInfos,
  sectionIsIndexSaved,
  parentFinderToInfo,
} from "./Analyzer/methods/section";
import {
  replaceInSectionArr,
  sectionArr,
  sectionArrInfos,
  sectionOptions,
  setSectionArr,
  wipeSectionArrAndSolve,
} from "./Analyzer/methods/sectionArr";
import {
  eraseOneSection,
  eraseSectionAndChildren,
  eraseChildren,
  eraseSectionAndSolve,
  eraseSectionsAndSolve,
  removeFromParentChildIds,
  removeSectionEntities,
  removeSection,
  varbInfosToSolveAfterErase,
  deleteIndexAndSolve,
  deleteRowIndexAndSolve,
} from "./Analyzer/methods/sectionErase";

import { SectionMeta, sectionMetas } from "./Analyzer/SectionMetas";
import {
  directUpdateAndSolve,
  solveAllActiveVarbs,
  solveVarbs,
} from "./Analyzer/methods/solveVarbs";
import {
  gatherAndSortInfosToSolve,
  getDagEdgesAndLoneVarbs,
  getOutVarbMap,
} from "./Analyzer/methods/solveVarbs/gatherAndSortInfosToSolve";
import {
  solveAndUpdateValue,
  solveValue,
} from "./Analyzer/methods/solveVarbs/solveAndUpdateValue";
import StateSection, { StateSectionCore } from "./Analyzer/StateSection";
import {
  pushToRowIndexStore,
  updateRowIndexStore,
  sortTableRowIdsByColumn,
} from "./Analyzer/methods/indexRows";
import {
  sectionArrsToDbEntries,
  toDbEntryArr,
  toDbAnalysisIndexEntry,
  stateToDbEntries,
  toDbEntry,
  stateToDbSection,
  stateToDbSections,
  toDbIndexEntry,
} from "./Analyzer/methods/stateToFromDbSections";

import {
  feValue,
  findValue,
  outputValues,
  value,
  varbInfoValues,
} from "./Analyzer/methods/get/value";
import {
  displayVarb,
  feVarb,
  inUpdatePack,
  inVarbInfos,
  varbSwitchIsActive,
  outVarbInfos,
  replaceVarb,
  relativeInVarbInfos,
  staticVarb,
  switchedOngoingDisplayVarb,
  switchedOngoingVarb,
  switchedVarb,
  switchIsActive,
  updateFnName,
  updateFnProps,
  varb,
  varbByFocal,
  varbsByFocal,
  updateVarb,
  switchedVarbName,
  switchedOngoingVarbName,
} from "./Analyzer/methods/varb";
import { updateSection } from "./Analyzer/methods/section";
import { nanoIdLength } from "./utils/validatorConstraints";
import {
  findFeInfo,
  findFeInfoByFocal,
  findFeInfosByFocal,
  findSection,
  findSectionByDbId,
  findSectionByFeId,
  findSectionByFocal,
  findSectionsByFocal,
  findVarb,
  findVarbByFocal,
  findVarbInfosByFocal,
  findVarbsByFocal,
} from "./Analyzer/methods/get/find";
import { feInfo, feToDbInfo, varbInfosByFocal } from "./Analyzer/methods/info";
import {
  conditionalUserVarbValue,
  getUserVarbValue,
} from "./Analyzer/methods/solveVarbs/solveAndUpdateValue/updateUserVarb";
import {
  getNumberVarbs,
  getSolvableNumber,
  solvableTextToNumber,
  solvableTextFromCalculation,
  solvableTextFromCalcVarbs,
  solvableTextFromEditorTextAndEntities,
} from "./Analyzer/methods/solveVarbs/solveAndUpdateValue/updateNumericObjCalc";
import {
  fullStoreEntries,
  fullStoreTitlesAndDbIds,
  pushToIndexStore,
  updateIndexStoreEntry,
  stateToUpdateSingleStoreArr,
} from "./Analyzer/methods/stateToFullStore";
import { ObjectKeys } from "./utils/Obj";
import { SectionNam, SectionName } from "./Analyzer/SectionMetas/SectionName";
import {
  addSectionAndSolve,
  addSectionsAndSolve,
  InitSectionOptions,
} from "./Analyzer/methods/addSectionAndSolve";
import {
  resetSection,
  resetSectionAndSolve,
} from "./Analyzer/methods/protected/resetSectionAndSolve";
import { copySection } from "./Analyzer/methods/copySection";
import {
  loadSectionFromFeDefault,
  loadSectionFromFeIndex,
  setAsDefaultSectionArr,
} from "./Analyzer/methods/loadSectionFromStore";
import {
  loadSectionArrAndSolve,
  loadSectionArrsAndSolve,
} from "./Analyzer/methods/loadSectionFromEntry";
import { childDbIdArrs } from "./Analyzer/methods/get/childArrs";
import { resetSectionAndChildDbIds } from "./Analyzer/methods/protected/resetSectionAndChildDbIds";
import {
  loadValueFromVarb,
  updateSectionValues,
  updateValue,
  updateValueDirectly,
} from "./Analyzer/methods/updateValue";

export type StateSections = { [S in SectionName]: StateSection<S>[] };
type RawSections = { [S in SectionName]: StateSectionCore<S>[] };
export type AnalyzerCore = { sections: StateSections };
export default class Analyzer {
  readonly sections: StateSections;
  constructor({
    sections = Analyzer.blankStateSections(),
  }: Partial<AnalyzerCore> = {}) {
    this.sections = sections;
  }

  static initAnalyzer(options: InitSectionOptions = {}): Analyzer {
    let next = new Analyzer();

    next = next.addSectionAndSolve(
      "main",
      {
        sectionName: "no parent",
        id: "no parent",
        idType: "feId",
      },
      {
        ...options,
        initFromDefault: false,
        // default section stores are created, to be used momentarily
      }
    );

    for (const sectionName of next.sectionNames) {
      if (SectionNam.is(sectionName, "hasDefaultStore")) {
        const sectionArrInfos = next.sectionArrInfos(sectionName);
        if (sectionArrInfos.length > 0) {
          for (const feInfo of sectionArrInfos) {
            next = next.resetSectionAndSolve(feInfo, {
              resetDbIds: true,
              initFromDefault: true,
              // sections load from their default stores
            });
          }
        }
      }
    }
    return next.solveAllActiveVarbs();
  }

  get rawSections(): RawSections {
    const sectionNames = ObjectKeys(this.sections);
    return sectionNames.reduce((rawCore, sectionName) => {
      const sectionArr = this.sections[sectionName];
      const rawSectionArr = sectionArr.map(
        (section) => section.coreClone
      ) as StateSectionCore<typeof sectionName>[];
      rawCore[sectionName] = rawSectionArr as any;
      return rawCore;
    }, {} as RawSections);
  }

  stringifySections() {
    return JSON.stringify(this.rawSections);
  }
  get core() {
    return { sections: this.sections };
  }
  get meta() {
    // depreciated
    return sectionMetas;
  }
  get sectionNames() {
    return ObjectKeys(this.sections);
  }
  sectionMeta<S extends SectionName>(sectionName: S): SectionMeta<S> {
    return sectionMetas.get(sectionName);
  }
  copy(): Analyzer {
    return new Analyzer(this.core);
  }
  static makeId() {
    return nanoid(nanoIdLength);
  }
  static blankStateSections(): StateSections {
    const core = ObjectKeys(sectionMetas.raw).reduce((core, sectionName) => {
      core[sectionName] = [];
      return core;
    }, {} as StateSections);
    return core;
  }

  // get

  displayName = displayName;
  displayNameOrNotFound = displayNameOrNotFound;
  displayNameInfo = displayNameInfo;

  nestedFeInfos = nestedFeInfos;
  nestedFeVarbInfos = nestedFeVarbInfos;
  nestedFeOutVarbInfos = nestedFeOutVarbInfos;
  nestedNumObjInfos = nestedNumObjInfos;
  relativeToFeVarbInfo = relativeToFeVarbInfo;
  relativesToFeVarbInfos = relativesToFeVarbInfos;

  loadSectionFromFeIndex = loadSectionFromFeIndex;
  loadSectionFromFeDefault = loadSectionFromFeDefault;
  setAsDefaultSectionArr = setAsDefaultSectionArr;

  copySection = copySection;

  addSectionsAndSolve = addSectionsAndSolve;
  addSectionAndSolve = addSectionAndSolve;

  loadSectionArrAndSolve = loadSectionArrAndSolve;
  loadSectionArrsAndSolve = loadSectionArrsAndSolve;

  resetSectionAndSolve = resetSectionAndSolve;
  protected resetSection = resetSection;

  sectionArr = sectionArr;
  sectionArrInfos = sectionArrInfos;
  setSectionArr = setSectionArr;
  replaceInSectionArr = replaceInSectionArr;
  wipeSectionArrAndSolve = wipeSectionArrAndSolve;
  sectionOptions = sectionOptions;

  section = section;
  hasSection = hasSection;
  sectionIsIndexSaved = sectionIsIndexSaved;
  sectionByFocal = sectionByFocal;
  sectionsByFocal = sectionsByFocal;
  updateSection = updateSection;
  sectionOutFeVarbInfos = sectionOutFeVarbInfos;
  firstSection = firstSection;
  lastSection = lastSection;
  singleSection = singleSection;
  static sectionNotFound = sectionNotFound;

  parent = parent;
  parentFinderToInfo = parentFinderToInfo;
  childFeIds = childFeIds;
  allChildFeIds = allChildFeIds;
  children = children;
  childFeInfos = childFeInfos;

  eraseOneSection = eraseOneSection;
  eraseSectionAndChildren = eraseSectionAndChildren;
  eraseSectionAndSolve = eraseSectionAndSolve;
  deleteIndexAndSolve = deleteIndexAndSolve;
  deleteRowIndexAndSolve = deleteRowIndexAndSolve;
  eraseSectionsAndSolve = eraseSectionsAndSolve;
  eraseChildren = eraseChildren;
  varbInfosToSolveAfterErase = varbInfosToSolveAfterErase;
  removeSectionEntities = removeSectionEntities;
  removeFromParentChildIds = removeFromParentChildIds;
  removeSection = removeSection;

  resetSectionAndChildDbIds = resetSectionAndChildDbIds;
  childDbIdArrs = childDbIdArrs;

  // info
  varbInfosByFocal = varbInfosByFocal;
  feToDbInfo = feToDbInfo;
  feInfo = feInfo;

  // find
  findSectionByDbId = findSectionByDbId;
  findSectionByFeId = findSectionByFeId;
  findFeInfo = findFeInfo;
  findSection = findSection;
  findVarb = findVarb;
  findFeInfoByFocal = findFeInfoByFocal;
  findSectionByFocal = findSectionByFocal;
  findVarbByFocal = findVarbByFocal;
  findFeInfosByFocal = findFeInfosByFocal;
  findVarbInfosByFocal = findVarbInfosByFocal;
  findSectionsByFocal = findSectionsByFocal;
  findVarbsByFocal = findVarbsByFocal;

  varb = varb;
  feVarb = feVarb;
  varbByFocal = varbByFocal;
  varbsByFocal = varbsByFocal;
  updateVarb = updateVarb;
  relativeInVarbInfos = relativeInVarbInfos;
  inVarbInfos = inVarbInfos;
  displayVarb = displayVarb;
  updateFnName = updateFnName;
  updateFnProps = updateFnProps;
  outVarbInfos = outVarbInfos;
  inUpdatePack = inUpdatePack;
  switchIsActive = switchIsActive;
  varbSwitchIsActive = varbSwitchIsActive;
  replaceVarb = replaceVarb;
  staticVarb = staticVarb;
  switchedVarbName = switchedVarbName;
  switchedOngoingVarbName = switchedOngoingVarbName;
  switchedVarb = switchedVarb;
  switchedOngoingVarb = switchedOngoingVarb;
  switchedOngoingDisplayVarb = switchedOngoingDisplayVarb;

  updateValue = updateValue;
  updateValueDirectly = updateValueDirectly;
  loadValueFromVarb = loadValueFromVarb;
  updateSectionValues = updateSectionValues;

  value = value;
  feValue = feValue;
  findValue = findValue;

  varbInfoValues = varbInfoValues;
  outputValues = outputValues;

  conditionalUserVarbValue = conditionalUserVarbValue;
  getUserVarbValue = getUserVarbValue;

  getSolvableNumber = getSolvableNumber;
  solvableTextFromEditorTextAndEntities = solvableTextFromEditorTextAndEntities;
  solvableTextToNumber = solvableTextToNumber;
  getNumberVarbs = getNumberVarbs;
  solveAndUpdateValue = solveAndUpdateValue;
  solvableTextFromCalculation = solvableTextFromCalculation;
  solvableTextFromCalcVarbs = solvableTextFromCalcVarbs;

  solveVarbs = solveVarbs;
  solveAllActiveVarbs = solveAllActiveVarbs;
  directUpdateAndSolve = directUpdateAndSolve;
  solveValue = solveValue;

  variableOptions = variableOptions;

  toDbEntry = toDbEntry;
  toDbIndexEntry = toDbIndexEntry;
  toDbAnalysisIndexEntry = toDbAnalysisIndexEntry;
  toDbEntryArr = toDbEntryArr;
  sectionArrsToDbEntries = sectionArrsToDbEntries;
  stateToDbSection = stateToDbSection;
  stateToDbSections = stateToDbSections;
  stateToDbEntries = stateToDbEntries;

  pushToIndexStore = pushToIndexStore;
  updateIndexStoreEntry = updateIndexStoreEntry;
  stateToUpdateSingleStoreArr = stateToUpdateSingleStoreArr;
  fullStoreEntries = fullStoreEntries;
  fullStoreTitlesAndDbIds = fullStoreTitlesAndDbIds;

  pushToRowIndexStore = pushToRowIndexStore;
  updateRowIndexStore = updateRowIndexStore;
  sortTableRowIdsByColumn = sortTableRowIdsByColumn;

  getOutVarbMap = getOutVarbMap;
  getDagEdgesAndLoneVarbs = getDagEdgesAndLoneVarbs;
  gatherAndSortInfosToSolve = gatherAndSortInfosToSolve;
}
