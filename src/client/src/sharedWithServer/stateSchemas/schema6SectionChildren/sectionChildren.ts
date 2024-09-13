import { Obj } from "../../utils/Obj";
import { SectionName } from "../schema2SectionNames";
import {
  ChildSection,
  GeneralChildSection,
  sectionChild,
} from "./sectionChild";

type ChildrenSections<RP extends ChildrenSectionsProps> = {
  [K in keyof RP]: ChildSection<RP[K]>;
};
type ChildrenSectionsProps = {
  [key: string]: SectionName;
};
export function sectionChildren<RP extends ChildrenSectionsProps>(
  props: RP
): ChildrenSections<RP> {
  return Obj.keys(props).reduce((children, childName) => {
    (children as any)[childName] = sectionChild(props[childName]);
    return children;
  }, {} as ChildrenSections<RP>);
}

export type GeneralChildrenSections = {
  [childName: string]: GeneralChildSection;
};
