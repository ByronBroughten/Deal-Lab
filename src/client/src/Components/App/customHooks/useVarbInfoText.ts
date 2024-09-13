import { useGetterVarb } from "../../../modules/stateHooks/useGetterVarb";
import { VarbInfoTextProps } from "../../../modules/varbLabels/varbLabels";
import { FeVarbInfo } from "../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { SectionName } from "../../../sharedWithServer/stateSchemas/schema2SectionNames";

export function useVarbInfoText<SN extends SectionName>(
  varbInfo: FeVarbInfo<SN>
): VarbInfoTextProps {
  const varb = useGetterVarb(varbInfo);
  return varb.varbLabels;
}
