import { Obj } from "../../utils/Obj";
import { SimpleSectionName } from "../baseSections";
import { relChild, RelChild, RelChildOptions } from "./relChild";

type RelChildren<RP extends RelChildrenProps> = {
  [K in keyof RP]: RelChild<RP[K][0], RP[K][1]>;
};
type RelChildrenProps = {
  [key: string]: [SimpleSectionName, RelChildOptions?];
};
export function relChildren<RP extends RelChildrenProps>(
  props: RP
): RelChildren<RP> {
  return Obj.keys(props).reduce((children, childName) => {
    (children as any)[childName] = relChild(
      props[childName][0],
      props[childName][1]
    );
    return children;
  }, {} as RelChildren<RP>);
}
