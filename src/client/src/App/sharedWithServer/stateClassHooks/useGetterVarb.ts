import { VarbName } from "../SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { GetterSectionsBase } from "../StateGetters/Bases/GetterSectionsBase";
import { GetterVarbProps } from "../StateGetters/Bases/GetterVarbBase";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { StrictOmit } from "../utils/types";
import { useFullSectionsContext } from "./useFullSectionsContext";

export interface UseGetterVarbProps<SN extends SectionNameByType>
  extends StrictOmit<GetterVarbProps<SN>, "sectionsShare" | "contextShare"> {}

export function useGetterVarb<SN extends SectionNameByType>(
  props: UseGetterVarbProps<SN>
): GetterVarb<SN> {
  const fullContext = useFullSectionsContext();
  return new GetterVarb({
    ...props,
    ...GetterSectionsBase.initProps(fullContext),
  });
}

export interface UseGetterVarbNextProps<SN extends SectionNameByType>
  extends StrictOmit<
    GetterVarbProps<SN>,
    "sectionsShare" | "contextShare" | "varbName"
  > {
  varbName: VarbName<SN>;
}
export function useGetterVarbNext<SN extends SectionNameByType>({
  varbName,
  ...props
}: UseGetterVarbNextProps<SN>): GetterVarb<SN> {
  const fullContext = useFullSectionsContext();
  return new GetterVarb({
    ...props,
    varbName: varbName as string,
    ...GetterSectionsBase.initProps(fullContext),
  });
}
