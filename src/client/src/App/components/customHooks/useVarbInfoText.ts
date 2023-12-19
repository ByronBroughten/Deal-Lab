import { FeVarbInfo } from "../../../sharedWithServer/SectionInfo/FeInfo";
import { SectionName } from "../../../sharedWithServer/sectionVarbsConfig/SectionName";
import { VarbInfoTextProps } from "../../../varbLabels";
import { useGetterVarb } from "../../stateClassHooks/useGetterVarb";

export function useVarbInfoText<SN extends SectionName>(
  varbInfo: FeVarbInfo<SN>
): VarbInfoTextProps {
  const varb = useGetterVarb(varbInfo);
  return varb.varbLabels;
}
