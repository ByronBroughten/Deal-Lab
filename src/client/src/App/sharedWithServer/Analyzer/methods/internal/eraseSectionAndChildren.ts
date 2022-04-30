import Analyzer from "../../../Analyzer";
import { FeInfo, InfoS } from "../../../SectionMetas/Info";
import {
  FeVarbInfo,
  SpecificSectionInfo,
} from "../../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { ChildName } from "../../../SectionMetas/relSectionTypes/ChildTypes";
import Arr from "../../../utils/Arr";
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
  return analyzer.updateSection(nextParent);
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
  next: Analyzer,
  feInfo: FeInfo
): Analyzer {
  const feInfosToErase = next.nestedFeInfos(feInfo).reverse(); // erase children first
  const infosAffectedByErase = varbInfosToSolveAfterErase(next, feInfosToErase);

  const lastIdx = `${Arr.lastIdx(feInfosToErase)}`;
  for (const [idx, feInfo] of Object.entries(feInfosToErase)) {
    if (idx === lastIdx) next = eraseOneSection(next, feInfo);
    else next = eraseOneSection(next, feInfo, false);
  }

  return next.addVarbsToSolveFor(...infosAffectedByErase);
}

export function eraseChildren<
  I extends SpecificSectionInfo,
  C extends ChildName<I["sectionName"]>
>(this: Analyzer, feInfo: I, childName: C): Analyzer {
  let next = this;
  const section = next.section(feInfo);
  const childIds = section.childFeIds(childName);
  for (const id of childIds) {
    next = eraseSectionAndChildren(next, InfoS.fe(childName, id));
  }
  return next;
}
