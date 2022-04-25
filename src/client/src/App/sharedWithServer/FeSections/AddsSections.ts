import { AddSectionProps } from "../Analyzer/methods/internal/addSections/addSectionsTypes";
import { SimpleSectionName } from "../SectionMetas/baseSections";
import { FeInfo, Inf } from "../SectionMetas/Info";
import FeSection from "./FeSection";
import { UpdatesCoreAbstract } from "./UpdatesCoreAbstract";

export class AddsSections<
  SN extends SimpleSectionName,
  AU extends UpdatesCoreAbstract<SN, any>
> {
  addSections(this: AU, parentFirstPropsList: AddSectionProps[]): AU {
    let next = this;
    for (const props of parentFirstPropsList as AddSectionProps[]) {
      next = initOneSection(next as any, props);
    }
    return next;
  }
}

function initOneSection<AU extends UpdatesCoreAbstract<SimpleSectionName, any>>(
  next: AU,
  { idx, ...props }: AddSectionProps
): AU {
  next = pushSectionToList(next, props);
  const { feInfo, sectionName } = next.list(props.sectionName).last;
  if (Inf.is.fe(feInfo, "hasParent") && sectionName !== next.sectionName) {
    next = addToParentChildIds(next, feInfo, idx);
  }
  return next;
}

function pushSectionToList<
  AU extends UpdatesCoreAbstract<SimpleSectionName, any>
>(next: AU, props: AddSectionProps): AU {
  const { sectionName, parentFinder } = props;
  return next.updateList(
    sectionName,
    next.list(sectionName).push(
      FeSection.initNext({
        parentInfo: next.parentFinderToInfo(parentFinder as any),
        ...props,
      })
    )
  );
}

function addToParentChildIds<
  AU extends UpdatesCoreAbstract<SimpleSectionName, any>
>(next: AU, feInfo: FeInfo<"hasParent">, idx?: number): AU {
  const parentSection = next.parent(feInfo);
  const nextParent = parentSection.addChildFeId(feInfo, idx);
  return next.replaceInList(nextParent);
}

//   const { feInfo } = next.lastSection(sectionName);
//   if (sectionNameS.is(sectionName, "hasParent"))
//     next = addToParentChildIds(next, feInfo, idx);
//   return next;
// }

// function finalizeNewSections(next: Analyzer, newFeInfos: FeInfo[]) {
//   next = initOutEntities(next, newFeInfos);
//   const varbInfosToSolveFor: FeVarbInfo[] = next.nestedFeVarbInfos(newFeInfos);
//   return next.addVarbsToSolveFor(...varbInfosToSolveFor);
// }

// function initOutEntities(next: Analyzer, newFeInfos: FeInfo[]) {
//   for (const feInfo of newFeInfos) {
//     next = addOutEntitiesForSectionInVarbs(next, feInfo);
//   }
//   return next;
// }

// function addOutEntitiesForSectionInVarbs(
//   analyzer: Analyzer,
//   feInfo: FeInfo
// ): Analyzer {
//   if (!Inf.is.fe(feInfo, "hasVarb")) return analyzer;
//   let next = analyzer;
//   const { varbs } = next.section(feInfo);
//   for (const [varbName, varb] of Object.entries(varbs)) {
//     for (const inEntity of varb.inEntities) {
//       const outEntity = { ...feInfo, varbName, entityId: inEntity.entityId };
//       next = internal.addOutEntity(next, inEntity, outEntity);
//     }
//   }
//   return next;
// }
