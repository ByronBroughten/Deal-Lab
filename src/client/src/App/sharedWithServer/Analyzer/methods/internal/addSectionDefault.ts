import Analyzer from "../../../Analyzer";
import { Id } from "../../../SectionMetas/baseSections/id";
import { Inf } from "../../../SectionMetas/Info";
import { SelfOrDescendantName } from "../../../SectionMetas/relSectionTypes/ChildTypes";
import { ParentFinder } from "../../../SectionMetas/relSectionTypes/ParentTypes";
import { SectionName } from "../../../SectionMetas/SectionName";
import { Obj } from "../../../utils/Obj";
import { AddSectionProps } from "./addSections/addSectionsTypes";
// dbVarbs?: DbVarbs;
// idx?: number;
// childFeIds?: OneChildIdArrs<SN, "fe">;
// sectionName: SN;
// parentFinder: ParentFinder<SN>;
// feId?: string;
// dbId?: string;
type InputDefaultSectionProps<SN extends SectionName> = {
  sectionName: SN;
  parentFinder: ParentFinder<SN>;
  feId?: string;
  dbId?: string;
};
type OneDefaultSectionProps<SN extends SectionName> = {
  sectionName: SN;
  parentFinder: ParentFinder<SN>;
  feId: string;
  dbId?: string;
};
type SelfAndDescendantDefaultSectionProps<SN extends SectionName> = {
  [S in SelfOrDescendantName<SN, "fe">]: OneDefaultSectionProps<S>;
};
type DefaultSectionProps<SN extends SectionName> =
  SelfAndDescendantDefaultSectionProps<SN>[SelfOrDescendantName<SN, "fe">];

// This just needs to be able to load from sane defaults
// But do I need this right now? I don't think I do.
// I almost might as well finish it, though.

export function addSectionDefault<SN extends SectionName>(
  next: Analyzer,
  inputProps: InputDefaultSectionProps<SN>
): Analyzer {
  const headProps: OneDefaultSectionProps<SN> = {
    feId: Id.make(),
    ...inputProps,
  };
  const addSectionPropsArr: AddSectionProps[] = [];
  const queue: DefaultSectionProps<SN>[] = [];
  queue.push(headProps as DefaultSectionProps<SN>);
  while (queue.length > 0) {
    const queueLength = queue.length;
    for (let i = 0; i < queueLength; i++) {
      const sectionProp = queue.shift() as DefaultSectionProps<SN>;
      const { sectionName, feId } = sectionProp;
      const childFeIds = next.meta.section(sectionName).emptyChildIds();
      for (const childName of Obj.keys(childFeIds)) {
        // check if childName is in saneDefaults
        // if it is, then load that up.
        if (
          next.meta.section(childName as SectionName).get("makeOneOnStartup")
        ) {
          const childId = Id.make();
          childFeIds[childName].push(childId);
          queue.push({
            feId: childId,
            sectionName: childName,
            parentFinder: Inf.fe(sectionName, feId),
          } as DefaultSectionProps<SN>);
        }
      }
      addSectionPropsArr.push({
        ...sectionProp,
        childFeIds,
      } as AddSectionProps);
    }
  }
  return next.addSectionsAndSolve(addSectionPropsArr);
}
