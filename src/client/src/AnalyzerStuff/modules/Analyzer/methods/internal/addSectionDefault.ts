import { SelfOrDescendantName } from "../../../../../App/sharedWithServer/SectionsMeta/relSectionTypes/ChildTypes";
import { ParentFeInfo } from "../../../../../App/sharedWithServer/SectionsMeta/relSectionTypes/ParentTypes";
import { SectionName } from "../../../../../App/sharedWithServer/SectionsMeta/SectionName";

type InputDefaultSectionProps<SN extends SectionName> = {
  sectionName: SN;
  parentInfo: ParentFeInfo<SN>;
  feId?: string;
  dbId?: string;
};
type OneDefaultSectionProps<SN extends SectionName> = {
  sectionName: SN;
  parentInfo: ParentFeInfo<SN>;
  feId: string;
  dbId?: string;
};
type SelfAndDescendantDefaultSectionProps<SN extends SectionName> = {
  [S in SelfOrDescendantName<SN, "fe">]: OneDefaultSectionProps<S>;
};
type DefaultSectionProps<SN extends SectionName> =
  SelfAndDescendantDefaultSectionProps<SN>[SelfOrDescendantName<SN, "fe">];

// this will mostly be unnecessary
// export function addSectionDefault<SN extends SectionName>(
//   next: Analyzer,
//   inputProps: InputDefaultSectionProps<SN>
// ): Analyzer {
//   const headProps: OneDefaultSectionProps<SN> = {
//     feId: Id.make(),
//     ...inputProps,
//   };
//   const addSectionPropsArr: AddSectionProps[] = [];
//   const queue: DefaultSectionProps<SN>[] = [];
//   queue.push(headProps as DefaultSectionProps<SN>);
//   while (queue.length > 0) {
//     const queueLength = queue.length;
//     for (let i = 0; i < queueLength; i++) {
//       const sectionProp = queue.shift() as DefaultSectionProps<SN>;
//       const { sectionName, feId } = sectionProp;
//       const childFeIds = next.meta.section(sectionName).emptyChildIds();
//       for (const childName of Obj.keys(childFeIds)) {
//         // check if childName is in saneDefaults
//         // if it is, then load that up.
//         if (
//           next.meta.section(childName as SectionName).get("makeOneOnStartup")
//         ) {
//           const childId = Id.make();
//           childFeIds[childName].push(childId);
//           queue.push({
//             feId: childId,
//             sectionName: childName,
//             parentInfo: InfoS.fe(sectionName, feId) as ParentFeInfo<typeof childName>,
//           } as DefaultSectionProps<SN>);
//         }
//       }
//       addSectionPropsArr.push({
//         ...sectionProp,
//         childFeIds,
//       } as AddSectionProps);
//     }
//   }
//   return next.addSectionsAndSolve(addSectionPropsArr);
// }
