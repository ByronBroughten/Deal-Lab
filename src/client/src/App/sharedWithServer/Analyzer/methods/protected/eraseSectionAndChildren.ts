import Arr from "../../../utils/Arr";
import { FeInfo, Inf } from "../../SectionMetas/Info";
import {
  FeVarbInfo,
  SpecificSectionInfo,
} from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { ChildName } from "../../SectionMetas/relSectionTypes";
import Analyzer from "./../../../Analyzer";

function removeFromParentChildIds(
  analyzer: Analyzer,
  feInfo: FeInfo
): Analyzer {
  const { sectionName } = feInfo;
  if (sectionName === "main") return analyzer;
  const info: FeInfo<"hasParent"> = { ...feInfo, sectionName };

  const parentSection = analyzer.parent(info);
  const nextParent = parentSection.removeChildFeId(info);
  return analyzer.replaceInSectionArr(nextParent);
}

function removeSectionEntities(analyzer: Analyzer, feInfo: FeInfo): Analyzer {
  let next = analyzer;
  const { sectionName } = feInfo;
  if (sectionName === "main") return next;
  const { varbs } = next.section(feInfo);
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

function removeSection(analyzer: Analyzer, feInfo: FeInfo): Analyzer {
  const { sectionName, id } = feInfo;
  const nextSectionArr = Arr.findAndRmClone(
    analyzer.sectionArr(sectionName),
    (section) => section.feId === id
  );
  return analyzer.setSectionArr(sectionName, nextSectionArr);
}

function eraseOneSection(
  analyzer: Analyzer,
  feInfo: FeInfo,
  rmFromParent: boolean = true
): Analyzer {
  let next = analyzer;
  next = removeSectionEntities(next, feInfo);

  const { sectionName } = feInfo;
  if (sectionName !== "main") {
    if (rmFromParent)
      next = removeFromParentChildIds(next, { ...feInfo, sectionName });
  }

  next = removeSection(next, feInfo);
  return next;
}

function varbInfosToSolveAfterErase(
  analyzer: Analyzer,
  feInfo: FeInfo | FeInfo[]
): FeVarbInfo[] {
  const nestedVarbInfos = analyzer.nestedFeVarbInfos(feInfo);
  const nestedOutVarbInfos = analyzer.nestedFeOutVarbInfos(feInfo);
  return nestedOutVarbInfos.filter((feInfo) => {
    return !Arr.objIsIn(feInfo, nestedVarbInfos);
  });
}

export function eraseSectionAndChildren(
  this: Analyzer,
  feInfo: FeInfo
): readonly [Analyzer, FeVarbInfo[]] {
  const feInfosToErase = this.nestedFeInfos(feInfo).reverse(); // erase children first
  const infosAffectedByErase = varbInfosToSolveAfterErase(this, feInfosToErase);

  let next = this;
  const lastIdx = `${Arr.lastIdx(feInfosToErase)}`;
  for (const [idx, feInfo] of Object.entries(feInfosToErase)) {
    if (idx === lastIdx) next = eraseOneSection(next, feInfo);
    else next = eraseOneSection(next, feInfo, false);
  }

  return [next, infosAffectedByErase];
}

export function eraseChildren<
  I extends SpecificSectionInfo,
  C extends ChildName<I["sectionName"]>
>(analyzer: Analyzer, feInfo: I, childName: C): [Analyzer, FeVarbInfo[]] {
  let next = analyzer;
  let infosAffectedByErase: FeVarbInfo[] = [];
  const allAffectedInfos: FeVarbInfo[] = [];
  const childIds = next.childFeIds([feInfo, childName]);
  for (const id of childIds) {
    [next, infosAffectedByErase] = next.eraseSectionAndChildren(
      Inf.fe(childName, id)
    );
    allAffectedInfos.push(...infosAffectedByErase);
  }
  return [next, Arr.rmDuplicateObjsClone(allAffectedInfos)];
}
