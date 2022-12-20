import { FeVarbInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { SetterVarb } from "../StateSetters/SetterVarb";
import { useSetterSectionsProps } from "./useSetterSectionsProps";

export function useSetterVarb<SN extends SectionName>(
  varbInfo: FeVarbInfo<SN>
): SetterVarb<SN> {
  const moreProps = useSetterSectionsProps();
  const setterVarb = new SetterVarb({
    ...varbInfo,
    ...moreProps,
  });
  return setterVarb;
}
