// anything that can be gotten by accessing a section, varb, or value
// should be left to the section or varb.
// those are fundamental concepts to this design.

import { nanoid } from "nanoid";
import {
  initChildFeIds,
  resetSectionAndChildDbIds,
} from "./Analyzer/methods/protected/updateChildIds";
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
} from "./Analyzer/methods/get/nestedInfos";
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
} from "./Analyzer/methods/get/section";
import {
  replaceInSectionArr,
  sectionArr,
  sectionArrInfos,
  sectionOptions,
  setSectionArr,
  wipeSectionArrAndSolve,
} from "./Analyzer/methods/sectionArr";
import {
  eraseSectionAndSolve,
  eraseSectionsAndSolve,
  deleteIndexAndSolve,
  deleteRowIndexAndSolve,
} from "./Analyzer/methods/eraseSectionAndSolve";
import { addSections } from "./Analyzer/methods/protected/addSections";
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
  resetRowCells,
  pushToRowIndexStore,
  updateRowIndexStore,
  findRowCellByColumn,
  sortTableRowIdsByColumn,
} from "./Analyzer/methods/indexRows";
import {
  dbSectionArrs,
  dbEntryArr,
  dbEntry,
  stateToDbSection,
  dbIndexEntry,
} from "./Analyzer/methods/get/dbSections";

import {
  feValue,
  findValue,
  loadValueFromVarb,
  outputValues,
  updateSectionValues,
  updateValue,
  updateValueDirectly,
  value,
  varbInfoValues,
} from "./Analyzer/methods/updateValue";
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
} from "./Analyzer/methods/get/varb";
import { updateSection } from "./Analyzer/methods/get/section";
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
import {
  feInfo,
  feToDbInfo,
  varbInfosByFocal,
} from "./Analyzer/methods/get/info";
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
  addInEntity,
  addOutEntity,
  removeInEntity,
  removeOutEntity,
} from "./Analyzer/methods/protected/inOutEntities";
import {
  pushToIndexStore,
  updateIndexStoreEntry,
} from "./Analyzer/methods/updateStore";
import { ObjectKeys } from "./utils/Obj";
import { SectionNam, SectionName } from "./Analyzer/SectionMetas/SectionName";
import {
  addSectionAndSolve,
  addSectionsAndSolve,
  InitSectionOptions,
} from "./Analyzer/methods/addSectionAndSolve";
import { resetSection } from "./Analyzer/methods/protected/resetSection";
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
import { resetSectionAndSolve } from "./Analyzer/methods/resetSectionAndSolve";
import {
  eraseChildren,
  eraseSectionAndChildren,
} from "./Analyzer/methods/protected/eraseSectionAndChildren";
import { updateConnectedEntities } from "./Analyzer/methods/updateConnectedEntities";
import {
  fullStoreEntries,
  fullStoreTitlesAndDbIds,
} from "./Analyzer/methods/get/fullStore";

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
  protected addSections = addSections;

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

  eraseSectionAndSolve = eraseSectionAndSolve;
  deleteIndexAndSolve = deleteIndexAndSolve;
  deleteRowIndexAndSolve = deleteRowIndexAndSolve;
  eraseSectionsAndSolve = eraseSectionsAndSolve;
  protected eraseChildren = eraseChildren;
  protected eraseSectionAndChildren = eraseSectionAndChildren;

  protected resetSectionAndChildDbIds = resetSectionAndChildDbIds;
  childDbIds = childDbIds;
  initChildFeIds = initChildFeIds;

  // info
  varbInfosByFocal = varbInfosByFocal;
  feToDbInfo = feToDbInfo;
  feInfo = feInfo;

  parent = parent;
  childFeIds = childFeIds;
  allChildFeIds = allChildFeIds;
  children = children;
  childFeInfos = childFeInfos;

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
  displayName = displayName;
  displayNameOrNotFound = displayNameOrNotFound;
  displayNameInfo = displayNameInfo;

  value = value;
  feValue = feValue;
  findValue = findValue;
  loadValueFromVarb = loadValueFromVarb;
  updateValue = updateValue;
  updateValueDirectly = updateValueDirectly;
  updateSectionValues = updateSectionValues;
  varbInfoValues = varbInfoValues;
  outputValues = outputValues;

  addInEntity = addInEntity;
  addOutEntity = addOutEntity;

  removeOutEntity = removeOutEntity;
  removeInEntity = removeInEntity;

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

  updateConnectedEntities = updateConnectedEntities;

  variableOptions = variableOptions;

  dbEntry = dbEntry;
  dbIndexEntry = dbIndexEntry;
  dbEntryArr = dbEntryArr;
  dbSectionArrs = dbSectionArrs;
  stateToDbSection = stateToDbSection;

  pushToIndexStore = pushToIndexStore;
  updateIndexStoreEntry = updateIndexStoreEntry;

  fullStoreEntries = fullStoreEntries;
  fullStoreTitlesAndDbIds = fullStoreTitlesAndDbIds;

  pushToRowIndexStore = pushToRowIndexStore;
  resetRowCells = resetRowCells;
  updateRowIndexStore = updateRowIndexStore;
  findRowCellByColumn = findRowCellByColumn;
  sortTableRowIdsByColumn = sortTableRowIdsByColumn;

  getOutVarbMap = getOutVarbMap;
  getDagEdgesAndLoneVarbs = getDagEdgesAndLoneVarbs;
  gatherAndSortInfosToSolve = gatherAndSortInfosToSolve;
}
