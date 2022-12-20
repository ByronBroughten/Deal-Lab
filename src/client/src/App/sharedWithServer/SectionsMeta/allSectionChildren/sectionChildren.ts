import { Obj } from "../../utils/Obj";
import { SectionName } from "../SectionName";
import {
  ChildSection,
  ChildSectionOptions,
  GeneralChildSection,
  sectionChild,
} from "./sectionChild";

type ChildrenSections<RP extends ChildrenSectionsProps> = {
  [K in keyof RP]: ChildSection<RP[K][0], RP[K][1]>;
};
type ChildrenSectionsProps = {
  [key: string]: readonly [SectionName, ChildSectionOptions?];
};
export function sectionChildren<RP extends ChildrenSectionsProps>(
  props: RP
): ChildrenSections<RP> {
  return Obj.keys(props).reduce((children, childName) => {
    (children as any)[childName] = sectionChild(
      props[childName][0],
      props[childName][1]
    );
    return children;
  }, {} as ChildrenSections<RP>);
}

export type GeneralChildrenSections = {
  [childName: string]: GeneralChildSection;
};
