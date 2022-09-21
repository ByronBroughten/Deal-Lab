import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { GetterVarbProps } from "../StateGetters/Bases/GetterVarbBase";
import { SetterVarb } from "../StateSetters/SetterVarb";
import { StrictOmit } from "../utils/types";
import { useSetterSectionsProps } from "./useSetterSectionsProps";

interface UseSetterVarbProps<SN extends SectionNameByType>
  extends StrictOmit<GetterVarbProps<SN>, "sectionsShare"> {}

export function useSetterVarb<SN extends SectionNameByType>(
  varbInfo: UseSetterVarbProps<SN>
): SetterVarb<SN> {
  const moreProps = useSetterSectionsProps();
  const setterVarb = new SetterVarb({
    ...varbInfo,
    ...moreProps,
  });
  return setterVarb;
}
