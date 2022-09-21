import { Merge } from "../../utils/Obj/merge";
import { StrictPick, StrictPickPartial } from "../../utils/types";
import { SimpleSectionName } from "../baseSectionsVarbs";
import { SectionName } from "../SectionName";

export function childSection<
  SN extends SimpleSectionName,
  O extends ChildSectionOptions
>(sectionName: SN, options?: O): ChildSection<SN, O> {
  return {
    ...defaultProps,
    ...options,
    sectionName,
  } as any;
}

export type ChildSectionOptions = StrictPickPartial<
  GeneralChildSection,
  OptionsKeys
>;

type SelectedOptions<O extends ChildSectionOptions | undefined = {}> = Merge<
  DefaultProps,
  O
>;
export type ChildSection<
  SN extends SectionName,
  O extends ChildSectionOptions | undefined = {}
> = SelectedOptions<O> & { sectionName: SN };

function _test() {
  const _test1: ChildSection<"property">["sectionName"] = "property";
  // @ts-expect-error
  const _test2: ChildSection<"property">["sectionName"] = "loan";
}

export type GeneralChildSection = {
  sectionName: SimpleSectionName;
  // dbStoreForTableRow:
};

const defaultProps = makeDefault({});
type DefaultProps = typeof defaultProps;

type OptionsKeys = never;
function makeDefault<O extends StrictPick<GeneralChildSection, OptionsKeys>>(
  options: O
): O {
  return options;
}
