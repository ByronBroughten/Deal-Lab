import { FeVarbInfo } from "../../sharedWithServer/Analyzer/SectionMetas/relSections/rel/relVarbInfoTypes";
import StateVarb from "../../sharedWithServer/Analyzer/StateSection/StateVarb";
import LabeledVarb from "./LabeledVarb";

type Props = {
  feVarbInfo: FeVarbInfo;
  parenthInfo?: FeVarbInfo;
  displayLabel?: string;
};
export function LabeledVarbSimple({ feVarbInfo, ...rest }: Props) {
  const id = StateVarb.feVarbInfoToFullName(feVarbInfo);
  return <LabeledVarb {...{ id, feVarbInfo, ...rest }} />;
}
