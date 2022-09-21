import { Obj } from "../../utils/Obj";
import { SectionName } from "../SectionName";
import {
  childSection,
  ChildSection,
  ChildSectionOptions,
  GeneralChildSection,
} from "./childSection";

type ChildrenSections<RP extends ChildrenSectionsProps> = {
  [K in keyof RP]: ChildSection<RP[K][0], RP[K][1]>;
};
type ChildrenSectionsProps = {
  [key: string]: readonly [SectionName, ChildSectionOptions?];
};
export function childrenSections<RP extends ChildrenSectionsProps>(
  props: RP
): ChildrenSections<RP> {
  return Obj.keys(props).reduce((children, childName) => {
    (children as any)[childName] = childSection(
      props[childName][0],
      props[childName][1]
    );
    return children;
  }, {} as ChildrenSections<RP>);
}

export type GeneralChildrenSections = {
  [childName: string]: GeneralChildSection;
};
