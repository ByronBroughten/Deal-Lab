import Analyzer from "../../Analyzer";
import {
  FeVarbInfo,
  SpecificSectionInfo,
} from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import array from "../../utils/Arr";
import {
  ChildName,
  rowIndexToTableName,
} from "../SectionMetas/relSectionTypes";
import { Inf, FeInfo } from "../SectionMetas/Info";
import Arr from "../../utils/Arr";
import { SectionName } from "../SectionMetas/SectionName";

export function removeFromParentChildIds(
  this: Analyzer,
  feInfo: FeInfo
): Analyzer {
  const { sectionName } = feInfo;
  if (sectionName === "main") return this;
  const info: FeInfo<"hasParent"> = { ...feInfo, sectionName };

  const parentSection = this.parent(info);
  const nextParent = parentSection.removeChildFeId(info);
  return this.replaceInSectionArr(nextParent);
}
export function removeSectionEntities(
  this: Analyzer,
  feInfo: FeInfo
): Analyzer {
  const { sectionName } = feInfo;
  if (sectionName === "main") return this;
  let next = this;
  const { varbs } = this.section(feInfo);
  for (const [varbName, varb] of Object.entries(varbs)) {
    for (const inEntity of [...varb.inEntities]) {
      next = next.removeInEntity(
        { ...feInfo, sectionName, varbName },
        inEntity
      );
    }
  }
  return next;
}
export function removeSection(this: Analyzer, feInfo: FeInfo): Analyzer {
  const { sectionName, id } = feInfo;
  const nextSectionArr = array.findAndRmClone(
    this.sectionArr(sectionName),
    (section) => section.feId === id
  );
  return this.setSectionArr(sectionName, nextSectionArr);
}
export function eraseOneSection(
  this: Analyzer,
  feInfo: FeInfo,
  rmFromParent: boolean = true
): Analyzer {
  let next = this;
  next = next.removeSectionEntities(feInfo);

  const { sectionName } = feInfo;
  if (sectionName !== "main") {
    if (rmFromParent)
      next = next.removeFromParentChildIds({ ...feInfo, sectionName });
  }

  next = next.removeSection(feInfo);
  return next;
}
export function varbInfosToSolveAfterErase(
  this: Analyzer,
  feInfo: FeInfo | FeInfo[]
): FeVarbInfo[] {
  const nestedVarbInfos = this.nestedFeVarbInfos(feInfo);
  const nestedOutVarbInfos = this.nestedFeOutVarbInfos(feInfo);
  return nestedOutVarbInfos.filter((feInfo) => {
    return !array.objIsIn(feInfo, nestedVarbInfos);
  });
}

export function eraseChildren<
  I extends SpecificSectionInfo,
  C extends ChildName<I["sectionName"]>
>(this: Analyzer, feInfo: I, childName: C): [Analyzer, FeVarbInfo[]] {
  let next = this;
  let infosAffectedByErase: FeVarbInfo[] = [];
  const allAffectedInfos: FeVarbInfo[] = [];
  const childIds = this.childFeIds([feInfo, childName]);
  for (const id of childIds) {
    [next, infosAffectedByErase] = next.eraseSectionAndChildren(
      Inf.fe(childName, id)
    );
    allAffectedInfos.push(...infosAffectedByErase);
  }
  return [next, array.rmDuplicateObjsClone(allAffectedInfos)];
}

export function eraseSectionAndChildren(
  this: Analyzer,
  feInfo: FeInfo
): readonly [Analyzer, FeVarbInfo[]] {
  const feInfosToErase = this.nestedFeInfos(feInfo).reverse(); // erase children first
  const infosAffectedByErase = this.varbInfosToSolveAfterErase(feInfosToErase);

  let next = this;
  const lastIdx = `${array.lastIdx(feInfosToErase)}`;
  for (const [idx, feInfo] of Object.entries(feInfosToErase)) {
    if (idx === lastIdx) next = next.eraseOneSection(feInfo);
    else next = next.eraseOneSection(feInfo, false);
  }

  return [next, infosAffectedByErase];
}
export function eraseSectionAndSolve(
  this: Analyzer,
  info: SpecificSectionInfo
): Analyzer {
  const { feInfo } = this.section(info);
  const [next, infosAffectedByErase] = this.eraseSectionAndChildren(feInfo);
  return next.solveVarbs(infosAffectedByErase);
}
export function deleteIndexAndSolve(
  this: Analyzer,
  sectionName: SectionName<"hasIndexStore">,
  dbId: string
): Analyzer {
  const { indexStoreName } = this.sectionMeta(sectionName);
  const indexInfo = Inf.db(indexStoreName, dbId);
  return this.eraseSectionAndSolve(indexInfo);
}
export function deleteRowIndexAndSolve(
  this: Analyzer,
  sectionName: SectionName<"hasRowIndexStore">,
  dbId: string
): Analyzer {
  let next = this;

  const { indexStoreName } = this.sectionMeta(sectionName);
  const tableName = rowIndexToTableName[indexStoreName];
  const rowIdsVarb = this.section(tableName).varb("rowIds");

  let rowIds = rowIdsVarb.value("stringArray");
  rowIds = Arr.rmFirstValueClone(rowIds, dbId);
  next = next.updateValueDirectly(rowIdsVarb.feVarbInfo, rowIds);
  return next.deleteIndexAndSolve(sectionName, dbId);
}

export function eraseSectionsAndSolve(
  this: Analyzer,
  feInfos: FeInfo[]
): Analyzer {
  let infosAffectedByErase: FeVarbInfo[] = [];
  const [next, allAffectedInfos] = feInfos.reduce(
    ([next, allAffectedInfos], feInfo) => {
      [next, infosAffectedByErase] = next.eraseSectionAndChildren(feInfo);
      return [next, allAffectedInfos.concat(infosAffectedByErase)] as const;
    },
    [this, []] as readonly [Analyzer, FeVarbInfo[]]
  );

  return next.solveVarbs(allAffectedInfos);
}
