import { VarbName } from "../SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { GetterSectionsBase } from "../StateGetters/Bases/GetterSectionsBase";
import { GetterVarbProps } from "../StateGetters/Bases/GetterVarbBase";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { StrictOmit } from "../utils/types";
import { useSectionsContext } from "./useSections";

export interface UseGetterVarbProps<SN extends SectionNameByType>
  extends StrictOmit<GetterVarbProps<SN>, "sectionsShare"> {}

export function useGetterVarb<SN extends SectionNameByType>(
  props: UseGetterVarbProps<SN>
): GetterVarb<SN> {
  const context = useSectionsContext();
  return new GetterVarb({
    ...props,
    ...GetterSectionsBase.initProps(context),
  });
}

export interface UseGetterVarbNextProps<SN extends SectionNameByType>
  extends StrictOmit<GetterVarbProps<SN>, "sectionsShare" | "varbName"> {
  varbName: VarbName<SN>;
}
export function useGetterVarbNext<SN extends SectionNameByType>({
  varbName,
  ...props
}: UseGetterVarbNextProps<SN>): GetterVarb<SN> {
  const context = useSectionsContext();
  return new GetterVarb({
    ...props,
    varbName: varbName as string,
    ...GetterSectionsBase.initProps(context),
  });
}
