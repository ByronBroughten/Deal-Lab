import { Merge } from "../../utils/Obj/merge";
import { ChildName } from "../sectionChildrenDerived/ChildName";
import { ChildSectionNameName } from "../sectionChildrenDerived/ChildSectionName";
import { SectionName } from "../SectionName";

export function sectionTraits<
  SN extends SectionName,
  O extends Options<SN> = {}
>(options?: O): SectionTraits<SN, O> {
  return {
    ...defaultProps,
    ...options,
  } as any;
}
export type SectionTraits<
  SN extends SectionName,
  O extends Options<SN> = {}
> = Merge<DefaultProps, O>;

type Options<SN extends SectionName> = Partial<GenericSectionTraits<SN>>;

export interface GenericSectionTraits<SN extends SectionName>
  extends GeneralSectionTraits {
  varbListItem: ChildName<SN> | null;
}

export interface GeneralSectionTraits {
  displayName: string;
  varbListItem: string | null;
  compareTableName: ChildSectionNameName<"feUser", "compareTable"> | null;
  feIndexStoreName: ChildName<"feUser"> | null;
  dbIndexStoreName: ChildName<"dbStore"> | null;
}

export type SectionTraitName = keyof GeneralSectionTraits;

function makeDefault<G extends GeneralSectionTraits>(options: G): G {
  return options;
}

type DefaultProps = typeof defaultProps;
const defaultProps = makeDefault({
  displayName: "Unnamed Section",
  varbListItem: null,
  compareTableName: null,
  feIndexStoreName: null,
  dbIndexStoreName: null,
});
