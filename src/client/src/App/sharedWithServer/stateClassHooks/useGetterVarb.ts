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
