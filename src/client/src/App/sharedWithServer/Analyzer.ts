import { nanoid } from "nanoid";
import {
  addSectionAndSolve,
  addSectionsAndSolve,
  InitSectionOptions,
} from "./Analyzer/methods/addSectionAndSolve";
import { copySection } from "./Analyzer/methods/copySection";
import {
  eraseIndexAndSolve,
  eraseRowIndexAndSolve,
} from "./Analyzer/methods/eraseIndexAndSolve";
import {
  eraseSectionAndSolve,
  eraseSectionsAndSolve,
} from "./Analyzer/methods/eraseSectionAndSolve";
import {
  allChildFeIds,
  childDbIdArrs,
  childFeIds,
  childFeInfos,
  children,
} from "./Analyzer/methods/get/childArrs";
import {
  dbEntry,
  dbEntryArr,
  dbEntryArrs,
  dbIndexEntry,
} from "./Analyzer/methods/get/dbSections";
import {
  displayName,
  displayNameInfo,
  displayNameOrNotFound,
  displayNameVn,
} from "./Analyzer/methods/get/displayName";
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
  fullStoreEntries,
  fullStoreTitlesAndDbIds,
} from "./Analyzer/methods/get/fullStore";
import {
  feInfo,
  feToDbInfo,
  varbInfosByFocal,
} from "./Analyzer/methods/get/info";
import {
  nestedFeInfos,
  nestedFeOutVarbInfos,
  nestedFeVarbInfos,
  nestedNumObjInfos,
  relativesToFeVarbInfos,
  relativeToFeVarbInfo,
} from "./Analyzer/methods/get/nestedInfos";
import { parent, parentFinderToInfo } from "./Analyzer/methods/get/parent";
import {
  firstSection,
  hasSection,
  lastSection,
  section,
  sectionByFocal,
  sectionIsIndexSaved,
  sectionNotFound,
  sectionOutFeVarbInfos,
  sectionsByFocal,
  singleSection,
} from "./Analyzer/methods/get/section";
import {
  sectionArr,
  sectionArrAsOptions,
  sectionArrInfos,
} from "./Analyzer/methods/get/sectionArr";
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
  outVarbInfos,
  relativeInVarbInfos,
  replaceVarb,
  staticVarb,
  switchedOngoingDisplayVarb,
  switchedOngoingVarb,
  switchedOngoingVarbName,
  switchedVarb,
  switchedVarbName,
  switchIsActive,
  updateFnName,
  updateFnProps,
  updateVarb,
  varb,
  varbByFocal,
  varbsByFocal,
  varbSwitchIsActive,
} from "./Analyzer/methods/get/varb";
import { variableOptions } from "./Analyzer/methods/get/variableOptions";
import {
  loadSectionArrAndSolve,
  loadSectionArrsAndSolve,
} from "./Analyzer/methods/loadSectionFromEntry";
import {
  loadSectionFromFeDefault,
  loadSectionFromFeIndex,
  setAsDefaultSectionArr,
} from "./Analyzer/methods/loadSectionFromStore";
import { resetSectionAndSolve } from "./Analyzer/methods/resetSectionAndSolve";
import {
  replaceInSectionArr,
  setSectionArr,
  wipeSectionArrAndSolve,
} from "./Analyzer/methods/setSectionArr";
import { solveAllActiveVarbs, solveVarbs } from "./Analyzer/methods/solveVarbs";
import {
  gatherAndSortInfosToSolve,
  getDagEdgesAndLoneVarbs,
  getOutVarbMap,
} from "./Analyzer/methods/solveVarbs/gatherAndSortInfosToSolve";

import {
  getNumberVarbs,
  getSolvableNumber,
  solvableTextFromCalculation,
  solvableTextFromCalcVarbs,
  solvableTextFromEditorTextAndEntities,
  solvableTextToNumber,
} from "./Analyzer/methods/solveVarbs/solveAndUpdateValue/updateNumericObjCalc";
import {
  conditionalUserVarbValue,
  getUserVarbValue,
} from "./Analyzer/methods/solveVarbs/solveAndUpdateValue/updateUserVarb";
import {
  pushToRowIndexStore,
  sortTableRowIdsByColumn,
  updateRowIndexStore,
} from "./Analyzer/methods/updateRowIndexStore";
import {
  pushToIndexStore,
  updateIndexStoreEntry,
} from "./Analyzer/methods/updateStore";
import {
  directUpdateAndSolve,
  loadValueFromVarb,
  updateSectionValuesAndSolve,
} from "./Analyzer/methods/directUpdateAndSolve";
import { SectionMeta, sectionMetas } from "./Analyzer/SectionMetas";
import { SectionNam, SectionName } from "./Analyzer/SectionMetas/SectionName";
import StateSection, { StateSectionCore } from "./Analyzer/StateSection";
import { ObjectKeys } from "./utils/Obj";
import { Id } from "./Analyzer/SectionMetas/relSections/baseSections/id";

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
    return Id.make();
  }
  static blankStateSections(): StateSections {
    const core = ObjectKeys(sectionMetas.raw).reduce((core, sectionName) => {
      core[sectionName] = [];
      return core;
    }, {} as StateSections);
    return core;
  }

  displayName = displayName;
  displayNameVn = displayNameVn;
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

  sectionArr = sectionArr;
  sectionArrInfos = sectionArrInfos;
  setSectionArr = setSectionArr;
  replaceInSectionArr = replaceInSectionArr;
  wipeSectionArrAndSolve = wipeSectionArrAndSolve;
  sectionArrAsOptions = sectionArrAsOptions;

  section = section;
  hasSection = hasSection;
  sectionIsIndexSaved = sectionIsIndexSaved;
  sectionByFocal = sectionByFocal;
  sectionsByFocal = sectionsByFocal;
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

  eraseSectionAndSolve = eraseSectionAndSolve;
  eraseIndexAndSolve = eraseIndexAndSolve;
  eraseRowIndexAndSolve = eraseRowIndexAndSolve;
  eraseSectionsAndSolve = eraseSectionsAndSolve;

  childDbIdArrs = childDbIdArrs;
  varbInfosByFocal = varbInfosByFocal;
  feToDbInfo = feToDbInfo;
  feInfo = feInfo;

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

  loadValueFromVarb = loadValueFromVarb;
  updateSectionValuesAndSolve = updateSectionValuesAndSolve;

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
  solvableTextFromCalculation = solvableTextFromCalculation;
  solvableTextFromCalcVarbs = solvableTextFromCalcVarbs;

  solveVarbs = solveVarbs;
  solveAllActiveVarbs = solveAllActiveVarbs;
  directUpdateAndSolve = directUpdateAndSolve;

  variableOptions = variableOptions;

  dbEntry = dbEntry;
  dbIndexEntry = dbIndexEntry;
  dbEntryArr = dbEntryArr;
  dbEntryArrs = dbEntryArrs;

  pushToIndexStore = pushToIndexStore;
  updateIndexStoreEntry = updateIndexStoreEntry;
  fullStoreEntries = fullStoreEntries;
  fullStoreTitlesAndDbIds = fullStoreTitlesAndDbIds;

  pushToRowIndexStore = pushToRowIndexStore;
  updateRowIndexStore = updateRowIndexStore;
  sortTableRowIdsByColumn = sortTableRowIdsByColumn;

  getOutVarbMap = getOutVarbMap;
  getDagEdgesAndLoneVarbs = getDagEdgesAndLoneVarbs;
  gatherAndSortInfosToSolve = gatherAndSortInfosToSolve;
}
