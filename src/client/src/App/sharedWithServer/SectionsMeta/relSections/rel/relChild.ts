import { Obj } from "../../../utils/Obj";
import { Spread } from "../../../utils/Obj/merge";
import { StrictPick, StrictPickPartial } from "../../../utils/types";
import { SimpleSectionName } from "../../baseSections";
import { SectionName } from "../../SectionName";

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

export type RelChild<
  SN extends SectionName,
  O extends RelChildOptions | undefined = {}
> = Spread<[DefaultProps, O, { sectionName: SN }]>;

export function relChild<
  SN extends SimpleSectionName,
  O extends RelChildOptions
>(sectionName: SN, options?: O): RelChild<SN, O> {
  return {
    ...defaultProps,
    ...options,
    sectionName,
  } as any;
}

export type GeneralRelChild = {
  sectionName: SimpleSectionName;
};

const defaultProps = makeDefault({});
type DefaultProps = typeof defaultProps;

type OptionsKeys = never;
function makeDefault<O extends StrictPick<GeneralRelChild, OptionsKeys>>(
  options: O
): O {
  return options;
}
type RelChildOptions = StrictPickPartial<GeneralRelChild, OptionsKeys>;
export const relChildS = {
  base: relChild,
};
