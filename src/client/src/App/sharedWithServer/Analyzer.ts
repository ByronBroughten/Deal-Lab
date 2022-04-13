import { AnalyzerReq, analyzerReq } from "./Analyzer/analyzerReq";
import {
  addSectionAndSolve,
  addSectionsAndSolve,
  InitSectionOptions
} from "./Analyzer/methods/addSectionAndSolve";
import { addSectionsAndSolveNext } from "./Analyzer/methods/addSectionsAndSolveNext";
import { copySection } from "./Analyzer/methods/copySection";
import {
  directUpdateAndSolve,
  loadValueFromVarb,
  updateSectionValuesAndSolve
} from "./Analyzer/methods/directUpdateAndSolve";
import {
  eraseIndexAndSolve,
  eraseRowIndexAndSolve
} from "./Analyzer/methods/eraseIndexAndSolve";
import {
  eraseSectionAndSolve,
  eraseSectionsAndSolve
} from "./Analyzer/methods/eraseSectionAndSolve";
import {
  allChildDbIds,
  childSections,
  descendantFeIds,
  selfAndDescendantFeIds
} from "./Analyzer/methods/get/childArrs";
import {
  dbEntry,
  dbEntryArr,
  dbEntryArrs,
  dbIndexEntry
} from "./Analyzer/methods/get/dbSections";
import {
  displayName,
  displayNameInfo,
  displayNameOrNotFound,
  displayNameVn
} from "./Analyzer/methods/get/displayName";
import {
  findFeInfo,
  findFeInfoByFocal,
  findFeInfosByFocal,
  findSection,
  findSectionByDbId,
  findSectionByFeId,
  findSectionByFocal,
  findSections,
  findSectionsByFocal,
  findVarb,
  findVarbByFocal,
  findVarbInfosByFocal,
  findVarbsByFocal
} from "./Analyzer/methods/get/find";
import {
  fullStoreEntries,
  fullStoreTitlesAndDbIds
} from "./Analyzer/methods/get/fullStore";
import { newInEntity } from "./Analyzer/methods/get/inEntity";
import { varbInfosByFocal } from "./Analyzer/methods/get/info";
import {
  nestedFeInfos,
  nestedFeOutVarbInfos,
  nestedFeVarbInfos,
  nestedNumObjInfos,
  relativesToFeVarbInfos,
  relativeToFeVarbInfo
} from "./Analyzer/methods/get/nestedInfos";
import { parent, parentFinderToInfo } from "./Analyzer/methods/get/parent";
import {
  feSection,
  firstSection,
  hasSection,
  lastSection,
  section,
  sectionByFocal,
  sectionIsIndexSaved,
  sectionNotFound,
  sectionOutFeVarbInfos,
  sectionsByFocal,
  singleSection
} from "./Analyzer/methods/get/section";
import {
  sectionArr,
  sectionArrAsOptions,
  sectionArrInfos
} from "./Analyzer/methods/get/sectionArr";
import {
  makeRawSection,
  makeRawSectionPack,
  makeRawSections
} from "./Analyzer/methods/get/sectionPack";
import {
  guestAccessDbSectionPacks,
  sectionPackArr,
  sectionPackArrs
} from "./Analyzer/methods/get/sectionPackArrs";
import {
  feValue,
  findValue,
  outputValues,
  value,
  varbInfoValues
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
  varbSwitchIsActive
} from "./Analyzer/methods/get/varb";
import { variableOptions } from "./Analyzer/methods/get/variableOptions";
import {
  loadSectionArrAndSolve,
  loadSectionArrsAndSolve
} from "./Analyzer/methods/loadSectionFromEntry";
import {
  loadSectionFromFeDefault,
  loadSectionFromFeIndex,
  setAsDefaultSectionArr
} from "./Analyzer/methods/loadSectionFromStore";
import { loadRawSectionPack } from "./Analyzer/methods/loadSectionPack";
import { loadUserAndSolve } from "./Analyzer/methods/loadUserAndSolve";
import { resetSectionAndSolve } from "./Analyzer/methods/resetSectionAndSolve";
import { solveAllActiveVarbs, solveVarbs } from "./Analyzer/methods/solveVarbs";
import {
  gatherAndSortInfosToSolve,
  getDagEdgesAndLoneVarbs,
  getOutVarbMap
} from "./Analyzer/methods/solveVarbs/gatherAndSortInfosToSolve";
import {
  getNumberVarbs,
  getSolvableNumber,
  solvableTextFromCalculation,
  solvableTextFromCalcVarbs,
  solvableTextFromEditorTextAndEntities,
  solvableTextToNumber
} from "./Analyzer/methods/solveVarbs/solveAndUpdateValue/updateNumericObjCalc";
import {
  conditionalUserVarbValue,
  getUserVarbValue
} from "./Analyzer/methods/solveVarbs/solveAndUpdateValue/updateUserVarb";
import {
  pushToRowIndexStore,
  sortTableRowIdsByColumn,
  updateRowIndexStoreAndSolve
} from "./Analyzer/methods/updateRowIndexStoreAndSolve";
import {
  replaceInSectionArr,
  updateSectionArr,
  wipeSectionArrAndSolve
} from "./Analyzer/methods/updateSectionArr";
import {
  pushToIndexStore,
  updateIndexStoreEntry
} from "./Analyzer/methods/updateStore";
import { sectionMetas } from "./Analyzer/SectionMetas";
import { Id } from "./Analyzer/SectionMetas/relSections/baseSections/id";
import { FeVarbInfo } from "./Analyzer/SectionMetas/relSections/rel/relVarbInfoTypes";
import { NextSectionMeta } from "./Analyzer/SectionMetas/SectionMeta";
import { SectionNam, SectionName } from "./Analyzer/SectionMetas/SectionName";
import StateSection, { StateSectionCore } from "./Analyzer/StateSection";
import StateVarb from "./Analyzer/StateSection/StateVarb";
import { Obj, ObjectKeys } from "./utils/Obj";
import { DropFirst } from "./utils/types";

export type StateSections = { [S in SectionName]: StateSection<S>[] };
type RawCore = { [S in SectionName]: StateSectionCore<S>[] };
type VarbFullnamesToSolveFor = Set<string>;
export type AnalyzerCore = {
  sections: StateSections;
  varbFullNamesToSolveFor: VarbFullnamesToSolveFor;
};

// when you make this have multiple classes, you'll have to change
// how you use Inf.is.fe(feInfo, "hasParent"); Different
// instantiations of Analyzer will have different heads
// then again, main could always be the head.
export default class Analyzer {
  constructor(readonly core: AnalyzerCore) {}
  protected static makeInitialCore(): AnalyzerCore {
    return {
      sections: Analyzer.blankStateSections(),
      varbFullNamesToSolveFor: new Set(),
    };
  }
  get sections() {
    return this.core.sections;
  }
  get varbFullNamesToSolveFor() {
    return this.core.varbFullNamesToSolveFor;
  }
  addVarbsToSolveFor(...varbInfos: FeVarbInfo[]): Analyzer {
    const fullNames = varbInfos.map((info) =>
      StateVarb.feVarbInfoToFullName(info)
    );
    return this.updateAnalyzer({
      varbFullNamesToSolveFor: new Set([
        ...this.varbFullNamesToSolveFor,
        ...fullNames,
      ]),
    });
  }
  getVarbInfosToSolveFor(): FeVarbInfo[] {
    return [...this.varbFullNamesToSolveFor].map((fullName) =>
      StateVarb.fullNameToFeVarbInfo(fullName)
    );
  }

  updateAnalyzer(nextCore: Partial<AnalyzerCore>) {
    return new Analyzer({ ...this.core, ...nextCore });
  }

  static initAnalyzer(options: InitSectionOptions = {}): Analyzer {
    let next = new Analyzer(Analyzer.makeInitialCore());

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

  get rawSections(): RawCore {
    const sectionNames = ObjectKeys(this.sections);
    return sectionNames.reduce((rawCore, sectionName) => {
      const sectionArr = this.sections[sectionName];
      const rawSectionArr = sectionArr.map(
        (section) => section.coreClone
      ) as StateSectionCore<typeof sectionName>[];
      rawCore[sectionName] = rawSectionArr as any;
      return rawCore;
    }, {} as RawCore);
  }

  stringifySections() {
    return JSON.stringify(this.rawSections);
  }
  get meta() {
    return sectionMetas;
  }
  get req() {
    type ThisAnalyzerReqParams<T extends keyof AnalyzerReq> = DropFirst<
      Parameters<AnalyzerReq[T]>
    >;
    type ThisAnalyzerReq = {
      [Prop in keyof AnalyzerReq]: (
        ...params: ThisAnalyzerReqParams<Prop>
      ) => ReturnType<AnalyzerReq[Prop]>;
    };

    const thisAnalyzerReq = Obj.keys(analyzerReq).reduce((next, reqName) => {
      const fn: (
        analyzer: Analyzer,
        ...params: any
      ) => ReturnType<AnalyzerReq[typeof reqName]> = analyzerReq[reqName];
      next[reqName] = (...params: any) => fn.apply({}, [this, ...params]);
      return next;
    }, {} as any) as ThisAnalyzerReq;
    return thisAnalyzerReq;
  }

  get sectionNames() {
    return ObjectKeys(this.sections);
  }
  sectionMeta<SN extends SectionName>(
    sectionName: SN
  ): NextSectionMeta<"fe", SN> {
    return sectionMetas.get(sectionName);
  }
  copy(): Analyzer {
    return new Analyzer(this.core);
  }
  static makeId() {
    return Id.make();
  }
  static blankStateSections(): StateSections {
    const core = ObjectKeys(sectionMetas.raw.fe).reduce((core, sectionName) => {
      core[sectionName] = [];
      return core;
    }, {} as StateSections);
    return core;
  }

  displayName = displayName;
  displayNameVn = displayNameVn;
  displayNameOrNotFound = displayNameOrNotFound;
  displayNameInfo = displayNameInfo;

  newInEntity = newInEntity;

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

  addSectionsAndSolveNext = addSectionsAndSolveNext;
  addSectionsAndSolve = addSectionsAndSolve;
  addSectionAndSolve = addSectionAndSolve;

  loadSectionArrAndSolve = loadSectionArrAndSolve;
  loadSectionArrsAndSolve = loadSectionArrsAndSolve;

  loadRawSectionPack = loadRawSectionPack;

  loadUserAndSolve = loadUserAndSolve;

  resetSectionAndSolve = resetSectionAndSolve;
  sectionArr = sectionArr;
  sectionArrInfos = sectionArrInfos;
  updateSectionArr = updateSectionArr;
  replaceInSectionArr = replaceInSectionArr;
  wipeSectionArrAndSolve = wipeSectionArrAndSolve;
  sectionArrAsOptions = sectionArrAsOptions;

  section = section;
  feSection = feSection;
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

  childSections = childSections;
  descendantFeIds = descendantFeIds;

  eraseSectionAndSolve = eraseSectionAndSolve;
  eraseIndexAndSolve = eraseIndexAndSolve;
  eraseRowIndexAndSolve = eraseRowIndexAndSolve;
  eraseSectionsAndSolve = eraseSectionsAndSolve;

  allChildDbIds = allChildDbIds;
  varbInfosByFocal = varbInfosByFocal;

  findSectionByDbId = findSectionByDbId;
  findSectionByFeId = findSectionByFeId;
  findFeInfo = findFeInfo;
  findSection = findSection;
  findSections = findSections;
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

  sectionPackArr = sectionPackArr;
  sectionPackArrs = sectionPackArrs;
  guestAccessDbSectionPacks = guestAccessDbSectionPacks;

  makeRawSectionPack = makeRawSectionPack;
  makeRawSection = makeRawSection;
  makeRawSections = makeRawSections;
  selfAndDescendantFeIds = selfAndDescendantFeIds;

  pushToIndexStore = pushToIndexStore;
  updateIndexStoreEntry = updateIndexStoreEntry;
  fullStoreEntries = fullStoreEntries;
  fullStoreTitlesAndDbIds = fullStoreTitlesAndDbIds;

  pushToRowIndexStore = pushToRowIndexStore;
  updateRowIndexStoreAndSolve = updateRowIndexStoreAndSolve;
  sortTableRowIdsByColumn = sortTableRowIdsByColumn;

  getOutVarbMap = getOutVarbMap;
  getDagEdgesAndLoneVarbs = getDagEdgesAndLoneVarbs;
  gatherAndSortInfosToSolve = gatherAndSortInfosToSolve;
}
