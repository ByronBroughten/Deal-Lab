import { FeVarbInfo } from "../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { SectionName } from "../../../sharedWithServer/stateSchemas/SectionName";
import { VarbInfoTextProps } from "../../../varbLabels/varbLabels";
import { useGetterVarb } from "../../stateClassHooks/useGetterVarb";

export function useVarbInfoText<SN extends SectionName>(
  varbInfo: FeVarbInfo<SN>
): VarbInfoTextProps {
  const varb = useGetterVarb(varbInfo);
  return varb.varbLabels;
}
