import { Spread } from "../../utils/Obj/merge";
import { StrictPick, StrictPickPartial } from "../../utils/types";
import { SimpleSectionName } from "../baseSections";
import { SectionName } from "../SectionName";

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

export type RelChildOptions = StrictPickPartial<GeneralRelChild, OptionsKeys>;

export type RelChild<
  SN extends SectionName,
  O extends RelChildOptions | undefined = {}
> = Spread<[DefaultProps, O, { sectionName: SN }]>;

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
