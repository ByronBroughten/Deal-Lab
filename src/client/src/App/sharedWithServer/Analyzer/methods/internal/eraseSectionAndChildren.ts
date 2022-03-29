import Analyzer from "../../../Analyzer";
import Arr from "../../../utils/Arr";
import { FeInfo, Inf } from "../../SectionMetas/Info";
import { ChildName } from "../../SectionMetas/relNameArrs/ChildTypes";
import {
  FeVarbInfo,
  SpecificSectionInfo,
} from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { internal } from "../internal";

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
      next = internal.removeInEntity(
        next,
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
  return analyzer.updateSectionArr(sectionName, nextSectionArr);
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

export function eraseSectionAndChildren(
  analyzer: Analyzer,
  feInfo: FeInfo
): readonly [Analyzer, FeVarbInfo[]] {
  let next = analyzer;

  const feInfosToErase = next.nestedFeInfos(feInfo).reverse(); // erase children first
  const infosAffectedByErase = varbInfosToSolveAfterErase(next, feInfosToErase);

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
  const section = next.section(feInfo);
  const childIds = section.childFeIds(childName);
  for (const id of childIds) {
    [next, infosAffectedByErase] = eraseSectionAndChildren(
      next,
      Inf.fe(childName, id)
    );
    allAffectedInfos.push(...infosAffectedByErase);
  }
  return [next, Arr.rmDuplicateObjsClone(allAffectedInfos)];
}
