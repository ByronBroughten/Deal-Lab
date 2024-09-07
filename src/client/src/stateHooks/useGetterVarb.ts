import { useSectionsContext } from "../ContextsAndProviders/useMainState";
import { GetterSectionsBase } from "../sharedWithServer/StateGetters/Bases/GetterSectionsBase";
import { GetterVarbProps } from "../sharedWithServer/StateGetters/Bases/GetterVarbBase";
import { GetterVarb } from "../sharedWithServer/StateGetters/GetterVarb";
import { VarbName } from "../sharedWithServer/stateSchemas/derivedFromBaseSchemas/baseSectionsVarbsTypes";
import { SectionNameByType } from "../sharedWithServer/stateSchemas/SectionNameByType";
import { StrictOmit } from "../sharedWithServer/utils/types";

export interface UseGetterVarbProps<SN extends SectionNameByType>
  extends StrictOmit<GetterVarbProps<SN>, "sectionsShare"> {}

export function useGetterVarb<SN extends SectionNameByType>(
  props: UseGetterVarbProps<SN>
): GetterVarb<SN> {
  const sections = useSectionsContext();
  return new GetterVarb({
    ...props,
    ...GetterSectionsBase.initProps({ sections }),
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
  const sections = useSectionsContext();
  return new GetterVarb({
    ...props,
    varbName: varbName as string,
    ...GetterSectionsBase.initProps({ sections }),
  });
}
