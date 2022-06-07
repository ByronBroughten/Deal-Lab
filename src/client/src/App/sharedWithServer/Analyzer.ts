import {
  addSectionAndSolve,
  addSectionsAndSolve,
  InitSectionOptions,
} from "./Analyzer/methods/addSectionAndSolve";
import { addSectionsAndSolveNext } from "./Analyzer/methods/addSectionsAndSolveNext";
import { copySection } from "./Analyzer/methods/copySection";
import {
  directUpdateAndSolve,
  loadValueFromVarb,
  updateSectionValuesAndSolve,
} from "./Analyzer/methods/directUpdateAndSolve";
import {
  eraseSectionAndSolve,
  eraseSectionsAndSolve,
} from "./Analyzer/methods/eraseSectionAndSolve";
import {
  allChildDbIds,
  childSections,
  descendantFeIds,
  selfAndDescendantFeIds,
} from "./Analyzer/methods/get/childArrs";
import {
  dbEntry,
  dbEntryArr,
  dbEntryArrs,
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
  findSections,
  findSectionsByFocal,
  findVarb,
  findVarbByFocal,
  findVarbInfosByFocal,
  findVarbsByFocal,
} from "./Analyzer/methods/get/find";
import { newInEntity } from "./Analyzer/methods/get/inEntity";
import { varbInfosByFocal } from "./Analyzer/methods/get/info";
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
  feSection,
  firstSection,
  hasSection,
  lastSection,
  section,
  sectionByFocal,
  sectionNotFound,
  sectionOutFeVarbInfos,
  sectionsByFocal,
  singleSection,
  updateSection,
} from "./Analyzer/methods/get/section";
import {
  sectionArr,
  sectionArrAsOptions,
  sectionArrInfos,
} from "./Analyzer/methods/get/sectionArr";
import {
  makeRawSection,
  makeRawSectionPack,
  makeRawSections,
} from "./Analyzer/methods/get/sectionPack";
import {
  guestAccessDbSectionPacks,
  makeRawSectionPackArr,
  makeRawSectionPackArrs,
} from "./Analyzer/methods/get/sectionPackArrs";
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
import { eraseChildren } from "./Analyzer/methods/internal/eraseSectionAndChildren";
import { resetSectionAndChildDbIds } from "./Analyzer/methods/internal/resetSectionAndChildDbIds";
import { loadSectionArrAndSolve } from "./Analyzer/methods/loadSectionFromEntry";
import { loadRawSectionPack } from "./Analyzer/methods/loadSectionPack";
import { loadUserAndSolve } from "./Analyzer/methods/loadUserAndSolve";
import { replaceSectionAndSolve } from "./Analyzer/methods/replaceSectionAndSolve";
import { resetSectionAndSolve } from "./Analyzer/methods/resetSectionAndSolve";
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
import { sortTableRowIdsByColumnNext } from "./Analyzer/methods/tableNext";
import {
  updateSectionArr,
  wipeSectionArrAndSolve,
} from "./Analyzer/methods/updateSectionArr";
import StateSection, { StateSectionCore } from "./Analyzer/StateSection";
import StateVarb from "./Analyzer/StateSection/StateVarb";
import { sectionMetas } from "./SectionsMeta";
import { Id } from "./SectionsMeta/baseSections/id";
import { SectionFinder } from "./SectionsMeta/baseSectionTypes";
import { noParentFeInfo } from "./SectionsMeta/Info";
import {
  FeNameInfo,
  FeVarbInfo,
} from "./SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionMeta } from "./SectionsMeta/SectionMeta";
import { SectionName } from "./SectionsMeta/SectionName";
import { Obj } from "./utils/Obj";

type StateSections = { [SN in SectionName]: StateSection<SN>[] };
type RawCore = { [SN in SectionName]: StateSectionCore<SN>[] };
type VarbFullnamesToSolveFor = Set<string>;
export type AnalyzerCore = {
  sections: StateSections;
  varbIdsToSolveFor: VarbFullnamesToSolveFor;
};

export default class Analyzer {
  constructor(readonly core: AnalyzerCore) {}
  protected static makeInitialCore(): AnalyzerCore {
    return {
      sections: Analyzer.blankStateSections(),
      varbIdsToSolveFor: new Set(),
    };
  }
  get sections() {
    return this.core.sections;
  }
  sectionInfo<SN extends SectionName>(finder: SectionFinder<SN>) {
    return this.section(finder).feInfo as FeNameInfo<SN>;
  }
  get varbIdsToSolveFor() {
    return this.core.varbIdsToSolveFor;
  }
  addVarbsToSolveFor(...varbInfos: FeVarbInfo[]): Analyzer {
    const fullNames = varbInfos.map((info) =>
      StateVarb.feVarbInfoToVarbId(info)
    );
    return this.updateAnalyzer({
      varbIdsToSolveFor: new Set([...this.varbIdsToSolveFor, ...fullNames]),
    });
  }
  getVarbInfosToSolveFor(): FeVarbInfo[] {
    return [...this.varbIdsToSolveFor].map((fullName) =>
      StateVarb.varbIdToFeVarbInfo(fullName)
    );
  }

  updateAnalyzer(nextCore: Partial<AnalyzerCore>): Analyzer {
    return new Analyzer({ ...this.core, ...nextCore });
  }

  static initAnalyzer(options: InitSectionOptions = {}): Analyzer {
    let next = new Analyzer(Analyzer.makeInitialCore());

    next = next.addSectionAndSolve("main", noParentFeInfo, {
      ...options,
      initFromDefault: false,
      // default section stores are created, to be used momentarily
    });
    next = next.solveAllActiveVarbs();
    return next;
  }

  get rawSections(): RawCore {
    const sectionNames = Obj.keys(this.sections);
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
  get sectionNames() {
    return Obj.keys(this.sections);
  }
  sectionMeta<SN extends SectionName>(sectionName: SN): SectionMeta<"fe", SN> {
    return sectionMetas.get(sectionName);
  }
  copy(): Analyzer {
    return new Analyzer(this.core);
  }
  static makeId() {
    return Id.make();
  }
  static blankStateSections(): StateSections {
    const core = Obj.keys(sectionMetas.raw.fe).reduce((core, sectionName) => {
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

  copySection = copySection;

  addSectionsAndSolveNext = addSectionsAndSolveNext;
  addSectionsAndSolve = addSectionsAndSolve;
  addSectionAndSolve = addSectionAndSolve;

  loadSectionArrAndSolve = loadSectionArrAndSolve;

  loadRawSectionPack = loadRawSectionPack;

  loadUserAndSolve = loadUserAndSolve;

  replaceSectionAndSolve = replaceSectionAndSolve;
  resetSectionAndSolve = resetSectionAndSolve;
  resetSectionAndChildDbIds = resetSectionAndChildDbIds;

  sectionArr = sectionArr;
  sectionArrInfos = sectionArrInfos;
  updateSectionArr = updateSectionArr;

  wipeSectionArrAndSolve = wipeSectionArrAndSolve;
  sectionArrAsOptions = sectionArrAsOptions;

  section = section;
  updateSection = updateSection;
  feSection = feSection;
  hasSection = hasSection;

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
  eraseSectionsAndSolve = eraseSectionsAndSolve;
  eraseChildren = eraseChildren;

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
  dbEntryArr = dbEntryArr;
  dbEntryArrs = dbEntryArrs;

  guestAccessDbSectionPacks = guestAccessDbSectionPacks;

  makeRawSectionPack = makeRawSectionPack;

  makeRawSectionPackArrs = makeRawSectionPackArrs;
  makeRawSectionPackArr = makeRawSectionPackArr;
  makeRawSection = makeRawSection;
  makeRawSections = makeRawSections;
  selfAndDescendantFeIds = selfAndDescendantFeIds;

  sortTableRowIdsByColumnNext = sortTableRowIdsByColumnNext;

  getOutVarbMap = getOutVarbMap;
  getDagEdgesAndLoneVarbs = getDagEdgesAndLoneVarbs;
  gatherAndSortInfosToSolve = gatherAndSortInfosToSolve;
}
